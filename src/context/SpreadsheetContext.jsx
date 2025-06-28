import React, { createContext, useState, useContext, useCallback, useEffect } from 'react';
import { useEditCell, useImportWorkbook, useExportWorkbook, useNl2Formula, useSheets, useSheet } from '../hooks/useSpreadsheetQueries';
import { importWorkbookFromAPI, fetchWorkbookById } from '../services/workbookService';
import { useQueryClient } from '@tanstack/react-query';
import { api } from '../services/api';

// Helper function to convert number to column letter (0 -> A, 1 -> B, etc.)
const numToCol = (num) => {
  let result = '';
  num = num + 1; // 1-based index
  while (num > 0) {
    const remainder = (num - 1) % 26;
    result = String.fromCharCode(65 + remainder) + result;
    num = Math.floor((num - 1) / 26);
  }
  return result;
};

// Helper function to convert column letter to number (A -> 0, B -> 1, etc.)
const colToNum = (col) => {
  let result = 0;
  for (let i = 0; i < col.length; i++) {
    result = result * 26 + (col.charCodeAt(i) - 64);
  }
  return result - 1; // 0-based index
};

// Generate columns array dynamically
const generateColumns = (count) => {
  const columns = Array.from({ length: count }, (_, i) => numToCol(i));
  console.log('Generated columns:', { count, columns: columns.slice(-10) }); // Show last 10 columns
  return columns;
};

// Calculate initial column count based on typical viewport
const calculateInitialColumns = () => {
  // For a typical desktop screen (1200px wide), we can fit about 8-10 columns
  // For mobile (375px wide), we can fit about 2-3 columns
  // We'll start with a reasonable default and let the Grid component adjust
  return 20; // Start with 20 columns for faster horizontal scroll
};

// Initial spreadsheet data
const initialData = {
  sheets: [
    {
      id: 'sheet1',
      name: 'Sheet1',
      cells: {},
      columns: generateColumns(calculateInitialColumns()),
      rows: 100,
      activeCell: 'A1',
    }
  ],
  activeSheet: 'sheet1',
};

const SpreadsheetContext = createContext(null);

export const SpreadsheetProvider = ({ children }) => {
  const [spreadsheetData, setSpreadsheetData] = useState(initialData);
  const [selectedCell, setSelectedCell] = useState({ col: 'A', row: 1 });
  const [activeFormula, setActiveFormula] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [updateQueue, setUpdateQueue] = useState({});
  const [zoom, setZoom] = useState(100);
  const [visibleColumns, setVisibleColumns] = useState(calculateInitialColumns());
  const [columnWidths, setColumnWidths] = useState({});

  // React Query hooks
  const editCellMutation = useEditCell();
  const importWorkbookMutation = useImportWorkbook();
  const exportWorkbookMutation = useExportWorkbook();
  const nl2formulaMutation = useNl2Formula();
  const queryClient = useQueryClient();

  // Initialize default column widths
  useEffect(() => {
    const defaultWidth = 128; // 128px default width
    const initialWidths = {};
    for (let i = 0; i < visibleColumns; i++) {
      const col = numToCol(i);
      initialWidths[col] = defaultWidth;
    }
    setColumnWidths(initialWidths);
  }, [visibleColumns]);

  // Get column width
  const getColumnWidth = useCallback((col) => {
    return columnWidths[col] || 128; // Default to 128px if not set
  }, [columnWidths]);

  // Update column width
  const updateColumnWidth = useCallback((col, newWidth) => {
    setColumnWidths(prev => ({
      ...prev,
      [col]: Math.max(50, Math.min(500, newWidth)) // Min 50px, Max 500px
    }));
  }, []);

  // Process any pending updates
  useEffect(() => {
    const keys = Object.keys(updateQueue);
    if (keys.length > 0) {
      // Take the first pending update and process it
      const cellId = keys[0];
      const { col, row, value } = updateQueue[cellId];

      // Remove this item from the queue
      const newQueue = { ...updateQueue };
      delete newQueue[cellId];
      setUpdateQueue(newQueue);

      // Process the update (without adding it back to the queue)
      processCellUpdate(col, row, value);
    }
  }, [updateQueue]);

  // Get the currently active sheet
  const getActiveSheet = useCallback(() => {
    const sheet = spreadsheetData.sheets.find(sheet => sheet.id === spreadsheetData.activeSheet);
    // Generate columns dynamically based on visibleColumns
    return {
      ...sheet,
      columns: generateColumns(visibleColumns)
    };
  }, [spreadsheetData, visibleColumns]);

  // Add more columns when needed
  const addColumns = useCallback((count = 10) => {
    console.log('addColumns called with count:', count);
    setVisibleColumns(prev => {
      const newCount = prev + count;
      console.log('Column count updated:', { prev, count, newCount });
      return newCount;
    });
  }, []);

  // Set specific number of columns (useful for viewport-based calculations)
  const setColumnCount = useCallback((count) => {
    setVisibleColumns(Math.max(8, count)); // Ensure minimum of 8 columns
  }, []);

  // Get total number of columns available
  const getTotalColumns = useCallback(() => {
    return visibleColumns;
  }, [visibleColumns]);

  // Check if a column is visible
  const isColumnVisible = useCallback((col) => {
    const colNum = colToNum(col);
    return colNum < visibleColumns;
  }, [visibleColumns]);

  // Internal function to process cell updates
  const processCellUpdate = useCallback(async (col, row, newValue) => {
    const cellId = `${col}${row}`;
    try {
      setIsLoading(true);
      setError(null);

      // Update local state immediately for responsive UI
      setSpreadsheetData(prevData => {
        const updatedSheets = prevData.sheets.map(sheet => {
          if (sheet.id === prevData.activeSheet) {
            const updatedCells = {
              ...sheet.cells,
              [cellId]: {
                value: newValue,
                formula: '',
                type: 'text',
                formatted: newValue
              }
            };
            return {
              ...sheet,
              cells: updatedCells
            };
          }
          return sheet;
        });

        return {
          ...prevData,
          sheets: updatedSheets
        };
      });

      // Use React Query mutation for API call
      try {
        const activeSheet = getActiveSheet();
        const response = await editCellMutation.mutateAsync({ 
          workbookId: spreadsheetData.workbook_id,
          sheet: activeSheet.name,
          address: cellId,
          value: newValue 
        });
        
        // Update with server response if it's different
        if (response && (response.value !== newValue || response.formula)) {
          setSpreadsheetData(prevData => {
            const updatedSheets = prevData.sheets.map(sheet => {
              if (sheet.id === prevData.activeSheet) {
                const updatedCells = {
                  ...sheet.cells,
                  [cellId]: {
                    value: response.value || newValue,
                    formula: response.formula || '',
                    type: response.formula ? 'formula' : 'text',
                    formatted: response.value || newValue
                  }
                };
                return {
                  ...sheet,
                  cells: updatedCells
                };
              }
              return sheet;
            });

            return {
              ...prevData,
              sheets: updatedSheets
            };
          });
        }
      } catch (apiError) {
        console.error("API error:", apiError);
        // The local update remains even if API fails
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }, [editCellMutation, getActiveSheet, spreadsheetData.workbook_id]);

  // Update cell value (public method)
  const updateCell = useCallback(async (col, row, newValue) => {
    const cellId = `${col}${row}`;
    
    // Check if this is a formula (starts with =)
    const isFormula = newValue.startsWith('=');
    
    // Add to update queue
    setUpdateQueue(prev => ({
      ...prev,
      [cellId]: { col, row, value: newValue }
    }));
    
    // Also update immediately in local state for responsive UI
    setSpreadsheetData(prevData => {
      const updatedSheets = prevData.sheets.map(sheet => {
        if (sheet.id === prevData.activeSheet) {
          const updatedCells = {
            ...sheet.cells,
            [cellId]: {
              value: isFormula ? '' : newValue, // For formulas, value will be calculated
              formula: isFormula ? newValue : '',
              type: isFormula ? 'formula' : 'text',
              formatted: isFormula ? '' : newValue // For formulas, formatted will be calculated
            }
          };
          return {
            ...sheet,
            cells: updatedCells
          };
        }
        return sheet;
      });

      return {
        ...prevData,
        sheets: updatedSheets
      };
    });
    
    return { success: true };
  }, []);

  // Update cell with formula (specific for formula builder)
  const updateCellWithFormula = useCallback(async (col, row, formula, targetRange = '') => {
    const cellId = `${col}${row}`;
    
    // Add to update queue
    setUpdateQueue(prev => ({
      ...prev,
      [cellId]: { col, row, value: formula }
    }));
    
    // Update immediately in local state for responsive UI
    setSpreadsheetData(prevData => {
      const updatedSheets = prevData.sheets.map(sheet => {
        if (sheet.id === prevData.activeSheet) {
          const updatedCells = {
            ...sheet.cells,
            [cellId]: {
              value: '', // Will be calculated by the backend
              formula: formula,
              type: 'formula',
              formatted: '' // Will be calculated by the backend
            }
          };
          return {
            ...sheet,
            cells: updatedCells
          };
        }
        return sheet;
      });

      return {
        ...prevData,
        sheets: updatedSheets
      };
    });
    
    return { success: true };
  }, []);

  // Get cell by coordinates
  const getCell = useCallback((col, row) => {
    const cellId = `${col}${row}`;
    const activeSheet = getActiveSheet();
    return activeSheet.cells[cellId] || { value: '', formula: '', type: 'text', formatted: '' };
  }, [getActiveSheet]);

  // Import workbook
  const importWorkbook = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await importWorkbookFromAPI();
      if (response && response.success) {
        // Build new sheets array for frontend state
        const newSheets = response.data.sheets.map((name, idx) => ({
          id: `sheet${idx + 1}`,
          name,
          cells: {},
          columns: generateColumns(visibleColumns),
          rows: 100,
          activeCell: 'A1',
        }));
        setSpreadsheetData({
          sheets: newSheets,
          activeSheet: newSheets[0]?.id || '',
          workbook_id: response.data.workbook_id,
        });
        
        // Invalidate sheets query to refresh the sheet list
        queryClient.invalidateQueries({ queryKey: ['sheets', response.data.workbook_id] });
        
        // Optionally, show a notification here if you have setNotification
        // setNotification && setNotification({ type: 'success', message: response.message });
      }
      return response;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  // Export workbook
  const exportWorkbook = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const blob = await exportWorkbookMutation.mutateAsync();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'workbook.xlsx';
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  // Convert natural language to formula
  const nl2formula = async (query) => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await nl2formulaMutation.mutateAsync(query);
      setActiveFormula(response.formula);
      return response.formula;
    } catch (err) {
      setError(err.message);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch workbook by ID
  const fetchWorkbook = async (workbookId) => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await fetchWorkbookById(workbookId);
      if (response && response.success) {
        // Convert API sheets to frontend format
        const newSheets = response.data.sheets.map((sheet, idx) => {
          // Convert backend cell format to frontend format
          const frontendCells = {};
          if (sheet.cells) {
            Object.entries(sheet.cells).forEach(([cellId, cellData]) => {
              frontendCells[cellId] = {
                value: cellData.value || '',
                formula: cellData.formula || '',
                type: 'text',
                formatted: cellData.value || ''
              };
            });
          }
          
          return {
            id: `sheet${idx + 1}`,
            name: sheet.name,
            cells: frontendCells,
            columns: generateColumns(visibleColumns),
            rows: 100,
            activeCell: 'A1',
          };
        });
        
        setSpreadsheetData({
          sheets: newSheets,
          activeSheet: newSheets[0]?.id || '',
          workbook_id: response.data.workbook_id,
        });
        
        // Invalidate sheets query to refresh the sheet list
        queryClient.invalidateQueries({ queryKey: ['sheets', response.data.workbook_id] });
        
        console.log('Workbook loaded successfully:', {
          workbookId: response.data.workbook_id,
          sheets: newSheets.map(s => ({ name: s.name, cellCount: Object.keys(s.cells).length }))
        });
      }
      return response;
    } catch (err) {
      setError(err.message);
      console.error('Failed to fetch workbook:', err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  // Switch to a different sheet
  const switchSheet = useCallback(async (sheetId) => {
    const activeSheet = spreadsheetData.sheets.find(s => s.id === sheetId);
    if (!activeSheet) return;

    setSpreadsheetData(prevData => ({
      ...prevData,
      activeSheet: sheetId
    }));

    // Load sheet data from backend
    try {
      const response = await api.getSheet(spreadsheetData.workbook_id, activeSheet.name);
      if (response && response.success) {
        const sheetData = response.data.sheet;
        // Convert backend cell format to frontend format
        const frontendCells = {};
        if (sheetData.cells) {
          Object.entries(sheetData.cells).forEach(([cellId, cellData]) => {
            frontendCells[cellId] = {
              value: cellData.value || '',
              formula: cellData.formula || '',
              type: cellData.formula ? 'formula' : 'text',
              formatted: cellData.value || ''
            };
          });
        }
        // Update the sheet with loaded data
        setSpreadsheetData(prevData => {
          const updatedSheets = prevData.sheets.map(sheet => {
            if (sheet.id === sheetId) {
              return {
                ...sheet,
                cells: frontendCells
              };
            }
            return sheet;
          });
          return {
            ...prevData,
            sheets: updatedSheets
          };
        });
        console.log('Sheet loaded successfully:', {
          sheetName: activeSheet.name,
          cellCount: Object.keys(frontendCells).length
        });
      }
    } catch (error) {
      console.error('Failed to load sheet data:', error);
      // Continue with the sheet switch even if loading fails
    }
  }, [spreadsheetData.workbook_id, spreadsheetData.sheets]);

  const value = {
    spreadsheetData,
    selectedCell,
    setSelectedCell,
    activeFormula,
    setActiveFormula,
    isLoading,
    error,
    getActiveSheet,
    getCell,
    updateCell,
    updateCellWithFormula,
    importWorkbook,
    exportWorkbook,
    nl2formula,
    zoom,
    setZoom,
    visibleColumns,
    addColumns,
    setColumnCount,
    getTotalColumns,
    isColumnVisible,
    getColumnWidth,
    updateColumnWidth,
    fetchWorkbook,
    switchSheet,
  };

  return (
    <SpreadsheetContext.Provider value={value}>
      {children}
    </SpreadsheetContext.Provider>
  );
};

export const useSpreadsheet = () => {
  const context = useContext(SpreadsheetContext);
  if (!context) {
    throw new Error('useSpreadsheet must be used within a SpreadsheetProvider');
  }
  return context;
};

export default SpreadsheetContext;
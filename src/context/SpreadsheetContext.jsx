import React, { createContext, useState, useContext, useCallback, useEffect } from 'react';
import api from '../services/api';

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
  return Array.from({ length: count }, (_, i) => numToCol(i));
};

// Calculate initial column count based on typical viewport
const calculateInitialColumns = () => {
  // For a typical desktop screen (1200px wide), we can fit about 8-10 columns
  // For mobile (375px wide), we can fit about 2-3 columns
  // We'll start with a reasonable default and let the Grid component adjust
  return 12; // Start with 12 columns (A-L) as a good default
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
    setVisibleColumns(prev => prev + count);
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

      // Send to backend (or simulate API call if needed)
      try {
        const response = await api.editCell(cellId, newValue);
        
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
  }, []);

  // Update cell value (public method)
  const updateCell = useCallback(async (col, row, newValue) => {
    const cellId = `${col}${row}`;
    
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
    
    return { success: true };
  }, []);

  // Get cell by coordinates
  const getCell = useCallback((col, row) => {
    const cellId = `${col}${row}`;
    const activeSheet = getActiveSheet();
    return activeSheet.cells[cellId] || { value: '', formula: '', type: 'text', formatted: '' };
  }, [getActiveSheet]);

  // Get cell by ID
  const getCellById = async (cellId) => {
    try {
      setIsLoading(true);
      setError(null);
      
      // First check if we have it locally
      const [col, ...rowParts] = cellId.split('');
      const row = parseInt(rowParts.join(''));
      const localCell = getCell(col, row);
      
      if (localCell.value || localCell.formatted) {
        return localCell;
      }
      
      // If not found locally or is empty, try API
      const response = await api.getCell(cellId);
      return response;
    } catch (err) {
      setError(err.message);
      return { value: '', type: 'text', formatted: '' };
    } finally {
      setIsLoading(false);
    }
  };

  // Import workbook
  const importWorkbook = async (file) => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await api.importWorkbook(file);
      setSpreadsheetData(response);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  // Export workbook
  const exportWorkbook = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const blob = await api.exportWorkbook();
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
      const response = await api.nl2formula(query);
      setActiveFormula(response.formula);
      return response.formula;
    } catch (err) {
      setError(err.message);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

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
    getCellById,
    updateCell,
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
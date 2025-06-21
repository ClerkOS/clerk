import React, { createContext, useState, useContext, useCallback, useEffect } from 'react';
import api from '../services/api';

// Initial spreadsheet data
const initialData = {
  sheets: [
    {
      id: 'sheet1',
      name: 'Sheet1',
      cells: {},
      columns: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'],
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
    return spreadsheetData.sheets.find(sheet => sheet.id === spreadsheetData.activeSheet);
  }, [spreadsheetData]);

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
import React, { createContext, useState, useContext } from 'react';

// Initial spreadsheet data
const initialData = {
  sheets: [
    {
      id: 'sheet1',
      name: 'Sheet1',
      cells: {
        'A1': { value: 'Quarter', type: 'text' },
        'B1': { value: 'Revenue', type: 'text' },
        'C1': { value: 'Expenses', type: 'text' },
        'D1': { value: 'Profit', type: 'text' },
        'A2': { value: 'Q1', type: 'text' },
        'B2': { value: 45231.89, type: 'currency', formatted: '$45,231.89' },
        'C2': { value: 23456.78, type: 'currency', formatted: '$23,456.78' },
        'D2': { value: 21775.11, type: 'currency', formatted: '$21,775.11' },
        'A3': { value: 'Q2', type: 'text' },
        'B3': { value: 52347.65, type: 'currency', formatted: '$52,347.65' },
        'C3': { value: 27891.34, type: 'currency', formatted: '$27,891.34' },
        'D3': { value: 24456.31, type: 'currency', formatted: '$24,456.31' },
        'A4': { value: 'Q3', type: 'text' },
        'B4': { value: 59872.43, type: 'currency', formatted: '$59,872.43' },
        'C4': { value: 29763.21, type: 'currency', formatted: '$29,763.21' },
        'D4': { value: 30109.22, type: 'currency', formatted: '$30,109.22' },
        'A5': { value: 'Q4', type: 'text' },
        'B5': { value: '=SUM(B2:B4)', type: 'formula', formatted: '$157,451.97' },
      },
      columns: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'],
      rows: 100,
      activeCell: 'B5',
    }
  ],
  activeSheet: 'sheet1',
};

const SpreadsheetContext = createContext();

export const SpreadsheetProvider = ({ children }) => {
  const [spreadsheetData, setSpreadsheetData] = useState(initialData);
  const [selectedCell, setSelectedCell] = useState({ col: 'B', row: 5 });
  const [activeFormula, setActiveFormula] = useState('=SUM(B2:B4)');

  // Get the currently active sheet
  const getActiveSheet = () => {
    return spreadsheetData.sheets.find(sheet => sheet.id === spreadsheetData.activeSheet);
  };

  // Get cell by coordinates
  const getCell = (col, row) => {
    const cellId = `${col}${row}`;
    const activeSheet = getActiveSheet();
    return activeSheet.cells[cellId] || { value: '', type: 'text', formatted: '' };
  };

  // Get cell by ID
  const getCellById = (cellId) => {
    const activeSheet = getActiveSheet();
    return activeSheet.cells[cellId] || { value: '', type: 'text', formatted: '' };
  };

  // Update cell value
  const updateCell = (col, row, newValue) => {
    const cellId = `${col}${row}`;
    setSpreadsheetData(prevData => {
      const updatedSheets = prevData.sheets.map(sheet => {
        if (sheet.id === prevData.activeSheet) {
          return {
            ...sheet,
            cells: {
              ...sheet.cells,
              [cellId]: {
                ...sheet.cells[cellId],
                value: newValue,
                // Here you would also add logic to detect formula, format, etc.
              }
            }
          };
        }
        return sheet;
      });

      return {
        ...prevData,
        sheets: updatedSheets
      };
    });
  };

  // Calculate formula result (very simplified)
  const calculateFormula = (formula) => {
    // This is a simplified example - a real implementation would use a formula parser
    if (formula.startsWith('=SUM(') && formula.endsWith(')')) {
      const range = formula.substring(5, formula.length - 1);
      const [start, end] = range.split(':');
      
      // Extract the column and row start/end
      const startCol = start.charAt(0);
      const startRow = parseInt(start.substring(1));
      const endCol = end.charAt(0);
      const endRow = parseInt(end.substring(1));
      
      let sum = 0;
      
      // Simple implementation for B2:B4 type ranges (same column)
      if (startCol === endCol) {
        for (let row = startRow; row <= endRow; row++) {
          const cell = getCell(startCol, row);
          if (typeof cell.value === 'number') {
            sum += cell.value;
          }
        }
      }
      
      return sum;
    }
    
    return 0;
  };

  const value = {
    spreadsheetData,
    selectedCell,
    setSelectedCell,
    activeFormula,
    setActiveFormula,
    getActiveSheet,
    getCell,
    getCellById,
    updateCell,
    calculateFormula,
  };

  return (
    <SpreadsheetContext.Provider value={value}>
      {children}
    </SpreadsheetContext.Provider>
  );
};

export const useSpreadsheet = () => useContext(SpreadsheetContext);

export default SpreadsheetContext;
import React, { useState, useEffect, useCallback } from 'react';

// Context to store and manage the cell selection state
export const SelectionContext = React.createContext({
  selectionStart: null,
  selectionEnd: null,
  selectedCells: [],
  isSelecting: false,
  startSelection: () => {},
  updateSelection: () => {},
  endSelection: () => {},
  clearSelection: () => {},
  isSelected: () => false,
});

// Helper function to convert column letter to number (A -> 0, B -> 1, etc.)
const colToNum = (col) => {
  let result = 0;
  for (let i = 0; i < col.length; i++) {
    result = result * 26 + (col.charCodeAt(i) - 64);
  }
  return result - 1; // 0-based index
};

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

// Calculate all cells within a selection range
const getCellsInRange = (start, end) => {
  if (!start || !end) return [];
  
  const startCol = colToNum(start.col);
  const startRow = start.row;
  const endCol = colToNum(end.col);
  const endRow = end.row;
  
  const minCol = Math.min(startCol, endCol);
  const maxCol = Math.max(startCol, endCol);
  const minRow = Math.min(startRow, endRow);
  const maxRow = Math.max(startRow, endRow);
  
  const cells = [];
  
  for (let r = minRow; r <= maxRow; r++) {
    for (let c = minCol; c <= maxCol; c++) {
      const colLetter = numToCol(c);
      cells.push(`${colLetter}${r}`);
    }
  }
  
  return cells;
};

export const SelectionProvider = ({ children }) => {
  const [selectionStart, setSelectionStart] = useState(null);
  const [selectionEnd, setSelectionEnd] = useState(null);
  const [isSelecting, setIsSelecting] = useState(false);
  const [selectedCells, setSelectedCells] = useState([]);
  
  // Start a new selection
  const startSelection = useCallback((col, row) => {
    const newStart = { col, row };
    setSelectionStart(newStart);
    setSelectionEnd(newStart);
    setIsSelecting(true);
    setSelectedCells([`${col}${row}`]);
  }, []);
  
  // Update the current selection as the user drags
  const updateSelection = useCallback((col, row) => {
    if (!isSelecting || !selectionStart) return;
    
    const newEnd = { col, row };
    setSelectionEnd(newEnd);
    
    // Calculate and update the list of selected cells
    const cellsInRange = getCellsInRange(selectionStart, newEnd);
    setSelectedCells(cellsInRange);
  }, [isSelecting, selectionStart]);
  
  // End the current selection
  const endSelection = useCallback(() => {
    setIsSelecting(false);
    // Selection is kept until cleared
  }, []);
  
  // Clear the current selection
  const clearSelection = useCallback(() => {
    setSelectionStart(null);
    setSelectionEnd(null);
    setSelectedCells([]);
    setIsSelecting(false);
  }, []);
  
  // Check if a cell is part of the current selection
  const isSelected = useCallback((col, row) => {
    return selectedCells.includes(`${col}${row}`);
  }, [selectedCells]);
  
  // Context value
  const contextValue = {
    selectionStart,
    selectionEnd,
    selectedCells,
    isSelecting,
    startSelection,
    updateSelection,
    endSelection,
    clearSelection,
    isSelected,
  };
  
  return (
    <SelectionContext.Provider value={contextValue}>
      {children}
    </SelectionContext.Provider>
  );
};

export const useSelection = () => React.useContext(SelectionContext);
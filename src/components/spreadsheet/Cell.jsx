import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useSpreadsheet } from '../../context/SpreadsheetContext';
import { useFormulaPreview } from '../../context/FormulaPreviewContext';

const Cell = ({ 
  value, 
  type, 
  isSelected, 
  isActiveCell,
  isHighlighted, 
  onClick, 
  onMouseEnter,
  col, 
  row 
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [draftValue, setDraftValue] = useState('');
  const inputRef = useRef(null);
  const cellRef = useRef(null);
  const { updateCell, getCell } = useSpreadsheet();
  const { previewFormula, previewTarget, clearPreview } = useFormulaPreview();

  // Get cell data directly from the context each render to ensure we have the latest
  const cellData = getCell(col, row);
  const displayValue = cellData.value || cellData.formatted || '';
  const isFormulaCell = cellData.type === 'formula' || cellData.formula;

  // Debug logging for formula cells
  useEffect(() => {
    if (isFormulaCell) {
      console.log(`Cell ${col}${row}:`, {
        value: cellData.value,
        formatted: cellData.formatted,
        formula: cellData.formula,
        type: cellData.type,
        displayValue
      });
    }
  }, [cellData, col, row, isFormulaCell, displayValue]);

  // Check if this cell is the current preview target
  const isPreviewTarget = previewTarget === `${col}${row}`;

  // Update draft value when:
  // 1. Component mounts
  // 2. When selected cell changes (to prepare for potential editing)
  // 3. When displayValue changes from external updates
  useEffect(() => {
    setDraftValue(displayValue);
  }, [displayValue]);

  // Determine cell styling based on selected/highlighted state and type
  const getCellClasses = useCallback(() => {
    let classes = 'px-1 sm:px-2 py-1 ';
    
    // Base styling
    classes += 'bg-white dark:bg-gray-900 ';
    
    // Active cell styling (the main selected cell)
    if (isActiveCell) {
      classes += 'border-2 border-black bg-blue-50 dark:border-white dark:bg-gray-800 ';
    } 
    // Selected cells styling (part of multi-selection)
    else if (isSelected) {
      classes += 'bg-blue-50 dark:bg-blue-900/20 border border-black dark:border-white ';
    }
    // Highlighted column styling  
    else if (isHighlighted) {
      classes += 'bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 ';
    }
    // Default styling
    else {
      classes += 'border border-gray-200 dark:border-gray-700 ';
    }

    // Type-specific styles and value-based coloring
    if (type === 'currency' || displayValue?.toString().startsWith('$') || !isNaN(Number(displayValue))) {
      classes += 'text-right ';
    } else {
      classes += 'text-left ';
    }
    
    // Profit (green), Cost (red) - only for columns F and E
    if (col === 'F' && !isNaN(Number(displayValue))) {
      classes += 'text-green-600 dark:text-green-400 font-semibold ';
    } else if (col === 'E' && !isNaN(Number(displayValue))) {
      classes += 'text-red-500 dark:text-red-400 font-semibold ';
    }
    
    // Header
    if (type === 'header') {
      classes += 'font-semibold ';
    }

    // Formula cell styling
    if (isFormulaCell) {
      classes += 'text-blue-600 dark:text-blue-400 font-mono text-xs sm:text-sm ';
    }

    // Text size for all cells
    classes += 'text-xs sm:text-sm ';

    return classes;
  }, [isActiveCell, isSelected, isHighlighted, type, displayValue, col, isFormulaCell]);

  // Handle double click to start editing
  const handleDoubleClick = useCallback(() => {
    if (isActiveCell) {
      setIsEditing(true);
    }
  }, [isActiveCell]);

  // Handle input change
  const handleChange = useCallback((e) => {
    setDraftValue(e.target.value);
  }, []);

  // Handle cell update - this is the critical part for persistence
  const handleCellUpdate = useCallback(async () => {
    if (draftValue !== displayValue) {
      try {
        await updateCell(col, row, draftValue);
        // Clear any formula preview when cell is updated
        clearPreview();
      } catch (error) {
        console.error(`Failed to update cell ${col}${row}:`, error);
        // Revert to previous value on error
        setDraftValue(displayValue);
      }
    }
    setIsEditing(false);
  }, [draftValue, displayValue, updateCell, col, row, clearPreview]);

  // Handle key press
  const handleKeyPress = useCallback((e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleCellUpdate();
    } else if (e.key === 'Escape') {
      setIsEditing(false);
      setDraftValue(displayValue);
      clearPreview();
    }
  }, [handleCellUpdate, displayValue, clearPreview]);

  // Custom click handler that ensures we finish any editing before changing cells
  const handleCellClick = useCallback((e) => {
    // Only run the parent onClick if we're not currently editing
    // or if we've already saved our changes
    if (isEditing) {
      handleCellUpdate();
    }
    onClick(e);
  }, [isEditing, handleCellUpdate, onClick]);

  // Focus input when editing starts
  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      // Select all text for easy replacement
      inputRef.current.select();
    }
  }, [isEditing]);

  return (
    <td 
      ref={cellRef}
      className={getCellClasses()}
      onClick={handleCellClick}
      onMouseEnter={onMouseEnter}
      onDoubleClick={handleDoubleClick}
      data-cell={`${col}${row}`}
      style={{ fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" }}
    >
      {isEditing ? (
        <input
          ref={inputRef}
          type="text"
          value={draftValue}
          onChange={handleChange}
          onBlur={handleCellUpdate}
          onKeyDown={handleKeyPress}
          className="w-full h-full bg-transparent border-none outline-none p-0 text-gray-900"
          style={{ fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" }}
        />
      ) : (
        <div className="relative w-full h-full text-gray-900 dark:text-gray-100">
          {isActiveCell && (
            <div className="absolute -inset-px pointer-events-none" />
          )}
          {displayValue || (isFormulaCell && cellData.formula ? cellData.formula : '')}
          
          {/* Formula Preview Overlay */}
          {isPreviewTarget && previewFormula && (
            <div className="absolute inset-0 pointer-events-none bg-green-100/10 border-2 border-dashed border-green-500 rounded-sm z-10">
              <div className="absolute inset-0 flex items-center justify-center text-sm text-green-600 dark:text-green-400">
                {previewFormula}
              </div>
            </div>
          )}
        </div>
      )}
    </td>
  );
};

export default Cell;
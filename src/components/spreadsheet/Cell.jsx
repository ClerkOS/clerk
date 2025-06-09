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
  onContextMenu,
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
    let classes = 'bg-white dark:bg-gray-800 border dark:border-gray-700 px-2 ';
    
    // Active cell styling (the main selected cell)
    if (isActiveCell) {
      classes += 'border-2 border-blue-500 dark:border-blue-300 ';
    } 
    // Selected cells styling (part of multi-selection)
    else if (isSelected) {
      classes += 'bg-blue-100/40 dark:bg-blue-900/40 border-blue-300 dark:border-blue-400 shadow-[0_0_0_1px_rgba(59,130,246,0.3)] dark:shadow-[0_0_0_1px_rgba(96,165,250,0.3)] ';
    }
    // Highlighted column styling  
    else if (isHighlighted) {
      classes += 'bg-blue-500/5 dark:bg-blue-500/10 ';
    }

    // Default border except when selected (to avoid double borders)
    if (!isActiveCell && !isSelected) {
      classes += 'border-gray-300 dark:border-gray-600 ';
    }

    // Type-specific styles
    if (type === 'currency' || displayValue?.toString().startsWith('$')) {
      classes += 'text-right ';
    } else if (type === 'header' || (type === 'text' && displayValue?.toString().match(/^[QW][1-4]$/))) {
      classes += 'font-medium ';
    }

    return classes;
  }, [isActiveCell, isSelected, isHighlighted, type, displayValue]);

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
      onContextMenu={onContextMenu}
      onDoubleClick={handleDoubleClick}
      data-cell={`${col}${row}`} // Add data attribute for cell identification
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
          className="w-full h-full bg-transparent border-none outline-none p-0 text-gray-900 dark:text-gray-100"
          style={{ fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" }}
        />
      ) : (
        <div className="relative w-full h-full min-w-[80px] min-h-[24px] text-gray-900 dark:text-gray-100">
          {isActiveCell && (
            <div className="absolute -inset-px pointer-events-none" />
          )}
          {displayValue}
          
          {/* Formula Preview Overlay */}
          {isPreviewTarget && previewFormula && (
            <div 
              className="absolute inset-0 pointer-events-none"
              style={{
                backgroundColor: 'rgba(16, 185, 129, 0.1)',
                border: '2px dashed #10b981',
                borderRadius: '2px',
                zIndex: 10
              }}
            >
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
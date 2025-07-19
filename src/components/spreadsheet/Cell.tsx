import React, { useState, useRef, useEffect, useCallback } from 'react';
// import { useSpreadsheet } from '../../context/SpreadsheetContext.jsx';
// import { useFormulaPreview } from '../../context/FormulaPreviewContext.jsx';
// import { useCell, useEditCell } from '../../features/useSpreadsheetQueries.js';
// import { useDarkMode } from '../../features/useDarkMode.js';

const Cell = ({
                value,
                type,
                isSelected,
                isActiveCell,
                isHighlighted,
                onClick,
                onMouseEnter,
                col,
                row,
                isEditing: globalIsEditing,
                onEditingChange
              }) => {
  const [localIsEditing, setLocalIsEditing] = useState(false);
  const [draftValue, setDraftValue] = useState('');
  const inputRef = useRef(null);
  const cellRef = useRef(null);
  const { getCell } = useSpreadsheet();
  const { previewFormula, previewTarget, clearPreview } = useFormulaPreview();
  const { isDarkMode, adjustStyle } = useDarkMode();

  // Determine if this cell should be editing
  const isEditing = (globalIsEditing && isActiveCell) || localIsEditing;

  // React Query features
  const cellId = `${col}${row}`;
  const { data: cellDataFromQuery, isLoading, error } = useCell(cellId);
  const editCellMutation = useEditCell();

  // Get cell data - prioritize React Query data, fallback to context
  const cellData = cellDataFromQuery || getCell(col, row);
  const displayValue = cellData?.value || cellData?.formatted || '';
  const isFormulaCell = cellData?.type === 'formula' || cellData?.formula;

  // Debug logging for formula cells
  useEffect(() => {
    if (isFormulaCell) {
      console.log(`Cell ${col}${row}:`, {
        value: cellData?.value,
        formatted: cellData?.formatted,
        formula: cellData?.formula,
        type: cellData?.type,
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

  // Notify parent when editing state changes
  useEffect(() => {
    if (onEditingChange && isActiveCell) {
      onEditingChange(isEditing);
    }
  }, [isEditing, isActiveCell, onEditingChange]);

  // Determine cell styling based on selected/highlighted state and type
  const getCellClasses = useCallback(() => {
    let classes = 'px-1 sm:px-2 py-1 color-transition ';

    // Base styling - remove grey backgrounds
    classes += 'bg-white dark:bg-transparent ';

    // Active cell styling (the main selected cell)
    if (isActiveCell) {
      classes += 'border-2 border-black bg-blue-50 dark:border-white dark:bg-blue-900/20 ';
    }
    // Selected cells styling (part of multi-selection)
    else if (isSelected) {
      classes += 'bg-blue-50 dark:bg-blue-900/20 border border-black dark:border-white ';
    }
    // Highlighted column styling - remove grey background
    else if (isHighlighted) {
      classes += 'bg-gray-50 dark:bg-transparent border border-gray-200 dark:border-gray-700 ';
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

  // Get inline styles based on cell styling
  const getCellStyles = useCallback(() => {
    const styles = {
      fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
    };

    // Apply cell styling if available
    if (cellData?.style) {
      const style = cellData.style;

      // Debug logging
      console.log(`Cell ${col}${row} styling:`, style);

      // Apply dark mode adjustments to the style
      const adjustedStyle = adjustStyle(style);

      // Font properties
      if (adjustedStyle.fontBold) {
        styles.fontWeight = 'bold';
        console.log(`Applied bold to cell ${col}${row}`);
      }
      if (adjustedStyle.fontItalic) {
        styles.fontStyle = 'italic';
        console.log(`Applied italic to cell ${col}${row}`);
      }
      if (adjustedStyle.fontSize) {
        styles.fontSize = `${adjustedStyle.fontSize}px`;
        console.log(`Applied font size ${adjustedStyle.fontSize}px to cell ${col}${row}`);
      }
      if (adjustedStyle.fontFamily) {
        styles.fontFamily = adjustedStyle.fontFamily;
        console.log(`Applied font family ${adjustedStyle.fontFamily} to cell ${col}${row}`);
      }
      if (adjustedStyle.fontColor) {
        styles.color = adjustedStyle.fontColor;
        console.log(`Applied font color ${adjustedStyle.fontColor} to cell ${col}${row}`);
      }

      // Background color - only apply if it's not white/transparent and actually exists
      if (adjustedStyle.backgroundColor &&
        adjustedStyle.backgroundColor !== '#FFFFFF' &&
        adjustedStyle.backgroundColor !== 'transparent' &&
        adjustedStyle.backgroundColor !== 'rgba(0,0,0,0)') {
        styles.backgroundColor = adjustedStyle.backgroundColor;
        console.log(`Applied background color ${adjustedStyle.backgroundColor} to cell ${col}${row}`);
      }

      // Text alignment
      if (adjustedStyle.alignment) {
        styles.textAlign = adjustedStyle.alignment;
        console.log(`Applied alignment ${adjustedStyle.alignment} to cell ${col}${row}`);
      }

      // Border styling
      if (adjustedStyle.borderStyle) {
        styles.borderStyle = 'solid';
        styles.borderWidth = adjustedStyle.borderStyle === 'thin' ? '1px' :
          adjustedStyle.borderStyle === 'medium' ? '2px' : '3px';
        if (adjustedStyle.borderColor) {
          styles.borderColor = adjustedStyle.borderColor;
        }
        console.log(`Applied border style ${adjustedStyle.borderStyle} to cell ${col}${row}`);
      }
    } else {
      // Debug: log when no styling is found
      console.log(`No styling found for cell ${col}${row}`);
    }

    return styles;
  }, [cellData?.style, col, row, adjustStyle]);

  // Handle double click to start editing
  const handleDoubleClick = useCallback(() => {
    if (isActiveCell) {
      setLocalIsEditing(true);
    }
  }, [isActiveCell]);

  // Handle input change
  const handleChange = useCallback((e) => {
    setDraftValue(e.target.value);
  }, []);

  // Handle cell update - now using React Query mutation
  const handleCellUpdate = useCallback(async () => {
    if (draftValue !== displayValue) {
      try {
        await editCellMutation.mutateAsync({ cellId, value: draftValue });
        // Clear any formula preview when cell is updated
        clearPreview();
      } catch (error) {
        console.error(`Failed to update cell ${col}${row}:`, error);
        // Revert to previous value on error
        setDraftValue(displayValue);
      }
    }
    setLocalIsEditing(false);
  }, [draftValue, displayValue, editCellMutation, cellId, clearPreview, col, row]);

  // Handle key press
  const handleKeyPress = useCallback((e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleCellUpdate();
    } else if (e.key === 'Escape') {
      setLocalIsEditing(false);
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

  // Show loading state if React Query is loading
  if (isLoading) {
    return (
      <td
        className={getCellClasses()}
        data-cell={cellId}
        style={getCellStyles()}
      >
        <div className="w-full h-full flex items-center justify-center">
          <div className="w-4 h-4 bg-gray-300 rounded animate-pulse"></div>
        </div>
      </td>
    );
  }

  // Show error state if React Query has an error
  if (error) {
    return (
      <td
        className={getCellClasses()}
        data-cell={cellId}
        style={getCellStyles()}
      >
        <div className="w-full h-full flex items-center justify-center text-red-500 text-xs">
          Error
        </div>
      </td>
    );
  }

  return (
    <td
      ref={cellRef}
      className={getCellClasses()}
      onClick={handleCellClick}
      onMouseEnter={onMouseEnter}
      onDoubleClick={handleDoubleClick}
      data-cell={cellId}
      style={getCellStyles()}
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
          style={getCellStyles()}
        />
      ) : (
        <div className="relative w-full h-full text-gray-900 dark:text-gray-100">
          {isActiveCell && (
            <div className="absolute -inset-px pointer-events-none" />
          )}
          {displayValue || (isFormulaCell && cellData?.formula ? cellData.formula : '')}

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
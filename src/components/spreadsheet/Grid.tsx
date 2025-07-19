import React, { useState, useEffect, useCallback, useRef } from 'react';
import Cell from './Cell.jsx';
import ColumnHeader from './ColumnHeader';
// import { useSpreadsheet } from '../../context/SpreadsheetContext.jsx';
// import { useSelection } from './SelectionManager.jsx';

// Number of rows to render initially and when loading more
const ROW_BATCH_SIZE = 20;
// Number of rows to preload before reaching the bottom
const PRELOAD_THRESHOLD = 5;
// Column width in pixels (from ColumnHeader component)
const COLUMN_WIDTH = 128; // w-32 = 128px
// Row header width
const ROW_HEADER_WIDTH = 40; // w-10 = 40px

const Grid = ({ isEditing, onEditingChange }) => {
  const {
    selectedCell,
    setSelectedCell,
    getActiveSheet,
    getCell,
    zoom,
    addColumns,
    setColumnCount,
    getTotalColumns,
    getColumnWidth,
    updateColumnWidth
  } = useSpreadsheet();

  const {
    startSelection,
    updateSelection,
    endSelection,
    isSelected,
    selectedCells
  } = useSelection();

  const activeSheet = getActiveSheet();
  const { columns } = activeSheet;

  // State for visible rows
  const [visibleRows, setVisibleRows] = useState(ROW_BATCH_SIZE);
  const [isLoadingRows, setIsLoadingRows] = useState(false);
  const [isLoadingColumns, setIsLoadingColumns] = useState(false);
  const [viewportWidth, setViewportWidth] = useState(0);
  const rowObserverRef = useRef(null);
  const columnObserverRef = useRef(null);
  const rowLoadingTriggerRef = useRef(null);
  const columnLoadingTriggerRef = useRef(null);
  const gridRef = useRef(null);

  // State for tracking mouse events
  const [isMouseDown, setIsMouseDown] = useState(false);

  // State for context menu
  const [contextMenu, setContextMenu] = useState({
    visible: false,
    position: { x: 0, y: 0 },
    cellId: null
  });

  // Debug: Log when Grid receives new active sheet
  // useEffect(() => {
  //   console.log('Grid component - Active sheet updated:', {
  //     activeSheetId: activeSheet?.id,
  //     activeSheetName: activeSheet?.name,
  //     columnsCount: columns?.length,
  //     hasColumns: !!columns
  //   });
  // }, [activeSheet?.id, activeSheet?.name, columns]);

  // Calculate how many columns can fit in the viewport
  const calculateVisibleColumns = useCallback(() => {
    if (viewportWidth === 0) return 8; // Default fallback

    // Account for row header width and some padding
    const availableWidth = viewportWidth - ROW_HEADER_WIDTH - 20; // 20px for padding
    const columnsThatFit = Math.ceil(availableWidth / COLUMN_WIDTH);

    // Return at least 8 columns, or enough to fill the viewport plus some buffer
    const result = Math.max(8, columnsThatFit + 2); // +2 for buffer

    // Debug logging (only in development)
    if (process.env.NODE_ENV === 'development') {
      console.log('Column calculation:', {
        viewportWidth,
        availableWidth,
        columnsThatFit,
        result,
        currentColumns: getTotalColumns()
      });
    }

    return result;
  }, [viewportWidth, getTotalColumns]);

  // Update viewport width on resize
  useEffect(() => {
    const updateViewportWidth = () => {
      if (gridRef.current) {
        const rect = gridRef.current.getBoundingClientRect();
        setViewportWidth(rect.width);
      }
    };

    // Initial calculation
    updateViewportWidth();

    // Add resize listener
    window.addEventListener('resize', updateViewportWidth);

    // Also update when zoom changes
    const resizeObserver = new ResizeObserver(updateViewportWidth);
    if (gridRef.current) {
      resizeObserver.observe(gridRef.current);
    }

    return () => {
      window.removeEventListener('resize', updateViewportWidth);
      resizeObserver.disconnect();
    };
  }, [zoom]);

  // Update column count when viewport changes
  useEffect(() => {
    if (viewportWidth > 0) {
      const neededColumns = calculateVisibleColumns();
      const currentColumns = getTotalColumns();

      // Only update if we need significantly more or fewer columns
      if (neededColumns > currentColumns + 2 || neededColumns < currentColumns - 2) {
        setColumnCount(neededColumns);
      }
    }
  }, [viewportWidth, calculateVisibleColumns, getTotalColumns, setColumnCount]);

  // Initialize row intersection observer
  useEffect(() => {
    const options = {
      root: null,
      rootMargin: '0px',
      threshold: 0.1
    };

    const handleRowIntersect = (entries) => {
      const [entry] = entries;
      if (entry.isIntersecting && !isLoadingRows) {
        setIsLoadingRows(true);
        // Simulate loading delay
        setTimeout(() => {
          setVisibleRows(prev => prev + ROW_BATCH_SIZE);
          setIsLoadingRows(false);
        }, 100);
      }
    };

    rowObserverRef.current = new IntersectionObserver(handleRowIntersect, options);

    if (rowLoadingTriggerRef.current) {
      rowObserverRef.current.observe(rowLoadingTriggerRef.current);
    }

    return () => {
      if (rowObserverRef.current) {
        rowObserverRef.current.disconnect();
      }
    };
  }, [isLoadingRows]);

  // Initialize column intersection observer
  useEffect(() => {
    const options = {
      root: null,
      rootMargin: '200px', // Trigger earlier for smoother horizontal scroll
      threshold: 0.1
    };

    const handleColumnIntersect = (entries) => {
      const [entry] = entries;
      if (entry.isIntersecting && !isLoadingColumns) {
        // Only load more columns if user is scrolled to the far right
        if (gridRef.current) {
          const { scrollLeft, clientWidth, scrollWidth } = gridRef.current;
          // Allow a small buffer (32px) for floating point rounding
          if (scrollLeft + clientWidth >= scrollWidth - 32) {
            console.log('Column loading trigger activated');
            setIsLoadingColumns(true);
            // Simulate loading delay
            setTimeout(() => {
              // Calculate how many more columns we need based on viewport
              const currentColumns = getTotalColumns();
              const neededColumns = calculateVisibleColumns();
              const columnsToAdd = Math.max(30, neededColumns - currentColumns + 15); // Add more buffer and batch size

              console.log('Adding columns:', {
                currentColumns,
                neededColumns,
                columnsToAdd,
                newTotal: currentColumns + columnsToAdd
              });

              addColumns(columnsToAdd);
              setIsLoadingColumns(false);
            }, 100);
          }
        }
      }
    };

    columnObserverRef.current = new IntersectionObserver(handleColumnIntersect, options);

    if (columnLoadingTriggerRef.current) {
      columnObserverRef.current.observe(columnLoadingTriggerRef.current);
    }

    return () => {
      if (columnObserverRef.current) {
        columnObserverRef.current.disconnect();
      }
    };
  }, [isLoadingColumns, addColumns, getTotalColumns, calculateVisibleColumns]);

  // Generate array of visible rows
  const rows = Array.from({ length: visibleRows }, (_, i) => i + 1);

  // Handler for mouse down on grid (to start tracking)
  const handleGridMouseDown = useCallback((e) => {
    if (e.button !== 0) return; // Only handle left clicks

    // Don't start selection if clicking on a resize handle
    if (e.target.closest('.resize-handle')) {
      return;
    }

    setIsMouseDown(true);
  }, []);

  // Handler for mouse up on grid (to end tracking)
  const handleGridMouseUp = useCallback((e) => {
    if (e.button !== 0) return; // Only handle left clicks
    setIsMouseDown(false);
    endSelection();
  }, [endSelection]);

  // Check if a cell is the currently selected "active" cell
  const isActiveCell = useCallback((col, row) => {
    return selectedCell.col === col && selectedCell.row === row;
  }, [selectedCell]);

  // Check if a column is currently highlighted
  const isHighlighted = useCallback((col) => {
    return selectedCell.col === col;
  }, [selectedCell]);

  // Handle cell click
  const handleCellClick = useCallback((col, row, e) => {
    // Set as active cell
    setSelectedCell({ col, row });

    if (e.shiftKey && selectedCell) {
      // If shift is held, select range from active cell to clicked cell
      startSelection(selectedCell.col, selectedCell.row);
      updateSelection(col, row);
      endSelection();
    } else if (e.button === 0) {
      // Start a new selection if this is a left click
      startSelection(col, row);
    }
  }, [setSelectedCell, startSelection, updateSelection, endSelection, selectedCell]);

  // Handle cell hover - for selection updating during drag
  const handleCellHover = useCallback((col, row) => {
    if (isMouseDown) {
      updateSelection(col, row);
    }
  }, [isMouseDown, updateSelection]);

  // Handle column resize
  const handleColumnResize = useCallback((col, newWidth) => {
    updateColumnWidth(col, newWidth);
  }, [updateColumnWidth]);

  // Add window-level event listeners for mouse up (in case mouse is released outside the grid)
  useEffect(() => {
    const handleWindowMouseUp = () => {
      if (isMouseDown) {
        setIsMouseDown(false);
        endSelection();
      }
    };

    window.addEventListener('mouseup', handleWindowMouseUp);

    return () => {
      window.removeEventListener('mouseup', handleWindowMouseUp);
    };
  }, [isMouseDown, endSelection]);

  return (
    <div
      ref={gridRef}
      className="flex-1 overflow-auto p-1 relative w-full bg-white"
      onMouseDown={handleGridMouseDown}
      onMouseUp={handleGridMouseUp}
      style={{
        fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
        transform: `scale(${zoom / 100})`,
        transformOrigin: 'top left',
      }}
    >
      <table className="border-collapse w-full table-fixed bg-white dark:bg-gray-900">
        <colgroup>
          <col style={{ width: '40px' }} />
          {columns.map((col) => (
            <col key={col} style={{ width: `${getColumnWidth(col)}px` }} />
          ))}
        </colgroup>
        <thead>
        <tr>
          {/* Empty top-left corner cell */}
          <th className="w-10 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-center font-semibold text-gray-700 dark:text-gray-200 text-xs sm:text-sm"></th>

          {/* Column headers */}
          {columns.map((col) => (
            <ColumnHeader
              key={col}
              label={col}
              isHighlighted={isHighlighted(col)}
              onResize={handleColumnResize}
              width={getColumnWidth(col)}
            />
          ))}

          {/* Column loading trigger */}
          <th
            ref={columnLoadingTriggerRef}
            className="w-6 sm:w-8 bg-transparent border-none"
          >
            {isLoadingColumns && (
              <div className="flex justify-center items-center py-2">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-purple-500"></div>
              </div>
            )}
          </th>
        </tr>
        </thead>
        <tbody>
        {rows.map((row) => (
          <tr key={row}>
            {/* Row header */}
            <td className="bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-center font-semibold text-gray-700 dark:text-gray-200 text-xs sm:text-sm">
              {row}
            </td>

            {/* Data cells */}
            {columns.map((col) => {
              const cellData = getCell(col, row);
              const cellId = `${col}${row}`;

              return (
                <Cell
                  key={cellId}
                  value={cellData.value || cellData.formatted || ''}
                  type={cellData.type}
                  isSelected={isSelected(col, row)}
                  isActiveCell={isActiveCell(col, row)}
                  isHighlighted={isHighlighted(col)}
                  onClick={(e) => handleCellClick(col, row, e)}
                  onMouseEnter={() => handleCellHover(col, row)}
                  col={col}
                  row={row}
                  isEditing={isEditing}
                  onEditingChange={onEditingChange}
                />
              );
            })}

            {/* Empty cell for column loading trigger alignment */}
            <td className="w-6 sm:w-8 bg-transparent border-none"></td>
          </tr>
        ))}

        {/* Row loading trigger element */}
        <tr ref={rowLoadingTriggerRef}>
          <td colSpan={columns.length + 2} className="h-4">
            {isLoadingRows && (
              <div className="flex justify-center items-center py-2">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-purple-500"></div>
              </div>
            )}
          </td>
        </tr>
        </tbody>
      </table>
    </div>
  );
};

export default Grid;
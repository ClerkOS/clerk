import React, { useState, useEffect, useCallback, useRef } from 'react';
import Cell from './Cell';
import ColumnHeader from './ColumnHeader';
import { useSpreadsheet } from '../../context/SpreadsheetContext';
import { useSelection } from './SelectionManager';
import ContextMenu from '../ai/ContextMenu';

// Number of rows to render initially and when loading more
const ROW_BATCH_SIZE = 20;
// Number of rows to preload before reaching the bottom
const PRELOAD_THRESHOLD = 5;

const Grid = () => {
  const {
    selectedCell,
    setSelectedCell,
    getActiveSheet,
    getCell,
    zoom
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
  const [isLoading, setIsLoading] = useState(false);
  const observerRef = useRef(null);
  const loadingTriggerRef = useRef(null);
  const gridRef = useRef(null);

  // State for tracking mouse events
  const [isMouseDown, setIsMouseDown] = useState(false);
  
  // State for context menu
  const [contextMenu, setContextMenu] = useState({
    visible: false,
    position: { x: 0, y: 0 },
    cellId: null
  });

  // Initialize intersection observer
  useEffect(() => {
    const options = {
      root: null,
      rootMargin: '0px',
      threshold: 0.1
    };

    const handleIntersect = (entries) => {
      const [entry] = entries;
      if (entry.isIntersecting && !isLoading) {
        setIsLoading(true);
        // Simulate loading delay
        setTimeout(() => {
          setVisibleRows(prev => prev + ROW_BATCH_SIZE);
          setIsLoading(false);
        }, 100);
      }
    };

    observerRef.current = new IntersectionObserver(handleIntersect, options);

    if (loadingTriggerRef.current) {
      observerRef.current.observe(loadingTriggerRef.current);
    }

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [isLoading]);

  // Generate array of visible rows
  const rows = Array.from({ length: visibleRows }, (_, i) => i + 1);

  // Handler for mouse down on grid (to start tracking)
  const handleGridMouseDown = useCallback((e) => {
    if (e.button !== 0) return; // Only handle left clicks
    setIsMouseDown(true);
  }, []);

  // Handler for mouse up on grid (to end tracking)
  const handleGridMouseUp = useCallback((e) => {
    if (e.button !== 0) return; // Only handle left clicks
    setIsMouseDown(false);
    endSelection();
  }, [endSelection]);

  // Close context menu
  const closeContextMenu = useCallback(() => {
    setContextMenu(prev => ({ ...prev, visible: false }));
  }, []);

  // Handle right click
  const handleContextMenu = useCallback((e, cellId) => {
    e.preventDefault();
    
    setContextMenu({
      visible: true,
      position: { x: e.clientX, y: e.clientY },
      cellId: cellId,
      isCell: true
    });
  }, []);

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
    
    // Start a new selection if this is a left click
    if (e.button === 0) {
      startSelection(col, row);
    }
  }, [setSelectedCell, startSelection]);

  // Handle cell hover - for selection updating during drag
  const handleCellHover = useCallback((col, row) => {
    if (isMouseDown) {
      updateSelection(col, row);
    }
  }, [isMouseDown, updateSelection]);

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
      className="flex-1 overflow-auto p-1 relative w-full" 
      onMouseDown={handleGridMouseDown}
      onMouseUp={handleGridMouseUp}
      style={{ 
        fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
        transform: `scale(${zoom / 100})`,
        transformOrigin: 'top left',
      }}
    >
      <table className="border-collapse w-full">
        <thead>
          <tr>
            {/* Empty top-left corner cell */}
            <th className="w-10 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700"></th>
            
            {/* Column headers */}
            {columns.map((col) => (
              <ColumnHeader
                key={col}
                label={col}
                isHighlighted={isHighlighted(col)}
              />
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row}>
              {/* Row header */}
              <td className="bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 text-center">
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
                    onContextMenu={(e) => handleContextMenu(e, cellId)}
                    col={col}
                    row={row}
                  />
                );
              })}
            </tr>
          ))}
          
          {/* Loading trigger element */}
          <tr ref={loadingTriggerRef}>
            <td colSpan={columns.length + 1} className="h-4">
              {isLoading && (
                <div className="flex justify-center items-center py-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-purple-500"></div>
                </div>
              )}
            </td>
          </tr>
        </tbody>
      </table>

      {/* Context Menu */}
      {contextMenu.visible && (
        <ContextMenu
          position={contextMenu.position}
          onClose={closeContextMenu}
          isCell={contextMenu.isCell}
          cellId={contextMenu.cellId}
          selectedCells={selectedCells}
        />
      )}
    </div>
  );
};

export default Grid;
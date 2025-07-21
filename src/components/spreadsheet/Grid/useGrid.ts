import { useState, useEffect, useRef, useCallback } from 'react';
// import {useVirtualizer} from "@tanstack/react-virtual";
import {
  ROW_BATCH_SIZE,
  COLUMN_WIDTH,
  ROW_HEADER_WIDTH,
  type SpreadsheetContext,
  type SelectionContext,
  type ContextMenuState
} from './gridTypes';
import { useVirtualizer } from "@tanstack/react-virtual";

export const useGrid = () => {
  // State for visible rows
  const [visibleRows, setVisibleRows] = useState<number>(ROW_BATCH_SIZE);
  const [isLoadingRows, setIsLoadingRows] = useState<boolean>(false);
  const [isLoadingColumns, setIsLoadingColumns] = useState<boolean>(false);
  const [viewportWidth, setViewportWidth] = useState<number>(0);
  const [isMouseDown, setIsMouseDown] = useState<boolean>(false);
  const [contextMenu, setContextMenu] = useState<ContextMenuState>({
    visible: false,
    position: { x: 0, y: 0 },
    cellId: null
  });

  const rowObserverRef = useRef<IntersectionObserver | null>(null);
  const columnObserverRef = useRef<IntersectionObserver | null>(null);
  const rowLoadingTriggerRef = useRef<HTMLTableRowElement>(null);
  const columnLoadingTriggerRef = useRef<HTMLTableCellElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);


  /**
   * Virtualization
   */

  // Generate rows and cols
  // const generateRows = () => {
  //   return Array.from({ length: visibleRows }, (_, i) => i + 1);
  // };

  const columns = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z"]; // temporary columns for testing

  const rowVirtualizer = useVirtualizer({
    count: 1000,
    getScrollElement: () => gridRef.current,
    estimateSize: () => 20, //height of row cell
    overscan: 10
  })

  const columnVirtualizer = useVirtualizer({
    horizontal: true,
    count: columns.length,
    getScrollElement: () => gridRef.current,
    estimateSize: () => 90, // width of column cell
    overscan: 10
  })

  const virtualRows = rowVirtualizer.getVirtualItems()
  const virtualCols = columnVirtualizer.getVirtualItems()

  // const {
  //   selectedCell,
  //   setSelectedCell,
  //   getActiveSheet,
  //   getCell,
  //   zoom,
  //   addColumns,
  //   setColumnCount,
  //   getTotalColumns,
  //   getColumnWidth,
  //   updateColumnWidth
  // } = useSpreadsheet();

  // const {
  //   startSelection,
  //   updateSelection,
  //   endSelection,
  //   isSelected,
  //   selectedCells
  // } = useSelection();

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
    // +2 for buffer
    // Debug logging (only in development)
    // if (process.env.NODE_ENV === 'development') {
    //   console.log('Column calculation:', {
    //     viewportWidth,
    //     availableWidth,
    //     columnsThatFit,
    //     result,
    //     currentColumns: getTotalColumns()
    //   });
    // }

    return Math.max(8, columnsThatFit + 2);
  }, [viewportWidth]);
  // }, [viewportWidth, getTotalColumns]);

  // Update viewport width on resize
  // useEffect(() => {
  //   const updateViewportWidth = () => {
  //     if (gridRef.current) {
  //       const rect = gridRef.current.getBoundingClientRect();
  //       setViewportWidth(rect.width);
  //     }
  //   };
  //
  //   // Initial calculation
  //   updateViewportWidth();
  //
  //   // Add resize listener
  //   window.addEventListener('resize', updateViewportWidth);
  //
  //   // Also update when zoom changes
  //   const resizeObserver = new ResizeObserver(updateViewportWidth);
  //   if (gridRef.current) {
  //     resizeObserver.observe(gridRef.current);
  //   }
  //
  //   return () => {
  //     window.removeEventListener('resize', updateViewportWidth);
  //     resizeObserver.disconnect();
  //   };
  // }, [zoom]);

  // Update column count when viewport changes
  // useEffect(() => {
  //   if (viewportWidth > 0) {
  //     const neededColumns = calculateVisibleColumns();
  //     const currentColumns = getTotalColumns();
  //
  //     // Only update if we need significantly more or fewer columns
  //     if (neededColumns > currentColumns + 2 || neededColumns < currentColumns - 2) {
  //       setColumnCount(neededColumns);
  //     }
  //   }
  // }, [viewportWidth, calculateVisibleColumns, getTotalColumns, setColumnCount]);

  // Initialize row intersection observer
  const initializeRowObserver = useCallback(() => {
    const options: IntersectionObserverInit = {
      root: null,
      rootMargin: '0px',
      threshold: 0.1
    };

    const handleRowIntersect: IntersectionObserverCallback = (entries) => {
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

  useEffect(() => {
    return initializeRowObserver();
  }, [initializeRowObserver]);

  // Initialize column intersection observer
  // useEffect(() => {
  //   const options: IntersectionObserverInit = {
  //     root: null,
  //     rootMargin: '200px', // Trigger earlier for smoother horizontal scroll
  //     threshold: 0.1
  //   };
  //
  //   const handleColumnIntersect: IntersectionObserverCallback = (entries) => {
  //     const [entry] = entries;
  //     if (entry.isIntersecting && !isLoadingColumns) {
  //       // Only load more columns if user is scrolled to the far right
  //       if (gridRef.current) {
  //         const { scrollLeft, clientWidth, scrollWidth } = gridRef.current;
  //         // Allow a small buffer (32px) for floating point rounding
  //         if (scrollLeft + clientWidth >= scrollWidth - 32) {
  //           console.log('Column loading trigger activated');
  //           setIsLoadingColumns(true);
  //           // Simulate loading delay
  //           setTimeout(() => {
  //             // Calculate how many more columns we need based on viewport
  //             const currentColumns = getTotalColumns();
  //             const neededColumns = calculateVisibleColumns();
  //             const columnsToAdd = Math.max(30, neededColumns - currentColumns + 15); // Add more buffer and batch size
  //
  //             console.log('Adding columns:', {
  //               currentColumns,
  //               neededColumns,
  //               columnsToAdd,
  //               newTotal: currentColumns + columnsToAdd
  //             });
  //
  //             addColumns(columnsToAdd);
  //             setIsLoadingColumns(false);
  //           }, 100);
  //         }
  //       }
  //     }
  //   };
  //
  //   columnObserverRef.current = new IntersectionObserver(handleColumnIntersect, options);
  //
  //   if (columnLoadingTriggerRef.current) {
  //     columnObserverRef.current.observe(columnLoadingTriggerRef.current);
  //   }
  //
  //   return () => {
  //     if (columnObserverRef.current) {
  //       columnObserverRef.current.disconnect();
  //     }
  //   };
  // }, [isLoadingColumns, addColumns, getTotalColumns, calculateVisibleColumns]);




  // Handler for mouse down on grid (to start tracking)
  const handleGridMouseDown = useCallback((e: React.MouseEvent) => {
    if (e.button !== 0) return; // Only handle left clicks

    // Don't start selection if clicking on a resize handle
    if ((e.target as HTMLElement).closest('.resize-handle')) {
      return;
    }

    setIsMouseDown(true);
  }, []);

  // Handler for mouse up on grid (to end tracking)
  // const handleGridMouseUp = useCallback((e: React.MouseEvent) => {
  //   if (e.button !== 0) return; // Only handle left clicks
  //   setIsMouseDown(false);
  //   endSelection();
  // }, [endSelection]);

  // Check if a cell is the currently selected "active" cell
  // const isActiveCell = useCallback((col: string, row: number) => {
  //   return selectedCell.col === col && selectedCell.row === row;
  // }, [selectedCell]);

  // Check if a column is currently highlighted
  // const isHighlighted = useCallback((col: string) => {
  //   return selectedCell.col === col;
  // }, [selectedCell]);

  // Handle cell click
  // const handleCellClick = useCallback((col: string, row: number, e: React.MouseEvent) => {
  //   // Set as active cell
  //   setSelectedCell({ col, row });
  //
  //   if (e.shiftKey && selectedCell) {
  //     // If shift is held, select range from active cell to clicked cell
  //     startSelection(selectedCell.col, selectedCell.row);
  //     updateSelection(col, row);
  //     endSelection();
  //   } else if (e.button === 0) {
  //     // Start a new selection if this is a left click
  //     startSelection(col, row);
  //   }
  // }, [setSelectedCell, startSelection, updateSelection, endSelection, selectedCell]);

  // Handle cell hover - for selection updating during drag
  // const handleCellHover = useCallback((col: string, row: number) => {
  //   if (isMouseDown) {
  //     updateSelection(col, row);
  //   }
  // }, [isMouseDown, updateSelection]);

  // Handle column resize
  // const handleColumnResize = useCallback((col: string, newWidth: number) => {
  //   updateColumnWidth(col, newWidth);
  // }, [updateColumnWidth]);

  // Add window-level event listeners for mouse up (in case mouse is released outside the grid)
  // useEffect(() => {
  //   const handleWindowMouseUp = () => {
  //     if (isMouseDown) {
  //       setIsMouseDown(false);
  //       endSelection();
  //     }
  //   };
  //
  //   window.addEventListener('mouseup', handleWindowMouseUp);
  //
  //   return () => {
  //     window.removeEventListener('mouseup', handleWindowMouseUp);
  //   };
  // }, [isMouseDown, endSelection]);

  return {
    gridRef,
    rowVirtualizer,
    columnVirtualizer,
    virtualRows,
    virtualCols,
    rowLoadingTriggerRef,
    columnLoadingTriggerRef,
    visibleRows,
    isLoadingRows,
    isLoadingColumns,
    isMouseDown,
    contextMenu,
    columns,
    // generateRows,
    handleGridMouseDown,
    // handleGridMouseUp,
    // isActiveCell,
    // isHighlighted,
    // handleCellClick,
    // handleCellHover,
    // handleColumnResize,
    calculateVisibleColumns,
    viewportWidth,
    setViewportWidth
  };
};
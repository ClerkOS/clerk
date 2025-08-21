// import { useState, useEffect, useRef, useCallback } from 'react';
// // import {useVirtualizer} from "@tanstack/react-virtual";
// import {
//   ROW_BATCH_SIZE,
//   COLUMN_WIDTH,
//   ROW_HEADER_WIDTH,
//   type SpreadsheetContext,
//   type SelectionContext,
//   type ContextMenuState
// } from './gridTypes';
// import { useVirtualizer } from "@tanstack/react-virtual";
//
// export const useGrid = () => {
//   // State for visible rows
//   const [visibleRows, setVisibleRows] = useState<number>(ROW_BATCH_SIZE);
//   const [isLoadingRows, setIsLoadingRows] = useState<boolean>(false);
//   const [isLoadingColumns, setIsLoadingColumns] = useState<boolean>(false);
//   const [viewportWidth, setViewportWidth] = useState<number>(0);
//   const [isMouseDown, setIsMouseDown] = useState<boolean>(false);
//   const [contextMenu, setContextMenu] = useState<ContextMenuState>({
//     visible: false,
//     position: { x: 0, y: 0 },
//     cellId: null
//   });
//
//   const rowObserverRef = useRef<IntersectionObserver | null>(null);
//   const columnObserverRef = useRef<IntersectionObserver | null>(null);
//   const rowLoadingTriggerRef = useRef<HTMLTableRowElement>(null);
//   const columnLoadingTriggerRef = useRef<HTMLTableCellElement>(null);
//   const gridRef = useRef<HTMLDivElement>(null);
//
//   /**
//    * Virtualization
//    */
//   function getColumnName(index: number) {
//     let columnName = '';
//     while (index >= 0) {
//       columnName = String.fromCharCode(65 + (index % 26)) + columnName;
//       index = Math.floor(index / 26) - 1;
//     }
//     return columnName;
//   }
//
//   const columns = Array.from({ length: 100 }, (_, i) => getColumnName(i));
//   // console.log(columns.length)
//
//   const rowVirtualizer = useVirtualizer({
//     count: 100,
//     getScrollElement: () => gridRef.current,
//     estimateSize: () => 22, //height of row cell
//     overscan: 10
//   })
//
//   const columnVirtualizer = useVirtualizer({
//     horizontal: true,
//     // count: columns.length,
//     count: 50,
//     getScrollElement: () => gridRef.current,
//     estimateSize: () => 75, // width of column cell
//     overscan: 10
//   })
//
//   const virtualRows = rowVirtualizer.getVirtualItems()
//   const virtualCols = columnVirtualizer.getVirtualItems()
//
//   // const {
//   //   selectedCell,
//   //   setSelectedCell,
//   //   getActiveSheet,
//   //   getCell,
//   //   zoom,
//   //   addColumns,
//   //   setColumnCount,
//   //   getTotalColumns,
//   //   getColumnWidth,
//   //   updateColumnWidth
//   // } = useSpreadsheet();
//
//   // const {
//   //   startSelection,
//   //   updateSelection,
//   //   endSelection,
//   //   isSelected,
//   //   selectedCells
//   // } = useSelection();
//
//   // Debug: Log when Grid receives new active sheet
//   // useEffect(() => {
//   //   console.log('Grid component - Active sheet updated:', {
//   //     activeSheetId: activeSheet?.id,
//   //     activeSheetName: activeSheet?.name,
//   //     columnsCount: columns?.length,
//   //     hasColumns: !!columns
//   //   });
//   // }, [activeSheet?.id, activeSheet?.name, columns]);
//
//   // Handler for mouse down on grid (to start tracking)
//   const handleGridMouseDown = useCallback((e: React.MouseEvent) => {
//     if (e.button !== 0) return; // Only handle left clicks
//
//     // Don't start selection if clicking on a resize handle
//     if ((e.target as HTMLElement).closest('.resize-handle')) {
//       return;
//     }
//
//     setIsMouseDown(true);
//   }, []);
//
//   // Handler for mouse up on grid (to end tracking)
//   // const handleGridMouseUp = useCallback((e: React.MouseEvent) => {
//   //   if (e.button !== 0) return; // Only handle left clicks
//   //   setIsMouseDown(false);
//   //   endSelection();
//   // }, [endSelection]);
//
//   // Check if a cell is the currently selected "active" cell
//   // const isActiveCell = useCallback((col: string, row: number) => {
//   //   return selectedCell.col === col && selectedCell.row === row;
//   // }, [selectedCell]);
//
//   // Check if a column is currently highlighted
//   // const isHighlighted = useCallback((col: string) => {
//   //   return selectedCell.col === col;
//   // }, [selectedCell]);
//
//   // Handle cell click
//   // const handleCellClick = useCallback((col: string, row: number, e: React.MouseEvent) => {
//   //   // Set as active cell
//   //   setSelectedCell({ col, row });
//   //
//   //   if (e.shiftKey && selectedCell) {
//   //     // If shift is held, select range from active cell to clicked cell
//   //     startSelection(selectedCell.col, selectedCell.row);
//   //     updateSelection(col, row);
//   //     endSelection();
//   //   } else if (e.button === 0) {
//   //     // Start a new selection if this is a left click
//   //     startSelection(col, row);
//   //   }
//   // }, [setSelectedCell, startSelection, updateSelection, endSelection, selectedCell]);
//
//   // Handle cell hover - for selection updating during drag
//   // const handleCellHover = useCallback((col: string, row: number) => {
//   //   if (isMouseDown) {
//   //     updateSelection(col, row);
//   //   }
//   // }, [isMouseDown, updateSelection]);
//
//   // Handle column resize
//   // const handleColumnResize = useCallback((col: string, newWidth: number) => {
//   //   updateColumnWidth(col, newWidth);
//   // }, [updateColumnWidth]);
//
//   // Add window-level event listeners for mouse up (in case mouse is released outside the grid)
//   // useEffect(() => {
//   //   const handleWindowMouseUp = () => {
//   //     if (isMouseDown) {
//   //       setIsMouseDown(false);
//   //       endSelection();
//   //     }
//   //   };
//   //
//   //   window.addEventListener('mouseup', handleWindowMouseUp);
//   //
//   //   return () => {
//   //     window.removeEventListener('mouseup', handleWindowMouseUp);
//   //   };
//   // }, [isMouseDown, endSelection]);
//
//   return {
//     gridRef,
//     virtualRows,
//     virtualCols,
//     rowVirtualizer,
//     columnVirtualizer,
//     isMouseDown,
//     contextMenu,
//     columns,
//     isLoadingColumns,
//     columnLoadingTriggerRef,
//     // generateRows,
//     handleGridMouseDown,
//     // handleGridMouseUp,
//     // isActiveCell,
//     // isHighlighted,
//     // handleCellClick,
//     // handleCellHover,
//     // handleColumnResize,
//   };
// };
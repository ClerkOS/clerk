import { useEffect, useMemo, useRef, useState } from "react";
import { CELL_HEIGHT, CELL_WIDTH, CellData, defaultStyle, TOTAL_COLS, TOTAL_ROWS, VIEWPORT_BUFFER } from "./gridTypes";
import { setCell } from "../../../lib/api/apiClient";
import { columnIndexToLetter } from "../../../utils/utils";
import { useCellMap } from "../../providers/CellMapProvider";
import { useWorkbookId } from "../../providers/WorkbookProvider";
import { useActiveSheet } from "../../providers/SheetProvider";
import { useActiveCell } from "../../providers/ActiveCellProvider";

/**
 * Hook: useGrid
 * Manages spreadsheet grid rendering, scrolling, cell editing, and selection logic.
 *
 * @param workbookId - The unique ID of the workbook (used for backend updates)
 * @param sheetName - Name of the active sheet
 *
 * Handles:
 *  - Virtualized cell pool for smooth scrolling
 *  - Container size tracking
 *  - Scroll state management
 *  - Cell and range selection
 *  - Row/column selection
 *  - Cell editing and committing changes to backend
 */
// TODO: add check on double click to avoid sending empty values to backend
export function useGrid() {
  /** -------------------------
   *  Scroll and size tracking
   *  -------------------------
   */

    // Reference to the scroll container DOM element
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Stores latest scroll position outside React state for performance
  const scrollRef = useRef({ x: 0, y: 0 });

  // React state for scroll position (used for re-render)
  const [scroll, setScroll] = useState({ x: 0, y: 0 });

  // Current visible container size
  const [size, setSize] = useState({ width: 0, height: 0 });

  // requestAnimationFrame ID for throttled scroll updates
  const rafRef = useRef<number | undefined>(undefined);

  // Measure container size using ResizeObserver
  useEffect(() => {
    if (!scrollContainerRef.current) return;
    const observer = new ResizeObserver(([entry]) => {
      const { width, height } = entry.contentRect;
      setSize({ width, height });
    });

    observer.observe(scrollContainerRef.current);
    return () => observer.disconnect();
  }, []);

  // Listen to scroll events, update scroll state with rAF throttling
  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const onScroll = () => {
      scrollRef.current = {
        x: container.scrollLeft,
        y: container.scrollTop
      };
      if (!rafRef.current) {
        rafRef.current = requestAnimationFrame(() => {
          setScroll(scrollRef.current);
          rafRef.current = undefined;
        });
      }
    };

    container.addEventListener("scroll", onScroll);
    return () => container.removeEventListener("scroll", onScroll);
  }, []);

  /** -------------------------
   *  Virtualization math
   *  -------------------------
   */

    // Number of rows/cols visible at once + buffer
  const visibleCols = Math.ceil(size.width / CELL_WIDTH) + VIEWPORT_BUFFER;
  const visibleRows = Math.ceil(size.height / CELL_HEIGHT) + VIEWPORT_BUFFER;

  // Which row/col indexes to start rendering from
  const startCol = Math.floor(scroll.x / CELL_WIDTH);
  const startRow = Math.floor(scroll.y / CELL_HEIGHT);

  // Pre-create the cell pool (reuse DOM nodes instead of creating new ones)
  const cellPool = useMemo(() => {
    const pool = [];
    for (let i = 0; i < visibleRows * visibleCols; i++) {
      pool.push({ row: 0, col: 0 });
    }
    return pool;
  }, [visibleCols, visibleRows]);

  // Update pool's actual row/col coordinates
  for (let i = 0; i < cellPool.length; i++) {
    const rowOffset = Math.floor(i / visibleCols);
    const colOffset = i % visibleCols;
    cellPool[i].row = startRow + rowOffset;
    cellPool[i].col = startCol + colOffset;
  }

  // Current raw scroll values
  const scrollX = scrollContainerRef.current?.scrollLeft ?? 0;
  const scrollY = scrollContainerRef.current?.scrollTop ?? 0;

  /** -------------------------
   *  Selection & editing state
   *  -------------------------
   */

    // Single selected cell
  const [selectedCell, setSelectedCell] = useState<{ row: number; col: number } | null>(null);

  // "cell" | "row" | "col" - type of selection
  const [selectionMode, setSelectionMode] = useState<"cell" | "row" | "col">("cell");

  // Selected row/column indexes (for header highlighting)
  const [selectedRow, setSelectedRow] = useState<number | null>(null);
  const [selectedCol, setSelectedCol] = useState<number | null>(null);

  // Range selection tracking
  const [selectionStart, setSelectionStart] = useState<{ row: number; col: number } | null>(null);
  const [selectionEnd, setSelectionEnd] = useState<{ row: number; col: number } | null>(null);
  const [isSelecting, setIsSelecting] = useState(false);

  // Editing state
  const [editingCell, setEditingCell] = useState<{ row: number; col: number } | null>(null);
  const [editValue, setEditValue] = useState("");

  // workbook and sheet context
  const { workbookId } = useWorkbookId();
  const { activeSheet } = useActiveSheet();

  // Active cell context
  const { setActiveCellId } = useActiveCell();

  // Data for the grid
  const { cellDataBySheet, setCellDataBySheet } = useCellMap();
  const sheetName = activeSheet ?? "Sheet1"
  // console.log("cellDataBySheet", cellDataBySheet)
  const [cellMap, setCellMap] = useState(cellDataBySheet[sheetName]);

  // Sync cellMap with incoming props
  useEffect(() => {
    setCellMap(cellDataBySheet[sheetName]);
  }, [cellDataBySheet[sheetName]]);

  // Stop selection when mouse is released anywhere
  useEffect(() => {
    const handleGlobalMouseUp = () => setIsSelecting(false);
    window.addEventListener("mouseup", handleGlobalMouseUp);
    return () => window.removeEventListener("mouseup", handleGlobalMouseUp);
  }, []);

  /** -------------------------
   *  Event handlers
   *  -------------------------
   */

    // Single-click cell selection
  const handleCellClick = (row: number, col: number) => {
      setSelectionMode("cell");
      setSelectedCell({ row, col });
      setSelectedRow(null);
      setSelectedCol(null);
      
      // Update active cell ID for formula bar
      const cellId = `${columnIndexToLetter(col)}${row + 1}`;
      setActiveCellId(cellId);
    };

  // Double-click to enter edit mode
  const handleCellDoubleClick = (row: number, col: number) => {
    setEditingCell({ row, col });
    const addr = `${columnIndexToLetter(col)}${row + 1}`;
    setEditValue(cellMap.get(addr)?.value ?? "");
  };

  // Mouse down on column header -> select entire column
  const handleColHeaderMouseDown = (col: number) => {
    setSelectionStart({ row: 0, col });
    setSelectionEnd({ row: TOTAL_ROWS - 1, col });
    setSelectionMode("col");
    setSelectedCol(col);
    setSelectedRow(null);
    setSelectedCell(null);
    setIsSelecting(true);
  };

  // Mouse down on row header -> select entire row
  const handleRowHeaderMouseDown = (row: number) => {
    setSelectionStart({ row, col: 0 });
    setSelectionEnd({ row, col: TOTAL_COLS - 1 });
    setSelectionMode("row");
    setSelectedRow(row);
    setSelectedCol(null);
    setSelectedCell(null);
    setIsSelecting(true);
  };

  // Commit edited single cell value to frontend + backend
  const handleEditCommit = async () => {
    if (!editingCell) return;
    const addr = `${columnIndexToLetter(editingCell.col)}${editingCell.row + 1}`;
    const prevValue = cellMap.get(addr)?.value ?? "";

    // Skip if value didn't change
    if (editValue === prevValue) {
      setEditingCell(null);
      setEditValue("");
      return;
    }

// --- Update local state ---
    const newCellMap = new Map(cellMap);
    newCellMap.set(addr, {
      value: editValue,
      formula: "",
      style: defaultStyle,
    });
    setCellMap(newCellMap);

    // --- Update global context state ---
    setCellDataBySheet(prev => ({
      ...prev,
      [sheetName]: new Map(newCellMap),
    }));


    // Exit edit mode
    setEditingCell(null);
    setEditValue("");

    // Push change to backend
    await setCell(workbookId, {
      sheet: sheetName,
      address: addr,
      value: editValue
    });
  };

  // Start range selection
  const handleMouseDown = (row: number, col: number) => {
    setSelectionMode("cell");
    setSelectedCell({ row, col });
    setSelectedRow(null);
    setSelectedCol(null);
    setSelectionStart({ row, col });
    setSelectionEnd({ row, col });
    setIsSelecting(true);
    
    // Update active cell ID for formula bar
    const cellId = `${columnIndexToLetter(col)}${row + 1}`;
    setActiveCellId(cellId);
  };

  // Expand range while dragging
  const handleMouseEnter = (row: number, col: number) => {
    if (isSelecting) {
      setSelectionEnd({ row, col });
    }
  };

  // Stop selection
  const handleMouseUp = () => {
    setIsSelecting(false);
  };

  /** -------------------------
   *  Helpers
   *  -------------------------
   */

    // Check if a cell is in the current selection range
  const isCellSelected = (row: number, col: number) => {
      if (!selectionStart || !selectionEnd) return false;
      const minRow = Math.min(selectionStart.row, selectionEnd.row);
      const maxRow = Math.max(selectionStart.row, selectionEnd.row);
      const minCol = Math.min(selectionStart.col, selectionEnd.col);
      const maxCol = Math.max(selectionStart.col, selectionEnd.col);
      return row >= minRow && row <= maxRow && col >= minCol && col <= maxCol;
    };

  // Return array of highlighted row indexes
  const getHighlightedRows = () => {
    if (!selectionStart || !selectionEnd) return [];
    const minRow = Math.min(selectionStart.row, selectionEnd.row);
    const maxRow = Math.max(selectionStart.row, selectionEnd.row);
    return Array.from({ length: maxRow - minRow + 1 }, (_, i) => minRow + i);
  };

  // Return array of highlighted column indexes
  const getHighlightedCols = () => {
    if (!selectionStart || !selectionEnd) return [];
    const minCol = Math.min(selectionStart.col, selectionEnd.col);
    const maxCol = Math.max(selectionStart.col, selectionEnd.col);
    return Array.from({ length: maxCol - minCol + 1 }, (_, i) => minCol + i);
  };

  return {
    scrollContainerRef,
    scrollRef,
    scroll,
    setScroll,
    size,
    setSize,
    rafRef,
    cellPool,
    cellMap,
    setCellMap,
    scrollX,
    scrollY,
    visibleCols,
    visibleRows,
    startCol,
    startRow,
    selectedCell,
    setSelectedCell,
    editingCell,
    setEditingCell,
    editValue,
    setEditValue,
    selectionMode,
    selectedRow,
    selectedCol,
    selectionStart,
    selectionEnd,
    handleCellClick,
    handleColHeaderMouseDown,
    handleCellDoubleClick,
    handleRowHeaderMouseDown,
    handleEditCommit,
    handleMouseDown,
    handleMouseUp,
    handleMouseEnter,
    isCellSelected,
    getHighlightedRows,
    getHighlightedCols
  };
}

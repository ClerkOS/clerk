import { useState, useRef, useEffect, useMemo } from "react";
import { CELL_WIDTH, CELL_HEIGHT, VIEWPORT_BUFFER, CellData, defaultStyle } from "./gridTypes";
import { setCell } from "../../../lib/api/apiClient";
import { columnIndexToLetter } from "../../../utils/utils";

// TODO: add check on double click to avoid sending empty values to backend
export function useGrid(workbookId: string, sheetName: string, initialCellMap:Map<string, CellData>) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef({ x: 0, y: 0 });
  const [scroll, setScroll] = useState({ x: 0, y: 0 });
  const [size, setSize] = useState({ width: 0, height: 0 });
  const rafRef = useRef<number | undefined>(undefined);

  // Measure container size
  useEffect(() => {
    if (!scrollContainerRef.current) return;
    const observer = new ResizeObserver(([entry]) => {
      const { width, height } = entry.contentRect;
      setSize({ width, height });
    });

    observer.observe(scrollContainerRef.current);
    return () => observer.disconnect();
  }, []);

  // Handle scrolling
  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const onScroll = () => {
      scrollRef.current = {
        x: container.scrollLeft,
        y: container.scrollTop,
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

  // Calculate visible dimensions
  const visibleCols = Math.ceil(size.width / CELL_WIDTH) + VIEWPORT_BUFFER;
  const visibleRows = Math.ceil(size.height / CELL_HEIGHT) + VIEWPORT_BUFFER;

  // Update pool positions based on scroll
  const startCol = Math.floor(scroll.x / CELL_WIDTH);
  const startRow = Math.floor(scroll.y / CELL_HEIGHT);

  // Pre-create the pool of cells
  const cellPool = useMemo(() => {
    const pool = [];
    for (let i = 0; i < visibleRows * visibleCols; i++) {
      pool.push({ row: 0, col: 0 });
    }
    return pool;
  }, [visibleCols, visibleRows]);

  for (let i = 0; i < cellPool.length; i++) {
    const rowOffset = Math.floor(i / visibleCols);
    const colOffset = i % visibleCols;
    cellPool[i].row = startRow + rowOffset;
    cellPool[i].col = startCol + colOffset;
  }

  const scrollX = scrollContainerRef.current?.scrollLeft ?? 0;
  const scrollY = scrollContainerRef.current?.scrollTop ?? 0;

  const [selectedCell, setSelectedCell] = useState<{ row: number; col: number } | null>(null);
  const [editingCell, setEditingCell] = useState<{ row: number; col: number } | null>(null);
  const [editValue, setEditValue] = useState("");
  const [cellMap, setCellMap] = useState(initialCellMap);

  useEffect(() => {
    setCellMap(initialCellMap);
  }, [initialCellMap]);

  const handleCellClick = (row: number, col: number) => {
    setSelectedCell({ row, col });
  };

  const handleCellDoubleClick = (row: number, col: number) => {
    setEditingCell({ row, col });
    const addr = `${columnIndexToLetter(col)}${row + 1}`;
    setEditValue(cellMap.get(addr)?.value ?? "");
  };

  const handleEditCommit = async () => {
    if (!editingCell) return;
    const addr = `${columnIndexToLetter(editingCell.col)}${editingCell.row + 1}`;
    const prevValue = cellMap.get(addr)?.value ?? "";

    if (editValue === prevValue){
      setEditingCell(null);
      setEditValue("");
      return;
    }

    // Update frontend map
    setCellMap(prev => {
      const newMap = new Map(prev);
      newMap.set(addr, {
        value: editValue,
        formula: "",
        style: defaultStyle,
      });
      return newMap;
    });

    // Clear input immediately to prevent flash
    setEditingCell(null);
    setEditValue("");

    // Send to backend
    await setCell(workbookId, {
      sheet: sheetName,
      address: addr,
      value: editValue
    });
  };

  return{
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
    handleCellClick,
    handleCellDoubleClick,
    handleEditCommit
  }
}
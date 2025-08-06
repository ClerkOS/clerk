import React, { useRef, useState, useEffect, useMemo } from "react";
import { setCell, SetCellPayload } from "../../../lib/api/apiClient";

const CELL_WIDTH = 100;
const CELL_HEIGHT = 25;
const HEADER_HEIGHT = 30;
const HEADER_WIDTH = 50;
const TOTAL_ROWS = 100000;
const TOTAL_COLS = 100000;
const VIEWPORT_BUFFER = 3;

type CellStyle = {
  fontBold: boolean;
  fontItalic: boolean;
  fontSize: number;
  fontFamily: string;
  fontColor: string;
  backgroundColor: string;
  alignment: "left" | "center" | "right";
  borderStyle: string;
  borderColor: string;
  numberFormat: string;
};

const defaultStyle: CellStyle = {
  fontBold: false,
  fontItalic: false,
  fontSize: 11,
  fontFamily: "Calibri",
  fontColor: "#000000",
  backgroundColor: "#FFFFFF",
  alignment: "left",
  borderStyle: "",
  borderColor: "#000000",
  numberFormat: "General",
};

type CellData = {
  value: string;
  formula?: string;
  style?: CellStyle;
};

function indexToRowCol(index: string): { row: number; col: number } {
  const match = index.match(/([A-Z]+)([0-9]+)/);
  if (!match) throw new Error(`Invalid index: ${index}`);
  const [, colLetters, rowStr] = match;

  let col = 0;
  for (let i = 0; i < colLetters.length; i++) {
    col = col * 26 + (colLetters.charCodeAt(i) - 64);
  }
  return { row: parseInt(rowStr, 10) - 1, col: col - 1 };
}

function columnIndexToLetter(index: number): string {
  let result = "";
  index++; // make it 1-based
  while (index > 0) {
    const remainder = (index - 1) % 26;
    result = String.fromCharCode(65 + remainder) + result;
    index = Math.floor((index - 1) / 26);
  }
  return result;
}

const Grid2:React.FC = () => {
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
  const [cellMap, setCellMap] = useState<Map<string, CellData>>(new Map());

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
    await setCell("0da4ae6f-9b28-4db5-b578-55b0ff31853b", {
      sheet: "Sheet1",
      address: addr,
      value: editValue
    });

    setEditingCell(null);
  };

  return (
    <div className="relative w-full h-full">
      {/* Corner cell */}
      <div
        className="absolute top-0 left-0 bg-gray-100 dark:bg-gray-800 border-b border-r border-gray-300 dark:border-gray-700"
        style={{ width: HEADER_WIDTH, height: HEADER_HEIGHT }}
      />

      {/* Virtualized column headers */}
      <div
        className="absolute top-0 "
        style={{
          left: HEADER_WIDTH,
          height: HEADER_HEIGHT,
          width: size.width,
          overflow: "hidden",
        }}
      >
        {Array.from({ length: visibleCols }).map((_, i) => {
          const colIndex = startCol + i;
          return (
            <div
              key={colIndex}
              className=" absolute bg-gray-50 dark:bg-gray-800 border-r border-b border-gray-300 dark:border-gray-700 text-center text-xs text-gray-600"
              style={{
                transform: `translateX(${colIndex * CELL_WIDTH - scrollX}px)`,
                width: CELL_WIDTH,
                height: HEADER_HEIGHT,
                lineHeight: `${HEADER_HEIGHT}px`,
              }}
            >
              {columnIndexToLetter(colIndex)}
            </div>
          );
        })}
      </div>

      {/* Virtualized row headers */}
      <div
        className="absolute left-0 "
        style={{
          top: HEADER_HEIGHT,
          width: HEADER_WIDTH,
          height: size.height,
          overflow: "hidden",
        }}
      >
        {Array.from({ length: visibleRows }).map((_, i) => {
          const rowIndex = startRow + i;
          return (
            <div
              key={rowIndex}
              className=" absolute bg-gray-50 dark:bg-gray-800 border-b border-r border-gray-300 dark:border-gray-700 text-center text-xs text-gray-600"
              style={{
                transform: `translateY(${rowIndex * CELL_HEIGHT - scrollY}px)`,
                width: HEADER_WIDTH,
                height: CELL_HEIGHT,
                lineHeight: `${CELL_HEIGHT}px`
              }}
            >
              {rowIndex + 1}
            </div>
          );
        })}
      </div>

      {/* Scrollable grid */}
      <div
        className="absolute"
        style={{
          top: HEADER_HEIGHT,
          left: HEADER_WIDTH,
          right: 0,
          bottom: 0
        }}
      >
        <div
          ref={scrollContainerRef}
          className="w-full h-full overflow-scroll"
        >
          <div
            style={{
              width: TOTAL_COLS * CELL_WIDTH,
              height: TOTAL_ROWS * CELL_HEIGHT,
              position: "relative",
            }}
          >
            {cellPool.map(({ row, col }, index) => {
              const addr = `${columnIndexToLetter(col)}${row + 1}`;
              const cellData = cellMap.get(addr);

              return (
                <div
                  key={index}
                  onClick={() => handleCellClick(row, col)}
                  onDoubleClick={() => handleCellDoubleClick(row, col)}
                  className="absolute flex items-center justify-center border-b border-r border-gray-300 bg-white text-gray-700 text-sm dark:text-gray-100"
                  style={{
                    transform: `translate(${col * CELL_WIDTH}px, ${row * CELL_HEIGHT}px)`,
                    width: CELL_WIDTH,
                    height: CELL_HEIGHT,
                    border:
                      selectedCell?.row === row && selectedCell?.col === col
                        ? "2px solid #488cfa"
                        : "",
                  }}
                >
                  {cellData?.value ?? ""}
                </div>
              );
            })}

            {editingCell && (
              <input
                className="absolute border-[3px] rounded-none outline-none focus:outline-none"
                style={{
                  top: editingCell.row * CELL_HEIGHT,
                  left: editingCell.col * CELL_WIDTH,
                  width: CELL_WIDTH,
                  height: CELL_HEIGHT,
                  borderColor: "#488cfa",
                  borderRadius: 0
                }}
                value={editValue}
                onChange={e => setEditValue(e.target.value)}
                onBlur={handleEditCommit}
                onKeyDown={e => e.key === "Enter" && handleEditCommit()}
                autoFocus
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
// className="absolute flex items-center justify-center border-b border-r border-gray-300 bg-white text-gray-700 text-sm dark:text-gray-100"

export default Grid2
import React, { useRef, useState, useEffect, useMemo } from "react";

const CELL_WIDTH = 100;
const CELL_HEIGHT = 30;
const HEADER_HEIGHT = 30;
const HEADER_WIDTH = 50;
const TOTAL_ROWS = 100000;
const TOTAL_COLS = 100000;
const VIEWPORT_BUFFER = 3;

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

  return (
    <div className="relative w-full h-full">
      {/* Sticky headers */}
      <div
        className="absolute top-0 left-0 bg-gray-200 border border-black"
        style={{ width: HEADER_WIDTH, height: HEADER_HEIGHT }}
      />
      <div
        className="absolute top-0 "
        style={{
          left: HEADER_WIDTH,
          height: HEADER_HEIGHT,
          width: size.width,
          overflow: "hidden",
          // transform: `translateX(-${scroll.x}px)`,
          // width: TOTAL_COLS * CELL_WIDTH,
        }}
      >
        {Array.from({ length: visibleCols }).map((_, i) => {
          const colIndex = startCol + i;
          return (
            <div
              key={colIndex}
              className="absolute bg-gray-100 border border-black text-center"
              style={{
                transform: `translateX(${colIndex * CELL_WIDTH - scroll.x}px)`,
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
              className="absolute bg-gray-100 border border-black text-center"
              style={{
                transform: `translateY(${rowIndex * CELL_HEIGHT - scroll.y}px)`,
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
            {cellPool.map(({ row, col }, index) => (
              <div
                key={index}
                className="absolute flex items-center justify-center border border-gray-300 bg-white"
                style={{
                  transform: `translate(${col * CELL_WIDTH}px, ${row * CELL_HEIGHT}px)`,
                  width: CELL_WIDTH,
                  height: CELL_HEIGHT,
                }}
              >
                {`${columnIndexToLetter(col)}${row + 1}`}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Grid2
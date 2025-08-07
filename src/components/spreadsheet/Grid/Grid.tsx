import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  CELL_HEIGHT,
  CELL_WIDTH, CellData, defaultStyle,
  HEADER_HEIGHT,
  HEADER_WIDTH,
  TOTAL_COLS,
  TOTAL_ROWS,
  VIEWPORT_BUFFER,
  GridProps
} from "./gridTypes";
import { useGrid } from "./useGrid";
import { columnIndexToLetter } from "../../../utils/utils";

const Grid: React.FC<GridProps> = ({ workbookId, sheetName, initialCellMap }) => {
  const {
    scrollContainerRef,
    scrollRef,
    scroll,
    setScroll,
    size,
    setSize,
    rafRef,
    cellPool,
    visibleCols,
    visibleRows,
    startCol,
    startRow,
    scrollX,
    scrollY,
    selectedCell,
    setSelectedCell,
    editingCell,
    setEditingCell,
    cellMap,
    editValue,
    setEditValue,
    setCellMap,
    handleCellClick,
    handleCellDoubleClick,
    handleEditCommit
  } = useGrid(workbookId, sheetName, initialCellMap);

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
          overflow: "hidden"
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
                lineHeight: `${HEADER_HEIGHT}px`
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
          overflow: "hidden"
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
              position: "relative"
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
                        : ""
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
};
// className="absolute flex items-center justify-center border-b border-r border-gray-300 bg-white text-gray-700 text-sm dark:text-gray-100"

export default Grid;
import React from "react";
import { CELL_HEIGHT, CELL_WIDTH, GridProps, HEADER_HEIGHT, HEADER_WIDTH, TOTAL_COLS, TOTAL_ROWS } from "./gridTypes";
import { useGrid } from "./useGrid";
import { columnIndexToLetter } from "../../../utils/utils";
/**
 * Grid component
 * ---------------------
 * Renders a virtualized spreadsheet-like grid with:
 * - Frozen top row (column headers) and left column (row headers)
 * - Virtualization for performance (only render visible cells)
 * - Multi-cell selection via click + drag
 * - Row/column selection via header clicks
 * - Inline editing of cells
 *
 * Props:
 *  - workbookId: string — unique identifier for workbook
 *  - sheetName: string — current sheet name
 *  - initialCellMap: Map<string, CellData> — preloaded cell data
 */
const Grid: React.FC<GridProps> = ({ workbookId, sheetName, initialCellMap }) => {
  const {
    scrollContainerRef,
    size,
    cellPool,
    cellMap,
    scrollX,
    scrollY,
    visibleCols,
    visibleRows,
    startCol,
    startRow,
    selectedCell,
    editingCell,
    editValue,
    setEditValue,
    selectionMode,
    selectedRow,
    selectedCol,
    selectionStart,
    selectionEnd,
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
  } = useGrid(workbookId, sheetName, initialCellMap);

  return (
    <div className="relative w-full h-full">
      {/* ---------------------------------------------------------------------- */}
      {/*                     Corner cell (intersection of headers)               */}
      {/* ---------------------------------------------------------------------- */}
      <div
        className="absolute top-0 left-0 bg-gray-100 dark:bg-gray-800 border-b border-r border-gray-300 dark:border-gray-700"
        style={{ width: HEADER_WIDTH, height: HEADER_HEIGHT }}
      />
      {/* ---------------------------------------------------------------------- */}
      {/*                      Virtualized column headers                         */}
      {/* ---------------------------------------------------------------------- */}
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
          const isHighlighted = getHighlightedCols().includes(colIndex);

          return (
            <div
              key={colIndex}
              onMouseDown={() => handleColHeaderMouseDown(colIndex)}
              className={`absolute border-r border-b border-gray-300 dark:border-gray-700 text-center text-xs text-gray-600 cursor-pointer
        ${isHighlighted ? "bg-blue-100 dark:bg-blue-800" : "bg-gray-50 dark:bg-gray-800"}`}
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

      {/* ---------------------------------------------------------------------- */}
      {/*                      Virtualized row headers                           */}
      {/* ---------------------------------------------------------------------- */}
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
          const isHighlighted = getHighlightedRows().includes(rowIndex);

          return (
            <div
              key={rowIndex}
              onMouseDown={() => handleRowHeaderMouseDown(rowIndex)}
              className={`absolute border-b border-r border-gray-300 dark:border-gray-700 text-center text-xs text-gray-600 cursor-pointer
        ${isHighlighted ? "bg-blue-100 dark:bg-blue-800" : "bg-gray-50 dark:bg-gray-800"}`}
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

      {/* ---------------------------------------------------------------------- */}
      {/*                      Scrollable grid container                          */}
      {/* ---------------------------------------------------------------------- */}
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
            {/* Render visible cells */}
            {cellPool.map(({ row, col }, index) => {
              const addr = `${columnIndexToLetter(col)}${row + 1}`;
              const cellData = cellMap.get(addr);
              const value = cellData?.value ?? "";
              const isNumber = !isNaN(Number(value)) && value.trim() !== "";
              const justifyClass = isNumber ? "justify-end" : "justify-start";
              const inSelection = isCellSelected(row, col);

              // Compute selection borders for range highlight
              let borderStyles: React.CSSProperties = {};
              if (selectionStart && selectionEnd && inSelection) {
                const minRow = Math.min(selectionStart.row, selectionEnd.row);
                const maxRow = Math.max(selectionStart.row, selectionEnd.row);
                const minCol = Math.min(selectionStart.col, selectionEnd.col);
                const maxCol = Math.max(selectionStart.col, selectionEnd.col);

                if (row === minRow) borderStyles.borderTop = "2px solid #488cfa";
                if (row === maxRow) borderStyles.borderBottom = "2px solid #488cfa";
                if (col === minCol) borderStyles.borderLeft = "2px solid #488cfa";
                if (col === maxCol) borderStyles.borderRight = "2px solid #488cfa";
              }

              // Highlight states
              const isHighlighted =
                (selectionMode === "cell" && selectedCell?.row === row && selectedCell?.col === col) ||
                (selectionMode === "row" && selectedRow === row) ||
                (selectionMode === "col" && selectedCol === col) ||
                inSelection;

              return (
                <div
                  key={index}
                  onDoubleClick={() => handleCellDoubleClick(row, col)}
                  onMouseDown={() => handleMouseDown(row, col)}
                  onMouseEnter={() => handleMouseEnter(row, col)}
                  onMouseUp={handleMouseUp}
                  className={`absolute flex items-center ${justifyClass} border-b border-r border-gray-300 text-sm
        ${isHighlighted ? "bg-blue-100 dark:bg-blue-800" : "bg-white dark:bg-gray-900"}`}
                  style={{
                  transform: `translate(${col * CELL_WIDTH}px, ${row * CELL_HEIGHT}px)`,
                  width: CELL_WIDTH,
                  height: CELL_HEIGHT,
                    ...borderStyles
                }}
                >
                  {value}
                </div>
              );
            })}
            {/* Editing input */}
            {editingCell && (
              <input
                className="absolute border-[3px] rounded-none outline-none focus:outline-none text-sm"
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
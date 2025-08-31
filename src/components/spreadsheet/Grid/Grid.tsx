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
const Grid: React.FC = () => {
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
    getHighlightedCols,
    animatingCells,
  } = useGrid();

  return (
    <div className="relative w-full h-full">
      {/* ---------------------------------------------------------------------- */}
      {/*                     Corner cell (intersection of headers)              */}
      {/* ---------------------------------------------------------------------- */}
      <div
        className="absolute top-0 left-0 bg-gray-50/80 dark:bg-gray-800/80 backdrop-blur-sm border-b border-r border-gray-200 dark:border-gray-600"
        style={{ width: HEADER_WIDTH, height: HEADER_HEIGHT }}
      />
      {/* ---------------------------------------------------------------------- */}
      {/*                      Virtualized column headers                        */}
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
              className={`absolute border-r border-b border-gray-200 dark:border-gray-600 text-center text-xs text-gray-600 cursor-pointer transition-colors duration-150 hover:bg-gray-100/50
        ${isHighlighted ? "bg-blue-100 dark:bg-blue-800" : "bg-gray-50/80 dark:bg-gray-800/80 backdrop-blur-sm"}`}
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
              className={`absolute border-b border-r border-gray-200 dark:border-gray-600 text-center text-xs text-gray-600 cursor-pointer transition-colors duration-150 hover:bg-gray-100/50
        ${isHighlighted ? "bg-blue-100 dark:bg-blue-800" : "bg-gray-50/80 dark:bg-gray-800/80 backdrop-blur-sm"}`}
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
              const cellStyle = cellData?.style;
              

              const isNumber = !isNaN(Number(value)) && value.trim() !== "";
              
              // Apply alignment from cell style or default based on content type
              let justifyClass = "justify-start";
              if (cellStyle?.alignment) {
                justifyClass = cellStyle.alignment === "center" ? "justify-center" : 
                              cellStyle.alignment === "right" ? "justify-end" : "justify-start";
              } else {
                justifyClass = isNumber ? "justify-end" : "justify-start";
              }

              // Calculate text overflow for Excel-like behavior
              const calculateTextOverflow = () => {
                if (!value || value.trim() === "") return { width: CELL_WIDTH, zIndex: 0 };
                
                // More accurate text width measurement (cached canvas)
                const measureTextWidth = (text: string) => {
                  // Use a more sophisticated estimation based on font properties
                  const baseFontSize = cellStyle?.fontSize || 11;
                  const fontFamily = cellStyle?.fontFamily || 'Calibri';
                  const isBold = cellStyle?.fontBold || false;
                  
                  // Character width estimation based on font properties
                  let charWidth = baseFontSize * 0.6; // Base character width
                  if (isBold) charWidth *= 1.1; // Bold text is slightly wider
                  if (fontFamily.includes('Mono')) charWidth *= 0.8; // Monospace is more predictable
                  
                  return text.length * charWidth;
                };
                
                const textWidth = measureTextWidth(value);
                const availableWidth = CELL_WIDTH - 24; // Account for padding
                
                if (textWidth <= availableWidth) {
                  return { width: CELL_WIDTH, zIndex: 0 };
                }
                
                // Check if adjacent cells are empty and allow overflow
                let extendedWidth = CELL_WIDTH;
                let canExtend = true;
                let checkCol = col + 1;
                const maxCols = Math.min(visibleCols + startCol, col + 5); // Limit to 5 columns max
                
                while (canExtend && extendedWidth < textWidth + 24 && checkCol < maxCols) {
                  const nextAddr = `${columnIndexToLetter(checkCol)}${row + 1}`;
                  const nextCellData = cellMap.get(nextAddr);
                  
                  if (!nextCellData || !nextCellData.value || nextCellData.value.trim() === "") {
                    extendedWidth += CELL_WIDTH;
                    checkCol++;
                  } else {
                    canExtend = false;
                  }
                }
                
                return { 
                  width: Math.min(extendedWidth, textWidth + 24), 
                  zIndex: extendedWidth > CELL_WIDTH ? 10 : 0 
                };
              };

              const { width: cellDisplayWidth, zIndex } = calculateTextOverflow();
               const baseClass = "absolute flex items-center border-b border-r border-gray-200 text-sm px-3 py-2 transition-colors duration-150 hover:bg-gray-50/50";
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

               const isAnimating = animatingCells.has(addr);
               // animatingCells.add("A1")
               // animatingCells.add("A2")
               // animatingCells.add("A3")
               // animatingCells.add("A4")
               // animatingCells.add("A5")
               // const isAnimating = true;
               // if (animatingCells.size > 0){
               //    console.log("Grid render - animatingCells size:", animatingCells.size);
               //    console.log("Grid render - animatingCells contents:", Array.from(animatingCells));
               // }

               const getBackgroundClass = () => {
                  if (isAnimating) {
                     return "bg-blue-100 shadow-lg border-blue-300";
                  } else if (isHighlighted) {
                     return "bg-blue-100 animate-pulse scale-105 shadow-lg border-blue-300";
                  } else if (cellStyle?.backgroundColor && cellStyle.backgroundColor !== "#FFFFFF") {
                     // Cell has custom background from Excel - don't apply alternating colors
                     return "";
                  } else {
                     // Alternating row colors for better readability (only for cells without custom backgrounds)
                     const isEvenRow = row % 2 === 0;
                     return isEvenRow ? "bg-white dark:bg-gray-900" : "bg-gray-50/30 dark:bg-gray-800/50";
                  }
               };

               const animatingClasses = getBackgroundClass();

               // Generate inline styles from cell style
               const generateCellStyles = (): React.CSSProperties => {
                 const styles: React.CSSProperties = {
                   transform: `translate(${col * CELL_WIDTH}px, ${row * CELL_HEIGHT}px)`,
                   width: cellDisplayWidth, // Use calculated width for overflow
                   height: CELL_HEIGHT,
                   zIndex: zIndex, // Higher z-index for overflowing cells
                   ...borderStyles,
                 };

                 // For overflowing text, we need special handling
                 if (cellDisplayWidth > CELL_WIDTH) {
                   styles.overflow = 'visible';
                   styles.whiteSpace = 'nowrap';
                 } else if (value.length > 15) { // If text is long but can't overflow
                   styles.overflow = 'hidden';
                   styles.textOverflow = 'ellipsis';
                   styles.whiteSpace = 'nowrap';
                 }

                 if (cellStyle) {
                   // Apply font properties
                   if (cellStyle.fontBold) styles.fontWeight = 'bold';
                   if (cellStyle.fontItalic) styles.fontStyle = 'italic';
                   if (cellStyle.fontSize && cellStyle.fontSize > 0) styles.fontSize = `${cellStyle.fontSize}px`;
                   if (cellStyle.fontFamily) styles.fontFamily = cellStyle.fontFamily;
                   if (cellStyle.fontColor) styles.color = cellStyle.fontColor;
                   
                   // Apply background color (only if not highlighted/animated)
                   if (cellStyle.backgroundColor && !isAnimating && !isHighlighted) {
                     styles.backgroundColor = cellStyle.backgroundColor;
                   }
                 }

                 return styles;
               };

               return (
                <div
                  key={index}
                  onDoubleClick={() => handleCellDoubleClick(row, col)}
                  onMouseDown={() => handleMouseDown(row, col)}
                  onMouseEnter={() => handleMouseEnter(row, col)}
                  onMouseUp={handleMouseUp}
                  className={`${baseClass} ${justifyClass} ${animatingClasses}`}
                  style={generateCellStyles()}
                >
                  {value}
                </div>
              );
            })}
            {/* Editing input */}
            {editingCell && (
              <input
                className="absolute border-[3px] border-blue-400 rounded-none outline-none focus:outline-none text-sm px-3 py-2 bg-white shadow-lg"
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
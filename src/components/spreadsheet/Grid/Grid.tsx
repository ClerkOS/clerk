import React from "react";
import { useGrid } from "./useGrid";
import { type GridProps } from "./gridTypes";
import ColumnHeader from "../ColumnHeader/ColumnHeader";
import Cell from "../Cell/Cell";
import sheet from "../Sheet/Sheet";


const Grid: React.FC<GridProps> = ({ workbookId, workbookSheets, sheetData, isEditing, onEditingChange }) => {
  const {
    gridRef,
    virtualRows,
    virtualCols,
    columnVirtualizer,
    columnLoadingTriggerRef,
    isMouseDown,
    contextMenu,
    columns,
    isLoadingColumns,
    // generateRows,
    handleGridMouseDown,
    // handleGridMouseUp,
    // isActiveCell,
    // isHighlighted,
    // handleCellClick,
    // handleCellHover,
    // handleColumnResize,
  } = useGrid();


  return (
    <div
      ref={gridRef}
      className="flex-1 overflow-auto p-0 relative w-full bg-white dark:bg-gray-900"
      onMouseDown={handleGridMouseDown}
      style={{
        fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
        height: "100%" // Grid should take up all vertical space of its parent
      }}
    >
      <div style={{ width: columnVirtualizer.getTotalSize() }}>
        <table
          className="border-collapse table-fixed w-full bg-white dark:bg-gray-900"
          // style={{ width: columnVirtualizer.getTotalSize() }}
        >
          {/* Defines column widths */}
          {/* First column is the row header */}
          {/* For each virtualized column, set its width */}
          <colgroup>
            <col style={{ width: "18px" }} />
            {virtualCols.map(virtualCol => (
              <col key={columns[virtualCol.index]} style={{ width: `${virtualCol.size}px` }} />
            ))}
          </colgroup>

          {/* Sticky column header */}
          <thead className="sticky top-0 z-20 bg-white dark:bg-gray-800 ">
          <tr>
            {/* Sticky top-left corner cell (row header column header) */}
            <th
              className="sticky left-0 z-30 bg-gray-300  dark:bg-gray-800 border border-gray-300 dark:border-gray-700"
            ></th>
            {/* Render visible column headers */}
            {virtualCols.map(virtualCol => {
              const col = columns[virtualCol.index];
              return (
                <ColumnHeader
                  key={col}
                  label={col}
                  isHighlighted={false}
                  onResize={() => {
                  }}
                  width={virtualCol.size}
                />
              );
            })}
            {/* Trigger for lazy loading more columns */}
            <th ref={columnLoadingTriggerRef} className="w-6 sm:w-8 bg-transparent border-none">
              {isLoadingColumns && (
                <div className="flex justify-center items-center py-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-purple-500" />
                </div>
              )}
            </th>
          </tr>
          </thead>

          <tbody>
          {/* Spacer row before the first visible virtual row */}
          <tr style={{ height: `${virtualRows[0]?.start ?? 0}px` }}></tr>

          {/* Render visible virtual rows */}
          {virtualRows.map(virtualRow => {
            const rowIndex = virtualRow.index;

            return (
              <tr key={virtualRow.key}
                  style={{ height: `${virtualRow.size}px` }} // Height of each row
              >
                {/* Sticky row header (left side of table) */}
                <td
                  className="sticky left-0 z-10 bg-gray-200 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 text-xs sm:text-xs">
                  {rowIndex + 1}
                </td>

                {/* Render each visible virtual cell in the row */}
                {virtualCols.map(virtualCol => {
                  const col = columns[virtualCol.index];
                  const cellId = `${col}${rowIndex + 1}`;
                  const activeSheet = workbookSheets?.[0]
                  const cellData = sheetData?.[activeSheet]?.[cellId]

                  return (
                    <Cell
                      key={cellId}
                      col={col}
                      row={String(rowIndex + 1)}
                      value={cellData?.value || ""}
                      formula={cellData?.formula || ""}
                      style={cellData?.style || {}}
                      workbookId={workbookId}
                    />
                  );
                })}
                {/* Empty padding cell at end of each row */}
                <td className="w-6 sm:w-8 bg-transparent border-none" />
              </tr>
            );
          })}
          </tbody>
        </table>

      </div>
    </div>
  );
};

export default Grid;
import React, { useEffect } from "react";
import { useGrid } from "../components/spreadsheet/Grid/useGrid";
import { type GridProps } from "../components/spreadsheet/Grid/gridTypes";
import ColumnHeader from "../components/spreadsheet/ColumnHeader/ColumnHeader";
import Cell from "../components/spreadsheet/Cell/Cell";
import { useActiveSheet } from "../components/providers/SheetProvider";
import RowHeader from "../components/spreadsheet/RowHeader/RowHeader";


const Grid: React.FC<GridProps> = ({ workbookId, workbookSheets, sheetData, isEditing, onEditingChange }) => {
  const {
    gridRef,
    virtualRows,
    virtualCols,
    rowVirtualizer,
    columnVirtualizer,
    columnLoadingTriggerRef,
    isMouseDown,
    contextMenu,
    columns,
    isLoadingColumns,
    handleGridMouseDown
  } = useGrid();

  const { activeSheet, setActiveSheet } = useActiveSheet();

  useEffect(() => {
    if (workbookSheets.length > 0) {
      setActiveSheet(workbookSheets[0]);
    }
  }, [workbookSheets]);


  return (
    <>
      <div
        ref={gridRef}
        className="flex-1 p-0 relative bg-white dark:bg-gray-900"
        style={{ overflow: "auto", width: "100%", height: "100%", fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" }}
      >
        <div
          style={{
            height: `${rowVirtualizer.getTotalSize()}px`,
            width: `${columnVirtualizer.getTotalSize()}px`,
            position: 'relative',
          }}
        >
          {rowVirtualizer.getVirtualItems().map((virtualRow) =>(
            <React.Fragment key={virtualRow.index}>
              {columnVirtualizer.getVirtualItems().map(virtualCol => {
                const rowIndex = virtualRow.index;
                const colIndex = virtualCol.index;
                const col = columns[virtualCol.index];
                const cellId = `${col}${virtualRow.index + 1}`;
                const cellData = activeSheet ? sheetData?.[activeSheet]?.[cellId] : undefined;

                return (
                  <Cell
                    key={cellId}
                    col={col}
                    row={String(rowIndex + 1)}
                    value={cellData?.value || ""}
                    formula={cellData?.formula || ""}
                    style={cellData?.style || {}}
                    workbookId={workbookId}
                    left={virtualCol.start + 40}
                    top={virtualRow.start + 22}
                    width={virtualCol.size}
                    height={virtualRow.size}
                  />
                );
              })}
            </React.Fragment>
          ))}

          {/* ROW HEADERS */}
          {rowVirtualizer.getVirtualItems().map((virtualRow) => (
            <div
              key={`row-header-${virtualRow.index}`}
              className=" bg-gray-200 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 text-center text-xs sm:text-xs"
              style={{
                position: 'absolute',
                top: virtualRow.start + 22,
                left: 0,
                width: 40,
                height: virtualRow.size,
                zIndex: 2,
              }}
            >
              {virtualRow.index + 1}
            </div>
          ))}

          {/* COLUMN HEADERS */}
          {columnVirtualizer.getVirtualItems().map((virtualCol) => (
            <div
              key={`col-header-${virtualCol.index}`}
              className="text-center text-xs sm:text-sm font-medium bg-gray-200 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 cursor-col-resize hover:bg-blue-500/50 group resize-handle"

              style={{
                position: 'absolute',
                top: 0,
                left: virtualCol.start + 40,
                height: 22,
                width: virtualCol.size,
                zIndex: 2,
              }}
            >
              {columns[virtualCol.index]}
            </div>
          ))}

          {/* TOP LEFT CORNER */}
          <div
            className="bg-gray-100 dark:bg-gray-800 border-b border-r border-gray-300 dark:border-gray-700"
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: 40,
              height: 22,
              zIndex: 3,
            }}
          />
        </div>
      </div>
    </>
  );
};

export default Grid;
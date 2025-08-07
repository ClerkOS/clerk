// import React, { useEffect } from "react";
// import { useGrid } from "./useGrid";
// import { type GridProps } from "./gridTypes";
// import ColumnHeader from "../ColumnHeader/ColumnHeader";
// import Cell from "../Cell/Cell";
// import { useActiveSheet } from "../../providers/SheetProvider";
// import RowHeader from "../RowHeader/RowHeader";
//
//
// const Grid: React.FC<GridProps> = ({ workbookId, workbookSheets, sheetData, isEditing, onEditingChange }) => {
//   const {
//     gridRef,
//     virtualRows,
//     virtualCols,
//     rowVirtualizer,
//     columnVirtualizer,
//     columnLoadingTriggerRef,
//     isMouseDown,
//     contextMenu,
//     columns,
//     isLoadingColumns,
//     handleGridMouseDown
//   } = useGrid();
//
//   const { activeSheet, setActiveSheet } = useActiveSheet();
//
//   useEffect(() => {
//     if (workbookSheets.length > 0) {
//       setActiveSheet(workbookSheets[0]);
//     }
//   }, [workbookSheets]);
//
//
//   return (
//     <div className="flex-1 p-0 relative bg-white dark:bg-gray-900">
//       <div
//         ref={gridRef}
//         style={{ overflow: "auto", width: "100%", height: "100%", fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif", }}
//         onMouseDown={handleGridMouseDown}
//       >
//         <div style={{ width: columnVirtualizer.getTotalSize(), height: rowVirtualizer.getTotalSize()}}>
//           <table
//             className="border-collapse table-fixed bg-white dark:bg-gray-900"
//             style={{ width: columnVirtualizer.getTotalSize() }}
//           >
//             {/* Defines column widths */}
//             {/* First column is the row header */}
//             {/* For each virtualized column, set its width */}
//             <colgroup>
//               <col style={{ width: "35px" }} />
//               {virtualCols.map(virtualCol => (
//                 <col key={columns[virtualCol.index]} style={{ width: `35px`, minWidth: `35px` }} />
//               ))}
//             </colgroup>
//
//             {/* Sticky column header */}
//             <thead className="sticky top-0 z-20 bg-white dark:bg-gray-800 ">
//             <tr>
//               {/* Sticky top-left corner cell (row header column header) */}
//               <th className="sticky left-0 z-30 bg-gray-300  dark:bg-gray-800 border border-gray-300 dark:border-gray-700"></th>
//               {/* Render visible column headers */}
//               {virtualCols.map(virtualCol => {
//                 const col = columns[virtualCol.index];
//                 return (
//                   <ColumnHeader
//                     key={col}
//                     label={col}
//                     isHighlighted={false}
//                     onResize={() => {}}
//                     width={virtualCol.size}
//                   />
//                 );
//               })}
//             </tr>
//             </thead>
//
//             <tbody>
//             <tr>
//               <td style={{ height: virtualRows[0]?.start ?? 0 }} colSpan={virtualCols.length + 1}></td>
//             </tr>
//
//             {/* Render visible virtual rows */}
//             {virtualRows.map(virtualRow => {
//               const rowIndex = virtualRow.index;
//
//               return (
//                 <tr
//                   key={virtualRow.key}
//                   style={{ height: `${virtualRow.size}px` }} // Height of each row
//                 >
//                   {/* Sticky row header (left side of table) */}
//                   <RowHeader
//                     rowIndex={rowIndex}
//                     height={virtualRow.size}
//                   />
//                   {/* Render each visible virtual cell in the row */}
//                   {virtualCols.map(virtualCol => {
//                     const col = columns[virtualCol.index];
//                     const cellId = `${col}${rowIndex + 1}`;
//                     const cellData = activeSheet ? sheetData?.[activeSheet]?.[cellId] : undefined;
//
//                     return (
//                       <Cell
//                         key={cellId}
//                         col={col}
//                         row={String(rowIndex + 1)}
//                         value={cellData?.value || ""}
//                         formula={cellData?.formula || ""}
//                         style={cellData?.style || {}}
//                         workbookId={workbookId}
//                       />
//                     );
//                   })}
//                 </tr>
//               );
//             })}
//             </tbody>
//           </table>
//
//         </div>
//       </div>
//
//     </div>
//   );
// };
//
// export default Grid;
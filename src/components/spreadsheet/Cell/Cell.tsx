// import React from "react";
// // import { useSpreadsheet } from '../../context/SpreadsheetContext.jsx';
// // import { useFormulaPreview } from '../../context/FormulaPreviewContext.jsx';
// // import { useCell, useEditCell } from '../../features/useSpreadsheetQueries.js';
// // import { useDarkMode } from '../../features/useDarkMode.js';
// import { CellProps } from "./cellTypes.js";
// import useCell from "./useCell";
// import { useActiveCell } from "../../providers/ActiveCellProvider";
// import { useGrid } from "../Grid/useGrid";
//
// // TODO: Re-add formula preview overlay
// const Cell: React.FC<CellProps> = ({ col, row, value, formula, style, workbookId, top, left, width, height }) => {
//   const cellId = `${col}${row}`;
//   const { activeCellId, setActiveCellId } = useActiveCell()
//   let isActive = activeCellId === cellId
//
//   const {
//     isEditing,
//     isLoading,
//     isError,
//     draftValue,
//     setDraftValue,
//     draftFormula,
//     setDraftFormula,
//     inputRef,
//     cellRef,
//     getCellClasses,
//     getCellStyles,
//     handleClick,
//     handleDoubleClick,
//     handleChange,
//     saveCellChange,
//     handleKeyDown,
//   } = useCell({ col, row, value, formula, style, workbookId, cellId, isActive, setActiveCellId  });
//
//   const {
//     rowVirtualizer,
//     columnVirtualizer
//   } = useGrid()
//
//
//
//   // Show loading state if React Query is loading
//   if (isLoading) {
//     return (
//       <div
//         // className={getCellClasses()}
//         className={"px-1 sm:px-2 py-1 color-transition "}
//         data-cell={cellId}
//         style={getCellStyles(style)}
//       >
//         <div className="w-full h-full flex items-center justify-center">
//           <div className="w-4 h-4 bg-gray-300 rounded animate-pulse"></div>
//         </div>
//       </div>
//     );
//   }
//
//   // Show error state if React Query has an error
//   if (isError) {
//     return (
//       <div
//         className={getCellClasses()}
//         data-cell={cellId}
//         style={getCellStyles(style)}
//       >
//         <div className="w-full h-full flex items-center justify-center">
//           <div className="w-4 h-4 bg-red-500 rounded animate-pulse"></div>
//         </div>
//       </div>
//     );
//   }
//
//   return (
//     <div
//       ref={cellRef}
//       onMouseDown={handleClick}
//       // onMouseEnter={onMouseEnter}
//       onDoubleClick={handleDoubleClick}
//       data-cell={cellId}
//       className={getCellClasses()}
//       // className={"px-1 sm:px-2 py-1 color-transition dark:bg-transparent border-2 border-blue-400 dark:border-white "}
//       style={{
//         position: "absolute",
//         transform: `translateX(${left}px) translateY(${top}px)`,
//         width,
//         height,
//         ...getCellStyles(style),
//       }}
//     >
//       {isEditing ? (
//         <input
//           ref={inputRef}
//           type="text"
//           value={draftValue}
//           onChange={handleChange}
//           onBlur={saveCellChange}
//           onKeyDown={handleKeyDown}
//           className="w-full h-full bg-transparent border-none outline-none text-gray-800 dark:text-gray-100"
//           style={getCellStyles(style)}
//         />
//       ) : (
//         <div className="relative w-full h-full text-gray-700 dark:text-gray-100">
//           <div className="absolute -inset-px pointer-events-none" />
//           {value || (formula ? `=${formula}` : "")}
//         </div>
//       )}
//     </div>
//   );
// };
//
// export default React.memo(Cell);
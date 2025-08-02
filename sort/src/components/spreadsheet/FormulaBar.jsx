// import React from 'react';
// import { useSpreadsheet } from '../../context/SpreadsheetContext.jsx';
//
// const FormulaBar = () => {
//   const { selectedCell, activeFormula, setActiveFormula } = useSpreadsheet();
//
//   const cellRef = `${selectedCell.col}${selectedCell.row}`;
//
//   return (
//     <div
//       className="flex items-center px-2 py-1 bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700"
//       style={{ fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" }}
//     >
//       <span className="cell-ref bg-gray-100 border border-gray-200 rounded px-3 sm:px-6 py-1 sm:py-2 text-blue-600 font-mono mr-2 sm:mr-4 text-xs sm:text-base">
//         {cellRef}
//       </span>
//       <input
//         type="text"
//         className="flex-1 px-2 py-1 rounded border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 text-xs sm:text-sm"
//         value={activeFormula}
//         onChange={(e) => setActiveFormula(e.target.value)}
//         style={{ fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" }}
//       />
//     </div>
//   );
// };
//
// export default FormulaBar;
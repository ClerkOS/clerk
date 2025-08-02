// import React, { useState, useRef, useEffect } from 'react';
// import { Search, Calculator, DollarSign, CheckSquare, Type, Calendar, Search as SearchIcon, GripVertical } from 'lucide-react';
// import { useTheme } from '../../context/ThemeContext.jsx';
// import { useFormulaPreview } from '../../context/FormulaPreviewContext.jsx';
// import { useSpreadsheet } from '../../context/SpreadsheetContext.jsx';
// import { useEditCell, useEvaluateFormula } from '../../features/useSpreadsheetQueries.js';
//
// const formulaCategories = [
//   {
//     id: 'math',
//     label: 'Math & Statistics',
//     icon: <Calculator size={16} />,
//     expanded: true,
//     functions: [
//       { name: 'SUM', syntax: '=SUM(range)', description: 'Adds all numbers in a range of cells' },
//       { name: 'AVERAGE', syntax: '=AVERAGE(range)', description: 'Calculates the arithmetic mean of numbers' },
//       { name: 'COUNT', syntax: '=COUNT(range)', description: 'Counts cells containing numbers' },
//       { name: 'MAX', syntax: '=MAX(range)', description: 'Returns the largest value in a set' },
//       { name: 'MIN', syntax: '=MIN(range)', description: 'Returns the smallest value in a set' },
//       { name: 'ROUND', syntax: '=ROUND(number, digits)', description: 'Rounds a number to specified decimal places' }
//     ]
//   },
//   {
//     id: 'logical',
//     label: 'Logical & Conditional',
//     icon: <CheckSquare size={16} />,
//     expanded: false,
//     functions: [
//       { name: 'IF', syntax: '=IF(condition, true_value, false_value)', description: 'Returns different values based on condition' },
//       { name: 'SUMIF', syntax: '=SUMIF(range, criteria, sum_range)', description: 'Sums cells that meet a criteria' },
//       { name: 'COUNTIF', syntax: '=COUNTIF(range, criteria)', description: 'Counts cells that meet a criteria' },
//       { name: 'AND', syntax: '=AND(condition1, condition2, ...)', description: 'Returns TRUE if all conditions are true' },
//       { name: 'OR', syntax: '=OR(condition1, condition2, ...)', description: 'Returns TRUE if any condition is true' },
//       { name: 'IFERROR', syntax: '=IFERROR(formula, error_value)', description: 'Returns custom value if formula has error' },
//       { name: 'ISBLANK', syntax: '=ISBLANK(cell)', description: 'Tests if cell is empty' }
//     ]
//   },
//   {
//     id: 'lookup',
//     label: 'Lookup & Reference',
//     icon: <SearchIcon size={16} />,
//     expanded: false,
//     functions: [
//       { name: 'VLOOKUP', syntax: '=VLOOKUP(lookup, table, col, exact)', description: 'Searches vertically in a table for a value' },
//       { name: 'XLOOKUP', syntax: '=XLOOKUP(lookup, array, return)', description: 'Modern lookup function (Excel 365)' },
//       { name: 'INDEX', syntax: '=INDEX(array, row, col)', description: 'Returns value at intersection of row and column' },
//       { name: 'MATCH', syntax: '=MATCH(lookup, array, type)', description: 'Finds position of value in array' }
//     ]
//   },
//   {
//     id: 'text',
//     label: 'Text Functions',
//     icon: <Type size={16} />,
//     expanded: false,
//     functions: [
//       { name: 'CONCATENATE', syntax: '=CONCATENATE(text1, text2, ...)', description: 'Joins multiple text strings together' },
//       { name: 'LEN', syntax: '=LEN(text)', description: 'Returns the length of text string' },
//       { name: 'LEFT', syntax: '=LEFT(text, num_chars)', description: 'Extracts characters from left of text' },
//       { name: 'RIGHT', syntax: '=RIGHT(text, num_chars)', description: 'Extracts characters from right of text' },
//       { name: 'MID', syntax: '=MID(text, start, length)', description: 'Extracts characters from middle of text' },
//       { name: 'TRIM', syntax: '=TRIM(text)', description: 'Removes extra spaces from text' }
//     ]
//   },
//   {
//     id: 'date',
//     label: 'Date & Time',
//     icon: <Calendar size={16} />,
//     expanded: false,
//     functions: [
//       { name: 'TODAY', syntax: '=TODAY()', description: 'Returns today\'s date' },
//       { name: 'NOW', syntax: '=NOW()', description: 'Returns current date and time' },
//       { name: 'DATE', syntax: '=DATE(year, month, day)', description: 'Creates date from year, month, day' },
//       { name: 'YEAR', syntax: '=YEAR(date)', description: 'Extracts year from date' },
//       { name: 'MONTH', syntax: '=MONTH(date)', description: 'Extracts month from date' },
//       { name: 'DAY', syntax: '=DAY(date)', description: 'Extracts day from date' },
//       { name: 'DATEDIF', syntax: '=DATEDIF(start, end, unit)', description: 'Calculates difference between dates' }
//     ]
//   }
// ];
//
// const FormulaBuilder = ({ onWidthChange }) => {
//   const { theme } = useTheme();
//   const { setPreview, clearPreview } = useFormulaPreview();
//   const { selectedCell, updateCellWithFormula } = useSpreadsheet();
//   const [activeCategory, setActiveCategory] = useState('math');
//   const [searchQuery, setSearchQuery] = useState('');
//   const [selectedFunction, setSelectedFunction] = useState(null);
//   const [formula, setFormula] = useState('');
//   const [targetCell, setTargetCell] = useState('A1');
//   const [targetRange, setTargetRange] = useState('');
//   const [previewResult, setPreviewResult] = useState('');
//   const [width, setWidth] = useState(320);
//   const [selectedTarget, setSelectedTarget] = useState('current'); // 'current', 'column', or 'row'
//   const isResizing = useRef(false);
//   const startX = useRef(0);
//   const startWidth = useRef(0);
//   const formulaEditorRef = useRef(null);
//   const targetSelectorRef = useRef(null);
//
//   // React Query features
//   const editCellMutation = useEditCell();
//   const evaluateFormulaMutation = useEvaluateFormula();
//
//   const handleFunctionSelect = (func) => {
//     setSelectedFunction(func);
//     setFormula(func.syntax);
//     // Scroll to the "Apply Formula To" section at the top
//     targetSelectorRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
//     // Also scroll the panel to the top
//     const panel = targetSelectorRef.current?.closest('.overflow-y-auto');
//     if (panel) {
//       panel.scrollTo({ top: 0, behavior: 'smooth' });
//     }
//   };
//
//   const handleMouseDown = (e) => {
//     isResizing.current = true;
//     startX.current = e.clientX;
//     startWidth.current = width;
//     document.body.style.cursor = 'ew-resize';
//     document.body.style.userSelect = 'none';
//   };
//
//   const handleMouseMove = (e) => {
//     if (!isResizing.current) return;
//     const delta = startX.current - e.clientX;
//     const newWidth = Math.min(Math.max(startWidth.current + delta, 280), 500);
//     setWidth(newWidth);
//     onWidthChange(newWidth);
//   };
//
//   const handleMouseUp = () => {
//     isResizing.current = false;
//     document.body.style.cursor = '';
//     document.body.style.userSelect = '';
//   };
//
//   useEffect(() => {
//     document.addEventListener('mousemove', handleMouseMove);
//     document.addEventListener('mouseup', handleMouseUp);
//     return () => {
//       document.removeEventListener('mousemove', handleMouseMove);
//       document.removeEventListener('mouseup', handleMouseUp);
//     };
//   }, []);
//
//   const isDark = theme === 'dark';
//
//   const handleApplyFormula = async () => {
//     if (!formula.trim()) {
//       console.log('No formula to apply');
//       return;
//     }
//
//     try {
//       // Parse the target cell from the input
//       const target = targetRange || targetCell;
//
//       // For now, handle single cell application
//       // TODO: Handle range application (B4:B10, etc.)
//       if (target && formula) {
//         // Extract column and row from target (e.g., "B4" -> col="B", row=4)
//         const col = target.match(/[A-Z]+/)?.[0];
//         const row = parseInt(target.match(/[0-9]+/)?.[0]);
//
//         if (col && row) {
//           // Use the spreadsheet context to update the cell
//           await updateCellWithFormula(col, row, formula, targetRange);
//
//           console.log('Applied formula:', formula, 'to target:', target);
//
//           // Clear the formula builder
//           setFormula('');
//           setPreviewResult('');
//           setSelectedFunction(null);
//           clearPreview();
//         } else {
//           console.error('Invalid target cell format:', target);
//         }
//       }
//     } catch (error) {
//       console.error('Failed to apply formula:', error);
//     }
//   };
//
//   const handlePreviewFormula = async () => {
//     if (!formula.trim()) {
//       console.log('No formula to preview');
//       return;
//     }
//
//     try {
//       // Parse the target cell from the input
//       const target = targetRange || targetCell;
//
//       // For now, handle single cell application
//       // TODO: Handle range application (B4:B10, etc.)
//       if (target && formula) {
//         // Extract column and row from target (e.g., "B4" -> col="B", row=4)
//         const col = target.match(/[A-Z]+/)?.[0];
//         const row = parseInt(target.match(/[0-9]+/)?.[0]);
//
//         if (col && row) {
//           // Use React Query mutation for formula evaluation
//           const result = await evaluateFormulaMutation.mutateAsync({
//             formula,
//             sheetName: 'Sheet1',
//             address: target
//           });
//
//           if (result.error) {
//             console.error('Formula evaluation error:', result.error);
//             setPreviewResult('Error: ' + result.error);
//           } else {
//             console.log('Previewed formula:', formula, 'result:', result.result);
//             setPreviewResult(result.result);
//             setPreview(formula, target, result.result);
//           }
//         } else {
//           console.error('Invalid target cell format:', target);
//           setPreviewResult('Error: Invalid cell format');
//         }
//       }
//     } catch (error) {
//       console.error('Failed to preview formula:', error);
//       setPreviewResult('Error: ' + error.message);
//     }
//   };
//
//   const handleClearFormula = () => {
//     setFormula('');
//     setPreviewResult('');
//     setSelectedFunction(null);
//     clearPreview();
//   };
//
//   // Set current cell as default on mount and when selected cell changes
//   useEffect(() => {
//     if (selectedCell && selectedCell.col && selectedCell.row) {
//       const currentCellAddress = `${selectedCell.col}${selectedCell.row}`;
//       setTargetCell(currentCellAddress);
//       setTargetRange('');
//       setSelectedTarget('current');
//     }
//   }, [selectedCell]);
//
//   const handleSelectCurrentCell = () => {
//     if (selectedCell && selectedCell.col && selectedCell.row) {
//       const currentCellAddress = `${selectedCell.col}${selectedCell.row}`;
//       setTargetCell(currentCellAddress);
//     } else {
//       setTargetCell('A1');
//     }
//     setTargetRange('');
//     setSelectedTarget('current');
//     clearPreview();
//   };
//
//   const handleSelectRange = () => {
//     // For now, just use the current cell as the range
//     // TODO: Implement proper range selection
//     setTargetRange(targetCell);
//     setSelectedTarget('range');
//     clearPreview();
//   };
//
//   // Update preview when formula or target changes (debounced)
//   useEffect(() => {
//     if (formula && targetCell) {
//       const timeoutId = setTimeout(() => {
//         handlePreviewFormula();
//       }, 500); // Debounce for 500ms
//
//       return () => clearTimeout(timeoutId);
//     }
//   }, [formula, targetCell]);
//
//   return (
//     <div
//       className={`relative border-l flex flex-col h-full ${
//         isDark
//           ? 'bg-gray-800 border-gray-700 text-white'
//           : 'bg-white border-gray-200 text-gray-900'
//       }`}
//       style={{ width: `${width}px` }}
//     >
//       {/* Resize Handle */}
//       <div
//         className="absolute left-0 top-0 bottom-0 w-1 cursor-ew-resize hover:bg-blue-500/50"
//         onMouseDown={handleMouseDown}
//       >
//         <GripVertical
//           size={16}
//           className={`absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 ${
//             isDark ? 'text-gray-400' : 'text-gray-500'
//           }`}
//         />
//       </div>
//
//       {/* Header */}
//       <div className={`p-4 border-b ${
//         isDark ? 'border-gray-700 bg-gray-900' : 'border-gray-200 bg-gray-50'
//       }`}>
//         <h3 className="font-medium text-lg">Formula Builder</h3>
//         <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
//           Create and apply formulas to your data
//         </p>
//       </div>
//
//       {/* Content */}
//       <div className="flex-1 overflow-y-auto p-4">
//         {/* Target Cell Selector */}
//         <div ref={targetSelectorRef} className={`mb-6 p-4 rounded-lg ${
//           isDark ? 'bg-gray-700' : 'bg-gray-50'
//         }`}>
//           <div className="flex items-center gap-2 mb-3">
//             <span>🎯</span>
//             <span className="font-medium">Apply Formula To</span>
//           </div>
//           <div className="flex gap-2 mb-3">
//             <input
//               type="text"
//               value={targetCell}
//               onChange={(e) => setTargetCell(e.target.value)}
//               className={`flex-1 px-3 py-2 rounded-md border ${
//                 isDark
//                   ? 'bg-gray-800 border-gray-600 text-white'
//                   : 'bg-white border-gray-200 text-gray-900'
//               }`}
//               placeholder="Cell (e.g., B4) or Range (e.g., B4:B10)"
//             />
//           </div>
//           <div className="flex gap-2">
//             <button
//               onClick={handleSelectCurrentCell}
//               className={`px-3 py-1.5 text-sm rounded-md ${
//                 selectedTarget === 'current'
//                   ? isDark
//                     ? 'bg-blue-600 text-white hover:bg-blue-500'
//                     : 'bg-blue-500 text-white hover:bg-blue-600'
//                   : isDark
//                     ? 'bg-gray-600 hover:bg-gray-500'
//                     : 'bg-gray-200 hover:bg-gray-300'
//               }`}
//             >
//               Current Cell
//             </button>
//             <button
//               onClick={handleSelectRange}
//               className={`px-3 py-1.5 text-sm rounded-md ${
//                 selectedTarget === 'range'
//                   ? isDark
//                     ? 'bg-blue-600 text-white hover:bg-blue-500'
//                     : 'bg-blue-500 text-white hover:bg-blue-600'
//                   : isDark
//                     ? 'bg-gray-600 hover:bg-gray-500'
//                     : 'bg-gray-200 hover:bg-gray-300'
//               }`}
//             >
//               Select Range
//             </button>
//           </div>
//         </div>
//
//         {/* Formula Editor */}
//         <div className="mb-6">
//           <div className="flex justify-between items-center mb-2">
//             <span className="font-medium">Formula Editor</span>
//             {previewResult && (
//               <span className={`text-sm px-2 py-1 rounded ${
//                 previewResult.startsWith('Error:')
//                   ? (isDark ? 'bg-red-900 text-red-300' : 'bg-red-100 text-red-800')
//                   : (isDark ? 'bg-green-900 text-green-300' : 'bg-green-100 text-green-800')
//               }`}>
//                 {previewResult.startsWith('Error:') ? previewResult : `Result: ${previewResult}`}
//               </span>
//             )}
//           </div>
//           <textarea
//             value={formula}
//             onChange={(e) => setFormula(e.target.value)}
//             className={`w-full px-3 py-2 rounded-md border font-mono ${
//               isDark
//                 ? 'bg-gray-700 border-gray-600 text-white'
//                 : 'bg-white border-gray-200 text-gray-900'
//             }`}
//             rows={4}
//             placeholder="Enter your formula here...
// Example: =SUM(A1:A10)"
//             ref={formulaEditorRef}
//           />
//           <div className="flex gap-2 mt-2">
//             <button
//               onClick={handleApplyFormula}
//               disabled={!formula.trim()}
//               className={`px-3 py-1.5 text-sm rounded-md ${
//                 !formula.trim()
//                   ? (isDark ? 'bg-gray-600 text-gray-400' : 'bg-gray-200 text-gray-400')
//                   : (isDark ? 'bg-green-600 text-white hover:bg-green-500' : 'bg-green-500 text-white hover:bg-green-600')
//               }`}
//             >
//               Apply Formula
//             </button>
//           </div>
//         </div>
//
//         {/* Common Formulas */}
//         <div className="mb-6">
//           <div className="flex items-center gap-2 mb-3">
//             <span>📝</span>
//             <span className="font-medium">Common Formulas</span>
//           </div>
//           <div className="grid grid-cols-2 gap-2">
//             {[
//               { name: 'SUM', template: '=SUM(A1:A10)' },
//               { name: 'AVERAGE', template: '=AVERAGE(B1:B10)' },
//               { name: 'COUNT', template: '=COUNT(C1:C10)' },
//               { name: 'MAX', template: '=MAX(D1:D10)' },
//               { name: 'MIN', template: '=MIN(E1:E10)' },
//               { name: 'IF', template: '=IF(A1>10,"High","Low")' },
//             ].map((template) => (
//               <button
//                 key={template.name}
//                 onClick={() => setFormula(template.template)}
//                 className={`p-2 text-xs rounded-md text-left ${
//                   isDark
//                     ? 'bg-gray-700 hover:bg-gray-600'
//                     : 'bg-gray-50 hover:bg-gray-100'
//                 }`}
//               >
//                 <div className="font-medium">{template.name}</div>
//                 <div className={`text-xs ${
//                   isDark ? 'text-gray-400' : 'text-gray-500'
//                 }`}>
//                   {template.template}
//                 </div>
//               </button>
//             ))}
//           </div>
//         </div>
//
//         {/* Function Categories */}
//         <div className="space-y-4">
//           {formulaCategories.map((category) => (
//             <div key={category.id} className="space-y-2">
//               <button
//                 onClick={() => setActiveCategory(activeCategory === category.id ? null : category.id)}
//                 className={`w-full flex items-center justify-between p-2 rounded-md ${
//                   activeCategory === category.id
//                     ? isDark
//                       ? 'bg-gray-700'
//                       : 'bg-gray-100'
//                     : ''
//                 }`}
//               >
//                 <div className="flex items-center gap-2">
//                   {category.icon}
//                   <span>{category.label}</span>
//                 </div>
//                 <span className={`text-sm transition-transform ${
//                   activeCategory === category.id ? 'rotate-180' : ''
//                 }`}>▼</span>
//               </button>
//
//               {activeCategory === category.id && (
//                 <div className="space-y-2 pl-4">
//                   {category.functions.map((func) => (
//                     <div
//                       key={func.name}
//                       onClick={() => handleFunctionSelect(func)}
//                       className={`p-3 rounded-md cursor-pointer ${
//                         isDark
//                           ? 'bg-gray-700 hover:bg-gray-600'
//                           : 'bg-gray-50 hover:bg-gray-100'
//                       }`}
//                     >
//                       <div className={`font-mono text-sm ${
//                         isDark ? 'text-green-400' : 'text-green-600'
//                       }`}>
//                         {func.name}
//                       </div>
//                       <div className={`text-xs mt-1 ${
//                         isDark ? 'text-gray-400' : 'text-gray-500'
//                       }`}>
//                         {func.syntax}
//                       </div>
//                       <div className={`text-xs mt-1 ${
//                         isDark ? 'text-gray-400' : 'text-gray-500'
//                       }`}>
//                         {func.description}
//                       </div>
//                     </div>
//                   ))}
//                 </div>
//               )}
//             </div>
//           ))}
//         </div>
//       </div>
//
//       {/* Quick Actions */}
//       <div className={`p-4 border-t ${
//         isDark ? 'border-gray-700 bg-gray-900' : 'border-gray-200 bg-gray-50'
//       }`}>
//         <div className="text-sm text-center text-gray-500">
//           Click on any function above to insert it into the formula editor
//         </div>
//       </div>
//     </div>
//   );
// };
//
// export default FormulaBuilder;
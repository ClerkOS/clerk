// import React, { useState } from 'react';
// import { useAIOperations } from '../features/useAIOperations.js';
// import { Sparkles, AlertCircle, CheckCircle, Copy } from 'lucide-react';
//
// const AIFormulaConverter = ({ onFormulaGenerated }) => {
//   const [input, setInput] = useState('');
//   const [suggestions, setSuggestions] = useState([]);
//
//   const {
//     convertToFormula,
//     getFormulaSuggestions,
//     isConverting,
//     conversionError,
//     lastResult,
//   } = useAIOperations();
//
//   const handleConvert = async () => {
//     if (!input.trim()) return;
//
//     try {
//       const result = await convertToFormula(input);
//       if (onFormulaGenerated && result.formula) {
//         onFormulaGenerated(result.formula);
//       }
//     } catch (error) {
//       console.error('Conversion failed:', error);
//     }
//   };
//
//   const handleSuggestion = async (suggestion) => {
//     try {
//       const result = await getFormulaSuggestions(suggestion);
//       if (result.formula) {
//         setInput(result.formula);
//         if (onFormulaGenerated) {
//           onFormulaGenerated(result.formula);
//         }
//       }
//     } catch (error) {
//       console.error('Suggestion failed:', error);
//     }
//   };
//
//   const copyToClipboard = (text) => {
//     navigator.clipboard.writeText(text);
//   };
//
//   const commonQueries = [
//     'sum of cells A1 to A10',
//     'average of column B',
//     'count non-empty cells in range C1:C20',
//     'find maximum value in row 5',
//     'calculate percentage of total',
//   ];
//
//   return (
//     <div className="flex flex-col space-y-4 p-4 bg-white rounded-lg shadow">
//       <div className="flex items-center space-x-2">
//         <Sparkles className="text-blue-600" size={20} />
//         <h3 className="text-lg font-semibold text-gray-800">AI Formula Converter</h3>
//       </div>
//
//       {/* Input Section */}
//       <div className="space-y-2">
//         <label className="block text-sm font-medium text-gray-700">
//           Describe what you want to calculate
//         </label>
//         <textarea
//           value={input}
//           onChange={(e) => setInput(e.target.value)}
//           placeholder="e.g., sum of cells A1 to A10"
//           className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
//           rows={3}
//           disabled={isConverting}
//         />
//         <button
//           onClick={handleConvert}
//           disabled={isConverting || !input.trim()}
//           className={`
//             w-full flex items-center justify-center space-x-2 px-4 py-2 rounded-md text-sm font-medium
//             ${isConverting || !input.trim()
//               ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
//               : 'bg-blue-600 text-white hover:bg-blue-700'
//             }
//           `}
//         >
//           {isConverting ? (
//             <>
//               <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
//               <span>Converting...</span>
//             </>
//           ) : (
//             <>
//               <Sparkles size={16} />
//               <span>Convert to Formula</span>
//             </>
//           )}
//         </button>
//       </div>
//
//       {/* Error Display */}
//       {conversionError && (
//         <div className="flex items-center space-x-2 p-3 bg-red-50 border border-red-200 rounded-md">
//           <AlertCircle className="text-red-600" size={16} />
//           <span className="text-red-600 text-sm">
//             {conversionError.message || 'Conversion failed'}
//           </span>
//         </div>
//       )}
//
//       {/* Result Display */}
//       {lastResult && lastResult.formula && (
//         <div className="space-y-2">
//           <div className="flex items-center justify-between">
//             <label className="block text-sm font-medium text-gray-700">
//               Generated Formula
//             </label>
//             <button
//               onClick={() => copyToClipboard(lastResult.formula)}
//               className="flex items-center space-x-1 text-blue-600 hover:text-blue-700 text-sm"
//             >
//               <Copy size={14} />
//               <span>Copy</span>
//             </button>
//           </div>
//           <div className="p-3 bg-green-50 border border-green-200 rounded-md">
//             <div className="flex items-center space-x-2 text-green-700">
//               <CheckCircle size={16} />
//               <code className="text-sm font-mono">{lastResult.formula}</code>
//             </div>
//             {lastResult.explanation && (
//               <p className="mt-2 text-sm text-green-600">{lastResult.explanation}</p>
//             )}
//           </div>
//         </div>
//       )}
//
//       {/* Quick Suggestions */}
//       <div className="space-y-2">
//         <label className="block text-sm font-medium text-gray-700">
//           Quick Examples
//         </label>
//         <div className="grid grid-cols-1 gap-2">
//           {commonQueries.map((query, index) => (
//             <button
//               key={index}
//               onClick={() => handleSuggestion(query)}
//               disabled={isConverting}
//               className="text-left p-2 text-sm text-gray-600 hover:bg-gray-50 rounded border border-gray-200 hover:border-gray-300 transition-colors"
//             >
//               {query}
//             </button>
//           ))}
//         </div>
//       </div>
//     </div>
//   );
// };
//
// export default AIFormulaConverter;
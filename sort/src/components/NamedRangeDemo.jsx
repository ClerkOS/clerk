// import React, { useState } from 'react';
// import { useAddNamedRange } from '../features/useSpreadsheetQueries.js';
// import { useSpreadsheet } from '../context/SpreadsheetContext.jsx';
//
// const NamedRangeDemo = () => {
//   const [name, setName] = useState('');
//   const [refersTo, setRefersTo] = useState('');
//   const [scope, setScope] = useState('Sheet1');
//   const [isLoading, setIsLoading] = useState(false);
//   const { spreadsheetData } = useSpreadsheet();
//   const addNamedRangeMutation = useAddNamedRange();
//
//   const handleAddNamedRange = async (e) => {
//     e.preventDefault();
//
//     if (!spreadsheetData.workbook_id) {
//       alert('No workbook loaded. Please import a workbook first.');
//       return;
//     }
//
//     if (!name.trim() || !refersTo.trim()) {
//       alert('Please provide both name and refersTo values.');
//       return;
//     }
//
//     setIsLoading(true);
//     try {
//       await addNamedRangeMutation.mutateAsync({
//         workbookId: spreadsheetData.workbook_id,
//         sheet: scope,
//         name: name.trim(),
//         refersTo: refersTo.trim(),
//         scope: scope
//       });
//
//       alert('Named range added successfully!');
//       // Clear form
//       setName('');
//       setRefersTo('');
//     } catch (error) {
//       console.error('Failed to add named range:', error);
//       alert('Failed to add named range. Check console for details.');
//     } finally {
//       setIsLoading(false);
//     }
//   };
//
//   const quickExamples = [
//     { name: 'Quantity', refersTo: 'C1:C3', description: 'Quantity column' },
//     { name: 'Price', refersTo: 'B1:B3', description: 'Price column' },
//     { name: 'ProductData', refersTo: 'A1:C3', description: 'All product data' },
//     { name: 'Headers', refersTo: 'A1:C1', description: 'Header row' }
//   ];
//
//   const fillExample = (example) => {
//     setName(example.name);
//     setRefersTo(example.refersTo);
//   };
//
//   return (
//     <div className="p-4 bg-white rounded-lg shadow-md">
//       <h3 className="text-lg font-semibold mb-4">Add Named Range</h3>
//       <p className="text-sm text-gray-600 mb-4">
//         Create named ranges to reference cell ranges with meaningful names.
//       </p>
//
//       <form onSubmit={handleAddNamedRange} className="space-y-4">
//         <div>
//           <label className="block text-sm font-medium text-gray-700 mb-1">
//             Name
//           </label>
//           <input
//             type="text"
//             value={name}
//             onChange={(e) => setName(e.target.value)}
//             placeholder="e.g., Quantity, Price, ProductData"
//             className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//             required
//           />
//         </div>
//
//         <div>
//           <label className="block text-sm font-medium text-gray-700 mb-1">
//             Refers To
//           </label>
//           <input
//             type="text"
//             value={refersTo}
//             onChange={(e) => setRefersTo(e.target.value)}
//             placeholder="e.g., C1:C3, A1:D10"
//             className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//             required
//           />
//         </div>
//
//         <div>
//           <label className="block text-sm font-medium text-gray-700 mb-1">
//             Scope (Sheet)
//           </label>
//           <input
//             type="text"
//             value={scope}
//             onChange={(e) => setScope(e.target.value)}
//             placeholder="Sheet1"
//             className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//             required
//           />
//         </div>
//
//         <button
//           type="submit"
//           disabled={isLoading || !spreadsheetData.workbook_id}
//           className="w-full px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
//         >
//           {isLoading ? 'Adding...' : 'Add Named Range'}
//         </button>
//       </form>
//
//       {!spreadsheetData.workbook_id && (
//         <p className="text-sm text-red-600 mt-2">
//           Please import a workbook first to use this feature.
//         </p>
//       )}
//
//       <div className="mt-6">
//         <h4 className="font-medium mb-2">Quick Examples:</h4>
//         <div className="space-y-2">
//           {quickExamples.map((example, index) => (
//             <button
//               key={index}
//               onClick={() => fillExample(example)}
//               className="block w-full text-left p-2 bg-gray-50 hover:bg-gray-100 rounded text-sm"
//             >
//               <div className="font-medium">{example.name}</div>
//               <div className="text-gray-600">{example.refersTo} - {example.description}</div>
//             </button>
//           ))}
//         </div>
//       </div>
//
//       <div className="mt-4 p-3 bg-blue-50 rounded">
//         <h4 className="font-medium text-blue-800 mb-1">Usage Tips:</h4>
//         <ul className="text-sm text-blue-700 space-y-1">
//           <li>• Use descriptive names like "SalesData" or "QuarterlyTotals"</li>
//           <li>• Reference ranges like "A1:C10" or "B2:D5"</li>
//           <li>• Named ranges can be used in formulas: =SUM(Quantity)</li>
//           <li>• Scope determines which sheet the named range applies to</li>
//         </ul>
//       </div>
//     </div>
//   );
// };
//
// export default NamedRangeDemo;
// import React, { useRef } from 'react';
// import { useWorkbookOperations } from '../features/useWorkbookOperations.js';
// import { Download, Upload, AlertCircle, CheckCircle } from 'lucide-react';
//
// const WorkbookOperations = () => {
//   const fileInputRef = useRef(null);
//   const {
//     importWorkbook,
//     exportWorkbook,
//     isImporting,
//     isExporting,
//     importError,
//     exportError,
//   } = useWorkbookOperations();
//
//   const handleFileSelect = async (event) => {
//     const file = event.target.files[0];
//     if (file) {
//       try {
//         await importWorkbook(file);
//         // Reset file input
//         if (fileInputRef.current) {
//           fileInputRef.current.value = '';
//         }
//       } catch (error) {
//         console.error('Import failed:', error);
//       }
//     }
//   };
//
//   const handleExport = async () => {
//     try {
//       await exportWorkbook();
//     } catch (error) {
//       console.error('Export failed:', error);
//     }
//   };
//
//   return (
//     <div className="flex flex-col space-y-4 p-4 bg-white rounded-lg shadow">
//       <h3 className="text-lg font-semibold text-gray-800">Workbook Operations</h3>
//
//       {/* Import Section */}
//       <div className="space-y-2">
//         <label className="block text-sm font-medium text-gray-700">
//           Import Workbook
//         </label>
//         <div className="flex items-center space-x-2">
//           <input
//             ref={fileInputRef}
//             type="file"
//             accept=".xlsx,.xls,.csv"
//             onChange={handleFileSelect}
//             className="hidden"
//             disabled={isImporting}
//           />
//           <button
//             onClick={() => fileInputRef.current?.click()}
//             disabled={isImporting}
//             className={`
//               flex items-center space-x-2 px-4 py-2 rounded-md text-sm font-medium
//               ${isImporting
//                 ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
//                 : 'bg-blue-600 text-white hover:bg-blue-700'
//               }
//             `}
//           >
//             <Upload size={16} />
//             <span>{isImporting ? 'Importing...' : 'Choose File'}</span>
//           </button>
//           {isImporting && (
//             <div className="flex items-center text-blue-600">
//               <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
//             </div>
//           )}
//         </div>
//         {importError && (
//           <div className="flex items-center space-x-2 text-red-600 text-sm">
//             <AlertCircle size={16} />
//             <span>Import failed: {importError.message}</span>
//           </div>
//         )}
//       </div>
//
//       {/* Export Section */}
//       <div className="space-y-2">
//         <label className="block text-sm font-medium text-gray-700">
//           Export Workbook
//         </label>
//         <button
//           onClick={handleExport}
//           disabled={isExporting}
//           className={`
//             flex items-center space-x-2 px-4 py-2 rounded-md text-sm font-medium
//             ${isExporting
//               ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
//               : 'bg-green-600 text-white hover:bg-green-700'
//             }
//           `}
//         >
//           <Download size={16} />
//           <span>{isExporting ? 'Exporting...' : 'Download Excel'}</span>
//         </button>
//         {exportError && (
//           <div className="flex items-center space-x-2 text-red-600 text-sm">
//             <AlertCircle size={16} />
//             <span>Export failed: {exportError.message}</span>
//           </div>
//         )}
//       </div>
//
//       {/* Status Messages */}
//       {!isImporting && !isExporting && !importError && !exportError && (
//         <div className="flex items-center space-x-2 text-green-600 text-sm">
//           <CheckCircle size={16} />
//           <span>Ready for operations</span>
//         </div>
//       )}
//     </div>
//   );
// };
//
// export default WorkbookOperations;
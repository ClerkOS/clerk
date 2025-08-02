// import { useState, useEffect, useMemo, useCallback } from 'react';
// import {
//   detectCellType,
//   analyzeRangeTypes,
//   analyzeColumnTypes,
//   generateTypeContext,
//   validateDataTypes,
//   DATA_TYPES
// } from '../utils/typeDetector.js';
//
// /**
//  * Hook for type detection and analysis of spreadsheet data
//  * Provides type-aware context for AI code generation
//  */
// export const useTypeDetection = (spreadsheetData, selectedRange = null) => {
//   const [typeAnalysis, setTypeAnalysis] = useState(null);
//   const [isAnalyzing, setIsAnalyzing] = useState(false);
//   const [analysisError, setAnalysisError] = useState(null);
//
//   // Analyze data when spreadsheet data or selected range changes
//   useEffect(() => {
//     if (!spreadsheetData || !spreadsheetData.workbook_id) {
//       setTypeAnalysis(null);
//       return;
//     }
//
//     setIsAnalyzing(true);
//     setAnalysisError(null);
//
//     try {
//       // Extract data from the spreadsheet
//       const data = extractSpreadsheetData(spreadsheetData, selectedRange);
//
//       if (!data || data.length === 0) {
//         setTypeAnalysis(null);
//         return;
//       }
//
//       // Perform type analysis
//       const analysis = analyzeColumnTypes(data.rows, data.headers, {
//         detectFormulas: true,
//         detectDates: true,
//         detectCurrency: true
//       });
//
//       setTypeAnalysis(analysis);
//     } catch (error) {
//       console.error('Type analysis failed:', error);
//       setAnalysisError(error.message);
//     } finally {
//       setIsAnalyzing(false);
//     }
//   }, [spreadsheetData, selectedRange]);
//
//   // Generate AI context with type information
//   const aiContext = useMemo(() => {
//     if (!typeAnalysis) return null;
//
//     return generateTypeContext(typeAnalysis, '');
//   }, [typeAnalysis]);
//
//   // Get type information for a specific cell
//   const getCellType = useCallback((rowIndex, colIndex) => {
//     if (!typeAnalysis || !typeAnalysis.columns[colIndex]) {
//       return null;
//     }
//
//     const column = typeAnalysis.columns[colIndex];
//     return {
//       dominantType: column.dominantType,
//       confidence: column.confidence,
//       isConsistent: column.isConsistent
//     };
//   }, [typeAnalysis]);
//
//   // Get column analysis
//   const getColumnAnalysis = useCallback((colIndex) => {
//     if (!typeAnalysis || !typeAnalysis.columns[colIndex]) {
//       return null;
//     }
//
//     return typeAnalysis.columns[colIndex];
//   }, [typeAnalysis]);
//
//   // Validate data against detected types
//   const validateData = useCallback(() => {
//     if (!typeAnalysis || !spreadsheetData) {
//       return null;
//     }
//
//     const data = extractSpreadsheetData(spreadsheetData, selectedRange);
//     return validateDataTypes(data.rows, typeAnalysis);
//   }, [typeAnalysis, spreadsheetData, selectedRange]);
//
//   // Get type-aware suggestions for AI prompts
//   const getTypeSuggestions = useCallback(() => {
//     if (!typeAnalysis) return [];
//
//     const suggestions = [];
//     const { columns, summary } = typeAnalysis;
//
//     // Numeric column suggestions
//     const numericColumns = columns.filter(col =>
//       col.dominantType === DATA_TYPES.NUMBER ||
//       col.dominantType === DATA_TYPES.CURRENCY ||
//       col.dominantType === DATA_TYPES.PERCENTAGE
//     );
//
//     if (numericColumns.length > 0) {
//       suggestions.push({
//         category: 'Calculations',
//         prompts: [
//           `Calculate the sum of ${numericColumns[0].header}`,
//           `Find the average of ${numericColumns[0].header}`,
//           `Create a chart showing ${numericColumns[0].header} trends`,
//           `Calculate percentage change in ${numericColumns[0].header}`
//         ]
//       });
//     }
//
//     // Date column suggestions
//     const dateColumns = columns.filter(col => col.dominantType === DATA_TYPES.DATE);
//     if (dateColumns.length > 0) {
//       suggestions.push({
//         category: 'Date Analysis',
//         prompts: [
//           `Group data by month from ${dateColumns[0].header}`,
//           `Calculate days between dates in ${dateColumns[0].header}`,
//           `Filter data for the last 30 days from ${dateColumns[0].header}`
//         ]
//       });
//     }
//
//     // String column suggestions
//     const stringColumns = columns.filter(col => col.dominantType === DATA_TYPES.STRING);
//     if (stringColumns.length > 0) {
//       suggestions.push({
//         category: 'Text Analysis',
//         prompts: [
//           `Count unique values in ${stringColumns[0].header}`,
//           `Find the most frequent value in ${stringColumns[0].header}`,
//           `Extract domain names from ${stringColumns[0].header}`
//         ]
//       });
//     }
//
//     // Cross-column suggestions
//     if (columns.length >= 2) {
//       suggestions.push({
//         category: 'Cross-Column Analysis',
//         prompts: [
//           `Create a pivot table with ${columns[0].header} and ${columns[1].header}`,
//           `Group ${columns[0].header} by ${columns[1].header}`,
//           `Calculate correlation between ${columns[0].header} and ${columns[1].header}`
//         ]
//       });
//     }
//
//     return suggestions;
//   }, [typeAnalysis]);
//
//   return {
//     // State
//     typeAnalysis,
//     isAnalyzing,
//     analysisError,
//
//     // Context
//     aiContext,
//
//     // Functions
//     getCellType,
//     getColumnAnalysis,
//     validateData,
//     getTypeSuggestions,
//
//     // Utilities
//     DATA_TYPES
//   };
// };
//
// /**
//  * Extract data from spreadsheet for type analysis
//  * This is a placeholder - you'll need to implement this based on your data structure
//  */
// function extractSpreadsheetData(spreadsheetData, selectedRange) {
//   // This is a simplified example - you'll need to adapt this to your actual data structure
//   if (!spreadsheetData || !spreadsheetData.sheets) {
//     return null;
//   }
//
//   // Get the first sheet for now
//   const sheet = Object.values(spreadsheetData.sheets)[0];
//   if (!sheet || !sheet.cells) {
//     return null;
//   }
//
//   // Convert cell data to 2D array
//   const rows = [];
//   const headers = [];
//
//   // Find the range of data
//   let maxRow = 0;
//   let maxCol = 0;
//
//   Object.keys(sheet.cells).forEach(cellKey => {
//     const [col, row] = parseCellAddress(cellKey);
//     maxRow = Math.max(maxRow, row);
//     maxCol = Math.max(maxCol, col);
//   });
//
//   // Extract headers (first row)
//   for (let col = 0; col <= maxCol; col++) {
//     const cellKey = `${String.fromCharCode(65 + col)}1`;
//     const cell = sheet.cells[cellKey];
//     headers.push(cell ? cell.value : `Column ${col + 1}`);
//   }
//
//   // Extract data rows
//   for (let row = 2; row <= maxRow; row++) {
//     const rowData = [];
//     for (let col = 0; col <= maxCol; col++) {
//       const cellKey = `${String.fromCharCode(65 + col)}${row}`;
//       const cell = sheet.cells[cellKey];
//       rowData.push(cell ? cell.value : '');
//     }
//     rows.push(rowData);
//   }
//
//   return { rows, headers };
// }
//
// /**
//  * Parse cell address like "A1" to column and row numbers
//  */
// function parseCellAddress(address) {
//   const match = address.match(/^([A-Z]+)(\d+)$/);
//   if (!match) return [0, 0];
//
//   const colStr = match[1];
//   const row = parseInt(match[2]);
//
//   let col = 0;
//   for (let i = 0; i < colStr.length; i++) {
//     col = col * 26 + (colStr.charCodeAt(i) - 64);
//   }
//
//   return [col - 1, row]; // Convert to 0-based indexing
// }
// /**
//  * Type detection utilities for Excel data analysis
//  * Provides flexible and safe type inference for spreadsheet data
//  */
//
// // Type constants
// export const DATA_TYPES = {
//   STRING: 'string',
//   NUMBER: 'number',
//   DATE: 'date',
//   BOOLEAN: 'boolean',
//   CURRENCY: 'currency',
//   PERCENTAGE: 'percentage',
//   EMAIL: 'email',
//   URL: 'url',
//   PHONE: 'phone',
//   FORMULA: 'formula',
//   EMPTY: 'empty'
// };
//
// // Regular expressions for type detection
// const PATTERNS = {
//   // Number patterns
//   NUMBER: /^-?\d+(\.\d+)?$/,
//   INTEGER: /^-?\d+$/,
//   DECIMAL: /^-?\d+\.\d+$/,
//
//   // Date patterns
//   DATE_ISO: /^\d{4}-\d{2}-\d{2}$/,
//   DATE_SLASH: /^\d{1,2}\/\d{1,2}\/\d{2,4}$/,
//   DATE_DASH: /^\d{1,2}-\d{1,2}-\d{2,4}$/,
//   DATE_DOT: /^\d{1,2}\.\d{1,2}\.\d{2,4}$/,
//   DATETIME: /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/,
//
//   // Currency patterns
//   CURRENCY_USD: /^\$[\d,]+(\.\d{2})?$/,
//   CURRENCY_EUR: /^€[\d,]+(\.\d{2})?$/,
//   CURRENCY_GBP: /^£[\d,]+(\.\d{2})?$/,
//   CURRENCY_GENERIC: /^[A-Z]{3}\s?[\d,]+(\.\d{2})?$/,
//
//   // Percentage patterns
//   PERCENTAGE: /^-?\d+(\.\d+)?%$/,
//
//   // Boolean patterns
//   BOOLEAN_TRUE: /^(true|yes|1|on|enabled)$/i,
//   BOOLEAN_FALSE: /^(false|no|0|off|disabled)$/i,
//
//   // Email pattern
//   EMAIL: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
//
//   // URL patterns
//   URL: /^https?:\/\/.+/,
//   URL_WITHOUT_PROTOCOL: /^[a-zA-Z0-9][a-zA-Z0-9-]{1,61}[a-zA-Z0-9]\.[a-zA-Z]{2,}$/,
//
//   // Phone patterns
//   PHONE_US: /^\+?1?[-.\s]?\(?[0-9]{3}\)?[-.\s]?[0-9]{3}[-.\s]?[0-9]{4}$/,
//   PHONE_INTERNATIONAL: /^\+?[1-9]\d{1,14}$/,
//
//   // Formula patterns
//   FORMULA: /^=.*$/,
//
//   // Empty patterns
//   EMPTY: /^\s*$/
// };
//
// /**
//  * Detects the type of a single cell value
//  * @param {string} value - The cell value to analyze
//  * @param {Object} options - Detection options
//  * @returns {Object} Type information
//  */
// export function detectCellType(value, options = {}) {
//   const {
//     strict = false,
//     allowEmpty = true,
//     detectFormulas = true,
//     detectDates = true,
//     detectCurrency = true
//   } = options;
//
//   // Handle null/undefined
//   if (value === null || value === undefined) {
//     return {
//       type: DATA_TYPES.EMPTY,
//       confidence: 1.0,
//       originalValue: value,
//       parsedValue: null
//     };
//   }
//
//   // Convert to string for analysis
//   const stringValue = String(value).trim();
//
//   // Check for empty
//   if (PATTERNS.EMPTY.test(stringValue)) {
//     return {
//       type: DATA_TYPES.EMPTY,
//       confidence: 1.0,
//       originalValue: value,
//       parsedValue: null
//     };
//   }
//
//   // Check for formulas
//   if (detectFormulas && PATTERNS.FORMULA.test(stringValue)) {
//     return {
//       type: DATA_TYPES.FORMULA,
//       confidence: 1.0,
//       originalValue: value,
//       parsedValue: stringValue
//     };
//   }
//
//   // Check for booleans
//   if (PATTERNS.BOOLEAN_TRUE.test(stringValue)) {
//     return {
//       type: DATA_TYPES.BOOLEAN,
//       confidence: 1.0,
//       originalValue: value,
//       parsedValue: true
//     };
//   }
//
//   if (PATTERNS.BOOLEAN_FALSE.test(stringValue)) {
//     return {
//       type: DATA_TYPES.BOOLEAN,
//       confidence: 1.0,
//       originalValue: value,
//       parsedValue: false
//     };
//   }
//
//   // Check for dates
//   if (detectDates) {
//     if (PATTERNS.DATE_ISO.test(stringValue) ||
//         PATTERNS.DATE_SLASH.test(stringValue) ||
//         PATTERNS.DATE_DASH.test(stringValue) ||
//         PATTERNS.DATE_DOT.test(stringValue) ||
//         PATTERNS.DATETIME.test(stringValue)) {
//
//       const date = new Date(stringValue);
//       if (!isNaN(date.getTime())) {
//         return {
//           type: DATA_TYPES.DATE,
//           confidence: 0.9,
//           originalValue: value,
//           parsedValue: date
//         };
//       }
//     }
//   }
//
//   // Check for currency
//   if (detectCurrency) {
//     if (PATTERNS.CURRENCY_USD.test(stringValue) ||
//         PATTERNS.CURRENCY_EUR.test(stringValue) ||
//         PATTERNS.CURRENCY_GBP.test(stringValue) ||
//         PATTERNS.CURRENCY_GENERIC.test(stringValue)) {
//
//       const numericValue = parseFloat(stringValue.replace(/[^\d.-]/g, ''));
//       if (!isNaN(numericValue)) {
//         return {
//           type: DATA_TYPES.CURRENCY,
//           confidence: 0.95,
//           originalValue: value,
//           parsedValue: numericValue
//         };
//       }
//     }
//   }
//
//   // Check for percentage
//   if (PATTERNS.PERCENTAGE.test(stringValue)) {
//     const numericValue = parseFloat(stringValue.replace('%', ''));
//     if (!isNaN(numericValue)) {
//       return {
//         type: DATA_TYPES.PERCENTAGE,
//         confidence: 0.95,
//         originalValue: value,
//         parsedValue: numericValue / 100
//       };
//     }
//   }
//
//   // Check for numbers
//   if (PATTERNS.NUMBER.test(stringValue)) {
//     const numericValue = parseFloat(stringValue);
//     if (!isNaN(numericValue)) {
//       return {
//         type: DATA_TYPES.NUMBER,
//         confidence: 1.0,
//         originalValue: value,
//         parsedValue: numericValue
//       };
//     }
//   }
//
//   // Check for email
//   if (PATTERNS.EMAIL.test(stringValue)) {
//     return {
//       type: DATA_TYPES.EMAIL,
//       confidence: 0.9,
//       originalValue: value,
//       parsedValue: stringValue.toLowerCase()
//     };
//   }
//
//   // Check for URLs
//   if (PATTERNS.URL.test(stringValue) || PATTERNS.URL_WITHOUT_PROTOCOL.test(stringValue)) {
//     return {
//       type: DATA_TYPES.URL,
//       confidence: 0.8,
//       originalValue: value,
//       parsedValue: stringValue
//     };
//   }
//
//   // Check for phone numbers
//   if (PATTERNS.PHONE_US.test(stringValue) || PATTERNS.PHONE_INTERNATIONAL.test(stringValue)) {
//     return {
//       type: DATA_TYPES.PHONE,
//       confidence: 0.85,
//       originalValue: value,
//       parsedValue: stringValue
//     };
//   }
//
//   // Default to string
//   return {
//     type: DATA_TYPES.STRING,
//     confidence: 0.7,
//     originalValue: value,
//     parsedValue: stringValue
//   };
// }
//
// /**
//  * Analyzes a range of cells to determine the dominant type
//  * @param {Array} values - Array of cell values
//  * @param {Object} options - Detection options
//  * @returns {Object} Range type analysis
//  */
// export function analyzeRangeTypes(values, options = {}) {
//   const typeCounts = {};
//   const typeDetails = [];
//   let totalValid = 0;
//
//   // Analyze each value
//   values.forEach((value, index) => {
//     const typeInfo = detectCellType(value, options);
//     typeDetails.push({
//       index,
//       value,
//       ...typeInfo
//     });
//
//     if (typeInfo.type !== DATA_TYPES.EMPTY) {
//       totalValid++;
//       typeCounts[typeInfo.type] = (typeCounts[typeInfo.type] || 0) + 1;
//     }
//   });
//
//   // Find dominant type
//   let dominantType = DATA_TYPES.STRING;
//   let maxCount = 0;
//
//   Object.entries(typeCounts).forEach(([type, count]) => {
//     if (count > maxCount) {
//       maxCount = count;
//       dominantType = type;
//     }
//   });
//
//   // Calculate confidence based on consistency
//   const confidence = totalValid > 0 ? maxCount / totalValid : 0;
//
//   return {
//     dominantType,
//     confidence,
//     typeDistribution: typeCounts,
//     totalValues: values.length,
//     validValues: totalValid,
//     typeDetails,
//     isConsistent: confidence > 0.8
//   };
// }
//
// /**
//  * Detects column types for a table structure
//  * @param {Array} data - 2D array of data (rows)
//  * @param {Array} headers - Optional header row
//  * @param {Object} options - Detection options
//  * @returns {Object} Column analysis
//  */
// export function analyzeColumnTypes(data, headers = null, options = {}) {
//   if (!data || data.length === 0) {
//     return { columns: [], summary: {} };
//   }
//
//   const numColumns = Math.max(...data.map(row => row.length));
//   const columns = [];
//
//   // Analyze each column
//   for (let colIndex = 0; colIndex < numColumns; colIndex++) {
//     const columnValues = data.map(row => row[colIndex] || '');
//     const header = headers ? headers[colIndex] : `Column ${colIndex + 1}`;
//
//     const analysis = analyzeRangeTypes(columnValues, options);
//
//     columns.push({
//       index: colIndex,
//       header,
//       ...analysis,
//       sampleValues: columnValues.slice(0, 5) // First 5 values as sample
//     });
//   }
//
//   // Generate summary
//   const summary = {
//     totalColumns: columns.length,
//     totalRows: data.length,
//     typeBreakdown: {},
//     hasHeaders: !!headers,
//     isConsistent: columns.every(col => col.isConsistent)
//   };
//
//   // Count types across all columns
//   columns.forEach(col => {
//     Object.entries(col.typeDistribution).forEach(([type, count]) => {
//       summary.typeBreakdown[type] = (summary.typeBreakdown[type] || 0) + count;
//     });
//   });
//
//   return { columns, summary };
// }
//
// /**
//  * Generates type-aware context for AI code generation
//  * @param {Object} analysis - Column analysis result
//  * @param {string} prompt - User prompt
//  * @returns {string} Context string for AI
//  */
// export function generateTypeContext(analysis, prompt) {
//   const { columns, summary } = analysis;
//
//   let context = `Spreadsheet Structure Analysis:\n`;
//   context += `- Total columns: ${summary.totalColumns}\n`;
//   context += `- Total rows: ${summary.totalRows}\n`;
//   context += `- Has headers: ${summary.hasHeaders}\n`;
//   context += `- Data consistency: ${summary.isConsistent ? 'High' : 'Mixed'}\n\n`;
//
//   context += `Column Details:\n`;
//   columns.forEach(col => {
//     context += `- ${col.header} (${col.dominantType}, ${Math.round(col.confidence * 100)}% confidence)\n`;
//     if (col.sampleValues.length > 0) {
//       context += `  Sample values: ${col.sampleValues.join(', ')}\n`;
//     }
//   });
//
//   context += `\nType Distribution:\n`;
//   Object.entries(summary.typeBreakdown).forEach(([type, count]) => {
//     context += `- ${type}: ${count} values\n`;
//   });
//
//   return context;
// }
//
// /**
//  * Validates data against detected types
//  * @param {Array} data - Data to validate
//  * @param {Object} analysis - Type analysis
//  * @returns {Object} Validation results
//  */
// export function validateDataTypes(data, analysis) {
//   const validation = {
//     isValid: true,
//     errors: [],
//     warnings: []
//   };
//
//   analysis.columns.forEach(col => {
//     data.forEach((row, rowIndex) => {
//       const value = row[col.index];
//       const typeInfo = detectCellType(value);
//
//       if (typeInfo.type !== col.dominantType && typeInfo.type !== DATA_TYPES.EMPTY) {
//         validation.warnings.push({
//           row: rowIndex + 1,
//           column: col.header,
//           expectedType: col.dominantType,
//           actualType: typeInfo.type,
//           value: value
//         });
//       }
//     });
//   });
//
//   return validation;
// }
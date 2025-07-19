// /**
//  * Test file for type detection utilities
//  * Run this in the browser console to test the type detection
//  */
//
// import {
//   detectCellType,
//   analyzeRangeTypes,
//   analyzeColumnTypes,
//   generateTypeContext,
//   DATA_TYPES
// } from './typeDetector.js';
//
// // Test data
// const testData = {
//   // Sample spreadsheet data
//   rows: [
//     ['Name', 'Age', 'Salary', 'Email', 'Date', 'Active'],
//     ['John Doe', '30', '$50000', 'john@example.com', '2023-01-15', 'true'],
//     ['Jane Smith', '25', '$60000', 'jane@example.com', '2023-02-20', 'false'],
//     ['Bob Johnson', '35', '$75000', 'bob@example.com', '2023-03-10', 'true'],
//     ['Alice Brown', '28', '$55000', 'alice@example.com', '2023-04-05', 'true']
//   ],
//   headers: ['Name', 'Age', 'Salary', 'Email', 'Date', 'Active']
// };
//
// // Test individual cell type detection
// console.log('=== Individual Cell Type Detection ===');
// const testValues = [
//   'John Doe',
//   '30',
//   '$50000',
//   'john@example.com',
//   '2023-01-15',
//   'true',
//   '100.5',
//   '25%',
//   '+1-555-123-4567',
//   'https://example.com',
//   '=SUM(A1:A10)',
//   ''
// ];
//
// testValues.forEach(value => {
//   const result = detectCellType(value);
//   console.log(`"${value}" -> ${result.type} (${Math.round(result.confidence * 100)}% confidence)`);
// });
//
// // Test range analysis
// console.log('\n=== Range Analysis ===');
// const ageColumn = testData.rows.slice(1).map(row => row[1]); // Age column
// const ageAnalysis = analyzeRangeTypes(ageColumn);
// console.log('Age column analysis:', ageAnalysis);
//
// // Test column analysis
// console.log('\n=== Column Analysis ===');
// const columnAnalysis = analyzeColumnTypes(testData.rows, testData.headers);
// console.log('Column analysis:', columnAnalysis);
//
// // Test AI context generation
// console.log('\n=== AI Context Generation ===');
// const context = generateTypeContext(columnAnalysis, 'Analyze this data');
// console.log('Generated context:');
// console.log(context);
//
// // Export for use in other parts of the application
// window.typeDetectorTest = {
//   testData,
//   testValues,
//   ageAnalysis,
//   columnAnalysis,
//   context
// };
//
// console.log('\n=== Test Complete ===');
// console.log('Results available in window.typeDetectorTest');
// import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
// import { useDeleteSheet, useRenameSheet } from '../features/useSpreadsheetQueries.js';
// import { useSpreadsheet } from './SpreadsheetContext.jsx';
// import lib from '../services/lib.js';
//
// const SheetContext = createContext();
//
// export const SheetProvider = ({ children }) => {
//   const { spreadsheetData, switchSheet, addSheet, setActiveSheet } = useSpreadsheet();
//   const workbookId = spreadsheetData.workbook_id;
//
//   // Use sheets from SpreadsheetContext instead of React Query to avoid timing issues
//   const sheets = spreadsheetData.sheets || [];
//
//   // Delete sheet mutation
//   const deleteSheetMutation = useDeleteSheet();
//
//   // Rename sheet mutation
//   const renameSheetMutation = useRenameSheet();
//
//   const [currentSheetId, setCurrentSheetId] = useState('sheet1');
//   const prevSheetCountRef = useRef(0);
//   const prevSheetsRef = useRef([]);
//
//   console.log('SheetContext Debug:', {
//     workbookId,
//     sheets: sheets.map(s => ({ id: s.id, name: s.name })),
//     currentSheetId,
//     prevSheetCount: prevSheetCountRef.current,
//     activeSheet: spreadsheetData.activeSheet
//   });
//
//   // Set current sheet to first sheet when sheets are loaded
//   useEffect(() => {
//     if (sheets.length > 0 && !sheets.find(s => s.id === currentSheetId)) {
//       const newSheetId = sheets[0].id;
//       console.log('Switching to first sheet:', newSheetId);
//       setCurrentSheetId(newSheetId);
//       switchSheet(newSheetId);
//     }
//   }, [sheets, currentSheetId, switchSheet]);
//
//   // Auto-switch to the newest sheet when sheets are added
//   useEffect(() => {
//     const prevSheets = prevSheetsRef.current;
//     const currentSheets = sheets;
//
//     // Check if a new sheet was added by comparing sheet names
//     if (currentSheets.length > prevSheets.length) {
//       // Find the new sheet (the one that wasn't in the previous list)
//       const newSheet = currentSheets.find(sheet =>
//         !prevSheets.find(prevSheet => prevSheet.name === sheet.name)
//       );
//
//       if (newSheet) {
//         console.log('New sheet detected in SheetContext:', newSheet.id, 'but letting SpreadsheetContext handle switching');
//         // Don't auto-switch here - let SpreadsheetContext handle it
//         // The SpreadsheetContext.addSheet function already sets the active sheet
//       }
//     }
//
//     // Update the previous sheets reference
//     prevSheetsRef.current = currentSheets;
//     prevSheetCountRef.current = currentSheets.length;
//   }, [sheets]); // Remove dependencies that could cause conflicts
//
//   const addSheetToContext = async (sheetName = null) => {
//     try {
//       console.log('Adding sheet in context:', sheetName);
//       const newSheet = await addSheet(sheetName);
//       console.log('Sheet added successfully in context:', newSheet);
//
//       // The SpreadsheetContext.addSheet function already handles switching
//       // Just update the current sheet ID to match
//       if (newSheet) {
//         console.log('Updating current sheet ID to match new sheet:', newSheet.id);
//         setCurrentSheetId(newSheet.id);
//       }
//
//       return newSheet;
//     } catch (error) {
//       console.error('Failed to add sheet in context:', error);
//       throw error;
//     }
//   };
//
//   const renameSheet = async (id, newName) => {
//     const sheetToRename = sheets.find(sheet => sheet.id === id);
//     if (!sheetToRename) return;
//
//     try {
//       await renameSheetMutation.mutateAsync({
//         workbookId: workbookId,
//         oldName: sheetToRename.name,
//         newName: newName
//       });
//       // The sheets query will be invalidated by the useRenameSheet hook
//       console.log('Sheet renamed successfully:', sheetToRename.name, '->', newName);
//     } catch (error) {
//       console.error('Failed to rename sheet:', error);
//       throw error;
//     }
//   };
//
//   const deleteSheet = async (id) => {
//     console.log('SheetContext deleteSheet called with:', { id, sheets, workbookId });
//     if (sheets.length <= 1) return; // Don't delete the last sheet
//
//     const sheetToDelete = sheets.find(sheet => sheet.id === id);
//     console.log('Sheet to delete:', sheetToDelete);
//     if (!sheetToDelete) return;
//
//     try {
//       console.log('Calling backend delete with:', { workbookId, sheetName: sheetToDelete.name });
//       await deleteSheetMutation.mutateAsync({
//         workbookId: workbookId,
//         sheetName: sheetToDelete.name
//       });
//       console.log('Backend delete completed successfully');
//
//       // If we're deleting the current sheet, switch to another sheet
//       if (currentSheetId === id) {
//         const remainingSheets = sheets.filter(sheet => sheet.id !== id);
//         if (remainingSheets.length > 0) {
//           const newSheetId = remainingSheets[0].id;
//           console.log('Switching to sheet:', newSheetId);
//           setCurrentSheetId(newSheetId);
//           switchSheet(newSheetId);
//         }
//       }
//     } catch (error) {
//       console.error('Failed to delete sheet:', error);
//       throw error;
//     }
//   };
//
//   const setCurrentSheet = (id) => {
//     setCurrentSheetId(id);
//     switchSheet(id);
//   };
//
//   return (
//     <SheetContext.Provider value={{
//       sheets,
//       currentSheetId,
//       addSheet: addSheetToContext,
//       renameSheet,
//       deleteSheet,
//       setCurrentSheet,
//       isLoading: false,
//       error: null
//     }}>
//       {children}
//     </SheetContext.Provider>
//   );
// };
//
// export const useSheets = () => useContext(SheetContext);
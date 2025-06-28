import React, { createContext, useContext, useState, useEffect } from 'react';
import { useSheets as useSheetsQuery, useDeleteSheet } from '../hooks/useSpreadsheetQueries';
import { useSpreadsheet } from './SpreadsheetContext';

const SheetContext = createContext();

export const SheetProvider = ({ children }) => {
  const { spreadsheetData, switchSheet, addSheet } = useSpreadsheet();
  const workbookId = spreadsheetData.workbook_id;
  
  // Fetch sheets from backend
  const { data: sheetsData, isLoading, error } = useSheetsQuery(workbookId);
  
  // Delete sheet mutation
  const deleteSheetMutation = useDeleteSheet();
  
  const [currentSheetId, setCurrentSheetId] = useState('sheet1');

  // Convert backend sheet names to frontend format
  const sheets = sheetsData?.data?.sheets?.map((sheetName, index) => ({
    id: `sheet${index + 1}`,
    name: sheetName
  })) || [];

  console.log('SheetContext Debug:', {
    workbookId,
    sheetsData,
    sheets,
    currentSheetId,
    isLoading,
    error
  });

  // Set current sheet to first sheet when sheets are loaded
  useEffect(() => {
    if (sheets.length > 0 && !sheets.find(s => s.id === currentSheetId)) {
      const newSheetId = sheets[0].id;
      console.log('Switching to first sheet:', newSheetId);
      setCurrentSheetId(newSheetId);
      switchSheet(newSheetId);
    }
  }, [sheets, currentSheetId, switchSheet]);

  const addSheetToContext = async (sheetName = null) => {
    try {
      const newSheet = await addSheet(sheetName);
      if (newSheet) {
        setCurrentSheetId(newSheet.id);
      }
      return newSheet;
    } catch (error) {
      console.error('Failed to add sheet in context:', error);
      throw error;
    }
  };

  const renameSheet = (id, newName) => {
    // For now, this is a frontend-only operation
    // In the future, you might want to add an API endpoint for renaming sheets
  };

  const deleteSheet = async (id) => {
    console.log('SheetContext deleteSheet called with:', { id, sheets, workbookId });
    if (sheets.length <= 1) return; // Don't delete the last sheet
    
    const sheetToDelete = sheets.find(sheet => sheet.id === id);
    console.log('Sheet to delete:', sheetToDelete);
    if (!sheetToDelete) return;
    
    try {
      console.log('Calling backend delete with:', { workbookId, sheetName: sheetToDelete.name });
      await deleteSheetMutation.mutateAsync({
        workbookId: workbookId,
        sheetName: sheetToDelete.name
      });
      console.log('Backend delete completed successfully');
      
      // If we're deleting the current sheet, switch to another sheet
      if (currentSheetId === id) {
        const remainingSheets = sheets.filter(sheet => sheet.id !== id);
        if (remainingSheets.length > 0) {
          const newSheetId = remainingSheets[0].id;
          console.log('Switching to sheet:', newSheetId);
          setCurrentSheetId(newSheetId);
          switchSheet(newSheetId);
        }
      }
    } catch (error) {
      console.error('Failed to delete sheet:', error);
      throw error;
    }
  };

  const setCurrentSheet = (id) => {
    setCurrentSheetId(id);
    switchSheet(id);
  };

  return (
    <SheetContext.Provider value={{ 
      sheets, 
      currentSheetId, 
      addSheet: addSheetToContext, 
      renameSheet, 
      deleteSheet,
      setCurrentSheet,
      isLoading,
      error
    }}>
      {children}
    </SheetContext.Provider>
  );
};

export const useSheets = () => useContext(SheetContext); 
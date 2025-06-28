import React, { createContext, useContext, useState, useEffect } from 'react';
import { useSheets as useSheetsQuery } from '../hooks/useSpreadsheetQueries';
import { useSpreadsheet } from './SpreadsheetContext';

const SheetContext = createContext();

export const SheetProvider = ({ children }) => {
  const { spreadsheetData, switchSheet } = useSpreadsheet();
  const workbookId = spreadsheetData.workbook_id;
  
  // Fetch sheets from backend
  const { data: sheetsData, isLoading, error } = useSheetsQuery(workbookId);
  
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

  const addSheet = () => {
    // For now, this is a frontend-only operation
    // In the future, you might want to add an API endpoint for creating sheets
    const newId = `sheet-${sheets.length + 1}`;
    const newSheet = { id: newId, name: `Sheet${sheets.length + 1}` };
    // Note: This won't persist to backend until you add a create sheet endpoint
  };

  const renameSheet = (id, newName) => {
    // For now, this is a frontend-only operation
    // In the future, you might want to add an API endpoint for renaming sheets
  };

  const deleteSheet = (id) => {
    // For now, this is a frontend-only operation
    // In the future, you might want to add an API endpoint for deleting sheets
    if (sheets.length <= 1) return; // Don't delete the last sheet
    
    if (currentSheetId === id) {
      const remainingSheets = sheets.filter(sheet => sheet.id !== id);
      if (remainingSheets.length > 0) {
        const newSheetId = remainingSheets[0].id;
        setCurrentSheetId(newSheetId);
        switchSheet(newSheetId);
      }
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
      addSheet, 
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
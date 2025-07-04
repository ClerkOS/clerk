import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { useSheets as useSheetsQuery, useDeleteSheet, useRenameSheet } from '../hooks/useSpreadsheetQueries';
import { useSpreadsheet } from './SpreadsheetContext';
import api from '../services/api';

const SheetContext = createContext();

export const SheetProvider = ({ children }) => {
  const { spreadsheetData, switchSheet, addSheet } = useSpreadsheet();
  const workbookId = spreadsheetData.workbook_id;
  
  // Fetch sheets from backend (no workbookId required)
  const { data: sheetsData, isLoading, error } = useSheetsQuery();
  
  // Delete sheet mutation
  const deleteSheetMutation = useDeleteSheet();
  
  // Rename sheet mutation
  const renameSheetMutation = useRenameSheet();
  
  const [currentSheetId, setCurrentSheetId] = useState('sheet1');
  const prevSheetCountRef = useRef(0);

  // Convert backend sheet names to frontend format
  const sheets = sheetsData?.sheets ? Object.keys(sheetsData.sheets).map((sheetName, index) => ({
    id: `sheet${index + 1}`,
    name: sheetName
  })) : [];

  console.log('SheetContext Debug:', {
    workbookId,
    sheetsData,
    sheets,
    currentSheetId,
    prevSheetCount: prevSheetCountRef.current,
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

  // Auto-switch to the newest sheet when sheets are added
  useEffect(() => {
    if (sheets.length > 0 && sheets.length > prevSheetCountRef.current) {
      // A new sheet was added, switch to the newest one
      const newestSheet = sheets[sheets.length - 1];
      console.log('Auto-switching to newest sheet:', newestSheet.id, 'from:', currentSheetId);
      setCurrentSheetId(newestSheet.id);
      switchSheet(newestSheet.id);
    }
    // Update the previous sheet count
    prevSheetCountRef.current = sheets.length;
  }, [sheets.length, switchSheet]); // Don't include currentSheetId to avoid infinite loops

  const addSheetToContext = async (sheetName = null) => {
    try {
      const newSheet = await addSheet(sheetName);
      // The auto-switching effect will handle switching to the new sheet
      return newSheet;
    } catch (error) {
      console.error('Failed to add sheet in context:', error);
      throw error;
    }
  };

  const renameSheet = async (id, newName) => {
    const sheetToRename = sheets.find(sheet => sheet.id === id);
    if (!sheetToRename) return;
    
    try {
      await renameSheetMutation.mutateAsync({
        workbookId: workbookId,
        oldName: sheetToRename.name,
        newName: newName
      });
      // The sheets query will be invalidated by the useRenameSheet hook
      console.log('Sheet renamed successfully:', sheetToRename.name, '->', newName);
    } catch (error) {
      console.error('Failed to rename sheet:', error);
      throw error;
    }
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
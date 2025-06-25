import React, { createContext, useContext, useState } from 'react';

const SheetContext = createContext();

export const SheetProvider = ({ children }) => {
  const [sheets, setSheets] = useState([
    { id: 'sheet-1', name: 'Dashboard' },
  ]);
  const [currentSheetId, setCurrentSheetId] = useState('sheet-1');

  const addSheet = () => {
    const newId = `sheet-${sheets.length + 1}`;
    const newSheet = { id: newId, name: `Sheet${sheets.length + 1}` };
    setSheets([...sheets, newSheet]);
    setCurrentSheetId(newId);
  };

  const renameSheet = (id, newName) => {
    setSheets(sheets => sheets.map(sheet =>
      sheet.id === id ? { ...sheet, name: newName } : sheet
    ));
  };

  const setCurrentSheet = (id) => {
    setCurrentSheetId(id);
  };

  return (
    <SheetContext.Provider value={{ sheets, currentSheetId, addSheet, renameSheet, setCurrentSheet }}>
      {children}
    </SheetContext.Provider>
  );
};

export const useSheets = () => useContext(SheetContext); 
import React, { useRef, useState } from "react";
import { Notification } from "./sheetTypes";
import { CellData, CellDataBySheet } from "../Grid/gridTypes";
import { Position } from "../../app/ContextMenu/contextMenuTypes";
import { createWorkbook, getWorkbook, importWorkbook } from "../../../lib/api/apiClient";
import { useWorkbookId } from "../../providers/WorkbookProvider";
import { useCellMap } from "../../providers/CellMapProvider";
import { useActiveSheet } from "../../providers/SheetProvider";

export const useSheet = () => {
  const [notification, setNotification] = useState<Notification | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { workbookId, setWorkbookId } = useWorkbookId();
  const [isWorkbookLoaded, setIsWorkbookLoaded] = useState<boolean>(false);
  const [sheets, setSheets] = useState<string[]>([]);
  const { cellDataBySheet, setCellDataBySheet } = useCellMap();
  const { setActiveSheet } = useActiveSheet();
  const [contextMenu, setContextMenu] = useState<Position | null>(null);


  const handleCreateWorkbook = async () => {
    try {
      const response = await createWorkbook();
      if (response.data.success) {
        console.log("workbookId:", response.data.data.workbook_id);
        setWorkbookId(response.data.data.workbook_id);
        
        // Set default sheets for new workbook
        const defaultSheets = ["Sheet1", "Sheet2", "Sheet3"];
        setSheets(defaultSheets);
        setActiveSheet(defaultSheets[0]); // Set first sheet as active
        
        setIsWorkbookLoaded(true);
      }
    } catch (error) {
      console.error("Error creating workbook", error);
    }
  };

  const handleImportWorkbook = async (file: File) => {
    if (!file) return;
    try {
      const importResponse = await importWorkbook(file);
      if (!importResponse.data.success) return;
      const newWorkbookId = importResponse.data.data.workbook_id;
      console.log("workbookId:", newWorkbookId);
      setWorkbookId(newWorkbookId);
      console.log("workbookId:", workbookId);
      
      const importedSheets = importResponse.data.data.sheets;
      setSheets(importedSheets);

      // Set the first sheet as active if sheets exist
      if (importedSheets.length > 0) {
        setActiveSheet(importedSheets[0]);
      }

      const getResponse = await getWorkbook(newWorkbookId);
      if (getResponse.data.success) {
        const newCellDataBySheet: CellDataBySheet = {};

        getResponse.data.data.sheets.forEach(
          (sheet: { name: string; cells: Record<string, CellData>; }) => {
          newCellDataBySheet[sheet.name] = new Map(
            Object.entries(sheet.cells)
          );
        });

        setCellDataBySheet(newCellDataBySheet);
      }

      setIsWorkbookLoaded(true);
    } catch (error) {
      console.error("Error importing workbook", error);
    }
  };

// Handle context menu
  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    setContextMenu({
      x: e.clientX,
      y: e.clientY
    });
  };

  const handleCloseContextMenu = () => {
    setContextMenu(null);
  };

  // console.log("workbookId:", workbookId)
  // console.log("sheets:",sheets)
  // console.log("book data:",cellDataBySheet)


  return {
    isWorkbookLoaded,
    workbookId,
    handleCreateWorkbook,
    handleImportWorkbook,
    sheets,
    cellDataBySheet,
    contextMenu,
    handleContextMenu,
    handleCloseContextMenu
  };
};

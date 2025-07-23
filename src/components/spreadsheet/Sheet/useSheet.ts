import React, { useCallback, useEffect, useRef, useState } from "react";
import { AlertCircle, CheckCircle, Database, HelpCircle, Table } from "lucide-react";
import { Notification, SpreadsheetProps } from "./sheetTypes";
import {CellData, CellDataBySheet} from "../Cell/cellTypes";
import { createWorkbook, getWorkbook, importWorkbook } from "../../../lib/api/apiClient";

export const useSheet = () => {
  const [notification, setNotification] = useState<Notification | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [workbookId, setWorkbookId] = useState<string>("");
  const [isWorkbookLoaded, setIsWorkbookLoaded] = useState<boolean>(false)
  const [sheets, setSheets] = useState<string[]>([])
  const [cellDataBySheet, setCellDataBySheet] = useState<CellDataBySheet>({})


  const handleCreateWorkbook = async ()=> {
    try{
      const response = await createWorkbook()
      if (response.data.success){
        setWorkbookId(response.data.data.workbook_id)
        setIsWorkbookLoaded(true)
      }
    } catch (error){
      console.error("Error creating workbook", error)
    }
  }

  const handleImportWorkbook = async (file: File) => {
    if (!file) return
    try{
      const importResponse = await importWorkbook(file)
      if (importResponse.data.success){
        const newWorkbookId = importResponse.data.data.workbook_id;
        setWorkbookId(newWorkbookId)
        setSheets(importResponse.data.data.sheets)

        const getResponse = await getWorkbook(newWorkbookId)
        if (getResponse.data.success){
          const newCellDataBySheet: CellDataBySheet = {}

          getResponse.data.data.sheets.forEach((sheet: { name: string; cells: Record<string, CellData>; }) => {
            newCellDataBySheet[sheet.name] = sheet.cells
          })

          setCellDataBySheet(newCellDataBySheet)
        }
        setIsWorkbookLoaded(true)
      }
    } catch (error){
      console.error("Error importing workbook", error)
    }
  }

  // console.log("workbookId:", workbookId)
  // console.log("sheets:",sheets)
  // console.log("book data:",cellDataBySheet)


  return{
    isWorkbookLoaded,
    workbookId,
    handleCreateWorkbook,
    handleImportWorkbook,
    sheets,
    cellDataBySheet
    //
    // showTablesPanel,
    // setShowTablesPanel,
    // tablesPanelWidth,
    // setTablesPanelWidth,
    // notification,
    // setNotification,
    // contextMenu,
    // setContextMenu,
    // isEditing,
    // setIsEditing,
    // fileInputRef,
    // handleKeyDown,
    // handleEditingChange,
    // isEmpty,
    // handleContextMenu,
    // handleFileUpload,
    // handleCloseContextMenu,
    // // handleFileImport,
    // // handleFileExport,
    // // handleContextMenu,
    // // handleCloseContextMenu,
    // // handleOpenAIWithRange,
    // // isEmpty,
    // // handleFileUpload,
    // handleNewSheet,
    // handleSampleData
  }

};

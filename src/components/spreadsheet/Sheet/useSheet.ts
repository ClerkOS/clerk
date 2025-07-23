import React, { useCallback, useEffect, useRef, useState } from "react";
import { AlertCircle, CheckCircle, Database, HelpCircle, Table } from "lucide-react";
import { Notification, SpreadsheetProps } from "./sheetTypes";
import { createWorkbook } from "../../../lib/api/apiClient";

export const useSheet = () => {
  const [notification, setNotification] = useState<Notification | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [workbookId, setWorkbookId] = useState<string>("");
  const [isWorkbookLoaded, setIsWorkbookLoaded] = useState<boolean>(false)

  const handleCreateWorkbook = async ()=> {
    try{
      const response = await createWorkbook()
      if (response.data.success){
        setWorkbookId(response.data.data.workbook_id)
        setIsWorkbookLoaded(true)
      }
    } catch (error){
      console.error("Error creating new sheet", error)
    }
  }

  // const handleImportWorkbook = async (event: React.ChangeEvent<HTMLInputElement>) => {
  //   const file = event.target.files?.[0]
  //   if (!file) return
  //
  //   try{
  //     setNotification({
  //       type: "info",
  //       message: "Importing file..."
  //     })
  //
  //
  //   }
  // }

  return{
    isWorkbookLoaded,
    workbookId,
    handleCreateWorkbook
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

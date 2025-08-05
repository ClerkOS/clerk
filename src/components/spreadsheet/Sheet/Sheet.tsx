import React, { useEffect } from "react";
// import TablesPanel from './TablesPanel.jsx';
// import { useSpreadsheet } from '../../context/SpreadsheetContext.jsx';
// import { SelectionProvider, useSelection } from './SelectionManager.jsx';
import EmptyState from "../EmptyState/EmptyState";
import FormulaBar from "../FormulaBar/FormulaBar";
import Grid from "../Grid/Grid";
import { RevoGrid } from '@revolist/react-datagrid';
import ContextMenu from "../../app/ContextMenu/ContextMenu";
import { useSheet } from "./useSheet";
import { type SpreadsheetProps } from "./sheetTypes";
import { useActiveSheet } from "../../providers/SheetProvider";
import Grid2 from "../Grid/Grid2";
// import { handleFileUpload, validateFile } from '../../services/fileService.js';
// import { useWorkbookOperations } from '../../features/useWorkbookOperations.js';
// import ContextMenu from '../ai/ContextMenu.jsx';


const Spreadsheet: React.FC<SpreadsheetProps> = ({ isPanelOpen = false, panelWidth = 320, onOpenAIWithRange }) => {
  const {
    workbookId,
    isWorkbookLoaded,
    handleCreateWorkbook,
    handleImportWorkbook,
    sheets,
    cellDataBySheet,
    contextMenu,
    handleContextMenu,
    handleCloseContextMenu
  } = useSheet();

  const { activeSheet, setActiveSheet } = useActiveSheet();

  const columns = [...Array(26)].map((_, i) => String.fromCharCode(65 + i));

  const columnDefs = columns.map(col => ({
    prop: col,
    name: col,
    size: 100,
  }));

  const sheetData = activeSheet ? cellDataBySheet?.[activeSheet] : null
  const numRows = 100; // adjust as needed
  const data = Array.from({ length: numRows }, (_, rowIndex) => {
    const row: Record<string, string> = {};
    columns.forEach(col => {
      const cellId = `${col}${rowIndex + 1}`;
      row[col] = sheetData?.[cellId]?.value ?? '';    });
    return row;
  });

  return (
    <>
      <div className="flex h-full w-full">
        <div className="flex flex-col h-full w-full transition-all duration-300 ease-in-out"
          // style={{
          //   width: isPanelOpen ? `calc(100% - ${Math.min(panelWidth, window.innerWidth * 0.7)}px)` : '100%',
          //   marginRight: 0
          // }}
        >
          <FormulaBar />
          <div
            className="flex-1 overflow-auto"
            onContextMenu={handleContextMenu}
          >
            {isWorkbookLoaded ? (
              // <Grid
              //   key={`grid-${"default"}`} // Replace with actual active sheet ID
              //   isEditing={true}
              //   onEditingChange={() => console.log("Edit")}
              //   workbookId={workbookId}
              //   workbookSheets={sheets}
              //   sheetData={cellDataBySheet}
              // />
              // <RevoGrid
              //   className={"flex-1 p-0 relative bg-white dark:bg-gray-900"}
              //   style={{fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" }}
              //   columns={columnDefs}
              //   source={data}
              //   rowHeaders
              //   resize={true}
              //   autoSizeColumn
              //   theme="default"
              // />
              <Grid2 />
            ) : (
              <EmptyState
                onFileUpload={handleImportWorkbook}
                onCreateNewWorkbook={handleCreateWorkbook}
                error={null}
              />
            )}
          </div>
        </div>
      </div>

      {/* Context Menu */}
      {contextMenu && (
        <ContextMenu
          position={contextMenu}
          onClose={handleCloseContextMenu}
          onOpenAIWithRange={() => console.log("Open AI with range")}
          isCell={true}
          selectedCells={[]}
          cellId={""}
        />
      )}
    </>
  );
};


// const Spreadsheet: React.FC<SpreadsheetProps> = ({ isPanelOpen=false, panelWidth = 320, onOpenAIWithRange }) => {
//   return (
//     // <SelectionProvider>
//       <SpreadsheetContent
//         isPanelOpen={isPanelOpen}
//         panelWidth={panelWidth}
//         onOpenAIWithRange={onOpenAIWithRange}
//       />
//     // </SelectionProvider>
//   );
// };

export default Spreadsheet;
import React from "react";
// import TablesPanel from './TablesPanel.jsx';
// import { useSpreadsheet } from '../../context/SpreadsheetContext.jsx';
// import { SelectionProvider, useSelection } from './SelectionManager.jsx';
import EmptyState from "../EmptyState/EmptyState";
import FormulaBar from "../FormulaBar/FormulaBar";
import ContextMenu from "../../app/ContextMenu/ContextMenu";
import { useSheet } from "./useSheet";
import { type SpreadsheetProps } from "./sheetTypes";
import { useActiveSheet } from "../../providers/SheetProvider";
import Grid from "../Grid/Grid";
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
  const sheetData = activeSheet ? cellDataBySheet?.[activeSheet] : new Map;


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
              <Grid
                workbookId={workbookId}
                sheetName={activeSheet ?? "Sheet1"}
                // initialCellMap={sheetData}
                initialCellMap={cellDataBySheet["Sheet1"] ?? new Map()}
              />
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


export default Spreadsheet;
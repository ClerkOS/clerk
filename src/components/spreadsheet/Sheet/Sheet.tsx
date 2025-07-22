import React, { useEffect, useRef, useState, useCallback } from 'react';
// import TablesPanel from './TablesPanel.jsx';
// import { useSpreadsheet } from '../../context/SpreadsheetContext.jsx';
// import { SelectionProvider, useSelection } from './SelectionManager.jsx';
import EmptyState from "../EmptyState/EmptyState";
import FormulaBar from "../FormulaBar/FormulaBar";
import Grid from "../Grid/Grid";
import ContextMenu from '../../app/ContextMenu/ContextMenu';
import {useSheet} from "./useSheet";
import {type SpreadsheetProps, type Notification} from "./sheetTypes";
// import { handleFileUpload, validateFile } from '../../services/fileService.js';
// import { useWorkbookOperations } from '../../features/useWorkbookOperations.js';
// import ContextMenu from '../ai/ContextMenu.jsx';



const Spreadsheet: React.FC<SpreadsheetProps> = ({ isPanelOpen = false, panelWidth = 320, onOpenAIWithRange }) => {
  console.log('SpreadsheetContent component rendering');

  const{
    showTablesPanel,
    setShowTablesPanel,
    tablesPanelWidth,
    setTablesPanelWidth,
    notification,
    setNotification,
    contextMenu,
    setContextMenu,
    isEditing,
    setIsEditing,
    fileInputRef,
    handleKeyDown,
    handleEditingChange,
    isEmpty,
    handleContextMenu,
    handleFileUpload,
    handleCloseContextMenu,
    // handleFileImport,
    // handleFileExport,
    // handleContextMenu,
    // handleCloseContextMenu,
    // handleOpenAIWithRange,
    // isEmpty,
    // handleFileUpload,
    handleNewSheet,
    handleSampleData
  } = useSheet()

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
            {isEmpty ? (
              <EmptyState
                onFileUpload={handleFileUpload}
                onNewSheet={() => console.log('Create new sheet')}
                onSampleData={() => console.log('Load sample data')}
                error={null} // Replace with actual error state if needed
              />
            ) : (
              <Grid
                key={`grid-${'default'}`} // Replace with actual active sheet ID
                isEditing={isEditing}
                onEditingChange={handleEditingChange}
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
          onOpenAIWithRange={() => console.log('Open AI with range')}
          isCell={true}
          selectedCells={[]}
          cellId={''}
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
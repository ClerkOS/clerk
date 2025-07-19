import React, { useEffect, useRef, useState, useCallback } from 'react';
// import TablesPanel from './TablesPanel.jsx';
// import { useSpreadsheet } from '../../context/SpreadsheetContext.jsx';
// import { SelectionProvider, useSelection } from './SelectionManager.jsx';
import { Upload, Plus, FileText, FileUp, FileDown, AlertCircle, CheckCircle } from 'lucide-react';
import { useTheme } from "../providers/ThemeProvider";
import EmptyState from "./EmptyState";
import FormulaBar from "./FormulaBar";
import Grid from "./Grid";
// import { handleFileUpload, validateFile } from '../../services/fileService.js';
// import { useWorkbookOperations } from '../../features/useWorkbookOperations.js';
// import ContextMenu from '../ai/ContextMenu.jsx';


interface SpreadsheetContentProps {
  isPanelOpen?: boolean;
  panelWidth?: number;
  onOpenAIWithRange: (range: string) => void;
}

interface Notification {
  type: 'success' | 'error';
  message: string;
  icon: React.ReactNode;
}

const SpreadsheetContent: React.FC<SpreadsheetContentProps> = ({ isPanelOpen = false, panelWidth = 320, onOpenAIWithRange }) => {
  console.log('SpreadsheetContent component rendering');

  // const {
  //   selectedCell,
  //   setSelectedCell,
  //   activeFormula,
  //   setActiveFormula,
  //   getActiveSheet,
  //   zoom,
  //   setZoom,
  //   visibleColumns,
  //   addColumns,
  //   getTotalColumns,
  //   isColumnVisible,
  //   getColumnWidth,
  //   updateColumnWidth
  // } = useSpreadsheet();

  // Get selection state
  // const { selectedCells, clearSelection, startSelection } = useSelection();

  // React Query features for workbook operations
  // const { importWorkbook, exportWorkbook, isImporting, isExporting, importError, exportError } = useWorkbookOperations();

  const [showTablesPanel, setShowTablesPanel] = useState(false);
  const [tablesPanelWidth, setTablesPanelWidth] = useState(300);
  const [notification, setNotification] = useState<Notification | null>(null);
  const [contextMenu, setContextMenu] = useState<{x: number, y: number} | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Helper functions for column navigation
  const colToNum = (col: string): number => {
    let result = 0;
    for (let i = 0; i < col.length; i++) {
      result = result * 26 + (col.charCodeAt(i) - 64);
    }
    return result - 1;
  };

  const numToCol = (num: number): string => {
    let result = '';
    num = num + 1;
    while (num > 0) {
      const remainder = (num - 1) % 26;
      result = String.fromCharCode(65 + remainder) + result;
      num = Math.floor((num - 1) / 26);
    }
    return result;
  };

  // Keyboard navigation handler
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement || isEditing) {
      return;
    }

    // const { col, row } = selectedCell;
    const { col, row } = ( { col: 'A', row: 1 });
    let newCol = col;
    let newRow = row;

    switch (e.key) {
      case 'ArrowUp':
        e.preventDefault();
        newRow = Math.max(1, row - 1);
        break;
      case 'ArrowDown':
        e.preventDefault();
        newRow = row + 1;
        break;
      case 'ArrowLeft':
        e.preventDefault();
        const colNum = colToNum(col);
        if (colNum > 0) {
          newCol = numToCol(colNum - 1);
        }
        break;
      case 'ArrowRight':
        e.preventDefault();
        const nextColNum = colToNum(col);
        newCol = numToCol(nextColNum + 1);
        break;
      // case 'Tab':
      //   e.preventDefault();
      //   if (e.shiftKey) {
      //     const colNum = colToNum(col);
      //     if (colNum > 0) {
      //       newCol = numToCol(colNum - 1);
      //     } else {
      //       newRow = Math.max(1, row - 1);
      //       newCol = numToCol(visibleColumns - 1);
      //     }
      //   } else {
      //     const nextColNum = colToNum(col);
      //     if (nextColNum < visibleColumns - 1) {
      //       newCol = numToCol(nextColNum + 1);
      //     } else {
      //       newRow = row + 1;
      //       newCol = 'A';
      //     }
      //   }
      //   break;
      case 'Enter':
        e.preventDefault();
        setIsEditing(true);
        return;
      case 'Home':
        e.preventDefault();
        newCol = 'A';
        break;
      case 'End':
        e.preventDefault();
        // const lastColNum = visibleColumns - 1;
        // newCol = numToCol(lastColNum);
        break;
      case 'PageUp':
        e.preventDefault();
        newRow = Math.max(1, row - 20);
        break;
      case 'PageDown':
        e.preventDefault();
        newRow = row + 20;
        break;
      default:
        return;
    }

    // if (newCol !== col || newRow !== row) {
    //   setSelectedCell({ col: newCol, row: newRow });
    //   // clearSelection();
    //   // startSelection(newCol, newRow);
    // }
  }, [])
    // [selectedCell, visibleColumns, setSelectedCell, clearSelection, startSelection, isEditing]);

  // Add keyboard event listener
  useEffect(() => {
    const handleGlobalKeyDown = (e: KeyboardEvent) => {
      handleKeyDown(e);
    };

    document.addEventListener('keydown', handleGlobalKeyDown);
    return () => {
      document.removeEventListener('keydown', handleGlobalKeyDown);
    };
  }, [handleKeyDown]);

  // Handle editing state changes
  const handleEditingChange = useCallback((editing: boolean) => {
    setIsEditing(editing);
  }, []);

  // Handle file import
  const handleFileImport = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      try {
        // await importWorkbook(file);
        setNotification({
          type: 'success',
          message: 'Workbook imported successfully!',
          icon: <CheckCircle size={16} />
        });
        // Reset file input
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
      } catch (error) {
        setNotification({
          type: 'error',
          message: 'Failed to import workbook',
          icon: <AlertCircle size={16} />
        });
      }
    }
  };

  // Handle file export
  const handleFileExport = async () => {
    try {
      // await exportWorkbook();
      setNotification({
        type: 'success',
        message: 'Workbook exported successfully!',
        icon: <CheckCircle size={16} />
      });
    } catch (error) {
      setNotification({
        type: 'error',
        message: 'Failed to export workbook',
        icon: <AlertCircle size={16} />
      });
    }
  };

  // Clear notification after 3 seconds
  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => {
        setNotification(null);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [notification]);

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

  const handleOpenAIWithRange = (selectedRange: string) => {
    setContextMenu(null);
    onOpenAIWithRange(selectedRange);
  };

  const isEmpty = false; // Replace with actual check for empty state
  // const activeSheet = getActiveSheet();
  // const isEmpty = !activeSheet || !activeSheet.id;
  //
  // console.log('Spreadsheet rendering:', {
  //   activeSheet: activeSheet ? { id: activeSheet.id, name: activeSheet.name } : null,
  //   isEmpty,
  //   hasActiveSheet: !!activeSheet,
  //   hasActiveSheetId: !!(activeSheet && activeSheet.id),
  //   activeSheetId: activeSheet?.id,
  //   activeSheetName: activeSheet?.name
  // });
  //
  // // Force re-render when active sheet changes
  // const gridKey = `grid-${activeSheet?.id || 'default'}`;

  const handleFileUpload = async (file: File) => {
    try {
      // await importWorkbook(file);
    } catch (error) {
      setNotification({
        type: 'error',
        message: error instanceof Error ? error.message : 'File upload failed',
        icon: <AlertCircle size={16} />
      });
    }
  };

  const handleNewSheet = () => {
    // Implement new sheet creation
    console.log('Create new sheet');
  };

  const handleSampleData = () => {
    // Implement sample data loading
    console.log('Load sample data');
  };

  // Debug: Track active sheet changes
  // useEffect(() => {
  //   console.log('Spreadsheet - Active sheet changed:', {
  //     activeSheetId: activeSheet?.id,
  //     activeSheetName: activeSheet?.name,
  //     gridKey: gridKey
  //   });
  // }, [activeSheet?.id, activeSheet?.name, gridKey]);

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
      {/*{contextMenu && (*/}
      {/*  <ContextMenu*/}
      {/*    position={contextMenu}*/}
      {/*    onClose={handleCloseContextMenu}*/}
      {/*    onOpenAIWithRange={handleOpenAIWithRange}*/}
      {/*    isCell={true}*/}
      {/*    selectedCells={selectedCells}*/}
      {/*    cellId={selectedCells.length === 1 ? selectedCells[0] : null}*/}
      {/*  />*/}
      {/*)}*/}
    </>
  );
};

interface SpreadsheetProps {
  isPanelOpen?: boolean;
  panelWidth?: number;
  onOpenAIWithRange: (range: string) => void;
}

const Spreadsheet: React.FC<SpreadsheetProps> = ({ isPanelOpen=false, panelWidth = 320, onOpenAIWithRange }) => {
  return (
    // <SelectionProvider>
      <SpreadsheetContent
        isPanelOpen={isPanelOpen}
        panelWidth={panelWidth}
        onOpenAIWithRange={onOpenAIWithRange}
      />
    // </SelectionProvider>
  );
};

export default Spreadsheet;
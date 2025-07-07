import React, { useEffect, useRef, useState, useCallback } from 'react';
import Grid from './Grid';
import FormulaBar from './FormulaBar';
import TablesPanel from './TablesPanel';
import { useSpreadsheet } from '../../context/SpreadsheetContext';
import { SelectionProvider, useSelection } from './SelectionManager';
import { Upload, Plus, FileText, FileUp, FileDown, AlertCircle, CheckCircle } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { handleFileUpload, validateFile } from '../../services/fileService';
import { useWorkbookOperations } from '../../hooks/useWorkbookOperations';
import ContextMenu from '../ai/ContextMenu';

const ModernEmptyState = () => {
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState(null);
  const [isHovering, setIsHovering] = useState(false);
  const { theme } = useTheme();

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const processFile = async (file) => {
    try {
      setError(null);
      validateFile(file);
      await handleFileUpload(file);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDrop = async (e) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) {
      await processFile(file);
    }
  };

  const handleFileSelect = async (e) => {
    const file = e.target.files[0];
    if (file) {
      await processFile(file);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-full p-8">
      {/* Main Upload Area */}
      <div 
        className={`relative w-full max-w-md transition-all duration-300 ease-out ${
          isDragging ? 'scale-105' : isHovering ? 'scale-102' : 'scale-100'
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={() => setIsHovering(false)}
      >
        <label className={`
          group cursor-pointer block relative overflow-hidden
          rounded-2xl border-2 border-dashed transition-all duration-300
          ${isDragging 
            ? 'border-blue-500 bg-blue-50/50 dark:bg-blue-500/10 shadow-lg shadow-blue-500/20' 
            : isHovering
            ? 'border-gray-400 dark:border-gray-500 bg-gray-50/50 dark:bg-gray-800/50'
            : 'border-gray-300 dark:border-gray-700 hover:border-gray-400 dark:hover:border-gray-600'
          }
        `}>
          <input
            type="file"
            accept=".xlsx,.xls,.csv"
            className="hidden"
            onChange={handleFileSelect}
          />
          
          {/* Background gradient effect */}
          <div className={`
            absolute inset-0 opacity-0 transition-opacity duration-300
            bg-gradient-to-br from-blue-500/5 to-purple-500/5
            ${isHovering || isDragging ? 'opacity-100' : ''}
          `} />
          
          <div className="relative p-12 text-center">
            {/* Icon with subtle animation */}
            <div className={`
              inline-flex items-center justify-center w-16 h-16 mb-6
              rounded-full bg-gray-100 dark:bg-gray-800 transition-all duration-300
              ${isDragging ? 'bg-blue-100 dark:bg-blue-900/30 scale-110' : ''}
              ${isHovering ? 'scale-105' : ''}
            `}>
              <Upload 
                size={24} 
                className={`
                  transition-colors duration-300
                  ${isDragging 
                    ? 'text-blue-600 dark:text-blue-400' 
                    : 'text-gray-500 dark:text-gray-400'
                  }
                `} 
              />
            </div>
            
            <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-gray-100">
              {isDragging ? 'Drop it here' : 'Upload your file'}
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6 leading-relaxed">
              Drag and drop your CSV or Excel file here, or click to browse
            </p>
            
            {/* Supported formats */}
            <div className="flex items-center justify-center gap-4 text-xs text-gray-500 dark:text-gray-500">
              <span className="px-2 py-1 bg-gray-100 dark:bg-gray-800 rounded-full">CSV</span>
              <span className="px-2 py-1 bg-gray-100 dark:bg-gray-800 rounded-full">XLSX</span>
              <span className="px-2 py-1 bg-gray-100 dark:bg-gray-800 rounded-full">XLS</span>
            </div>
          </div>
        </label>
      </div>
      
      {/* Error message */}
      {error && (
        <div className="mt-4 p-3 max-w-md text-sm text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800">
          {error}
        </div>
      )}
      
      {/* Divider */}
      <div className="flex items-center w-full max-w-md my-8">
        <div className="flex-1 h-px bg-gray-200 dark:bg-gray-700"></div>
        <span className="px-4 text-sm text-gray-500 dark:text-gray-500">or</span>
        <div className="flex-1 h-px bg-gray-200 dark:bg-gray-700"></div>
      </div>
      
      {/* Quick actions */}
      <div className="flex gap-3">
        <button className="
          group flex items-center gap-2 px-4 py-2.5 text-sm font-medium 
          bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 
          rounded-lg hover:bg-gray-50 dark:hover:bg-gray-750 
          transition-all duration-200 hover:scale-105 hover:shadow-md
        ">
          <Plus size={16} className="text-gray-500 dark:text-gray-400 group-hover:text-gray-700 dark:group-hover:text-gray-300" />
          <span className="text-gray-700 dark:text-gray-300">New Sheet</span>
        </button>
        
        <button className="
          group flex items-center gap-2 px-4 py-2.5 text-sm font-medium 
          bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 
          rounded-lg hover:bg-gray-50 dark:hover:bg-gray-750 
          transition-all duration-200 hover:scale-105 hover:shadow-md
        ">
          <FileText size={16} className="text-gray-500 dark:text-gray-400 group-hover:text-gray-700 dark:group-hover:text-gray-300" />
          <span className="text-gray-700 dark:text-gray-300">Sample Data</span>
        </button>
      </div>
    </div>
  );
};

const SpreadsheetContent = ({ isPanelOpen, panelWidth, onOpenAIWithRange }) => {
  console.log('SpreadsheetContent component rendering');
  
  const { 
    selectedCell, 
    setSelectedCell, 
    activeFormula, 
    setActiveFormula,
    getActiveSheet,
    zoom,
    setZoom,
    visibleColumns,
    addColumns,
    getTotalColumns,
    isColumnVisible,
    getColumnWidth,
    updateColumnWidth
  } = useSpreadsheet();

  // Get selection state
  const { selectedCells, clearSelection, startSelection } = useSelection();

  // React Query hooks for workbook operations
  const { importWorkbook, exportWorkbook, isImporting, isExporting, importError, exportError } = useWorkbookOperations();

  const [showTablesPanel, setShowTablesPanel] = useState(false);
  const [tablesPanelWidth, setTablesPanelWidth] = useState(300);
  const [notification, setNotification] = useState(null);
  const [contextMenu, setContextMenu] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const fileInputRef = useRef(null);

  // Helper functions for column navigation
  const colToNum = (col) => {
    let result = 0;
    for (let i = 0; i < col.length; i++) {
      result = result * 26 + (col.charCodeAt(i) - 64);
    }
    return result - 1; // 0-based index
  };

  const numToCol = (num) => {
    let result = '';
    num = num + 1; // 1-based index
    while (num > 0) {
      const remainder = (num - 1) % 26;
      result = String.fromCharCode(65 + remainder) + result;
      num = Math.floor((num - 1) / 26);
    }
    return result;
  };

  // Keyboard navigation handler
  const handleKeyDown = useCallback((e) => {
    // Only handle arrow keys when not editing a cell
    if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA' || isEditing) {
      return;
    }

    const { col, row } = selectedCell;
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
      case 'Tab':
        e.preventDefault();
        if (e.shiftKey) {
          // Shift+Tab: move left
          const colNum = colToNum(col);
          if (colNum > 0) {
            newCol = numToCol(colNum - 1);
          } else {
            // Wrap to previous row, last column
            newRow = Math.max(1, row - 1);
            newCol = numToCol(visibleColumns - 1);
          }
        } else {
          // Tab: move right
          const nextColNum = colToNum(col);
          if (nextColNum < visibleColumns - 1) {
            newCol = numToCol(nextColNum + 1);
          } else {
            // Wrap to next row, first column
            newRow = row + 1;
            newCol = 'A';
          }
        }
        break;
      case 'Enter':
        e.preventDefault();
        // Start editing the current cell
        setIsEditing(true);
        return; // Don't move the cell, just start editing
      case 'Home':
        e.preventDefault();
        newCol = 'A';
        break;
      case 'End':
        e.preventDefault();
        // Move to the last visible column
        const lastColNum = visibleColumns - 1;
        newCol = numToCol(lastColNum);
        break;
      case 'PageUp':
        e.preventDefault();
        newRow = Math.max(1, row - 20); // Move up 20 rows
        break;
      case 'PageDown':
        e.preventDefault();
        newRow = row + 20; // Move down 20 rows
        break;
      default:
        return; // Don't handle other keys
    }

    // Update the selected cell
    if (newCol !== col || newRow !== row) {
      setSelectedCell({ col: newCol, row: newRow });
      clearSelection();
      startSelection(newCol, newRow);
    }
  }, [selectedCell, visibleColumns, setSelectedCell, clearSelection, startSelection, isEditing]);

  // Add keyboard event listener
  useEffect(() => {
    const handleGlobalKeyDown = (e) => {
      handleKeyDown(e);
    };

    // Add event listener to document
    document.addEventListener('keydown', handleGlobalKeyDown);

    // Cleanup
    return () => {
      document.removeEventListener('keydown', handleGlobalKeyDown);
    };
  }, [handleKeyDown]);

  // Handle editing state changes
  const handleEditingChange = useCallback((editing) => {
    setIsEditing(editing);
  }, []);

  // Handle file import
  const handleFileImport = async (event) => {
    const file = event.target.files[0];
    if (file) {
      try {
        await importWorkbook(file);
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
      await exportWorkbook();
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
  const handleContextMenu = (e) => {
    e.preventDefault();
    setContextMenu({
      x: e.clientX,
      y: e.clientY
    });
  };

  const handleCloseContextMenu = () => {
    setContextMenu(null);
  };

  const handleOpenAIWithRange = (selectedRange) => {
    setContextMenu(null);
    onOpenAIWithRange(selectedRange);
  };

  const activeSheet = getActiveSheet();
  const isEmpty = !activeSheet || !activeSheet.id;

  console.log('Spreadsheet rendering:', {
    activeSheet: activeSheet ? { id: activeSheet.id, name: activeSheet.name } : null,
    isEmpty,
    hasActiveSheet: !!activeSheet,
    hasActiveSheetId: !!(activeSheet && activeSheet.id),
    activeSheetId: activeSheet?.id,
    activeSheetName: activeSheet?.name
  });

  // Force re-render when active sheet changes
  const gridKey = `grid-${activeSheet?.id || 'default'}`;

  // Debug: Track active sheet changes
  useEffect(() => {
    console.log('Spreadsheet - Active sheet changed:', {
      activeSheetId: activeSheet?.id,
      activeSheetName: activeSheet?.name,
      gridKey: gridKey
    });
  }, [activeSheet?.id, activeSheet?.name, gridKey]);

  return (
    <>
      <div className="flex h-full">
        <div 
          className="flex flex-col h-full transition-all duration-300 ease-in-out"
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
              <ModernEmptyState />
            ) : (
              <Grid 
                key={gridKey} 
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
          onOpenAIWithRange={handleOpenAIWithRange}
          isCell={true}
          selectedCells={selectedCells}
          cellId={selectedCells.length === 1 ? selectedCells[0] : null}
        />
      )}
    </>
  );
};

const Spreadsheet = ({ isPanelOpen, panelWidth = 320, onOpenAIWithRange }) => {
  return (
    <SelectionProvider>
      <SpreadsheetContent 
        isPanelOpen={isPanelOpen} 
        panelWidth={panelWidth}
        onOpenAIWithRange={onOpenAIWithRange}
      />
    </SelectionProvider>
  );
};

export default Spreadsheet;
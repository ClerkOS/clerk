import React, { useState, useRef, useEffect } from 'react';
import { Moon, Sun, ChevronDown, User, Upload, Download } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { useSpreadsheet } from '../../context/SpreadsheetContext';
import { useWorkbookOperations } from '../../hooks/useWorkbookOperations';
import ThemeToggle from '../ui/ThemeToggle';

const Header = () => {
  const { theme, toggleTheme } = useTheme();
  const { importWorkbook: importWorkbookFromContext, fetchWorkbook } = useSpreadsheet();
  const { importWorkbook, exportWorkbook, isImporting, isExporting } = useWorkbookOperations();
  const fileInputRef = useRef(null);

  // Handle file import
  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileSelect = async (event) => {
    const file = event.target.files[0];
    if (file) {
      try {
        // Import the file using the workbook operations hook
        const result = await importWorkbook(file);
        
        // If import was successful and we have a workbook ID, fetch the workbook data
        if (result && result.data && result.data.workbook_id) {
          // Update the SpreadsheetContext with the imported data
          await fetchWorkbook(result.data.workbook_id);
        }
        
        // Reset file input
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
      } catch (error) {
        console.error('Import failed:', error);
      }
    }
  };

  // Handle file export
  const handleFileExport = async () => {
    try {
      await exportWorkbook();
    } catch (error) {
      console.error('Export failed:', error);
    }
  };

  return (
    <div className="flex items-center justify-between px-4 sm:px-6 py-3 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700" style={{ fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" }}>
      <div className="flex items-center space-x-2 sm:space-x-4">
        <span className="font-bold text-xl sm:text-2xl text-gray-900 dark:text-white">Clerk</span>
      </div>
      <div className="flex items-center space-x-2 sm:space-x-3">
        {/* Hidden file input */}
        <input
          ref={fileInputRef}
          type="file"
          accept=".xlsx,.xls,.csv"
          onChange={handleFileSelect}
          className="hidden"
          disabled={isImporting}
        />
        
        {/* Import Button */}
        <button 
          className="flex items-center space-x-1 sm:space-x-2 text-sm border border-gray-400 dark:border-gray-700 bg-transparent hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-200 rounded-lg px-2 sm:px-4 py-2 font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-blue-400 disabled:opacity-50 disabled:cursor-not-allowed"
          onClick={handleImportClick}
          disabled={isImporting}
        >
          <Upload size={16} className="sm:w-[18px] sm:h-[18px]" />
          <span className="hidden sm:inline">{isImporting ? 'Importing...' : 'Import'}</span>
        </button>

        {/* Export Button */}
        <button 
          className="flex items-center space-x-1 sm:space-x-2 text-sm border border-gray-400 dark:border-gray-700 bg-transparent hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-200 rounded-lg px-2 sm:px-4 py-2 font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-blue-400 disabled:opacity-50 disabled:cursor-not-allowed"
          onClick={handleFileExport}
          disabled={isExporting}
        >
          <Download size={16} className="sm:w-[18px] sm:h-[18px]" />
          <span className="hidden sm:inline">{isExporting ? 'Exporting...' : 'Export'}</span>
        </button>

        {/* Vertical divider */}
        <div className="hidden sm:block h-7 w-px bg-gray-300 dark:bg-gray-700 mx-3" />
        
        {/* Theme Toggle */}
        <ThemeToggle />
        
        {/* User Avatar */}
        <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white">
          <User size={16} className="sm:w-[18px] sm:h-[18px]" />
        </div>
      </div>
    </div>
  );
};

export default Header;
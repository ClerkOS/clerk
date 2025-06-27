import React, { useState, useRef, useEffect } from 'react';
import { Moon, Sun, ChevronDown, User, Upload, Download, FileText, FileSpreadsheet, FileCode } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { useWorkbookOperations } from '../../hooks/useWorkbookOperations';
import ThemeToggle from '../ui/ThemeToggle';

const Header = () => {
  const { theme, toggleTheme } = useTheme();
  const [showFileMenu, setShowFileMenu] = useState(false);
  const fileMenuRef = useRef(null);
  const fileInputRef = useRef(null);
  
  // React Query hooks for workbook operations
  const { importWorkbook, exportWorkbook, isImporting, isExporting } = useWorkbookOperations();
  
  // Close file menu on outside click
  useEffect(() => {
    if (!showFileMenu) return;
    function handleClick(e) {
      if (fileMenuRef.current && !fileMenuRef.current.contains(e.target)) {
        setShowFileMenu(false);
      }
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [showFileMenu]);

  // Handle file import
  const handleFileImport = async (event) => {
    const file = event.target.files[0];
    if (file) {
      try {
        await importWorkbook(file);
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
        {/* Import Button */}
        <div className="relative flex items-center">
          <button 
            className="flex items-center space-x-1 sm:space-x-2 text-sm border border-gray-400 dark:border-gray-700 bg-transparent hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-200 rounded-lg px-2 sm:px-4 py-2 font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-blue-400"
            onClick={() => setShowFileMenu(!showFileMenu)}
            disabled={isImporting}
          >
            <Upload size={16} className="sm:w-[18px] sm:h-[18px]" />
            <span className="hidden sm:inline">{isImporting ? 'Importing...' : 'Import'}</span>
          </button>
          {showFileMenu && (
            <div ref={fileMenuRef} className="absolute top-12 right-0 w-48 bg-white dark:bg-gray-900 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 py-1 z-50">
              <button 
                className="w-full px-4 py-2 text-left text-sm hover:bg-gray-100 dark:hover:bg-gray-800 flex items-center space-x-2"
                onClick={() => fileInputRef.current?.click()}
              >
                <FileSpreadsheet size={16} />
                <span>Import Excel</span>
              </button>
              <button 
                className="w-full px-4 py-2 text-left text-sm hover:bg-gray-100 dark:hover:bg-gray-800 flex items-center space-x-2"
                onClick={() => fileInputRef.current?.click()}
              >
                <FileCode size={16} />
                <span>Import CSV</span>
              </button>
              <div className="px-4 py-2 text-left text-sm text-gray-400 dark:text-gray-500 flex items-center space-x-2 opacity-50 cursor-not-allowed">
                <FileText size={16} />
                <div className="flex flex-col">
                  <span>Import Text</span>
                  <span className="text-xs text-gray-300 dark:text-gray-600">Coming soon</span>
                </div>
              </div>
            </div>
          )}
          {/* Hidden file input */}
          <input
            ref={fileInputRef}
            type="file"
            accept=".xlsx,.xls,.csv"
            onChange={handleFileImport}
            className="hidden"
          />
        </div>

        {/* Export Button */}
        <button 
          className="flex items-center space-x-1 sm:space-x-2 text-sm border border-gray-400 dark:border-gray-700 bg-transparent hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-200 rounded-lg px-2 sm:px-4 py-2 font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-blue-400"
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
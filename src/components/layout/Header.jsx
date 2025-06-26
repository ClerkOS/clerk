import React, { useState, useRef, useEffect } from 'react';
import { Moon, Sun, Settings, ChevronDown, User, Upload, FileText, FileSpreadsheet, FileCode } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import ThemeToggle from '../ui/ThemeToggle';
import SheetSwitcher from './SheetSwitcher';

const Header = () => {
  const { theme, toggleTheme } = useTheme();
  const [showFileMenu, setShowFileMenu] = useState(false);
  const fileMenuRef = useRef(null);
  
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

  return (
    <div className="flex items-center justify-between px-4 sm:px-6 py-3 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700" style={{ fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" }}>
      <div className="flex items-center space-x-2 sm:space-x-4">
        <span className="font-bold text-xl sm:text-2xl text-gray-900 dark:text-white">Clerk</span>
        <SheetSwitcher className="rounded-lg" />
      </div>
      <div className="flex items-center space-x-2 sm:space-x-3">
        <div className="relative flex items-center">
          <button 
            className="flex items-center space-x-1 sm:space-x-2 text-sm border border-gray-400 dark:border-gray-700 bg-transparent hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-200 rounded-lg px-2 sm:px-4 py-2 font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-blue-400"
            onClick={() => setShowFileMenu(!showFileMenu)}
          >
            <Upload size={16} className="sm:w-[18px] sm:h-[18px]" />
            <span className="hidden sm:inline">Import</span>
          </button>
          {showFileMenu && (
            <div ref={fileMenuRef} className="absolute top-12 right-0 w-48 bg-white dark:bg-gray-900 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 py-1 z-50">
              <button className="w-full px-4 py-2 text-left text-sm hover:bg-gray-100 dark:hover:bg-gray-800 flex items-center space-x-2">
                <FileSpreadsheet size={16} />
                <span>Import Excel</span>
              </button>
              <button className="w-full px-4 py-2 text-left text-sm hover:bg-gray-100 dark:hover:bg-gray-800 flex items-center space-x-2">
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
        </div>
        {/* Vertical divider after Import button */}
        <div className="hidden sm:block h-7 w-px bg-gray-300 dark:bg-gray-700 mx-3" />
        <ThemeToggle />
        <button className="p-2 rounded-full bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">
          <Settings size={16} className="sm:w-[18px] sm:h-[18px]" />
        </button>
        <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white">
          <User size={16} className="sm:w-[18px] sm:h-[18px]" />
        </div>
      </div>
    </div>
  );
};

export default Header;
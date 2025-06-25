import React, { useState } from 'react';
import { Moon, Sun, Settings, ChevronDown, User, Upload, FileText, FileSpreadsheet, FileCode } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import ThemeToggle from '../ui/ThemeToggle';

const Header = () => {
  const { theme, toggleTheme } = useTheme();
  const [showFileMenu, setShowFileMenu] = useState(false);
  
  return (
    <div className="flex items-center justify-between px-6 py-3 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700" style={{ fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" }}>
      <div className="flex items-center space-x-4">
        <span className="font-bold text-2xl text-gray-900 dark:text-white">Clerk</span>
        <div className="flex items-center space-x-1 text-sm bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded px-3 py-1 text-gray-700 dark:text-gray-200 cursor-pointer">
          <span>Sheet1</span>
        </div>
        <button 
          className="flex items-center space-x-2 text-sm bg-blue-500 hover:bg-blue-600 text-white rounded px-4 py-2 font-medium shadow-sm transition-colors"
          onClick={() => setShowFileMenu(!showFileMenu)}
        >
          <Upload size={16} />
          <span>Import</span>
        </button>
        {showFileMenu && (
          <div className="absolute top-14 left-36 w-48 bg-white dark:bg-gray-900 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 py-1 z-50">
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
      <div className="flex items-center space-x-3">
        <ThemeToggle />
        <button className="p-2 rounded-full bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700">
          <Settings size={18} />
        </button>
        <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white">
          <User size={18} />
        </div>
      </div>
    </div>
  );
};

export default Header;
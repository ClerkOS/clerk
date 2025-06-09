import React, { useState } from 'react';
import { Moon, Sun, Settings, ChevronDown, User, Upload, FileText, FileSpreadsheet, FileCode } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import ThemeToggle from '../ui/ThemeToggle';

const Header = () => {
  const { theme, toggleTheme } = useTheme();
  const [showFileMenu, setShowFileMenu] = useState(false);
  
  return (
    <div className={`flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700`}>
      <div className="flex items-center space-x-2">
        <span className="font-semibold text-xl">Clerk</span>
        <div className="hidden md:flex items-center space-x-1 text-sm bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded px-2 py-1">
          <span>Sheet1</span>
          <ChevronDown size={14} />
        </div>
        <button 
          className="hidden md:flex items-center space-x-1 text-sm bg-blue-500 hover:bg-blue-600 text-white rounded px-3 py-1"
          onClick={() => setShowFileMenu(!showFileMenu)}
        >
          <Upload size={14} />
          <span>Import</span>
        </button>
        
        {/* File Menu Dropdown */}
        {showFileMenu && (
          <div className="absolute top-12 left-32 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 py-1 z-50">
            <button className="w-full px-4 py-2 text-left text-sm hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center space-x-2">
              <FileSpreadsheet size={16} />
              <span>Import Excel</span>
            </button>
            <button className="w-full px-4 py-2 text-left text-sm hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center space-x-2">
              <FileCode size={16} />
              <span>Import CSV</span>
            </button>
            <div className="px-4 py-2 text-left text-sm text-gray-500 dark:text-gray-400 flex items-center space-x-2 opacity-50 cursor-not-allowed">
              <FileText size={16} />
              <div className="flex flex-col">
                <span>Import Text</span>
                <span className="text-xs text-gray-400 dark:text-gray-500">Coming soon</span>
              </div>
            </div>
          </div>
        )}
      </div>
      
      {/* Right Side Icons */}
      <div className="flex items-center space-x-3">
        <ThemeToggle />
        <button className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600">
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
import React from 'react';
import { Search, Moon, Sun, Settings, ChevronDown, User } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import ThemeToggle from '../ui/ThemeToggle';

const Header = ({ toggleCommandPalette }) => {
  const { theme, toggleTheme } = useTheme();
  
  return (
    <div className={`flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700`}>
      <div className="flex items-center space-x-2">
        <span className="font-semibold text-xl">Clerk</span>
        <div className="hidden md:flex items-center space-x-1 text-sm bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded px-2 py-1">
          <span>Sheet1</span>
          <ChevronDown size={14} />
        </div>
      </div>
      
      {/* Search/Command Bar */}
      <div 
        className="relative flex items-center mx-2 px-3 py-1 flex-grow max-w-lg rounded-lg border border-gray-200 dark:border-gray-700 cursor-text"
        onClick={toggleCommandPalette}
      >
        <Search size={16} className="mr-2 text-gray-500" />
        <span className="text-gray-500 text-sm">Search or type '/' for commands...</span>
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
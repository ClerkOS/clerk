import React, { useState, useRef, useEffect } from 'react';
import { Search, Database, Table, HelpCircle } from 'lucide-react';

const CommandPalette = ({ onClose }) => {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState([
    {
      id: 'pivot-create',
      label: 'Create pivot table from selected data',
      icon: <Database size={16} className="mr-2" />,
      selected: true
    },
    {
      id: 'pivot-insert',
      label: 'Insert pivot table',
      icon: <Table size={16} className="mr-2" />,
      selected: false
    },
    {
      id: 'pivot-tutorial',
      label: 'Pivot table tutorial',
      icon: <HelpCircle size={16} className="mr-2" />,
      selected: false
    }
  ]);
  
  const inputRef = useRef(null);
  
  // Handle click outside to close
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (inputRef.current && !inputRef.current.contains(event.target)) {
        onClose();
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [onClose]);
  
  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onClose();
      } else if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
        e.preventDefault();
        setSuggestions(prev => {
          const currentIndex = prev.findIndex(s => s.selected);
          const nextIndex = e.key === 'ArrowDown' 
            ? (currentIndex + 1) % prev.length 
            : (currentIndex - 1 + prev.length) % prev.length;
          
          return prev.map((s, i) => ({
            ...s,
            selected: i === nextIndex
          }));
        });
      }
    };
    
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [onClose]);

  const handleQueryChange = (e) => {
    setQuery(e.target.value);
  };

  return (
    <div 
      ref={inputRef}
      className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700"
    >
      <div className="p-2 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center px-2 py-1 bg-gray-50 dark:bg-gray-700 rounded">
          <Search size={16} className="text-gray-500 dark:text-gray-400 mr-2" />
          <input
            type="text"
            className="flex-1 bg-transparent outline-none text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400"
            placeholder="Type a command or search..."
            value={query}
            onChange={handleQueryChange}
            autoFocus
          />
        </div>
      </div>
      
      <div className="py-1">
        {suggestions.map((suggestion) => (
          <div
            key={suggestion.id}
            className={`flex items-center px-4 py-2 cursor-pointer ${
              suggestion.selected 
                ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400' 
                : 'hover:bg-gray-50 dark:hover:bg-gray-700'
            }`}
          >
            {suggestion.icon}
            <span className="text-gray-900 dark:text-gray-100">{suggestion.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CommandPalette;
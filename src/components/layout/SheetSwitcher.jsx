import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Plus, X, Loader2 } from 'lucide-react';
import { useSheets } from '../../context/SheetContext';

const SheetSwitcher = () => {
  const { sheets, currentSheetId, setCurrentSheet, addSheet, renameSheet, deleteSheet, isLoading, error } = useSheets();
  const currentSheet = sheets.find(s => s.id === currentSheetId);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [renaming, setRenaming] = useState(false);
  const [nameInput, setNameInput] = useState(currentSheet?.name || '');
  const [dropdownPosition, setDropdownPosition] = useState('bottom'); // 'top' or 'bottom'
  const inputRef = useRef(null);
  const dropdownRef = useRef(null);
  const buttonRef = useRef(null);

  useEffect(() => {
    setNameInput(currentSheet?.name || '');
  }, [currentSheetId, currentSheet?.name]);

  useEffect(() => {
    if (renaming && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [renaming]);

  // Calculate dropdown position when opening
  const calculateDropdownPosition = () => {
    if (!buttonRef.current) return 'bottom';
    
    const buttonRect = buttonRef.current.getBoundingClientRect();
    const viewportHeight = window.innerHeight;
    const dropdownHeight = Math.min(sheets.length * 40 + 60, 300); // Estimate dropdown height
    
    // Check if there's enough space below
    const spaceBelow = viewportHeight - buttonRect.bottom;
    const spaceAbove = buttonRect.top;
    
    // Prefer bottom, but use top if not enough space below
    return spaceBelow >= dropdownHeight || spaceBelow > spaceAbove ? 'bottom' : 'top';
  };

  // Close dropdown on outside click
  useEffect(() => {
    if (!dropdownOpen) return;
    function handleClick(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [dropdownOpen]);

  const handleDropdownToggle = () => {
    if (!dropdownOpen) {
      const position = calculateDropdownPosition();
      setDropdownPosition(position);
    }
    setDropdownOpen(!dropdownOpen);
  };

  const handleRename = () => {
    if (nameInput.trim() && nameInput !== currentSheet?.name) {
      renameSheet(currentSheetId, nameInput.trim());
    }
    setRenaming(false);
  };

  const handleDeleteSheet = (e, sheetId) => {
    e.stopPropagation();
    if (sheets.length > 1) {
      deleteSheet(sheetId);
    }
  };

  // Show loading state
  if (isLoading) {
    return (
      <div className="flex items-center space-x-2 px-3 py-1.5 text-sm font-medium rounded-md bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
        <Loader2 size={14} className="animate-spin text-gray-500 dark:text-gray-400" />
        <span className="text-gray-500 dark:text-gray-400">Loading sheets...</span>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="flex items-center space-x-2 px-3 py-1.5 text-sm font-medium rounded-md bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800">
        <span className="text-red-600 dark:text-red-400">Failed to load sheets</span>
      </div>
    );
  }

  return (
    <div className="flex items-center space-x-1">
      {/* Current Sheet Display */}
      <div className="relative">
        <button
          ref={buttonRef}
          className={`
            flex items-center space-x-2 px-3 py-1.5 text-sm font-medium rounded-md transition-all duration-200
            bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 
            hover:bg-gray-50 dark:hover:bg-gray-700 hover:border-gray-300 dark:hover:border-gray-600
            focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1 dark:focus:ring-offset-gray-900
            ${dropdownOpen ? 'ring-2 ring-blue-500 ring-offset-1 dark:ring-offset-gray-900' : ''}
          `}
          onClick={handleDropdownToggle}
          onDoubleClick={(e) => { e.stopPropagation(); setRenaming(true); }}
          disabled={sheets.length === 0}
        >
          {renaming ? (
            <input
              ref={inputRef}
              className="bg-transparent outline-none text-sm font-medium text-gray-900 dark:text-white min-w-[80px] max-w-[120px]"
              value={nameInput}
              onChange={(e) => setNameInput(e.target.value)}
              onBlur={handleRename}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleRename();
                if (e.key === 'Escape') { setRenaming(false); setNameInput(currentSheet?.name || ''); }
              }}
              maxLength={20}
            />
          ) : (
            <>
              <span className="text-gray-900 dark:text-white truncate max-w-[100px]" title={currentSheet?.name}>
                {currentSheet?.name || 'No sheets'}
              </span>
              {sheets.length > 0 && (
                <ChevronDown 
                  size={14} 
                  className={`text-gray-500 dark:text-gray-400 transition-transform duration-200 ${
                    dropdownOpen ? 'rotate-180' : ''
                  }`} 
                />
              )}
            </>
          )}
        </button>

        {/* Dropdown Menu */}
        {dropdownOpen && sheets.length > 0 && (
          <div 
            ref={dropdownRef} 
            className={`absolute z-50 w-56 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg py-1 ${
              dropdownPosition === 'top' 
                ? 'bottom-full mb-1' 
                : 'top-full mt-1'
            } left-0`}
          >
            {sheets.map(sheet => (
              <div
                key={sheet.id}
                className="group flex items-center justify-between px-3 py-2 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                <button
                  className={`flex-1 text-left text-sm transition-colors ${
                    sheet.id === currentSheetId 
                      ? 'text-blue-600 dark:text-blue-400 font-medium' 
                      : 'text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'
                  }`}
                  onClick={() => { setCurrentSheet(sheet.id); setDropdownOpen(false); }}
                >
                  {sheet.name}
                </button>
                {sheets.length > 1 && (
                  <button
                    className="opacity-0 group-hover:opacity-100 p-1 rounded hover:bg-red-100 dark:hover:bg-red-900/20 transition-all duration-200"
                    onClick={(e) => handleDeleteSheet(e, sheet.id)}
                    title="Delete sheet"
                  >
                    <X size={12} className="text-red-500 dark:text-red-400" />
                  </button>
                )}
              </div>
            ))}
            
            {/* Add Sheet Button */}
            <div className="border-t border-gray-200 dark:border-gray-700 mt-1 pt-1">
              <button
                className="w-full flex items-center space-x-2 px-3 py-2 text-sm text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white transition-colors"
                onClick={() => { addSheet(); setDropdownOpen(false); }}
              >
                <Plus size={14} />
                <span>Add sheet</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Quick Add Sheet Button */}
      <button
        className="p-1.5 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 transition-colors"
        onClick={addSheet}
        title="Add new sheet"
      >
        <Plus size={16} />
      </button>
    </div>
  );
};

export default SheetSwitcher; 
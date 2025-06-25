import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Plus } from 'lucide-react';
import { useSheets } from '../../context/SheetContext';

const SheetSwitcher = () => {
  const { sheets, currentSheetId, setCurrentSheet, addSheet, renameSheet } = useSheets();
  const currentSheet = sheets.find(s => s.id === currentSheetId);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [renaming, setRenaming] = useState(false);
  const [nameInput, setNameInput] = useState(currentSheet?.name || '');
  const inputRef = useRef(null);
  const dropdownRef = useRef(null);

  useEffect(() => {
    setNameInput(currentSheet?.name || '');
  }, [currentSheetId, currentSheet?.name]);

  useEffect(() => {
    if (renaming && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [renaming]);

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

  const handleRename = () => {
    if (nameInput.trim() && nameInput !== currentSheet.name) {
      renameSheet(currentSheetId, nameInput.trim());
    }
    setRenaming(false);
  };

  return (
    <div className="relative flex items-center space-x-2">
      <div
        className={
          `flex items-center rounded-lg px-4 py-1.5 text-base font-medium cursor-pointer select-none transition border ` +
          `bg-gray-100 dark:bg-gray-800 border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white focus-within:ring-2 focus-within:ring-blue-400`
        }
        style={{ minWidth: 120 }}
        onClick={() => setDropdownOpen(v => !v)}
        onDoubleClick={e => { e.stopPropagation(); setRenaming(true); }}
        tabIndex={0}
      >
        {renaming ? (
          <input
            ref={inputRef}
            className="bg-transparent outline-none w-28 text-base font-medium text-gray-900 dark:text-white"
            value={nameInput}
            onChange={e => setNameInput(e.target.value)}
            onBlur={handleRename}
            onKeyDown={e => {
              if (e.key === 'Enter') handleRename();
              if (e.key === 'Escape') { setRenaming(false); setNameInput(currentSheet.name); }
            }}
            maxLength={32}
          />
        ) : (
          <span className="pr-2 truncate" title={currentSheet?.name}>{currentSheet?.name}</span>
        )}
        <ChevronDown size={18} className="ml-1 opacity-70" />
      </div>
      {dropdownOpen && (
        <div ref={dropdownRef} className="absolute left-0 top-12 z-30 w-48 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg py-1">
          {sheets.map(sheet => (
            <button
              key={sheet.id}
              className={`w-full text-left px-4 py-2 text-base rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors ${sheet.id === currentSheetId ? 'font-bold text-blue-600 dark:text-blue-400 bg-gray-50 dark:bg-gray-800' : 'text-gray-900 dark:text-gray-200'}`}
              onClick={() => { setCurrentSheet(sheet.id); setDropdownOpen(false); }}
            >
              {sheet.name}
            </button>
          ))}
        </div>
      )}
      <button
        className="ml-1 flex items-center justify-center w-9 h-9 rounded-lg border border-gray-300 dark:border-gray-700 bg-transparent hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-200 transition"
        onClick={addSheet}
        title="Add sheet"
        tabIndex={0}
      >
        <Plus size={20} />
      </button>
    </div>
  );
};

export default SheetSwitcher; 
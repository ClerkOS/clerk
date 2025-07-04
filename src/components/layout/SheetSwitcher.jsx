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
  const [isAddingSheet, setIsAddingSheet] = useState(false);
  const [deleteConfirmation, setDeleteConfirmation] = useState(null); // { sheetId, sheetName }
  const inputRef = useRef(null);
  const dropdownRef = useRef(null);
  const buttonRef = useRef(null);
  const quickAddButtonRef = useRef(null);

  useEffect(() => {
    setNameInput(currentSheet?.name || '');
  }, [currentSheetId, currentSheet?.name]);

  useEffect(() => {
    if (renaming && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [renaming]);

  // Debug: Log when quick add button is rendered
  useEffect(() => {
    if (quickAddButtonRef.current) {
      console.log('Quick add button rendered:', quickAddButtonRef.current);
      console.log('isAddingSheet state:', isAddingSheet);
    }
  });

  // Debug: Log when isAddingSheet changes
  useEffect(() => {
    console.log('isAddingSheet changed to:', isAddingSheet);
  }, [isAddingSheet]);

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
      // Don't close dropdown if clicking on the plus button
      if (e.target.closest('[title="Add new sheet"]')) {
        return;
      }
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

  const handleRename = async () => {
    if (nameInput.trim() && nameInput !== currentSheet?.name) {
      try {
        await renameSheet(currentSheetId, nameInput.trim());
        console.log('Sheet renamed successfully');
      } catch (error) {
        console.error('Failed to rename sheet:', error);
        // Reset the input to the original name on error
        setNameInput(currentSheet?.name || '');
        // You could show a toast notification here
      }
    }
    setRenaming(false);
  };

  const handleDeleteSheet = async (e, sheetId) => {
    e.stopPropagation();
    console.log('handleDeleteSheet called with:', { sheetId, sheetsLength: sheets.length });
    if (sheets.length > 1) {
      const sheetToDelete = sheets.find(s => s.id === sheetId);
      console.log('Sheet to delete:', sheetToDelete);
      if (sheetToDelete) {
        setDeleteConfirmation({ sheetId, sheetName: sheetToDelete.name });
      }
    }
  };

  const confirmDelete = async () => {
    console.log('confirmDelete called with:', deleteConfirmation);
    if (!deleteConfirmation) return;
    
    try {
      console.log('Calling deleteSheet with:', deleteConfirmation.sheetId);
      await deleteSheet(deleteConfirmation.sheetId);
      console.log('deleteSheet completed successfully');
      setDropdownOpen(false);
    } catch (error) {
      console.error('Failed to delete sheet:', error);
      // You could show a toast notification here
    } finally {
      setDeleteConfirmation(null);
    }
  };

  const cancelDelete = () => {
    setDeleteConfirmation(null);
  };

  const handleAddSheet = async () => {
    console.log('handleAddSheet called');
    try {
      setIsAddingSheet(true);
      console.log('Calling addSheet function...');
      await addSheet();
      console.log('addSheet completed successfully');
      setDropdownOpen(false);
    } catch (error) {
      console.error('Failed to add sheet:', error);
      // You could show a toast notification here
    } finally {
      setIsAddingSheet(false);
    }
  };

  const handleAddSheetFromDropdown = async () => {
    try {
      setIsAddingSheet(true);
      await addSheet();
      setDropdownOpen(false);
    } catch (error) {
      console.error('Failed to add sheet:', error);
      // You could show a toast notification here
    } finally {
      setIsAddingSheet(false);
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
      {/* Delete Confirmation Dialog */}
      {deleteConfirmation && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-sm w-full mx-4">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
              Delete Sheet
            </h3>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              Are you sure you want to delete "{deleteConfirmation.sheetName}"? This action cannot be undone.
            </p>
            <div className="flex space-x-3">
              <button
                onClick={cancelDelete}
                className="flex-1 px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-md hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="flex-1 px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700 transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

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
              onKeyDown={async (e) => {
                if (e.key === 'Enter') await handleRename();
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
                    className="p-1 rounded hover:bg-red-100 dark:hover:bg-red-900/20 transition-all duration-200"
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
                className="w-full flex items-center space-x-2 px-3 py-2 text-sm text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white transition-colors disabled:opacity-50"
                onClick={handleAddSheetFromDropdown}
                disabled={isAddingSheet}
              >
                {isAddingSheet ? (
                  <Loader2 size={14} className="animate-spin" />
                ) : (
                  <Plus size={14} />
                )}
                <span>{isAddingSheet ? 'Adding...' : 'Add sheet'}</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Quick Add Sheet Button */}
      <button
        className="p-1.5 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 transition-colors disabled:opacity-50"
        onClick={() => {
          try {
            handleAddSheet();
          } catch (error) {
            console.error('Error in handleAddSheet:', error);
          }
        }}
        title="Add new sheet"
        disabled={isAddingSheet}
      >
        {isAddingSheet ? (
          <Loader2 size={16} className="animate-spin" />
        ) : (
          <Plus size={16} />
        )}
      </button>
    </div>
  );
};

export default SheetSwitcher; 
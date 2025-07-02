import React, { useState, useRef, useEffect } from 'react';
import { Copy, ClipboardPaste, Scissors, Trash2, Sparkles } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { useSpreadsheet } from '../../context/SpreadsheetContext';

const ContextMenu = ({ position, onClose, isCell = false, cellId = null, selectedCells = [], onOpenAIWithRange }) => {
  const { theme } = useTheme();
  const menuRef = useRef(null);
  const isDark = theme === 'dark';
  const { getCell } = useSpreadsheet();

  // Determine the content to use for AI requests
  const hasSelectedContent = isCell && (selectedCells.length > 0);
  let cellsContent = [];
  
  // Process selected cells to get their values
  if (hasSelectedContent) {
    // If multiple cells are selected, get all content
    if (selectedCells.length > 1) {
      cellsContent = selectedCells.map(cellId => {
        // Parse the cellId to get column and row
        const col = cellId.match(/[A-Z]+/)[0];
        const row = parseInt(cellId.match(/\d+/)[0]);
        const cellData = getCell(col, row);
        return {
          id: cellId,
          value: cellData.value || cellData.formatted || '',
        };
      });
    }
    // If only a single cell is selected/right-clicked
    else if (cellId) {
      // Parse the cellId to get column and row
      const col = cellId.match(/[A-Z]+/)[0];
      const row = parseInt(cellId.match(/\d+/)[0]);
      const cellData = getCell(col, row);
      cellsContent = [{
        id: cellId,
        value: cellData.value || cellData.formatted || '',
      }];
    }
  }

  const menuItems = [
    { icon: <Copy size={16} />, label: 'Copy', shortcut: '⌘C' },
    { icon: <ClipboardPaste size={16} />, label: 'Paste', shortcut: '⌘V' },
    { icon: <Scissors size={16} />, label: 'Cut', shortcut: '⌘X' },
    { icon: <Trash2 size={16} />, label: 'Delete', shortcut: '⌫' },
  ];

  useEffect(() => {
    // Add click event listener to handle outside clicks
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        onClose();
      }
    };

    // Add mousedown event listener
    document.addEventListener('mousedown', handleClickOutside);
    
    // Clean up the event listener on component unmount
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [onClose]);

  const handleAIClick = () => {
    // Create a range string from selected cells
    if (selectedCells.length > 0) {
      const range = selectedCells.length === 1 
        ? selectedCells[0] 
        : `${selectedCells[0]}:${selectedCells[selectedCells.length - 1]}`;
      
      onOpenAIWithRange({
        range: range,
        cells: selectedCells,
        content: cellsContent
      });
    }
  };

  // Format the selected cells for display in the AI menu
  const getSelectionDescription = () => {
    if (selectedCells.length === 1) {
      return `Cell ${selectedCells[0]}`;
    } else {
      return `${selectedCells.length} cells selected`;
    }
  };

  return (
    <>
      <div
        ref={menuRef}
        className={`fixed z-40 w-48 rounded-lg shadow-lg ${
          isDark ? 'bg-[#1a1f2c] border-[#303540]' : 'bg-white border-gray-200'
        } border`}
        style={{
          top: position.y,
          left: position.x,
        }}
      >
        {/* AI Option - show for any selection */}
        {hasSelectedContent && (
          <>
            <button
              onClick={handleAIClick}
              className={`w-full flex items-center justify-between px-4 py-2 text-left ${
                isDark ? 'hover:bg-[#4a6fd6]' : 'hover:bg-blue-50'
              }`}
            >
              <div className="flex items-center space-x-2">
                <Sparkles size={16} className="text-blue-500" />
                <span className={isDark ? 'text-white' : 'text-gray-900'}>
                  Ask AI about {getSelectionDescription()}
                </span>
              </div>
            </button>
            
            {/* Divider */}
            <div className={`h-px ${
              isDark ? 'bg-[#303540]' : 'bg-gray-200'
            }`} />
          </>
        )}

        {/* Standard Menu Items */}
        {menuItems.map((item, index) => (
          <button
            key={index}
            className={`w-full flex items-center justify-between px-4 py-2 text-left ${
              isDark ? 'text-white hover:bg-[#4a6fd6]' : 'text-gray-900 hover:bg-blue-50'
            }`}
          >
            <div className="flex items-center space-x-2">
              {item.icon}
              <span>{item.label}</span>
            </div>
            <span className={`text-sm ${
              isDark ? 'text-gray-400' : 'text-gray-500'
            }`}>{item.shortcut}</span>
          </button>
        ))}
      </div>
    </>
  );
};

export default ContextMenu;
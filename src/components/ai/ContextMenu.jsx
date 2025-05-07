import React, { useState } from 'react';
import { Copy, ClipboardPaste, Scissors, Trash2, Sparkles } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import AIContextMenu from './AIContextMenu';

const ContextMenu = ({ position, onClose }) => {
  const { theme } = useTheme();
  const [showAIDialog, setShowAIDialog] = useState(false);
  const isDark = theme === 'dark';

  const menuItems = [
    { icon: <Copy size={16} />, label: 'Copy', shortcut: '⌘C' },
    { icon: <ClipboardPaste size={16} />, label: 'Paste', shortcut: '⌘V' },
    { icon: <Scissors size={16} />, label: 'Cut', shortcut: '⌘X' },
    { icon: <Trash2 size={16} />, label: 'Delete', shortcut: '⌫' },
  ];

  const handleAIClick = () => {
    setShowAIDialog(true);
  };

  const handleAIClose = () => {
    setShowAIDialog(false);
    onClose();
  };

  const handleAIApply = () => {
    // Handle AI suggestion application
    handleAIClose();
  };

  const handleAIModify = () => {
    // Handle AI suggestion modification
    handleAIClose();
  };

  return (
    <>
      <div
        className={`fixed z-40 w-48 rounded-lg shadow-lg ${
          isDark ? 'bg-[#1a1f2c] border-[#303540]' : 'bg-white border-gray-200'
        } border`}
        style={{
          top: position.y,
          left: position.x,
        }}
      >
        {/* AI Option */}
        <button
          onClick={handleAIClick}
          className={`w-full flex items-center justify-between px-4 py-2 text-left ${
            isDark
              ? 'text-white hover:bg-[#4a6fd6]'
              : 'text-gray-900 hover:bg-blue-50'
          }`}
        >
          <div className="flex items-center space-x-2">
            <Sparkles size={16} className="text-blue-500" />
            <span>Ask AI</span>
          </div>
        </button>

        {/* Divider */}
        <div className={`h-px ${
          isDark ? 'bg-[#303540]' : 'bg-gray-200'
        }`} />

        {/* Standard Menu Items */}
        {menuItems.map((item, index) => (
          <button
            key={index}
            className={`w-full flex items-center justify-between px-4 py-2 text-left ${
              isDark
                ? 'text-white hover:bg-[#4a6fd6]'
                : 'text-gray-900 hover:bg-blue-50'
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

      {/* AI Dialog */}
      {showAIDialog && (
        <AIContextMenu
          position={{
            x: position.x + 200,
            y: position.y
          }}
          onClose={handleAIClose}
          onApply={handleAIApply}
          onModify={handleAIModify}
        />
      )}
    </>
  );
};

export default ContextMenu; 
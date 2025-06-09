// AIContextMenu.jsx
import React, { useState, useRef, useEffect } from 'react';
import { Sparkles, X } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

const AIContextMenu = ({ position, onClose, onApply, onModify, selectedData }) => {
  const { theme } = useTheme();
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [response, setResponse] = useState(null);
  const inputRef = useRef(null);
  const menuRef = useRef(null);
  const isDark = theme === 'dark';

  const { cells, content, selectionType } = selectedData || {};

  useEffect(() => {
    if (inputRef.current) inputRef.current.focus();

    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        onClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [onClose]);

  const handleSubmit = (e) => {
    e?.preventDefault();
    if (!inputValue.trim()) return;

    setIsLoading(true);
    setTimeout(() => {
      const firstCell = cells[0];
      const lastCell = cells[cells.length - 1];
      const range = selectionType === 'range' ? `${firstCell}:${lastCell}` : firstCell;

      setResponse({
        type: 'formula',
        content: `=SUM(${range})`,
        explanation: `Summing values from ${range}`,
        preview: '45',
      });
      setIsLoading(false);
    }, 1000);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Escape') onClose();
    if (e.key === 'Enter') handleSubmit();
  };

  const handleSuggestionClick = (suggestion) => {
    setInputValue(suggestion);
  };

  const handleApply = () => {
    onApply(response); // your `onApply` already knows selected cells
    onClose();
  };

  const handleModify = () => {
    onModify(response);
    onClose();
  };

  if (!selectedData || cells.length === 0) return null;

  return (
    <div
      ref={menuRef}
      className={`fixed z-50 w-80 rounded-lg shadow-lg ${
        isDark ? 'bg-[#1a1f2c] border-[#303540]' : 'bg-white border-gray-200'
      } border`}
      style={{ top: position.y, left: position.x }}
      onKeyDown={handleKeyDown}
    >
      {/* Header */}
      <div className={`flex items-center justify-between p-4 border-b ${isDark ? 'border-[#303540]' : 'border-gray-200'}`}>
        <div className="flex items-center space-x-2">
          <Sparkles size={16} className="text-blue-500" />
          <h3 className={`text-base font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>
            Ask AI about {selectionType === 'range' ? `${cells.length} cells` : cells[0]}
          </h3>
        </div>
        <button onClick={onClose} className="p-1 rounded-full hover:bg-opacity-10">
          <X size={16} className={isDark ? 'text-gray-400' : 'text-gray-500'} />
        </button>
      </div>

      {/* Body */}
      <div className="p-4">
        {/* Input */}
        <div className="relative">
          <input
            ref={inputRef}
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask a question or give an instruction..."
            className={`w-full h-9 px-3 rounded border ${
              isDark ? 'bg-[#232936] border-[#303540] text-white placeholder-[#8b97a8]' : 'bg-gray-50 border-gray-200 text-gray-900 placeholder-gray-500'
            } focus:outline-none focus:border-blue-500`}
          />
        </div>

        {/* Quick Suggestions */}
        <div className="mt-3 flex flex-wrap gap-2">
          {[
            "Sum all values",
            "Find the average",
            "Highlight max value",
            "Round all values"
          ].map((suggestion, index) => (
            <button
              key={index}
              onClick={() => handleSuggestionClick(suggestion)}
              className={`px-3 py-1 rounded-full text-sm ${
                isDark ? 'bg-[#384663] text-[#8b97a8] hover:bg-[#4a6fd6] hover:text-white' :
                         'bg-gray-100 text-gray-600 hover:bg-blue-100 hover:text-blue-600'
              }`}
            >
              {suggestion}
            </button>
          ))}
        </div>

        {/* Loading */}
        {isLoading && (
          <div className="mt-4 flex justify-center animate-pulse text-blue-500">
            <Sparkles size={24} />
          </div>
        )}

        {/* Response */}
        {response && !isLoading && (
          <div className={`mt-4 pt-4 border-t ${isDark ? 'border-[#303540]' : 'border-gray-200'}`}>
            <h4 className={`text-sm font-medium mb-2 ${isDark ? 'text-blue-500' : 'text-blue-600'}`}>
              AI Suggestion
            </h4>
            <div className={`p-3 rounded ${isDark ? 'bg-[#232936]' : 'bg-gray-50'}`}>
              <div className={`font-mono ${isDark ? 'text-white' : 'text-gray-900'}`}>{response.content}</div>
              <div className={`mt-2 text-sm ${isDark ? 'text-[#8b97a8]' : 'text-gray-600'}`}>{response.explanation}</div>
              <div className={`mt-1 text-sm ${isDark ? 'text-[#8b97a8]' : 'text-gray-600'}`}>
                Preview: {response.preview}
              </div>
            </div>

            {/* Actions */}
            <div className="mt-4 flex justify-end gap-2">
              <button onClick={onClose} className="px-4 py-2 rounded text-sm text-gray-600 hover:bg-gray-100 dark:text-[#8b97a8] dark:hover:bg-[#303540]">Cancel</button>
              <button onClick={handleModify} className="px-4 py-2 rounded text-sm border border-blue-500 text-blue-500 hover:bg-blue-50">Modify</button>
              <button onClick={handleApply} className="px-4 py-2 rounded text-sm bg-blue-500 text-white hover:bg-blue-600">Apply</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AIContextMenu;

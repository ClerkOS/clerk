import React, { useState, useRef, useEffect } from 'react';
import { Sparkles, X, Check, Edit2 } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

const AIContextMenu = ({ position, onClose, onApply, onModify }) => {
  const { theme } = useTheme();
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [response, setResponse] = useState(null);
  const inputRef = useRef(null);
  const menuRef = useRef(null);
  const isDark = theme === 'dark';

  // Example suggestions based on data type
  const suggestions = [
    "Calculate the sum of these values",
    "Create a chart showing trends",
    "Format these numbers as currency",
    "Find the average of these cells"
  ];

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }

    // Add click event listener to handle outside clicks
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        onClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    
    // Clean up the event listener on component unmount
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [onClose]);

  const handleSubmit = (e) => {
    if (e) e.preventDefault();
    if (!inputValue.trim()) return;

    setIsLoading(true);
    // Simulate AI processing
    setTimeout(() => {
      setResponse({
        type: 'formula',
        content: '=SUM(A1:A10)',
        explanation: 'This formula calculates the sum of all values in the selected range.',
        preview: '45'
      });
      setIsLoading(false);
    }, 1500);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Escape') {
      onClose();
    }
    if (e.key === 'Enter') {
      handleSubmit();
    }
  };

  const handleSuggestionClick = (suggestion) => {
    setInputValue(suggestion);
    // Optionally auto-submit when a suggestion is selected
    // handleSubmit();
  };

  const handleApply = () => {
    onApply(response);
    onClose();
  };

  const handleModify = () => {
    onModify(response);
    onClose();
  };

  return (
    <div
      ref={menuRef}
      className={`fixed z-50 w-80 rounded-lg shadow-lg ${
        isDark ? 'bg-[#1a1f2c] border-[#303540]' : 'bg-white border-gray-200'
      } border`}
      style={{
        top: position.y,
        left: position.x,
      }}
      onKeyDown={handleKeyDown}
    >
      {/* Header */}
      <div className={`flex items-center justify-between p-4 border-b ${
        isDark ? 'border-[#303540]' : 'border-gray-200'
      }`}>
        <div className="flex items-center space-x-2">
          <Sparkles size={16} className="text-blue-500" />
          <h3 className={`text-base font-medium ${
            isDark ? 'text-white' : 'text-gray-900'
          }`}>Ask AI about selected data</h3>
        </div>
        <button
          onClick={onClose}
          className={`p-1 rounded-full hover:bg-opacity-10 ${
            isDark ? 'hover:bg-white' : 'hover:bg-gray-200'
          }`}
        >
          <X size={16} className={isDark ? 'text-gray-400' : 'text-gray-500'} />
        </button>
      </div>

      {/* Content */}
      <div className="p-4">
        <div className="relative">
          <input
            ref={inputRef}
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="What would you like to do with this data?"
            className={`w-full h-9 px-3 rounded border ${
              isDark
                ? 'bg-[#232936] border-[#303540] text-white placeholder-[#8b97a8] focus:border-blue-500'
                : 'bg-gray-50 border-gray-200 text-gray-900 placeholder-gray-500 focus:border-blue-500'
            } focus:outline-none`}
          />
          <button 
            onClick={handleSubmit}
            className="absolute right-2 top-1.5 text-blue-500 hover:text-blue-600"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="m22 2-7 20-4-9-9-4Z"/>
              <path d="M22 2 11 13"/>
            </svg>
          </button>
        </div>

        {/* Suggestions */}
        <div className="mt-3 flex flex-wrap gap-2">
          {suggestions.map((suggestion, index) => (
            <button
              key={index}
              onClick={() => handleSuggestionClick(suggestion)}
              className={`px-3 py-1 rounded-full text-sm ${
                isDark
                  ? 'bg-[#384663] text-[#8b97a8] hover:bg-[#4a6fd6] hover:text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-blue-100 hover:text-blue-600'
              }`}
            >
              {suggestion}
            </button>
          ))}
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="mt-4 flex justify-center">
            <div className="animate-pulse text-blue-500">
              <Sparkles size={24} />
            </div>
          </div>
        )}

        {/* Response */}
        {response && !isLoading && (
          <div className={`mt-4 pt-4 border-t ${
            isDark ? 'border-[#303540]' : 'border-gray-200'
          }`}>
            <h4 className={`text-sm font-medium mb-2 ${
              isDark ? 'text-blue-500' : 'text-blue-600'
            }`}>AI Suggestion</h4>
            
            <div className={`p-3 rounded ${
              isDark ? 'bg-[#232936]' : 'bg-gray-50'
            }`}>
              <div className={`font-mono ${
                isDark ? 'text-white' : 'text-gray-900'
              }`}>{response.content}</div>
              <div className={`mt-2 text-sm ${
                isDark ? 'text-[#8b97a8]' : 'text-gray-600'
              }`}>{response.explanation}</div>
              {response.preview && (
                <div className={`mt-2 text-sm ${
                  isDark ? 'text-[#8b97a8]' : 'text-gray-600'
                }`}>
                  Preview: {response.preview}
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="mt-4 flex justify-end space-x-2">
              <button
                onClick={onClose}
                className={`px-4 py-2 rounded text-sm ${
                  isDark ? 'text-[#8b97a8] hover:bg-[#303540]' : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                Cancel
              </button>
              <button
                onClick={handleModify}
                className={`px-4 py-2 rounded text-sm border ${
                  isDark
                    ? 'border-blue-500 text-blue-500 hover:bg-[#384663]'
                    : 'border-blue-500 text-blue-500 hover:bg-blue-50'
                }`}
              >
                Modify
              </button>
              <button
                onClick={handleApply}
                className="px-4 py-2 rounded text-sm bg-blue-500 text-white hover:bg-blue-600"
              >
                Apply
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AIContextMenu;
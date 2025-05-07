import React, { useState, useRef, useEffect } from 'react';
import { Search, Calculator, DollarSign, CheckSquare, Type, Calendar, Search as SearchIcon, GripVertical } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

const formulaCategories = [
  { id: 'math', label: 'Math', icon: <Calculator size={16} /> },
  { id: 'financial', label: 'Financial', icon: <DollarSign size={16} /> },
  { id: 'logical', label: 'Logical', icon: <CheckSquare size={16} /> },
  { id: 'text', label: 'Text', icon: <Type size={16} /> },
  { id: 'date', label: 'Date', icon: <Calendar size={16} /> },
  { id: 'lookup', label: 'Lookup', icon: <SearchIcon size={16} /> },
];

const functionsByCategory = {
  math: [
    { name: 'SUM', description: 'Adds all numbers in a range of cells' },
    { name: 'AVERAGE', description: 'Calculates the average of numbers' },
    { name: 'COUNT', description: 'Counts the number of cells that contain numbers' },
  ],
  financial: [
    { name: 'PMT', description: 'Calculates the payment for a loan' },
    { name: 'FV', description: 'Calculates the future value of an investment' },
    { name: 'NPV', description: 'Calculates the net present value of an investment' },
  ],
  logical: [
    { name: 'IF', description: 'Returns one value if a condition is true, another if false' },
    { name: 'AND', description: 'Returns TRUE if all arguments are TRUE' },
    { name: 'OR', description: 'Returns TRUE if any argument is TRUE' },
  ],
  text: [
    { name: 'CONCATENATE', description: 'Joins several text strings into one' },
    { name: 'LEFT', description: 'Returns the leftmost characters from a text string' },
    { name: 'RIGHT', description: 'Returns the rightmost characters from a text string' },
  ],
  date: [
    { name: 'TODAY', description: 'Returns the current date' },
    { name: 'DATE', description: 'Returns the serial number of a particular date' },
    { name: 'DATEDIF', description: 'Calculates the difference between two dates' },
  ],
  lookup: [
    { name: 'VLOOKUP', description: 'Looks up a value in the first column of a table' },
    { name: 'HLOOKUP', description: 'Looks up a value in the first row of a table' },
    { name: 'INDEX', description: 'Returns a value from a table based on row and column numbers' },
  ],
};

const FormulaBuilder = () => {
  const { theme } = useTheme();
  const [activeCategory, setActiveCategory] = useState('math');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFunction, setSelectedFunction] = useState(null);
  const [width, setWidth] = useState(320); // Default width in pixels
  const isResizing = useRef(false);
  const startX = useRef(0);
  const startWidth = useRef(0);

  const handleFunctionSelect = (func) => {
    setSelectedFunction(func);
  };

  const handleMouseDown = (e) => {
    isResizing.current = true;
    startX.current = e.clientX;
    startWidth.current = width;
    document.body.style.cursor = 'ew-resize';
    document.body.style.userSelect = 'none';
  };

  const handleMouseMove = (e) => {
    if (!isResizing.current) return;
    
    const delta = startX.current - e.clientX;
    const newWidth = Math.min(Math.max(startWidth.current + delta, 280), 600); // Min: 280px, Max: 600px
    setWidth(newWidth);
  };

  const handleMouseUp = () => {
    isResizing.current = false;
    document.body.style.cursor = '';
    document.body.style.userSelect = '';
  };

  useEffect(() => {
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, []);

  const isDark = theme === 'dark';

  return (
    <div 
      className={`relative border-l p-4 ${
        isDark 
          ? 'bg-gray-800 border-gray-700' 
          : 'bg-white border-gray-200'
      }`}
      style={{ width: `${width}px` }}
    >
      {/* Resize Handle */}
      <div
        className="absolute left-0 top-0 bottom-0 w-1 cursor-ew-resize hover:bg-blue-500/50"
        onMouseDown={handleMouseDown}
      >
        <GripVertical 
          size={16} 
          className={`absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 ${
            isDark ? 'text-gray-400' : 'text-gray-500'
          }`}
        />
      </div>

      <h3 className={`font-medium mb-4 ${
        isDark ? 'text-white' : 'text-gray-900'
      }`}>Formula Builder</h3>
      
      {/* Search Bar */}
      <div className="relative mb-4">
        <Search size={16} className={`absolute left-2 top-1/2 transform -translate-y-1/2 ${
          isDark ? 'text-gray-400' : 'text-gray-500'
        }`} />
        <input
          type="text"
          placeholder="Search functions..."
          className={`w-full pl-8 pr-4 py-2 rounded border ${
            isDark 
              ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-blue-500' 
              : 'bg-gray-50 border-gray-200 text-gray-900 placeholder-gray-500 focus:border-blue-500'
          } focus:outline-none`}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {/* Categories */}
      <div className="flex space-x-2 mb-4 overflow-x-auto pb-2">
        {formulaCategories.map((category) => (
          <button
            key={category.id}
            onClick={() => setActiveCategory(category.id)}
            className={`flex items-center space-x-1 px-3 py-1 rounded ${
              activeCategory === category.id
                ? 'bg-blue-500 text-white'
                : isDark
                  ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {category.icon}
            <span className="text-sm">{category.label}</span>
          </button>
        ))}
      </div>

      {/* Functions List */}
      <div className="space-y-2">
        {functionsByCategory[activeCategory].map((func) => (
          <div
            key={func.name}
            onClick={() => handleFunctionSelect(func)}
            className={`p-3 rounded border cursor-pointer transition-colors ${
              isDark
                ? 'border-gray-700 hover:bg-gray-700'
                : 'border-gray-200 hover:bg-gray-50'
            }`}
          >
            <div className={`font-medium ${
              isDark ? 'text-white' : 'text-gray-900'
            }`}>{func.name}</div>
            <div className={`text-sm ${
              isDark ? 'text-gray-400' : 'text-gray-500'
            }`}>{func.description}</div>
          </div>
        ))}
      </div>

      {/* Formula Construction Area */}
      {selectedFunction && (
        <div className={`mt-4 p-4 rounded ${
          isDark ? 'bg-gray-700' : 'bg-gray-50'
        }`}>
          <div className={`font-mono mb-4 ${
            isDark ? 'text-white' : 'text-gray-900'
          }`}>
            {selectedFunction.name}(<span className="text-blue-500">parameters</span>)
          </div>
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <input
                type="text"
                placeholder="Enter parameter"
                className={`flex-1 px-2 py-1 rounded border ${
                  isDark
                    ? 'bg-gray-800 border-gray-600 text-white'
                    : 'bg-white border-gray-200 text-gray-900'
                }`}
              />
              <button className="px-2 py-1 bg-blue-500 text-white rounded hover:bg-blue-600">
                Select Cell
              </button>
            </div>
          </div>
          <div className={`mt-4 pt-4 border-t ${
            isDark ? 'border-gray-600' : 'border-gray-200'
          }`}>
            <div className={`text-sm ${
              isDark ? 'text-gray-400' : 'text-gray-500'
            }`}>Preview:</div>
            <div className={`font-mono mt-1 ${
              isDark ? 'text-white' : 'text-gray-900'
            }`}>= {selectedFunction.name}(A1:B10)</div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FormulaBuilder; 
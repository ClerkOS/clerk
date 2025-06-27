import React, { useState, useRef } from 'react';
import { useTheme } from '../../context/ThemeContext';
import { GripVertical, Table2, Filter, Settings, Save, Eye, Plus } from 'lucide-react';

const TablesPanel = ({ onWidthChange }) => {
  const { theme } = useTheme();
  const [width, setWidth] = useState(320);
  const [dataRange, setDataRange] = useState('');
  const [tableName, setTableName] = useState('New Table');
  const [showHeaders, setShowHeaders] = useState(true);
  const [showFilters, setShowFilters] = useState(true);
  const [tableStyle, setTableStyle] = useState('default');
  const [selectedColumns, setSelectedColumns] = useState([]);
  
  const isResizing = useRef(false);
  const startX = useRef(0);
  const startWidth = useRef(0);

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
    const newWidth = Math.min(Math.max(startWidth.current + delta, 280), 500);
    setWidth(newWidth);
    onWidthChange(newWidth);
  };

  const handleMouseUp = () => {
    isResizing.current = false;
    document.body.style.cursor = '';
    document.body.style.userSelect = '';
  };

  React.useEffect(() => {
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, []);

  const isDark = theme === 'dark';

  const handleCreateTable = () => {
    // TODO: Implement table creation logic
    console.log('Creating table:', {
      name: tableName,
      dataRange,
      showHeaders,
      showFilters,
      style: tableStyle,
      columns: selectedColumns
    });
  };

  const handlePreviewTable = () => {
    // TODO: Implement table preview logic
    console.log('Previewing table...');
  };

  const handleSaveTemplate = () => {
    // TODO: Implement template saving logic
    console.log('Saving table template...');
  };

  return (
    <div 
      className={`relative border-l flex flex-col h-full ${
        isDark 
          ? 'bg-gray-800 border-gray-700 text-white' 
          : 'bg-white border-gray-200 text-gray-900'
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

      {/* Header */}
      <div className={`p-4 border-b ${
        isDark ? 'border-gray-700 bg-gray-900' : 'border-gray-200 bg-gray-50'
      }`}>
        <h3 className="font-medium text-lg">Table Builder</h3>
        <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
          Create and manage data tables
        </p>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4">
        {/* Data Source Selector */}
        <div className={`mb-6 p-4 rounded-lg ${
          isDark ? 'bg-gray-700' : 'bg-gray-50'
        }`}>
          <div className="flex items-center gap-2 mb-3">
            <Table2 size={20} />
            <span className="font-medium">Select Data Range</span>
          </div>
          <div className="flex flex-col gap-2 mb-3">
            <input
              type="text"
              value={dataRange}
              onChange={(e) => setDataRange(e.target.value)}
              className={`px-3 py-2 rounded-md border font-mono text-sm ${
                isDark 
                  ? 'bg-gray-800 border-gray-600 text-white' 
                  : 'bg-white border-gray-200 text-gray-900'
              }`}
              placeholder="e.g., A1:C10"
            />
            <input
              type="text"
              value={tableName}
              onChange={(e) => setTableName(e.target.value)}
              className={`px-3 py-2 rounded-md border font-mono text-sm ${
                isDark 
                  ? 'bg-gray-800 border-gray-600 text-white' 
                  : 'bg-white border-gray-200 text-gray-900'
              }`}
              placeholder="Table Name"
            />
          </div>
        </div>

        {/* Table Options */}
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-3">
            <Settings size={20} />
            <span className="font-medium">Table Options</span>
          </div>
          <div className="space-y-3">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={showHeaders}
                onChange={(e) => setShowHeaders(e.target.checked)}
                className="rounded border-gray-300"
              />
              <span>Show Headers</span>
            </label>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={showFilters}
                onChange={(e) => setShowFilters(e.target.checked)}
                className="rounded border-gray-300"
              />
              <span>Enable Filters</span>
            </label>
          </div>
        </div>

        {/* Table Style */}
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-3">
            <span>🎨</span>
            <span className="font-medium">Table Style</span>
          </div>
          <div className="grid grid-cols-3 gap-2">
            {['default', 'minimal', 'bordered', 'striped', 'compact', 'modern'].map((style) => (
              <button
                key={style}
                onClick={() => setTableStyle(style)}
                className={`p-2 rounded-lg border-2 text-center transition-all ${
                  tableStyle === style
                    ? isDark
                      ? 'bg-purple-900 border-purple-500'
                      : 'bg-purple-100 border-purple-500'
                    : isDark
                      ? 'bg-gray-700 border-gray-600 hover:border-purple-500'
                      : 'bg-gray-50 border-gray-200 hover:border-purple-500'
                }`}
              >
                <div className="font-medium text-sm capitalize">{style}</div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className={`p-4 border-t ${
        isDark ? 'border-gray-700 bg-gray-900' : 'border-gray-200 bg-gray-50'
      }`}>
        <div className="flex gap-2">
          <button
            onClick={handleCreateTable}
            className="flex-1 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            Create Table
          </button>
          <button
            onClick={handlePreviewTable}
            className="px-4 py-2 bg-gray-200 dark:bg-gray-700 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
          >
            <Eye size={18} />
          </button>
          <button
            onClick={handleSaveTemplate}
            className="px-4 py-2 bg-gray-200 dark:bg-gray-700 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
          >
            <Save size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default TablesPanel; 
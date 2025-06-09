import React, { useState } from 'react';
import { useSpreadsheet } from '../../context/SpreadsheetContext';
import { ZoomIn, ZoomOut, Maximize2 } from 'lucide-react';

const StatusBar = () => {
  const [zoom, setZoom] = useState(100);

  const handleZoomIn = () => {
    setZoom(prev => Math.min(prev + 10, 200));
  };

  const handleZoomOut = () => {
    setZoom(prev => Math.max(prev - 10, 50));
  };

  const handleResetZoom = () => {
    setZoom(100);
  };
  
  return (
    <div 
      className="flex items-center justify-end px-4 py-1 text-xs bg-gray-50 dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700"
      style={{ fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" }}
    >
      <div className="flex items-center space-x-2">
        <button 
          onClick={handleZoomOut}
          className="p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded"
          title="Zoom Out"
        >
          <ZoomOut size={14} />
        </button>
        <button 
          onClick={handleResetZoom}
          className="px-2 py-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded"
        >
          {zoom}%
        </button>
        <button 
          onClick={handleZoomIn}
          className="p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded"
          title="Zoom In"
        >
          <ZoomIn size={14} />
        </button>
        <button 
          onClick={handleResetZoom}
          className="p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded"
          title="Reset Zoom"
        >
          <Maximize2 size={14} />
        </button>
      </div>
    </div>
  );
};

export default StatusBar;
import React from 'react';
// import { useSpreadsheet } from '../../context/SpreadsheetContext.jsx';
import { ZoomIn, ZoomOut, Maximize2 } from 'lucide-react';
// import SheetSwitcher from './SheetSwitcher.jsx';

const StatusBar = () => {
  // const { zoom, setZoom } = useSpreadsheet();

  // const handleZoomIn = () => {
  //   setZoom(prev => Math.min(prev + 10, 200));
  // };
  //
  // const handleZoomOut = () => {
  //   setZoom(prev => Math.max(prev - 10, 50));
  // };
  //
  // const handleResetZoom = () => {
  //   setZoom(100);
  // };

  return (
    <div
      className="flex items-center justify-between px-4 sm:px-6 py-0.5 text-xs bg-gray-50 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700 text-gray-800 dark:text-gray-200"
      style={{ fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" }}
    >
      {/* Left side - Sheet Switcher */}
      <div className="flex items-center space-x-4">
        {/*<SheetSwitcher />*/}
      </div>

      {/* Right side - zoom controls */}
      <div className="flex items-center space-x-1 sm:space-x-2">
        <button
          // onClick={handleZoomOut}
          className="p-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded transition-colors touch-target"
          title="Zoom Out"
        >
          <ZoomOut size={14} className="m-auto"/>
        </button>
        <button
          // onClick={handleResetZoom}
          className="px-2 py-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded transition-colors min-w-[3rem] text-center touch-target"
        >
          {20}%
          {/*{zoom}%*/}
        </button>
        <button
          // onClick={handleZoomIn}
          className="p-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded transition-colors touch-target"
          title="Zoom In"
        >
          <ZoomIn size={14} className="m-auto"/>
        </button>
        <button
          // onClick={handleResetZoom}
          className="p-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded transition-colors touch-target"
          title="Reset Zoom"
        >
          <Maximize2 size={14} className="m-auto"/>
        </button>
      </div>
    </div>
  );
};

export default StatusBar;
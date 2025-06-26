import React, { useRef, useCallback } from 'react';

const ColumnHeader = ({ label, isHighlighted, onResize, width }) => {
  const resizeRef = useRef(null);
  const isResizing = useRef(false);
  const startX = useRef(0);
  const startWidth = useRef(0);

  const handleMouseDown = useCallback((e) => {
    // Only handle resize if clicking on the resize handle
    if (!e.target.closest('.resize-handle')) {
      return;
    }
    
    e.preventDefault();
    e.stopPropagation();
    
    isResizing.current = true;
    startX.current = e.clientX;
    startWidth.current = width;
    
    document.body.style.cursor = 'col-resize';
    document.body.style.userSelect = 'none';
    document.body.classList.add('select-none');
  }, [width]);

  const handleMouseMove = useCallback((e) => {
    if (!isResizing.current) return;
    
    const delta = e.clientX - startX.current;
    const newWidth = Math.max(50, Math.min(500, startWidth.current + delta));
    onResize(label, newWidth);
  }, [onResize, label]);

  const handleMouseUp = useCallback(() => {
    if (isResizing.current) {
      isResizing.current = false;
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
      document.body.classList.remove('select-none');
    }
  }, []);

  // Add global mouse event listeners
  React.useEffect(() => {
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
    
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [handleMouseMove, handleMouseUp]);

  const classes = `
    relative
    bg-gray-50 dark:bg-gray-900
    border border-gray-200 dark:border-gray-700
    text-center px-1 py-2
    font-semibold
    text-gray-700 dark:text-gray-200
    ${isHighlighted ? 'bg-blue-50 dark:bg-blue-900/20' : ''}
  `;

  return (
    <th 
      className={classes}
      style={{ 
        fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
        width: `${width}px`,
        minWidth: `${width}px`
      }}
    >
      {label}
      
      {/* Resize handle */}
      <div
        ref={resizeRef}
        className="absolute right-0 top-0 bottom-0 w-1 cursor-col-resize hover:bg-blue-500/50 group resize-handle"
        onMouseDown={handleMouseDown}
      >
        <div className="absolute right-0 top-1/2 transform -translate-y-1/2 w-1 h-4 bg-gray-300 dark:bg-gray-600 group-hover:bg-blue-500 rounded-full" />
      </div>
    </th>
  );
};

export default ColumnHeader;
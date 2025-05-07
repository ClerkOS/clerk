import React from 'react';

const Cell = ({ value, type, isSelected, isHighlighted, onClick }) => {
  // Determine cell styling based on selected/highlighted state and type
  const getCellClasses = () => {
    let classes = 'bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 px-2 ';
    
    // Selection and highlight styles
    if (isSelected) {
      classes += 'bg-blue-100/40 dark:bg-blue-900/40 ';
    } else if (isHighlighted) {
      classes += 'bg-blue-500/5 ';
    }
    
    // Type-specific styles
    if (type === 'currency' || value?.toString().startsWith('$')) {
      classes += 'text-right ';
    } else if (type === 'header' || type === 'text' && value?.toString().match(/^[QW][1-4]$/)) {
      classes += 'font-medium ';
    }
    
    return classes;
  };

  return (
    <td 
      className={getCellClasses()}
      onClick={onClick}
    >
      {value}
    </td>
  );
};

export default Cell;
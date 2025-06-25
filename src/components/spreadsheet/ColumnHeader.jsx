import React from 'react';

const ColumnHeader = ({ label, isHighlighted }) => {
  const classes = `
    w-28
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
      style={{ fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" }}
    >
      {label}
    </th>
  );
};

export default ColumnHeader;
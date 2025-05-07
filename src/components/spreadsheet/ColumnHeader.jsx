import React from 'react';

const ColumnHeader = ({ label, isHighlighted }) => {
  const classes = `
    w-32 
    bg-white dark:bg-gray-800 
    border border-gray-300 dark:border-gray-700 
    text-center px-2
    ${isHighlighted ? 'bg-blue-500/5' : ''}
  `;

  return (
    <th className={classes}>
      {label}
    </th>
  );
};

export default ColumnHeader;
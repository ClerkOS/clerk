import React from 'react';
import { useSpreadsheet } from '../../context/SpreadsheetContext';

const StatusBar = () => {
  const { selectedCell, getActiveSheet } = useSpreadsheet();
  
  // Calculate stats for the current column
  const calculateStats = () => {
    const sheet = getActiveSheet();
    const col = selectedCell.col;
    
    let sum = 0;
    let count = 0;
    
    // Sum up numeric values in the column
    Object.entries(sheet.cells).forEach(([cellId, cell]) => {
      if (cellId.startsWith(col) && typeof cell.value === 'number') {
        sum += cell.value;
        count++;
      }
    });
    
    const average = count > 0 ? sum / count : 0;
    
    return {
      sum: new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(sum),
      average: new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(average),
      count
    };
  };
  
  const stats = calculateStats();
  
  return (
    <div className="flex items-center justify-between px-4 py-1 text-xs bg-gray-50 dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
      <div className="flex items-center space-x-2">
        <span>Sum: {stats.sum}</span>
        <span>Average: {stats.average}</span>
        <span>Count: {stats.count}</span>
      </div>
      <div className="flex items-center space-x-4">
        <span>100%</span>
        <span>3 collaborators</span>
      </div>
    </div>
  );
};

export default StatusBar;
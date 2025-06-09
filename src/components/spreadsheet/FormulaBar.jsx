import React from 'react';
import { useSpreadsheet } from '../../context/SpreadsheetContext';

const FormulaBar = () => {
  const { selectedCell, activeFormula, setActiveFormula } = useSpreadsheet();
  
  const cellRef = `${selectedCell.col}${selectedCell.row}`;

  return (
    <div 
      className="flex items-center px-2 py-1 bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700"
      style={{ fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" }}
    >
      <span className="font-mono bg-blue-500/10 px-2 py-1 rounded text-blue-500 mr-2">
        {cellRef}
      </span>
      <input
        type="text"
        className="flex-1 px-2 py-1 rounded border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900"
        value={activeFormula}
        onChange={(e) => setActiveFormula(e.target.value)}
        style={{ fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" }}
      />
    </div>
  );
};

export default FormulaBar;
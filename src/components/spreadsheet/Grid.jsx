import React from 'react';
import Cell from './Cell';
import ColumnHeader from './ColumnHeader';
import { useSpreadsheet } from '../../context/SpreadsheetContext';

const Grid = () => {
  const { 
    selectedCell, 
    setSelectedCell, 
    getActiveSheet,
    getCell
  } = useSpreadsheet();
  
  const activeSheet = getActiveSheet();
  const { columns } = activeSheet;
  
  // Number of rows to display (we'll show 20 for now)
  const rows = Array.from({ length: 20 }, (_, i) => i + 1);
  
  const isSelected = (col, row) => {
    return selectedCell.col === col && selectedCell.row === row;
  };
  
  const isHighlighted = (col) => {
    return selectedCell.col === col;
  };

  return (
    <div className="flex-1 overflow-auto p-1">
      <table className="border-collapse">
        <thead>
          <tr>
            {/* Empty corner cell */}
            <th className="w-10 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700"></th>
            
            {/* Column headers */}
            {columns.map((col) => (
              <ColumnHeader 
                key={col} 
                label={col} 
                isHighlighted={isHighlighted(col)}
              />
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row}>
              {/* Row header */}
              <td className="bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 text-center">
                {row}
              </td>
              
              {/* Data cells */}
              {columns.map((col) => {
                const cell = getCell(col, row);
                
                return (
                  <Cell
                    key={`${col}${row}`}
                    value={cell.formatted || cell.value}
                    type={cell.type}
                    isSelected={isSelected(col, row)}
                    isHighlighted={isHighlighted(col)}
                    onClick={() => setSelectedCell({ col, row })}
                  />
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Grid;
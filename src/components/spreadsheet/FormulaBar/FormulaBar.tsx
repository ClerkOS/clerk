import React, { useState, useEffect } from 'react';
import { useActiveCell } from '../../providers/ActiveCellProvider';
import { useCellMap } from '../../providers/CellMapProvider';
import { useWorkbookId } from '../../providers/WorkbookProvider';
import { useActiveSheet } from '../../providers/SheetProvider';
import { columnIndexToLetter } from '../../../utils/utils';
import { setCell } from '../../../lib/api/apiClient';

const FormulaBar = () => {
  const { activeCellId, setActiveCellId } = useActiveCell();
  const { cellDataBySheet, setCellDataBySheet } = useCellMap();
  const { workbookId } = useWorkbookId();
  const { activeSheet } = useActiveSheet();
  
  const [formulaValue, setFormulaValue] = useState('');
  const [isEditing, setIsEditing] = useState(false);

  const sheetName = activeSheet ?? "Sheet1";
  const cellMap = cellDataBySheet[sheetName];

  // Update formula bar when selected cell changes
  useEffect(() => {
    if (activeCellId && cellMap) {
      const cellData = cellMap.get(activeCellId);
      const displayValue = cellData?.formula ? `=${cellData.formula}` : (cellData?.value ?? '');
      setFormulaValue(displayValue);
      setIsEditing(false);
    } else {
      setFormulaValue('');
      setIsEditing(false);
    }
  }, [activeCellId, cellMap]);

  const handleFormulaChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormulaValue(e.target.value);
    setIsEditing(true);
  };

  const handleFormulaCommit = async () => {
    if (!activeCellId || !workbookId) return;

    const cellData = cellMap?.get(activeCellId);
    const currentValue = cellData?.formula ? `=${cellData.formula}` : (cellData?.value ?? '');
    
    // Skip if value didn't change
    if (formulaValue === currentValue) {
      setIsEditing(false);
      return;
    }

    // Determine if it's a formula or plain value
    const isFormula = formulaValue.startsWith('=');
    const value = isFormula ? formulaValue.substring(1) : formulaValue;
    const displayValue = isFormula ? value : formulaValue;

    // Update local state
    if (cellMap) {
      const newCellMap = new Map(cellMap);
      newCellMap.set(activeCellId, {
        value: displayValue,
        formula: isFormula ? value : '',
        style: cellData?.style ?? {},
      });
      
      setCellDataBySheet(prev => ({
        ...prev,
        [sheetName]: new Map(newCellMap),
      }));
    }

    // Push change to backend
    await setCell(workbookId, {
      sheet: sheetName,
      address: activeCellId,
      value: displayValue,
      formula: isFormula ? value : undefined
    });

    setIsEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleFormulaCommit();
    } else if (e.key === 'Escape') {
      // Reset to original value
      const cellData = cellMap?.get(activeCellId);
      const displayValue = cellData?.formula ? `=${cellData.formula}` : (cellData?.value ?? '');
      setFormulaValue(displayValue);
      setIsEditing(false);
    }
  };

  const handleBlur = () => {
    handleFormulaCommit();
  };

  return (
    <div
      className="flex items-center w-full px-2 py-1 bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700"
      style={{ fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" }}
    >
      <span className="cell-ref bg-gray-100 border border-gray-200 rounded px-3 sm:px-6 py-1 sm:py-2 text-blue-600 font-mono mr-2 sm:mr-4 text-xs sm:text-base">
        {activeCellId || ''}
      </span>
      <input
        type="text"
        className="flex-1 px-2 py-1 rounded border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 text-xs sm:text-sm"
        value={formulaValue}
        onChange={handleFormulaChange}
        onKeyDown={handleKeyDown}
        onBlur={handleBlur}
        placeholder="Enter a value or formula"
        style={{ fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" }}
      />
    </div>
  );
};

export default FormulaBar;
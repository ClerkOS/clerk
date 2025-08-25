import React, { useState, useEffect } from 'react';
import { useActiveCell } from '../../providers/ActiveCellProvider';
import { useCellMap } from '../../providers/CellMapProvider';
import { useWorkbookId } from '../../providers/WorkbookProvider';
import { useActiveSheet } from '../../providers/SheetProvider';
import { columnIndexToLetter } from '../../../utils/utils';
import { setCell, getSheet } from '../../../lib/api/apiClient';
import { defaultStyle } from "../Grid/gridTypes";

const FormulaBar = () => {
  const { activeCellId, setActiveCellId } = useActiveCell();
  const { cellDataBySheet, setCellDataBySheet } = useCellMap();
  const { workbookId } = useWorkbookId();
  const { activeSheet } = useActiveSheet();
  
  const [formulaBarValue, setFormulaBarValue] = useState('');
  const [isEditing, setIsEditing] = useState(false);

  const sheetName = activeSheet ?? "Sheet1";
  const cellMap = cellDataBySheet[sheetName];

  // Update formula bar when selected cell changes
  useEffect(() => {
    if (activeCellId && cellMap) {
      const cellData = cellMap.get(activeCellId);
      const displayValue = cellData?.formula ? `=${cellData.formula}` : (cellData?.value ?? '');
      setFormulaBarValue(displayValue);
      setIsEditing(false);
    } else {
      setFormulaBarValue('');
      setIsEditing(false);
    }
  }, [activeCellId, cellMap]);

  const handleFormulaChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormulaBarValue(e.target.value);
    setIsEditing(true);
  };

  const handleFormulaCommit = async () => {
    if (!activeCellId || !workbookId) return;

    const cellData = cellMap?.get(activeCellId);
    const currentValue = cellData?.formula ? `=${cellData.formula}` : (cellData?.value ?? '');
    
    // Skip if value didn't change
    if (formulaBarValue === currentValue) {
      setIsEditing(false);
      return;
    }

    // Determine if it's a formula or plain value
    const isFormula = formulaBarValue.startsWith('=');
    const formula = isFormula ? formulaBarValue.substring(1) : '';
    const value = isFormula ? '' : formulaBarValue;

    // Update local state
    if (cellMap) {
      const newCellMap = new Map(cellMap);
      newCellMap.set(activeCellId, {
        value,
        formula,
        style: cellData?.style ?? defaultStyle,
      });
      
      setCellDataBySheet(prev => ({
        ...prev,
        [sheetName]: new Map(newCellMap),
      }));
    }

    // Push change to backend
    await setCell(workbookId, {
      sheet: sheetName,
      address: activeCellId as string,
      value,
      ...(isFormula && { formula })
    });

    // Refresh the sheet data from backend to get the calculated values
    try {
      const response = await getSheet(workbookId, sheetName);
      if (response.data.success) {
        const sheetData = response.data.data.sheet;
        const updatedCellMap = new Map();
        
        if (sheetData.cells) {
          Object.entries(sheetData.cells).forEach(([cellId, cellData]: [string, any]) =>{
            updatedCellMap.set(cellId, {
              value: cellData.value || '',
              formula: cellData.formula || '',
              style: cellData.style || {}
            });
          });
        }
        
        // Update global context with fresh data
        setCellDataBySheet(prev => ({
          ...prev,
          [sheetName]: updatedCellMap
        }));
      }
    } catch (err) {
      console.error("Failed to refresh sheet data:", err);
    }

    setIsEditing(false);
  };

  const handleKeyDown = async (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      await handleFormulaCommit();
    } else if (e.key === 'Escape') {
      // Reset to original value
      const cellData = cellMap?.get(activeCellId ?? '');
      const displayValue = cellData?.formula ? `=${cellData.formula}` : (cellData?.value ?? '');
      setFormulaBarValue(displayValue);
      setIsEditing(false);
    }
  };

  const handleBlur = async () => {
    if (isEditing) {
      await handleFormulaCommit();
    }
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
        className="flex-1 px-2 py-1 rounded border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-blue-700 dark:text-gray-100 text-xs sm:text-sm"
        value={formulaBarValue}
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
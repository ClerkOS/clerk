import React, { useState, useEffect } from 'react';
import { useCell, useEditCell } from '../hooks/useSpreadsheetQueries';

const CellWithReactQuery = ({ cellId, isActive, isSelected, onSelect, onActivate }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState('');

  // React Query hooks
  const { data: cellData, isLoading, error } = useCell(cellId);
  const editCellMutation = useEditCell();

  // Update edit value when cell data changes
  useEffect(() => {
    if (cellData) {
      setEditValue(cellData.value || cellData.formatted || '');
    }
  }, [cellData]);

  const handleDoubleClick = () => {
    setIsEditing(true);
    onActivate && onActivate();
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleSave();
    } else if (e.key === 'Escape') {
      setIsEditing(false);
      setEditValue(cellData?.value || cellData?.formatted || '');
    }
  };

  const handleSave = async () => {
    if (editValue !== (cellData?.value || cellData?.formatted || '')) {
      try {
        await editCellMutation.mutateAsync({ cellId, value: editValue });
      } catch (error) {
        console.error('Error updating cell:', error);
      }
    }
    setIsEditing(false);
  };

  const handleBlur = () => {
    handleSave();
  };

  const handleClick = () => {
    onSelect && onSelect();
  };

  if (isLoading) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-gray-50 animate-pulse">
        <div className="w-4 h-4 bg-gray-300 rounded"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-red-50 text-red-600 text-xs">
        Error
      </div>
    );
  }

  const displayValue = cellData?.formatted || cellData?.value || '';
  const isFormula = cellData?.type === 'formula';

  return (
    <div
      className={`
        w-full h-full border border-gray-200 p-1 text-sm
        ${isActive ? 'bg-blue-100 border-black' : ''}
        ${isSelected ? 'bg-blue-50 shadow-sm' : ''}
        ${isFormula ? 'italic text-blue-600' : ''}
        cursor-pointer select-none
      `}
      onClick={handleClick}
      onDoubleClick={handleDoubleClick}
    >
      {isEditing ? (
        <input
          type="text"
          value={editValue}
          onChange={(e) => setEditValue(e.target.value)}
          onKeyDown={handleKeyDown}
          onBlur={handleBlur}
          className="w-full h-full outline-none bg-transparent"
          autoFocus
        />
      ) : (
        <div className="w-full h-full flex items-center overflow-hidden">
          {displayValue}
        </div>
      )}
    </div>
  );
};

export default CellWithReactQuery; 
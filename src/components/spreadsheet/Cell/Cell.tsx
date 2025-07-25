import React from "react";
// import { useSpreadsheet } from '../../context/SpreadsheetContext.jsx';
// import { useFormulaPreview } from '../../context/FormulaPreviewContext.jsx';
// import { useCell, useEditCell } from '../../features/useSpreadsheetQueries.js';
// import { useDarkMode } from '../../features/useDarkMode.js';
import { CellProps } from "./cellTypes.js";
import useCell from "./useCell";
import { useActiveCell } from "../../providers/ActiveCellProvider";

const Cell: React.FC<CellProps> = ({ col, row, value, formula, style, workbookId }) => {
  const cellId = `${col}${row}`;
  const { activeCellId, setActiveCellId } = useActiveCell()
  let isActive = activeCellId === cellId

  const {
    isEditing,
    isLoading,
    isError,
    draftValue,
    setDraftValue,
    draftFormula,
    setDraftFormula,
    inputRef,
    cellRef,
    getCellClasses,
    getCellStyles,
    handleClick,
    handleDoubleClick,
    handleChange,
    saveCellChange,
    handleKeyDown,
  } = useCell({ col, row, value, formula, style, workbookId, cellId, isActive, setActiveCellId  });



  // Show loading state if React Query is loading
  if (isLoading) {
    return (
      <td
        className={getCellClasses()}
        data-cell={cellId}
        style={getCellStyles(style)}
      >
        <div className="w-full h-full flex items-center justify-center">
          <div className="w-4 h-4 bg-gray-300 rounded animate-pulse"></div>
        </div>
      </td>
    );
  }

  // Show error state if React Query has an error
  if (isError) {
    return (
      <td
        className={getCellClasses()}
        data-cell={cellId}
        style={getCellStyles(style)}
      >
        <div className="w-full h-full flex items-center justify-center">
          <div className="w-4 h-4 bg-red-500 rounded animate-pulse"></div>
        </div>
      </td>
    );
  }

  return (
    <td
      ref={cellRef}
      className={getCellClasses()}
      onMouseDown={handleClick}
      // onMouseEnter={onMouseEnter}
      onDoubleClick={handleDoubleClick}
      data-cell={cellId}
      style={getCellStyles(style)}
    >
      {isEditing ? (
        <input
          ref={inputRef}
          type="text"
          value={draftValue}
          onChange={handleChange}
          onBlur={saveCellChange}
          onKeyDown={handleKeyDown}
          className="w-full h-full bg-transparent border-none outline-none text-gray-800 dark:text-gray-100"
          style={getCellStyles(style)}
        />
      ) : (
        <div className="relative w-full h-full text-gray-700 dark:text-gray-100">
          <div className="absolute -inset-px pointer-events-none" />
          {value || (formula ? `=${formula}` : "")}

          {/*/!* Formula Preview Overlay *!/*/}
          {/*{isPreviewTarget && previewFormula && (*/}
          {/*  <div className="absolute inset-0 pointer-events-none bg-green-100/10 border-2 border-dashed border-green-500 rounded-sm z-10">*/}
          {/*    <div className="absolute inset-0 flex items-center justify-center text-sm text-green-600 dark:text-green-400">*/}
          {/*      {previewFormula}*/}
          {/*    </div>*/}
          {/*  </div>*/}
          {/*)}*/}
        </div>
      )}
    </td>
  );
};

export default React.memo(Cell);
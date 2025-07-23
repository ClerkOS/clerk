import React, { useCallback, useEffect, useRef, useState } from "react";
import { CellProps } from "./cellTypes";
import { setCell, SetCellPayload } from "../../../lib/api/apiClient";

export default function useCell({ value, formula, col, row, style, workbookId }: CellProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [isActive, setIsActive] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [draftValue, setDraftValue] = useState("");
  const [draftFormula, setDraftFormula] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const cellRef = useRef<HTMLTableCellElement>(null);
  const cellId = `${col}${row}`;

  // Click to select cell
  const handleClick = () => {
    setIsActive(true);
  };
  // Double click to start editing
  const handleDoubleClick = () => {
    setIsEditing(true);
    setDraftValue(value || "");
    setDraftFormula(formula || "");
  };

  // Focus input when it becomes editable
  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isEditing]);

  // Handle input change
  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setDraftValue(newValue);

    // If input starts with '=', treat as formula
    if (newValue.startsWith("=")) {
      setDraftFormula(newValue.slice(1));
    } else {
      setDraftFormula("");
    }
  }, []);

  // Save changes
  const saveCellChange = async () => {
    if (draftValue !== value || draftFormula !== formula) {
      try {
        const payload: SetCellPayload = {
          sheet: "Sheet1",
          address: cellId,
          value: draftValue,
          formula: draftFormula
        }
        await setCell(workbookId, payload);

      } catch (error) {
        console.error("Error saving cell:", error);
        setIsError(true);
        return;
      }
    }
    setIsEditing(false);
    setIsActive(false);
  };

  // Submit on Enter
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      saveCellChange();
    } else if (e.key === "Escape") {
      setIsEditing(false);
      setIsActive(false);
    }
  };

  // Determine cell styling based on selected/highlighted state and type
  const getCellClasses = useCallback(() => {
    let classes = "px-1 sm:px-2 py-1 color-transition ";

    // Base styling - remove grey backgrounds
    classes += "bg-white dark:bg-transparent ";

    // Active cell styling (the main selected cell)
    if (isActive) {
      classes += "border-2 border-black bg-blue-50 dark:border-white dark:bg-blue-900/20 ";
    } else if (isActive && isEditing) {
      classes += "p-0 border-2 border-black bg-blue-50 dark:border-white dark:bg-blue-900/20 ";
    }
    // Selected cells styling (part of multi-selection)
    else if (isActive) {
      classes += "bg-blue-50 dark:bg-blue-900/20 border border-black dark:border-white ";
    }
    // Highlighted column styling - remove grey background
    else if (isActive) {
      classes += "bg-gray-50 dark:bg-transparent border border-gray-200 dark:border-gray-700 ";
    }
    // Default styling
    else {
      classes += "border border-gray-200 dark:border-gray-700 ";
    }

    // Type-specific styles and value-based coloring
    // if (type === 'currency' || displayValue?.toString().startsWith('$') || !isNaN(Number(displayValue))) {
    //   classes += 'text-right ';
    // } else {
    //   classes += 'text-left ';
    // }
    //
    // // Profit (green), Cost (red) - only for columns F and E
    // if (col === 'F' && !isNaN(Number(displayValue))) {
    //   classes += 'text-green-600 dark:text-green-400 font-semibold ';
    // } else if (col === 'E' && !isNaN(Number(displayValue))) {
    //   classes += 'text-red-500 dark:text-red-400 font-semibold ';
    // }
    //
    // // Header
    // if (type === 'header') {
    //   classes += 'font-semibold ';
    // }
    //
    // // Formula cell styling
    // if (isFormulaCell) {
    //   classes += 'text-blue-600 dark:text-blue-400 font-mono text-xs sm:text-sm ';
    // }

    // Text size for all cells
    classes += "text-xs sm:text-sm ";

    return classes;
  }, [isActive]);

  return {
    isEditing,
    isLoading,
    isActive,
    isError,
    draftValue,
    setDraftValue,
    draftFormula,
    setDraftFormula,
    inputRef,
    cellRef,
    cellId,
    getCellClasses,
    handleClick,
    handleDoubleClick,
    handleChange,
    saveCellChange,
    handleKeyDown,
    cellData: {
      value,
      formula,
      style
    }
  };
}
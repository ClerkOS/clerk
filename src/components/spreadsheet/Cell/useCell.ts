import React, { CSSProperties, useCallback, useEffect, useRef, useState } from "react";
import { CellProps, UseCellProps, ImportStyle, RenderStyle } from "./cellTypes";
import { setCell, SetCellPayload } from "../../../lib/api/apiClient";
import { adjustStyleForDarkMode } from "../../../utils/utils";
import { useTheme } from "../../providers/ThemeProvider";
import { useActiveCell } from "../../providers/ActiveCellProvider";
import cell from "./Cell";

export default function useCell({ col, row, value, formula, style, workbookId,  cellId, isActive, setActiveCellId }: UseCellProps) {
  const [isEditing, setIsEditing] = useState(false);
  // const [isActive, setIsActive] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [draftValue, setDraftValue] = useState("");
  const [draftFormula, setDraftFormula] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const cellRef = useRef<HTMLTableCellElement>(null);
  const { theme } = useTheme();
  const isDarkMode = theme === "dark";

  // Click to select cell
  const handleClick = useCallback(() => {
    setActiveCellId(cellId);
  }, [cellId, setActiveCellId]);

  // Double click to start editing
  const handleDoubleClick = useCallback(() => {
    setIsEditing(true);
    setDraftValue(value || "");
    setDraftFormula(formula || "");
  }, [value, formula]);

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
  const saveCellChange = useCallback(async () => {
    if (draftValue !== value || draftFormula !== formula) {
      try {
        const payload: SetCellPayload = {
          sheet: "Sheet1",
          address: cellId,
          value: draftValue,
          formula: draftFormula
        };
        await setCell(workbookId, payload);
      } catch (error) {
        console.error("Error saving cell:", error);
        setIsError(true);
        return;
      }
    }
    setIsEditing(false);
  }, [draftValue, draftFormula, value, formula, cellId, workbookId]);

  // Submit on Enter
  const handleKeyDown = useCallback(async (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      await saveCellChange();
    } else if (e.key === "Escape") {
      setIsEditing(false);
    }
  }, [saveCellChange]);

  // Determine cell styling based on selected/highlighted state and type
  const getCellClasses = useCallback(() => {
    let classes = "px-1 sm:px-2 py-1 color-transition ";

    // Base styling - remove grey backgrounds
    classes += "dark:bg-transparent ";

    // Active cell styling (the main selected cell)
    if (isActive) {
      classes += "border-2 border-blue-400 dark:border-white ";
      classes += isEditing
        ? "bg-blue-50 dark:bg-blue-900/20 "
        : "bg-blue-50 dark:bg-blue-900/20 ";
    }
      // Selected cells styling (part of multi-selection)
    // else if (isActive) {
    //   classes += "bg-blue-50 dark:bg-blue-900/20 border border-black dark:border-white ";
    // }
    // // Highlighted column styling - remove grey background
    // else if (isActive) {
    //   classes += "bg-gray-50 dark:bg-transparent border border-gray-200 dark:border-gray-700 ";
    // }
    // Default styling
    else {
      classes += "border border-gray-200 dark:border-gray-700 ";
    }
    // Text size for all cells
    classes += "text-xs sm:text-sm ";

    return classes;
  }, [isActive, isEditing]);

  // Get inline styles based on cell styling
  const getCellStyles = useCallback(
    (style: ImportStyle): CSSProperties => {
      return adjustStyleForDarkMode(style, isDarkMode);
    },
    [isDarkMode]
  );

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
    getCellStyles,
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
import { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import { Sheet, DeleteConfirmation, DropdownPosition, SheetSwitcherProps } from './sheetSwitcherTypes';
import { useActiveSheet } from "../../providers/ActiveSheetProvider";
import { useSheet } from "../../spreadsheet/Sheet/useSheet";
import { useWorkbook } from "../../providers/WorkbookProvider";

export const useSheetSwitcher = (props: SheetSwitcherProps) => {
  const {
    workbookId,
    sheets,
    activeSheet,
    cellDataBySheet,
    isWorkbookLoaded,
    createWorkbook,
    importWorkbook,
    setActiveSheet,
  } = useWorkbook()

  // const {
  //   // sheets,
  //   currentSheetId,
  //   setCurrentSheet,
  //   addSheet,
  //   renameSheet,
  //   deleteSheet,
  //   isLoading,
  //   error
  // } = props;

  // const {sheets} = useSheet()
  // const { activeSheet } = useActiveSheet();
  const [dropdownOpen, setDropdownOpen] = useState<boolean>(false);
  const [renaming, setRenaming] = useState<boolean>(false);
  const [nameInput, setNameInput] = useState<string>(activeSheet || '');
  const [dropdownPosition, setDropdownPosition] = useState<DropdownPosition>('bottom');
  const [isAddingSheet, setIsAddingSheet] = useState<boolean>(false);
  const [deleteConfirmation, setDeleteConfirmation] = useState<DeleteConfirmation>(null);

  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const quickAddButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    setNameInput(activeSheet || '');
  }, [activeSheet]);

  useEffect(() => {
    if (renaming && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [renaming]);

  const calculateDropdownPosition = useCallback((): DropdownPosition => {
    if (!buttonRef.current) return 'bottom';

    const buttonRect = buttonRef.current.getBoundingClientRect();
    const viewportHeight = window.innerHeight;
    const dropdownHeight = Math.min(sheets.length * 40 + 60, 300);

    const spaceBelow = viewportHeight - buttonRect.bottom;
    const spaceAbove = buttonRect.top;

    return spaceBelow >= dropdownHeight || spaceBelow > spaceAbove ? 'bottom' : 'top';
  }, [sheets.length]);

  useEffect(() => {
    if (!dropdownOpen) return;

    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target.closest('[title="Add new sheet"]')) {
        return;
      }
      if (dropdownRef.current && !dropdownRef.current.contains(target)) {
        setDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [dropdownOpen]);

  const handleDropdownToggle = useCallback(() => {
    if (!dropdownOpen) {
      const position = calculateDropdownPosition();
      setDropdownPosition(position);
    }
    setDropdownOpen(!dropdownOpen);
  }, [dropdownOpen, calculateDropdownPosition]);

  // const handleRename = useCallback(async () => {
  //   if (!currentSheetId || !nameInput.trim() || nameInput === activeSheet) {
  //     setRenaming(false);
  //     return;
  //   }
  //
  //   try {
  //     await renameSheet(currentSheetId, nameInput.trim());
  //   } catch (error) {
  //     console.error('Failed to rename sheet:', error);
  //     setNameInput(activeSheet || '');
  //   }
  //   setRenaming(false);
  // }, [currentSheetId, activeSheet, nameInput, renameSheet]);

  // const handleDeleteSheet = useCallback((e: React.MouseEvent, sheetId: string) => {
  //   e.stopPropagation();
  //   if (sheets.length <= 1) return;
  //
  //   const sheetToDelete = sheets.find((s) => s === sheetId);
  //   if (sheetToDelete) {
  //     setDeleteConfirmation({ sheetId, sheetName: sheetToDelete });
  //   }
  // }, [sheets]);

  // const confirmDelete = useCallback(async () => {
  //   if (!deleteConfirmation) return;
  //
  //   try {
  //     await deleteSheet(deleteConfirmation.sheetId);
  //     setDropdownOpen(false);
  //   } catch (error) {
  //     console.error('Failed to delete sheet:', error);
  //   } finally {
  //     setDeleteConfirmation(null);
  //   }
  // }, [deleteConfirmation, deleteSheet]);

  // const cancelDelete = useCallback(() => {
  //   setDeleteConfirmation(null);
  // }, []);

  const handleAddSheet = useCallback(async () => {
    try {
      setIsAddingSheet(true);
      await addSheet();
      setDropdownOpen(false);
    } catch (error) {
      console.error('Failed to add sheet:', error);
    } finally {
      setIsAddingSheet(false);
    }
  }, [addSheet]);

  const handleAddSheetFromDropdown = useCallback(async () => {
    await handleAddSheet();
  }, [handleAddSheet]);

  return {
    activeSheet,
    dropdownOpen,
    setDropdownOpen,
    renaming,
    nameInput,
    dropdownPosition,
    isAddingSheet,
    deleteConfirmation,
    inputRef,
    dropdownRef,
    buttonRef,
    quickAddButtonRef,
    isLoading,
    error,
    sheets,
    handleDropdownToggle,
    setNameInput,
    setRenaming,
    handleRename,
    handleDeleteSheet,
    confirmDelete,
    cancelDelete,
    handleAddSheet,
    handleAddSheetFromDropdown
  };
};
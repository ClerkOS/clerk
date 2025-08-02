import React, { useEffect, useRef } from "react";
import { ContextMenuProps, AIAction, Position } from "./contextMenuTypes";

export default function useContextMenu({ position, onClose, onOpenAIWithRange, isCell, selectedCells, cellId }: ContextMenuProps){
  const menuRef = useRef<HTMLDivElement>(null);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [onClose]);

// Close menu on escape key
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    document.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("keydown", handleEscape);
    };
  }, [onClose]);

  const handleAIAction = (action: AIAction) => {
    const range = selectedCells.length > 1
      ? `${selectedCells[0]}:${selectedCells[selectedCells.length - 1]}`
      : cellId || selectedCells[0];

    onOpenAIWithRange({ range, action });
    onClose();
  };

  const handleCopy = () => {
    if (navigator.clipboard) {
      const text = selectedCells.length > 1
        ? selectedCells.join(", ")
        : cellId || selectedCells[0];
      navigator.clipboard.writeText(text);
    }
    onClose();
  };

  const handlePaste = async () => {
    if (navigator.clipboard) {
      try {
        const text = await navigator.clipboard.readText();
        // TODO: Implement paste functionality
        console.log("Pasting:", text);
      } catch (error) {
        console.error("Failed to read clipboard:", error);
      }
    }
    onClose();
  };

  const handleDelete = () => {
    // TODO: Implement delete functionality
    console.log("Deleting cells:", selectedCells);
    onClose();
  };

  const handleEdit = () => {
    // TODO: Implement edit functionality
    console.log("Editing cell:", cellId);
    onClose();
  };

  const menuStyle: React.CSSProperties = {
    position: "fixed",
    top: position.y,
    left: position.x,
    zIndex: 1000
  };


  return{
    menuRef,
    handleAIAction,
    handleCopy,
    handlePaste,
    handleDelete,
    handleEdit,
    menuStyle
  }
}


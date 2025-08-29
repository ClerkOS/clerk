import React, { useRef, useState } from "react";
import { Position } from "../../app/ContextMenu/contextMenuTypes";

export const useSheet = () => {
  const [contextMenu, setContextMenu] = useState<Position | null>(null);

// Handle context menu
  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    setContextMenu({
      x: e.clientX,
      y: e.clientY
    });
  };

  const handleCloseContextMenu = () => {
    setContextMenu(null);
  };

  return {
    contextMenu,
    handleContextMenu,
    handleCloseContextMenu
  };
};

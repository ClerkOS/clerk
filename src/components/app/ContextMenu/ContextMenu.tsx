import React, { useEffect, useRef } from "react";
import { BarChart3, Calculator, ClipboardPaste, Copy, Edit3, Palette, Sparkles, Trash2, X } from "lucide-react";
import { ContextMenuProps } from "./contextMenuTypes";
import useContextMenu from "./useContextMenu";



const ContextMenu: React.FC<ContextMenuProps> = ({ position, onClose, onOpenAIWithRange, isCell, selectedCells, cellId }) => {

  const {
    menuRef,
    menuStyle,
    handleAIAction,
    handleEdit,
    handleCopy,
    handlePaste,
    handleDelete
  } = useContextMenu({ position, onClose, onOpenAIWithRange, isCell, selectedCells, cellId })

  return (
    <div
      ref={menuRef}
      className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg py-2 min-w-[200px]"
      style={menuStyle}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-2 border-b border-gray-200 dark:border-gray-700">
        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
          {isCell ? "Cell Actions" : "Range Actions"}
        </span>
        <button
          onClick={onClose}
          className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
        >
          <X size={16} />
        </button>
      </div>

      {/* AI Actions */}
      <div className="px-2 py-1">
        <div className="text-xs font-medium text-gray-500 dark:text-gray-400 px-2 py-1">
          AI Assistant
        </div>

        <button
          onClick={() => handleAIAction("analyze")}
          className="w-full flex items-center space-x-2 px-2 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-md transition-colors"
        >
          <BarChart3 size={16} />
          <span>Analyze Data</span>
        </button>

        <button
          onClick={() => handleAIAction("formula")}
          className="w-full flex items-center space-x-2 px-2 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-md transition-colors"
        >
          <Calculator size={16} />
          <span>Generate Formula</span>
        </button>

        <button
          onClick={() => handleAIAction("format")}
          className="w-full flex items-center space-x-2 px-2 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-md transition-colors"
        >
          <Palette size={16} />
          <span>Suggest Formatting</span>
        </button>

        <button
          onClick={() => handleAIAction("enhance")}
          className="w-full flex items-center space-x-2 px-2 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-md transition-colors"
        >
          <Sparkles size={16} />
          <span>AI Enhancement</span>
        </button>
      </div>

      {/* Standard Actions */}
      <div className="px-2 py-1 border-t border-gray-200 dark:border-gray-700">
        <div className="text-xs font-medium text-gray-500 dark:text-gray-400 px-2 py-1">
          Actions
        </div>

        <button
          onClick={handleEdit}
          className="w-full flex items-center space-x-2 px-2 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-md transition-colors"
        >
          <Edit3 size={16} />
          <span>Edit</span>
        </button>

        <button
          onClick={handleCopy}
          className="w-full flex items-center space-x-2 px-2 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-md transition-colors"
        >
          <Copy size={16} />
          <span>Copy</span>
        </button>

        <button
          onClick={handlePaste}
          className="w-full flex items-center space-x-2 px-2 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-md transition-colors"
        >
          <ClipboardPaste size={16} />
          <span>Paste</span>
        </button>

        <button
          onClick={handleDelete}
          className="w-full flex items-center space-x-2 px-2 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-md transition-colors"
        >
          <Trash2 size={16} />
          <span>Delete</span>
        </button>
      </div>

      {/* Selection Info */}
      {selectedCells.length > 0 && (
        <div className="px-2 py-1 border-t border-gray-200 dark:border-gray-700">
          <div className="text-xs font-medium text-gray-500 dark:text-gray-400 px-2 py-1">
            Selection
          </div>
          <div className="px-2 py-1 text-xs text-gray-600 dark:text-gray-400">
            {selectedCells.length === 1
              ? `Cell ${selectedCells[0]}`
              : `${selectedCells.length} cells selected`
            }
          </div>
        </div>
      )}
    </div>
  );
};

export default ContextMenu;
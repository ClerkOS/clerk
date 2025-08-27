import React from 'react';
import { ChevronDown, Plus, X, Loader2 } from 'lucide-react';
import { useSheetSwitcher } from './useSheetSwitcher';
import { SheetSwitcherProps } from './sheetSwitcherTypes';
import { useActiveSheet } from "../../providers/ActiveSheetProvider";
import { useSheet } from "../../spreadsheet/Sheet/useSheet";
import { useWorkbook } from "../../providers/WorkbookProvider";

const SheetSwitcher: React.FC<SheetSwitcherProps> = (props) => {
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

  const {
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
    // sheets,
    handleDropdownToggle,
    setNameInput,
    setRenaming,
    handleRename,
    handleDeleteSheet,
    confirmDelete,
    cancelDelete,
    handleAddSheet,
    handleAddSheetFromDropdown
  } = useSheetSwitcher(props);

  // const {sheets} = useSheet()
  // console.log(sheets)
  // const { activeSheet, setActiveSheet } = useActiveSheet();
  const activeSheetIndex = sheets.findIndex((sheet) => sheet === activeSheet);

  if (isLoading) {
    return (
      <div className="flex items-center space-x-2 px-3 py-1.5 text-sm font-medium rounded-md bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
        <Loader2 size={14} className="animate-spin text-gray-500 dark:text-gray-400" />
        <span className="text-gray-500 dark:text-gray-400">Loading sheets...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center space-x-2 px-3 py-1.5 text-sm font-medium rounded-md bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800">
        <span className="text-red-600 dark:text-red-400">Failed to load sheets</span>
      </div>
    );
  }

  return (
    <div className="flex items-center space-x-1">
      {/*{deleteConfirmation && (*/}
      {/*  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">*/}
      {/*    <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-sm w-full mx-4">*/}
      {/*      <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">*/}
      {/*        Delete Sheet*/}
      {/*      </h3>*/}
      {/*      <p className="text-gray-600 dark:text-gray-300 mb-6">*/}
      {/*        Are you sure you want to delete "{deleteConfirmation.sheetName}"? This action cannot be undone.*/}
      {/*      </p>*/}
      {/*      <div className="flex space-x-3">*/}
      {/*        <button*/}
      {/*          onClick={cancelDelete}*/}
      {/*          className="flex-1 px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-md hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"*/}
      {/*        >*/}
      {/*          Cancel*/}
      {/*        </button>*/}
      {/*        <button*/}
      {/*          onClick={confirmDelete}*/}
      {/*          className="flex-1 px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700 transition-colors"*/}
      {/*        >*/}
      {/*          Delete*/}
      {/*        </button>*/}
      {/*      </div>*/}
      {/*    </div>*/}
      {/*  </div>*/}
      {/*)}*/}

      <div className="relative">
        <button
          ref={buttonRef}
          className={`
            flex items-center space-x-2 px-3 py-1.5 text-sm font-medium rounded-md transition-all duration-200
            bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700
            hover:bg-gray-50 dark:hover:bg-gray-700 hover:border-gray-300 dark:hover:border-gray-600
            focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1 dark:focus:ring-offset-gray-900
            ${dropdownOpen ? 'ring-2 ring-blue-500 ring-offset-1 dark:ring-offset-gray-900' : ''}
          `}
          onClick={handleDropdownToggle}
          onDoubleClick={(e) => { e.stopPropagation(); setRenaming(true); }}
          disabled={sheets.length === 0}
        >
          {renaming ? (
            <input
              ref={inputRef}
              className="bg-transparent outline-none text-sm font-medium text-gray-900 dark:text-white min-w-[80px] max-w-[120px]"
              value={nameInput}
              onChange={(e) => setNameInput(e.target.value)}
              onBlur={handleRename}
              onKeyDown={async (e) => {
                if (e.key === 'Enter') await handleRename();
                if (e.key === 'Escape') { setRenaming(false); setNameInput(activeSheet || ''); }
              }}
              maxLength={20}
            />
          ) : (
            <>
              <span className="text-gray-900 dark:text-white truncate max-w-[100px]" title={activeSheet? activeSheet : ''}>
                {activeSheet || 'No sheets'}
              </span>
              {sheets.length > 0 && (
                <ChevronDown
                  size={14}
                  className={`text-gray-500 dark:text-gray-400 transition-transform duration-200 ${
                    dropdownOpen ? 'rotate-180' : ''
                  }`}
                />
              )}
            </>
          )}
        </button>

        {dropdownOpen && sheets.length > 0 && (
          <div
            ref={dropdownRef}
            className={`absolute z-50 w-56 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg py-1 ${
              dropdownPosition === 'top'
                ? 'bottom-full mb-1'
                : 'top-full mt-1'
            } left-0`}
          >
            {sheets.map((sheet, index) => (
              <div
                key={index}
                className="group flex items-center justify-between px-3 py-2 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                <button
                  className={`flex-1 text-left text-sm transition-colors ${
                    index === activeSheetIndex
                      ? 'text-blue-600 dark:text-blue-400 font-medium'
                      : 'text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'
                  }`}
                  onClick={() => { setActiveSheet(sheet); setDropdownOpen(false); }}
                >
                  {sheet}
                </button>
                {sheets.length > 1 && (
                  <button
                    className="p-1 rounded hover:bg-red-100 dark:hover:bg-red-900/20 transition-all duration-200"
                    onClick={(e) => handleDeleteSheet(e, sheet)}
                    title="Delete sheet"
                  >
                    <X size={12} className="text-red-500 dark:text-red-400" />
                  </button>
                )}
              </div>
            ))}

            <div className="border-t border-gray-200 dark:border-gray-700 mt-1 pt-1">
              <button
                className="w-full flex items-center space-x-2 px-3 py-2 text-sm text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white transition-colors disabled:opacity-50"
                onClick={handleAddSheetFromDropdown}
                disabled={isAddingSheet}
              >
                {isAddingSheet ? (
                  <Loader2 size={14} className="animate-spin" />
                ) : (
                  <Plus size={14} />
                )}
                <span>{isAddingSheet ? 'Adding...' : 'Add sheet'}</span>
              </button>
            </div>
          </div>
        )}
      </div>

      <button
        ref={quickAddButtonRef}
        className="p-1.5 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 transition-colors disabled:opacity-50"
        onClick={handleAddSheet}
        title="Add new sheet"
        disabled={isAddingSheet}
      >
        {isAddingSheet ? (
          <Loader2 size={16} className="animate-spin" />
        ) : (
          <Plus size={16} />
        )}
      </button>
    </div>
  );
};

export default SheetSwitcher;
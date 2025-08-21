// // const {
// //   selectedCell,
// //   setSelectedCell,
// //   activeFormula,
// //   setActiveFormula,
// //   getActiveSheet,
// //   zoom,
// //   setZoom,
// //   visibleColumns,
// //   addColumns,
// //   getTotalColumns,
// //   isColumnVisible,
// //   getColumnWidth,
// //   updateColumnWidth
// // } = useSpreadsheet();
//
// // Get selection state
// // const { selectedCells, clearSelection, startSelection } = useSelection();
//
// // React Query features for workbook operations
// // const { importWorkbook, exportWorkbook, isImporting, isExporting, importError, exportError } = useWorkbookOperations();
//
// const [showTablesPanel, setShowTablesPanel] = useState(false);
// const [tablesPanelWidth, setTablesPanelWidth] = useState(300);
// const [notification, setNotification] = useState<Notification | null>(null);
//
// const [contextMenu, setContextMenu] = useState<{ x: number, y: number } | null>(null);
// const [isEditing, setIsEditing] = useState(false);
// const fileInputRef = useRef<HTMLInputElement>(null);
//
// // Helper functions for column navigation
// const colToNum = (col: string): number => {
//   let result = 0;
//   for (let i = 0; i < col.length; i++) {
//     result = result * 26 + (col.charCodeAt(i) - 64);
//   }
//   return result - 1;
// };
//
// const numToCol = (num: number): string => {
//   let result = "";
//   num = num + 1;
//   while (num > 0) {
//     const remainder = (num - 1) % 26;
//     result = String.fromCharCode(65 + remainder) + result;
//     num = Math.floor((num - 1) / 26);
//   }
//   return result;
// };
//
// // Keyboard navigation handler
// const handleKeyDown = useCallback((e: KeyboardEvent) => {
//   if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement || isEditing) {
//     return;
//   }
//
//   // const { col, row } = selectedCell;
//   const { col, row } = ({ col: "A", row: 1 });
//   let newCol = col;
//   let newRow = row;
//
//   switch (e.key) {
//     case "ArrowUp":
//       e.preventDefault();
//       newRow = Math.max(1, row - 1);
//       break;
//     case "ArrowDown":
//       e.preventDefault();
//       newRow = row + 1;
//       break;
//     case "ArrowLeft":
//       e.preventDefault();
//       const colNum = colToNum(col);
//       if (colNum > 0) {
//         newCol = numToCol(colNum - 1);
//       }
//       break;
//     case "ArrowRight":
//       e.preventDefault();
//       const nextColNum = colToNum(col);
//       newCol = numToCol(nextColNum + 1);
//       break;
//     // case 'Tab':
//     //   e.preventDefault();
//     //   if (e.shiftKey) {
//     //     const colNum = colToNum(col);
//     //     if (colNum > 0) {
//     //       newCol = numToCol(colNum - 1);
//     //     } else {
//     //       newRow = Math.max(1, row - 1);
//     //       newCol = numToCol(visibleColumns - 1);
//     //     }
//     //   } else {
//     //     const nextColNum = colToNum(col);
//     //     if (nextColNum < visibleColumns - 1) {
//     //       newCol = numToCol(nextColNum + 1);
//     //     } else {
//     //       newRow = row + 1;
//     //       newCol = 'A';
//     //     }
//     //   }
//     //   break;
//     case "Enter":
//       e.preventDefault();
//       setIsEditing(true);
//       return;
//     case "Home":
//       e.preventDefault();
//       newCol = "A";
//       break;
//     case "End":
//       e.preventDefault();
//       // const lastColNum = visibleColumns - 1;
//       // newCol = numToCol(lastColNum);
//       break;
//     case "PageUp":
//       e.preventDefault();
//       newRow = Math.max(1, row - 20);
//       break;
//     case "PageDown":
//       e.preventDefault();
//       newRow = row + 20;
//       break;
//     default:
//       return;
//   }
//
//   // if (newCol !== col || newRow !== row) {
//   //   setSelectedCell({ col: newCol, row: newRow });
//   //   // clearSelection();
//   //   // startSelection(newCol, newRow);
//   // }
// }, []);
// // [selectedCell, visibleColumns, setSelectedCell, clearSelection, startSelection, isEditing]);
//
// // Add keyboard event listener
// useEffect(() => {
//   const handleGlobalKeyDown = (e: KeyboardEvent) => {
//     handleKeyDown(e);
//   };
//
//   document.addEventListener("keydown", handleGlobalKeyDown);
//   return () => {
//     document.removeEventListener("keydown", handleGlobalKeyDown);
//   };
// }, [handleKeyDown]);
//
// // Handle editing state changes
// const handleEditingChange = useCallback((editing: boolean) => {
//   setIsEditing(editing);
// }, []);
//
// // Handle file import
// const handleFileImport = async (event: React.ChangeEvent<HTMLInputElement>) => {
//   const file = event.target.files?.[0];
//   if (file) {
//     try{
//       setNotification({
//         type: "info",
//         message: "Importing file...",
//         // icon: <Database size={16} />
//       })
//       if (fileInputRef.current) {
//         fileInputRef.current.value = '';
//       }
//     } catch (error) {
//       console.error("Error importing file:", error);
//       setNotification({
//         type: "error",
//         message: "Failed to import file.",
//         // icon: <AlertCircle size={16} />
//       });
//     }
//   }
// }
//
// // Handle file export
// const handleFileExport = async () => {
//   try {
//     // await exportWorkbook();
//     setNotification({
//       type: 'success',
//       message: 'Workbook exported successfully!',
//       // icon: <CheckCircle size={16} />
//     });
//   } catch (error) {
//     setNotification({
//       type: 'error',
//       message: 'Failed to export workbook',
//       // icon: <AlertCircle size={16} />
//     });
//   }
// };
//
// // Clear notification after 3 seconds
// useEffect(() => {
//   if (notification) {
//     const timer = setTimeout(() => {
//       setNotification(null);
//     }, 3000);
//     return () => clearTimeout(timer);
//   }
// }, [notification]);
//
// // Handle context menu
// const handleContextMenu = (e: React.MouseEvent) => {
//   e.preventDefault();
//   setContextMenu({
//     x: e.clientX,
//     y: e.clientY
//   });
// };
//
// const handleCloseContextMenu = () => {
//   setContextMenu(null);
// };
//
// // const handleOpenAIWithRange = (selectedRange: string) => {
// //   setContextMenu(null);
// //   onOpenAIWithRange(selectedRange);
// // };
//
// const isEmpty = false; // Replace with actual check for empty state
// // const activeSheet = getActiveSheet();
// // const isEmpty = !activeSheet || !activeSheet.id;
// //
// // console.log('Spreadsheet rendering:', {
// //   activeSheet: activeSheet ? { id: activeSheet.id, name: activeSheet.name } : null,
// //   isEmpty,
// //   hasActiveSheet: !!activeSheet,
// //   hasActiveSheetId: !!(activeSheet && activeSheet.id),
// //   activeSheetId: activeSheet?.id,
// //   activeSheetName: activeSheet?.name
// // });
// //
// // // Force re-render when active sheet changes
// // const gridKey = `grid-${activeSheet?.id || 'default'}`;
//
// const handleFileUpload = async (file: File) => {
//   try {
//     // await importWorkbook(file);
//   } catch (error) {
//     setNotification({
//       type: 'error',
//       message: error instanceof Error ? error.message : 'File upload failed',
//       // icon: <AlertCircle size={16} />
//     });
//   }
// };
//
// const handleNewSheet = () => {
//   // Implement new sheet creation
//   console.log("Create new sheet");
// };
//
// const handleSampleData = () => {
//   // Implement sample data loading
//   console.log("Load sample data");
// };
//
// // Debug: Track active sheet changes
// // useEffect(() => {
// //   console.log('Spreadsheet - Active sheet changed:', {
// //     activeSheetId: activeSheet?.id,
// //     activeSheetName: activeSheet?.name,
// //     gridKey: gridKey
// //   });
// // }, [activeSheet?.id, activeSheet?.name, gridKey]);
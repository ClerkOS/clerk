// // 1. Add to your useGrid hook or Grid component state
// const [animatingCells, setAnimatingCells] = useState<Set<string>>(new Set());
//
// // 2. Add this function to trigger animations (call from useConversation)
// const triggerCellAnimations = (addresses: string[]) => {
//    // Add all addresses to animating set
//    setAnimatingCells(new Set(addresses));
//
//    // Remove animation after duration
//    setTimeout(() => {
//       setAnimatingCells(new Set());
//    }, 800); // 800ms pulse duration
// };
//
// // 3. In your Grid component, modify the cell rendering section:
// {cellPool.map(({ row, col }, index) => {
//    const addr = `${columnIndexToLetter(col)}${row + 1}`;
//    const cellData = cellMap.get(addr);
//    const value = cellData?.value ?? "";
//    const isNumber = !isNaN(Number(value)) && value.trim() !== "";
//    const justifyClass = isNumber ? "justify-end" : "justify-start";
//    const inSelection = isCellSelected(row, col);
//
//    // Compute selection borders for range highlight
//    let borderStyles: React.CSSProperties = {};
//    if (selectionStart && selectionEnd && inSelection) {
//       const minRow = Math.min(selectionStart.row, selectionEnd.row);
//       const maxRow = Math.max(selectionStart.row, selectionEnd.row);
//       const minCol = Math.min(selectionStart.col, selectionEnd.col);
//       const maxCol = Math.max(selectionStart.col, selectionEnd.col);
//
//       if (row === minRow) borderStyles.borderTop = "2px solid #488cfa";
//       if (row === maxRow) borderStyles.borderBottom = "2px solid #488cfa";
//       if (col === minCol) borderStyles.borderLeft = "2px solid #488cfa";
//       if (col === maxCol) borderStyles.borderRight = "2px solid #488cfa";
//    }
//
//    // Highlight states
//    const isHighlighted =
//      (selectionMode === "cell" && selectedCell?.row === row && selectedCell?.col === col) ||
//      (selectionMode === "row" && selectedRow === row) ||
//      (selectionMode === "col" && selectedCol === col) ||
//      inSelection;
//
//    // Animation state - NEW!
//    const isAnimating = animatingCells.has(addr);
//
//    // Combine highlight classes
//    const getBackgroundClass = () => {
//       if (isAnimating) {
//          return "bg-green-100 dark:bg-green-800 animate-pulse scale-105 shadow-lg";
//       }
//       if (isHighlighted) {
//          return "bg-blue-100 dark:bg-blue-800";
//       }
//       return "bg-white dark:bg-gray-900";
//    };
//
//    return (
//      <div
//        key={index}
//    onDoubleClick={() => handleCellDoubleClick(row, col)}
//    onMouseDown={() => handleMouseDown(row, col)}
//    onMouseEnter={() => handleMouseEnter(row, col)}
//    onMouseUp={handleMouseUp}
//    className={`absolute flex items-center ${justifyClass} border-b border-r border-gray-300 text-sm transition-all duration-300 ease-out
//         ${getBackgroundClass()}`}
//    style={{
//       transform: `translate(${col * CELL_WIDTH}px, ${row * CELL_HEIGHT}px)`,
//         width: CELL_WIDTH,
//         height: CELL_HEIGHT,
//    ...borderStyles
//    }}
// >
//    {value}
//    </div>
// );
// })}
//
// // 4. Modified applyTableEdits in useConversation:
// async function applyTableEdits(
//   workbookId: string,
//   sheetName: string,
//   edits: any[],
//   setCellMap: React.Dispatch<React.SetStateAction<Map<string, CellData>>>,
//   setCellDataBySheet: React.Dispatch<
//     React.SetStateAction<Record<string, Map<string, CellData>>>
//   >,
//   triggerAnimations?: (addresses: string[]) => void // NEW parameter
// ) {
//    // Process edits to handle formulas correctly
//    const processedEdits = edits.map(edit => {
//       if (edit.value && edit.value.startsWith('=')) {
//          return {
//             ...edit,
//             value: edit.value,
//             formula: edit.value.substring(1)
//          };
//       }
//       return edit;
//    });
//
//    // Apply all edits at once
//    setCellMap(prev => {
//       const newMap = new Map(prev);
//       processedEdits.forEach(edit => {
//          newMap.set(edit.address, {
//             value: edit.value,
//             formula: edit.formula ?? "",
//             style: edit.style ?? {}
//          });
//       });
//       return newMap;
//    });
//
//    setCellDataBySheet(prev => {
//       const prevSheetMap = prev[sheetName] ?? new Map();
//       const newMap = new Map(prevSheetMap);
//       processedEdits.forEach(edit => {
//          newMap.set(edit.address, {
//             value: edit.value,
//             formula: edit.formula ?? "",
//             style: edit.style ?? {}
//          });
//       });
//       return {
//          ...prev,
//          [sheetName]: newMap
//       };
//    });
//
//    // Trigger animations - NEW!
//    if (triggerAnimations) {
//       const addresses = processedEdits.map(edit => edit.address);
//       triggerAnimations(addresses);
//    }
//
//    // Push changes to backend
//    await batchSetCells(workbookId, {
//       sheet: sheetName,
//       edits: processedEdits
//    });
//
//    // Refresh sheet data to get evaluated values
//    try {
//       const response = await getSheet(workbookId, sheetName);
//       if (response.data.success) {
//          const sheetData = response.data.data.sheet;
//          const updatedCellMap = new Map();
//
//          if (sheetData.cells) {
//             Object.entries(sheetData.cells).forEach(([cellId, cellData]: [string, any]) => {
//                updatedCellMap.set(cellId, {
//                   value: cellData.value || "",
//                   formula: cellData.formula || "",
//                   style: cellData.style || {}
//                });
//             });
//          }
//
//          setCellMap(updatedCellMap);
//          setCellDataBySheet(prev => ({
//             ...prev,
//             [sheetName]: updatedCellMap
//          }));
//       }
//    } catch (err) {
//       console.error("Failed to refresh sheet data:", err);
//    }
// }
//
// // 5. When calling applyTableEdits from useConversation:
// await applyTableEdits(
//   workbookId,
//   sheetName,
//   edits,
//   setCellMap,
//   setCellDataBySheet,
//   triggerCellAnimations // Pass the animation function
// );
//
// // In your Grid component or useGrid hook:
//
// const [animatingCells, setAnimatingCells] = useState<Set<string>>(new Set());
// const [lastUpdateTimestamp, setLastUpdateTimestamp] = useState<number>(0);
//
// // Watch for changes to cellMap and animate recent changes
// useEffect(() => {
//    // Get current timestamp
//    const now = Date.now();
//
//    // If this update happened very recently (within 100ms), animate the cells
//    if (now - lastUpdateTimestamp < 100) {
//       // Get all cell addresses that have values (recently updated)
//       const addresses = Array.from(cellMap.keys()).filter(addr => cellMap.get(addr)?.value);
//
//       if (addresses.length > 0 && addresses.length <= 50) {
//          // Trigger pulse animation
//          setAnimatingCells(new Set(addresses));
//
//          setTimeout(() => {
//             setAnimatingCells(new Set());
//          }, 800);
//       }
//    }
// }, [cellMap, lastUpdateTimestamp]);
//
// // In your applyTableEdits function, just add this line after updating cellMap:
// setLastUpdateTimestamp(Date.now());
//
// // Then in your cell rendering, use the same animation logic as before:
// const isAnimating = animatingCells.has(addr);
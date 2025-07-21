import React, { useEffect, useRef, useState } from "react";
import { Copy, GripVertical, Plus, Trash2 } from "lucide-react";
import { useTheme } from "../../providers/ThemeProvider";

// import { useSpreadsheet } from '../../context/SpreadsheetContext.jsx';

interface TableSize {
  label: string;
  rows: number;
  cols: number;
}

interface TableStyle {
  id: string;
  name: string;
  preview: string;
}

interface CellPosition {
  row: number;
  col: number;
}

interface IntuitiveTableBuilderProps {
  onWidthChange?: (width: number) => void;
}

const TableBuilder: React.FC<IntuitiveTableBuilderProps> = ({ onWidthChange }) => {
  // const { selectedCell, updateCell } = useSpreadsheet();

  const [width, setWidth] = useState<number>(320);
  const [tableData, setTableData] = useState<string[][]>([
    ["Product", "Price", "Stock"],
    ["", "", ""],
    ["", "", ""]
  ]);
  const [tableStyle, setTableStyle] = useState<string>("default");
  const [selectedCellBuilder, setSelectedCellBuilder] = useState<CellPosition | null>(null);

  const isResizing = useRef<boolean>(false);
  const startX = useRef<number>(0);
  const startWidth = useRef<number>(0);

  // Quick size presets
  const quickSizes: TableSize[] = [
    { label: "2×2", rows: 2, cols: 2 },
    { label: "3×3", rows: 3, cols: 3 },
    { label: "4×3", rows: 4, cols: 3 },
    { label: "3×5", rows: 3, cols: 5 }
  ];

  const styles: TableStyle[] = [
    { id: "default", name: "Clean", preview: "━━━" },
    { id: "minimal", name: "Simple", preview: "───" },
    { id: "striped", name: "Striped", preview: "▬▬▬" },
    { id: "bordered", name: "Bold", preview: "█▀█" }
  ];

  const handleMouseDown = (e: React.MouseEvent) => {
    isResizing.current = true;
    startX.current = e.clientX;
    startWidth.current = width;
    document.body.style.cursor = "ew-resize";
    document.body.style.userSelect = "none";
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (!isResizing.current) return;
    const delta = startX.current - e.clientX;
    const newWidth = Math.min(Math.max(startWidth.current + delta, 280), 500);
    setWidth(newWidth);
    onWidthChange?.(newWidth);
  };

  const handleMouseUp = () => {
    isResizing.current = false;
    document.body.style.cursor = "";
    document.body.style.userSelect = "";
  };

  useEffect(() => {
    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, []);

  const updateTableCell = (rowIndex: number, colIndex: number, value: string) => {
    const newData = [...tableData];
    newData[rowIndex][colIndex] = value;
    setTableData(newData);
  };

  const addRow = () => {
    const newRow = new Array(tableData[0].length).fill("");
    setTableData([...tableData, newRow]);
  };

  const addColumn = () => {
    const newData = tableData.map(row => [...row, ""]);
    setTableData(newData);
  };

  const removeRow = (index: number) => {
    if (tableData.length > 1) {
      const newData = tableData.filter((_, i) => i !== index);
      setTableData(newData);
    }
  };

  const removeColumn = (index: number) => {
    if (tableData[0].length > 1) {
      const newData = tableData.map(row => row.filter((_, i) => i !== index));
      setTableData(newData);
    }
  };

  const setQuickSize = (rows: number, cols: number) => {
    const newData = Array(rows).fill(null).map((_, rowIndex) =>
      Array(cols).fill(null).map((_, colIndex) => {
        if (rowIndex === 0) return `Header ${colIndex + 1}`;
        return tableData[rowIndex]?.[colIndex] || "";
      })
    );
    setTableData(newData);
  };

  const fillSampleData = () => {
    const sampleData = [
      ["Product", "Price", "Stock"],
      ["Laptop", "$999", "45"],
      ["Mouse", "$29", "120"],
      ["Keyboard", "$79", "67"]
    ];
    setTableData(sampleData);
  };

  const clearTable = () => {
    const newData = tableData.map((row, rowIndex) =>
      row.map(() => rowIndex === 0 ? "" : "")
    );
    setTableData(newData);
  };

  const exportTable = () => {
    const csvContent = tableData.map(row =>
      row.map(cell => `"${cell}"`).join(",")
    ).join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "table.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  const copyTable = () => {
    // Convert table data to a format suitable for clipboard
    const tableText = tableData.map(row =>
      row.join("\t") // Use tab separation for spreadsheet compatibility
    ).join("\n");

    navigator.clipboard.writeText(tableText).then(() => {
      // Could add a toast notification here
      console.log("Table copied to clipboard");
    }).catch(err => {
      console.error("Failed to copy table:", err);
    });
  };

  // const applyToSheet = () => {
  //   if (!selectedCell || !selectedCell.col || !selectedCell.row) {
  //     console.log('No cell selected in spreadsheet');
  //     return;
  //   }
  //
  //   try {
  //     // Get the starting position from the selected cell
  //     const startCol = selectedCell.col;
  //     const startRow = selectedCell.row;
  //
  //     // Insert the table data into the spreadsheet
  //     tableData.forEach((row, rowIndex) => {
  //       row.forEach((cellValue, colIndex) => {
  //         if (cellValue.trim() !== '') {
  //           // Calculate the target cell position
  //           const targetCol = String.fromCharCode(startCol.charCodeAt(0) + colIndex);
  //           const targetRow = startRow + rowIndex;
  //
  //           // Update the cell in the spreadsheet
  //           updateCell(targetCol, targetRow, cellValue);
  //         }
  //       });
  //     });
  //
  //     console.log('Table applied to sheet starting at:', startCol + startRow);
  //
  //     // TODO: Apply table styling based on tableStyle
  //     // This would involve setting cell styles, borders, etc.
  //
  //   } catch (error) {
  //     console.error('Failed to apply table to sheet:', error);
  //   }
  // };

  const getTableClassName = () => {
    const baseClass = "w-full border-collapse text-sm";
    switch (tableStyle) {
      case "minimal":
        return `${baseClass} table-minimal`;
      case "striped":
        return `${baseClass} table-striped`;
      case "bordered":
        return `${baseClass} table-bordered`;
      default:
        return baseClass;
    }
  };

  return (
    <div
      className={"relative border-l flex flex-col h-full bg-white border-gray-200 text-gray-900 dark:bg-gray-800 dark:border-gray-700 dark:text-white "}
      style={{ width: `${width}px` }}
    >
      {/* Resize Handle */}
      <div
        className="absolute left-0 top-0 bottom-0 w-1 cursor-ew-resize hover:bg-blue-500/50 group"
        onMouseDown={handleMouseDown}
      >
        <GripVertical
          size={16}
          className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 text-gray-400 group-hover:text-blue-500"
        />
      </div>

      {/* Header */}
      <div className={"p-4 border-b dark:border-gray-700 dark:bg-gray-900 border-gray-200 bg-gray-50"}>
        <h3 className="font-semibold text-lg">🏗️ Table Builder</h3>
        <p className={"text-sm text-gray-400 dark:text-gray-500"}>
          Click cells to edit • Drag to resize
        </p>
      </div>
      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">

        {/* Quick Size Buttons */}
        <div>
          <div className="text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">📏 Quick Sizes</div>
          <div className="flex gap-2 flex-wrap">
            {quickSizes.map(size => (
              <button
                key={size.label}
                onClick={() => setQuickSize(size.rows, size.cols)}
                className="px-3 py-1.5 text-xs rounded-md transition-colors bg-gray-100 hover:bg-gray-200 text-gray-700 dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-gray-200"
              >
                {size.label}
              </button>
            ))}
          </div>
        </div>

        {/* Style Options */}
        <div>
          <div className="text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">🎨 Style</div>
          <div className="grid grid-cols-2 gap-2">
            {styles.map(style => (
              <button
                key={style.id}
                onClick={() => setTableStyle(style.id)}
                className={`p-2 text-xs rounded-md border-2 transition-all ${
                  tableStyle === style.id
                    ? "border-blue-500 bg-blue-50 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
                    : "border-gray-200 bg-white hover:border-gray-300 text-gray-700 dark:border-gray-600 dark:bg-gray-700 dark:hover:border-gray-500 dark:text-gray-200"
                }`}
              >
                <div className="font-medium">{style.name}</div>
                <div className="font-mono text-gray-500 dark:text-gray-400">{style.preview}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Live Table Preview */}
        <div>
          <div className="text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">✨ Live Preview</div>
          <div className="border border-gray-200 rounded-lg p-3 overflow-auto bg-gray-50 dark:border-gray-600 dark:bg-gray-700">
            <table className={getTableClassName()}>
              <tbody>
              {tableData.map((row, rowIndex) => (
                <tr key={rowIndex} className="group">
                  {row.map((cell, colIndex) => (
                    <td
                      key={colIndex}
                      className={`border p-2 relative ${
                        rowIndex === 0
                          ? "bg-gray-100 font-medium dark:bg-gray-600"
                          : "bg-white dark:bg-gray-800"
                      } border-gray-200 dark:border-gray-600 ${
                        tableStyle === "striped" && rowIndex % 2 === 1 ? "bg-gray-50 dark:bg-gray-700" : ""
                      }`}
                    >
                      <input
                        type="text"
                        value={cell}
                        onChange={(e) => updateTableCell(rowIndex, colIndex, e.target.value)}
                        className="w-full bg-transparent outline-none rounded px-1 py-0.5 text-gray-900 focus:bg-yellow-50 focus:ring-1 focus:ring-yellow-300 dark:text-white dark:focus:bg-yellow-900 dark:focus:ring-yellow-600"
                        placeholder={rowIndex === 0 ? `Header ${colIndex + 1}` : "Data"}
                        onFocus={() => setSelectedCellBuilder({ row: rowIndex, col: colIndex })}
                      />
                      {/* Delete column button */}
                      {rowIndex === 0 && tableData[0].length > 1 && (
                        <button
                          onClick={() => removeColumn(colIndex)}
                          className="absolute -top-2 -right-2 w-4 h-4 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
                        >
                          <span className="text-xs">×</span>
                        </button>
                      )}
                    </td>
                  ))}
                  {/* Delete row button */}
                  {tableData.length > 1 && (
                    <td className="border-0 pl-2">
                      <button
                        onClick={() => removeRow(rowIndex)}
                        className="w-6 h-6 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
                      >
                        <Trash2 size={12} />
                      </button>
                    </td>
                  )}
                </tr>
              ))}
              </tbody>
            </table>

            {/* Add Row/Column Buttons */}
            <div className="flex gap-2 mt-3">
              <button
                onClick={addRow}
                className="flex items-center gap-1 px-3 py-1.5 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors text-sm"
              >
                <Plus size={14} />
                Row
              </button>
              <button
                onClick={addColumn}
                className="flex items-center gap-1 px-3 py-1.5 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors text-sm"
              >
                <Plus size={14} />
                Column
              </button>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div>
          <div className="text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">⚡ Quick Actions</div>
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={fillSampleData}
              className="px-3 py-2 rounded-md transition-colors text-sm bg-purple-100 text-purple-700 hover:bg-purple-200 dark:bg-purple-900 dark:text-purple-200 dark:hover:bg-purple-800"
            >
              📊 Sample Data
            </button>
            <button
              onClick={clearTable}
              className="px-3 py-2 rounded-md transition-colors text-sm bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600"
            >
              🗑️ Clear All
            </button>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-gray-200 bg-gray-50 dark:border-gray-700 dark:bg-gray-900">
        <div className="flex gap-2">
          <button
            className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
          >
            <Plus size={16} />
            Apply to Sheet
          </button>
          <button
            onClick={copyTable}
            className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
          >
            <Copy size={16} />
          </button>
        </div>
      </div>

      {/*<style jsx>{`*/}
      {/*    .table-minimal td, .table-minimal th {*/}
      {/*        border: none;*/}
      {/*        border-bottom: 1px solid ${isDark ? "#4b5563" : "#e5e7eb"};*/}
      {/*    }*/}

      {/*    .table-minimal th {*/}
      {/*        border-bottom: 2px solid ${isDark ? "#9ca3af" : "#374151"};*/}
      {/*    }*/}

      {/*    .table-striped tbody tr:nth-child(even) {*/}
      {/*        background-color: ${isDark ? "#374151" : "#f9fafb"};*/}
      {/*    }*/}

      {/*    .table-bordered {*/}
      {/*        border: 2px solid ${isDark ? "#9ca3af" : "#374151"};*/}
      {/*    }*/}

      {/*    .table-bordered td, .table-bordered th {*/}
      {/*        border: 1px solid ${isDark ? "#9ca3af" : "#374151"};*/}
      {/*    }*/}
      {/*`}</style>*/}
    </div>
  );
};

export default TableBuilder;
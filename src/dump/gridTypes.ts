// // Number of rows to render initially and when loading more
// import { CellDataBySheet } from "../Cell/cellTypes";
//
// const ROW_BATCH_SIZE = 20;
// // Number of rows to preload before reaching the bottom
// const PRELOAD_THRESHOLD = 5;
// // Column width in pixels (from ColumnHeader component)
// const COLUMN_WIDTH = 128; // w-32 = 128px
// // Row header width
// const ROW_HEADER_WIDTH = 40; // w-10 = 40px
//
// interface CellPosition {
//   col: string;
//   row: number;
// }
//
// interface ContextMenuState {
//   visible: boolean;
//   position: { x: number; y: number };
//   cellId: string | null;
// }
//
// interface GridProps {
//   workbookId: string;
//   workbookSheets: string[]
//   sheetData: CellDataBySheet;
//   isEditing: boolean;
//   onEditingChange: (isEditing: boolean) => void;
// }
//
// interface SpreadsheetContext {
//   selectedCell: CellPosition;
//   setSelectedCell: (cell: CellPosition) => void;
//   getActiveSheet: () => { columns: string[] };
//   getCell: (col: string, row: number) => { value?: string; formatted?: string; type?: string };
//   zoom: number;
//   addColumns: (count: number) => void;
//   setColumnCount: (count: number) => void;
//   getTotalColumns: () => number;
//   getColumnWidth: (col: string) => number;
//   updateColumnWidth: (col: string, width: number) => void;
// }
//
// interface SelectionContext {
//   startSelection: (col: string, row: number) => void;
//   updateSelection: (col: string, row: number) => void;
//   endSelection: () => void;
//   isSelected: (col: string, row: number) => boolean;
//   selectedCells: CellPosition[];
// }
//
// export type {
//   CellPosition,
//   ContextMenuState,
//   GridProps,
//   SpreadsheetContext,
//   SelectionContext
// };
//
// export {
//   ROW_BATCH_SIZE,
//   PRELOAD_THRESHOLD,
//   COLUMN_WIDTH,
//   ROW_HEADER_WIDTH
// };
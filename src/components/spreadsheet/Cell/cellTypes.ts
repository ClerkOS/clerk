// interface CellProps {
//   value: string;
//   type?: string;
//   isSelected: boolean;
//   isActiveCell: boolean;
//   isHighlighted: boolean;
//   onClick: (e: React.MouseEvent) => void;
//   onMouseEnter: () => void;
//   col: string;
//   row: number;
//   globalIsEditing: boolean;
//   onEditingChange: (isEditing: boolean) => void;
// }

interface CellProps {
  col: string,
  row: string,
  value?: string,
  formula?: string,
  style: ImportStyle
  workbookId: string
}

interface UseCellProps {
  col: string;
  row: string;
  value?: string;
  formula?: string;
  style: ImportStyle;
  workbookId: string;
  cellId: string;
  isActive: boolean;
  setActiveCellId: (cellId: string) => void;
}

// TODO: number format has specific types
interface CellData {
  value?: string;
  type?: string;
  formula?: string;
  style?: {
    fontBold?: boolean;
    fontItalic?: boolean;
    fontSize?: number;
    fontFamily?: string;
    fontColor?: string;
    backgroundColor?: string;
    alignment?: 'left' | 'center' | 'right';
    borderStyle?: 'thin' | 'medium' | 'thick';
    borderColor?: string;
    numberFormat?: string
  };
}

interface ImportStyle {
  fontBold?: boolean;
  fontItalic?: boolean;
  fontSize?: number;
  fontFamily?: string;
  fontColor?: string;
  backgroundColor?: string;
  alignment?: "left" | "center" | "right";
  borderStyle?: "thin" | "medium" | "thick";
  borderColor?: string;
  numberFormat?: string;
}

interface RenderStyle {
  fontFamily?: string;
  fontWeight?: string
  fontStyle?: string
  fontSize?: string;
  fontColor?: string;
  backgroundColor?: string;
  borderColor?: string;
  textAlign?: string // "left" | "center" | "right"
  borderStyle?: string
  borderWidth?: string // 1px | 2px | 3px
  numberFormat?: string;
}

// Map cell index to data (A1 -> { value: "Product", formula: "", style: { ... })
type SheetCells = Record<string, CellData>

// Map sheet to SheetCells (
// sheet1 -> {
//     "A1": { value: "Product", formula: "", style: { ... } },
//     "A2": { value: "Apples", formula: "", style: { ... } },
//     ...
//     }
type CellDataBySheet = Record<string, SheetCells>

// Other types that might be used in the application
// interface CellStyle {
//   fontBold?: boolean;
//   fontItalic?: boolean;
//   fontSize?: number;
//   fontFamily?: string;
//   fontColor?: string;
//   backgroundColor?: string;
//   alignment?: 'left' | 'center' | 'right';
//   borderStyle?: 'thin' | 'medium' | 'thick';
//   borderColor?: string;
// }

// interface CellPosition {
//   col: string;
//   row: number;
// }

export type { CellProps, UseCellProps, CellData, ImportStyle, RenderStyle, CellDataBySheet};
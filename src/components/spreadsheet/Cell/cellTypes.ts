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
  value?: string,
  formula?: string,
  col: string,
  row: string,
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
  };
}

interface CellData {
  value?: string;
  formatted?: string;
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
  };
}

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

export type { CellProps, CellData };
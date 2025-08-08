const CELL_WIDTH = 100;
const CELL_HEIGHT = 20;
const HEADER_HEIGHT = 20;
const HEADER_WIDTH = 40;
const TOTAL_ROWS = 100000;
const TOTAL_COLS = 1000;
const VIEWPORT_BUFFER = 3;

type GridProps = {
  workbookId: string;
  sheetName: string;
  initialCellMap: Map<string, CellData>
};

type CellStyle = {
  fontBold: boolean;
  fontItalic: boolean;
  fontSize: number;
  fontFamily: string;
  fontColor: string;
  backgroundColor: string;
  alignment: "left" | "center" | "right";
  borderStyle: string;
  borderColor: string;
  numberFormat: string;
};

const defaultStyle: CellStyle = {
  fontBold: false,
  fontItalic: false,
  fontSize: 11,
  fontFamily: "Calibri",
  fontColor: "#000000",
  backgroundColor: "#FFFFFF",
  alignment: "left",
  borderStyle: "",
  borderColor: "#000000",
  numberFormat: "General"
};

type CellData = {
  value: string;
  formula?: string;
  style?: CellStyle;
};

// TODO: move these to a more suitable file
// Map for a single sheet: "A1" -> CellData
type SheetCellMap = Map<string, CellData>;

// Map for all sheets: "Sheet1" -> SheetCellMap
type CellDataBySheet = Record<string, SheetCellMap>;
export {
  CELL_WIDTH,
  CELL_HEIGHT,
  HEADER_HEIGHT,
  HEADER_WIDTH,
  TOTAL_ROWS,
  TOTAL_COLS,
  VIEWPORT_BUFFER,
  CellStyle,
  defaultStyle,
  CellData,
  GridProps,
  CellDataBySheet
};
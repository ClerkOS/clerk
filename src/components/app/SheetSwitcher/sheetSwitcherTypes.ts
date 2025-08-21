
type Sheet = {
  id: string;
  name: string;
};

type DeleteConfirmation = {
  sheetId: string;
  sheetName: string;
} | null;

type DropdownPosition = 'top' | 'bottom';

type SheetSwitcherProps = {
  sheets: Sheet[];
  currentSheetId: string | null;
  setCurrentSheet: (id: string) => void;
  addSheet: () => Promise<void>;
  renameSheet: (id: string, name: string) => Promise<void>;
  deleteSheet: (id: string) => Promise<void>;
  isLoading: boolean;
  error: boolean;
};

export {Sheet, SheetSwitcherProps, DropdownPosition, DeleteConfirmation}
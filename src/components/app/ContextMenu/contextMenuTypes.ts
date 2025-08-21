
interface Position {
  x: number;
  y: number;
}

type AIAction = "analyze" | "formula" | "format" | "enhance";

interface ContextMenuProps {
  position: Position;
  onClose: () => void;
  onOpenAIWithRange: (params: { range: string; action: AIAction }) => void;
  isCell: boolean;
  selectedCells: string[];
  cellId?: string;
}


export {Position, AIAction, ContextMenuProps}
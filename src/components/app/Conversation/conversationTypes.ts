import * as crypto from "node:crypto";

export interface PendingAction {
  type: 'formula' | 'data' | 'calculation';
  data: any;
  description: string;
}

export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  pendingAction?: PendingAction;
  actionStatus?: 'pending' | 'applied' | 'declined';
}

export interface RangeSelection {
  range: string;
}

export interface TypeSuggestionCategory {
  category: string;
  prompts: string[];
}

export interface ConversationProps {
  onWidthChange?: (width: number) => void;
  selectedRange?: RangeSelection | null;
  setSelectedRange?: (range: RangeSelection | null) => void;
}

export interface SpreadsheetData {
  workbook_id?: string;
}

export interface TypeAnalysis {
  summary: {
    totalColumns: number;
    totalRows: number;
    isConsistent: boolean;
  };
  columns: Array<{
    header: string;
    dominantType: string;
    confidence: number;
  }>;
}

export const DATA_TYPES = {
  NUMBER: 'number',
  DATE: 'date',
  // Add other data types as needed
};

export interface TypeDetectionReturn {
  typeAnalysis: TypeAnalysis | null;
  isAnalyzing: boolean;
  aiContext: string;
  getTypeSuggestions: () => TypeSuggestionCategory[];
  DATA_TYPES: typeof DATA_TYPES;
}
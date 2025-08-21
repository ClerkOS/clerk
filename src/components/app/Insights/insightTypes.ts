export interface Message {
  id: number;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export interface RangeSelection {
  range: string;
}

export interface InsightProps {
  onWidthChange?: (width: number) => void;
  selectedRange?: RangeSelection | null;
  setSelectedRange?: (range: RangeSelection | null) => void;
}
import { Upload, Plus, FileText, FileUp, FileDown, AlertCircle, CheckCircle } from 'lucide-react';
import React from "react";

interface SpreadsheetProps {
  isPanelOpen?: boolean;
  panelWidth?: number;
  onOpenAIWithRange: (range: string) => void;
}

interface Notification {
  type: 'success' | 'error' | 'info' | 'warning';
  message: string;
  // icon: React.ReactNode;
}

// Other types that might be used in the application
// interface Sheet {
//   id: string;
//   name: string;
//   data: any[][];
// }

// interface CellPosition {
//   col: string;
//   row: number;
// }

// interface Column {
//   id: string;
//   width: number;
//   visible: boolean;
// }

export type { SpreadsheetProps, Notification };
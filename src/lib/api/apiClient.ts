import axios from "axios";
const BASE_URL =  "http://localhost:8080/api/v1";

export const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// TODO: Set up interceptors (e.g., for auth or logging)

export interface SetCellPayload {
  sheet: string;
  address: string;
  value: string;
  formula?: string;
  style?:{
    fontBold?: boolean;
    fontItalic?: boolean;
    fontSize?: number;
    fontFamily?: string;
    fontColor?: string;
    backgroundColor?: string;
    alignment?: 'left' | 'center' | 'right';
    borderStyle?: 'thin' | 'medium' | 'thick';
    borderColor?: string;
  }
}

export interface BatchSetCellPayload {
  sheet: string;
  edits: {
    address: string;
    value: string;
    formula?: string;
    style?: {};
  }[];
}

export async function setCell(workbookId: string, payload: SetCellPayload) {
  return api.post(`/cell/${workbookId}`, payload);
}

export async function batchSetCells(workbookId: string, payload: BatchSetCellPayload) {
  return api.post(`/cells/${workbookId}`, payload);
}

export async function getCell(workbookId: string, sheet: string, address: number) {
  return api.get(`/cell/${workbookId}/${sheet}/${address}`);
}


import axios from "axios";
const BASE_URL = process.env.VITE_API_BASE_URL || "http://localhost:8080/api/v1";
// const BASE_URL = "http://localhost:8080/api/v1";

export const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// TODO: Set up interceptors (e.g., for auth or logging)
// TODO: Create separate file for request types and interfaces


// Payload interface definitions
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


// Cell APIs
export async function setCell(workbookId: string, payload: SetCellPayload) {
  return api.post(`/cell/${workbookId}`, payload);
}

export async function batchSetCells(workbookId: string, payload: BatchSetCellPayload) {
  return api.post(`/cells/${workbookId}`, payload);
}

export async function getCell(workbookId: string, sheet: string, address: number) {
  return api.get(`/cell/${workbookId}/${sheet}/${address}`);
}

// Workbook APIs
export async function createWorkbook(){
  return api.post("/workbook/create")
}

export async function importWorkbook(file: File){
  const formData = new FormData()
  formData.append("file", file)

  return api.post("/workbook/import", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  })
}

export async function getWorkbook(workbookId: string){
  return api.get(`/workbook/${workbookId}`)
}

// Sheet APIs
export async function getSheets(workbookId: string){
  return api.get(`/sheet/list/${workbookId}`)
}

export async function getSheet(workbookId: string, sheetName: string){
  return api.get(`/sheet/get/${workbookId}/${sheetName}`)
}

export async function addSheet(workbookId: string, sheetName: string){
  return api.post(`/sheet/${workbookId}`, {sheetName})
}

// Conversation APIs
export async function getCompletion(workbookId: string, sheetName: string, prompt: string) {
  return api.post(`/completion/${workbookId}`, { sheetName, prompt });
}




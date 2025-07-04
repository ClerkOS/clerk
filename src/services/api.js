import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080';

const api = {
  // Cell operations
  editCell: async (workbookId, sheet, address, value) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/edit-cell`, {
        sheet: sheet,
        address: address,
        value: value
      });
      return response.data;
    } catch (error) {
      console.error('Error editing cell:', error);
      throw error;
    }
  },

  getCell: async (workbookId, sheet, address) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/get-cell?sheet=${sheet}&address=${address}`);
      return response.data;
    } catch (error) {
      console.error('Error getting cell:', error);
      throw error;
    }
  },

  // Workbook operations
  importWorkbook: async (file) => {
    try {
      const formData = new FormData();
      formData.append('file', file);
      const response = await axios.post(`${API_BASE_URL}/import`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error importing workbook:', error);
      throw error;
    }
  },

  exportWorkbook: async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/export`, {
        responseType: 'blob'
      });
      return response.data;
    } catch (error) {
      console.error('Error exporting workbook:', error);
      throw error;
    }
  },

  // Code generation
  generateCode: async (prompt, sheet) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/generate-code`, {
        prompt: prompt,
        sheet: sheet || 'Sheet1'
      });
      return response.data;
    } catch (error) {
      console.error('Error generating code:', error);
      throw error;
    }
  },

  // Sheet operations
  getSheets: async (workbookId) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/sheets`);
      return response.data;
    } catch (error) {
      console.error('Error getting sheets:', error);
      throw error;
    }
  },

  getSheet: async (workbookId, sheetName) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/sheet?name=${sheetName}`);
      return response.data;
    } catch (error) {
      console.error('Error getting sheet:', error);
      throw error;
    }
  },

  addSheet: async (workbookId, sheetName) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/sheet`, {
        name: sheetName
      });
      return response.data;
    } catch (error) {
      console.error('Error adding sheet:', error);
      throw error;
    }
  },

  deleteSheet: async (workbookId, sheetName) => {
    try {
      const response = await axios.delete(`${API_BASE_URL}/sheet?name=${sheetName}`);
      return response.data;
    } catch (error) {
      console.error('Error deleting sheet:', error);
      throw error;
    }
  },

  renameSheet: async (workbookId, oldName, newName) => {
    try {
      const response = await axios.put(`${API_BASE_URL}/rename-sheet`, {
        oldName: oldName,
        newName: newName
      });
      return response.data;
    } catch (error) {
      console.error('Error renaming sheet:', error);
      throw error;
    }
  },

  // Workbook metadata
  getWorkbook: async (workbookId) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/workbook`);
      return response.data;
    } catch (error) {
      console.error('Error getting workbook:', error);
      throw error;
    }
  },

  // Cell range operations
  getCellRange: async (workbookId, sheetName, range) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/range?sheet=${sheetName}&range=${range}`);
      return response.data;
    } catch (error) {
      console.error('Error getting cell range:', error);
      throw error;
    }
  },

  setCellRange: async (workbookId, sheetName, range, data) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/range`, {
        sheet: sheetName,
        range: range,
        data: data
      });
      return response.data;
    } catch (error) {
      console.error('Error setting cell range:', error);
      throw error;
    }
  },

  // Styling operations
  getCellWithStyle: async (workbookId, sheetName, address) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/cell-with-style?sheet=${sheetName}&address=${address}`);
      return response.data;
    } catch (error) {
      console.error('Error getting cell with style:', error);
      throw error;
    }
  },

  setCellWithStyle: async (workbookId, sheetName, address, value, formula, style) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/cell-with-style`, {
        sheet: sheetName,
        address: address,
        value: value,
        formula: formula,
        style: style
      });
      return response.data;
    } catch (error) {
      console.error('Error setting cell with style:', error);
      throw error;
    }
  },

  copyStyles: async (workbookId, sheetName, fromCell, toCell) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/copy-styles`, {
        sheet: sheetName,
        fromCell: fromCell,
        toCell: toCell
      });
      return response.data;
    } catch (error) {
      console.error('Error copying styles:', error);
      throw error;
    }
  },

  applyConditionalFormatting: async (workbookId, sheetName, range, format) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/conditional-formatting`, {
        sheet: sheetName,
        range: range,
        format: format
      });
      return response.data;
    } catch (error) {
      console.error('Error applying conditional formatting:', error);
      throw error;
    }
  },

  // Named range operations
  addNamedRange: async (workbookId, name, range, sheetName) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/named-range`, {
        name: name,
        range: range,
        sheet: sheetName
      });
      return response.data;
    } catch (error) {
      console.error('Error adding named range:', error);
      throw error;
    }
  },

  getNamedRanges: async (workbookId) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/named-ranges`);
      return response.data;
    } catch (error) {
      console.error('Error getting named ranges:', error);
      throw error;
    }
  },

  deleteNamedRange: async (workbookId, name) => {
    try {
      const response = await axios.delete(`${API_BASE_URL}/named-range?name=${name}`);
      return response.data;
    } catch (error) {
      console.error('Error deleting named range:', error);
      throw error;
    }
  }
};

export default api; 
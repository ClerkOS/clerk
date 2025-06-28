import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/api/v1';

const api = {
  // Cell operations
  editCell: async (workbookId, sheet, address, value) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/cell/${workbookId}`, {
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
      const response = await axios.get(`${API_BASE_URL}/cell/${workbookId}/${sheet}/${address}`);
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
      const response = await axios.post(`${API_BASE_URL}/workbook/import`, formData, {
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
      const response = await axios.get(`${API_BASE_URL}/workbook/export`, {
        responseType: 'blob'
      });
      return response.data;
    } catch (error) {
      console.error('Error exporting workbook:', error);
      throw error;
    }
  },

  // AI operations
  nl2formula: async (workbookId, naturalLanguage) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/natlang/nl2f/${workbookId}`, {
        prompt: naturalLanguage
      });
      return response.data;
    } catch (error) {
      console.error('Error converting natural language to formula:', error);
      throw error;
    }
  },

  // Sheet operations
  listSheets: async (workbookId) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/sheet/list/${workbookId}`);
      return response.data;
    } catch (error) {
      console.error('Error listing sheets:', error);
      throw error;
    }
  },

  getSheet: async (workbookId, sheetName) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/sheet/get/${workbookId}/${sheetName}`);
      return response.data;
    } catch (error) {
      console.error('Error getting sheet:', error);
      throw error;
    }
  }
};

export default api; 
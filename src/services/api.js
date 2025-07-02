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
  }
};

export default api; 
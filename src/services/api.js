import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080';

const api = {
  // Cell operations
  editCell: async (cellId, value) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/edit-cell`, {
        cell_id: cellId,
        value: value
      });
      return response.data;
    } catch (error) {
      console.error('Error editing cell:', error);
      throw error;
    }
  },

  getCell: async (cellId) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/get-cell`, {
        params: { cell_id: cellId }
      });
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

  // AI operations
  nl2formula: async (naturalLanguage) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/nl2formula`, {
        query: naturalLanguage
      });
      return response.data;
    } catch (error) {
      console.error('Error converting natural language to formula:', error);
      throw error;
    }
  }
};

export default api; 
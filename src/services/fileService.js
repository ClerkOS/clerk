import { useSpreadsheet } from '../context/SpreadsheetContext';

export const handleFileUpload = async (file) => {
  const { updateCell } = useSpreadsheet();
  
  try {
    if (file.type === 'text/csv') {
      return await handleCSVUpload(file);
    } else if (file.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' || 
               file.type === 'application/vnd.ms-excel') {
      return await handleExcelUpload(file);
    } else {
      throw new Error('Unsupported file type');
    }
  } catch (error) {
    console.error('Error uploading file:', error);
    throw error;
  }
};

const handleCSVUpload = async (file) => {
  const text = await file.text();
  const rows = text.split('\n').map(row => row.split(','));
  
  // Start from cell A1
  let currentRow = 1;
  rows.forEach((row, rowIndex) => {
    row.forEach((cell, colIndex) => {
      const cellId = `${String.fromCharCode(65 + colIndex)}${currentRow}`;
      updateCell(cellId, cell.trim());
    });
    currentRow++;
  });
};

const handleExcelUpload = async (file) => {
  // TODO: Implement Excel file handling
  // This will require a library like SheetJS (xlsx) to parse Excel files
  throw new Error('Excel upload not implemented yet');
};

export const validateFile = (file) => {
  const validTypes = [
    'text/csv',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'application/vnd.ms-excel'
  ];
  
  if (!validTypes.includes(file.type)) {
    throw new Error('Invalid file type. Please upload a CSV or Excel file.');
  }
  
  if (file.size > 10 * 1024 * 1024) { // 10MB limit
    throw new Error('File size too large. Maximum size is 10MB.');
  }
  
  return true;
}; 
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import api from '../services/api';

// Query keys for React Query
export const queryKeys = {
  cell: (cellId) => ['cell', cellId],
  cells: () => ['cells'],
  workbook: () => ['workbook'],
  sheets: (workbookId) => ['sheets', workbookId],
  sheet: (workbookId, sheetName) => ['sheet', workbookId, sheetName],
};

// Hook for getting a single cell
export const useCell = (cellId, options = {}) => {
  return useQuery({
    queryKey: queryKeys.cell(cellId),
    queryFn: () => api.getCell(null, 'Sheet1', cellId),
    ...options,
  });
};

// Hook for editing a cell
export const useEditCell = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ workbookId, sheet, address, value }) => 
      api.editCell(workbookId, sheet, address, value),
    onSuccess: (data, variables) => {
      // Invalidate related queries
      queryClient.invalidateQueries({ queryKey: queryKeys.cell(variables.address) });
      queryClient.invalidateQueries({ queryKey: queryKeys.cells() });
    },
  });
};

// Hook for batch cell updates
export const useBatchCellUpdate = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ workbookId, sheet, edits }) => {
      // For now, we'll make individual calls for each edit
      // In the future, this could be optimized to use a batch endpoint
      const promises = edits.map(edit => 
        api.editCell(workbookId, sheet, edit.address, edit.value)
      );
      return Promise.all(promises);
    },
    onSuccess: () => {
      // Invalidate all cell-related queries
      queryClient.invalidateQueries({ queryKey: queryKeys.cells() });
    },
  });
};

// Hook for importing workbooks
export const useImportWorkbook = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (file) => api.importWorkbook(file),
    onSuccess: () => {
      // Invalidate all workbook-related queries
      queryClient.invalidateQueries({ queryKey: queryKeys.workbook() });
      queryClient.invalidateQueries({ queryKey: queryKeys.sheets() });
      queryClient.invalidateQueries({ queryKey: queryKeys.cells() });
      
      // Also invalidate all individual cell queries to force refresh
      queryClient.invalidateQueries({ 
        predicate: (query) => query.queryKey[0] === 'cell' 
      });
    },
  });
};

// Hook for exporting workbooks
export const useExportWorkbook = () => {
  return useMutation({
    mutationFn: () => api.exportWorkbook(),
  });
};

// Hook for natural language to formula conversion
export const useNl2Formula = () => {
  return useMutation({
    mutationFn: (query) => api.generateCode(query, 'Sheet1'),
  });
};

// Hook for getting sheets
export const useSheets = (workbookId, options = {}) => {
  return useQuery({
    queryKey: queryKeys.sheets(workbookId),
    queryFn: () => api.getSheets(workbookId),
    enabled: !!workbookId,
    ...options,
  });
};

// Hook for getting a specific sheet
export const useSheet = (workbookId, sheetName, options = {}) => {
  return useQuery({
    queryKey: queryKeys.sheet(workbookId, sheetName),
    queryFn: () => api.getSheet(workbookId, sheetName),
    enabled: !!workbookId && !!sheetName,
    ...options,
  });
};

// Hook for adding a new sheet
export const useAddSheet = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ workbookId, sheetName }) => api.addSheet(workbookId, sheetName),
    onSuccess: (data, variables) => {
      // Invalidate sheets query
      queryClient.invalidateQueries({ queryKey: queryKeys.sheets(variables.workbookId) });
    },
  });
};

// Hook for deleting a sheet
export const useDeleteSheet = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ workbookId, sheetName }) => api.deleteSheet(workbookId, sheetName),
    onSuccess: (data, variables) => {
      // Invalidate sheets query
      queryClient.invalidateQueries({ queryKey: queryKeys.sheets(variables.workbookId) });
    },
  });
};

// Hook for renaming a sheet
export const useRenameSheet = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ workbookId, oldName, newName }) => 
      api.renameSheet(workbookId, oldName, newName),
    onSuccess: (data, variables) => {
      // Invalidate sheets query
      queryClient.invalidateQueries({ queryKey: queryKeys.sheets(variables.workbookId) });
    },
  });
};

// Hook for getting workbook metadata
export const useWorkbook = (workbookId, options = {}) => {
  return useQuery({
    queryKey: queryKeys.workbook(workbookId),
    queryFn: () => api.getWorkbook(workbookId),
    enabled: !!workbookId,
    ...options,
  });
};

// Hook for getting cell range
export const useCellRange = (workbookId, sheetName, range, options = {}) => {
  return useQuery({
    queryKey: ['cellRange', workbookId, sheetName, range],
    queryFn: () => api.getCellRange(workbookId, sheetName, range),
    enabled: !!workbookId && !!sheetName && !!range,
    ...options,
  });
};

// Hook for setting cell range
export const useSetCellRange = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ workbookId, sheetName, range, data }) => 
      api.setCellRange(workbookId, sheetName, range, data),
    onSuccess: (data, variables) => {
      // Invalidate related queries
      queryClient.invalidateQueries({ queryKey: queryKeys.cells() });
      queryClient.invalidateQueries({ 
        queryKey: ['cellRange', variables.workbookId, variables.sheetName, variables.range] 
      });
    },
  });
};

// Hook for getting cell with styling
export const useCellWithStyle = (workbookId, sheetName, address, options = {}) => {
  return useQuery({
    queryKey: ['cellWithStyle', workbookId, sheetName, address],
    queryFn: () => api.getCellWithStyle(workbookId, sheetName, address),
    enabled: !!workbookId && !!sheetName && !!address,
    ...options,
  });
};

// Hook for setting cell with styling
export const useSetCellWithStyle = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ workbookId, sheetName, address, value, formula, style }) => 
      api.setCellWithStyle(workbookId, sheetName, address, value, formula, style),
    onSuccess: (data, variables) => {
      // Invalidate related queries
      queryClient.invalidateQueries({ queryKey: queryKeys.cell(variables.address) });
      queryClient.invalidateQueries({ 
        queryKey: ['cellWithStyle', variables.workbookId, variables.sheetName, variables.address] 
      });
    },
  });
};

// Hook for copying styles between cells
export const useCopyStyles = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ workbookId, sheetName, fromCell, toCell }) => 
      api.copyStyles(workbookId, sheetName, fromCell, toCell),
    onSuccess: (data, variables) => {
      // Invalidate related queries
      queryClient.invalidateQueries({ 
        queryKey: ['cellWithStyle', variables.workbookId, variables.sheetName, variables.toCell] 
      });
    },
  });
};

// Hook for applying conditional formatting
export const useConditionalFormatting = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ workbookId, sheetName, range, format }) => 
      api.applyConditionalFormatting(workbookId, sheetName, range, format),
    onSuccess: (data, variables) => {
      // Invalidate related queries
      queryClient.invalidateQueries({ queryKey: queryKeys.cells() });
    },
  });
};

// Hook for adding named ranges
export const useAddNamedRange = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ workbookId, name, range, sheetName }) => 
      api.addNamedRange(workbookId, name, range, sheetName),
    onSuccess: (data, variables) => {
      // Invalidate related queries
      queryClient.invalidateQueries({ queryKey: queryKeys.workbook() });
    },
  });
};

// Hook for getting named ranges
export const useNamedRanges = (workbookId, options = {}) => {
  return useQuery({
    queryKey: ['namedRanges', workbookId],
    queryFn: () => api.getNamedRanges(workbookId),
    enabled: !!workbookId,
    ...options,
  });
};

// Hook for deleting named ranges
export const useDeleteNamedRange = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ workbookId, name }) => api.deleteNamedRange(workbookId, name),
    onSuccess: (data, variables) => {
      // Invalidate related queries
      queryClient.invalidateQueries({ queryKey: ['namedRanges', variables.workbookId] });
    },
  });
}; 
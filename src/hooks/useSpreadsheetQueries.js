import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../services/api';

// Query keys for better cache management
export const queryKeys = {
  cell: (workbookId, sheet, address) => ['cell', workbookId, sheet, address],
  cells: () => ['cells'],
  workbook: () => ['workbook'],
  formulas: () => ['formulas'],
  sheets: (workbookId) => ['sheets', workbookId],
};

// Hook for fetching a single cell
export const useCell = (workbookId, sheet, address) => {
  return useQuery({
    queryKey: queryKeys.cell(workbookId, sheet, address),
    queryFn: () => api.getCell(workbookId, sheet, address),
    enabled: !!workbookId && !!sheet && !!address,
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
};

// Hook for editing a cell
export const useEditCell = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ workbookId, sheet, address, value }) => api.editCell(workbookId, sheet, address, value),
    onSuccess: (data, { workbookId, sheet, address }) => {
      // Update the specific cell in cache
      queryClient.setQueryData(queryKeys.cell(workbookId, sheet, address), data);
      
      // Invalidate cells list to refresh any list views
      queryClient.invalidateQueries({ queryKey: queryKeys.cells() });
    },
    onError: (error) => {
      console.error('Error editing cell:', error);
    },
  });
};

// Hook for importing workbook
export const useImportWorkbook = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (file) => api.importWorkbook(file),
    onSuccess: () => {
      // Invalidate all cell-related queries after import
      queryClient.invalidateQueries({ queryKey: queryKeys.cells() });
      queryClient.invalidateQueries({ queryKey: queryKeys.workbook() });
    },
    onError: (error) => {
      console.error('Error importing workbook:', error);
    },
  });
};

// Hook for exporting workbook
export const useExportWorkbook = () => {
  return useMutation({
    mutationFn: () => api.exportWorkbook(),
    onError: (error) => {
      console.error('Error exporting workbook:', error);
    },
  });
};

// Hook for natural language to formula conversion
export const useNl2Formula = () => {
  return useMutation({
    mutationFn: ({ workbookId, naturalLanguage }) => api.nl2formula(workbookId, naturalLanguage),
    onError: (error) => {
      console.error('Error converting natural language to formula:', error);
    },
  });
};

// Hook for batch cell operations (if needed in the future)
export const useBatchCellUpdate = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (updates) => Promise.all(
      updates.map(({ workbookId, sheet, address, value }) => api.editCell(workbookId, sheet, address, value))
    ),
    onSuccess: (results, updates) => {
      // Update each cell in cache
      updates.forEach(({ workbookId, sheet, address }, index) => {
        if (results[index]) {
          queryClient.setQueryData(queryKeys.cell(workbookId, sheet, address), results[index]);
        }
      });
      
      // Invalidate cells list
      queryClient.invalidateQueries({ queryKey: queryKeys.cells() });
    },
    onError: (error) => {
      console.error('Error in batch cell update:', error);
    },
  });
};

// Hook for prefetching cells (useful for performance)
export const usePrefetchCell = () => {
  const queryClient = useQueryClient();
  
  return (workbookId, sheet, address) => {
    queryClient.prefetchQuery({
      queryKey: queryKeys.cell(workbookId, sheet, address),
      queryFn: () => api.getCell(workbookId, sheet, address),
      staleTime: 2 * 60 * 1000,
    });
  };
};

// Hook for fetching sheets
export const useSheets = (workbookId) => {
  return useQuery({
    queryKey: queryKeys.sheets(workbookId),
    queryFn: () => api.listSheets(workbookId),
    enabled: !!workbookId,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}; 
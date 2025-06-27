import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../services/api';

// Query keys for better cache management
export const queryKeys = {
  cell: (cellId) => ['cell', cellId],
  cells: () => ['cells'],
  workbook: () => ['workbook'],
  formulas: () => ['formulas'],
};

// Hook for fetching a single cell
export const useCell = (cellId) => {
  return useQuery({
    queryKey: queryKeys.cell(cellId),
    queryFn: () => api.getCell(cellId),
    enabled: !!cellId,
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
};

// Hook for editing a cell
export const useEditCell = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ cellId, value }) => api.editCell(cellId, value),
    onSuccess: (data, { cellId }) => {
      // Update the specific cell in cache
      queryClient.setQueryData(queryKeys.cell(cellId), data);
      
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
    mutationFn: (naturalLanguage) => api.nl2formula(naturalLanguage),
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
      updates.map(({ cellId, value }) => api.editCell(cellId, value))
    ),
    onSuccess: (results, updates) => {
      // Update each cell in cache
      updates.forEach(({ cellId }, index) => {
        if (results[index]) {
          queryClient.setQueryData(queryKeys.cell(cellId), results[index]);
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
  
  return (cellId) => {
    queryClient.prefetchQuery({
      queryKey: queryKeys.cell(cellId),
      queryFn: () => api.getCell(cellId),
      staleTime: 2 * 60 * 1000,
    });
  };
}; 
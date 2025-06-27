import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useImportWorkbook, useExportWorkbook, queryKeys } from './useSpreadsheetQueries';

export const useWorkbookOperations = () => {
  const queryClient = useQueryClient();
  const importWorkbookMutation = useImportWorkbook();
  const exportWorkbookMutation = useExportWorkbook();

  const importWorkbook = async (file) => {
    try {
      const result = await importWorkbookMutation.mutateAsync(file);
      
      // Invalidate all related queries after successful import
      queryClient.invalidateQueries({ queryKey: queryKeys.cells() });
      queryClient.invalidateQueries({ queryKey: queryKeys.workbook() });
      
      return result;
    } catch (error) {
      console.error('Import failed:', error);
      throw error;
    }
  };

  const exportWorkbook = async () => {
    try {
      const blob = await exportWorkbookMutation.mutateAsync();
      
      // Create download link
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `workbook-${new Date().toISOString().split('T')[0]}.xlsx`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      
      return blob;
    } catch (error) {
      console.error('Export failed:', error);
      throw error;
    }
  };

  return {
    importWorkbook,
    exportWorkbook,
    isImporting: importWorkbookMutation.isPending,
    isExporting: exportWorkbookMutation.isPending,
    importError: importWorkbookMutation.error,
    exportError: exportWorkbookMutation.error,
  };
}; 
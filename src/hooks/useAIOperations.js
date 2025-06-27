import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useNl2Formula, queryKeys } from './useSpreadsheetQueries';

export const useAIOperations = () => {
  const queryClient = useQueryClient();
  const nl2formulaMutation = useNl2Formula();

  const convertToFormula = async (naturalLanguage) => {
    try {
      const result = await nl2formulaMutation.mutateAsync(naturalLanguage);
      
      // Cache the result for potential reuse
      queryClient.setQueryData(
        ['ai', 'nl2formula', naturalLanguage.toLowerCase()],
        result
      );
      
      return result;
    } catch (error) {
      console.error('AI conversion failed:', error);
      throw error;
    }
  };

  const getFormulaSuggestions = async (partialQuery) => {
    // This could be expanded to use a different API endpoint for suggestions
    // For now, we'll use the same nl2formula endpoint with partial queries
    try {
      const result = await nl2formulaMutation.mutateAsync(partialQuery);
      return result;
    } catch (error) {
      console.error('Formula suggestions failed:', error);
      throw error;
    }
  };

  return {
    convertToFormula,
    getFormulaSuggestions,
    isConverting: nl2formulaMutation.isPending,
    conversionError: nl2formulaMutation.error,
    lastResult: nl2formulaMutation.data,
  };
}; 
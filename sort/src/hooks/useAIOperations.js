// import { useMutation, useQueryClient } from '@tanstack/react-query';
// import lib from '../services/lib.js';
//
// // Hook for AI-powered natural language to formula conversion
// export const useAIOperations = () => {
//   const queryClient = useQueryClient();
//
//   const convertToFormulaMutation = useMutation({
//     mutationFn: (query) => lib.generateCode(query, 'Sheet1'),
//     onSuccess: (data) => {
//       // Optionally invalidate related queries if needed
//       console.log('AI operation completed:', data);
//     },
//   });
//
//   const convertToFormula = async (query) => {
//     try {
//       const result = await convertToFormulaMutation.mutateAsync(query);
//       return result;
//     } catch (error) {
//       console.error('AI operation failed:', error);
//       throw error;
//     }
//   };
//
//   return {
//     convertToFormula,
//     isConverting: convertToFormulaMutation.isPending,
//     lastResult: convertToFormulaMutation.data,
//     error: convertToFormulaMutation.error,
//   };
// };
//
// // Hook for AI-powered code generation
// export const useAICodeGeneration = () => {
//   const queryClient = useQueryClient();
//
//   const generateCodeMutation = useMutation({
//     mutationFn: ({ prompt, sheet }) => lib.generateCode(prompt, sheet),
//     onSuccess: (data) => {
//       // Optionally invalidate related queries if needed
//       console.log('Code generation completed:', data);
//     },
//   });
//
//   const generateCode = async (prompt, sheet = 'Sheet1') => {
//     try {
//       const result = await generateCodeMutation.mutateAsync({ prompt, sheet });
//       return result;
//     } catch (error) {
//       console.error('Code generation failed:', error);
//       throw error;
//     }
//   };
//
//   return {
//     generateCode,
//     isGenerating: generateCodeMutation.isPending,
//     lastResult: generateCodeMutation.data,
//     error: generateCodeMutation.error,
//   };
// };
//
// // Hook for AI-powered data analysis
// export const useAIDataAnalysis = () => {
//   const queryClient = useQueryClient();
//
//   const analyzeDataMutation = useMutation({
//     mutationFn: ({ range, analysisType, sheet }) =>
//       lib.generateCode(`Analyze the data in range ${range} for ${analysisType}`, sheet),
//     onSuccess: (data) => {
//       console.log('Data analysis completed:', data);
//     },
//   });
//
//   const analyzeData = async (range, analysisType, sheet = 'Sheet1') => {
//     try {
//       const result = await analyzeDataMutation.mutateAsync({ range, analysisType, sheet });
//       return result;
//     } catch (error) {
//       console.error('Data analysis failed:', error);
//       throw error;
//     }
//   };
//
//   return {
//     analyzeData,
//     isAnalyzing: analyzeDataMutation.isPending,
//     lastResult: analyzeDataMutation.data,
//     error: analyzeDataMutation.error,
//   };
// };
//
// // Hook for AI-powered formatting suggestions
// export const useAIFormatting = () => {
//   const queryClient = useQueryClient();
//
//   const suggestFormattingMutation = useMutation({
//     mutationFn: ({ range, context, sheet }) =>
//       lib.generateCode(`Suggest formatting for range ${range} with context: ${context}`, sheet),
//     onSuccess: (data) => {
//       console.log('Formatting suggestion completed:', data);
//     },
//   });
//
//   const suggestFormatting = async (range, context, sheet = 'Sheet1') => {
//     try {
//       const result = await suggestFormattingMutation.mutateAsync({ range, context, sheet });
//       return result;
//     } catch (error) {
//       console.error('Formatting suggestion failed:', error);
//       throw error;
//     }
//   };
//
//   return {
//     suggestFormatting,
//     isSuggesting: suggestFormattingMutation.isPending,
//     lastResult: suggestFormattingMutation.data,
//     error: suggestFormattingMutation.error,
//   };
// };
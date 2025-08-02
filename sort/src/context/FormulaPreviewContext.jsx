// import React, { createContext, useContext, useState, useCallback } from 'react';
//
// const FormulaPreviewContext = createContext(null);
//
// export const FormulaPreviewProvider = ({ children }) => {
//   const [previewFormula, setPreviewFormula] = useState('');
//   const [previewTarget, setPreviewTarget] = useState('');
//   const [previewResult, setPreviewResult] = useState('');
//
//   const setPreview = useCallback((formula, target, result) => {
//     setPreviewFormula(formula);
//     setPreviewTarget(target);
//     setPreviewResult(result);
//   }, []);
//
//   const clearPreview = useCallback(() => {
//     setPreviewFormula('');
//     setPreviewTarget('');
//     setPreviewResult('');
//   }, []);
//
//   return (
//     <FormulaPreviewContext.Provider
//       value={{
//         previewFormula,
//         previewTarget,
//         previewResult,
//         setPreview,
//         clearPreview
//       }}
//     >
//       {children}
//     </FormulaPreviewContext.Provider>
//   );
// };
//
// export const useFormulaPreview = () => {
//   const context = useContext(FormulaPreviewContext);
//   if (!context) {
//     throw new Error('useFormulaPreview must be used within a FormulaPreviewProvider');
//   }
//   return context;
// };
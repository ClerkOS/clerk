// import { useState, useRef, useEffect, useCallback } from 'react';
// import {
//   Message,
//   RangeSelection,
//   SpreadsheetData,
//   TypeAnalysis,
//   TypeDetectionReturn,
//   TypeSuggestionCategory,
//   DATA_TYPES
// } from './conversationTypes';
//
// // Mock implementation of useTypeDetection
// export const useTypeDetection = (data: SpreadsheetData, range: RangeSelection | null | undefined): TypeDetectionReturn => {
//   return {
//     typeAnalysis: null,
//     isAnalyzing: false,
//     aiContext: '',
//     getTypeSuggestions: (): TypeSuggestionCategory[] => [],
//     DATA_TYPES
//   };
// };
//
// export const useConversation = (props: {
//   selectedRange?: RangeSelection | null;
//   setSelectedRange?: (range: RangeSelection | null) => void;
//   spreadsheetData: SpreadsheetData;
// }) => {
//   const { selectedRange, setSelectedRange, spreadsheetData } = props;
//   const {
//     typeAnalysis,
//     isAnalyzing,
//     aiContext,
//     getTypeSuggestions,
//     DATA_TYPES
//   } = useTypeDetection(spreadsheetData, selectedRange);
//
//   const [width, setWidth] = useState<number>(320);
//   const [messages, setMessages] = useState<Message[]>([
//     {
//       id: 1,
//       role: "assistant",
//       content: "Hello! I'm your personal spreadsheet assistant. I can manipulate your spreadsheet based on your natural language requests. Please import a spreadsheet file first to get started!",
//       timestamp: new Date()
//     }
//   ]);
//   const [input, setInput] = useState<string>('');
//   const [isGenerating, setIsGenerating] = useState<boolean>(false);
//   const [showSuggestions, setShowSuggestions] = useState<boolean>(false);
//   const messagesEndRef = useRef<HTMLDivElement>(null);
//
//   const isResizing = useRef<boolean>(false);
//   const startX = useRef<number>(0);
//   const startWidth = useRef<number>(0);
//
//   const handleMouseDown = (e: React.MouseEvent) => {
//     isResizing.current = true;
//     startX.current = e.clientX;
//     startWidth.current = width;
//     document.body.style.cursor = 'ew-resize';
//     document.body.style.userSelect = 'none';
//   };
//
//   const handleMouseMove = useCallback((e: MouseEvent) => {
//     if (!isResizing.current) return;
//     const delta = startX.current - e.clientX;
//     const newWidth = Math.min(Math.max(startWidth.current + delta, 280), 500);
//     setWidth(newWidth);
//   }, []);
//
//   const handleMouseUp = useCallback(() => {
//     isResizing.current = false;
//     document.body.style.cursor = '';
//     document.body.style.userSelect = '';
//   }, []);
//
//   useEffect(() => {
//     document.addEventListener('mousemove', handleMouseMove);
//     document.addEventListener('mouseup', handleMouseUp);
//     return () => {
//       document.removeEventListener('mousemove', handleMouseMove);
//       document.removeEventListener('mouseup', handleMouseUp);
//     };
//   }, [handleMouseMove, handleMouseUp]);
//
//   const scrollToBottom = useCallback(() => {
//     messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
//   }, []);
//
//   useEffect(() => {
//     scrollToBottom();
//   }, [messages, scrollToBottom]);
//
//   useEffect(() => {
//     if (selectedRange && spreadsheetData.workbook_id) {
//       let rangeMessage = `I can see you've selected range: **${selectedRange.range}**\n\n`;
//
//       if (typeAnalysis && !isAnalyzing) {
//         rangeMessage += `**Data Analysis:**\n`;
//         rangeMessage += `- ${typeAnalysis.summary.totalColumns} columns, ${typeAnalysis.summary.totalRows} rows\n`;
//         rangeMessage += `- Data consistency: ${typeAnalysis.summary.isConsistent ? 'High' : 'Mixed'}\n\n`;
//
//         rangeMessage += `**Column Types:**\n`;
//         typeAnalysis.columns.forEach(col => {
//           rangeMessage += `- ${col.header}: ${col.dominantType} (${Math.round(col.confidence * 100)}% confidence)\n`;
//         });
//         rangeMessage += `\n`;
//       }
//
//       rangeMessage += `What would you like me to do with this data? I can generate Go code to:\n• Manipulate cell values and formulas\n• Apply formatting and styles\n• Create charts and visualizations\n• Perform data analysis\n• Import/export data`;
//
//       const rangeMessageObj: Message = {
//         id: messages.length + 1,
//         role: 'assistant',
//         content: rangeMessage,
//         timestamp: new Date()
//       };
//       setMessages(prev => [...prev, rangeMessageObj]);
//
//       if (typeAnalysis && typeAnalysis.columns.length > 0) {
//         const firstCol = typeAnalysis.columns[0];
//         if (firstCol.dominantType === DATA_TYPES.NUMBER) {
//           setInput(`Calculate the sum of ${firstCol.header}`);
//         } else if (firstCol.dominantType === DATA_TYPES.DATE) {
//           setInput(`Group data by month from ${firstCol.header}`);
//         } else {
//           setInput(`Analyze the data in ${firstCol.header}`);
//         }
//       } else {
//         setInput(`Manipulate the data in ${selectedRange.range}`);
//       }
//     } else if (selectedRange && !spreadsheetData.workbook_id) {
//       const rangeMessage: Message = {
//         id: messages.length + 1,
//         role: 'assistant',
//         content: `I can see you've selected range: **${selectedRange.range}**, but I need a workbook to work with this data. Please import a spreadsheet file first!`,
//         timestamp: new Date()
//       };
//       setMessages(prev => [...prev, rangeMessage]);
//     }
//   }, [selectedRange, spreadsheetData.workbook_id, typeAnalysis, isAnalyzing, messages.length]);
//
//   const generateCode = useCallback(async (prompt: string) => {
//     try {
//       let enhancedPrompt = prompt;
//       if (aiContext) {
//         enhancedPrompt = `Context:\n${aiContext}\n\nUser Request: ${prompt}`;
//       }
//
//       const response = await fetch('http://localhost:8080/generate-code', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({
//           prompt: enhancedPrompt,
//           sheet: 'Sheet1'
//         }),
//       });
//
//       if (!response.ok) {
//         throw new Error(`HTTP error! status: ${response.status}`);
//       }
//
//       return await response.json();
//     } catch (error) {
//       console.error('Code generation failed:', error);
//       throw error;
//     }
//   }, [aiContext]);
//
//   const handleSubmit = useCallback(async (e: React.FormEvent) => {
//     e.preventDefault();
//     if (!input.trim() || isGenerating) return;
//
//     if (!spreadsheetData.workbook_id) {
//       const errorMessage: Message = {
//         id: messages.length + 2,
//         role: 'assistant',
//         content: 'I need a workbook to work with! Please import a spreadsheet file first using the import button in the sidebar.',
//         timestamp: new Date()
//       };
//       setMessages(prev => [...prev, {
//         id: messages.length + 1,
//         role: 'user',
//         content: input,
//         timestamp: new Date()
//       }, errorMessage]);
//       setInput('');
//       return;
//     }
//
//     const userMessage: Message = {
//       id: messages.length + 1,
//       role: 'user',
//       content: input,
//       timestamp: new Date()
//     };
//
//     setMessages(prev => [...prev, userMessage]);
//     setInput('');
//     setIsGenerating(true);
//
//     try {
//       const result = await generateCode(input);
//
//       const aiResponse: Message = {
//         id: messages.length + 2,
//         role: 'assistant',
//         content: `**Generated Code:**\n\`\`\`go\n${result.generatedCode}\n\`\`\`\n\n**Result:**\n${result.result}`,
//         timestamp: new Date()
//       };
//
//       setMessages(prev => [...prev, aiResponse]);
//     } catch (error) {
//       const errorMessage: Message = {
//         id: messages.length + 2,
//         role: 'assistant',
//         content: `❌ **Error generating code:**\n${error instanceof Error ? error.message : 'Unknown error'}`,
//         timestamp: new Date()
//       };
//       setMessages(prev => [...prev, errorMessage]);
//     } finally {
//       setIsGenerating(false);
//     }
//   }, [input, isGenerating, spreadsheetData.workbook_id, messages.length, generateCode]);
//
//   const clearChat = useCallback(() => {
//     setMessages([
//       {
//         id: 1,
//         role: 'assistant',
//         content: 'Hello! I\'m your personal spreadsheet assistant. I can manipulate your spreadsheet based on your natural language requests. Please import a spreadsheet file first to get started!',
//         timestamp: new Date()
//       }
//     ]);
//   }, []);
//
//   const clearSelectedRange = useCallback(() => {
//     if (setSelectedRange) {
//       setSelectedRange(null);
//     }
//   }, [setSelectedRange]);
//
//   const handleSuggestionClick = useCallback((suggestion: string) => {
//     setInput(suggestion);
//     setShowSuggestions(false);
//   }, []);
//
//   const typeSuggestions = getTypeSuggestions();
//
//   return {
//     width,
//     messages,
//     input,
//     isGenerating,
//     showSuggestions,
//     messagesEndRef,
//     isAnalyzing,
//     typeSuggestions,
//     handleMouseDown,
//     handleSubmit,
//     setInput,
//     clearChat,
//     clearSelectedRange,
//     handleSuggestionClick,
//     setShowSuggestions
//   };
// };
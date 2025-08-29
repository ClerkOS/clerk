import React, { useRef, useState } from "react";
import { CellData } from "../../spreadsheet/Grid/gridTypes";
import { useWorkbookId } from "../../providers/WorkbookProvider";
import { useActiveSheet } from "../../providers/SheetProvider";
import { Message } from "./conversationTypes";
import { batchSetCells, getCompletion, getSheet } from "../../../lib/api/apiClient";
import { useCellMap } from "../../providers/CellMapProvider";

export function useConversation() {
   const { workbookId } = useWorkbookId();
   const { activeSheet } = useActiveSheet();
   const sheet = activeSheet ? activeSheet : "Sheet1";
   const [isGenerating, setIsGenerating] = useState(false);
   const [showSuggestions, setShowSuggestions] = useState(true);
   const [width, setWidth] = useState<number>(460);
   const [messages, setMessages] = useState<Message[]>([]);
   const [userInput, setUserInput] = useState("");
   const textareaRef = useRef<HTMLTextAreaElement>(null);
   const { cellDataBySheet, setCellDataBySheet } = useCellMap();
   const [cellMap, setCellMap] = useState(cellDataBySheet[sheet]);

   const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      setUserInput(e.target.value);

      const textarea = textareaRef.current;
      if (textarea) {
         textarea.style.height = "auto"; // reset
         textarea.style.height = `${textarea.scrollHeight}px`; // grow text area as user prompt grows
      }
   };

   const handleKeyDown: React.KeyboardEventHandler<HTMLTextAreaElement> = (e) => {
      if (e.key === "Enter" && !e.shiftKey) {
         e.preventDefault();
         handleSend(e as unknown as React.FormEvent<HTMLFormElement>);
      }
   };

   const handleSend: React.FormEventHandler<HTMLFormElement> = async (e) => {
      e.preventDefault();

      if (!userInput.trim()) return;

      const userMessage: Message = {
         id: crypto.randomUUID(),
         role: "user",
         content: userInput,
         timestamp: new Date()
      };

      setMessages(prev => [...prev, userMessage]);
      setUserInput("");
      setIsGenerating(true);

      try {
         const response = await getCompletion(workbookId, sheet, userMessage.content);
         console.log(response.data.data);
         const resultsList = response.data.data.results;

         if (Array.isArray(resultsList)) {
            // map each step result to a different assistant message
            const assistantMessages: Message[] = await Promise.all(
              resultsList.map(async (stepResult: any) => ({
                 id: crypto.randomUUID(),
                 role: "assistant",
                 content: await parseStepOutput(stepResult),
                 timestamp: new Date()
              }))
            );
            setMessages(prev => [...prev, ...assistantMessages]);
         } else {
            // fallback message:
            const assistantMessage: Message = {
               id: crypto.randomUUID(),
               role: "assistant",
               // content: "Sorry, I couldn't generate results that time. Please refresh or try again later.",
               content: "Our servers are handling a lot of requests right now. Please refresh or try again later.",
               timestamp: new Date()
            };
            setMessages(prev => [...prev, assistantMessage]);
         }
      } catch (err) {
         console.error("Error fetching response:", err);
         const assistantMessage: Message = {
            id: crypto.randomUUID(),
            role: "assistant",
            // content: "Error generating response. Please refresh or try again later,",
            content: "Our servers are handling a lot of requests right now. Please refresh or try again later,",
            timestamp: new Date()
         };
         setMessages(prev => [...prev, assistantMessage]);
      } finally {
         setIsGenerating(false);
      }
   };

   async function parseStepOutput(stepResult: any) {
      const output = stepResult.result;
      switch (stepResult.tool) {
         case "analyze_data": {
            let message = "";

            if (output.summary) {
               message += `\n${output.summary}\n`;
            }
            if (output.insights) {
               message += `\n${output.insights}\n`;
            }
            if (output.recommendations) {
               message += `\n${output.recommendations}\n`;
            }
            if (output.observations) {
               message += `\n${output.observations}\n`;
            }
            return message.trim() || "No analysis results available.";
         }
         case "generate_table":
            await applyTableEdits(workbookId, sheet, output.edits, setCellMap, setCellDataBySheet);
            return output.description;
         case "generate_formula":
            // Apply the generated formulas to the sheet
            if (output.target_cells && output.target_cells.length > 0) {
               const edits = output.target_cells.map((cell: any) => ({
                  address: cell.address,
                  value: "", // Will be calculated by the formula
                  formula: cell.formula,
               }));
               await applyTableEdits(workbookId, sheet, edits, setCellMap, setCellDataBySheet);
            }
            return output.description;
         case "structured_calculation":
            // Handle structured calculation results
            let message = `Calculated ${output.operation} of column ${output.column}`;
            if (output.result !== undefined) {
               message += `: **${output.result}**`;
            }
            if (output.rows_matched) {
               message += ` (${output.rows_matched} rows matched)`;
            }
            if (output.target_cell) {
               message += ` → Result written to cell ${output.target_cell}`;
               // Refresh the sheet to show the written result
               try {
                  const response = await getSheet(workbookId, sheet);
                  if (response.data.success) {
                     const sheetData = response.data.data.sheet;
                     const updatedCellMap = new Map();
                     
                     if (sheetData.cells) {
                        Object.entries(sheetData.cells).forEach(([cellId, cellData]: [string, any]) => {
                           updatedCellMap.set(cellId, {
                              value: cellData.value || '',
                              formula: cellData.formula || '',
                              style: cellData.style || {}
                           });
                        });
                     }
                     
                     setCellMap(updatedCellMap);
                     setCellDataBySheet(prev => ({
                        ...prev,
                        [sheet]: updatedCellMap
                     }));
                  }
               } catch (refreshErr) {
                  console.error("Failed to refresh sheet data:", refreshErr);
               }
            }
            if (output.warnings && output.warnings.length > 0) {
               message += `\n⚠️ Warnings: ${output.warnings.join(', ')}`;
            }
            return message;
         default:
            return "couldn't parse step result";
      }
   }

   async function applyTableEdits(
     workbookId: string,
     sheetName: string,
     edits: any[],
     setCellMap: React.Dispatch<React.SetStateAction<Map<string, CellData>>>,
     setCellDataBySheet: React.Dispatch<
       React.SetStateAction<Record<string, Map<string, CellData>>>
     >
   ) {
      // If there are multiple edits, use animated version
      if (edits.length > 1) {
         await applyTableEditsAnimated(workbookId, sheetName, edits, setCellMap, setCellDataBySheet);
      } else {
         // Single edit - apply immediately
         await applyTableEditsImmediate(workbookId, sheetName, edits, setCellMap, setCellDataBySheet);
      }
   }

   async function applyTableEditsAnimated(
     workbookId: string,
     sheetName: string,
     edits: any[],
     setCellMap: React.Dispatch<React.SetStateAction<Map<string, CellData>>>,
     setCellDataBySheet: React.Dispatch<
       React.SetStateAction<Record<string, Map<string, CellData>>>
     >
   ) {
      // Push all changes to backend first
      try {
         await batchSetCells(workbookId, {
            sheet: sheetName,
            edits
         });
      } catch (err) {
         console.error("Failed to apply table edits:", err);
         return;
      }

      // Animate each cell update with delay
      for (let i = 0; i < edits.length; i++) {
         const edit = edits[i];
         
         // Update single cell with highlight effect
         setCellMap(prev => {
            const newMap = new Map(prev);
            newMap.set(edit.address, {
               value: edit.value,
               formula: edit.formula ?? "",
               style: { ...edit.style, highlight: true } // Add highlight effect
            });
            return newMap;
         });

         setCellDataBySheet(prev => {
            const prevSheetMap = prev[sheetName] ?? new Map();
            const newSheetMap = new Map(prevSheetMap);
            newSheetMap.set(edit.address, {
               value: edit.value,
               formula: edit.formula ?? "",
               style: { ...edit.style, highlight: true } // Add highlight effect
            });
            return {
               ...prev,
               [sheetName]: newSheetMap
            };
         });

         // Wait before next cell update (mimics Excel autofill)
         if (i < edits.length - 1) {
            await new Promise(resolve => setTimeout(resolve, 150)); // 150ms delay
         }
      }

      // Remove highlight effects after animation completes
      setTimeout(() => {
         setCellMap(prev => {
            const newMap = new Map(prev);
            edits.forEach(edit => {
               const cellData = newMap.get(edit.address);
               if (cellData) {
                  newMap.set(edit.address, {
                     ...cellData,
                     style: { ...cellData.style, highlight: false }
                  });
               }
            });
            return newMap;
         });

         setCellDataBySheet(prev => {
            const prevSheetMap = prev[sheetName] ?? new Map();
            const newSheetMap = new Map(prevSheetMap);
            edits.forEach(edit => {
               const cellData = newSheetMap.get(edit.address);
               if (cellData) {
                  newSheetMap.set(edit.address, {
                     ...cellData,
                     style: { ...cellData.style, highlight: false }
                  });
               }
            });
            return {
               ...prev,
               [sheetName]: newSheetMap
            };
         });
      }, 500); // Remove highlights after 500ms

      // Refresh the sheet data from backend to get the calculated values
      try {
         const response = await getSheet(workbookId, sheetName);
         if (response.data.success) {
            const sheetData = response.data.data.sheet;
            const updatedCellMap = new Map();
            
            if (sheetData.cells) {
               Object.entries(sheetData.cells).forEach(([cellId, cellData]: [string, any]) => {
                  updatedCellMap.set(cellId, {
                     value: cellData.value || '',
                     formula: cellData.formula || '',
                     style: cellData.style || {}
                  });
               });
            }
            
            // Update both local and global state with fresh data
            setCellMap(updatedCellMap);
            setCellDataBySheet(prev => ({
               ...prev,
               [sheetName]: updatedCellMap
            }));
         }
      } catch (refreshErr) {
         console.error("Failed to refresh sheet data:", refreshErr);
      }
   }

   async function applyTableEditsImmediate(
     workbookId: string,
     sheetName: string,
     edits: any[],
     setCellMap: React.Dispatch<React.SetStateAction<Map<string, CellData>>>,
     setCellDataBySheet: React.Dispatch<
       React.SetStateAction<Record<string, Map<string, CellData>>>
     >
   ) {
      // Build updated sheet map
      const applyEditsToMap = (prevMap: Map<string, CellData>) => {
         const newMap = new Map(prevMap);
         for (const edit of edits) {
            newMap.set(edit.address, {
               value: edit.value,
               formula: edit.formula ?? "",
               style: edit.style ?? {}
            });
         }
         return newMap;
      };

      // Update local map immediately
      setCellMap(prev => applyEditsToMap(prev));

      // Update global context map immediately
      setCellDataBySheet(prev => {
         const prevSheetMap = prev[sheetName] ?? new Map();
         return {
            ...prev,
            [sheetName]: applyEditsToMap(prevSheetMap)
         };
      });

      // Push changes to backend
      try {
         await batchSetCells(workbookId, {
            sheet: sheetName,
            edits
         });
         
         // Refresh the sheet data from backend to get the calculated values
         try {
            const response = await getSheet(workbookId, sheetName);
            if (response.data.success) {
               const sheetData = response.data.data.sheet;
               const updatedCellMap = new Map();
               
               if (sheetData.cells) {
                  Object.entries(sheetData.cells).forEach(([cellId, cellData]: [string, any]) => {
                     updatedCellMap.set(cellId, {
                        value: cellData.value || '',
                        formula: cellData.formula || '',
                        style: cellData.style || {}
                     });
                  });
               }
               
               // Update both local and global state with fresh data
               setCellMap(updatedCellMap);
               setCellDataBySheet(prev => ({
                  ...prev,
                  [sheetName]: updatedCellMap
               }));
            }
         } catch (refreshErr) {
            console.error("Failed to refresh sheet data:", refreshErr);
         }
      } catch (err) {
         console.error("Failed to apply table edits:", err);
      }
   }

   return {
      workbookId,
      sheet,
      isGenerating,
      setIsGenerating,
      showSuggestions,
      setShowSuggestions,
      width,
      setWidth,
      messages,
      setMessages,
      userInput,
      setUserInput,
      textareaRef,
      handleInputChange,
      handleKeyDown,
      handleSend,
      parseStepOutput,
      applyTableEdits
   };
}

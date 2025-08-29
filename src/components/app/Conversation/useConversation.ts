import React, { useEffect, useRef, useState } from "react";
import { CellData } from "../../spreadsheet/Grid/gridTypes";
import { Message, PendingAction } from "./conversationTypes";
import { batchSetCells, getCompletion, getSheet } from "../../../lib/api/apiClient";
import { useGrid } from "../../spreadsheet/Grid/useGrid";
import { useAnimateCell } from "../../providers/AnimatingCellProvider";
import { useWorkbook } from "../../providers/WorkbookProvider";

export function useConversation() {
  const { workbookId, activeSheet, cellDataBySheet, setCellDataBySheet, } = useWorkbook()
  const sheet = activeSheet ? activeSheet : "Sheet1";
  const [isGenerating, setIsGenerating] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(true);
  const [width, setWidth] = useState<number>(460);
  const [messages, setMessages] = useState<Message[]>([]);
  const [userInput, setUserInput] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [cellMap, setCellMap] = useState(cellDataBySheet[sheet]);
  const { triggerCellAnimations } = useAnimateCell();

  // Auto-scroll to bottom when messages change or when generating
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isGenerating]);

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
          resultsList.map(async (stepResult: any) => {
            const parseResult = await parseStepOutput(stepResult);
            return {
              id: crypto.randomUUID(),
              role: "assistant",
              content: parseResult.content,
              timestamp: new Date(),
              pendingAction: parseResult.pendingAction,
              actionStatus: parseResult.pendingAction ? 'pending' as const : undefined
            };
          })
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

  async function parseStepOutput(stepResult: any): Promise<{ content: string; pendingAction?: PendingAction }> {
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
        return { content: message.trim() || "No analysis results available." };
      }
      case "generate_table":
        // Return pending action instead of auto-applying
        return {
          content: output.description,
          pendingAction: {
            type: 'data',
            data: { 
              edits: output.edits,
              workbookId,
              sheet,
              setCellMap,
              setCellDataBySheet,
              triggerCellAnimations
            },
            description: `Apply ${output.edits?.length || 0} data changes`
          }
        };
      case "generate_formula":
        // Return pending action instead of auto-applying
        if (output.target_cells && output.target_cells.length > 0) {
          const edits = output.target_cells.map((cell: any) => ({
            address: cell.address,
            value: "", // Will be calculated by the formula
            formula: cell.formula,
          }));
          return {
            content: output.description,
            pendingAction: {
              type: 'formula',
              data: { 
                edits,
                workbookId,
                sheet,
                setCellMap,
                setCellDataBySheet,
                triggerCellAnimations
              },
              description: `Apply ${edits.length} formula${edits.length > 1 ? 's' : ''}`
            }
          };
        }
        return { content: output.description };
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
        return { content: message };
      default:
        return { content: "couldn't parse step result" };
    }
  }

  // Handle applying a pending action
  const handleApplyAction = async (messageId: string, action: PendingAction) => {
    try {
      switch (action.type) {
        case 'data':
        case 'formula':
          await applyTableEdits(
            action.data.workbookId,
            action.data.sheet,
            action.data.edits,
            action.data.setCellMap,
            action.data.setCellDataBySheet,
            action.data.triggerCellAnimations
          );
          break;
        case 'calculation':
          // Handle calculation application if needed
          break;
      }

      // Update message status
      setMessages(prev => prev.map(msg => 
        msg.id === messageId 
          ? { ...msg, actionStatus: 'applied' as const }
          : msg
      ));
    } catch (error) {
      console.error("Error applying action:", error);
    }
  };

  // Handle declining a pending action
  const handleDeclineAction = (messageId: string) => {
    setMessages(prev => prev.map(msg => 
      msg.id === messageId 
        ? { ...msg, actionStatus: 'declined' as const }
        : msg
    ));
  };

  async function applyTableEdits(
    workbookId: string,
    sheetName: string,
    edits: any[],
    setCellMap: React.Dispatch<React.SetStateAction<Map<string, CellData>>>,
    setCellDataBySheet: React.Dispatch<
      React.SetStateAction<Record<string, Map<string, CellData>>>
    >,
    triggerAnimations?: (addresses: string[]) => void
  ) {

    // Process edits to handle formulas correctly
    const processedEdits = edits.map(edit => {
      if (edit.value && edit.value.startsWith("=")) {
        return {
          ...edit,
          value: edit.value,
          formula: edit.value.substring(1)
        };
      }
      return edit;
    });

    // Apply all edits at once
    setCellMap(prev => {
      const newMap = new Map(prev);
      processedEdits.forEach(edit => {
        newMap.set(edit.address, {
          value: edit.value,
          formula: edit.formula ?? "",
          style: edit.style ?? {}
        });
      });
      return newMap;
    });

    setCellDataBySheet(prev => {
      const prevSheetMap = prev[sheetName] ?? new Map();
      const newMap = new Map(prevSheetMap);
      processedEdits.forEach(edit => {
        newMap.set(edit.address, {
          value: edit.value,
          formula: edit.formula ?? "",
          style: edit.style ?? {}
        });
      });
      return {
        ...prev,
        [sheetName]: newMap
      };
    });

    // Trigger animations
    if (triggerAnimations) {
      const addresses = processedEdits.map(edit => edit.address);
      triggerAnimations(addresses);
    }

    // Push changes to backend
    await batchSetCells(workbookId, {
      sheet: sheetName,
      edits: processedEdits
    });

    await new Promise(resolve => setTimeout(resolve, 900));

    // Refresh sheet data to get evaluated values
    try {
      const response = await getSheet(workbookId, sheetName);
      if (response.data.success) {
        const sheetData = response.data.data.sheet;
        const updatedCellMap = new Map();

        if (sheetData.cells) {
          Object.entries(sheetData.cells).forEach(([cellId, cellData]: [string, any]) => {
            updatedCellMap.set(cellId, {
              value: cellData.value || "",
              formula: cellData.formula || "",
              style: cellData.style || {}
            });
          });
        }

        setCellMap(updatedCellMap);
        setCellDataBySheet(prev => ({
          ...prev,
          [sheetName]: updatedCellMap
        }));
      }
    } catch (err) {
      console.error("Failed to refresh sheet data:", err);
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
    applyTableEdits,
    messagesEndRef,
    handleApplyAction,
    handleDeclineAction
  };
}
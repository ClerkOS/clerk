import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Trash2, Sparkles, GripVertical } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { useSpreadsheet } from '../../context/SpreadsheetContext';
import { useAIOperations } from '../../hooks/useAIOperations';

const AIPanel = ({ onWidthChange, selectedRange, setSelectedRange }) => {
  const { theme } = useTheme();
  const { spreadsheetData } = useSpreadsheet();
  const [width, setWidth] = useState(320);
  const [messages, setMessages] = useState([
    {
      id: 1,
      role: 'assistant',
      content: 'Hello! I\'m your AI assistant. I can help you with data analysis, formulas, and more. Please import a spreadsheet file first to get started!',
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState('');
  const { convertToFormula, generateSummary, explainFormula, isConverting, conversionError, lastResult } = useAIOperations(spreadsheetData.workbook_id);
  const messagesEndRef = useRef(null);
  
  const isResizing = useRef(false);
  const startX = useRef(0);
  const startWidth = useRef(0);

  const handleMouseDown = (e) => {
    isResizing.current = true;
    startX.current = e.clientX;
    startWidth.current = width;
    document.body.style.cursor = 'ew-resize';
    document.body.style.userSelect = 'none';
  };

  const handleMouseMove = (e) => {
    if (!isResizing.current) return;
    const delta = startX.current - e.clientX;
    const newWidth = Math.min(Math.max(startWidth.current + delta, 280), 500);
    setWidth(newWidth);
    onWidthChange(newWidth);
  };

  const handleMouseUp = () => {
    isResizing.current = false;
    document.body.style.cursor = '';
    document.body.style.userSelect = '';
  };

  React.useEffect(() => {
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Add effect to handle selected range
  useEffect(() => {
    if (selectedRange && spreadsheetData.workbook_id) {
      const rangeMessage = {
        id: messages.length + 1,
        role: 'assistant',
        content: `I can see you've selected range: **${selectedRange.range}**\n\nWhat would you like to know about this data? I can help you:\n• Analyze the values\n• Create formulas\n• Generate summaries\n• Suggest visualizations`,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, rangeMessage]);
      
      // Pre-fill input with a helpful suggestion
      setInput(`Tell me about the data in ${selectedRange.range}`);
    } else if (selectedRange && !spreadsheetData.workbook_id) {
      const rangeMessage = {
        id: messages.length + 1,
        role: 'assistant',
        content: `I can see you've selected range: **${selectedRange.range}**, but I need a workbook to work with this data. Please import a spreadsheet file first!`,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, rangeMessage]);
    }
  }, [selectedRange, spreadsheetData.workbook_id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    // Check if we have a workbook loaded
    if (!spreadsheetData.workbook_id) {
      const errorMessage = {
        id: messages.length + 2,
        role: 'assistant',
        content: 'I need a workbook to work with! Please import a spreadsheet file first using the import button in the sidebar.',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, {
        id: messages.length + 1,
        role: 'user',
        content: input,
        timestamp: new Date()
      }, errorMessage]);
      setInput('');
      return;
    }

    const userMessage = {
      id: messages.length + 1,
      role: 'user',
      content: input,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');

    try {
      const userInput = input.toLowerCase();
      
      // Determine the type of request and route to appropriate AI endpoint
      let aiResponse = '';
      
      // Check for formula-related requests
      const isFormulaRequest = userInput.includes('sum') || 
                              userInput.includes('average') || 
                              userInput.includes('formula') ||
                              userInput.includes('calculate') ||
                              userInput.includes('total') ||
                              userInput.includes('count') ||
                              userInput.includes('max') ||
                              userInput.includes('min') ||
                              userInput.includes('vlookup') ||
                              userInput.includes('if') ||
                              userInput.includes('round');

      // Check for analysis/summary requests
      const isAnalysisRequest = userInput.includes('analyze') || 
                               userInput.includes('summary') || 
                               userInput.includes('insight') ||
                               userInput.includes('pattern') ||
                               userInput.includes('trend') ||
                               userInput.includes('observation') ||
                               userInput.includes('recommendation') ||
                               userInput.includes('tell me about') ||
                               userInput.includes('what does this data') ||
                               userInput.includes('explain this data');

      // Check for formula explanation requests
      const isExplanationRequest = userInput.includes('explain') || 
                                  userInput.includes('what does') ||
                                  userInput.includes('how does') ||
                                  userInput.includes('break down') ||
                                  userInput.includes('describe') ||
                                  userInput.startsWith('=') ||
                                  userInput.includes('formula');

      if (isFormulaRequest) {
        // Route to formula generation
        const result = await convertToFormula(input);
        if (result.data && result.data.target_cells) {
          const formulas = result.data.target_cells.map(cell => 
            `${cell.address}: ${cell.formula}`
          ).join('\n');
          
          aiResponse = `I've generated these formulas for you:\n\n${formulas}\n\n${result.data.description || 'These formulas will help with your calculation.'}`;
        } else {
          aiResponse = 'I generated a formula for you, but there was an issue with the response format.';
        }
      } else if (isAnalysisRequest && selectedRange) {
        // Route to data analysis/summary
        const result = await generateSummary(input, selectedRange.range);
        if (result.data) {
          const data = result.data;
          aiResponse = `**Analysis of ${selectedRange.range}:**\n\n`;
          
          if (data.summary) {
            aiResponse += `**Summary:** ${data.summary}\n\n`;
          }
          
          if (data.observations && data.observations.length > 0) {
            aiResponse += `**Key Observations:**\n${data.observations.map(obs => `• ${obs}`).join('\n')}\n\n`;
          }
          
          if (data.insights && data.insights.length > 0) {
            aiResponse += `**Insights:**\n${data.insights.map(insight => `• ${insight}`).join('\n')}\n\n`;
          }
          
          if (data.recommendations && data.recommendations.length > 0) {
            aiResponse += `**Recommendations:**\n${data.recommendations.map(rec => `• ${rec}`).join('\n')}`;
          }
        } else {
          aiResponse = 'I analyzed your data, but there was an issue with the response format.';
        }
      } else if (isExplanationRequest) {
        // Route to formula explanation
        const result = await explainFormula(input);
        if (result.data) {
          if (result.data.type === 'formula') {
            aiResponse = `Here's the formula: \`${result.data.text}\``;
          } else {
            aiResponse = `**Explanation:** ${result.data.text}`;
          }
        } else {
          aiResponse = 'I explained the formula, but there was an issue with the response format.';
        }
      } else {
        // Default to formula generation for general requests
        try {
          const result = await convertToFormula(input);
          if (result.data && result.data.target_cells) {
            const formulas = result.data.target_cells.map(cell => 
              `${cell.address}: ${cell.formula}`
            ).join('\n');
            
            aiResponse = `I've generated these formulas for you:\n\n${formulas}\n\n${result.data.description || 'These formulas will help with your request.'}`;
          } else {
            aiResponse = 'I tried to help with your request, but there was an issue with the response format.';
          }
        } catch (error) {
          aiResponse = `I understand you want to work with ${selectedRange ? `the data in ${selectedRange.range}` : 'your data'}. I can help you analyze it, create formulas, or generate visualizations. What specific task would you like to accomplish?`;
        }
      }

      const aiMessage = {
        id: messages.length + 2,
        role: 'assistant',
        content: aiResponse,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, aiMessage]);
      
    } catch (error) {
      console.error('AI response failed:', error);
      const errorMessage = {
        id: messages.length + 2,
        role: 'assistant',
        content: `Sorry, I encountered an error processing your request: ${error.message}. Please try again with a different question.`,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    }
  };

  const clearChat = () => {
    setMessages([
      {
        id: 1,
        role: 'assistant',
        content: spreadsheetData.workbook_id 
          ? 'Hello! I\'m your AI assistant. I can help you with data analysis, formulas, and more. What would you like to do?'
          : 'Hello! I\'m your AI assistant. I can help you with data analysis, formulas, and more. Please import a spreadsheet file first to get started!',
        timestamp: new Date()
      }
    ]);
  };

  const clearSelectedRange = () => {
    // This will be handled by the parent component
    // For now, we'll just clear the local state
    setSelectedRange(null);
  };

  const isDark = false; // Force light mode for this style

  return (
    <div 
      className="relative border-l flex flex-col h-full max-w-[50%] bg-white border-gray-200 text-gray-900 shadow-lg"
      style={{ width: `${width}px`, fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" }}
    >
      {/* Resize Handle */}
      <div
        className="absolute left-0 top-0 bottom-0 w-1 cursor-ew-resize hover:bg-blue-500/50"
        onMouseDown={handleMouseDown}
      >
        <GripVertical 
          size={16} 
          className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 text-gray-400"
        />
      </div>

      {/* Header */}
      <div className="p-4 border-b border-gray-200 bg-white dark:bg-gray-900 dark:border-gray-700">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-green-500 flex items-center justify-center text-white font-bold text-base">AI</div>
          <h3 className="font-bold text-lg text-gray-900 dark:text-white">AI Assistant</h3>
        </div>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Get help with data analysis and formulas</p>
        
        {/* Selected Range Indicator */}
        {selectedRange && (
          <div className="mt-2 p-2 bg-blue-50 dark:bg-blue-900/20 rounded border border-blue-200 dark:border-blue-800">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sparkles size={14} className="text-blue-500" />
                <span className="text-sm font-medium text-blue-700 dark:text-blue-300">
                  Selected: {selectedRange.range}
                </span>
              </div>
              <button
                onClick={clearSelectedRange}
                className="text-xs text-blue-500 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
              >
                Clear
              </button>
            </div>
            {selectedRange.content && selectedRange.content.length > 0 && (
              <div className="mt-1 text-xs text-blue-600 dark:text-blue-400">
                {selectedRange.content.length} cell{selectedRange.content.length !== 1 ? 's' : ''} with data
              </div>
            )}
          </div>
        )}
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-white dark:bg-gray-900">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex gap-3 ${
              message.role === 'assistant' ? 'items-start' : 'items-end'
            }`}
          >
            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
              message.role === 'assistant' 
                ? 'bg-blue-100 dark:bg-blue-900/30' 
                : 'bg-gray-100 dark:bg-gray-800'
            }`}>
              {message.role === 'assistant' ? (
                <span className="font-bold text-blue-500">AI</span>
              ) : (
                <User size={16} className="text-gray-500 dark:text-gray-300" />
              )}
            </div>
            <div className={`flex-1 max-w-[80%] ${
              message.role === 'assistant' 
                ? 'bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 border border-gray-200 dark:border-gray-700' 
                : 'bg-blue-500 text-white'
            } rounded-lg p-3 text-sm`}>
              <p>{message.content}</p>
              <span className="text-xs opacity-50 mt-1 block">
                {message.timestamp.toLocaleTimeString()}
              </span>
            </div>
          </div>
        ))}
        {isConverting && (
          <div className="flex gap-3 items-start">
            <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
              <span className="font-bold text-blue-500">AI</span>
            </div>
            <div className="flex-1 max-w-[80%] bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-3">
              <div className="flex gap-1">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-bounce" style={{ animationDelay: '0s' }} />
                <div className="w-2 h-2 bg-green-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                <div className="w-2 h-2 bg-green-500 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }} />
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-4 border-t border-gray-200 bg-white dark:bg-gray-900 dark:border-gray-700">
        <form onSubmit={handleSubmit} className="flex gap-2 items-center">
          <div className="flex-1 input-container flex items-center bg-gray-50 dark:bg-gray-800 rounded-full px-4 py-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask me anything..."
              className="flex-1 border-none bg-transparent outline-none text-gray-900 dark:text-gray-100 text-sm"
            />
          </div>
          <button
            type="submit"
            disabled={!input.trim() || isConverting}
            className="send-btn p-2 rounded-full bg-blue-500 text-white disabled:opacity-50 disabled:cursor-not-allowed hover:bg-blue-600 transition-colors ml-2"
            style={{ width: 40, height: 40 }}
          >
            <Send size={18} />
          </button>
        </form>
        <div className="mt-2 flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
          <Sparkles size={14} />
          <span>AI Assistant can help with data analysis, formulas, and more</span>
        </div>
      </div>
    </div>
  );
};

export default AIPanel; 
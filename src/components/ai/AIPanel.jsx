import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Trash2, Code, Play, Lightbulb, BarChart3 } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { useSpreadsheet } from '../../context/SpreadsheetContext';
import { useTypeDetection } from '../../hooks/useTypeDetection';

const AIPanel = ({ onWidthChange, selectedRange, setSelectedRange }) => {
  const { theme } = useTheme();
  const { spreadsheetData } = useSpreadsheet();
  const { 
    typeAnalysis, 
    isAnalyzing, 
    aiContext, 
    getTypeSuggestions,
    DATA_TYPES 
  } = useTypeDetection(spreadsheetData, selectedRange);
  
  const [width, setWidth] = useState(320);
  const [messages, setMessages] = useState([
    {
      id: 1,
      role: 'assistant',
      content: 'Hello! I\'m your AI assistant. I can generate and execute Go code to manipulate your spreadsheet based on your natural language requests. Please import a spreadsheet file first to get started!',
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
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

  // Add effect to handle selected range and type analysis
  useEffect(() => {
    if (selectedRange && spreadsheetData.workbook_id) {
      let rangeMessage = `I can see you've selected range: **${selectedRange.range}**\n\n`;
      
      // Add type analysis if available
      if (typeAnalysis && !isAnalyzing) {
        rangeMessage += `**Data Analysis:**\n`;
        rangeMessage += `- ${typeAnalysis.summary.totalColumns} columns, ${typeAnalysis.summary.totalRows} rows\n`;
        rangeMessage += `- Data consistency: ${typeAnalysis.summary.isConsistent ? 'High' : 'Mixed'}\n\n`;
        
        // Add column type information
        rangeMessage += `**Column Types:**\n`;
        typeAnalysis.columns.forEach(col => {
          rangeMessage += `- ${col.header}: ${col.dominantType} (${Math.round(col.confidence * 100)}% confidence)\n`;
        });
        rangeMessage += `\n`;
      }
      
      rangeMessage += `What would you like me to do with this data? I can generate Go code to:\n• Manipulate cell values and formulas\n• Apply formatting and styles\n• Create charts and visualizations\n• Perform data analysis\n• Import/export data`;
      
      const rangeMessageObj = {
        id: messages.length + 1,
        role: 'assistant',
        content: rangeMessage,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, rangeMessageObj]);
      
      // Pre-fill input with a helpful suggestion
      if (typeAnalysis && typeAnalysis.columns.length > 0) {
        const firstCol = typeAnalysis.columns[0];
        if (firstCol.dominantType === DATA_TYPES.NUMBER) {
          setInput(`Calculate the sum of ${firstCol.header}`);
        } else if (firstCol.dominantType === DATA_TYPES.DATE) {
          setInput(`Group data by month from ${firstCol.header}`);
        } else {
          setInput(`Analyze the data in ${firstCol.header}`);
        }
      } else {
        setInput(`Manipulate the data in ${selectedRange.range}`);
      }
    } else if (selectedRange && !spreadsheetData.workbook_id) {
      const rangeMessage = {
        id: messages.length + 1,
        role: 'assistant',
        content: `I can see you've selected range: **${selectedRange.range}**, but I need a workbook to work with this data. Please import a spreadsheet file first!`,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, rangeMessage]);
    }
  }, [selectedRange, spreadsheetData.workbook_id, typeAnalysis, isAnalyzing]);

  const generateCode = async (prompt) => {
    try {
      // Include type analysis context if available
      let enhancedPrompt = prompt;
      if (aiContext) {
        enhancedPrompt = `Context:\n${aiContext}\n\nUser Request: ${prompt}`;
      }

      const response = await fetch('http://localhost:8080/generate-code', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt: enhancedPrompt,
          sheet: 'Sheet1'
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      return result;
    } catch (error) {
      console.error('Code generation failed:', error);
      throw error;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim() || isGenerating) return;

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
    setIsGenerating(true);

    try {
      const result = await generateCode(input);
      
      const aiResponse = {
        id: messages.length + 2,
        role: 'assistant',
        content: `**Generated Code:**\n\`\`\`go\n${result.generatedCode}\n\`\`\`\n\n**Result:**\n${result.result}`,
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, aiResponse]);
    } catch (error) {
      const errorMessage = {
        id: messages.length + 2,
        role: 'assistant',
        content: `❌ **Error generating code:**\n${error.message}`,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsGenerating(false);
    }
  };

  const clearChat = () => {
    setMessages([
      {
        id: 1,
        role: 'assistant',
        content: 'Hello! I\'m your AI assistant. I can generate and execute Go code to manipulate your spreadsheet based on your natural language requests. Please import a spreadsheet file first to get started!',
        timestamp: new Date()
      }
    ]);
  };

  const clearSelectedRange = () => {
    if (setSelectedRange) {
      setSelectedRange(null);
    }
  };

  const handleSuggestionClick = (suggestion) => {
    setInput(suggestion);
    setShowSuggestions(false);
  };

  const typeSuggestions = getTypeSuggestions();

  return (
    <div 
      className={`flex flex-col h-full border-l ${theme === 'dark' ? 'border-gray-700 bg-gray-800' : 'border-gray-200 bg-white'}`}
      style={{ width: `${width}px` }}
    >
      {/* Header */}
      <div className={`flex items-center justify-between p-4 border-b ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'}`}>
        <div className="flex items-center space-x-2">
          <Code className="w-5 h-5 text-blue-500" />
          <h3 className={`font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
            AI Code Generator
          </h3>
          {isAnalyzing && (
            <div className="flex space-x-1">
              <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"></div>
              <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
              <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
            </div>
          )}
        </div>
        <div className="flex items-center space-x-2">
          {typeSuggestions.length > 0 && (
            <button
              onClick={() => setShowSuggestions(!showSuggestions)}
              className={`p-1 rounded hover:bg-gray-100 ${theme === 'dark' ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}
              title="Show suggestions"
            >
              <Lightbulb className="w-4 h-4" />
            </button>
          )}
          <button
            onClick={clearSelectedRange}
            className={`p-1 rounded hover:bg-gray-100 ${theme === 'dark' ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}
            title="Clear selected range"
          >
            <Trash2 className="w-4 h-4" />
          </button>
          <button
            onClick={clearChat}
            className={`p-1 rounded hover:bg-gray-100 ${theme === 'dark' ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}
            title="Clear chat"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Resize handle */}
      <div
        className="absolute left-0 top-0 bottom-0 w-1 cursor-ew-resize hover:bg-blue-500"
        onMouseDown={handleMouseDown}
      />

      {/* Type Suggestions */}
      {showSuggestions && typeSuggestions.length > 0 && (
        <div className={`p-4 border-b ${theme === 'dark' ? 'border-gray-700 bg-gray-750' : 'border-gray-200 bg-gray-50'}`}>
          <h4 className={`text-sm font-medium mb-3 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
            <Lightbulb className="w-4 h-4 inline mr-2" />
            Type-Aware Suggestions
          </h4>
          <div className="space-y-3">
            {typeSuggestions.map((category, index) => (
              <div key={index}>
                <h5 className={`text-xs font-medium mb-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                  {category.category}
                </h5>
                <div className="space-y-1">
                  {category.prompts.map((prompt, promptIndex) => (
                    <button
                      key={promptIndex}
                      onClick={() => handleSuggestionClick(prompt)}
                      className={`block w-full text-left text-xs p-2 rounded hover:bg-blue-100 ${theme === 'dark' ? 'hover:bg-blue-900 text-gray-300' : 'text-gray-700'}`}
                    >
                      {prompt}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[85%] rounded-lg p-3 ${
                message.role === 'user'
                  ? `${theme === 'dark' ? 'bg-blue-600 text-white' : 'bg-blue-500 text-white'}`
                  : `${theme === 'dark' ? 'bg-gray-700 text-gray-100' : 'bg-gray-100 text-gray-900'}`
              }`}
            >
              <div className="flex items-start space-x-2">
                {message.role === 'assistant' && (
                  <Bot className="w-4 h-4 mt-0.5 flex-shrink-0" />
                )}
                {message.role === 'user' && (
                  <User className="w-4 h-4 mt-0.5 flex-shrink-0" />
                )}
                <div className="flex-1">
                  <div className="whitespace-pre-wrap text-sm">{message.content}</div>
                  <div className={`text-xs mt-2 opacity-70 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                    {message.timestamp.toLocaleTimeString()}
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
        {isGenerating && (
          <div className="flex justify-start">
            <div className={`max-w-[85%] rounded-lg p-3 ${theme === 'dark' ? 'bg-gray-700 text-gray-100' : 'bg-gray-100 text-gray-900'}`}>
              <div className="flex items-center space-x-2">
                <Bot className="w-4 h-4" />
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                  <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                </div>
                <span className="text-sm">Generating code...</span>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className={`p-4 border-t ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'}`}>
        <form onSubmit={handleSubmit} className="flex space-x-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Describe what you want to do with the spreadsheet..."
            className={`flex-1 px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              theme === 'dark' 
                ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
            }`}
            disabled={isGenerating}
          />
          <button
            type="submit"
            disabled={!input.trim() || isGenerating}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              isGenerating || !input.trim()
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : 'bg-blue-500 text-white hover:bg-blue-600'
            }`}
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};

export default AIPanel; 
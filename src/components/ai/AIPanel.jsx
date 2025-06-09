import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Trash2, Sparkles, GripVertical } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

const AIPanel = ({ onWidthChange }) => {
  const { theme } = useTheme();
  const [width, setWidth] = useState(420);
  const [messages, setMessages] = useState([
    {
      id: 1,
      role: 'assistant',
      content: 'Hello! I\'m your AI assistant. I can help you with data analysis, formulas, and more. What would you like to do?',
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
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
    const newWidth = Math.min(Math.max(startWidth.current + delta, 320), 600);
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage = {
      id: messages.length + 1,
      role: 'user',
      content: input,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    // TODO: Implement actual AI response logic here
    setTimeout(() => {
      const aiMessage = {
        id: messages.length + 2,
        role: 'assistant',
        content: 'I understand you want to work with your data. I can help you analyze it, create formulas, or generate visualizations. What specific task would you like to accomplish?',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, aiMessage]);
      setIsLoading(false);
    }, 1000);
  };

  const clearChat = () => {
    setMessages([
      {
        id: 1,
        role: 'assistant',
        content: 'Hello! I\'m your AI assistant. I can help you with data analysis, formulas, and more. What would you like to do?',
        timestamp: new Date()
      }
    ]);
  };

  const isDark = theme === 'dark';

  return (
    <div 
      className={`relative border-l flex flex-col h-full ${
        isDark 
          ? 'bg-gray-800 border-gray-700 text-white' 
          : 'bg-white border-gray-200 text-gray-900'
      }`}
      style={{ width: `${width}px` }}
    >
      {/* Resize Handle */}
      <div
        className="absolute left-0 top-0 bottom-0 w-1 cursor-ew-resize hover:bg-blue-500/50"
        onMouseDown={handleMouseDown}
      >
        <GripVertical 
          size={16} 
          className={`absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 ${
            isDark ? 'text-gray-400' : 'text-gray-500'
          }`}
        />
      </div>

      {/* Header */}
      <div className={`p-4 border-b ${
        isDark ? 'border-gray-700 bg-gray-900' : 'border-gray-200 bg-gray-50'
      }`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Bot size={20} className="text-blue-500" />
            <h3 className="font-medium text-lg">AI Assistant</h3>
          </div>
          <button
            onClick={clearChat}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
            title="Clear chat"
          >
            <Trash2 size={18} className="text-gray-500" />
          </button>
        </div>
        <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
          Get help with data analysis and formulas
        </p>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
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
                <Bot size={16} className="text-blue-500" />
              ) : (
                <User size={16} className="text-gray-500" />
              )}
            </div>
            <div className={`flex-1 max-w-[80%] ${
              message.role === 'assistant' 
                ? 'bg-gray-100 dark:bg-gray-800' 
                : 'bg-blue-500 text-white'
            } rounded-lg p-3`}>
              <p className="text-sm">{message.content}</p>
              <span className="text-xs opacity-50 mt-1 block">
                {message.timestamp.toLocaleTimeString()}
              </span>
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex gap-3 items-start">
            <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
              <Bot size={16} className="text-blue-500" />
            </div>
            <div className="flex-1 max-w-[80%] bg-gray-100 dark:bg-gray-800 rounded-lg p-3">
              <div className="flex gap-1">
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-100" />
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-200" />
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className={`p-4 border-t ${
        isDark ? 'border-gray-700 bg-gray-900' : 'border-gray-200 bg-gray-50'
      }`}>
        <form onSubmit={handleSubmit} className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask me anything..."
            className={`flex-1 px-4 py-2 rounded-lg border ${
              isDark 
                ? 'bg-gray-800 border-gray-600 text-white' 
                : 'bg-white border-gray-200 text-gray-900'
            } focus:outline-none focus:ring-2 focus:ring-blue-500`}
          />
          <button
            type="submit"
            disabled={!input.trim() || isLoading}
            className="p-2 rounded-lg bg-blue-500 text-white disabled:opacity-50 disabled:cursor-not-allowed hover:bg-blue-600 transition-colors"
          >
            <Send size={18} />
          </button>
        </form>
        <div className="mt-2 flex items-center gap-2 text-xs text-gray-500">
          <Sparkles size={14} />
          <span>AI Assistant can help with data analysis, formulas, and more</span>
        </div>
      </div>
    </div>
  );
};

export default AIPanel; 
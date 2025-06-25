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

  const isDark = false; // Force light mode for this style

  return (
    <div 
      className="relative border-l flex flex-col h-full bg-white border-gray-200 text-gray-900 shadow-lg"
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
        {isLoading && (
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
            disabled={!input.trim() || isLoading}
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
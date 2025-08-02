import React, { useState } from "react";
import { Bot, Code, Lightbulb, Send, Trash2, User } from "lucide-react";
import { ConversationProps, Message } from "./conversationTypes";

const Conversation: React.FC<ConversationProps> = () => {

  const isAnalyzing = false
  const isGenerating = false
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      role: 'assistant',
      content: 'Hello! I\'m your personal spreadsheet assistant. I can manipulate your spreadsheet based on your natural language requests. Please import a spreadsheet file or add data to a new one to get started!',
      timestamp: new Date()
    },
    // {
    //   id: 2,
    //   role: 'user',
    //   content: 'Add a col to sum the total for each row in the table',
    //   timestamp: new Date()
    // }
  ]);

  return (
    <div
      className="flex flex-col h-full border-l dark:border-gray-700 dark:bg-gray-800 border-gray-200 bg-white"
      style={{ width: "440px" }}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b dark:border-gray-700 border-gray-200">
        <div className="flex items-center space-x-2">
          <Code className="w-5 h-5 text-blue-500" />
          <h3 className="font-semibold dark:text-white text-gray-900">
            Clerk Assistant
          </h3>
          {isAnalyzing && (
            <div className="flex space-x-1">
              <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"></div>
              <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: "0.1s" }}></div>
              <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: "0.2s" }}></div>
            </div>
          )}
        </div>
        <div className="flex items-center space-x-2">
          {/*{typeSuggestions.length > 0 && (*/}
          {/*  <button*/}
          {/*    onClick={() => setShowSuggestions(!showSuggestions)}*/}
          {/*    className="p-1 rounded hover:bg-gray-700 dark:hover:bg-gray-100"*/}
          {/*    title="Show suggestions"*/}
          {/*  >*/}
          {/*    <Lightbulb className="w-4 h-4 text-gray-300 dark:text-gray-700" />*/}
          {/*  </button>*/}
          {/*)}*/}
          <button
            // onClick={clearSelectedRange}
            className="p-1 rounded dark:hover:bg-gray-700 hover:bg-gray-100"
            title="Clear selected range"
          >
            <Trash2 className="w-4 h-4 dark:text-gray-300 text-gray-700" />
          </button>
          <button
            // onClick={clearChat}
            className="p-1 rounded dark:hover:bg-gray-700 hover:bg-gray-100"
            title="Clear chat"
          >
            <Trash2 className="w-4 h-4 dark:text-gray-300 text-gray-700" />
          </button>
        </div>
      </div>

      {/* Resize handle */}
      <div
        className="absolute left-0 top-0 bottom-0 w-1 cursor-ew-resize hover:bg-blue-500"
        // onMouseDown={handleMouseDown}
      />

      {/* Type Suggestions */}
      {/*{showSuggestions && typeSuggestions.length > 0 && (*/}
      {/*  <div className="p-4 border-b border-gray-700 bg-gray-750 dark:border-gray-200 dark:bg-gray-50">*/}
      {/*    <h4 className="text-sm font-medium mb-3 text-white dark:text-gray-900">*/}
      {/*      <Lightbulb className="w-4 h-4 inline mr-2 text-blue-500" />*/}
      {/*      Type-Aware Suggestions*/}
      {/*    </h4>*/}
      {/*    <div className="space-y-3">*/}
      {/*      {typeSuggestions.map((category, index) => (*/}
      {/*        <div key={index}>*/}
      {/*          <h5 className="text-xs font-medium mb-2 text-gray-300 dark:text-gray-600">*/}
      {/*            {category.category}*/}
      {/*          </h5>*/}
      {/*          <div className="space-y-1">*/}
      {/*            {category.prompts.map((prompt, promptIndex) => (*/}
      {/*              <button*/}
      {/*                key={promptIndex}*/}
      {/*                onClick={() => handleSuggestionClick(prompt)}*/}
      {/*                className="block w-full text-left text-xs p-2 rounded hover:bg-blue-900 dark:hover:bg-blue-100 text-gray-300 dark:text-gray-700"*/}
      {/*              >*/}
      {/*                {prompt}*/}
      {/*              </button>*/}
      {/*            ))}*/}
      {/*          </div>*/}
      {/*        </div>*/}
      {/*      ))}*/}
      {/*    </div>*/}
      {/*  </div>*/}
      {/*)}*/}

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => {
          const isUser = message.role === "user";
          return (
            <div
              key={message.id}
              className={`flex ${isUser ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[85%] rounded-lg p-3 ${
                  isUser
                    ? "bg-blue-600 text-white"
                    : "dark:bg-gray-700 dark:text-gray-100 bg-gray-100 text-gray-900"
                }`}
              >
                <div
                  className={`flex items-start space-x-2 ${
                    isUser ? "flex-row-reverse space-x-reverse" : ""
                  }`}
                >
                  {isUser ? (
                    <User className="w-4 h-4 mt-0.5 flex-shrink-0" />
                  ) : (
                    <Bot className="w-4 h-4 mt-0.5 flex-shrink-0" />
                  )}
                  <div className="text-left">
                    <div className="whitespace-pre-wrap text-sm">
                      {message.content}
                    </div>
                    {/*<div className="text-xs mt-2 opacity-70 dark:text-gray-400 text-gray-500">*/}
                    {/*  {message.timestamp.toLocaleTimeString()}*/}
                    {/*</div>*/}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
        {isGenerating && (
          <div className="flex justify-start">
            <div className="max-w-[85%] rounded-lg p-3 dark:bg-gray-700 dark:text-gray-100 bg-gray-100 text-gray-900">
              <div className="flex items-center space-x-2">
                <Bot className="w-4 h-4" />
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"
                       style={{ animationDelay: "0.1s" }}></div>
                  <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"
                       style={{ animationDelay: "0.2s" }}></div>
                </div>
                {/*<span className="text-sm">Generating code...</span>*/}
              </div>
            </div>
          </div>
        )}
        {/*<div ref={messagesEndRef} />*/}
      </div>

      {/* Input */}
      <div className="p-4 border-t dark:border-gray-700 border-gray-200">
        <form
          // onSubmit={handleSubmit}
          className="flex space-x-2"
        >
          <input
            type="text"
            // value={input}
            // onChange={(e) => setInput(e.target.value)}
            placeholder="Describe what you want to do with the spreadsheet..."
            className="flex-1 px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-400 bg-white border-gray-300 text-gray-900 placeholder-gray-500"
            disabled={isGenerating}
          />
          <button
            type="submit"
            // disabled={!input.trim() || isGenerating}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              // isGenerating || !input.trim()
              isGenerating 
                ? "dark:bg-gray-600 dark:text-gray-400 cursor-not-allowed bg-gray-300 text-gray-500"
                : "bg-blue-500 text-white hover:bg-blue-600"
            }`}
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};

export default Conversation;
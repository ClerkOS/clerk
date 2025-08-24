import React, { useState } from "react";
import { ArrowUp, Bot, Plus, User, FileText, Pi, Volume2, Omega } from "lucide-react";
import { InsightProps, Message } from "./insightTypes";

const Insights: React.FC<InsightProps> = () => {

  const isAnalyzing = false;
  const isGenerating = false;
  const showSuggestions = true;
  const [width, setWidth] = useState<number>(320);
  const [messages, setMessages] = useState<Message[]>([
    // {
    //   id: 1,
    //   role: "assistant",
    //   content: "Hello! I'm your personal spreadsheet assistant. I can manipulate your spreadsheet based on your natural language requests. Please import a spreadsheet file or add data to a new one to get started!",
    //   timestamp: new Date()
    // }
    // {
    //   id: 2,
    //   role: 'user',
    //   content: 'Add a col to sum the total for each row in the table',
    //   timestamp: new Date()
    // }
  ]);

  return (
    <div
      className="flex flex-col h-full border-r dark:border-gray-700 dark:bg-gray-800 border-gray-200 bg-white"
      style={{ width: `${width}px` }}
    >
      {/* Header */}
      <div
        className="flex items-center justify-between p-[0.43rem] border-b bg-white dark:border-gray-700 border-gray-200">
        <div className="flex items-center space-x-2">
          {/*<Code className="w-5 h-5 text-gray-500" />*/}
          <h3 className="font-semibold dark:text-white text-gray-900">
            {/*Clerk Assistant*/}
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
          <button
            // onClick={clearChat}
            className="p-1 rounded dark:hover:bg-gray-700 hover:bg-gray-100"
            title="Clear chat"
          >
            <Plus className="w-4 h-4 dark:text-gray-300 text-gray-700" />
          </button>
        </div>
      </div>

      {/* Resize handle */}
      <div
        className="absolute left-0 top-0 bottom-0 w-1 cursor-ew-resize hover:bg-blue-500"
        // onMouseDown={handleMouseDown}
      />

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 relative"  >
        {/* Initial Chat State */}
        {messages.length === 0 && !isGenerating && (
          <div className="absolute inset-0 flex flex-col items-center justify-center space-y-4 pointer-events-none">
            {/* Prompt text */}
            {/*<span className="text-gray-900 dark:text-gray-500 text-[1.2rem] font-medium text-center break-words max-w-[300px]">*/}
            {/*  What do you want to do with your data?*/}
            {/*</span>*/}

            {/* Suggestions */}
            <div className="space-y-2 w-full max-w-xs pointer-events-auto text-left">
              {/* Suggestion 1 */}
              <div
                className="flex items-start p-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 transition">
                <FileText className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
                <div className="ml-3">
                  <div className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                    Summarize the data in the sheet
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">
                    Get an overview of the data and key insights.
                  </div>
                </div>
              </div>

              {/* Suggestion 2 */}
              <div
                className="flex items-start p-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 transition">
                <Pi className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
                <div className="ml-3">
                  <div className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                    Explain a formula
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">
                    Get an explanation of a complex spreadsheet formula in simple language.
                  </div>
                </div>
              </div>

              {/* Suggestion 3 */}
              <div
                className="flex items-start p-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 transition">
                <Omega className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
                <div className="ml-3">
                  <div className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                    Create a formula
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">
                    Explain the formula(s) you want in English. We'll generate them for you.
                  </div>
                </div>
              </div>

              <div
                className="flex items-start p-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 transition">
                <Omega className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
                <div className="ml-3">
                  <div className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                    Create a formula
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">
                    Explain the formula(s) you want in English. We'll generate them for you.
                  </div>
                </div>
              </div>

              <div
                className="flex items-start p-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 transition">
                <Omega className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
                <div className="ml-3">
                  <div className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                    Create a formula
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">
                    Explain the formula(s) you want in English. We'll generate them for you.
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

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
      <div className="p-4 ">
        <form
          // onSubmit={handleSubmit}
          className="flex flex-col border rounded-lg overflow-hidden border-gray-200 "
        >
          {/*<div className="flex justify-start items-center px-2 py-1 bg-gray-50 dark:bg-gray-800">*/}
          {/*  <button*/}
          {/*    type="submit"*/}
          {/*    className={`p-0.5 rounded-none transition-colors border border-gray-100  bg-gray-50 text-gray-700`}*/}
          {/*  >*/}
          {/*    <Plus size={14}/>*/}
          {/*  </button>*/}
          {/*</div>*/}
          <textarea
            rows={3}
            // value={input}
            // onChange={(e) => setInput(e.target.value)}
            placeholder="Ask anything"
            className="w-full resize-none pr-12 pl-3 py-2  rounded-lg text-sm focus:outline-none  dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-400 bg-gray-50 border-gray-50 text-gray-900 placeholder-gray-500"
            disabled={isGenerating}
          />
          <div className="flex justify-end items-center px-2 py-1 bg-gray-50 dark:bg-gray-800">
            <button
              type="submit"
              // disabled={!input.trim() || isGenerating}
              className={`p-2 rounded-3xl transition-colors ${
                isGenerating
                  ? "dark:bg-gray-600 dark:text-gray-400 cursor-not-allowed bg-gray-300 text-gray-500"
                  : "bg-blue-500 text-white hover:bg-blue-600"
              }`}
            >
              <ArrowUp className="w-4 h-4" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Insights;
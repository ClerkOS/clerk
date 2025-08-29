it aimport React, { useRef, useState, useEffect } from "react";
import { ArrowUp, FileText, Omega, Pi, Plus, ChartNoAxesCombined, WandSparkles, SquarePen } from "lucide-react";
import { ConversationProps, Message } from "./conversationTypes";
import { useConversation } from "./useConversation";
import MessageBubble from "../Message/Message";

const Conversation: React.FC<ConversationProps> = () => {


   const {
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
   } = useConversation()

   return (
     <div
       className="flex flex-col h-full border-l border-gray-200/40 bg-gradient-to-b from-gray-50/40 via-white/20 to-gray-50/30 backdrop-blur-sm"
       style={{ width: `${width}px` }}
     >
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200/50 bg-gradient-to-r from-white/90 to-gray-50/90 backdrop-blur-md shadow-sm">
           <div className="flex items-center space-x-0">
                             <svg 
                 version="1.0" 
                 xmlns="http://www.w3.org/2000/svg" 
                 width="24" 
                 height="24" 
                 viewBox="50 50 400 400" 
                 preserveAspectRatio="xMidYMid meet"
                 className="text-gray-900 mt-1 mr-1.5"
               >
                  <g transform="translate(0.000000,500.000000) scale(0.100000,-0.100000)" fill="currentColor" stroke="none">
                     <path d="M2340 4109 c-156 -22 -293 -77 -433 -171 -72 -49 -224 -198 -264 -260 -103 -161 -154 -292 -180 -466 -13 -90 -14 -125 -5 -222 17 -171 70 -335 144 -448 15 -24 28 -45 28 -48 0 -11 119 -150 161 -189 127 -116 295 -206 474 -253 59 -15 179 -32 229 -32 45 0 207 23 266 39 235 60 474 228 609 430 51 74 112 202 134 281 23 80 47 240 47 314 0 132 -47 324 -111 450 -111 218 -290 394 -502 491 -75 34 -158 65 -192 71 -136 24 -295 29 -405 13z m382 -143 c161 -41 284 -112 410 -235 176 -174 271 -396 227 -532 -49 -152 -165 -286 -309 -356 -79 -38 -189 -73 -228 -73 -9 0 -85 -69 -169 -152 l-153 -152 -42 40 c-24 22 -95 90 -158 150 -63 61 -169 160 -235 221 -66 61 -138 129 -160 152 -21 23 -44 41 -49 41 -17 0 -86 -73 -86 -91 0 -9 19 -34 43 -54 23 -21 80 -74 128 -119 47 -45 107 -101 135 -125 49 -45 240 -222 361 -335 l64 -60 77 75 c313 301 279 274 366 298 188 53 353 172 447 321 27 42 29 43 24 15 -2 -16 -6 -46 -9 -65 -31 -271 -239 -548 -509 -680 -146 -71 -232 -91 -392 -92 -261 -1 -465 83 -647 265 -63 63 -149 179 -175 237 -50 113 -53 122 -53 192 0 125 40 209 148 317 62 62 96 86 172 124 52 25 127 54 165 63 l70 16 157 156 156 155 44 -44 c46 -47 154 -149 412 -394 88 -82 169 -151 181 -153 23 -3 85 56 85 82 0 8 -19 31 -42 51 -48 43 -241 221 -298 275 -40 38 -229 215 -324 304 l-60 55 -25 -19 c-14 -11 -99 -93 -189 -183 -161 -163 -163 -164 -226 -180 -80 -20 -206 -79 -271 -128 -60 -45 -142 -129 -179 -184 -22 -32 -26 -35 -22 -15 3 14 8 43 10 65 31 291 280 598 583 720 98 39 181 53 324 54 103 1 144 -4 221 -23z"/>
                     <path d="M2405 3254 c-111 -62 -140 -217 -59 -313 89 -106 288 -76 338 51 35 86 9 192 -60 244 -33 25 -47 29 -113 32 -56 2 -84 -2 -106 -14z"/>
                  </g>
               </svg>
              <h3 className="font-medium text-gray-900 text-sm">
                 Clerk AI
              </h3>
           </div>
           <div className="flex items-center space-x-1">
              <button
                className="p-1.5 rounded-md hover:bg-gray-100 transition-colors"
                title="New conversation"
              >
                 <Plus className="w-4 h-4 text-gray-500" />
              </button>
           </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-4 py-6 relative bg-gradient-to-b from-transparent to-white/10">
           {/* Initial Chat State */}
           {messages.length === 0 && !isGenerating && (
             <div className="absolute inset-0 flex flex-col items-center justify-center space-y-6 pointer-events-none px-4">
                {/* Prompt text */}
                <div className="text-center">
                   <h2 className="text-xl font-medium text-gray-900 mb-2">
                      How can I help you today?
                   </h2>
                   <p className="text-gray-500 text-sm max-w-[280px]">
                      Ask me anything about your data, or try one of these suggestions:
                   </p>
                </div>

                {/* Suggestions */}
                <div className="space-y-3 w-full max-w-80 pointer-events-auto">
                   {/* Suggestion 1 */}
                   <button className="flex items-start p-4 rounded-xl border border-gray-200 bg-white hover:bg-gray-50 hover:border-gray-300 transition-all duration-200 text-left w-full group">
                      <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center flex-shrink-0 group-hover:bg-blue-100 transition-colors">
                         <WandSparkles className="w-4 h-4 text-blue-600" />
                      </div>
                      <div className="ml-3 flex-1">
                         <div className="text-sm font-medium text-gray-900 mb-1">
                            Generate sample data
                         </div>
                         <div className="text-xs text-gray-500 leading-relaxed">
                            Create sample data and explore Clerk's features
                         </div>
                      </div>
                   </button>

                   {/* Suggestion 2 */}
                   <button className="flex items-start p-4 rounded-xl border border-gray-200 bg-white hover:bg-gray-50 hover:border-gray-300 transition-all duration-200 text-left w-full group">
                      <div className="w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center flex-shrink-0 group-hover:bg-emerald-100 transition-colors">
                         <FileText className="w-4 h-4 text-emerald-600" />
                      </div>
                      <div className="ml-3 flex-1">
                         <div className="text-sm font-medium text-gray-900 mb-1">
                            Analyze my data
                         </div>
                         <div className="text-xs text-gray-500 leading-relaxed">
                            Get insights and summaries from your spreadsheet
                         </div>
                      </div>
                   </button>



                   {/* Suggestion 3 */}
                   <button className="flex items-start p-4 rounded-xl border border-gray-200 bg-white hover:bg-gray-50 hover:border-gray-300 transition-all duration-200 text-left w-full group">
                      <div className="w-8 h-8 rounded-lg bg-orange-50 flex items-center justify-center flex-shrink-0 group-hover:bg-orange-100 transition-colors">
                         <Pi className="w-4 h-4 text-orange-600" />
                      </div>
                      <div className="ml-3 flex-1">
                         <div className="text-sm font-medium text-gray-900 mb-1">
                            Create formulas
                         </div>
                         <div className="text-xs text-gray-500 leading-relaxed">
                            Describe calculations in plain English
                         </div>
                      </div>
                   </button>

                   {/* Suggestion 4 */}
                   <button className="flex items-start p-4 rounded-xl border border-gray-200 bg-white hover:bg-gray-50 hover:border-gray-300 transition-all duration-200 text-left w-full group">
                      <div className="w-8 h-8 rounded-lg bg-purple-50 flex items-center justify-center flex-shrink-0 group-hover:bg-purple-100 transition-colors">
                         <SquarePen className="w-4 h-4 text-purple-600" />
                      </div>
                      <div className="ml-3 flex-1">
                         <div className="text-sm font-medium text-gray-900 mb-1">
                            Edit data naturally
                         </div>
                         <div className="text-xs text-gray-500 leading-relaxed">
                            Add rows, update values, or modify your data
                         </div>
                      </div>
                   </button>


                </div>
             </div>
           )}

            {/* Message bubbles */}
           {messages.map((message) => (
             <MessageBubble 
               key={message.id} 
               message={message}
               onApplyAction={handleApplyAction}
               onDeclineAction={handleDeclineAction}
             />
           ))}
           
           {/* Scroll target for auto-scroll */}
           <div ref={messagesEndRef} />
        </div>

        {/* Generating animation */}
        {isGenerating && (
          <div className="px-4 pb-4">
             <div className="flex items-center space-x-2 p-3 rounded-xl bg-white border border-gray-100">
                <div className="flex space-x-1">
                   <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce"></div>
                   <div 
                     className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" 
                     style={{ animationDelay: "0.1s" }}
                   ></div>
                   <div 
                     className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" 
                     style={{ animationDelay: "0.2s" }}
                   ></div>
                </div>
                <span className="text-sm text-gray-500 font-medium">AI is thinking...</span>
             </div>
          </div>
        )}

        {/* Input */}
        <div className="p-4 border-t border-gray-200/50 bg-gradient-to-r from-white/95 to-gray-50/95 backdrop-blur-md shadow-lg">
           <form onSubmit={handleSend} className="relative">
              <div className="flex items-end space-x-2">
                 <div className="flex-1 relative">
                    <textarea
                      ref={textareaRef}
                      rows={1}
                      value={userInput}
                      onChange={handleInputChange}
                      placeholder="Ask anything about your data..."
                      className="w-full resize-none pl-4 pr-12 py-3 text-sm border border-gray-200/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all placeholder-gray-400 text-gray-900 overflow-y-auto max-h-32 bg-white/80 backdrop-blur-sm shadow-sm"
                      disabled={isGenerating}
                      onKeyDown={handleKeyDown}
                    />
                    <button
                      type="submit"
                      disabled={!userInput.trim() || isGenerating}
                      className={`absolute right-2 top-1/2 -translate-y-1/2 p-1.5 rounded-lg transition-all duration-200 ${
                        userInput.trim() && !isGenerating
                          ? "bg-gradient-to-r from-blue-500 to-blue-600 text-white hover:from-blue-600 hover:to-blue-700 shadow-md backdrop-blur-sm"
                          : "bg-gray-100/80 text-gray-400 cursor-not-allowed backdrop-blur-sm"
                      }`}
                    >
                       <ArrowUp className="w-4 h-4" />
                    </button>
                 </div>
              </div>
           </form>
        </div>

        {/* Resize handle */}
        <div
          className="absolute left-0 top-0 bottom-0 w-1 cursor-ew-resize hover:bg-blue-400 transition-colors"
          // onMouseDown={handleMouseDown}
        />
     </div>
   );
};

export default Conversation;
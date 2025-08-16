import React, { useRef, useState } from "react";
import { ArrowUp, FileText, Omega, Pi, Plus } from "lucide-react";
import { ConversationProps, Message } from "./conversationTypes";
import { getCompletion } from "../../../lib/api/apiClient";
import { useActiveSheet } from "../../providers/SheetProvider";
import { useWorkbookId } from "../../providers/WorkbookProvider";
import { type } from "node:os";

const Conversation: React.FC<ConversationProps> = () => {

   const { workbookId } = useWorkbookId();
   const { activeSheet } = useActiveSheet();
   const sheet = activeSheet ? activeSheet : "Sheet1";
   const [isGenerating, setIsGenerating] = useState(false);
   const [showSuggestions, setShowSuggestions] = useState(true);
   const [width, setWidth] = useState<number>(360);
   const [messages, setMessages] = useState<Message[]>([]);
   const [userInput, setUserInput] = useState("");
   const textareaRef = useRef<HTMLTextAreaElement>(null);

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
         const results = response.data.data.results;

         if (Array.isArray(results)) {
            // map each step result to a different assistant message
            const assistantMessages: Message[] = results.map((step: any) => ({
               id: crypto.randomUUID(),
               role: "assistant",
               content: parseStepOutput(step),
               timestamp: new Date()
            }));
            setMessages(prev => [...prev, ...assistantMessages]);
         } else{
            // fallback message:
            const assistantMessage: Message = {
               id: crypto.randomUUID(),
               role: "assistant",
               content: "Sorry, i couldn't generate results that time. Please refresh or try again later.",
               timestamp: new Date(),
            };
            setMessages(prev => [...prev, assistantMessage]);
         }
      } catch (err) {
         console.error("Error fetching response:", err);
         const assistantMessage: Message = {
            id: crypto.randomUUID(),
            role: "assistant",
            content: "Error generating response",
            timestamp: new Date()
         };
         setMessages(prev => [...prev, assistantMessage]);
      } finally {
         setIsGenerating(false);
      }
   };

   function parseStepOutput(step: any) {
      switch (step.type){
         case "insights":
            return step.output.insights
         case "summary":
            return step.output.summary
         case "table":
            return "Applying edits to table"
         default:
            return step.output
      }
   }

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

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-1 space-y-4 relative">
           {/* Initial Chat State */}
           {messages.length === 0 && !isGenerating && (
             <div className="absolute inset-0 flex flex-col items-center justify-center space-y-4 pointer-events-none">
                {/* Prompt text */}
                <span
                  className="text-gray-900 dark:text-gray-500 text-[1.2rem] font-medium text-center break-words max-w-[300px]">
              What do you want to do with your data?
            </span>

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
                </div>
             </div>
           )}

           {messages.map((message) => {
              const isUser = message.role === "user";
              return (
                <div
                  key={message.id}
                  className={`w-full px-0.5 pt-0`} // full width, padding left/right
                >
                   <div
                     className={`w-full px-2 py-1 rounded-[0.2rem] whitespace-pre-wrap text-sm text-left select-text
                  ${isUser
                       ? "bg-gray-100 text-gray-700" // user style
                       : "bg-white text-gray-800"    // bot style
                     }`}
                   >
                      {message.content}
                   </div>
                </div>
              );
           })}
        </div>

        {/* Generating animation */}
        {isGenerating && (
          <div className="px-4 pb-2 flex space-x-1">
             <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"></div>
             <div
               className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"
               style={{ animationDelay: "0.1s" }}
             ></div>
             <div
               className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"
               style={{ animationDelay: "0.2s" }}
             ></div>
          </div>
        )}

        {/* Input */}
        <div className="p-2 ">
           <form
             onSubmit={handleSend}
             className="flex flex-col border rounded-lg overflow-hidden border-gray-200 focus-within:border-blue-500"
           >
              <div className="flex justify-start items-center px-2 py-1 bg-gray-50 dark:bg-gray-800">
                 <button
                   type="submit"
                   className={`p-0.5 rounded-none transition-colors border border-gray-100  bg-gray-50 text-gray-700`}
                 >
                    <Plus size={14} />
                 </button>
              </div>
              <textarea
                ref={textareaRef}
                rows={1}
                value={userInput}
                onChange={handleInputChange}
                placeholder="Ask anything"
                className="w-full resize-none pr-12 pl-3 py-2 rounded-lg text-sm focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-400 bg-gray-50 border-gray-50 text-gray-900 placeholder-gray-500 overflow-y-auto max-h-64"
                disabled={isGenerating}
                onKeyDown={handleKeyDown}
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

        {/* Resize handle */}
        <div
          className="absolute left-0 top-0 bottom-0 w-1 cursor-ew-resize hover:bg-blue-500"
          // onMouseDown={handleMouseDown}
        />
     </div>
   );
};

export default Conversation;
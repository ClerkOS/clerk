import React from "react";
import { useMessage } from "./useMessage";
import { Message } from "../Conversation/conversationTypes";

const { useTypingEffect } = useMessage()

const MessageBubble: React.FC<{ message: Message }> = ({ message }) => {
   const isUser = message.role === "user";
   const content = isUser
     ? message.content
     : useTypingEffect(message.content || "");

   return (
     <div
       key={message.id}
       className="w-full px-0.5 pt-0"
     >
        <div
          className={`w-full px-2 py-1 rounded-[0.2rem] whitespace-pre-wrap text-sm text-left select-text
          ${isUser
            ? "bg-gray-100 text-gray-700 pt-4 pb-2" // user style
            : "bg-white text-gray-800"                  // assistant style
          }`}
        >
           {content}
        </div>
     </div>
   );
};

export default MessageBubble;
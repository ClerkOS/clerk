import React from "react";
import { useMessage } from "./useMessage";
import { Message } from "../Conversation/conversationTypes";
import { Check, X } from "lucide-react";

const { useTypingEffect } = useMessage()

interface MessageBubbleProps {
  message: Message;
  onApplyAction?: (messageId: string, action: any) => void;
  onDeclineAction?: (messageId: string) => void;
}

const MessageBubble: React.FC<MessageBubbleProps> = ({ 
  message, 
  onApplyAction, 
  onDeclineAction 
}) => {
   const isUser = message.role === "user";
   const content = isUser
     ? message.content
     : useTypingEffect(message.content || "");

   const showActionButtons = !isUser && 
     message.pendingAction && 
     message.actionStatus === 'pending';

   const handleApply = () => {
     if (onApplyAction && message.pendingAction) {
       onApplyAction(message.id, message.pendingAction);
     }
   };

   const handleDecline = () => {
     if (onDeclineAction) {
       onDeclineAction(message.id);
     }
   };

   return (
     <div className="w-full mb-4">
        <div className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}>
           <div className={`max-w-[85%] ${isUser ? 'ml-8' : 'mr-8'}`}>
              <div
                className={`px-4 py-3 rounded-2xl whitespace-pre-wrap text-sm leading-relaxed select-text ${
                  isUser
                    ? "bg-blue-500 text-white rounded-br-lg"
                    : "bg-white border border-gray-200 text-gray-800 rounded-bl-lg shadow-sm"
                }`}
              >
                 {content}
              </div>
              
              {/* Action Buttons */}
              {showActionButtons && (
                <div className="mt-3 flex items-center space-x-2">
                  <button
                    onClick={handleApply}
                    className="flex items-center space-x-1.5 px-3 py-1.5 bg-blue-500 text-white text-xs font-medium rounded-lg hover:bg-blue-600 transition-colors"
                  >
                    <Check className="w-3.5 h-3.5" />
                    <span>Apply</span>
                  </button>
                  <button
                    onClick={handleDecline}
                    className="flex items-center space-x-1.5 px-3 py-1.5 bg-gray-500 text-white text-xs font-medium rounded-lg hover:bg-gray-600 transition-colors"
                  >
                    <X className="w-3.5 h-3.5" />
                    <span>Decline</span>
                  </button>
                  {message.pendingAction && (
                    <span className="text-xs text-gray-500">
                      {message.pendingAction.description}
                    </span>
                  )}
                </div>
              )}

              {/* Status indicator for applied/declined actions */}
              {!isUser && message.actionStatus && message.actionStatus !== 'pending' && (
                <div className="mt-2 text-xs text-gray-500">
                  {message.actionStatus === 'applied' ? (
                    <span className="flex items-center space-x-1">
                      <Check className="w-3 h-3 text-green-600" />
                      <span>Applied</span>
                    </span>
                  ) : (
                    <span className="flex items-center space-x-1">
                      <X className="w-3 h-3 text-red-600" />
                      <span>Declined</span>
                    </span>
                  )}
                </div>
              )}
           </div>
        </div>
     </div>
   );
};

export default MessageBubble;
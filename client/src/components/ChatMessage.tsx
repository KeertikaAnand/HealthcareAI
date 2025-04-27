import { FC } from "react";

interface ChatMessageProps {
  message: string;
  sender: "user" | "bot";
  isTyping?: boolean;
}

const ChatMessage: FC<ChatMessageProps> = ({ message, sender, isTyping = false }) => {
  const isUser = sender === "user";

  return (
    <div className={`flex mb-4 ${isUser ? "justify-end" : ""}`}>
      {!isUser && (
        <div className="w-8 h-8 flex-shrink-0 rounded-full bg-blue-100 flex items-center justify-center mr-3">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
      )}
      
      <div className={`${isUser ? "bg-primary text-white" : "bg-gray-100 text-gray-800"} rounded-lg py-3 px-4 max-w-[80%]`}>
        {isTyping ? (
          <div className="typing-indicator flex space-x-1">
            <span className="w-2 h-2 bg-gray-400 rounded-full"></span>
            <span className="w-2 h-2 bg-gray-400 rounded-full"></span>
            <span className="w-2 h-2 bg-gray-400 rounded-full"></span>
          </div>
        ) : (
          <div dangerouslySetInnerHTML={{ __html: message }} />
        )}
      </div>
      
      {isUser && (
        <div className="w-8 h-8 flex-shrink-0 rounded-full bg-gray-300 flex items-center justify-center ml-3">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
        </div>
      )}
    </div>
  );
};

export default ChatMessage;

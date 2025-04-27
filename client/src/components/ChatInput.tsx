import { FC, useState, FormEvent } from "react";

interface ChatInputProps {
  onSendMessage: (message: string) => void;
  onResetChat: () => void;
}

const ChatInput: FC<ChatInputProps> = ({ onSendMessage, onResetChat }) => {
  const [input, setInput] = useState("");

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    
    const trimmedInput = input.trim();
    if (!trimmedInput) return;
    
    onSendMessage(trimmedInput);
    setInput("");
  };

  return (
    <div className="bg-white border-t border-gray-200 fixed bottom-0 left-0 right-0 z-10">
      <div className="max-w-4xl mx-auto p-4">
        <form onSubmit={handleSubmit} className="flex items-center space-x-2">
          <div className="relative flex-1">
            <input 
              type="text" 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type your health question here..." 
              className="w-full px-4 py-3 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              aria-label="Type your health question"
            />
            <button 
              type="button" 
              onClick={onResetChat}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none" 
              title="Reset conversation"
              aria-label="Reset conversation"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          </div>
          <button 
            type="submit" 
            className="bg-primary hover:bg-blue-600 text-white px-5 py-3 rounded-lg flex items-center justify-center transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
            aria-label="Send message"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </button>
        </form>
      </div>
    </div>
  );
};

export default ChatInput;

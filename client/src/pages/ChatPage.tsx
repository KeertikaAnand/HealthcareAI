import { useState, useRef, useEffect } from "react";
import Header from "@/components/Header";
import WelcomeCard from "@/components/WelcomeCard";
import ChatInput from "@/components/ChatInput";
import ChatMessage from "@/components/ChatMessage";
import AwsInfoModal from "@/components/AwsInfoModal";
import ErrorToast from "@/components/ErrorToast";
import { useChat } from "@/hooks/useChat";
import { trackEvent } from "@/utils/analytics";

export default function ChatPage() {
  const [isInfoModalOpen, setIsInfoModalOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  
  const { 
    messages, 
    isTyping, 
    sendMessage, 
    resetChat
  } = useChat();

  useEffect(() => {
    // Scroll to bottom when messages change
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
    
    // Track page view
    trackEvent('chat_page_view');
  }, [messages]);

  useEffect(() => {
    // Auto-hide error after 3 seconds
    if (error) {
      const timer = setTimeout(() => {
        setError(null);
      }, 3000);
      
      return () => clearTimeout(timer);
    }
  }, [error]);

  const handleSendMessage = async (message: string) => {
    try {
      await sendMessage(message);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to send message");
      trackEvent('message_error', { errorType: 'send_error' });
    }
  };

  const handleQuickTopic = (topic: string) => {
    handleSendMessage(topic);
    trackEvent('quick_topic_selected', { topic });
  };

  const handleResetChat = () => {
    resetChat();
    trackEvent('chat_reset');
  };

  const toggleInfoModal = () => {
    setIsInfoModalOpen(!isInfoModalOpen);
    if (!isInfoModalOpen) {
      trackEvent('info_modal_opened');
    }
  };

  return (
    <div className="bg-gray-50 text-gray-800 font-sans min-h-screen flex flex-col">
      <Header onInfoClick={toggleInfoModal} />
      
      <main className="flex-1 pt-16 pb-20">
        <div className="max-w-4xl mx-auto p-4">
          <WelcomeCard onTopicSelect={handleQuickTopic} />
          
          <div 
            ref={chatContainerRef}
            className="chat-container h-[calc(100vh-250px)] overflow-y-auto bg-white rounded-xl shadow-md p-4 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent"
          >
            {messages.map((message, index) => (
              <ChatMessage
                key={index}
                message={message.text}
                sender={message.sender}
                isTyping={isTyping && index === messages.length - 1}
              />
            ))}
          </div>
        </div>
      </main>
      
      <ChatInput 
        onSendMessage={handleSendMessage} 
        onResetChat={handleResetChat}
      />
      
      <AwsInfoModal 
        isOpen={isInfoModalOpen} 
        onClose={() => setIsInfoModalOpen(false)} 
      />
      
      <ErrorToast 
        message={error} 
        isVisible={!!error} 
      />
    </div>
  );
}

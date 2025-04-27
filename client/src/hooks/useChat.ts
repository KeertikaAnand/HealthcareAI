import { useState, useEffect, useCallback } from "react";
import { ChatMessage } from "@/types";
import { sendChatMessage, generateSessionId } from "@/lib/awsService";
import { healthResponses } from "@/lib/aws-config";
import { trackEvent } from "@/utils/analytics";

export function useChat() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isTyping, setIsTyping] = useState<boolean>(false);
  const [sessionId, setSessionId] = useState<string>("");

  // Initialize chat with welcome message
  useEffect(() => {
    const newSessionId = generateSessionId();
    setSessionId(newSessionId);
    
    const initialMessage: ChatMessage = {
      id: `bot-${Date.now()}`,
      text: healthResponses.initialGreeting,
      sender: "bot",
      timestamp: Date.now(),
    };
    
    setMessages([initialMessage]);
    trackEvent("chat_initialized", { sessionId: newSessionId });
  }, []);

  // Send a message to the chatbot
  const sendMessage = useCallback(async (text: string) => {
    if (!text.trim()) return;
    
    // Add user message to chat
    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      text,
      sender: "user",
      timestamp: Date.now(),
    };
    
    setMessages((prevMessages) => [...prevMessages, userMessage]);
    trackEvent("message_sent", { messageLength: text.length });
    
    // Show typing indicator
    setIsTyping(true);
    
    try {
      // Send message to AWS service
      const response = await sendChatMessage({
        message: text,
        sessionId,
      });
      
      // Add bot response to chat
      const botMessage: ChatMessage = {
        id: `bot-${Date.now()}`,
        text: response.message,
        sender: "bot",
        timestamp: Date.now(),
      };
      
      setMessages((prevMessages) => [...prevMessages, botMessage]);
      trackEvent("response_received", { successful: true });
    } catch (error) {
      console.error("Error in chat:", error);
      trackEvent("chat_error", { error: String(error) });
      
      // Add error message
      const errorMessage: ChatMessage = {
        id: `bot-${Date.now()}`,
        text: "I'm having trouble connecting to the healthcare knowledge base. Please try again shortly.",
        sender: "bot",
        timestamp: Date.now(),
      };
      
      setMessages((prevMessages) => [...prevMessages, errorMessage]);
    } finally {
      setIsTyping(false);
    }
  }, [sessionId]);

  // Reset the chat
  const resetChat = useCallback(() => {
    // Generate new session ID
    const newSessionId = generateSessionId();
    setSessionId(newSessionId);
    
    // Reset messages to just the initial greeting
    const initialMessage: ChatMessage = {
      id: `bot-${Date.now()}`,
      text: healthResponses.initialGreeting,
      sender: "bot",
      timestamp: Date.now(),
    };
    
    setMessages([initialMessage]);
    trackEvent("chat_reset", { newSessionId });
  }, []);

  return {
    messages,
    isTyping,
    sendMessage,
    resetChat,
  };
}

import { SendMessageRequest, SendMessageResponse } from "@/types";
import { apiRequest } from "./queryClient";
import { sendChatMessage } from "./awsService";

/**
 * A wrapper for chat-related API calls
 * This provides a consistent interface regardless of backend implementation
 */
export const chatApi = {
  /**
   * Send a message to the healthcare chatbot
   * Falls back to local implementation if server API is unavailable
   */
  sendMessage: async (request: SendMessageRequest): Promise<SendMessageResponse> => {
    try {
      // First try the server API endpoint if available
      const response = await apiRequest<SendMessageResponse>({
        method: "POST",
        url: "/api/chat",
        data: request,
        headers: {
          "Content-Type": "application/json"
        },
        timeout: 5000 // 5 second timeout
      });
      
      // If successful, return the server response
      return response;
    } catch (error) {
      console.log("Server API unavailable, using fallback mechanism");
      
      // Fall back to the existing chat functionality
      return sendChatMessage(request);
    }
  },
  
  /**
   * Check the health status of the chat service
   */
  checkHealth: async (): Promise<{ status: string }> => {
    try {
      return await apiRequest({
        method: "GET",
        url: "/api/health",
        timeout: 2000
      });
    } catch (error) {
      console.log("Health check failed:", error);
      return { status: "unhealthy" };
    }
  }
};
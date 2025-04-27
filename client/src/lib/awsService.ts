import { SendMessageRequest, SendMessageResponse } from "@/types";
import { awsConfig, healthResponses } from "./aws-config";
import { trackEvent } from "@/utils/analytics";
import { sendEnhancedChatMessage } from "./openaiService";

/**
 * Send a message to the healthcare chatbot service via API Gateway
 * In production, this would connect to AWS services like Lex and Lambda
 */
export async function sendChatMessage(
  request: SendMessageRequest
): Promise<SendMessageResponse> {
  try {
    console.log("Processing chat message:", request.message);
    
    // When in development mode, always use enhanced responses for the best experience
    // This is a hybrid approach where we use local fallbacks as needed
    try {
      // For better responses, we'll try using the most advanced approach first
      // This combines OpenAI intelligence with pre-defined healthcare content
      const enhancedResponse = await sendEnhancedChatMessage(request);
      return enhancedResponse;
    } catch (enhancedError) {
      console.error("Enhanced chat service error:", enhancedError);
      trackEvent("enhanced_error", { error: String(enhancedError) });
      // Continue to fallback options
    }
    
    // In a production environment, this would make a real API call to AWS services
    const endpoint = awsConfig.apiGateway?.endpoint || "";
    
    // Try to use the API Gateway if configured
    if (endpoint && endpoint !== "https://example-api.execute-api.us-east-1.amazonaws.com/prod") {
      console.log("Attempting to use AWS API Gateway...");
      const response = await fetch(`${endpoint}/chat`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(request)
      });
      
      if (!response.ok) {
        throw new Error(`API request failed with status ${response.status}`);
      }
      
      return await response.json();
    }
    
    // If all else fails, use the local fallback responses
    console.log("Using offline response handler...");
    return handleOfflineResponse(request);
  } catch (error) {
    console.error("Error sending message to chatbot service:", error);
    trackEvent("api_error", { error: String(error) });
    
    // Fallback to local response if all other methods fail
    return handleOfflineResponse(request);
  }
}

/**
 * Handles local response generation when AWS services are unavailable
 */
function handleOfflineResponse(request: SendMessageRequest): Promise<SendMessageResponse> {
  return new Promise((resolve) => {
    // Simulate network delay
    setTimeout(() => {
      const { message } = request;
      let response = healthResponses.fallback;
      
      // Check for predefined responses
      const matchedSuggestion = healthResponses.suggestions.find(
        (suggestion) => message.toLowerCase().includes(suggestion.query.toLowerCase())
      );
      
      if (matchedSuggestion) {
        response = matchedSuggestion.response;
      } else if (message.toLowerCase().includes("melatonin") || message.toLowerCase().includes("supplement")) {
        response = `
          <p class="text-gray-800 mb-3">Melatonin is a hormone that your body naturally produces to regulate sleep-wake cycles. As a supplement, it's considered relatively safe for short-term use.</p>
          <p class="text-gray-800 mb-3">Some key points about melatonin supplements:</p>
          <ul class="list-disc pl-5 mb-3 text-gray-800 space-y-1">
            <li>Generally recognized as safe for adults when used short-term</li>
            <li>Typical dosages range from 0.5mg to 5mg taken 30-60 minutes before bedtime</li>
            <li>Side effects may include headache, dizziness, nausea, and drowsiness</li>
            <li>Interactions with certain medications are possible</li>
          </ul>
          <p class="text-gray-800">It's always recommended to speak with a healthcare provider before starting any supplement, especially if you have underlying health conditions or take other medications.</p>
        `;
      } else if (message.toLowerCase().includes("sleep") || message.toLowerCase().includes("insomnia")) {
        response = `
          <p class="text-gray-800 mb-3">I'm sorry to hear you're having trouble sleeping. Sleep issues can be frustrating, but there are several evidence-based strategies that might help:</p>
          <ul class="list-disc pl-5 mb-3 text-gray-800 space-y-1">
            <li>Establish a consistent sleep schedule (same bedtime/wake time)</li>
            <li>Create a relaxing bedtime routine</li>
            <li>Limit screen time 1-2 hours before bed</li>
            <li>Keep your bedroom cool, dark, and quiet</li>
            <li>Avoid caffeine, large meals, and alcohol before bedtime</li>
            <li>Try relaxation techniques like deep breathing or meditation</li>
          </ul>
          <p class="text-gray-800">If sleep problems persist for more than a few weeks or significantly impact your daily life, consider speaking with a healthcare provider as it could indicate an underlying sleep disorder that requires treatment.</p>
        `;
      }
      
      resolve({
        message: response,
        sessionId: request.sessionId
      });
    }, 1000); // Simulate network delay
  });
}

/**
 * Generate a unique session ID for the chat
 */
export function generateSessionId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substring(2);
}

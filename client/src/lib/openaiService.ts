import OpenAI from "openai";
import { SendMessageRequest, SendMessageResponse } from "@/types";
import { healthResponses } from "./aws-config";

// Initialize OpenAI client
// the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
const openai = new OpenAI({
  apiKey: import.meta.env.VITE_OPENAI_API_KEY || "",
  dangerouslyAllowBrowser: true // For client-side usage (in production, API calls should be made server-side)
});

/**
 * Process a healthcare query using OpenAI
 */
export async function processHealthcareQuery(query: string): Promise<string> {
  try {
    // Check if OpenAI API key is available
    if (!import.meta.env.VITE_OPENAI_API_KEY) {
      throw new Error("OpenAI API key not configured");
    }

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: 
            "You are an AI healthcare assistant providing general health information. " +
            "You can offer general medical information, lifestyle advice, and wellness tips. " +
            "However, you must include clear disclaimers that you're not providing medical diagnoses " +
            "and users should consult healthcare professionals for personalized medical advice. " +
            "Format your responses with HTML tags for better display (<p>, <ul>, <li>, etc.)."
        },
        {
          role: "user",
          content: query
        }
      ],
      temperature: 0.7,
      max_tokens: 500
    });

    let formattedResponse = response.choices[0].message.content || "I apologize, but I couldn't generate a response.";
    
    // Add disclaimer if not already present
    if (!formattedResponse.toLowerCase().includes("disclaimer") && 
        !formattedResponse.toLowerCase().includes("consult")) {
      formattedResponse += `
        <p class="text-amber-700 mt-4 text-sm">
          <strong>Disclaimer:</strong> This information is for educational purposes only and is not a substitute 
          for professional medical advice. Always consult a qualified healthcare provider for medical concerns.
        </p>
      `;
    }

    return formattedResponse;
  } catch (error) {
    console.error("Error processing query with OpenAI:", error);
    return getLocalFallbackResponse(query);
  }
}

/**
 * Get a local fallback response when OpenAI is unavailable
 */
function getLocalFallbackResponse(query: string): string {
  // Check for predefined responses
  const matchedSuggestion = healthResponses.suggestions.find(
    (suggestion) => query.toLowerCase().includes(suggestion.query.toLowerCase())
  );
  
  if (matchedSuggestion) {
    return matchedSuggestion.response;
  }
  
  return `
    <p class="text-gray-800">I'm sorry, but I'm having trouble accessing the healthcare knowledge base at the moment. Here are some general resources that might help:</p>
    <ul class="list-disc pl-5 mb-3 text-gray-800 space-y-1">
      <li>For urgent medical concerns, please contact your doctor or local emergency services.</li>
      <li>For reliable health information, consider visiting websites like the CDC (cdc.gov) or Mayo Clinic (mayoclinic.org).</li>
      <li>You can try asking your question again later when our service is fully operational.</li>
    </ul>
    <p class="text-gray-800">Thank you for your understanding.</p>
  `;
}

/**
 * Enhanced version of sendChatMessage that uses OpenAI for responses
 */
export async function sendEnhancedChatMessage(
  request: SendMessageRequest
): Promise<SendMessageResponse> {
  try {
    // Process the user's message with OpenAI
    const response = await processHealthcareQuery(request.message);
    
    return {
      message: response,
      sessionId: request.sessionId
    };
  } catch (error) {
    console.error("Error sending enhanced chat message:", error);
    
    return {
      message: getLocalFallbackResponse(request.message),
      sessionId: request.sessionId
    };
  }
}
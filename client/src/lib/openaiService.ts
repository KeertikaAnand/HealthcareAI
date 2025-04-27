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
    console.log("Processing healthcare query:", query);
    
    // Check if OpenAI API key is available
    if (!import.meta.env.VITE_OPENAI_API_KEY) {
      console.error("OpenAI API key not configured");
      throw new Error("OpenAI API key not configured");
    }
    
    // Handle empty queries
    if (!query || query.trim() === "") {
      return "Please ask a healthcare-related question.";
    }

    console.log("Sending request to OpenAI API...");
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: 
            "You are an AI healthcare assistant providing general health information. " +
            "You can offer general medical information, lifestyle advice, and wellness tips. " +
            "You should always provide a helpful, detailed response for any health-related query. " +
            "For topics like women's health, mental health, chronic conditions, or any medical topic, " +
            "provide factual, evidence-based information with compassion. " +
            "You must include clear disclaimers that you're not providing medical diagnoses " +
            "and users should consult healthcare professionals for personalized medical advice. " +
            "Format your responses with HTML tags for better display (<p>, <ul>, <li>, etc.)."
        },
        {
          role: "user",
          content: query
        }
      ],
      temperature: 0.7,
      max_tokens: 800
    });

    console.log("Received response from OpenAI");
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
    
    if (error instanceof Error) {
      console.log("Error details:", error.message);
      if ('cause' in error) {
        console.log("Error cause:", error.cause);
      }
    }
    
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
  
  // Add specific responses for common health topics
  const lowerQuery = query.toLowerCase();
  
  if (lowerQuery.includes("period") || lowerQuery.includes("menstrual") || lowerQuery.includes("menstruation")) {
    return `
      <p class="text-gray-800 mb-3">Menstrual pain, or dysmenorrhea, is a common experience during periods. The pain typically occurs in the lower abdomen but can also radiate to the lower back and thighs.</p>
      <p class="text-gray-800 mb-3">Some ways to manage period pain include:</p>
      <ul class="list-disc pl-5 mb-3 text-gray-800 space-y-1">
        <li>Over-the-counter pain relievers like ibuprofen or naproxen</li>
        <li>Applying heat with a heating pad or warm bath</li>
        <li>Gentle exercise like walking or stretching</li>
        <li>Adequate rest and stress management</li>
        <li>Staying hydrated and maintaining a balanced diet</li>
      </ul>
      <p class="text-gray-800">If period pain is severe, disrupts daily activities, or has suddenly worsened, it's important to consult with a healthcare provider as it could indicate an underlying condition that requires treatment.</p>
      <p class="text-amber-700 mt-4 text-sm">
        <strong>Disclaimer:</strong> This information is for educational purposes only and is not a substitute 
        for professional medical advice. Always consult a qualified healthcare provider for medical concerns.
      </p>
    `;
  }
  
  if (lowerQuery.includes("pregnancy") || lowerQuery.includes("pregnant")) {
    return `
      <p class="text-gray-800 mb-3">Pregnancy is a significant life event that involves many physical and emotional changes. It's important to receive proper prenatal care throughout pregnancy.</p>
      <p class="text-gray-800 mb-3">Some general guidelines for a healthy pregnancy include:</p>
      <ul class="list-disc pl-5 mb-3 text-gray-800 space-y-1">
        <li>Regular prenatal check-ups with a healthcare provider</li>
        <li>Taking prescribed prenatal vitamins</li>
        <li>Eating a balanced, nutritious diet</li>
        <li>Staying physically active as recommended by your healthcare provider</li>
        <li>Avoiding alcohol, tobacco, and recreational drugs</li>
        <li>Managing stress through healthy coping mechanisms</li>
      </ul>
      <p class="text-gray-800">Every pregnancy is unique, and specific recommendations may vary based on individual circumstances. It's essential to work closely with healthcare providers for personalized guidance.</p>
      <p class="text-amber-700 mt-4 text-sm">
        <strong>Disclaimer:</strong> This information is for educational purposes only and is not a substitute 
        for professional medical advice. Always consult a qualified healthcare provider for medical concerns.
      </p>
    `;
  }
  
  if (lowerQuery.includes("headache") || lowerQuery.includes("migraine")) {
    return `
      <p class="text-gray-800 mb-3">Headaches can have various causes, from tension to dehydration to underlying health conditions. Migraines are a specific type of headache that can be particularly debilitating.</p>
      <p class="text-gray-800 mb-3">Some general strategies to manage headaches include:</p>
      <ul class="list-disc pl-5 mb-3 text-gray-800 space-y-1">
        <li>Over-the-counter pain relievers like acetaminophen or ibuprofen</li>
        <li>Resting in a quiet, dark room</li>
        <li>Applying a cool compress to the forehead</li>
        <li>Staying hydrated</li>
        <li>Managing stress through relaxation techniques</li>
        <li>Maintaining regular sleep patterns</li>
      </ul>
      <p class="text-gray-800">If headaches are severe, frequent, or accompanied by other symptoms like fever, confusion, or stiff neck, seek immediate medical attention as these could indicate a more serious condition.</p>
      <p class="text-amber-700 mt-4 text-sm">
        <strong>Disclaimer:</strong> This information is for educational purposes only and is not a substitute 
        for professional medical advice. Always consult a qualified healthcare provider for medical concerns.
      </p>
    `;
  }
  
  // Default fallback for all other queries
  return `
    <p class="text-gray-800">I'm sorry, but I'm having trouble accessing the healthcare knowledge base at the moment. Here are some general resources that might help:</p>
    <ul class="list-disc pl-5 mb-3 text-gray-800 space-y-1">
      <li>For urgent medical concerns, please contact your doctor or local emergency services.</li>
      <li>For reliable health information, consider visiting websites like the CDC (cdc.gov) or Mayo Clinic (mayoclinic.org).</li>
      <li>You can try asking your question again later when our service is fully operational.</li>
    </ul>
    <p class="text-gray-800">Thank you for your understanding.</p>
    <p class="text-amber-700 mt-4 text-sm">
      <strong>Disclaimer:</strong> This information is for educational purposes only and is not a substitute 
      for professional medical advice. Always consult a qualified healthcare provider for medical concerns.
    </p>
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
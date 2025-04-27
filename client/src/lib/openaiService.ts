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
  console.log("Using fallback response for query:", query);
  
  // Check for predefined responses
  const matchedSuggestion = healthResponses.suggestions.find(
    (suggestion) => query.toLowerCase().includes(suggestion.query.toLowerCase())
  );
  
  if (matchedSuggestion) {
    return matchedSuggestion.response;
  }
  
  // Add specific responses for common health topics
  const lowerQuery = query.toLowerCase();
  
  // Women's health topics
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
  
  // Pregnancy
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
  
  // Headaches
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
  
  // Common cold
  if (lowerQuery.includes("cold") || lowerQuery.includes("cough") || lowerQuery.includes("sneezing") || lowerQuery.includes("runny nose")) {
    return `
      <p class="text-gray-800 mb-3">The common cold is a viral infection of the upper respiratory tract. Symptoms typically develop 1-3 days after exposure to the virus and may include:</p>
      <ul class="list-disc pl-5 mb-3 text-gray-800 space-y-1">
        <li>Runny or stuffy nose</li>
        <li>Sore throat</li>
        <li>Cough</li>
        <li>Congestion</li>
        <li>Slight body aches or mild headache</li>
        <li>Sneezing</li>
        <li>Low-grade fever</li>
        <li>Generally feeling unwell</li>
      </ul>
      <p class="text-gray-800 mb-3">Treatment for the common cold focuses on relieving symptoms:</p>
      <ul class="list-disc pl-5 mb-3 text-gray-800 space-y-1">
        <li>Rest and adequate fluid intake</li>
        <li>Over-the-counter pain relievers for aches and fever</li>
        <li>Decongestants for nasal congestion</li>
        <li>Cough suppressants for persistent cough</li>
        <li>Salt water gargle for sore throat</li>
      </ul>
      <p class="text-gray-800">Symptoms usually peak within 2-3 days and can last 7-10 days, although some may persist for up to two weeks. Consult a healthcare provider if symptoms are severe, worsen after a week, or if you have underlying health conditions.</p>
      <p class="text-amber-700 mt-4 text-sm">
        <strong>Disclaimer:</strong> This information is for educational purposes only and is not a substitute 
        for professional medical advice. Always consult a qualified healthcare provider for medical concerns.
      </p>
    `;
  }
  
  // Fever
  if (lowerQuery.includes("fever") || lowerQuery.includes("temperature") || lowerQuery.includes("high temp")) {
    return `
      <p class="text-gray-800 mb-3">Fever is a temporary increase in body temperature, often due to an illness. An adult is typically considered to have a fever when their body temperature is 100.4°F (38°C) or higher.</p>
      <p class="text-gray-800 mb-3">Common causes of fever include:</p>
      <ul class="list-disc pl-5 mb-3 text-gray-800 space-y-1">
        <li>Viral infections like the common cold or flu</li>
        <li>Bacterial infections such as strep throat or urinary tract infections</li>
        <li>Inflammatory conditions</li>
        <li>Medication reactions</li>
        <li>Immunizations</li>
      </ul>
      <p class="text-gray-800 mb-3">To manage a fever:</p>
      <ul class="list-disc pl-5 mb-3 text-gray-800 space-y-1">
        <li>Stay hydrated with water, clear broths, or sports drinks</li>
        <li>Rest and avoid physical exertion</li>
        <li>Take over-the-counter fever reducers like acetaminophen or ibuprofen as directed</li>
        <li>Dress in lightweight clothing and use light blankets</li>
        <li>Take a lukewarm bath or apply cool compresses</li>
      </ul>
      <p class="text-gray-800">Seek medical attention if the fever is extremely high (above 103°F or 39.4°C), lasts more than three days, or is accompanied by severe headache, unusual skin rash, persistent vomiting, difficulty breathing, or seizures.</p>
      <p class="text-amber-700 mt-4 text-sm">
        <strong>Disclaimer:</strong> This information is for educational purposes only and is not a substitute 
        for professional medical advice. Always consult a qualified healthcare provider for medical concerns.
      </p>
    `;
  }
  
  // Nutrition
  if (lowerQuery.includes("nutrition") || lowerQuery.includes("diet") || lowerQuery.includes("food") || lowerQuery.includes("eat")) {
    return `
      <p class="text-gray-800 mb-3">Good nutrition is essential for overall health and wellbeing. A balanced diet typically includes:</p>
      <ul class="list-disc pl-5 mb-3 text-gray-800 space-y-1">
        <li>Fruits and vegetables for vitamins, minerals, and fiber</li>
        <li>Whole grains for energy and additional fiber</li>
        <li>Lean proteins for muscle maintenance and cellular function</li>
        <li>Dairy or dairy alternatives for calcium and vitamin D</li>
        <li>Healthy fats for hormone production and nutrient absorption</li>
      </ul>
      <p class="text-gray-800 mb-3">General nutrition guidelines include:</p>
      <ul class="list-disc pl-5 mb-3 text-gray-800 space-y-1">
        <li>Eating a variety of foods from all food groups</li>
        <li>Limiting processed foods, added sugars, and excessive salt</li>
        <li>Staying hydrated, primarily with water</li>
        <li>Being mindful of portion sizes</li>
        <li>Eating regularly throughout the day</li>
      </ul>
      <p class="text-gray-800">Nutritional needs vary based on age, sex, activity level, and health status. Consider consulting with a registered dietitian for personalized dietary recommendations.</p>
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
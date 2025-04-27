import { AwsConfig } from "@/types";

// AWS Configuration
export const awsConfig: AwsConfig = {
  region: import.meta.env.VITE_AWS_REGION || "us-east-1",
  apiGateway: {
    endpoint: import.meta.env.VITE_API_GATEWAY_ENDPOINT || "https://example-api.execute-api.us-east-1.amazonaws.com/prod",
  },
  lex: {
    botId: import.meta.env.VITE_LEX_BOT_ID || "",
    botAlias: import.meta.env.VITE_LEX_BOT_ALIAS || "",
    localeId: import.meta.env.VITE_LEX_LOCALE_ID || "en_US",
  }
};

// Default health response when services are unavailable
export const healthResponses = {
  initialGreeting: "Hello! I'm here to help with your health questions. How can I assist you today?",
  fallback: "I apologize, but I'm having trouble connecting to the healthcare knowledge base at the moment. Please try again shortly.",
  suggestions: [
    {
      query: "Common cold symptoms",
      response: `
        <p class="text-gray-800 mb-3">Common cold symptoms typically develop 1-3 days after exposure to the virus and may include:</p>
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
        <p class="text-gray-800">Symptoms usually peak within 2-3 days and can last 7-10 days, although some may persist for up to two weeks.</p>
      `
    },
    {
      query: "Headache remedies",
      response: `
        <p class="text-gray-800 mb-3">Here are some evidence-based remedies that may help relieve headaches:</p>
        <ul class="list-disc pl-5 mb-3 text-gray-800 space-y-1">
          <li>Over-the-counter pain relievers (acetaminophen, ibuprofen, aspirin)</li>
          <li>Stay hydrated by drinking plenty of water</li>
          <li>Rest in a quiet, dark room</li>
          <li>Apply cold or warm compresses to your head</li>
          <li>Maintain regular sleep patterns</li>
          <li>Practice relaxation techniques like deep breathing or meditation</li>
          <li>Gentle massage of neck and temples</li>
          <li>Caffeine (in moderation)</li>
        </ul>
        <p class="text-gray-800">If you experience severe or recurring headaches, consult with a healthcare provider as they could indicate an underlying condition requiring medical attention.</p>
      `
    },
    {
      query: "Stress management",
      response: `
        <p class="text-gray-800 mb-3">Effective stress management techniques include:</p>
        <ul class="list-disc pl-5 mb-3 text-gray-800 space-y-1">
          <li>Regular physical activity (30 minutes most days)</li>
          <li>Relaxation practices like deep breathing, meditation, yoga</li>
          <li>Getting adequate sleep (7-9 hours for most adults)</li>
          <li>Maintaining social connections and support networks</li>
          <li>Setting realistic goals and priorities</li>
          <li>Practicing mindfulness and staying present</li>
          <li>Limiting caffeine and alcohol intake</li>
          <li>Taking breaks from news and social media</li>
        </ul>
        <p class="text-gray-800">If stress is significantly impacting your daily life or mental health, consider speaking with a healthcare provider or mental health professional.</p>
      `
    },
    {
      query: "COVID-19 info",
      response: `
        <p class="text-gray-800 mb-3">COVID-19 is caused by the SARS-CoV-2 virus. Common symptoms include:</p>
        <ul class="list-disc pl-5 mb-3 text-gray-800 space-y-1">
          <li>Fever or chills</li>
          <li>Cough</li>
          <li>Shortness of breath or difficulty breathing</li>
          <li>Fatigue</li>
          <li>Muscle or body aches</li>
          <li>Headache</li>
          <li>New loss of taste or smell</li>
          <li>Sore throat</li>
          <li>Congestion or runny nose</li>
          <li>Nausea or vomiting</li>
          <li>Diarrhea</li>
        </ul>
        <p class="text-gray-800 mb-3">Prevention measures include vaccination, good hand hygiene, improving ventilation, and wearing masks in high-risk settings.</p>
        <p class="text-gray-800">If you think you might have COVID-19, consider getting tested and follow current CDC guidelines for isolation.</p>
      `
    }
  ]
};

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
    const apiKey = import.meta.env.VITE_OPENAI_API_KEY;
    if (!apiKey) {
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
  
  // Thyroid conditions
  if (lowerQuery.includes("thyroid") || lowerQuery.includes("hypothyroidism") || lowerQuery.includes("hyperthyroidism")) {
    return `
      <p class="text-gray-800 mb-3">The thyroid is a butterfly-shaped gland in the neck that produces hormones that regulate metabolism, energy, and growth. Common thyroid conditions include:</p>
      
      <p class="text-gray-800 mb-3"><strong>Hypothyroidism (underactive thyroid):</strong></p>
      <ul class="list-disc pl-5 mb-3 text-gray-800 space-y-1">
        <li>Symptoms: Fatigue, weight gain, cold intolerance, dry skin, constipation, depression</li>
        <li>Causes: Hashimoto's thyroiditis (autoimmune), iodine deficiency, certain medications</li>
        <li>Treatment: Daily thyroid hormone replacement medication (levothyroxine)</li>
      </ul>
      
      <p class="text-gray-800 mb-3"><strong>Hyperthyroidism (overactive thyroid):</strong></p>
      <ul class="list-disc pl-5 mb-3 text-gray-800 space-y-1">
        <li>Symptoms: Weight loss, rapid heartbeat, anxiety, tremors, heat intolerance, sleep problems</li>
        <li>Causes: Graves' disease (autoimmune), thyroid nodules, thyroiditis</li>
        <li>Treatment: Anti-thyroid medications, radioactive iodine, beta-blockers, or surgery</li>
      </ul>
      
      <p class="text-gray-800 mb-3">Thyroid conditions are diagnosed through blood tests that measure thyroid hormone levels (TSH, T4, T3) and sometimes imaging tests or biopsies. Most thyroid conditions can be effectively managed with proper medical care.</p>
      
      <p class="text-gray-800">If you're experiencing symptoms that may be related to thyroid function, consult with a healthcare provider for proper evaluation and treatment.</p>
      
      <p class="text-amber-700 mt-4 text-sm">
        <strong>Disclaimer:</strong> This information is for educational purposes only and is not a substitute 
        for professional medical advice. Always consult a qualified healthcare provider for medical concerns.
      </p>
    `;
  }
  
  // Heart conditions
  if (lowerQuery.includes("heart") || lowerQuery.includes("cardiac") || lowerQuery.includes("chest pain")) {
    return `
      <p class="text-gray-800 mb-3">Heart issues can range from minor concerns to serious medical emergencies. If you're experiencing chest pain, shortness of breath, or suspect a heart attack, call emergency services (911) immediately.</p>
      
      <p class="text-gray-800 mb-3"><strong>Warning signs of a heart attack include:</strong></p>
      <ul class="list-disc pl-5 mb-3 text-gray-800 space-y-1">
        <li>Chest pain or discomfort that may feel like pressure, squeezing, fullness, or pain</li>
        <li>Pain or discomfort in one or both arms, the back, neck, jaw, or stomach</li>
        <li>Shortness of breath (with or without chest discomfort)</li>
        <li>Breaking out in a cold sweat, nausea, or lightheadedness</li>
        <li>Women may experience less obvious symptoms like unusual fatigue, sleep disturbances, or shortness of breath</li>
      </ul>
      
      <p class="text-gray-800 mb-3"><strong>Heart attack response:</strong></p>
      <ul class="list-disc pl-5 mb-3 text-gray-800 space-y-1">
        <li>Call emergency services (911) immediately</li>
        <li>If prescribed, take nitroglycerin as directed</li>
        <li>If not allergic to aspirin, take one (if advised by emergency dispatchers)</li>
        <li>Begin CPR if the person is unconscious</li>
        <li>If an AED (automated external defibrillator) is available, use it if necessary</li>
      </ul>
      
      <p class="text-red-700 font-bold">This is a medical emergency requiring immediate professional attention. Do not delay seeking help.</p>
      
      <p class="text-amber-700 mt-4 text-sm">
        <strong>Disclaimer:</strong> This information is for educational purposes only and is not a substitute 
        for professional medical advice. Always consult a qualified healthcare provider for medical concerns.
      </p>
    `;
  }
  
  // Respiratory conditions
  if (lowerQuery.includes("asthma") || lowerQuery.includes("breathing") || lowerQuery.includes("inhaler")) {
    return `
      <p class="text-gray-800 mb-3">Asthma is a chronic condition affecting the airways in the lungs, causing inflammation and narrowing that leads to breathing difficulties. It affects people of all ages and often begins in childhood.</p>
      
      <p class="text-gray-800 mb-3"><strong>Common asthma symptoms include:</strong></p>
      <ul class="list-disc pl-5 mb-3 text-gray-800 space-y-1">
        <li>Shortness of breath</li>
        <li>Chest tightness or pain</li>
        <li>Wheezing when exhaling (especially in children)</li>
        <li>Trouble sleeping due to breathing difficulties</li>
        <li>Coughing attacks worsened by respiratory viruses</li>
      </ul>
      
      <p class="text-gray-800 mb-3"><strong>Asthma triggers may include:</strong></p>
      <ul class="list-disc pl-5 mb-3 text-gray-800 space-y-1">
        <li>Allergens (pollen, dust mites, pet dander)</li>
        <li>Respiratory infections</li>
        <li>Physical activity (exercise-induced asthma)</li>
        <li>Cold air or weather changes</li>
        <li>Air pollutants and irritants</li>
        <li>Strong emotions and stress</li>
      </ul>
      
      <p class="text-gray-800 mb-3"><strong>Asthma management typically includes:</strong></p>
      <ul class="list-disc pl-5 mb-3 text-gray-800 space-y-1">
        <li>Quick-relief medications (rescue inhalers) for immediate symptom relief</li>
        <li>Long-term control medications to reduce inflammation and prevent symptoms</li>
        <li>Avoiding known triggers</li>
        <li>Monitoring breathing with a peak flow meter</li>
        <li>Following an asthma action plan developed with a healthcare provider</li>
      </ul>
      
      <p class="text-gray-800">If you experience severe asthma symptoms like extreme difficulty breathing, bluish lips, or severe fatigue, seek emergency medical care immediately. With proper treatment and management, most people with asthma can lead normal, active lives.</p>
      
      <p class="text-amber-700 mt-4 text-sm">
        <strong>Disclaimer:</strong> This information is for educational purposes only and is not a substitute 
        for professional medical advice. Always consult a qualified healthcare provider for medical concerns.
      </p>
    `;
  }
  
  // Bone and injury conditions
  if (lowerQuery.includes("fracture") || lowerQuery.includes("broken bone") || lowerQuery.includes("sprain") || lowerQuery.includes("bone")) {
    return `
      <p class="text-gray-800 mb-3">A fracture is a broken bone that can range from a thin crack to a complete break. Fractures commonly occur due to trauma, overuse, or conditions that weaken bones like osteoporosis.</p>
      
      <p class="text-gray-800 mb-3"><strong>Common signs of a fracture include:</strong></p>
      <ul class="list-disc pl-5 mb-3 text-gray-800 space-y-1">
        <li>Pain that intensifies with movement or pressure</li>
        <li>Swelling, bruising, or tenderness around the injury</li>
        <li>Visible deformity or bone protruding through the skin (in severe cases)</li>
        <li>Inability to bear weight or use the affected area normally</li>
        <li>A grinding or grating sensation with movement (crepitus)</li>
      </ul>
      
      <p class="text-gray-800 mb-3"><strong>First aid for suspected fractures:</strong></p>
      <ul class="list-disc pl-5 mb-3 text-gray-800 space-y-1">
        <li>Stop any bleeding by applying gentle pressure with a clean cloth</li>
        <li>Immobilize the injured area using a splint if available</li>
        <li>Apply ice wrapped in a cloth to reduce swelling (20 minutes on, 20 minutes off)</li>
        <li>Keep the injured area elevated if possible</li>
        <li>Do not attempt to realign a bone or push a protruding bone back in place</li>
      </ul>
      
      <p class="text-gray-800 mb-3"><strong>When to seek emergency care:</strong></p>
      <ul class="list-disc pl-5 mb-3 text-gray-800 space-y-1">
        <li>Bone is protruding through the skin</li>
        <li>The affected limb or joint appears deformed</li>
        <li>There is severe bleeding, numbness, or bluish color</li>
        <li>Fracture is suspected in the head, neck, back, hip, pelvis, or upper leg</li>
        <li>The injured person is unresponsive or has multiple injuries</li>
      </ul>
      
      <p class="text-gray-800">Treatment typically involves immobilization (casting, splinting, or surgery) followed by rehabilitation. Recovery time varies depending on the fracture's location and severity, the patient's age, and overall health.</p>
      
      <p class="text-amber-700 mt-4 text-sm">
        <strong>Disclaimer:</strong> This information is for educational purposes only and is not a substitute 
        for professional medical advice. Always consult a qualified healthcare provider for medical concerns.
      </p>
    `;
  }
  
  // Diabetes information
  if (lowerQuery.includes("diabetes") || lowerQuery.includes("blood sugar") || lowerQuery.includes("insulin")) {
    return `
      <p class="text-gray-800 mb-3">Diabetes is a chronic condition that affects how your body turns food into energy. It occurs when your body doesn't make enough insulin or can't use it effectively, resulting in high blood sugar levels.</p>
      
      <p class="text-gray-800 mb-3"><strong>There are three main types of diabetes:</strong></p>
      <ul class="list-disc pl-5 mb-3 text-gray-800 space-y-1">
        <li><strong>Type 1:</strong> The body doesn't produce insulin, usually diagnosed in children and young adults</li>
        <li><strong>Type 2:</strong> The body doesn't use insulin properly, most common type, often related to lifestyle factors</li>
        <li><strong>Gestational:</strong> Develops during pregnancy, usually resolves after childbirth</li>
      </ul>
      
      <p class="text-gray-800 mb-3"><strong>Common symptoms of diabetes include:</strong></p>
      <ul class="list-disc pl-5 mb-3 text-gray-800 space-y-1">
        <li>Increased thirst and urination</li>
        <li>Extreme hunger</li>
        <li>Unexplained weight loss (Type 1) or gain (Type 2)</li>
        <li>Fatigue</li>
        <li>Blurred vision</li>
        <li>Slow-healing sores</li>
        <li>Frequent infections</li>
      </ul>
      
      <p class="text-gray-800 mb-3"><strong>Management strategies typically include:</strong></p>
      <ul class="list-disc pl-5 mb-3 text-gray-800 space-y-1">
        <li>Regular blood sugar monitoring</li>
        <li>Insulin therapy (especially for Type 1)</li>
        <li>Oral medications (primarily for Type 2)</li>
        <li>Healthy eating with carbohydrate management</li>
        <li>Regular physical activity</li>
        <li>Maintaining a healthy weight</li>
        <li>Regular medical check-ups</li>
      </ul>
      
      <p class="text-gray-800">Early diagnosis and treatment are important to prevent serious complications affecting the heart, eyes, kidneys, nerves, and other body systems. If you're experiencing symptoms of diabetes, consult a healthcare provider.</p>
      
      <p class="text-amber-700 mt-4 text-sm">
        <strong>Disclaimer:</strong> This information is for educational purposes only and is not a substitute 
        for professional medical advice. Always consult a qualified healthcare provider for medical concerns.
      </p>
    `;
  }
  
  // Allergies information
  if (lowerQuery.includes("allergy") || lowerQuery.includes("allergic") || lowerQuery.includes("allergen")) {
    return `
      <p class="text-gray-800 mb-3">Allergies occur when your immune system reacts to a foreign substance (allergen) that doesn't cause a reaction in most people. These reactions can range from mild to severe and life-threatening.</p>
      
      <p class="text-gray-800 mb-3"><strong>Common allergens include:</strong></p>
      <ul class="list-disc pl-5 mb-3 text-gray-800 space-y-1">
        <li>Pollen, dust mites, mold, and pet dander</li>
        <li>Foods (particularly nuts, shellfish, eggs, milk, wheat, soy)</li>
        <li>Insect stings or bites</li>
        <li>Medications (penicillin, aspirin, etc.)</li>
        <li>Latex</li>
      </ul>
      
      <p class="text-gray-800 mb-3"><strong>Allergy symptoms can include:</strong></p>
      <ul class="list-disc pl-5 mb-3 text-gray-800 space-y-1">
        <li>Sneezing, runny or stuffy nose</li>
        <li>Itchy, watery eyes</li>
        <li>Skin reactions (hives, rashes, swelling)</li>
        <li>Breathing difficulties or wheezing</li>
        <li>Digestive issues (for food allergies)</li>
      </ul>
      
      <p class="text-gray-800 mb-3"><strong>Anaphylaxis is a severe, potentially life-threatening allergic reaction with symptoms like:</strong></p>
      <ul class="list-disc pl-5 mb-3 text-gray-800 space-y-1">
        <li>Constriction of airways and trouble breathing</li>
        <li>Swelling of throat and tongue</li>
        <li>Severe drop in blood pressure</li>
        <li>Rapid pulse</li>
        <li>Dizziness, lightheadedness, or loss of consciousness</li>
      </ul>
      
      <p class="text-red-700 font-bold">If someone is experiencing anaphylaxis, use an epinephrine injector (like an EpiPen) if available and seek emergency medical help immediately.</p>
      
      <p class="text-gray-800 mb-3">Allergy management typically includes:</p>
      <ul class="list-disc pl-5 mb-3 text-gray-800 space-y-1">
        <li>Avoiding known allergens</li>
        <li>Medication (antihistamines, decongestants, corticosteroids)</li>
        <li>Immunotherapy (allergy shots)</li>
        <li>Emergency epinephrine for severe reactions</li>
      </ul>
      
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
  
  // Mental health
  if (lowerQuery.includes("mental health") || lowerQuery.includes("depression") || lowerQuery.includes("anxiety") || lowerQuery.includes("stress") || lowerQuery.includes("therapy")) {
    return `
      <p class="text-gray-800 mb-3">Mental health is an essential part of overall wellbeing, encompassing emotional, psychological, and social well-being. Mental health conditions are common and treatable.</p>
      
      <p class="text-gray-800 mb-3"><strong>Common mental health conditions include:</strong></p>
      <ul class="list-disc pl-5 mb-3 text-gray-800 space-y-1">
        <li><strong>Depression:</strong> Persistent sadness, loss of interest in activities, changes in sleep or appetite</li>
        <li><strong>Anxiety disorders:</strong> Excessive worry, fear, or nervousness that interferes with daily activities</li>
        <li><strong>Bipolar disorder:</strong> Extreme mood swings that include emotional highs and lows</li>
        <li><strong>Post-traumatic stress disorder (PTSD):</strong> Difficulty recovering after experiencing or witnessing a traumatic event</li>
        <li><strong>Schizophrenia:</strong> Distorted thinking, hallucinations, and altered perceptions of reality</li>
      </ul>
      
      <p class="text-gray-800 mb-3"><strong>Warning signs that may indicate a mental health concern:</strong></p>
      <ul class="list-disc pl-5 mb-3 text-gray-800 space-y-1">
        <li>Persistent sadness or irritability</li>
        <li>Excessive fears, worries, or feelings of guilt</li>
        <li>Extreme mood changes</li>
        <li>Social withdrawal</li>
        <li>Significant changes in eating or sleeping patterns</li>
        <li>Difficulty concentrating or completing routine tasks</li>
        <li>Thoughts of self-harm or suicide</li>
      </ul>
      
      <p class="text-gray-800 mb-3"><strong>Treatment options may include:</strong></p>
      <ul class="list-disc pl-5 mb-3 text-gray-800 space-y-1">
        <li>Psychotherapy (talk therapy) with a mental health professional</li>
        <li>Medication prescribed by a healthcare provider</li>
        <li>Self-care strategies (regular exercise, adequate sleep, stress management)</li>
        <li>Support groups</li>
        <li>Complementary approaches (mindfulness, meditation)</li>
      </ul>
      
      <p class="text-gray-800 mb-3">If you or someone you know is experiencing mental health difficulties, reaching out for help is a sign of strength, not weakness. Many resources are available, including:</p>
      <ul class="list-disc pl-5 mb-3 text-gray-800 space-y-1">
        <li>Mental health professionals (therapists, psychologists, psychiatrists)</li>
        <li>Primary care providers</li>
        <li>National Suicide Prevention Lifeline: 988 or 1-800-273-8255</li>
        <li>Crisis Text Line: Text HOME to 741741</li>
      </ul>
      
      <p class="text-amber-700 mt-4 text-sm">
        <strong>Disclaimer:</strong> This information is for educational purposes only and is not a substitute 
        for professional medical advice. Always consult a qualified healthcare provider for medical concerns.
      </p>
    `;
  }
  
  // COVID-19
  if (lowerQuery.includes("covid") || lowerQuery.includes("coronavirus") || lowerQuery.includes("sars-cov-2")) {
    return `
      <p class="text-gray-800 mb-3">COVID-19 is a respiratory illness caused by the SARS-CoV-2 virus, first identified in late 2019. The virus continues to circulate globally, and understanding its symptoms, prevention, and treatment remains important.</p>
      
      <p class="text-gray-800 mb-3"><strong>Common symptoms of COVID-19 include:</strong></p>
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
        <li>Nausea, vomiting, or diarrhea</li>
      </ul>
      
      <p class="text-gray-800 mb-3"><strong>Prevention strategies include:</strong></p>
      <ul class="list-disc pl-5 mb-3 text-gray-800 space-y-1">
        <li>Staying up to date with COVID-19 vaccines</li>
        <li>Improving ventilation in indoor spaces</li>
        <li>Following local public health guidelines</li>
        <li>Washing hands frequently with soap and water</li>
        <li>Staying home when sick</li>
        <li>Testing if you have symptoms or are exposed</li>
      </ul>
      
      <p class="text-gray-800 mb-3"><strong>If you test positive for COVID-19:</strong></p>
      <ul class="list-disc pl-5 mb-3 text-gray-800 space-y-1">
        <li>Follow isolation guidelines recommended by your local health authorities</li>
        <li>Contact your healthcare provider, especially if you're at high risk for severe disease</li>
        <li>Monitor your symptoms and seek medical care if they worsen</li>
        <li>Stay hydrated and get plenty of rest</li>
        <li>Take over-the-counter medications as needed for symptom relief</li>
      </ul>
      
      <p class="text-gray-800">COVID-19 treatment options have evolved and may include antiviral medications for those at higher risk. Consult with a healthcare provider for the most current recommendations based on your specific situation.</p>
      
      <p class="text-amber-700 mt-4 text-sm">
        <strong>Disclaimer:</strong> This information is for educational purposes only and is not a substitute 
        for professional medical advice. Always consult a qualified healthcare provider for medical concerns.
      </p>
    `;
  }
  
  // Skin conditions
  if (lowerQuery.includes("skin") || lowerQuery.includes("rash") || lowerQuery.includes("acne") || lowerQuery.includes("eczema") || lowerQuery.includes("psoriasis")) {
    return `
      <p class="text-gray-800 mb-3">Skin conditions are diverse and can range from temporary irritations to chronic diseases. The skin is the body's largest organ and plays a vital role in protecting against pathogens, regulating body temperature, and providing sensory information.</p>
      
      <p class="text-gray-800 mb-3"><strong>Common skin conditions include:</strong></p>
      <ul class="list-disc pl-5 mb-3 text-gray-800 space-y-1">
        <li><strong>Acne:</strong> Blocked hair follicles that lead to pimples, blackheads, and cysts</li>
        <li><strong>Eczema (atopic dermatitis):</strong> Dry, itchy, inflamed skin that may develop rashes</li>
        <li><strong>Psoriasis:</strong> Accelerated skin cell growth causing scaly patches</li>
        <li><strong>Rosacea:</strong> Facial redness, visible blood vessels, and sometimes small, red bumps</li>
        <li><strong>Contact dermatitis:</strong> Rashes from direct contact with allergens or irritants</li>
        <li><strong>Hives:</strong> Raised, itchy welts triggered by allergic reactions</li>
      </ul>
      
      <p class="text-gray-800 mb-3"><strong>General skin care recommendations:</strong></p>
      <ul class="list-disc pl-5 mb-3 text-gray-800 space-y-1">
        <li>Use gentle, fragrance-free cleansers</li>
        <li>Moisturize regularly, especially after bathing</li>
        <li>Protect skin from sun exposure with sunscreen and protective clothing</li>
        <li>Stay hydrated</li>
        <li>Avoid known irritants and allergens</li>
        <li>Don't smoke, as it accelerates skin aging</li>
      </ul>
      
      <p class="text-gray-800 mb-3"><strong>When to consult a dermatologist:</strong></p>
      <ul class="list-disc pl-5 mb-3 text-gray-800 space-y-1">
        <li>A new growth, mole, or skin lesion that changes in appearance</li>
        <li>A rash that doesn't improve with over-the-counter treatments</li>
        <li>Skin infections with swelling, redness, warmth, or drainage</li>
        <li>Severe or widespread symptoms</li>
        <li>Skin conditions that affect your quality of life</li>
      </ul>
      
      <p class="text-gray-800">Many skin conditions can be effectively managed with proper diagnosis and treatment. A dermatologist can help identify your specific condition and recommend appropriate treatments.</p>
      
      <p class="text-amber-700 mt-4 text-sm">
        <strong>Disclaimer:</strong> This information is for educational purposes only and is not a substitute 
        for professional medical advice. Always consult a qualified healthcare provider for medical concerns.
      </p>
    `;
  }
  
  // Default fallback for all other queries - providing general health information instead of an error message
  return `
    <p class="text-gray-800 mb-3">Thank you for your health question. While I don't have specific information about this particular topic, here are some general health guidelines that may be helpful:</p>
    
    <p class="text-gray-800 mb-3"><strong>General health recommendations:</strong></p>
    <ul class="list-disc pl-5 mb-3 text-gray-800 space-y-1">
      <li>Maintain a balanced diet rich in fruits, vegetables, whole grains, and lean proteins</li>
      <li>Stay physically active with at least 150 minutes of moderate exercise per week</li>
      <li>Get 7-9 hours of quality sleep each night</li>
      <li>Stay hydrated by drinking plenty of water throughout the day</li>
      <li>Manage stress through techniques like mindfulness, deep breathing, or meditation</li>
      <li>Avoid tobacco and limit alcohol consumption</li>
      <li>Schedule regular check-ups with healthcare providers</li>
    </ul>
    
    <p class="text-gray-800 mb-3">For specific health concerns, it's always best to consult with a qualified healthcare provider who can provide personalized advice based on your medical history and current condition.</p>
    
    <p class="text-gray-800 mb-3">If you're looking for reliable health information online, consider visiting trusted sources such as:</p>
    <ul class="list-disc pl-5 mb-3 text-gray-800 space-y-1">
      <li>Centers for Disease Control and Prevention (CDC): cdc.gov</li>
      <li>World Health Organization (WHO): who.int</li>
      <li>National Institutes of Health (NIH): nih.gov</li>
      <li>Mayo Clinic: mayoclinic.org</li>
      <li>Cleveland Clinic: clevelandclinic.org</li>
    </ul>
    
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
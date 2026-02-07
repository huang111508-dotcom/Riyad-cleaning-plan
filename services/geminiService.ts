import { GoogleGenAI } from "@google/genai";

// Lazy variable to hold the instance
let aiClient: GoogleGenAI | null = null;

// Safely access API Key
const getApiKey = () => {
  try {
    // Check for standard process.env
    if (typeof process !== 'undefined' && process.env && process.env.API_KEY) {
      return process.env.API_KEY;
    }
    // Check for Vite standard
    // @ts-ignore
    if (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_API_KEY) {
       // @ts-ignore
       return import.meta.env.VITE_API_KEY;
    }
  } catch (e) {
    console.warn("Could not read API Key from environment.");
  }
  return '';
};

export const translateText = async (text: string, targetLang: 'en' | 'cn' = 'en'): Promise<string> => {
  if (!text) return '';

  try {
    // Initialize client ONLY when needed (Lazy Load)
    // This prevents the app from crashing on startup if the API key is missing or SDK fails to load
    if (!aiClient) {
      const apiKey = getApiKey();
      if (!apiKey) {
        console.warn("No API Key provided. Returning original text with mock prefix.");
        return `[Mock Translated] ${text}`;
      }
      aiClient = new GoogleGenAI({ apiKey });
    }

    const prompt = `Translate the following text related to store cleaning procedures into ${targetLang === 'en' ? 'English' : 'Chinese'}. 
    Return ONLY the translated text without any explanations or markdown.
    
    Text: "${text}"`;

    const response = await aiClient.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
    });

    return response.text?.trim() || text;
  } catch (error) {
    console.error("Translation failed:", error);
    return text; // Fallback to original
  }
};
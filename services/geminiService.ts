import { GoogleGenAI } from "@google/genai";

// Safely access API Key to avoid "process is not defined" error in browsers
const getApiKey = () => {
  try {
    // Check for standard process.env (Node/Webpack/Polyfilled)
    if (typeof process !== 'undefined' && process.env && process.env.API_KEY) {
      return process.env.API_KEY;
    }
    // Check for Vite standard (import.meta.env)
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

const apiKey = getApiKey();
const ai = new GoogleGenAI({ apiKey });

export const translateText = async (text: string, targetLang: 'en' | 'cn' = 'en'): Promise<string> => {
  if (!text) return '';
  if (!apiKey) {
    console.warn("No API Key provided. Returning original text with mock prefix.");
    return `[Mock Translated] ${text}`;
  }

  try {
    const prompt = `Translate the following text related to store cleaning procedures into ${targetLang === 'en' ? 'English' : 'Chinese'}. 
    Return ONLY the translated text without any explanations or markdown.
    
    Text: "${text}"`;

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
    });

    return response.text?.trim() || text;
  } catch (error) {
    console.error("Translation failed:", error);
    return text; // Fallback to original
  }
};
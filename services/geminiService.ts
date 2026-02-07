import { GoogleGenAI } from "@google/genai";

const apiKey = process.env.API_KEY || '';
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

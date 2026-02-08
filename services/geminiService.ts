import { GoogleGenAI } from "@google/genai";

// Lazy variable to hold the instance
let aiClient: GoogleGenAI | null = null;

export const translateText = async (text: string, targetLang: 'en' | 'cn' = 'en'): Promise<string> => {
  if (!text) return '';

  try {
    // Initialize client ONLY when needed (Lazy Load)
    if (!aiClient) {
      // Directly access process.env.API_KEY as per system requirements
      const apiKey = process.env.API_KEY;
      
      if (!apiKey) {
        console.warn("API Key is missing in process.env.API_KEY. Returning original text.");
        // Return original text directly without "[Mock Translated]" prefix to improve UX
        return text;
      }
      aiClient = new GoogleGenAI({ apiKey });
    }

    const prompt = `Translate the following text related to store cleaning procedures into ${targetLang === 'en' ? 'English' : 'Chinese'}. 
    Return ONLY the translated text without any explanations or markdown.
    
    Text:
    ${text}`;

    const response = await aiClient.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
    });

    return response.text?.trim() || text;
  } catch (error) {
    console.error("Translation failed:", error);
    return text; // Fallback to original text on error
  }
};
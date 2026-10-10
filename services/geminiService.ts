import { GoogleGenAI } from "@google/genai";

// Lazy variable to hold the instance
let aiClient: GoogleGenAI | null = null;

// Offline Supermarket Glossary for quick local translation & offline resilience
const SUPERMARKET_DICTIONARY: Record<string, string> = {
  // Departments & Areas
  '果蔬部': 'Fruit & Veg (Produce)',
  '生鲜部': 'Fresh Food',
  '肉类部': 'Meat Department',
  '水产部': 'Seafood Department',
  '海鲜部': 'Fish & Seafood',
  '熟食部': 'Hot Food (Deli)',
  '烘焙部': 'Bakery Department',
  '杂货部': 'Grocery & Dry Goods',
  '食品百货': 'Grocery & Food',
  '收银部': 'Cashier / Checkout',
  '前台': 'Front Desk',
  '保洁部': 'Cleaning Department',
  '仓库': 'Stockroom / Warehouse',
  '收货区': 'Receiving Dock',

  // Roles
  '理货员': 'Shelf Restocker',
  '果蔬理货员': 'Fruit & Veg Worker',
  '保洁员': 'Floor Cleaner',
  '收银员': 'Cashier',
  '熟食工': 'Hot Food Worker',
  '烘焙师': 'Baker',
  '仓管员': 'Stockroom Worker',

  // Common Actions
  '倒垃圾': 'Empty trash cans',
  '拖地': 'Mop the floor dry',
  '擦拭货架': 'Wipe shelves clean',
  '清洗购物车': 'Wash shopping carts',
  '清洗冷柜': 'Clean the chiller',
  '刀具消毒': 'Wash and sanitize meat knives',
  '整理托盘': 'Stack wood pallets neatly',
  '清洁卫生间': 'Clean toilets and washrooms',
  '挑选烂果': 'Pick out bad fruits',
  '清理积水': 'Mop up water puddles',
};

export const translateText = async (text: string, targetLang: 'en' | 'cn' = 'en'): Promise<string> => {
  const trimmed = text.trim();
  if (!trimmed) return '';

  // 1. Direct dictionary match
  if (targetLang === 'en' && SUPERMARKET_DICTIONARY[trimmed]) {
    return SUPERMARKET_DICTIONARY[trimmed];
  }

  // 2. Try Gemini API
  try {
    if (!aiClient) {
      const apiKey = process.env.API_KEY || (typeof window !== 'undefined' && (window as any).process?.env?.API_KEY);
      if (apiKey) {
        aiClient = new GoogleGenAI({ apiKey });
      }
    }

    if (aiClient) {
      const prompt = targetLang === 'en'
        ? `You are a translator for a supermarket / grocery store cleaning manual.
Translate the following Chinese text into simple, easy-to-understand plain English.
TARGET AUDIENCE: Supermarket floor workers, stockers, and cleaners with basic or lower English reading skills.
RULES:
- Use very simple, plain, everyday English words (e.g. use "wipe", "mop", "wash with soap water", "trash can", "shelf", "meat counter", "chiller", "bad fruits").
- Avoid difficult, academic, or overly formal words (do not use "receptacle", "sanitization protocol", "subterranean", "apparatus").
- Keep instructions direct, numbered (1., 2., 3.), short, and actionable.
- Return ONLY the translated English text, with no notes, no explanations, no markdown ticks.

Text to translate:
${trimmed}`
        : `Translate the following supermarket cleaning text into natural, professional Chinese (简体中文). Return ONLY the translated Chinese text:
${trimmed}`;

      const response = await aiClient.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
      });

      const translated = response.text?.trim();
      if (translated) {
        return translated;
      }
    }
  } catch (error) {
    console.warn("AI translation unavailable, falling back to local processing:", error);
  }

  // 3. Fallback: check if partial dictionary words match
  if (targetLang === 'en') {
    for (const [cnKey, enVal] of Object.entries(SUPERMARKET_DICTIONARY)) {
      if (trimmed.includes(cnKey)) {
        return `${enVal} - ${trimmed}`;
      }
    }
  }

  return trimmed;
};

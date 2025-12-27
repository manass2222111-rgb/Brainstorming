
import { GoogleGenAI, Type } from "@google/genai";
import { CategoryId, TeachingIdea, StudentLevel } from "./types";

const RESPONSE_SCHEMA = {
  type: Type.OBJECT,
  properties: {
    title: { type: Type.STRING },
    description: { type: Type.STRING },
    steps: { type: Type.ARRAY, items: { type: Type.STRING } },
    benefit: { type: Type.STRING },
    category: { type: Type.STRING },
    estimatedTime: { type: Type.STRING }
  },
  required: ["title", "description", "steps", "benefit", "category", "estimatedTime"],
};

export const generateIdea = async (category: CategoryId, level: StudentLevel): Promise<TeachingIdea> => {
  // محاولة جلب المفتاح من عدة مصادر محتملة في المتصفح
  const apiKey = (window as any).process?.env?.API_KEY || process.env.API_KEY;

  if (!apiKey || apiKey === "") {
    throw new Error("API_KEY_MISSING");
  }

  const ai = new GoogleGenAI({ apiKey });
  
  const categoryNames: Record<string, string> = {
    [CategoryId.HIFZ]: "تحفيظ",
    [CategoryId.REVIEW]: "مراجعة",
    [CategoryId.MOTIVATION]: "تحفيز",
    [CategoryId.MANAGEMENT]: "ضبط",
    [CategoryId.TAJWEED]: "تجويد",
  };

  const targetCategory = category === CategoryId.ALL ? "فكرة منوعة" : categoryNames[category];
  const levelText = level === StudentLevel.ADULTS ? "للكبار" : "للأطفال";

  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: `أعطني فكرة مهارية ${levelText} في مجال ${targetCategory} للقرآن الكريم. JSON فقط.`,
    config: {
      systemInstruction: "أنت خبير تربوي. استجب بـ JSON فقط.",
      responseMimeType: "application/json",
      responseSchema: RESPONSE_SCHEMA,
    },
  });

  return JSON.parse(response.text) as TeachingIdea;
};

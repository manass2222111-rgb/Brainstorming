
import { GoogleGenAI, Type } from "@google/genai";
import { CategoryId, TeachingIdea, StudentLevel } from "./types";

const RESPONSE_SCHEMA = {
  type: Type.OBJECT,
  properties: {
    title: { type: Type.STRING, description: "عنوان جذاب" },
    description: { type: Type.STRING, description: "وصف الفكرة" },
    steps: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: "خطوات التنفيذ"
    },
    benefit: { type: Type.STRING, description: "الفائدة المكتسبة" },
    category: { type: Type.STRING, description: "التصنيف" },
    estimatedTime: { type: Type.STRING, description: "الزمن المستغرق" }
  },
  required: ["title", "description", "steps", "benefit", "category", "estimatedTime"],
};

export const generateIdea = async (category: CategoryId, level: StudentLevel): Promise<TeachingIdea> => {
  // استخدام التسمية المباشرة لضمان الحقن من قبل Vercel
  const apiKey = process.env.API_KEY;

  if (!apiKey) {
    throw new Error("API_KEY_MISSING");
  }

  const ai = new GoogleGenAI({ apiKey });
  
  const categoryNames: Record<string, string> = {
    [CategoryId.HIFZ]: "تحفيظ جديد",
    [CategoryId.REVIEW]: "مراجعة",
    [CategoryId.MOTIVATION]: "تحفيز",
    [CategoryId.MANAGEMENT]: "ضبط الحلقة",
    [CategoryId.TAJWEED]: "تجويد",
  };

  const targetCategory = category === CategoryId.ALL ? "فكرة إبداعية عامة" : categoryNames[category];
  const levelText = level === StudentLevel.ADULTS ? "للكبار" : "للأطفال";

  const prompt = `أعطني فكرة مهارية ${levelText} في مجال ${targetCategory} لتحفيظ القرآن الكريم. JSON فقط.`;

  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: prompt,
    config: {
      systemInstruction: "أنت خبير تربوي في حلقات القرآن. قدم أفكاراً عملية ومهارية فقط بتنسيق JSON.",
      responseMimeType: "application/json",
      responseSchema: RESPONSE_SCHEMA,
    },
  });

  return JSON.parse(response.text) as TeachingIdea;
};

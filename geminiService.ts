
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
  const apiKey = process.env.API_KEY;

  if (!apiKey || apiKey === "undefined" || apiKey === "") {
    throw new Error("API_KEY_MISSING");
  }

  const ai = new GoogleGenAI({ apiKey });
  
  const categoryNames: Record<string, string> = {
    [CategoryId.HIFZ]: "تحفيظ جديد",
    [CategoryId.REVIEW]: "مراجعة وتثبيت",
    [CategoryId.MOTIVATION]: "تحفيز وتشجيع",
    [CategoryId.MANAGEMENT]: "ضبط الحلقة",
    [CategoryId.TAJWEED]: "تجويد وأداء",
  };

  const targetCategory = category === CategoryId.ALL ? "أفكار إبداعية منوعة" : categoryNames[category];
  const levelText = level === StudentLevel.ADULTS ? "للكبار" : "للأطفال";

  const prompt = `أعطني فكرة مهارية تربوية ${levelText} في مجال ${targetCategory} لطلاب حلقات القرآن الكريم. قدم النتيجة بتنسيق JSON فقط حسب المخطط المطلوب.`;

  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: prompt,
    config: {
      systemInstruction: "أنت خبير تربوي متخصص في تطوير حلقات تحفيظ القرآن الكريم. قدم أفكاراً عملية، مبتكرة، ويسيرة التنفيذ.",
      responseMimeType: "application/json",
      responseSchema: RESPONSE_SCHEMA,
    },
  });

  if (!response.text) throw new Error("EMPTY_RESPONSE");
  return JSON.parse(response.text) as TeachingIdea;
};

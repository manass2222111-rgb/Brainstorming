
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
  // استخدام API_KEY من البيئة مباشرة
  const apiKey = process.env.API_KEY;

  if (!apiKey) {
    throw new Error("API_KEY_MISSING");
  }

  const ai = new GoogleGenAI({ apiKey });
  
  const categoryNames: Record<string, string> = {
    [CategoryId.HIFZ]: "تحفيظ وحفظ جديد",
    [CategoryId.REVIEW]: "مراجعة وتثبيت المحفوظ",
    [CategoryId.MOTIVATION]: "تحفيز وتشجيع الطلاب",
    [CategoryId.MANAGEMENT]: "ضبط الحلقة وإدارة الوقت",
    [CategoryId.TAJWEED]: "تطوير الأداء والتجويد",
  };

  const targetCategory = category === CategoryId.ALL ? "أفكار إبداعية تربوية متنوعة" : categoryNames[category];
  const levelText = level === StudentLevel.ADULTS ? "للكبار والشباب" : "للأطفال والناشئة";

  const prompt = `أعطني فكرة مهارية إبداعية وعملية ${levelText} في مجال ${targetCategory} داخل حلقات القرآن الكريم. اجعل الخطوات واضحة وسهلة التنفيذ للمحفظ.`;

  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: prompt,
    config: {
      systemInstruction: "أنت خبير تربوي في حلقات التحفيظ، تقدم أفكاراً ذكية، عصرية، وممتعة تزيد من إقبال الطلاب على القرآن.",
      responseMimeType: "application/json",
      responseSchema: RESPONSE_SCHEMA,
    },
  });

  if (!response.text) throw new Error("EMPTY_RESPONSE");
  return JSON.parse(response.text) as TeachingIdea;
};

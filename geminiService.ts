
import { GoogleGenAI, Type } from "@google/genai";
import { CategoryId, TeachingIdea, StudentLevel } from "./types";

const RESPONSE_SCHEMA = {
  type: Type.OBJECT,
  properties: {
    title: { type: Type.STRING, description: "عنوان إبداعي قصير" },
    description: { type: Type.STRING, description: "وصف الأسلوب باختصار" },
    steps: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: "3 خطوات عملية للتنفيذ"
    },
    benefit: { type: Type.STRING, description: "الفائدة التربوية أو المهارية" },
    category: { type: Type.STRING, description: "تصنيف الفكرة" },
    estimatedTime: { type: Type.STRING, description: "الوقت المستغرق (مثلاً: 10 دقائق)" }
  },
  required: ["title", "description", "steps", "benefit", "category", "estimatedTime"],
};

export const generateIdea = async (category: CategoryId, level: StudentLevel): Promise<TeachingIdea> => {
  // جلب المفتاح حصرياً من process.env.API_KEY كما تتطلب القواعد
  const apiKey = process.env.API_KEY;
  
  if (!apiKey || apiKey.length < 5) {
    throw new Error("API_KEY_NOT_FOUND");
  }

  const ai = new GoogleGenAI({ apiKey });
  
  const categoryNames: Record<string, string> = {
    [CategoryId.HIFZ]: "حفظ آيات جديدة",
    [CategoryId.REVIEW]: "مراجعة وتثبيت",
    [CategoryId.MOTIVATION]: "تحفيز وتشجيع",
    [CategoryId.MANAGEMENT]: "ضبط الحلقة",
    [CategoryId.TAJWEED]: "تجويد وأداء",
  };

  const targetCategory = category === CategoryId.ALL ? "مهارات تحفيظ وتجويد عامة" : categoryNames[category];
  const levelText = level === StudentLevel.ADULTS ? "للكبار" : "للأطفال";

  const systemInstruction = `أنت خبير في مهارات تحفيظ القرآن الكريم. قدم أفكاراً مهارية عملية حصراً. لا وعظ ولا تفسير. استجب بتنسيق JSON فقط.`;
  const prompt = `ابتكر فكرة مهارية ${levelText} في مجال ${targetCategory}.`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        systemInstruction: systemInstruction,
        responseMimeType: "application/json",
        responseSchema: RESPONSE_SCHEMA,
      },
    });

    const text = response.text;
    if (!text) throw new Error("استجابة فارغة");
    return JSON.parse(text) as TeachingIdea;
  } catch (error: any) {
    console.error("Gemini Error:", error);
    throw error;
  }
};

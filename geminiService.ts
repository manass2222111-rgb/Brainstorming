
import { GoogleGenAI, Type } from "@google/genai";
import { CategoryId, TeachingIdea, StudentLevel } from "./types";

const RESPONSE_SCHEMA = {
  type: Type.OBJECT,
  properties: {
    title: { type: Type.STRING, description: "عنوان مبتكر وجذاب للأسلوب" },
    description: { type: Type.STRING, description: "شرح بسيط للفكرة بلهجة محببة" },
    steps: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: "خطوات تنفيذ عملية وسهلة"
    },
    benefit: { type: Type.STRING, description: "الأثر الملموس على الطالب" },
    category: { type: Type.STRING, description: "الفئة المستهدفة" },
    estimatedTime: { type: Type.STRING, description: "الزمن التقريبي للتنفيذ" }
  },
  required: ["title", "description", "steps", "benefit", "category", "estimatedTime"],
};

export const generateIdea = async (category: CategoryId, level: StudentLevel): Promise<TeachingIdea> => {
  const apiKey = process.env.API_KEY;
  
  if (!apiKey) {
    throw new Error("API_KEY_MISSING");
  }

  const ai = new GoogleGenAI({ apiKey });
  
  const categoryNames: Record<string, string> = {
    [CategoryId.HIFZ]: "حفظ آيات جديدة",
    [CategoryId.REVIEW]: "مراجعة وتثبيت",
    [CategoryId.MOTIVATION]: "تحفيز وتشجيع",
    [CategoryId.MANAGEMENT]: "ضبط الحلقة",
    [CategoryId.TAJWEED]: "تجويد وأداء",
  };

  const targetCategory = category === CategoryId.ALL ? "فكرة مهارية في تحفيظ القرآن" : categoryNames[category];
  const levelText = level === StudentLevel.ADULTS ? "للكبار" : "للأطفال";

  const systemInstruction = `أنت خبير في مهارات تحفيظ القرآن الكريم. تولد أفكاراً مهارية عملية (حفظ، مراجعة، تجويد) فقط. لا وعظ ولا تفاسير. JSON فقط.`;
  const prompt = `أعطني فكرة إبداعية ${levelText} في مجال: ${targetCategory}.`;

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
    if (!text) throw new Error("EMPTY_RESPONSE");
    return JSON.parse(text) as TeachingIdea;
  } catch (error: any) {
    console.error("Critical Gemini Error:", error);
    throw error;
  }
};

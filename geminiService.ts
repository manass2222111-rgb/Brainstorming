
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
      description: "خطوات تنفيذ عملية وسهلة (1، 2، 3)"
    },
    benefit: { type: Type.STRING, description: "الأثر الملموس على الطالب" },
    category: { type: Type.STRING, description: "الفئة المستهدفة" },
    estimatedTime: { type: Type.STRING, description: "الزمن التقريبي للتنفيذ (مثلاً: 5 دقائق)" }
  },
  required: ["title", "description", "steps", "benefit", "category", "estimatedTime"],
};

const getApiKey = () => {
  // البحث عن المفتاح في أكثر من مكان لضمان عمله في Vercel
  return (window as any).process?.env?.API_KEY || (process as any)?.env?.API_KEY || "";
};

export const generateIdea = async (category: CategoryId, level: StudentLevel): Promise<TeachingIdea> => {
  const apiKey = getApiKey();
  
  if (!apiKey) {
    throw new Error("API_KEY_MISSING");
  }

  const ai = new GoogleGenAI({ apiKey });
  
  const categoryNames: Record<string, string> = {
    [CategoryId.HIFZ]: "حفظ آيات جديدة",
    [CategoryId.REVIEW]: "مراجعة وتثبيت القرآن",
    [CategoryId.MOTIVATION]: "تحفيز وتشجيع الطلاب",
    [CategoryId.MANAGEMENT]: "إدارة وهدوء الحلقة",
    [CategoryId.TAJWEED]: "تحسين الأداء والتجويد",
  };

  const targetCategory = category === CategoryId.ALL ? "فكرة تعليمية تربوية شاملة" : categoryNames[category];
  const isAdult = level === StudentLevel.ADULTS;

  const prompt = `أنت مساعد خبير متخصص في تعليم وتحفيظ القرآن الكريم. 
  المطلوب: توليد أسلوب تعليمي أو تربوي "عملي وفعال" لـ ${isAdult ? "الطلاب الكبار" : "الطلاب الصغار"} في مجال: "${targetCategory}".
  أجب بصيغة JSON فقط وباللغة العربية.`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: RESPONSE_SCHEMA,
      },
    });

    const text = response.text;
    if (!text) throw new Error("Empty response from AI");
    
    return JSON.parse(text) as TeachingIdea;
  } catch (error: any) {
    console.error("Gemini Error:", error);
    throw error;
  }
};

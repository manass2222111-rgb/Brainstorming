
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
  // تتبع حالة المفتاح
  const envKey = process.env.API_KEY;
  
  if (!envKey || envKey.length < 5) {
    console.error("Diagnostic: API_KEY is missing or invalid in environment.");
    throw new Error("ENV_KEY_MISSING");
  }

  try {
    const ai = new GoogleGenAI({ apiKey: envKey });
    
    const categoryNames: Record<string, string> = {
      [CategoryId.HIFZ]: "تحفيظ وحفظ جديد بأساليب غير تقليدية",
      [CategoryId.REVIEW]: "مراجعة وتثبيت المحفوظ بطرق تفاعلية",
      [CategoryId.MOTIVATION]: "تحفيز وتشجيع الطلاب وكسر الروتين",
      [CategoryId.MANAGEMENT]: "ضبط الحلقة وإدارة الوقت بذكاء",
      [CategoryId.TAJWEED]: "تطوير الأداء والتجويد بمتعة وبساطة",
    };

    const targetCategory = category === CategoryId.ALL ? "أفكار إبداعية تربوية شاملة" : categoryNames[category];
    const levelText = level === StudentLevel.ADULTS ? "للكبار والشباب" : "للأطفال والناشئة";

    const prompt = `أعطني فكرة مهارية إبداعية وعملية ${levelText} في مجال ${targetCategory} داخل حلقات القرآن الكريم. اجعل الفكرة مدهشة، سهلة التطبيق، وتترك أثراً عميقاً في نفوس الطلاب.`;

    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        systemInstruction: "أنت خبير تربوي عالمي متخصص في حلقات تحفيظ القرآن الكريم. تقدم أفكاراً خارج الصندوق وتستخدم لغة عربية فصيحة وجذابة.",
        responseMimeType: "application/json",
        responseSchema: RESPONSE_SCHEMA,
      },
    });

    if (!response.text) throw new Error("API_RESPONSE_EMPTY");
    return JSON.parse(response.text) as TeachingIdea;
  } catch (error: any) {
    console.error("Gemini Execution Error:", error);
    throw error;
  }
};

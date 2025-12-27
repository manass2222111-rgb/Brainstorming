
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
  // استخدام المفتاح من متغيرات البيئة كما هو مطلوب
  const apiKey = process.env.API_KEY;

  if (!apiKey || apiKey.trim() === "") {
    console.error("Critical Error: process.env.API_KEY is undefined or empty.");
    throw new Error("API_KEY_MISSING");
  }

  try {
    const ai = new GoogleGenAI({ apiKey });
    
    const categoryNames: Record<string, string> = {
      [CategoryId.HIFZ]: "تحفيظ وحفظ جديد بأساليب غير تقليدية",
      [CategoryId.REVIEW]: "مراجعة وتثبيت المحفوظ بطرق تفاعلية",
      [CategoryId.MOTIVATION]: "تحفيز وتشجيع الطلاب وكسر الروتين",
      [CategoryId.MANAGEMENT]: "ضبط الحلقة وإدارة الوقت بذكاء",
      [CategoryId.TAJWEED]: "تطوير الأداء والتجويد بمتعة وبساطة",
    };

    const targetCategory = category === CategoryId.ALL ? "أفكار إبداعية تربوية شاملة لطلاب القرآن" : categoryNames[category];
    const levelText = level === StudentLevel.ADULTS ? "للكبار والشباب" : "للأطفال والناشئة";

    const prompt = `أعطني فكرة مهارية إبداعية وعملية ${levelText} في مجال ${targetCategory} داخل حلقات القرآن الكريم. اجعل الفكرة مدهشة، مبتكرة جداً، سهلة التطبيق بدون تكاليف، وتترك أثراً تربوياً عميقاً.`;

    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        systemInstruction: "أنت خبير تربوي متخصص في ابتكار أساليب تعليمية لحلقات القرآن الكريم. تقدم أفكاراً مذهلة وجذابة بأسلوب فصيح ومحبب.",
        responseMimeType: "application/json",
        responseSchema: RESPONSE_SCHEMA,
      },
    });

    const resultText = response.text;
    if (!resultText) throw new Error("Empty response from Gemini");
    
    return JSON.parse(resultText) as TeachingIdea;
  } catch (error: any) {
    console.error("Gemini API Invocation Failure:", error);
    throw error;
  }
};

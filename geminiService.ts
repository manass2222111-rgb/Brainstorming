
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
  // استخدام المفتاح من متغيرات البيئة كما هو منصوص عليه في التعليمات
  const apiKey = process.env.API_KEY;

  if (!apiKey || apiKey === 'undefined' || apiKey.trim() === "") {
    console.error("API_KEY is not configured in the environment.");
    throw new Error("API_KEY_MISSING");
  }

  try {
    const ai = new GoogleGenAI({ apiKey });
    
    const categoryNames: Record<string, string> = {
      [CategoryId.HIFZ]: "أساليب غير تقليدية لحفظ الجديد بمتعة",
      [CategoryId.REVIEW]: "ألعاب تفاعلية لمراجعة وتثبيت المحفوظ",
      [CategoryId.MOTIVATION]: "طرق مبتكرة لتحفيز الطلاب وكسر الروتين",
      [CategoryId.MANAGEMENT]: "مهارات ذكية لضبط الحلقة وإدارة الوقت",
      [CategoryId.TAJWEED]: "تبسيط التجويد وتحسين الأداء الصوتي",
    };

    const targetCategory = category === CategoryId.ALL ? "أفكار إبداعية تربوية شاملة لحلقات القرآن" : categoryNames[category];
    const levelText = level === StudentLevel.ADULTS ? "للكبار والشباب" : "للأطفال والناشئة";

    const prompt = `ابتكر فكرة مهارية إبداعية وعملية ${levelText} في مجال ${targetCategory}. الفكرة يجب أن تكون مدهشة، سهلة التطبيق بدون تكاليف، وتترك أثراً تربوياً عميقاً في نفوس الطلاب.`;

    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        systemInstruction: "أنت خبير تربوي ملهم متخصص في حلقات تحفيظ القرآن الكريم. لغتك فصيحة، جذابة، وعملية جداً.",
        responseMimeType: "application/json",
        responseSchema: RESPONSE_SCHEMA,
      },
    });

    const resultText = response.text;
    if (!resultText) throw new Error("لم يتم تلقي استجابة من الذكاء الاصطناعي");
    
    return JSON.parse(resultText) as TeachingIdea;
  } catch (error: any) {
    console.error("Gemini API Error:", error);
    throw error;
  }
};


import { GoogleGenAI, Type } from "@google/genai";
import { CategoryId, TeachingIdea, StudentLevel } from "./types";

export const generateIdea = async (category: CategoryId, level: StudentLevel): Promise<TeachingIdea> => {
  // استخدام المفتاح مباشرة من البيئة وفقاً للتعليمات الصارمة
  const apiKey = process.env.API_KEY;

  if (!apiKey || apiKey === 'undefined') {
    throw new Error("API_KEY_MISSING");
  }

  // تهيئة المحرك الجديد
  const ai = new GoogleGenAI({ apiKey });

  const categoryNames: Record<string, string> = {
    [CategoryId.HIFZ]: "تحفيظ القرآن الكريم وحفظ الجديد",
    [CategoryId.REVIEW]: "مراجعة وتثبيت المحفوظ",
    [CategoryId.MOTIVATION]: "تحفيز الطلاب وتشجيعهم",
    [CategoryId.MANAGEMENT]: "إدارة القاعة وضبط الحلقة",
    [CategoryId.TAJWEED]: "تطوير التجويد والأداء الصوتي",
  };

  const targetCategory = category === CategoryId.ALL ? "أفكار تربوية شاملة" : categoryNames[category];
  const levelText = level === StudentLevel.ADULTS ? "للكبار" : "للأطفال";

  const prompt = `أنت خبير تربوي في حلقات القرآن. ابتكر فكرة إبداعية ومبتكرة ${levelText} في مجال ${targetCategory}. 
  يجب أن تكون الفكرة عملية، ممتعة، وغير تقليدية.
  أجب بتنسيق JSON حصراً يحتوي على:
  title: عنوان جذاب
  description: وصف مختصر
  steps: مصفوفة من 4 خطوات تنفيذية
  benefit: الأثر التربوي المتوقع
  category: القسم
  estimatedTime: الوقت المتوقع (مثلاً: 10 دقائق)`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING },
            description: { type: Type.STRING },
            steps: { type: Type.ARRAY, items: { type: Type.STRING } },
            benefit: { type: Type.STRING },
            category: { type: Type.STRING },
            estimatedTime: { type: Type.STRING },
          },
          required: ["title", "description", "steps", "benefit", "category", "estimatedTime"],
        },
      },
    });

    const text = response.text;
    if (!text) throw new Error("استجابة فارغة");
    return JSON.parse(text) as TeachingIdea;
  } catch (error) {
    console.error("Gemini Error:", error);
    throw error;
  }
};

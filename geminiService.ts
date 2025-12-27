
import { GoogleGenAI, Type } from "@google/genai";
import { CategoryId, TeachingIdea, StudentLevel } from "./types";

export const generateIdea = async (category: CategoryId, level: StudentLevel): Promise<TeachingIdea> => {
  // الحصول على المفتاح من البيئة
  const apiKey = process.env.API_KEY;

  if (!apiKey || apiKey === 'undefined' || apiKey === '') {
    throw new Error("API_KEY_MISSING");
  }

  // إنشاء المثيل داخل الدالة لضمان استخدام أحدث الإعدادات
  const ai = new GoogleGenAI({ apiKey });

  const categoryNames: Record<string, string> = {
    [CategoryId.HIFZ]: "تحفيظ القرآن الكريم وحفظ الجديد",
    [CategoryId.REVIEW]: "مراجعة وتثبيت المحفوظ",
    [CategoryId.MOTIVATION]: "تحفيز الطلاب وتشجيعهم",
    [CategoryId.MANAGEMENT]: "إدارة القاعة وضبط الحلقة",
    [CategoryId.TAJWEED]: "تطوير التجويد والأداء الصوتي",
  };

  const targetCategory = category === CategoryId.ALL ? "أفكار تربوية شاملة ومبتكرة" : categoryNames[category];
  const levelText = level === StudentLevel.ADULTS ? "للكبار والشباب" : "للأطفال والناشئة";

  const prompt = `أنت مستشار تربوي خبير في تعليم القرآن الكريم. 
  ابتكر فكرة إبداعية فريدة وعملية ${levelText} في مجال ${targetCategory}. 
  يجب أن تكون الفكرة ممتعة، قابلة للتطبيق الفوري، ومحفزة للطلاب.`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: [{ parts: [{ text: prompt }] }],
      config: {
        systemInstruction: "أنت خبير في ابتكار الوسائل التعليمية لحلقات القرآن الكريم. إجاباتك دائماً بتنسيق JSON دقيق وباللغة العربية الفصحى الجذابة.",
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING, description: "عنوان الفكرة" },
            description: { type: Type.STRING, description: "وصف موجز للفكرة" },
            steps: { 
              type: Type.ARRAY, 
              items: { type: Type.STRING },
              description: "4 خطوات واضحة للتنفيذ"
            },
            benefit: { type: Type.STRING, description: "الأثر التربوي أو المهارة المكتسبة" },
            category: { type: Type.STRING, description: "اسم التصنيف بالعربية" },
            estimatedTime: { type: Type.STRING, description: "الوقت اللازم (مثال: 15 دقيقة)" }
          },
          required: ["title", "description", "steps", "benefit", "category", "estimatedTime"],
        },
      },
    });

    const resultText = response.text;
    if (!resultText) throw new Error("لم يتم الحصول على نص من الاستجابة");
    
    return JSON.parse(resultText) as TeachingIdea;
  } catch (error) {
    console.error("Gemini API Error Detail:", error);
    throw error;
  }
};

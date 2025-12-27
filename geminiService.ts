
import { GoogleGenAI, Type } from "@google/genai";
import { CategoryId, TeachingIdea } from "./types.ts";

const RESPONSE_SCHEMA = {
  type: Type.OBJECT,
  properties: {
    title: { type: Type.STRING, description: "اسم الأسلوب التعليمي" },
    description: { type: Type.STRING, description: "شرح مختصر ومشوق" },
    steps: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: "خطوات التنفيذ (بين 3 إلى 5 خطوات)"
    },
    benefit: { type: Type.STRING, description: "الفائدة التربوية المرجوة" },
    category: { type: Type.STRING, description: "التصنيف" }
  },
  required: ["title", "description", "steps", "benefit", "category"],
};

export const fetchTeachingIdea = async (category: CategoryId): Promise<TeachingIdea> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const categoryLabels: Record<string, string> = {
    [CategoryId.HIFZ]: "تحفيظ القرآن الجديد",
    [CategoryId.REVIEW]: "مراجعة المحفوظ وتثبيته",
    [CategoryId.MOTIVATION]: "تحفيز الطلاب وتشجيعهم",
    [CategoryId.MANAGEMENT]: "إدارة وضبط الحلقة القرآنية",
    [CategoryId.TAJWEED]: "تعليم أحكام التجويد ومخارج الحروف",
    [CategoryId.ALL]: "أساليب تربوية عامة لمدرسي القرآن"
  };

  const prompt = `بصفتك خبيرًا تربويًا في تعليم القرآن الكريم، اقترح أسلوبًا تعليميًا إبداعيًا وعمليًا جدًا لـ: "${categoryLabels[category]}". 
  يجب أن يكون الأسلوب قابلاً للتطبيق في الحلقات القرآنية. 
  اجعل الرد بصيغة JSON حصراً وباللغة العربية.`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        systemInstruction: "أنت مساعد ذكي مخصص لمعلمي القرآن الكريم، وظيفتك تقديم أفكار تربوية ملهمة ومنظمة بصيغة JSON.",
        responseMimeType: "application/json",
        responseSchema: RESPONSE_SCHEMA,
      },
    });

    const text = response.text;
    if (!text) throw new Error("لم يتم استلام رد من الذكاء الاصطناعي.");
    
    return JSON.parse(text) as TeachingIdea;
  } catch (error) {
    console.error("Gemini Error:", error);
    throw new Error("حدث خطأ في الاتصال بالمعلم الذكي. تأكد من مفتاح API.");
  }
};

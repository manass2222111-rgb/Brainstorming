
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
  // محاولة الحصول على المفتاح بأكثر من طريقة لضمان العمل في بيئة المتصفح
  const apiKey = process.env.API_KEY || (window as any).process?.env?.API_KEY;

  if (!apiKey || apiKey === 'undefined' || apiKey.trim() === "") {
    console.error("Critical: API_KEY is missing from environment variables.");
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

    const prompt = `أعطني فكرة مهارية إبداعية وعملية ${levelText} في مجال ${targetCategory} داخل حلقات القرآن الكريم. اجعل الفكرة مدهشة ومبتكرة، سهلة التطبيق بدون ميزانية، وتترك أثراً تربوياً عميقاً.`;

    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        systemInstruction: "أنت خبير تربوي متخصص في حلقات تحفيظ القرآن الكريم. تقدم أفكاراً ذكية وجذابة بأسلوب فصيح ومؤثر.",
        responseMimeType: "application/json",
        responseSchema: RESPONSE_SCHEMA,
        thinkingConfig: { thinkingBudget: 0 } // تعطيل التفكير لسرعة الاستجابة كما هو مطلوب للمهام البسيطة
      },
    });

    const resultText = response.text;
    if (!resultText) throw new Error("Empty response from AI");
    
    return JSON.parse(resultText) as TeachingIdea;
  } catch (error: any) {
    console.error("Gemini API Error:", error);
    throw error;
  }
};

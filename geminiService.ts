import { GoogleGenerativeAI, SchemaType } from "@google/generative-ai";
import { CategoryId, TeachingIdea, StudentLevel } from "./types";

// تعريف هيكل الاستجابة المطلوبة (JSON Schema)
const RESPONSE_SCHEMA = {
  type: SchemaType.OBJECT,
  properties: {
    title: { type: SchemaType.STRING },
    description: { type: SchemaType.STRING },
    steps: { type: SchemaType.ARRAY, items: { type: SchemaType.STRING } },
    benefit: { type: SchemaType.STRING },
    category: { type: SchemaType.STRING },
    estimatedTime: { type: SchemaType.STRING }
  },
  required: ["title", "description", "steps", "benefit", "category", "estimatedTime"],
};

export const generateIdea = async (category: CategoryId, level: StudentLevel): Promise<TeachingIdea> => {
  
  // ✅ الخطوة الأهم: استدعاء المفتاح بالطريقة الصحيحة لـ Vite
  const apiKey = import.meta.env.VITE_API_KEY;

  // التحقق من وجود المفتاح قبل البدء
  if (!apiKey || apiKey === 'undefined' || apiKey.trim() === "") {
    console.error("VITE_API_KEY is not configured in the environment variables.");
    throw new Error("API_KEY_MISSING");
  }

  try {
    // إعداد الاتصال بجيمناي
    const genAI = new GoogleGenerativeAI(apiKey);
    
    // اختيار الموديل (استخدمت 1.5-flash لأنه الأسرع والأكثر استقراراً حالياً)
    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-flash", 
      systemInstruction: "أنت خبير تربوي ملهم متخصص في حلقات تحفيظ القرآن الكريم. لغتك فصيحة، جذابة، وعملية جداً.",
      generationConfig: {
        responseMimeType: "application/json",
        responseSchema: RESPONSE_SCHEMA,
      },
    });

    // تجهيز النصوص
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

    // إرسال الطلب
    const result = await model.generateContent(prompt);
    const resultText = result.response.text();

    if (!resultText) throw new Error("لم يتم تلقي استجابة من الذكاء الاصطناعي");
    
    return JSON.parse(resultText) as TeachingIdea;

  } catch (error: any) {
    console.error("Gemini API Error:", error);
    throw error;
  }
};
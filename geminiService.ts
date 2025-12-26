
import { GoogleGenAI, Type } from "@google/genai";
import { CategoryId, TeachingIdea, StudentLevel } from "./types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

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

export const generateIdea = async (category: CategoryId, level: StudentLevel): Promise<TeachingIdea> => {
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

  القاعدة الذهبية:
  - التركيز فقط على "الفهم العام" للمعنى الإجمالي للآيات بما يخدم الحفظ.
  - تجنب التفاصيل التفسيرية المعقدة.
  - الهدف الأساسي هو الحفظ الرصين.

  المطلوب في رد الـ JSON:
  - title: اسم الأسلوب.
  - description: شرح مختصر جداً للفكرة.
  - steps: خطوات واضحة (1، 2، 3).
  - benefit: الثمرة التعليمية.
  - estimatedTime: الوقت المتوقع.

  أجب بصيغة JSON فقط.`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-pro-preview",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: RESPONSE_SCHEMA,
        temperature: 0.7,
      },
    });

    if (!response.text) {
      throw new Error("لم يتم استلام بيانات من المحرك");
    }

    return JSON.parse(response.text) as TeachingIdea;
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw error;
  }
};

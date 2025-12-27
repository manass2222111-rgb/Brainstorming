
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

export const generateIdea = async (category: CategoryId, level: StudentLevel): Promise<TeachingIdea> => {
  // التأكد من تهيئة الذكاء الاصطناعي داخل الدالة لضمان قراءة أحدث مفتاح بيئة
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const categoryNames: Record<string, string> = {
    [CategoryId.HIFZ]: "حفظ آيات جديدة وإتقانها",
    [CategoryId.REVIEW]: "مراجعة وتثبيت المحفوظ وربط الآيات",
    [CategoryId.MOTIVATION]: "تحفيز الطلاب على الحفظ والإتقان",
    [CategoryId.MANAGEMENT]: "ضبط الحلقة لتوفير بيئة حفظ هادئة",
    [CategoryId.TAJWEED]: "تعلم أحكام التجويد والأداء الصوتي",
  };

  const targetCategory = category === CategoryId.ALL ? "فكرة مهارية في الحفظ والتجويد" : categoryNames[category];
  const isAdult = level === StudentLevel.ADULTS;

  const systemInstruction = `أنت مساعد خبير متخصص حصرياً في "مهارات تحفيظ القرآن الكريم وتجويده".
مهمتك ابتكار أساليب عملية تركز حصراً على: (الحفظ، الربط، الإتقان، التجويد).
الضوابط الصارمة:
- الأدوات: (أوراق، أقلام، سبورة، هواتف ذكية) فقط.
- يُمنع التفسير العميق، الوعظ، أو دروس الأخلاق.
- الفكرة مهارية بحتة، سهلة التطبيق، ومبتكرة جداً.`;

  const prompt = `توليد فكرة لـ ${isAdult ? "طلاب كبار" : "أطفال صغار"} في مجال: "${targetCategory}". الاستجابة JSON فقط.`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        systemInstruction: systemInstruction,
        responseMimeType: "application/json",
        responseSchema: RESPONSE_SCHEMA,
        temperature: 1,
      },
    });

    const text = response.text;
    if (!text) throw new Error("EMPTY_RESPONSE");
    return JSON.parse(text) as TeachingIdea;
  } catch (error: any) {
    console.error("Gemini API Error:", error);
    throw error;
  }
};

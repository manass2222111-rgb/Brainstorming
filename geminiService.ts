
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
  // استخدام مفتاح API من البيئة
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    throw new Error("API Key is missing from environment variables.");
  }

  const ai = new GoogleGenAI({ apiKey });
  
  const categoryNames: Record<string, string> = {
    [CategoryId.HIFZ]: "حفظ آيات جديدة وإتقانها",
    [CategoryId.REVIEW]: "مراجعة وتثبيت المحفوظ وربط الآيات",
    [CategoryId.MOTIVATION]: "تحفيز الطلاب على الحفظ والإتقان",
    [CategoryId.MANAGEMENT]: "ضبط الحلقة لتوفير بيئة حفظ هادئة",
    [CategoryId.TAJWEED]: "تعلم أحكام التجويد والأداء الصوتي",
  };

  const targetCategory = category === CategoryId.ALL ? "فكرة مهارية متقدمة في التحفيظ والتجويد" : categoryNames[category];
  const isAdult = level === StudentLevel.ADULTS;

  const systemInstruction = `أنت مساعد خبير تقني وتربوي متخصص حصرياً في "مهارات تحفيظ القرآن الكريم وتجويده".
  مهمتك هي ابتكار أساليب عملية تركز حصراً على الجوانب المهارية التالية:
  1. **الحفظ والإتقان:** أساليب مبتكرة للحفظ السريع وتثبيت الآيات.
  2. **ربط الآيات:** تقنيات ذكية لربط المقاطع والآيات ذهنيّاً.
  3. **التجويد والأداء:** طرق تفاعلية لتعلم الأحكام ومخارج الحروف.
  4. **المراجعة:** أساليب غير تقليدية لتثبيت المتشابهات.

  الضوابط الصارمة:
  - الأدوات المسموحة فقط: (أوراق، أقلام، سبورة، هواتف ذكية).
  - يُمنع منعاً باتاً الدخول في تفاسير القرآن الكريم العميقة أو المسائل الخلافية. اكتفِ بالمعنى الإجمالي الميسر جداً.
  - يُمنع التركيز على دروس الأخلاق أو الوعظ أو العمل بالقرآن؛ هدفنا مهارات الحفظ والتجويد فقط.
  - يجب أن تكون الفكرة مبتكرة، خارج الصندوق، وسهلة التطبيق الفوري.`;

  const prompt = `المطلوب: توليد فكرة عملية ومبتكرة لـ ${isAdult ? "طلاب كبار" : "أطفال صغار"} في مجال: "${targetCategory}".
  يجب أن تكون الاستجابة بصيغة JSON فقط وباللغة العربية الفصحى.`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-pro-preview", // استخدام النسخة الأكثر استقراراً وقوة
      contents: [{ parts: [{ text: prompt }] }],
      config: {
        systemInstruction: systemInstruction,
        responseMimeType: "application/json",
        responseSchema: RESPONSE_SCHEMA,
        temperature: 0.8,
      },
    });

    const text = response.text;
    if (!text) throw new Error("استجابة فارغة من الذكاء الاصطناعي");
    return JSON.parse(text.trim()) as TeachingIdea;
  } catch (error: any) {
    console.error("Gemini API Detail Error:", error);
    throw error;
  }
};

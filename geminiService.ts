
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
  // Always use direct initialization with named parameter for API key
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const categoryNames: Record<string, string> = {
    [CategoryId.HIFZ]: "حفظ آيات جديدة وإتقانها",
    [CategoryId.REVIEW]: "مراجعة وتثبيت المحفوظ وربط الآيات",
    [CategoryId.MOTIVATION]: "تحفيز الطلاب على الحفظ والإتقان",
    [CategoryId.MANAGEMENT]: "ضبط الحلقة لتوفير بيئة حفظ هادئة",
    [CategoryId.TAJWEED]: "تعلم أحكام التجويد والأداء الصوتي",
  };

  const targetCategory = category === CategoryId.ALL ? "فكرة مهارية في التحفيظ والتجويد" : categoryNames[category];
  const isAdult = level === StudentLevel.ADULTS;

  const systemInstruction = `أنت مساعد خبير متخصص في "مهارات تحفيظ القرآن الكريم وتجويده".
مهمتك ابتكار أساليب عملية تركز حصراً على:
1. الحفظ السريع والإتقان.
2. ربط الآيات والمقاطع ذهنيّاً.
3. التجويد العملي والأداء الصوتي.
4. تثبيت المتشابهات.

الضوابط:
- الأدوات: (أوراق، أقلام، سبورة، هواتف ذكية) فقط.
- لا تفاسير عميقة، لا وعظ، لا دروس أخلاقية.
- الفكرة يجب أن تكون مبتكرة، سهلة التطبيق، ومناسبة للفئة العمرية.`;

  const prompt = `أعطني فكرة إبداعية لـ ${isAdult ? "الكبار" : "الأطفال"} في مجال: ${targetCategory}. 
يجب أن تكون الاستجابة بصيغة JSON فقط.`;

  try {
    // Correct way to call generateContent with model and config
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

    // Access .text property directly (not a method call)
    const resultText = response.text;
    if (!resultText) throw new Error("EMPTY_RESPONSE");
    
    return JSON.parse(resultText) as TeachingIdea;
  } catch (error: any) {
    console.error("Gemini Error:", error);
    throw error;
  }
};

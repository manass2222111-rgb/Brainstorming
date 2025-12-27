
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
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const categoryNames: Record<string, string> = {
    [CategoryId.HIFZ]: "حفظ آيات جديدة",
    [CategoryId.REVIEW]: "مراجعة وتثبيت القرآن",
    [CategoryId.MOTIVATION]: "تحفيز وتشجيع الطلاب",
    [CategoryId.MANAGEMENT]: "إدارة وهدوء الحلقة",
    [CategoryId.TAJWEED]: "تحسين الأداء والتجويد",
  };

  const targetCategory = category === CategoryId.ALL ? "فكرة تعليمية شاملة في التحفيظ والإتقان" : categoryNames[category];
  const isAdult = level === StudentLevel.ADULTS;

  const systemInstruction = `أنت مساعد خبير تقني وتربوي متخصص حصرياً في "فن تحفيظ القرآن وإتقانه".
  يجب عليك توليد أفكار تلتزم بدقة وبشكل صارم بالقواعد والمعايير التالية:

  1- **الهدف الجوهري:** ركز حصراً على (أساليب الحفظ السريع، طرق ربط الآيات ببعضها، تقنيات الإتقان وتثبيت المحفوظ، وتعليم أحكام التجويد بطرق إبداعية).
  2- **الاستبعاد:** لا تركز على دروس الأخلاق، أو الوعظ، أو "العمل بالقرآن"؛ هدفنا هو الجانب المهاري البحت في الحفظ والتجويد.
  3- **سهولة التطبيق:** الأفكار يجب أن تكون سهلة التنفيذ الفوري داخل الحلقة دون تعقيد.
  4- **ضابط التفسير:** الابتعاد تماماً عن الخوض في "تفسير القرآن الكريم" أو أي مسائل خلافية. اكتفِ فقط بالفهم العام البسيط جداً الذي يساعد على "ربط الآيات" وذهن الطالب أثناء الحفظ.
  5- **الأدوات:** مسموح فقط بـ (أوراق، أقلام، سبورة، هواتف ذكية).
  6- **التجدد:** يجب أن تكون الفكرة مبتكرة، خارج الصندوق، وغير مكررة تماماً.
  7- **الفئة المستهدفة:** صِغ الفكرة بأسلوب يناسب ${isAdult ? "الكبار والبالغين" : "الأطفال والناشئة"}.`;

  const prompt = `المطلوب الآن: توليد فكرة عملية ومبتكرة في مجال: "${targetCategory}".
  تذكر: التركيز على الحفظ والربط والإتقان والتجويد فقط. أجب بصيغة JSON حصراً وباللغة العربية الفصحى الميسرة.`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        systemInstruction: systemInstruction,
        responseMimeType: "application/json",
        responseSchema: RESPONSE_SCHEMA,
        temperature: 1, // درجة حرارة عالية لضمان التجديد والابتكار
      },
    });

    const text = response.text;
    if (!text) throw new Error("Empty response from Gemini");
    return JSON.parse(text.trim()) as TeachingIdea;
  } catch (error: any) {
    console.error("Gemini Error:", error);
    throw error;
  }
};

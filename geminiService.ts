
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
  // إنشاء نسخة جديدة في كل مرة لضمان استخدام أحدث مفتاح بيئة
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

  const systemInstruction = `أنت مساعد خبير تقني وتربوي متخصص حصرياً في "مهارات تحفيظ القرآن الكريم وتجويده".
  مهمتك هي ابتكار أساليب عملية تركز حصراً على الجوانب المهارية التالية:
  1. **الحفظ والإتقان:** أساليب مبتكرة للحفظ السريع وتثبيت الآيات في الذاكرة.
  2. **ربط الآيات:** تقنيات ذكية لربط نهاية الآيات ببداياتها، وربط المقاطع ببعضها لفظياً وذهنياً.
  3. **التجويد والأداء:** طرق تفاعلية لتعلم مخارج الحروف وأحكام التجويد (مثل المدود، الغنن، إلخ).
  4. **المراجعة:** أساليب غير تقليدية لتثبيت المتشابهات.

  الضوابط الصارمة والمقدسة:
  - **الأدوات:** يُمنع اقتراح أي أدوات خارج: (أوراق، أقلام، سبورة، هواتف ذكية).
  - **التفسير:** يُمنع منعاً باتاً الدخول في تفاسير القرآن الكريم العميقة أو المسائل العلمية/الخلافية. اكتفِ فقط بالمعنى الإجمالي الميسر جداً الذي يخدم "ربط الآيات" ذهنياً فقط.
  - **الأخلاق والوعظ:** يُمنع التركيز على دروس الأخلاق أو السلوك أو "العمل بالقرآن"؛ هدفنا هو الجانب المهاري البحت في الحفظ والأداء التجويدي.
  - **سهولة التطبيق:** يجب أن تكون الفكرة قابلة للتنفيذ الفوري والسهل في الحلقة.
  - **الابتكار:** يجب أن تكون كل فكرة جديدة تماماً وغير مكررة، بعيدة عن الأساليب التقليدية.`;

  const prompt = `المطلوب الآن: توليد فكرة عملية ومبتكرة لـ ${isAdult ? "طلاب كبار" : "أطفال صغار"} في مجال: "${targetCategory}".
  تذكر: التركيز على (الحفظ، الربط، الإتقان، التجويد) فقط. أجب بصيغة JSON حصراً وباللغة العربية الفصحى الميسرة.`;

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
    if (!text) throw new Error("لم يتم استلام استجابة من الخادم");
    return JSON.parse(text.trim()) as TeachingIdea;
  } catch (error: any) {
    console.error("Gemini API Error:", error);
    throw error;
  }
};

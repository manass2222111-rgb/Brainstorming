
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
  const apiKey = process.env.API_KEY;

  if (!apiKey) {
    throw new Error("API_KEY_MISSING");
  }

  const ai = new GoogleGenAI({ apiKey });
  
  const categoryNames: Record<string, string> = {
    [CategoryId.HIFZ]: "تحفيظ وحفظ جديد بأساليب غير تقليدية",
    [CategoryId.REVIEW]: "مراجعة وتثبيت المحفوظ بطرق تفاعلية",
    [CategoryId.MOTIVATION]: "تحفيز وتشجيع الطلاب وكسر الروتين",
    [CategoryId.MANAGEMENT]: "ضبط الحلقة وإدارة الوقت بذكاء",
    [CategoryId.TAJWEED]: "تطوير الأداء والتجويد بمتعة وبساطة",
  };

  const targetCategory = category === CategoryId.ALL ? "أفكار إبداعية تربوية شاملة" : categoryNames[category];
  const levelText = level === StudentLevel.ADULTS ? "للكبار والشباب" : "للأطفال والناشئة";

  const prompt = `أعطني فكرة مهارية إبداعية وعملية ${levelText} في مجال ${targetCategory} داخل حلقات القرآن الكريم. اجعل الفكرة مدهشة، سهلة التطبيق، وتترك أثراً عميقاً في نفوس الطلاب.`;

  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: prompt,
    config: {
      systemInstruction: "أنت خبير تربوي عالمي متخصص في حلقات تحفيظ القرآن الكريم. تقدم أفكاراً خارج الصندوق، تجمع بين الأصالة والتقنيات الحديثة، وتجعل الحلقة تجربة ممتعة لا تُنسى.",
      responseMimeType: "application/json",
      responseSchema: RESPONSE_SCHEMA,
    },
  });

  if (!response.text) throw new Error("EMPTY_RESPONSE");
  return JSON.parse(response.text) as TeachingIdea;
};


import React, { useState, useEffect } from 'react';
import { 
  Sparkles, 
  RefreshCw, 
  Share2, 
  Filter, 
  Trophy, 
  Brain, 
  Users, 
  Book,
  Wind,
  Baby,
  User,
  Clock,
  Lightbulb,
  AlertTriangle,
  Key,
  CheckCircle2
} from 'lucide-react';
import { CategoryId, TeachingIdea, Category, StudentLevel } from './types';
import { generateIdea } from './geminiService';

const CATEGORIES: Category[] = [
  { id: CategoryId.ALL, label: 'أفكار منوعة', icon: <Filter size={24} />, color: 'orange' },
  { id: CategoryId.HIFZ, label: 'طرق حفظ', icon: <Book size={24} />, color: 'orange' },
  { id: CategoryId.REVIEW, label: 'مراجعة وتثبيت', icon: <Brain size={24} />, color: 'orange' },
  { id: CategoryId.MOTIVATION, label: 'تحفيز وتشجيع', icon: <Trophy size={24} />, color: 'orange' },
  { id: CategoryId.MANAGEMENT, label: 'ضبط الحلقة', icon: <Users size={24} />, color: 'orange' },
  { id: CategoryId.TAJWEED, label: 'تجويد وأداء', icon: <Wind size={24} />, color: 'orange' },
];

const App: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<CategoryId>(CategoryId.ALL);
  const [studentLevel, setStudentLevel] = useState<StudentLevel>(StudentLevel.CHILDREN);
  const [idea, setIdea] = useState<TeachingIdea | null>(null);
  const [error, setError] = useState<{title: string, msg: string, isKeyIssue: boolean} | null>(null);

  // تحقق أولي من وجود المفتاح
  useEffect(() => {
    if (!process.env.API_KEY || process.env.API_KEY === 'undefined') {
      setError({
        title: "تنبيه: مفتاح الـ API غير نشط",
        msg: "يبدو أن التطبيق لا يستطيع الوصول للمفتاح من إعدادات Vercel حالياً.",
        isKeyIssue: true
      });
    }
  }, []);

  const handleGenerate = async () => {
    setLoading(true);
    setError(null);
    try {
      const newIdea = await generateIdea(selectedCategory, studentLevel);
      setIdea(newIdea);
      setTimeout(() => {
        document.getElementById('result-section')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 100);
    } catch (err: any) {
      console.error("Gemini Error:", err);
      setError({
        title: "عذراً، حدث خطأ",
        msg: err.message === "API_KEY_MISSING" 
          ? "مفتاح API_KEY مفقود في إعدادات البيئة (Vercel/Environment Variables)."
          : "فشل الاتصال بالخادم. يرجى التحقق من جودة الإنترنت أو صلاحية المفتاح.",
        isKeyIssue: err.message === "API_KEY_MISSING"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FDFDFB] text-[#1E293B] font-['Tajawal'] pb-20" dir="rtl">
      {/* Navbar */}
      <nav className="bg-white/80 backdrop-blur-md sticky top-0 z-50 border-b border-slate-100 shadow-sm">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3 flex-row-reverse">
            <div className="bg-[#064E3B] p-2 rounded-xl shadow-lg rotate-3">
              <img src="https://www.awqaf.gov.ae/assets/mediakit/AwqafLogoIcon.png" alt="Logo" className="w-9 h-9 object-contain invert" />
            </div>
            <div className="text-right">
              <h1 className="text-xl md:text-2xl font-black text-[#064E3B] leading-none">مُعين المحفظ</h1>
              <span className="text-[10px] font-bold text-[#B45309] uppercase tracking-[0.2em]">الذكاء الاصطناعي في خدمة القرآن</span>
            </div>
          </div>
          {process.env.API_KEY && (
             <div className="hidden md:flex items-center gap-2 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-100">
               <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
               <span className="text-[10px] font-bold text-emerald-700 uppercase">System Ready</span>
             </div>
          )}
        </div>
      </nav>

      <main className="max-w-6xl mx-auto px-6 mt-12">
        {/* Toggle Student Level */}
        <div className="flex justify-center mb-12">
          <div className="bg-slate-100 p-1.5 rounded-[2rem] flex w-full max-w-sm shadow-inner relative">
            <button
              onClick={() => setStudentLevel(StudentLevel.CHILDREN)}
              className={`flex-1 py-4 rounded-[1.7rem] text-sm md:text-base font-black transition-all duration-300 z-10 flex items-center justify-center gap-2 ${
                studentLevel === StudentLevel.CHILDREN ? 'text-white' : 'text-slate-400'
              }`}
            >
              <Baby size={18} /> للأطفال
            </button>
            <button
              onClick={() => setStudentLevel(StudentLevel.ADULTS)}
              className={`flex-1 py-4 rounded-[1.7rem] text-sm md:text-base font-black transition-all duration-300 z-10 flex items-center justify-center gap-2 ${
                studentLevel === StudentLevel.ADULTS ? 'text-white' : 'text-slate-400'
              }`}
            >
              <User size={18} /> للكبار
            </button>
            <div 
              className={`absolute top-1.5 bottom-1.5 w-[calc(50%-6px)] bg-[#064E3B] rounded-[1.6rem] transition-all duration-500 shadow-xl ${
                studentLevel === StudentLevel.CHILDREN ? 'right-1.5' : 'right-[50%]'
              }`}
            />
          </div>
        </div>

        {/* Categories Grid - 3 Columns for Desktop */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 mb-16">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`group flex flex-col items-center justify-center gap-5 p-10 md:p-12 rounded-[3rem] transition-all duration-500 border-2 active:scale-95 ${
                selectedCategory === cat.id 
                  ? 'bg-white border-[#B45309] shadow-2xl shadow-orange-100 scale-[1.02]' 
                  : 'bg-white border-transparent hover:border-slate-100 shadow-sm'
              }`}
            >
              <div className={`p-5 rounded-2xl transition-all duration-500 ${
                selectedCategory === cat.id 
                  ? 'bg-[#B45309] text-white shadow-lg rotate-6' 
                  : 'bg-slate-50 text-slate-300 group-hover:bg-orange-50 group-hover:text-orange-200'
              }`}>
                {cat.icon}
              </div>
              <span className={`text-lg md:text-2xl font-black ${
                selectedCategory === cat.id ? 'text-[#064E3B]' : 'text-slate-400'
              }`}>
                {cat.label}
              </span>
            </button>
          ))}
        </div>

        {/* Action Button */}
        <div className="max-w-md mx-auto mb-20">
          <button
            onClick={handleGenerate}
            disabled={loading}
            className={`w-full py-7 rounded-[2.5rem] text-xl md:text-2xl font-black flex items-center justify-center gap-4 transition-all duration-500 shadow-2xl ${
              loading 
                ? 'bg-slate-100 text-slate-300 cursor-not-allowed scale-95' 
                : 'bg-[#064E3B] text-white hover:bg-[#053a2b] hover:shadow-emerald-900/20 hover:-translate-y-1'
            }`}
          >
            {loading ? <RefreshCw className="animate-spin" size={28} /> : (
              <>
                <span>استلهم الآن</span>
                <Sparkles className="text-yellow-400" size={28} />
              </>
            )}
          </button>
        </div>

        {/* Error Section */}
        {error && (
          <div className="max-w-2xl mx-auto bg-white border-2 border-red-50 p-10 rounded-[3rem] shadow-xl text-center mb-16 animate-in zoom-in-95 duration-500">
            <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-6">
              <AlertTriangle className="text-red-500" size={40} />
            </div>
            <h3 className="text-2xl font-black text-red-900 mb-3">{error.title}</h3>
            <p className="text-red-600 font-bold mb-8 leading-relaxed">{error.msg}</p>
            
            {error.isKeyIssue && (
              <div className="bg-slate-50 p-6 rounded-2xl text-right border border-slate-100">
                <h4 className="font-black text-[#064E3B] mb-4 flex items-center gap-2 underline underline-offset-4">
                  <Key size={18} /> خطوات التثبيت في Vercel:
                </h4>
                <ul className="space-y-3 text-sm font-bold text-slate-600">
                  <li className="flex gap-3"><CheckCircle2 size={16} className="text-emerald-500 flex-shrink-0" /> اذهب لـ <b>Settings</b> ثم <b>Environment Variables</b>.</li>
                  <li className="flex gap-3"><CheckCircle2 size={16} className="text-emerald-500 flex-shrink-0" /> أضف مفتاحاً باسم <b>API_KEY</b> وقيمته هي التي أرسلتها لي.</li>
                  <li className="flex gap-3"><CheckCircle2 size={16} className="text-emerald-500 flex-shrink-0" /> اذهب لـ <b>Deployments</b> واضغط <b>Redeploy</b> لآخر عملية نشر.</li>
                </ul>
              </div>
            )}
          </div>
        )}

        {/* Result Card */}
        <div id="result-section">
          {idea && !loading && (
            <div className="bg-white rounded-[4rem] shadow-2xl overflow-hidden border border-slate-50 animate-in slide-in-from-bottom-10 duration-700">
              <div className="bg-gradient-to-br from-[#064E3B] to-[#043d2e] p-12 md:p-20 text-white relative">
                <div className="flex justify-between items-start mb-8">
                  <div className="bg-white/10 px-6 py-2 rounded-full text-xs font-black border border-white/20 backdrop-blur-sm">
                    {idea.category}
                  </div>
                  <div className="flex items-center gap-2 text-xs font-bold opacity-70">
                    <Clock size={18} /> {idea.estimatedTime}
                  </div>
                </div>
                <h3 className="text-3xl md:text-5xl font-black mb-6 leading-tight">{idea.title}</h3>
                <div className="absolute -bottom-10 right-12 md:right-20 bg-[#B45309] p-7 rounded-3xl shadow-2xl ring-8 ring-white floating">
                  <Lightbulb className="text-white" size={40} />
                </div>
              </div>

              <div className="p-12 md:p-20 pt-20">
                <div className="bg-orange-50/50 p-8 md:p-12 rounded-[2.5rem] border border-orange-100/50 mb-12 text-center shadow-inner">
                  <p className="text-xl md:text-3xl text-slate-700 font-medium italic leading-relaxed">"{idea.description}"</p>
                </div>

                <div className="space-y-8 mb-16">
                  <h4 className="font-black text-[#064E3B] text-2xl flex items-center gap-4">
                    <div className="w-2 h-8 bg-[#B45309] rounded-full"></div>
                    خطة التنفيذ
                  </h4>
                  <div className="grid gap-4">
                    {idea.steps.map((step, i) => (
                      <div key={i} className="flex gap-6 items-start bg-slate-50/30 p-7 rounded-3xl border border-transparent hover:border-orange-100 transition-all duration-300">
                        <div className="w-10 h-10 rounded-xl bg-white text-[#B45309] font-black flex items-center justify-center flex-shrink-0 shadow-sm border border-orange-50">
                          {i + 1}
                        </div>
                        <p className="text-slate-600 font-bold text-lg md:text-2xl leading-relaxed">{step}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-[#064E3B] p-12 rounded-[3.5rem] text-center mb-12 shadow-2xl relative overflow-hidden group">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-16 -mt-16 transition-transform group-hover:scale-150 duration-700" />
                  <Trophy className="mx-auto text-yellow-400 mb-4" size={48} />
                  <h4 className="font-black text-[10px] text-yellow-400 uppercase tracking-[0.4em] mb-3">الأثر والنتيجة</h4>
                  <p className="text-white font-black text-2xl md:text-4xl leading-tight">{idea.benefit}</p>
                </div>

                <button
                  onClick={() => {
                    const text = `💡 فكرة إبداعية للحلقة: *${idea.title}*\n\n🌟 الأثر: ${idea.benefit}\n\nتوليد عبر مُعين المحفظ الذكي.`;
                    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
                  }}
                  className="w-full bg-slate-900 text-white py-7 rounded-[2rem] font-black text-xl flex items-center justify-center gap-4 hover:bg-black transition-all shadow-xl active:scale-95"
                >
                  <Share2 size={24} /> شارك الفكرة مع معلمين آخرين
                </button>
              </div>
            </div>
          )}
        </div>
      </main>

      <footer className="mt-40 text-center opacity-20 pb-12">
        <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.6em]">مُعين المحفظ • رؤية إبداعية لجيل القرآن • ٢٠٢٥</p>
      </footer>
    </div>
  );
};

export default App;

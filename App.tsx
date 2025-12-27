
import React, { useState } from 'react';
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
  Code
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
  const [error, setError] = useState<{title: string, msg: string, code?: string} | null>(null);

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
      console.error("Caught Error:", err);
      if (err.message === "ENV_KEY_MISSING") {
        setError({
          title: "لم يتم العثور على المفتاح",
          msg: "التطبيق لا يستطيع رؤية API_KEY. يرجى التأكد من إضافته في Vercel باسم API_KEY تماماً.",
          code: "Error: process.env.API_KEY is undefined"
        });
      } else {
        setError({
          title: "خطأ في الاتصال بـ Gemini",
          msg: "حدث خطأ أثناء محاولة توليد الفكرة. قد يكون السبب في صلاحيات المفتاح أو ضغط الشبكة.",
          code: err.toString()
        });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FDFDFB] text-[#1E293B] font-['Tajawal'] pb-20" dir="rtl">
      {/* Navbar */}
      <nav className="bg-white sticky top-0 z-50 border-b border-slate-100 shadow-sm">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3 flex-row-reverse">
            <div className="bg-[#064E3B] p-2 rounded-xl shadow-lg">
              <img src="https://www.awqaf.gov.ae/assets/mediakit/AwqafLogoIcon.png" alt="Logo" className="w-10 h-10 object-contain invert" />
            </div>
            <div className="text-right">
              <h1 className="text-xl md:text-2xl font-black text-[#064E3B] leading-none">مُعين المحفظ</h1>
              <span className="text-[10px] font-bold text-[#B45309] uppercase tracking-widest">منصة الإبداع القرآني</span>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-6xl mx-auto px-6 mt-10">
        {/* Toggle Level */}
        <div className="flex justify-center mb-10">
          <div className="bg-slate-100 rounded-2xl p-1 flex w-full max-w-xs relative shadow-inner">
            <button
              onClick={() => setStudentLevel(StudentLevel.CHILDREN)}
              className={`flex-1 py-3 rounded-xl text-sm font-black transition-all z-10 ${
                studentLevel === StudentLevel.CHILDREN ? 'text-white' : 'text-slate-400'
              }`}
            >
              للأطفال
            </button>
            <button
              onClick={() => setStudentLevel(StudentLevel.ADULTS)}
              className={`flex-1 py-3 rounded-xl text-sm font-black transition-all z-10 ${
                studentLevel === StudentLevel.ADULTS ? 'text-white' : 'text-slate-400'
              }`}
            >
              للكبار
            </button>
            <div 
              className={`absolute top-1 bottom-1 w-[calc(50%-4px)] bg-[#064E3B] rounded-xl transition-all duration-300 shadow-md ${
                studentLevel === StudentLevel.CHILDREN ? 'right-1' : 'right-[50%]'
              }`}
            />
          </div>
        </div>

        {/* Categories Grid - 3 Columns Desktop */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6 mb-12">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`flex flex-col items-center justify-center gap-4 p-6 md:p-10 rounded-[2.5rem] bg-white transition-all duration-300 border-2 active:scale-95 ${
                selectedCategory === cat.id 
                  ? 'border-[#B45309] shadow-xl bg-orange-50/20' 
                  : 'border-transparent hover:border-slate-100 shadow-sm'
              }`}
            >
              <div className={`p-4 rounded-2xl transition-all ${
                selectedCategory === cat.id 
                  ? 'bg-[#B45309] text-white shadow-lg scale-110' 
                  : 'bg-slate-50 text-slate-300'
              }`}>
                {cat.icon}
              </div>
              <span className={`text-base md:text-xl font-black ${
                selectedCategory === cat.id ? 'text-[#064E3B]' : 'text-slate-400'
              }`}>
                {cat.label}
              </span>
            </button>
          ))}
        </div>

        {/* Main Action */}
        <div className="max-w-md mx-auto mb-16">
          <button
            onClick={handleGenerate}
            disabled={loading}
            className={`w-full py-6 rounded-[2rem] text-xl md:text-2xl font-black flex items-center justify-center gap-3 transition-all duration-300 shadow-2xl ${
              loading 
                ? 'bg-slate-100 text-slate-300 cursor-not-allowed' 
                : 'bg-[#064E3B] text-white hover:bg-[#053a2b] hover:shadow-emerald-900/20'
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

        {/* Diagnostic Error Message */}
        {error && (
          <div className="bg-white border-2 border-red-100 p-8 rounded-[2.5rem] text-center mb-12 shadow-xl animate-in fade-in zoom-in-95">
            <AlertTriangle className="mx-auto text-red-500 mb-4" size={40} />
            <h4 className="text-red-900 font-black text-xl mb-2">{error.title}</h4>
            <p className="text-red-600 font-bold mb-6 text-sm">{error.msg}</p>
            
            <div className="bg-slate-900 text-left p-4 rounded-xl overflow-x-auto">
               <div className="flex items-center gap-2 text-blue-400 mb-2 border-b border-slate-700 pb-2">
                 <Code size={14} />
                 <span className="text-[10px] font-mono uppercase tracking-widest">Diagnostic Report</span>
               </div>
               <code className="text-[10px] font-mono text-slate-300 whitespace-pre">
                 {error.code}
                 {"\n"}Location: geminiService.ts -> generateIdea()
                 {"\n"}Action Required: Check Vercel Environment Variables
               </code>
            </div>
          </div>
        )}

        {/* Result Card */}
        <div id="result-section">
          {idea && !loading && (
            <div className="bg-white rounded-[3.5rem] shadow-2xl overflow-hidden border border-slate-50 animate-in slide-in-from-bottom-10 duration-700">
              <div className="bg-[#064E3B] p-10 md:p-16 text-white relative">
                <div className="flex justify-between items-start mb-6">
                  <span className="bg-white/10 px-4 py-1 rounded-full text-[10px] font-black border border-white/20 uppercase">
                    {idea.category}
                  </span>
                  <div className="flex items-center gap-2 text-xs font-bold opacity-70">
                    <Clock size={16} /> {idea.estimatedTime}
                  </div>
                </div>
                <h3 className="text-2xl md:text-4xl font-black mb-4 leading-tight">{idea.title}</h3>
                <div className="absolute -bottom-6 right-10 bg-[#B45309] p-5 rounded-2xl shadow-xl floating">
                  <Lightbulb className="text-white" size={28} />
                </div>
              </div>

              <div className="p-10 md:p-16 pt-16">
                <div className="bg-slate-50 p-6 md:p-10 rounded-3xl border border-slate-100 mb-10 text-center">
                  <p className="text-lg md:text-2xl text-slate-600 font-medium italic leading-relaxed">"{idea.description}"</p>
                </div>

                <div className="space-y-6 mb-12">
                  <h4 className="font-black text-[#064E3B] text-xl flex items-center gap-3">
                    <div className="w-1.5 h-6 bg-[#B45309] rounded-full"></div>
                    كيفية التطبيق
                  </h4>
                  <div className="grid gap-4">
                    {idea.steps.map((step, i) => (
                      <div key={i} className="flex gap-4 items-start bg-white p-5 rounded-2xl border border-slate-100 hover:border-orange-100 transition-all">
                        <div className="w-8 h-8 rounded-lg bg-orange-50 text-[#B45309] font-black flex items-center justify-center flex-shrink-0 text-sm">
                          {i + 1}
                        </div>
                        <p className="text-slate-500 font-bold text-base md:text-xl leading-relaxed">{step}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-gradient-to-r from-emerald-50 to-transparent p-8 rounded-[2.5rem] border border-emerald-100/50 mb-10 text-center">
                  <Trophy className="mx-auto text-[#B45309] mb-3" size={32} />
                  <h4 className="font-black text-[10px] text-[#B45309] uppercase tracking-widest mb-1">الأثر التربوي</h4>
                  <p className="text-[#064E3B] font-black text-xl md:text-3xl">{idea.benefit}</p>
                </div>

                <button
                  onClick={() => {
                    const text = `💡 فكرة إبداعية لحلقة القرآن: *${idea.title}*\n\n🌟 الأثر: ${idea.benefit}\n\nتمت التوليد عبر مُعين المحفظ الذكي.`;
                    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
                  }}
                  className="w-full bg-[#064E3B] text-white py-6 rounded-2xl font-black text-lg flex items-center justify-center gap-3 hover:bg-[#053a2b] transition-all shadow-xl active:scale-95"
                >
                  <Share2 size={20} /> مشاركة عبر واتساب
                </button>
              </div>
            </div>
          )}
        </div>
      </main>

      <footer className="mt-20 text-center opacity-20 pb-10">
        <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em]">مُعين المحفظ • خدمة إبداعية لأهل القرآن • ٢٠٢٥</p>
      </footer>
    </div>
  );
};

export default App;

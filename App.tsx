
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
  AlertCircle,
  Key
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
  const [error, setError] = useState<{title: string, msg: string} | null>(null);

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
      console.error("Error details:", err);
      if (err.message === "API_KEY_MISSING") {
        setError({
          title: "مفتاح API مفقود",
          msg: "لم يتم العثور على مفتاح التشغيل. يرجى التأكد من إضافته في إعدادات Vercel باسم API_KEY."
        });
      } else {
        setError({
          title: "خطأ في الاتصال",
          msg: "تأكد من صحة مفتاح API ومن اتصالك بالإنترنت، ثم حاول مجدداً."
        });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FDFDFB] text-[#1E293B] font-['Tajawal'] pb-20" dir="rtl">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-slate-100 mb-8 sticky top-0 z-50">
        <header className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4 flex-row-reverse">
            <div className="bg-white p-1 rounded-xl shadow-sm border border-slate-50 overflow-hidden w-12 h-12 md:w-16 md:h-16 flex items-center justify-center">
              <img 
                src="https://www.awqaf.gov.ae/assets/mediakit/AwqafLogoIcon.png" 
                alt="Logo" 
                className="w-full h-full object-contain p-1"
              />
            </div>
            <div className="text-right">
              <h1 className="text-xl md:text-3xl font-[900] text-[#064E3B] leading-none">مُعين المحفظ</h1>
              <p className="text-[10px] md:text-sm text-[#B45309] font-bold mt-1 uppercase tracking-widest leading-none">بنك الأفكار المهارية الذكي</p>
            </div>
          </div>
        </header>
      </div>

      <main className="max-w-6xl mx-auto px-6">
        {/* Student Level Switcher */}
        <div className="flex justify-center mb-10">
          <div className="bg-white rounded-full p-1 flex shadow-sm border border-slate-100 w-full max-w-sm relative">
            <button
              onClick={() => setStudentLevel(StudentLevel.CHILDREN)}
              className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-full text-lg font-bold transition-all z-10 ${
                studentLevel === StudentLevel.CHILDREN ? 'text-white' : 'text-slate-400'
              }`}
            >
              <Baby size={20} /> للأطفال
            </button>
            <button
              onClick={() => setStudentLevel(StudentLevel.ADULTS)}
              className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-full text-lg font-bold transition-all z-10 ${
                studentLevel === StudentLevel.ADULTS ? 'text-white' : 'text-slate-400'
              }`}
            >
              <User size={20} /> للكبار
            </button>
            <div 
              className={`absolute top-1 bottom-1 w-[calc(50%-4px)] bg-[#064E3B] rounded-full transition-all duration-300 shadow-md ${
                studentLevel === StudentLevel.CHILDREN ? 'right-1' : 'right-[50%]'
              }`}
            />
          </div>
        </div>

        {/* Categories Grid - Forced 3 columns for desktop */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6 mb-12">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`flex flex-col items-center justify-center gap-3 p-6 md:p-8 rounded-[2rem] bg-white transition-all duration-300 border-2 active:scale-95 shadow-sm ${
                selectedCategory === cat.id 
                  ? 'border-[#B45309] shadow-xl ring-4 ring-orange-50' 
                  : 'border-transparent hover:border-slate-100 hover:shadow-md'
              }`}
            >
              <div className={`transition-all duration-300 p-4 rounded-2xl flex items-center justify-center ${
                selectedCategory === cat.id 
                  ? 'bg-[#B45309] text-white scale-110 shadow-lg' 
                  : 'bg-slate-50 text-slate-300'
              }`}>
                {cat.icon}
              </div>
              <span className={`text-sm md:text-xl font-black ${selectedCategory === cat.id ? 'text-[#064E3B]' : 'text-slate-400'}`}>
                {cat.label}
              </span>
            </button>
          ))}
        </div>

        {/* Generate Button */}
        <div className="flex flex-col items-center gap-4 mb-16">
          <button
            onClick={handleGenerate}
            disabled={loading}
            className={`w-full py-6 md:py-8 rounded-[2.5rem] text-2xl md:text-3xl font-black flex items-center justify-center gap-4 transition-all duration-300 shadow-2xl active:scale-[0.98] relative overflow-hidden group ${
              loading 
                ? 'bg-slate-100 text-slate-300 cursor-not-allowed' 
                : 'bg-[#064E3B] text-white hover:bg-[#053a2b]'
            }`}
          >
            {loading ? <RefreshCw className="animate-spin" size={32} /> : (
              <>
                <span className="relative z-10">استلهم فكرة مهارية</span>
                <Sparkles className="text-yellow-400 relative z-10" size={32} />
              </>
            )}
            {!loading && <div className="absolute inset-0 bg-white/10 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>}
          </button>
          
          {/* Help hint if key missing */}
          {!process.env.API_KEY && (
            <div className="flex items-center gap-2 text-orange-600 bg-orange-50 px-4 py-2 rounded-full text-xs font-bold border border-orange-100">
              <Key size={14} />
              تأكد من ضبط الـ Environment Variables في Vercel
            </div>
          )}
        </div>

        {/* Error Notification */}
        {error && (
          <div className="bg-white border-2 border-red-100 p-8 rounded-[2.5rem] text-center mb-12 shadow-xl animate-in zoom-in-95">
            <div className="bg-red-50 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <AlertCircle className="text-red-500" size={32} />
            </div>
            <h4 className="text-red-900 font-black text-xl mb-2">{error.title}</h4>
            <p className="text-red-700 font-medium">{error.msg}</p>
          </div>
        )}

        {/* Result Area */}
        <div id="result-section">
          {idea && !loading && (
            <div className="bg-white rounded-[4rem] shadow-2xl overflow-hidden border border-slate-50 animate-in slide-in-from-bottom-20 duration-700">
              <div className="bg-[#064E3B] p-10 md:p-16 text-white relative">
                <div className="flex justify-between items-center mb-6">
                  <span className="bg-white/10 px-4 py-1 rounded-full text-sm font-bold border border-white/20">
                    {idea.category}
                  </span>
                  <div className="flex items-center gap-2 text-sm font-bold opacity-80">
                    <Clock size={18} /> {idea.estimatedTime}
                  </div>
                </div>
                <h3 className="text-2xl md:text-5xl font-black leading-tight mb-4">{idea.title}</h3>
                <div className="absolute -bottom-6 right-8 md:right-16 bg-[#B45309] p-5 md:p-6 rounded-3xl shadow-2xl ring-[8px] ring-white floating">
                  <Lightbulb className="text-white" size={32} />
                </div>
              </div>

              <div className="p-10 md:p-16 pt-16 text-right">
                <div className="bg-slate-50 p-6 md:p-10 rounded-[2.5rem] border border-slate-100 mb-10 text-center">
                  <p className="text-lg md:text-2xl text-slate-600 font-medium italic leading-relaxed">"{idea.description}"</p>
                </div>

                <div className="space-y-8 mb-12">
                  <h4 className="font-black text-[#064E3B] text-xl md:text-3xl flex items-center gap-3 flex-row-reverse">
                    <span className="w-1.5 h-8 bg-[#B45309] rounded-full"></span>
                    خطوات التنفيذ
                  </h4>
                  <div className="grid gap-4">
                    {idea.steps.map((step, i) => (
                      <div key={i} className="flex flex-row-reverse gap-4 items-start bg-white p-4 rounded-2xl border border-transparent hover:border-orange-100 hover:shadow-sm transition-all">
                        <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-orange-50 text-[#B45309] font-black text-lg flex items-center justify-center">
                          {i + 1}
                        </div>
                        <p className="text-slate-500 font-bold text-base md:text-xl pt-1.5 leading-relaxed flex-1">{step}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-gradient-to-br from-[#064E3B]/5 to-transparent rounded-[3rem] p-8 md:p-12 border border-[#064E3B]/10 mb-12 text-center">
                  <div className="flex items-center justify-center gap-2 mb-3 text-[#B45309]">
                    <Trophy size={28} />
                    <h4 className="font-black text-sm uppercase tracking-widest">الأثر التربوي المرجو</h4>
                  </div>
                  <p className="text-[#064E3B] font-black text-xl md:text-3xl leading-tight">{idea.benefit}</p>
                </div>

                <button
                  onClick={() => {
                    const text = `💡 فكرة مهارية من مُعين المحفظ: *${idea.title}*\n\n🌟 الأثر: ${idea.benefit}`;
                    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
                  }}
                  className="w-full bg-[#064E3B] text-white py-6 rounded-[2rem] font-black text-xl flex items-center justify-center gap-3 hover:bg-[#053a2b] transition-all shadow-xl active:scale-95"
                >
                  <Share2 size={24} /> مشاركة الفكرة عبر واتساب
                </button>
              </div>
            </div>
          )}
        </div>
      </main>

      <footer className="mt-20 text-center opacity-40 px-6">
        <p className="text-xs font-black text-slate-400 uppercase tracking-[0.4em] mb-1">مُعين المحفظ • منصة الإبداع المهارية</p>
        <p className="text-[10px] font-bold text-slate-300">نعتز بخدمة كتاب الله الكريم • ٢٠٢٥</p>
      </footer>
    </div>
  );
};

export default App;

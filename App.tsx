
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
  AlertCircle
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
      console.error("Gemini Error:", err);
      setError({
        title: "تنبيه التكوين",
        msg: "تأكد من إضافة API_KEY في إعدادات Vercel وعمل Redeploy للمشروع."
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
            <div className="bg-white p-1 rounded-xl shadow-sm border border-slate-100 w-12 h-12 flex items-center justify-center overflow-hidden">
              <img src="https://www.awqaf.gov.ae/assets/mediakit/AwqafLogoIcon.png" alt="Logo" className="w-full h-full object-contain" />
            </div>
            <div className="text-right">
              <h1 className="text-xl md:text-2xl font-black text-[#064E3B] leading-none">مُعين المحفظ</h1>
              <span className="text-[10px] font-bold text-[#B45309] uppercase tracking-widest">الإبداع في تعليم القرآن</span>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-6xl mx-auto px-6 mt-10">
        {/* Level Selector */}
        <div className="flex justify-center mb-12">
          <div className="bg-slate-100 rounded-3xl p-1.5 flex w-full max-w-sm relative shadow-inner">
            <button
              onClick={() => setStudentLevel(StudentLevel.CHILDREN)}
              className={`flex-1 py-3 rounded-2xl text-lg font-bold transition-all z-10 flex items-center justify-center gap-2 ${
                studentLevel === StudentLevel.CHILDREN ? 'text-white' : 'text-slate-400'
              }`}
            >
              <Baby size={20} /> للأطفال
            </button>
            <button
              onClick={() => setStudentLevel(StudentLevel.ADULTS)}
              className={`flex-1 py-3 rounded-2xl text-lg font-bold transition-all z-10 flex items-center justify-center gap-2 ${
                studentLevel === StudentLevel.ADULTS ? 'text-white' : 'text-slate-400'
              }`}
            >
              <User size={20} /> للكبار
            </button>
            <div 
              className={`absolute top-1.5 bottom-1.5 w-[calc(50%-6px)] bg-[#064E3B] rounded-2xl transition-all duration-500 shadow-xl ${
                studentLevel === StudentLevel.CHILDREN ? 'right-1.5' : 'right-[50%]'
              }`}
            />
          </div>
        </div>

        {/* Categories Grid - 3 Columns Desktop / 2 Columns Mobile */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-8 mb-16">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`group flex flex-col items-center justify-center gap-4 p-8 rounded-[2.5rem] bg-white transition-all duration-300 border-2 active:scale-95 shadow-sm hover:shadow-xl ${
                selectedCategory === cat.id 
                  ? 'border-[#B45309] ring-8 ring-orange-50' 
                  : 'border-transparent hover:bg-slate-50'
              }`}
            >
              <div className={`p-5 rounded-3xl transition-all duration-500 ${
                selectedCategory === cat.id 
                  ? 'bg-[#B45309] text-white shadow-lg scale-110' 
                  : 'bg-slate-100 text-slate-300 group-hover:bg-slate-200'
              }`}>
                {cat.icon}
              </div>
              <span className={`text-lg md:text-xl font-black ${
                selectedCategory === cat.id ? 'text-[#064E3B]' : 'text-slate-400'
              }`}>
                {cat.label}
              </span>
            </button>
          ))}
        </div>

        {/* Call to Action */}
        <div className="max-w-2xl mx-auto mb-20">
          <button
            onClick={handleGenerate}
            disabled={loading}
            className={`w-full py-8 rounded-[3rem] text-2xl md:text-3xl font-black flex items-center justify-center gap-4 transition-all duration-300 shadow-2xl relative overflow-hidden group ${
              loading 
                ? 'bg-slate-100 text-slate-300 cursor-not-allowed' 
                : 'bg-[#064E3B] text-white hover:bg-[#053a2b] hover:scale-[1.02]'
            }`}
          >
            {loading ? <RefreshCw className="animate-spin" size={32} /> : (
              <>
                <span>استلهم فكرة مهارية</span>
                <Sparkles className="text-yellow-400 group-hover:rotate-12 transition-transform" size={32} />
              </>
            )}
            <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity" />
          </button>
        </div>

        {/* Error Handling */}
        {error && (
          <div className="bg-white border-2 border-red-50 p-10 rounded-[3rem] text-center mb-16 shadow-2xl animate-in zoom-in-95 duration-500">
            <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-6">
              <AlertCircle className="text-red-500" size={40} />
            </div>
            <h4 className="text-red-900 font-black text-2xl mb-2">{error.title}</h4>
            <p className="text-red-600 font-bold text-lg">{error.msg}</p>
          </div>
        )}

        {/* Result Card */}
        <div id="result-section">
          {idea && !loading && (
            <div className="bg-white rounded-[4rem] shadow-2xl overflow-hidden border border-slate-50 animate-in slide-in-from-bottom-20 duration-1000">
              <div className="bg-[#064E3B] p-12 md:p-20 text-white relative">
                <div className="flex justify-between items-center mb-8">
                  <span className="bg-white/10 px-6 py-2 rounded-full text-sm font-black border border-white/20 uppercase tracking-tighter">
                    {idea.category}
                  </span>
                  <div className="flex items-center gap-3 text-sm font-black opacity-90">
                    <Clock size={20} /> {idea.estimatedTime}
                  </div>
                </div>
                <h3 className="text-3xl md:text-5xl font-black leading-tight mb-6">{idea.title}</h3>
                <div className="absolute -bottom-8 right-12 md:right-24 bg-[#B45309] p-6 rounded-3xl shadow-2xl ring-[12px] ring-white floating">
                  <Lightbulb className="text-white" size={36} />
                </div>
              </div>

              <div className="p-12 md:p-20 pt-20">
                <div className="bg-slate-50 p-8 md:p-12 rounded-[3rem] border border-slate-100 mb-12 text-center">
                  <p className="text-xl md:text-3xl text-slate-600 font-medium italic leading-relaxed">"{idea.description}"</p>
                </div>

                <div className="space-y-10 mb-16">
                  <h4 className="font-black text-[#064E3B] text-2xl md:text-4xl flex items-center gap-4">
                    <div className="w-2 h-10 bg-[#B45309] rounded-full"></div>
                    خطوات التنفيذ
                  </h4>
                  <div className="grid gap-6">
                    {idea.steps.map((step, i) => (
                      <div key={i} className="flex gap-6 items-start bg-white p-6 rounded-3xl border border-transparent hover:border-orange-100 hover:shadow-xl transition-all duration-300">
                        <div className="w-12 h-12 rounded-2xl bg-orange-50 text-[#B45309] font-black text-2xl flex items-center justify-center flex-shrink-0 shadow-sm">
                          {i + 1}
                        </div>
                        <p className="text-slate-500 font-bold text-lg md:text-2xl pt-1.5 leading-relaxed">{step}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-gradient-to-br from-[#064E3B]/5 to-transparent p-10 md:p-16 rounded-[4rem] border border-[#064E3B]/10 mb-16 text-center">
                  <Trophy className="mx-auto text-[#B45309] mb-4" size={48} />
                  <h4 className="font-black text-xs text-[#B45309] uppercase tracking-[0.3em] mb-3">الأثر التربوي المرجو</h4>
                  <p className="text-[#064E3B] font-black text-2xl md:text-4xl leading-tight">{idea.benefit}</p>
                </div>

                <button
                  onClick={() => {
                    const text = `💡 فكرة مهارية من مُعين المحفظ: *${idea.title}*\n\n🌟 الأثر: ${idea.benefit}`;
                    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
                  }}
                  className="w-full bg-[#064E3B] text-white py-7 rounded-[2.5rem] font-black text-xl md:text-2xl flex items-center justify-center gap-4 hover:bg-[#053a2b] transition-all shadow-2xl active:scale-[0.98]"
                >
                  <Share2 size={28} /> مشاركة عبر واتساب
                </button>
              </div>
            </div>
          )}
        </div>
      </main>

      <footer className="mt-32 text-center opacity-20 pb-10">
        <p className="text-xs font-black text-slate-400 uppercase tracking-[0.5em]">مُعين المحفظ • خدمة أهل القرآن • ٢٠٢٥</p>
      </footer>
    </div>
  );
};

export default App;


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
  AlertCircle,
  Settings,
  ShieldAlert,
  ArrowLeft
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
      console.error("Gemini Error Context:", err);
      const isKeyMissing = err.message.includes("API_KEY") || !process.env.API_KEY;
      setError({
        title: isKeyMissing ? "مشكلة في إعدادات المفتاح" : "عذراً، حدث خطأ تقني",
        msg: isKeyMissing 
          ? "لم يتمكن التطبيق من العثور على مفتاح API_KEY في إعدادات البيئة الخاصة بك." 
          : "هناك مشكلة في الاتصال بخدمات Gemini، يرجى المحاولة مرة أخرى.",
        isKeyIssue: isKeyMissing
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FDFDFB] text-[#1E293B] font-['Tajawal'] pb-20" dir="rtl">
      {/* Header */}
      <nav className="bg-white/90 backdrop-blur-lg sticky top-0 z-50 border-b border-slate-100 shadow-sm">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between flex-row-reverse">
          <div className="flex items-center gap-4">
            <div className="text-right">
              <h1 className="text-2xl font-black text-[#064E3B] leading-none">مُعين المحفظ</h1>
              <p className="text-[11px] font-bold text-[#B45309] mt-1 tracking-widest">الإبداع في تعليم القرآن</p>
            </div>
            <div className="bg-[#064E3B] p-2.5 rounded-2xl shadow-lg rotate-3 group-hover:rotate-0 transition-transform">
              <img src="https://www.awqaf.gov.ae/assets/mediakit/AwqafLogoIcon.png" alt="Logo" className="w-10 h-10 object-contain invert" />
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-6xl mx-auto px-6 mt-12">
        {/* Selection Level */}
        <div className="flex justify-center mb-12">
          <div className="bg-slate-100/80 p-1.5 rounded-[2rem] flex w-full max-w-sm shadow-inner">
            {[
              { id: StudentLevel.CHILDREN, label: 'للأطفال', icon: <Baby size={18} /> },
              { id: StudentLevel.ADULTS, label: 'للكبار', icon: <User size={18} /> }
            ].map((level) => (
              <button
                key={level.id}
                onClick={() => setStudentLevel(level.id)}
                className={`flex-1 py-4 rounded-[1.6rem] flex items-center justify-center gap-2 font-black transition-all duration-500 ${
                  studentLevel === level.id 
                    ? 'bg-[#064E3B] text-white shadow-xl scale-[1.02]' 
                    : 'text-slate-400 hover:text-slate-600'
                }`}
              >
                {level.icon} {level.label}
              </button>
            ))}
          </div>
        </div>

        {/* Categories - 3 Columns Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-5 md:gap-8 mb-16">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`group relative flex flex-col items-center justify-center p-8 md:p-12 rounded-[3rem] transition-all duration-300 border-2 active:scale-95 ${
                selectedCategory === cat.id 
                  ? 'bg-white border-[#B45309] shadow-2xl shadow-orange-100 ring-4 ring-orange-50/50' 
                  : 'bg-white border-transparent shadow-sm hover:shadow-xl hover:border-slate-100'
              }`}
            >
              <div className={`mb-5 p-5 rounded-3xl transition-all duration-500 ${
                selectedCategory === cat.id 
                  ? 'bg-[#B45309] text-white shadow-lg rotate-6 scale-110' 
                  : 'bg-slate-50 text-slate-300 group-hover:bg-orange-50 group-hover:text-orange-300'
              }`}>
                {cat.icon}
              </div>
              <span className={`text-lg md:text-2xl font-black text-center ${
                selectedCategory === cat.id ? 'text-[#064E3B]' : 'text-slate-400'
              }`}>
                {cat.label}
              </span>
              {selectedCategory === cat.id && (
                <div className="absolute top-4 left-4">
                  <div className="w-2 h-2 bg-[#B45309] rounded-full animate-ping" />
                </div>
              )}
            </button>
          ))}
        </div>

        {/* Action Button */}
        <div className="max-w-xl mx-auto mb-20 text-center">
          <button
            onClick={handleGenerate}
            disabled={loading}
            className={`group w-full py-8 rounded-[3rem] text-2xl md:text-3xl font-black flex items-center justify-center gap-4 transition-all duration-500 shadow-2xl relative overflow-hidden ${
              loading 
                ? 'bg-slate-100 text-slate-300' 
                : 'bg-[#064E3B] text-white hover:bg-[#043d2e] hover:scale-[1.03] active:scale-95'
            }`}
          >
            {loading ? <RefreshCw className="animate-spin" size={32} /> : (
              <>
                <span>استلهم فكرة جديدة</span>
                <Sparkles className="text-yellow-400 group-hover:rotate-12 transition-transform" size={32} />
              </>
            )}
          </button>
          <p className="mt-4 text-slate-400 font-bold text-sm">اضغط لتوليد فكرة إبداعية فورية للحلقة</p>
        </div>

        {/* Enhanced Error / Diagnostic Section */}
        {error && (
          <div className="max-w-3xl mx-auto bg-white border-2 border-red-50 p-10 md:p-16 rounded-[4rem] shadow-2xl animate-in zoom-in-95 duration-500 mb-20">
            <div className="flex flex-col items-center text-center">
              <div className="w-24 h-24 bg-red-50 rounded-full flex items-center justify-center mb-8">
                {error.isKeyIssue ? <ShieldAlert className="text-red-500" size={48} /> : <AlertCircle className="text-red-500" size={48} />}
              </div>
              <h2 className="text-3xl font-black text-red-900 mb-4">{error.title}</h2>
              <p className="text-red-600 text-xl font-bold mb-10 max-w-lg leading-relaxed">{error.msg}</p>

              {error.isKeyIssue && (
                <div className="w-full bg-slate-50 p-8 rounded-[2.5rem] border border-slate-100 text-right">
                  <h3 className="font-black text-[#064E3B] mb-6 flex items-center gap-2">
                    <Settings size={20} /> خطوات الحل في Vercel:
                  </h3>
                  <div className="space-y-4">
                    {[
                      "اذهب إلى مشروعك في لوحة تحكم Vercel.",
                      "اختر تبويب Settings ثم Environment Variables.",
                      "أضف مفتاحاً جديداً باسم API_KEY وضع قيمته التي أرسلتها لي.",
                      "هام جداً: اذهب لتبويب Deployments واعمل Redeploy للمشروع."
                    ].map((step, i) => (
                      <div key={i} className="flex gap-4 items-start">
                        <div className="bg-[#064E3B] text-white w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 mt-1">{i+1}</div>
                        <p className="text-slate-600 font-bold">{step}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Results */}
        <div id="result-section">
          {idea && !loading && (
            <div className="bg-white rounded-[4rem] shadow-2xl overflow-hidden border border-slate-50 animate-in slide-in-from-bottom-20 duration-1000">
              <div className="bg-gradient-to-br from-[#064E3B] to-[#043d2e] p-12 md:p-20 text-white relative">
                <div className="flex justify-between items-center mb-8">
                  <div className="flex items-center gap-3 bg-white/10 px-6 py-2 rounded-full border border-white/20">
                    <Clock size={18} />
                    <span className="text-sm font-black">{idea.estimatedTime}</span>
                  </div>
                  <span className="text-sm font-black opacity-60 tracking-widest uppercase">{idea.category}</span>
                </div>
                <h3 className="text-4xl md:text-6xl font-black leading-tight mb-8">{idea.title}</h3>
                <div className="absolute -bottom-10 right-16 md:right-24 bg-[#B45309] p-8 rounded-[2.5rem] shadow-2xl ring-[15px] ring-white floating">
                  <Lightbulb className="text-white" size={48} />
                </div>
              </div>

              <div className="p-12 md:p-24 pt-24">
                <div className="bg-orange-50/50 p-10 md:p-16 rounded-[3rem] border border-orange-100/50 mb-16 text-center">
                  <p className="text-2xl md:text-4xl text-slate-700 font-medium italic leading-relaxed">"{idea.description}"</p>
                </div>

                <div className="space-y-12 mb-20">
                  <div className="flex items-center gap-4">
                    <div className="w-3 h-12 bg-[#B45309] rounded-full" />
                    <h4 className="font-black text-[#064E3B] text-3xl md:text-4xl">خارطة التنفيذ</h4>
                  </div>
                  <div className="grid gap-6">
                    {idea.steps.map((step, i) => (
                      <div key={i} className="flex gap-8 items-start bg-slate-50/50 p-8 rounded-[2.5rem] border border-transparent hover:border-orange-200 transition-all duration-300">
                        <div className="w-14 h-14 rounded-2xl bg-white text-[#B45309] font-black text-2xl flex items-center justify-center flex-shrink-0 shadow-sm border border-orange-100">
                          {i + 1}
                        </div>
                        <p className="text-slate-600 font-bold text-xl md:text-2xl pt-2 leading-relaxed">{step}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-[#064E3B] p-12 md:p-16 rounded-[4rem] text-center mb-16 shadow-xl shadow-emerald-900/10">
                  <Trophy className="mx-auto text-yellow-400 mb-6" size={56} />
                  <h4 className="font-black text-yellow-400/60 text-xs uppercase tracking-[0.4em] mb-4">الثمرة التربوية</h4>
                  <p className="text-white font-black text-3xl md:text-5xl leading-tight">{idea.benefit}</p>
                </div>

                <button
                  onClick={() => {
                    const text = `💡 استلهمت فكرة إبداعية من "مُعين المحفظ": *${idea.title}*\n\n🌟 الأثر: ${idea.benefit}`;
                    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
                  }}
                  className="w-full bg-slate-900 text-white py-8 rounded-[3rem] font-black text-2xl flex items-center justify-center gap-4 hover:bg-black transition-all shadow-2xl active:scale-95"
                >
                  <Share2 size={32} /> شارك الفكرة مع المعلمين
                </button>
              </div>
            </div>
          )}
        </div>
      </main>

      <footer className="mt-40 text-center opacity-30 pb-12">
        <p className="text-xs font-black text-slate-400 uppercase tracking-[0.6em]">مُعين المحفظ • رؤية إبداعية لجيل القرآن • ٢٠٢٥</p>
      </footer>
    </div>
  );
};

export default App;

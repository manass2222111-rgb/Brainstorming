
import React, { useState, useEffect } from 'react';
import { 
  Sparkles, RefreshCw, Share2, Filter, Trophy, Brain, Users, 
  Book, Wind, Baby, User, Clock, Lightbulb, AlertCircle, CheckCircle, ChevronDown
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
  const [error, setError] = useState<{message: string, type: 'key' | 'general'} | null>(null);

  const handleGenerate = async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await generateIdea(selectedCategory, studentLevel);
      setIdea(result);
      setTimeout(() => {
        document.getElementById('result-area')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 100);
    } catch (err: any) {
      console.error(err);
      if (err.message === "API_KEY_MISSING") {
        setError({ message: "مفتاح الـ API مفقود في إعدادات Vercel. يرجى إضافة API_KEY والضغط على Redeploy.", type: 'key' });
      } else {
        setError({ message: "حدث خطأ غير متوقع. تأكد من اتصال الإنترنت وصلاحية المفتاح.", type: 'general' });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FDFDFB] text-[#1E293B] font-['Tajawal'] antialiased" dir="rtl">
      {/* Navbar */}
      <nav className="bg-white/80 backdrop-blur-md sticky top-0 z-50 border-b border-slate-100 shadow-sm">
        <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="bg-[#064E3B] p-2 rounded-xl shadow-lg rotate-3">
              <img src="https://www.awqaf.gov.ae/assets/mediakit/AwqafLogoIcon.png" className="w-8 h-8 invert" alt="Logo" />
            </div>
            <div>
              <h1 className="text-xl font-black text-[#064E3B] leading-none">مُعين المحفظ</h1>
              <span className="text-[9px] font-bold text-amber-600 uppercase tracking-widest">Innovation in Quran Teaching</span>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-6xl mx-auto px-6 py-12">
        {/* Level Toggle */}
        <div className="flex justify-center mb-16">
          <div className="bg-slate-100 p-1.5 rounded-full flex w-full max-w-sm shadow-inner relative">
            <button 
              onClick={() => setStudentLevel(StudentLevel.CHILDREN)}
              className={`flex-1 py-4 rounded-full text-base font-black z-10 transition-all duration-300 flex items-center justify-center gap-2 ${studentLevel === StudentLevel.CHILDREN ? 'text-white' : 'text-slate-400'}`}
            >
              <Baby size={18} /> للأطفال
            </button>
            <button 
              onClick={() => setStudentLevel(StudentLevel.ADULTS)}
              className={`flex-1 py-4 rounded-full text-base font-black z-10 transition-all duration-300 flex items-center justify-center gap-2 ${studentLevel === StudentLevel.ADULTS ? 'text-white' : 'text-slate-400'}`}
            >
              <User size={18} /> للكبار
            </button>
            <div className={`absolute top-1.5 bottom-1.5 w-[calc(50%-6px)] bg-[#064E3B] rounded-full transition-all duration-500 shadow-xl ${studentLevel === StudentLevel.CHILDREN ? 'right-1.5' : 'right-[50%]'}`} />
          </div>
        </div>

        {/* Categories Grid - Responsive 1 to 3 columns */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`p-10 rounded-[3rem] glass-card border-2 transition-all duration-500 flex flex-col items-center gap-5 group relative overflow-hidden ${
                selectedCategory === cat.id 
                ? 'border-[#B45309] shadow-2xl scale-[1.03] ring-4 ring-amber-50' 
                : 'border-transparent hover:border-slate-200 shadow-sm'
              }`}
            >
              <div className={`p-6 rounded-2xl transition-all duration-500 ${selectedCategory === cat.id ? 'bg-[#B45309] text-white rotate-6 scale-110' : 'bg-slate-50 text-slate-300 group-hover:bg-amber-50 group-hover:text-amber-400'}`}>
                {cat.icon}
              </div>
              <span className={`text-2xl font-black ${selectedCategory === cat.id ? 'text-[#064E3B]' : 'text-slate-400'}`}>{cat.label}</span>
              {selectedCategory === cat.id && <div className="absolute top-4 left-4 w-3 h-3 bg-amber-500 rounded-full animate-ping" />}
            </button>
          ))}
        </div>

        {/* Action Section */}
        <div className="flex flex-col items-center gap-8 mb-20">
          <button
            onClick={handleGenerate}
            disabled={loading}
            className={`group px-16 py-8 rounded-[2.5rem] text-2xl font-black flex items-center gap-4 transition-all duration-500 shadow-2xl relative overflow-hidden ${
              loading 
                ? 'bg-slate-100 text-slate-300 scale-95' 
                : 'bg-[#064E3B] text-white hover:bg-[#043d2e] hover:-translate-y-1'
            }`}
          >
            {loading ? <RefreshCw className="animate-spin" size={32} /> : <Sparkles className="text-amber-400 group-hover:rotate-12 transition-transform" size={32} />}
            {loading ? 'جاري استحضار الفكرة...' : 'توليد فكرة إبداعية'}
          </button>

          {error && (
            <div className={`max-w-xl w-full p-6 rounded-3xl border-2 flex items-start gap-4 animate-in slide-in-from-top-4 duration-500 ${error.type === 'key' ? 'bg-amber-50 border-amber-200 text-amber-800' : 'bg-red-50 border-red-200 text-red-800'}`}>
              <AlertCircle size={24} className="flex-shrink-0 mt-1" />
              <div>
                <p className="font-black text-lg mb-1">تنبيه تقني</p>
                <p className="font-bold opacity-80 leading-relaxed">{error.message}</p>
              </div>
            </div>
          )}
        </div>

        {/* Result Area */}
        <div id="result-area" className="scroll-mt-32">
          {idea && !loading && (
            <div className="bg-white rounded-[4rem] shadow-2xl overflow-hidden border border-slate-100 animate-in fade-in zoom-in-95 duration-700">
              {/* Card Header */}
              <div className="bg-gradient-to-br from-[#064E3B] to-[#043d2e] p-12 md:p-20 text-white text-center relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -mr-32 -mt-32 blur-3xl"></div>
                <div className="bg-white/10 backdrop-blur-md px-6 py-2 rounded-full text-xs font-black inline-block mb-6 border border-white/20">
                  {idea.category}
                </div>
                <h2 className="text-4xl md:text-6xl font-black mb-6 leading-[1.2]">{idea.title}</h2>
                <div className="flex justify-center items-center gap-3 opacity-80 text-lg font-bold">
                  <Clock size={22} className="text-amber-400" /> {idea.estimatedTime}
                </div>
                
                {/* Floating Icon */}
                <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 bg-[#B45309] p-8 rounded-[2.5rem] shadow-2xl ring-[12px] ring-white floating">
                  <Lightbulb className="text-white" size={48} />
                </div>
              </div>
              
              <div className="p-12 md:p-24 pt-20">
                {/* Description */}
                <div className="bg-amber-50/50 p-10 md:p-14 rounded-[3rem] border border-amber-100 mb-20 text-center shadow-inner">
                  <p className="text-2xl md:text-3xl text-slate-700 font-bold leading-relaxed italic">"{idea.description}"</p>
                </div>

                <div className="grid lg:grid-cols-2 gap-16">
                  {/* Steps */}
                  <div className="space-y-10">
                    <h3 className="text-3xl font-black text-[#064E3B] flex items-center gap-4">
                      <div className="w-2 h-10 bg-[#B45309] rounded-full"></div>
                      خطوات التنفيذ
                    </h3>
                    <div className="space-y-6">
                      {idea.steps.map((step, i) => (
                        <div key={i} className="flex gap-6 items-start group">
                          <div className="w-12 h-12 rounded-2xl bg-slate-50 text-[#B45309] font-black text-xl flex items-center justify-center flex-shrink-0 shadow-sm border border-slate-100 group-hover:bg-[#B45309] group-hover:text-white transition-all duration-300">
                            {i + 1}
                          </div>
                          <p className="font-bold text-slate-600 text-xl leading-relaxed pt-2">{step}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Benefit */}
                  <div className="bg-[#F1F5F9] p-12 rounded-[3.5rem] border border-slate-200 self-start shadow-xl shadow-slate-100/50">
                    <div className="w-16 h-16 bg-[#064E3B] rounded-2xl flex items-center justify-center mb-8 shadow-lg">
                      <Trophy className="text-amber-400" size={32} />
                    </div>
                    <h3 className="text-2xl font-black text-[#064E3B] mb-6">الثمرة المرجوة</h3>
                    <p className="text-xl font-bold text-slate-600 leading-relaxed">{idea.benefit}</p>
                  </div>
                </div>

                {/* Share Button */}
                <button 
                  onClick={() => {
                    const msg = `💡 استلهمت فكرة إبداعية للحلقة: *${idea.title}*\n\n🌟 الأثر: ${idea.benefit}\n\nتوليد عبر تطبيق: مُعين المحفظ الذكي.`;
                    window.open(`https://wa.me/?text=${encodeURIComponent(msg)}`, '_blank');
                  }}
                  className="mt-24 w-full py-8 rounded-[2.5rem] bg-[#25D366] text-white font-black text-2xl flex items-center justify-center gap-4 hover:bg-[#1fb355] transition-all shadow-2xl active:scale-95"
                >
                  <Share2 size={32} /> شارك الفائدة مع زملائك المعلمين
                </button>
              </div>
            </div>
          )}
        </div>
      </main>

      <footer className="mt-40 pb-20 text-center opacity-40">
        <p className="text-xs font-black uppercase tracking-[0.8em] text-slate-400">مُعين المحفظ • ذكاء اصطناعي قرآني • ٢٠٢٥</p>
      </footer>
    </div>
  );
};

export default App;

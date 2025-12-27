
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
  Lightbulb
} from 'lucide-react';
import { CategoryId, TeachingIdea, Category, StudentLevel } from './types';
import { generateIdea } from './geminiService';

const CATEGORIES: Category[] = [
  { id: CategoryId.ALL, label: 'أفكار منوعة', icon: <Filter size={20} />, color: 'orange' },
  { id: CategoryId.HIFZ, label: 'طرق حفظ', icon: <Book size={20} />, color: 'orange' },
  { id: CategoryId.REVIEW, label: 'مراجعة وتثبيت', icon: <Brain size={20} />, color: 'orange' },
  { id: CategoryId.MOTIVATION, label: 'تحفيز وتشجيع', icon: <Trophy size={20} />, color: 'orange' },
  { id: CategoryId.MANAGEMENT, label: 'ضبط الحلقة', icon: <Users size={20} />, color: 'orange' },
  { id: CategoryId.TAJWEED, label: 'تجويد وأداء', icon: <Wind size={20} />, color: 'orange' },
];

const App: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<CategoryId>(CategoryId.ALL);
  const [studentLevel, setStudentLevel] = useState<StudentLevel>(StudentLevel.CHILDREN);
  const [idea, setIdea] = useState<TeachingIdea | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [copySuccess, setCopySuccess] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const handleGenerate = async () => {
    setLoading(true);
    setError(null);
    try {
      const newIdea = await generateIdea(selectedCategory, studentLevel);
      setIdea(newIdea);
      setTimeout(() => {
        const resultSection = document.getElementById('result-section');
        resultSection?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 150);
    } catch (err: any) {
      console.error(err);
      setError('حدث خطأ أثناء استحضار الفكرة. يرجى التأكد من اتصال الإنترنت وإعداد المفتاح بشكل صحيح.');
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    if (!idea) return;
    const text = `💡 فكرة إبداعية من مُعين المحفظ:\n\n*${idea.title}*\n\n${idea.description}\n\n🌟 الثمرة: ${idea.benefit}\n\nتم التوليد بواسطة تطبيق مُعين المحفظ الذكي.`;
    navigator.clipboard.writeText(text);
    setCopySuccess(true);
    setTimeout(() => setCopySuccess(false), 2000);
  };

  return (
    <div className="min-h-screen bg-[#FDFDFB] text-[#1E293B] font-['Tajawal'] pb-10 selection:bg-[#064E3B] selection:text-white overflow-x-hidden" dir="rtl">
      {/* Organized White Header Box with Logo */}
      <div className="bg-white shadow-sm border-b border-slate-100 mb-6 md:mb-8">
        <header className={`max-w-6xl mx-auto px-6 py-4 md:px-12 flex items-center justify-start gap-5 transition-all duration-1000 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
          <div className="relative flex-shrink-0">
            <div className="bg-white p-1 rounded-2xl shadow-sm border border-slate-50 flex items-center justify-center overflow-hidden w-16 h-16 md:w-20 md:h-20">
              <img 
                src="https://www.awqaf.gov.ae/assets/mediakit/AwqafLogoIcon.png" 
                alt="Logo" 
                className="w-full h-full object-contain"
              />
            </div>
          </div>
          <div className="flex flex-col">
            <h1 className="text-2xl md:text-4xl font-[900] text-[#064E3B] leading-none tracking-tight">مُعين المحفظ</h1>
            <p className="text-xs md:text-lg text-[#B45309] font-bold mt-1">بنك الأفكار المهارية</p>
          </div>
        </header>
      </div>

      <main className="max-w-4xl mx-auto px-6">
        {/* Hero Title */}
        <section className={`text-center mt-2 mb-8 transition-all duration-1000 delay-300 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
          <h2 className="text-[1.65rem] xs:text-[2rem] sm:text-5xl md:text-7xl font-[900] text-[#064E3B] leading-tight overflow-visible">
            ابتكر أسلوباً <span className="text-[#B45309]">جديداً</span> في حلقتك
          </h2>
        </section>

        {/* Level Switcher - Capsule Style */}
        <div className={`flex justify-center mb-10 transition-all duration-1000 delay-500 ${isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}>
          <div className="bg-white rounded-[2rem] p-1.5 flex shadow-sm border border-slate-100 w-full max-w-lg relative">
            <button
              onClick={() => setStudentLevel(StudentLevel.CHILDREN)}
              className={`flex-1 flex items-center justify-center gap-2 py-4 rounded-[1.6rem] text-lg md:text-xl font-bold transition-all duration-500 z-10 relative ${
                studentLevel === StudentLevel.CHILDREN ? 'text-white' : 'text-slate-400'
              }`}
            >
              <Baby size={22} /> للأطفال
            </button>
            <button
              onClick={() => setStudentLevel(StudentLevel.ADULTS)}
              className={`flex-1 flex items-center justify-center gap-2 py-4 rounded-[1.6rem] text-lg md:text-xl font-bold transition-all duration-500 z-10 relative ${
                studentLevel === StudentLevel.ADULTS ? 'text-white' : 'text-slate-400'
              }`}
            >
              <User size={22} /> للكبار
            </button>
            <div 
              className={`absolute top-1.5 bottom-1.5 w-[calc(50%-6px)] bg-[#064E3B] rounded-[1.4rem] transition-all duration-500 cubic-bezier(0.4, 0, 0.2, 1) shadow-md ${
                studentLevel === StudentLevel.CHILDREN ? 'right-1.5' : 'right-[50%]'
              }`}
            />
          </div>
        </div>

        {/* Categories Grid - Restored to 3 columns grid */}
        <div className={`grid grid-cols-2 md:grid-cols-3 gap-4 mb-10 transition-all duration-1000 delay-700 ${isVisible ? 'opacity-100 -translate-y-2' : 'opacity-0 translate-y-8'}`}>
          {CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`flex flex-col items-center justify-center gap-3 p-6 rounded-[2rem] bg-white transition-all duration-300 border-2 active:scale-95 group ${
                selectedCategory === cat.id 
                  ? 'border-[#B45309] shadow-lg -translate-y-2' 
                  : 'border-transparent shadow-sm hover:border-slate-100'
              }`}
            >
              <div className={`transition-all duration-500 p-3 rounded-2xl flex items-center justify-center ${
                selectedCategory === cat.id 
                  ? 'bg-[#B45309] text-white scale-110 shadow-md' 
                  : 'bg-slate-50 text-slate-300'
              }`}>
                {cat.icon}
              </div>
              <span className={`text-base md:text-lg font-black transition-colors duration-300 ${selectedCategory === cat.id ? 'text-[#B45309]' : 'text-slate-400'}`}>
                {cat.label}
              </span>
            </button>
          ))}
        </div>

        {/* Action Button - Raised as requested */}
        <div className="relative group -translate-y-4">
          <button
            onClick={handleGenerate}
            disabled={loading}
            className={`relative w-full py-6 rounded-3xl text-xl md:text-3xl font-black flex items-center justify-center gap-4 transition-all duration-500 shadow-2xl active:scale-[0.98] ${
              loading 
                ? 'bg-slate-100 text-slate-300 cursor-not-allowed' 
                : 'bg-[#064E3B] text-white hover:bg-[#053a2b]'
            }`}
          >
            {loading ? (
              <RefreshCw className="animate-spin" size={28} />
            ) : (
              <>
                استلهم فكرة جديدة <Sparkles className="text-yellow-400" size={28} />
              </>
            )}
          </button>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-100 text-red-700 p-8 rounded-3xl mt-10 text-center font-bold animate-in fade-in zoom-in duration-300">
            <p>{error}</p>
            <p className="text-xs mt-2 opacity-50">تأكد من عمل Deploy جديد في Vercel بعد إضافة المفتاح</p>
          </div>
        )}

        {/* Result Area */}
        <div id="result-section" className="mt-12 md:mt-16">
          {idea && !loading && (
            <div className="bg-white rounded-[3rem] shadow-2xl overflow-hidden border border-slate-50 animate-in fade-in slide-in-from-bottom-10 duration-700">
              <div className="bg-[#064E3B] p-10 md:p-16 text-white relative">
                <div className="flex justify-between items-center mb-8">
                  <span className="text-xs md:text-sm bg-white/10 px-5 py-2 rounded-full font-black border border-white/20 uppercase">
                    {idea.category}
                  </span>
                  <div className="flex items-center gap-2 text-xs md:text-sm font-bold bg-black/20 px-4 py-2 rounded-full">
                    <Clock size={18} /> {idea.estimatedTime}
                  </div>
                </div>
                <h3 className="text-4xl md:text-6xl font-black leading-tight mb-4">{idea.title}</h3>
                <div className="absolute -bottom-8 right-10 md:right-16">
                  <div className="bg-[#B45309] p-5 rounded-2xl shadow-xl ring-[8px] ring-white transform rotate-3">
                    <Lightbulb className="text-white" size={32} />
                  </div>
                </div>
              </div>

              <div className="p-10 md:p-16 pt-16">
                <div className="bg-slate-50/50 p-8 rounded-3xl border border-slate-100 mb-10">
                  <p className="text-xl md:text-3xl text-slate-600 font-medium italic leading-relaxed text-center">
                    "{idea.description}"
                  </p>
                </div>

                <div className="space-y-8 mb-12 text-right">
                  <div className="flex items-center flex-row-reverse gap-3">
                    <div className="w-2 h-8 bg-[#B45309] rounded-full"></div>
                    <h4 className="font-black text-[#064E3B] text-2xl md:text-3xl">خطة التنفيذ المهاري</h4>
                  </div>
                  <div className="grid gap-6">
                    {idea.steps.map((step, i) => (
                      <div key={i} className="flex flex-row-reverse gap-5 group text-right">
                        <div className="flex-shrink-0 w-12 h-12 rounded-2xl bg-[#064E3B] text-white font-black text-xl flex items-center justify-center shadow-md">
                          {i + 1}
                        </div>
                        <p className="text-slate-500 font-bold text-lg md:text-2xl pt-2 leading-snug flex-1">{step}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-gradient-to-br from-orange-50 to-white rounded-[2.5rem] p-8 border border-orange-100 mb-12 relative overflow-hidden text-center">
                  <div className="flex items-center justify-center gap-3 mb-4">
                    <Trophy size={28} className="text-[#B45309]" />
                    <h4 className="text-[#B45309] font-black text-sm uppercase tracking-wider">الثمرة التعليمية</h4>
                  </div>
                  <p className="text-[#064E3B] font-black text-2xl md:text-4xl leading-tight">
                    {idea.benefit}
                  </p>
                </div>

                <div className="flex flex-col md:flex-row gap-4">
                  <button
                    onClick={() => {
                      const text = `💡 فكرة من مُعين المحفظ: *${idea.title}*\n\n${idea.description}\n\n🌟 الإنجاز: ${idea.benefit}`;
                      window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
                    }}
                    className="flex-[2] bg-[#064E3B] text-white py-5 rounded-2xl font-black text-lg md:text-2xl flex items-center justify-center gap-3 hover:bg-[#053a2b] transition-all shadow-lg active:scale-95"
                  >
                    <Share2 size={24} /> مشاركة الفكرة
                  </button>
                  <button
                    onClick={handleCopy}
                    className={`flex-1 py-5 rounded-2xl font-black text-lg md:text-xl border-2 transition-all flex items-center justify-center gap-3 active:scale-95 ${
                      copySuccess ? 'bg-emerald-50 border-emerald-200 text-emerald-600' : 'border-slate-100 text-slate-400'
                    }`}
                  >
                    {copySuccess ? 'تم النسخ!' : 'نسخ النص'}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      <footer className="mt-16 text-center opacity-30 px-6">
        <p className="text-xs font-black text-slate-400 uppercase tracking-[0.4em] mb-1">مُعين المحفظ • بنك الأفكار المهارية</p>
        <p className="text-[10px] font-bold text-slate-300">نعتز بخدمة أهل القرآن الكريم • ٢٠٢٥</p>
      </footer>
    </div>
  );
};

export default App;

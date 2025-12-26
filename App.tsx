
import React, { useState } from 'react';
import { 
  BookOpen, 
  Sparkles, 
  RefreshCw, 
  Share2, 
  Filter, 
  Trophy, 
  Brain, 
  Users, 
  Book,
  Wind,
  Bookmark,
  AlertCircle,
  Lightbulb,
  Baby,
  User,
  Clock,
  Target,
  ShieldCheck
} from 'lucide-react';
import { CategoryId, TeachingIdea, Category, StudentLevel } from './types';
import { generateIdea } from './geminiService';

const CATEGORIES: Category[] = [
  { id: CategoryId.ALL, label: 'أفكار منوعة', icon: <Filter size={24} />, color: 'emerald' },
  { id: CategoryId.HIFZ, label: 'طرق حفظ', icon: <Book size={24} />, color: 'blue' },
  { id: CategoryId.REVIEW, label: 'مراجعة وتثبيت', icon: <Brain size={24} />, color: 'purple' },
  { id: CategoryId.MOTIVATION, label: 'تحفيز وتشجيع', icon: <Trophy size={24} />, color: 'amber' },
  { id: CategoryId.MANAGEMENT, label: 'ضبط الحلقة', icon: <Users size={24} />, color: 'rose' },
  { id: CategoryId.TAJWEED, label: 'تجويد وأداء', icon: <Wind size={24} />, color: 'cyan' },
];

const App: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<CategoryId>(CategoryId.ALL);
  const [studentLevel, setStudentLevel] = useState<StudentLevel>(StudentLevel.CHILDREN);
  const [idea, setIdea] = useState<TeachingIdea | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [copySuccess, setCopySuccess] = useState(false);

  const handleGenerate = async () => {
    setLoading(true);
    setError(null);
    setIdea(null); 
    
    try {
      const newIdea = await generateIdea(selectedCategory, studentLevel);
      setIdea(newIdea);
      setTimeout(() => {
        const resultElement = document.getElementById('result-area');
        if (resultElement) {
          resultElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 100);
    } catch (err) {
      setError('عذراً، حدث خطأ. يرجى المحاولة مرة أخرى.');
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    if (!idea) return;
    const text = `💡 فكرة تعليمية للحلقة (${studentLevel === StudentLevel.CHILDREN ? 'للصغار' : 'للكبار'}): *${idea.title}*\n\nالزمن: ${idea.estimatedTime}\n${idea.description}\n\n✅ الخطوات:\n${idea.steps.map((s, i) => `${i + 1}- ${s}`).join('\n')}\n\n🌟 الفائدة: ${idea.benefit}`;
    navigator.clipboard.writeText(text);
    setCopySuccess(true);
    setTimeout(() => setCopySuccess(false), 2000);
  };

  return (
    <div className="min-h-screen flex flex-col font-['Tajawal'] bg-[#FAFAF9]">
      {/* Header - Balanced Royal Style */}
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-stone-200 px-5 py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-[#064E3B] p-2.5 rounded-xl shadow-lg shadow-emerald-900/10 rotate-3">
              <BookOpen className="text-[#D4AF37]" size={24} />
            </div>
            <div>
              <h1 className="text-xl font-black text-[#064E3B] leading-none">مُعين المحفظ</h1>
              <p className="text-[10px] text-stone-400 font-bold uppercase tracking-wider mt-1">الذكاء في خدمة القرآن</p>
            </div>
          </div>
        </div>
      </header>

      <main className="flex-grow max-w-4xl w-full mx-auto px-6 py-8 md:py-12">
        {/* Hero Section - Reduced bottom margin */}
        <section className="text-center mb-8 md:mb-12">
          <h2 className="text-2xl md:text-5xl font-black text-[#064E3B] mb-4 md:mb-6 leading-tight">
            ابتكر أسلوباً <span className="text-[#B45309] relative inline-block pb-1">جديداً
              <svg className="absolute bottom-0 left-0 w-full" height="8" viewBox="0 0 100 8" preserveAspectRatio="none">
                <path d="M0 7C30 7 70 1 100 1" stroke="#D4AF37" strokeWidth="6" fill="none" />
              </svg>
            </span> في حلقتك القرآنية
          </h2>
          <p className="text-stone-500 text-base md:text-xl font-medium max-w-2xl mx-auto leading-relaxed opacity-80 px-4">
            أفكار تربوية وتعليمية مبتكرة
          </p>
        </section>

        {/* Level Toggle - Reduced bottom margin to lift the grid */}
        <section className="flex justify-center mb-6 md:mb-10">
          <div className="bg-white p-1.5 rounded-[2.5rem] shadow-xl shadow-stone-200/50 flex gap-2 w-full max-w-md border border-stone-100">
            <button
              onClick={() => setStudentLevel(StudentLevel.CHILDREN)}
              className={`flex-grow flex items-center justify-center gap-2 py-4 md:py-5 rounded-[2.2rem] transition-all font-black text-sm md:text-lg ${
                studentLevel === StudentLevel.CHILDREN
                  ? 'bg-[#064E3B] text-white shadow-lg'
                  : 'text-stone-400 hover:bg-stone-50'
              }`}
            >
              <Baby size={20} className={studentLevel === StudentLevel.CHILDREN ? 'text-[#D4AF37]' : ''} />
              حلقات الأشبال
            </button>
            <button
              onClick={() => setStudentLevel(StudentLevel.ADULTS)}
              className={`flex-grow flex items-center justify-center gap-2 py-4 md:py-5 rounded-[2.2rem] transition-all font-black text-sm md:text-lg ${
                studentLevel === StudentLevel.ADULTS
                  ? 'bg-[#064E3B] text-white shadow-lg'
                  : 'text-stone-400 hover:bg-stone-50'
              }`}
            >
              <User size={20} className={studentLevel === StudentLevel.ADULTS ? 'text-[#D4AF37]' : ''} />
              حلقات الكبار
            </button>
          </div>
        </section>

        {/* Categories Grid - Raised Position */}
        <section className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-10 md:mb-16">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`group flex flex-col items-center justify-center gap-4 p-5 md:p-8 rounded-[2.5rem] transition-all border-2 relative overflow-hidden ${
                selectedCategory === cat.id
                  ? 'bg-white border-[#B45309] shadow-lg -translate-y-1'
                  : 'bg-white border-transparent hover:border-stone-100'
              }`}
            >
              <div className={`w-12 h-12 md:w-16 md:h-16 rounded-2xl flex items-center justify-center transition-all ${
                selectedCategory === cat.id ? 'bg-[#B45309] text-white rotate-6' : 'bg-stone-50 text-stone-300'
              }`}>
                {cat.icon}
              </div>
              <span className={`text-xs md:text-sm font-black text-center ${selectedCategory === cat.id ? 'text-[#B45309]' : 'text-stone-500'}`}>
                {cat.label}
              </span>
            </button>
          ))}
        </section>

        {/* Generate Button */}
        <div className="mb-14 md:mb-24">
          <button
            onClick={handleGenerate}
            disabled={loading}
            className={`w-full py-5 md:py-8 rounded-[2rem] text-lg md:text-2xl font-black transition-all transform active:scale-[0.97] relative overflow-hidden group ${
              loading 
                ? 'bg-stone-200 text-stone-400 cursor-not-allowed' 
                : 'emerald-gradient text-white shadow-xl shadow-emerald-900/20 hover:shadow-emerald-900/30'
            }`}
          >
            <div className="relative z-10 flex items-center justify-center gap-3">
              {loading ? (
                <>
                  <RefreshCw className="animate-spin" size={24} />
                  <span>جاري التحضير...</span>
                </>
              ) : (
                <>
                  <Sparkles size={24} className="text-[#D4AF37]" />
                  <span>اكتشف أسلوباً مبدعاً</span>
                </>
              )}
            </div>
          </button>
        </div>

        {/* Result Area - Balanced Sizes */}
        <div id="result-area" className="min-h-[300px] scroll-mt-24">
          {error && (
            <div className="bg-red-50 border border-red-100 p-8 rounded-[2.5rem] text-red-800 text-center flex flex-col items-center gap-3 shadow-md">
              <AlertCircle size={32} className="text-red-300" />
              <p className="font-black text-sm md:text-base">{error}</p>
            </div>
          )}

          {loading && (
            <div className="flex flex-col items-center justify-center py-16">
               <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center shadow-xl border border-stone-50 relative mb-6">
                  <RefreshCw className="text-[#B45309] animate-spin" size={32} />
               </div>
               <p className="text-stone-400 font-bold text-sm md:text-base animate-pulse">يتم الآن تجهيز الفكرة بعناية...</p>
            </div>
          )}

          {idea && !loading && (
            <article className="animate-in fade-in slide-in-from-bottom-10 duration-700">
              <div className="bg-white rounded-[2.5rem] md:rounded-[4rem] shadow-2xl border border-stone-50 overflow-hidden relative">
                <div className="p-8 md:p-16 relative z-10">
                  {/* Meta Tags */}
                  <div className="flex flex-wrap items-center gap-3 md:gap-4 mb-8 md:mb-10">
                    <span className="bg-[#B45309]/10 text-[#B45309] px-4 py-1.5 rounded-full text-[10px] md:text-sm font-black border border-[#B45309]/20 flex items-center gap-2">
                      <Clock size={16} /> {idea.estimatedTime}
                    </span>
                    <span className="bg-[#064E3B]/10 text-[#064E3B] px-4 py-1.5 rounded-full text-[9px] md:text-xs font-black uppercase tracking-wider border border-[#064E3B]/20">
                      {idea.category}
                    </span>
                  </div>

                  {/* Title & Description - Balanced Fonts */}
                  <h2 className="text-2xl md:text-4xl font-black text-[#064E3B] mb-6 md:mb-10 leading-snug">
                    {idea.title}
                  </h2>
                  
                  <div className="relative mb-10 md:mb-16">
                    <div className="absolute -right-3 top-0 bottom-0 w-1.5 bg-[#D4AF37] rounded-full"></div>
                    <p className="text-lg md:text-2xl text-stone-700 leading-relaxed font-bold pr-5 md:pr-10 italic">
                      {idea.description}
                    </p>
                  </div>

                  {/* Steps & Benefit Section */}
                  <div className="grid grid-cols-1 lg:grid-cols-5 gap-10 md:gap-16 items-start">
                    <div className="lg:col-span-3 space-y-8">
                      <h3 className="text-[10px] md:text-sm font-black text-stone-400 uppercase tracking-widest flex items-center gap-3">
                        <Target size={20} /> خطوات التطبيق
                      </h3>
                      <div className="space-y-6">
                        {idea.steps.map((step, idx) => (
                          <div key={idx} className="flex gap-4 md:gap-6 group">
                            <span className="flex-shrink-0 w-10 h-10 md:w-14 md:h-14 bg-white border-2 border-[#D4AF37]/30 text-[#B45309] rounded-xl text-base md:text-xl font-black flex items-center justify-center shadow-sm">
                              {idx + 1}
                            </span>
                            <p className="text-stone-800 text-base md:text-xl font-bold leading-relaxed pt-2 transition-colors">{step}</p>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="lg:col-span-2 bg-[#064E3B] rounded-[2rem] md:rounded-[3rem] p-8 md:p-12 text-white relative overflow-hidden shadow-xl border-t-8 border-[#D4AF37]">
                      <div className="flex items-center gap-3 opacity-60 mb-6 font-black text-[10px] md:text-sm tracking-widest">
                        <Bookmark size={22} /> الثمرة التربوية
                      </div>
                      <p className="text-xl md:text-3xl font-black leading-snug text-[#D4AF37] relative z-10">
                        {idea.benefit}
                      </p>
                      <Sparkles className="absolute bottom-4 left-4 text-white/5" size={64} />
                    </div>
                  </div>

                  {/* Actions - Balanced */}
                  <div className="flex flex-col sm:flex-row gap-4 mt-12 md:mt-20 pt-10 border-t border-stone-100">
                    <button 
                      onClick={() => {
                        const shareText = `💡 فكرة للحلقة القرآنية: *${idea.title}*\n\n${idea.description}\n\n✅ الخطوات:\n${idea.steps.map((s, i) => `${i + 1}- ${s}`).join('\n')}`;
                        window.open(`https://wa.me/?text=${encodeURIComponent(shareText)}`, '_blank');
                      }} 
                      className="flex-grow py-4 md:py-6 emerald-gradient text-white rounded-[1.5rem] md:rounded-[2.5rem] text-sm md:text-xl font-black flex items-center justify-center gap-3 shadow-lg active:scale-95 transition-all"
                    >
                      <Share2 size={20} /> مشاركة عبر واتساب
                    </button>
                    <button 
                      onClick={handleCopy} 
                      className={`px-8 md:px-12 py-4 md:py-6 rounded-[1.5rem] md:rounded-[2.5rem] text-sm md:text-xl font-black border-2 transition-all active:scale-95 ${
                        copySuccess ? 'bg-stone-50 text-[#064E3B] border-[#064E3B]' : 'border-stone-200 text-stone-500 hover:bg-stone-50'
                      }`}
                    >
                      {copySuccess ? 'تم النسخ ✅' : 'نسخ النص'}
                    </button>
                  </div>
                </div>
              </div>
            </article>
          )}

          {!idea && !loading && !error && (
            <div className="flex flex-col items-center justify-center py-16 text-center opacity-30">
              <div className="w-20 h-20 md:w-32 md:h-32 bg-white rounded-[2rem] flex items-center justify-center shadow-lg border border-stone-100 mb-6 float-animation">
                 <Lightbulb size={40} className="text-[#D4AF37]" />
              </div>
              <p className="text-stone-500 font-bold text-sm md:text-xl max-w-sm md:max-w-xl leading-relaxed px-4">
                أهلاً بك.. اختر التصنيف وسنلهمك بأساليب رصينة تليق بمقام أهل القرآن.
              </p>
            </div>
          )}
        </div>
      </main>

      {/* Footer - Final Branding */}
      <footer className="py-12 md:py-20 text-center bg-white border-t border-stone-100 mt-10">
        <div className="flex items-center justify-center gap-2 text-[#064E3B] font-black text-xs md:text-base mb-4">
          <ShieldCheck size={20} className="text-[#D4AF37]" />
          <span>من تصميم المشرف الشرعي محمد العلي</span>
        </div>
        <div className="flex flex-col gap-2 px-8">
          <p className="text-[9px] md:text-xs text-stone-300 font-bold uppercase tracking-[0.4em]">
            دقة • إبداع • منهجية • رصانة
          </p>
          <p className="text-[10px] text-stone-200 font-medium">جميع الحقوق محفوظة © ٢٠٢٥</p>
        </div>
      </footer>
    </div>
  );
};

export default App;

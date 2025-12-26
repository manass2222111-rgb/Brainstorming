
import React, { useState, useEffect } from 'react';
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
  ShieldCheck,
  Settings
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
  const [configError, setConfigError] = useState(false);

  // التأكد من أن التطبيق يعمل ولا ينهار
  useEffect(() => {
    const key = (window as any).process?.env?.API_KEY || (process as any)?.env?.API_KEY;
    if (!key) {
      console.warn("API Key is missing, the app will show setup instructions if generation is attempted.");
    }
  }, []);

  const handleGenerate = async () => {
    setLoading(true);
    setError(null);
    setIdea(null); 
    
    try {
      const newIdea = await generateIdea(selectedCategory, studentLevel);
      setIdea(newIdea);
      setTimeout(() => {
        document.getElementById('result-area')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 100);
    } catch (err: any) {
      console.error("Generation Error:", err);
      if (err.message === "API_KEY_MISSING") {
        setConfigError(true);
      } else {
        setError('عذراً، حدث خطأ أثناء الاتصال بالخادم الذكي. يرجى التأكد من مفتاح الـ API في Vercel.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    if (!idea) return;
    const text = `💡 فكرة تعليمية للحلقة: *${idea.title}*\n\n${idea.description}\n\n🌟 الفائدة: ${idea.benefit}`;
    navigator.clipboard.writeText(text);
    setCopySuccess(true);
    setTimeout(() => setCopySuccess(false), 2000);
  };

  if (configError) {
    return (
      <div className="min-h-screen bg-stone-50 flex items-center justify-center p-6 text-center">
        <div className="max-w-md bg-white p-10 rounded-[2.5rem] shadow-xl border border-stone-100">
          <div className="w-20 h-20 bg-amber-50 rounded-full flex items-center justify-center mx-auto mb-6">
            <Settings className="text-amber-600 animate-spin-slow" size={40} />
          </div>
          <h1 className="text-2xl font-black text-[#064E3B] mb-4">تنبيه الإعدادات</h1>
          <p className="text-stone-500 font-bold mb-8">
            لم يتم العثور على مفتاح الـ API. تأكد من إضافته في Vercel باسم <code className="bg-stone-100 px-2 py-1 rounded">API_KEY</code> ثم عمل <code className="bg-stone-100 px-2 py-1 rounded">Redeploy</code>.
          </p>
          <button onClick={() => window.location.reload()} className="w-full py-4 bg-[#064E3B] text-white rounded-2xl font-black shadow-lg">إعادة المحاولة</button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col font-['Tajawal'] bg-[#FAFAF9]">
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-stone-200 px-5 py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-[#064E3B] p-2.5 rounded-xl shadow-lg">
              <BookOpen className="text-[#D4AF37]" size={24} />
            </div>
            <div>
              <h1 className="text-xl font-black text-[#064E3B]">مُعين المحفظ</h1>
              <p className="text-[10px] text-stone-400 font-bold uppercase tracking-wider">الذكاء في خدمة القرآن</p>
            </div>
          </div>
        </div>
      </header>

      <main className="flex-grow max-w-4xl w-full mx-auto px-6 py-8">
        <section className="text-center mb-12">
          <h2 className="text-3xl md:text-5xl font-black text-[#064E3B] mb-6">ابتكر أسلوباً <span className="text-[#B45309]">جديداً</span> في حلقتك</h2>
          <p className="text-stone-500 text-lg font-medium opacity-80">أفكار تربوية وتعليمية مبتكرة مدعومة بالذكاء الاصطناعي</p>
        </section>

        <section className="flex justify-center mb-10">
          <div className="bg-white p-1.5 rounded-[2.5rem] shadow-xl flex gap-2 w-full max-w-md border border-stone-100">
            <button
              onClick={() => setStudentLevel(StudentLevel.CHILDREN)}
              className={`flex-grow flex items-center justify-center gap-2 py-4 rounded-[2.2rem] transition-all font-black ${
                studentLevel === StudentLevel.CHILDREN ? 'bg-[#064E3B] text-white shadow-lg' : 'text-stone-400 hover:bg-stone-50'
              }`}
            >
              <Baby size={20} /> حلقات الأشبال
            </button>
            <button
              onClick={() => setStudentLevel(StudentLevel.ADULTS)}
              className={`flex-grow flex items-center justify-center gap-2 py-4 rounded-[2.2rem] transition-all font-black ${
                studentLevel === StudentLevel.ADULTS ? 'bg-[#064E3B] text-white shadow-lg' : 'text-stone-400 hover:bg-stone-50'
              }`}
            >
              <User size={20} /> حلقات الكبار
            </button>
          </div>
        </section>

        <section className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-16">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`group flex flex-col items-center justify-center gap-4 p-8 rounded-[2.5rem] transition-all border-2 ${
                selectedCategory === cat.id ? 'bg-white border-[#B45309] shadow-lg' : 'bg-white border-transparent hover:border-stone-100'
              }`}
            >
              <div className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all ${
                selectedCategory === cat.id ? 'bg-[#B45309] text-white' : 'bg-stone-50 text-stone-300'
              }`}>
                {cat.icon}
              </div>
              <span className={`text-sm font-black ${selectedCategory === cat.id ? 'text-[#B45309]' : 'text-stone-500'}`}>
                {cat.label}
              </span>
            </button>
          ))}
        </section>

        <div className="mb-20">
          <button
            onClick={handleGenerate}
            disabled={loading}
            className={`w-full py-6 rounded-[2rem] text-xl font-black transition-all transform active:scale-[0.97] ${
              loading ? 'bg-stone-200 text-stone-400 cursor-not-allowed' : 'emerald-gradient text-white shadow-xl shadow-emerald-900/20 hover:shadow-emerald-900/30'
            }`}
          >
            <div className="flex items-center justify-center gap-3">
              {loading ? <RefreshCw className="animate-spin" size={24} /> : <Sparkles size={24} className="text-[#D4AF37]" />}
              <span>{loading ? 'جاري التحضير...' : 'اكتشف أسلوباً مبدعاً'}</span>
            </div>
          </button>
        </div>

        <div id="result-area" className="scroll-mt-24">
          {error && (
            <div className="bg-red-50 border border-red-100 p-8 rounded-[2.5rem] text-red-800 text-center flex flex-col items-center gap-3">
              <AlertCircle size={32} className="text-red-300" />
              <p className="font-black">{error}</p>
            </div>
          )}

          {idea && !loading && (
            <article className="animate-in fade-in slide-in-from-bottom-10 duration-700">
              <div className="bg-white rounded-[3rem] shadow-2xl border border-stone-50 overflow-hidden">
                <div className="p-10 md:p-16 text-right">
                  <div className="flex flex-wrap items-center gap-4 mb-8">
                    <span className="bg-[#B45309]/10 text-[#B45309] px-4 py-1.5 rounded-full text-sm font-black border border-[#B45309]/20 flex items-center gap-2">
                      <Clock size={16} /> {idea.estimatedTime}
                    </span>
                    <span className="bg-[#064E3B]/10 text-[#064E3B] px-4 py-1.5 rounded-full text-xs font-black border border-[#064E3B]/20">
                      {idea.category}
                    </span>
                  </div>

                  <h2 className="text-3xl md:text-4xl font-black text-[#064E3B] mb-8 leading-snug">{idea.title}</h2>
                  
                  <div className="relative mb-12">
                    <div className="absolute -right-3 top-0 bottom-0 w-1.5 bg-[#D4AF37] rounded-full"></div>
                    <p className="text-xl md:text-2xl text-stone-700 leading-relaxed font-bold pr-8 italic">{idea.description}</p>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 items-start">
                    <div className="lg:col-span-3 space-y-8">
                      <h3 className="text-xs font-black text-stone-400 uppercase tracking-widest flex items-center gap-3">
                        <Target size={20} /> خطوات التطبيق
                      </h3>
                      <div className="space-y-6">
                        {idea.steps.map((step, idx) => (
                          <div key={idx} className="flex gap-6 group">
                            <span className="flex-shrink-0 w-12 h-12 bg-white border-2 border-[#D4AF37]/30 text-[#B45309] rounded-xl text-xl font-black flex items-center justify-center shadow-sm">
                              {idx + 1}
                            </span>
                            <p className="text-stone-800 text-lg md:text-xl font-bold leading-relaxed pt-2">{step}</p>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="lg:col-span-2 bg-[#064E3B] rounded-[2.5rem] p-10 text-white shadow-xl border-t-8 border-[#D4AF37]">
                      <div className="flex items-center gap-3 opacity-60 mb-6 font-black text-xs tracking-widest">
                        <Bookmark size={22} /> الثمرة التربوية
                      </div>
                      <p className="text-2xl font-black leading-snug text-[#D4AF37]">{idea.benefit}</p>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-4 mt-16 pt-10 border-t border-stone-100">
                    <button 
                      onClick={() => {
                        const shareText = `💡 فكرة للحلقة: *${idea.title}*\n\n${idea.description}`;
                        window.open(`https://wa.me/?text=${encodeURIComponent(shareText)}`, '_blank');
                      }} 
                      className="flex-grow py-5 emerald-gradient text-white rounded-[2rem] text-lg font-black flex items-center justify-center gap-3 shadow-lg"
                    >
                      <Share2 size={20} /> مشاركة الفكرة
                    </button>
                    <button 
                      onClick={handleCopy} 
                      className={`px-12 py-5 rounded-[2rem] text-lg font-black border-2 transition-all ${
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
              <div className="w-24 h-24 bg-white rounded-[2rem] flex items-center justify-center shadow-lg border border-stone-100 mb-6">
                 <Lightbulb size={40} className="text-[#D4AF37]" />
              </div>
              <p className="text-stone-500 font-bold text-lg max-w-md">اختر التصنيف وسنلهمك بأساليب رصينة تليق بمقام أهل القرآن.</p>
            </div>
          )}
        </div>
      </main>

      <footer className="py-12 text-center bg-white border-t border-stone-100 mt-10">
        <div className="flex items-center justify-center gap-2 text-[#064E3B] font-black text-sm mb-4">
          <ShieldCheck size={20} className="text-[#D4AF37]" />
          <span>من تصميم المشرف الشرعي محمد العلي</span>
        </div>
        <p className="text-[10px] text-stone-200 font-medium">جميع الحقوق محفوظة © ٢٠٢٥</p>
      </footer>
    </div>
  );
};

export default App;

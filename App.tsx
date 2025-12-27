
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
      console.error("App Error:", err);
      if (err.message === "API_KEY_MISSING") {
        setError('تنبيه: مفتاح API_KEY غير متاح. يرجى التأكد من إضافته في الإعدادات.');
      } else {
        setError('حدث خطأ أثناء استحضار الفكرة. يرجى المحاولة مرة أخرى.');
      }
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
          <div className="flex flex-col text-right">
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

        {/* Level Switcher */}
        <div className={`flex justify-center mb-6 transition-all duration-1000 delay-500 ${isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}>
          <div className="bg-white rounded-[2rem] p-1.5 flex shadow-sm border border-slate-100 w-full max-w-lg relative">
            <button
              onClick={() => setStudentLevel(StudentLevel.CHILDREN)}
              className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-[1.8rem] transition-all duration-300 font-bold ${studentLevel === StudentLevel.CHILDREN ? 'bg-[#064E3B] text-white shadow-md' : 'text-slate-500 hover:bg-slate-50'}`}
            >
              <Baby size={20} />
              <span>للأطفال</span>
            </button>
            <button
              onClick={() => setStudentLevel(StudentLevel.ADULTS)}
              className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-[1.8rem] transition-all duration-300 font-bold ${studentLevel === StudentLevel.ADULTS ? 'bg-[#064E3B] text-white shadow-md' : 'text-slate-500 hover:bg-slate-50'}`}
            >
              <User size={20} />
              <span>للكبار</span>
            </button>
          </div>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3 mb-10">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`flex flex-col items-center justify-center p-4 rounded-3xl border-2 transition-all duration-300 ${selectedCategory === cat.id ? 'border-[#B45309] bg-orange-50/50 shadow-sm' : 'border-slate-100 bg-white hover:border-orange-200'}`}
            >
              <div className={`mb-2 p-2 rounded-xl ${selectedCategory === cat.id ? 'text-[#B45309]' : 'text-slate-400'}`}>
                {cat.icon}
              </div>
              <span className={`text-sm font-bold ${selectedCategory === cat.id ? 'text-[#064E3B]' : 'text-slate-600'}`}>
                {cat.label}
              </span>
            </button>
          ))}
        </div>

        {/* Action Button */}
        <div className="flex justify-center mb-16">
          <button
            onClick={handleGenerate}
            disabled={loading}
            className="group relative bg-[#064E3B] text-white px-10 py-5 rounded-[2.5rem] text-xl font-black shadow-xl hover:shadow-2xl hover:bg-[#053c2e] disabled:opacity-70 disabled:cursor-not-allowed transition-all active:scale-95 flex items-center gap-4 overflow-hidden"
          >
            {loading ? (
              <RefreshCw className="animate-spin" size={24} />
            ) : (
              <Sparkles className="group-hover:rotate-12 transition-transform" size={24} />
            )}
            <span>استلهم فكرة جديدة</span>
            {loading && <div className="absolute inset-0 bg-white/10 animate-pulse" />}
          </button>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-100 text-red-700 p-6 rounded-3xl mb-12 flex items-start gap-4 animate-in fade-in slide-in-from-top-4 text-right">
            <div className="bg-red-100 p-2 rounded-full text-red-600 flex-shrink-0">
              <RefreshCw size={20} />
            </div>
            <p className="font-bold">{error}</p>
          </div>
        )}

        {/* Result Section */}
        {idea && (
          <div id="result-section" className="scroll-mt-8 animate-in fade-in slide-in-from-bottom-8 duration-700 text-right">
            <div className="bg-white rounded-[3rem] p-8 md:p-12 shadow-xl shadow-slate-200/50 border border-slate-100 relative overflow-hidden">
              <div className="absolute top-0 left-0 w-32 h-32 bg-orange-50 rounded-br-full opacity-50 -ml-16 -mt-16" />
              
              <div className="flex flex-col md:flex-row-reverse md:items-center justify-between gap-6 mb-10 border-b border-slate-100 pb-8">
                <div className="flex items-center flex-row-reverse gap-5">
                  <div className="bg-orange-100 p-4 rounded-[2rem] text-[#B45309]">
                    <Lightbulb size={32} />
                  </div>
                  <div>
                    <span className="text-[#B45309] font-black text-sm uppercase tracking-widest">{idea.category}</span>
                    <h3 className="text-3xl md:text-4xl font-[900] text-[#064E3B] mt-1">{idea.title}</h3>
                  </div>
                </div>
                <div className="flex gap-3 flex-row-reverse">
                  <button 
                    onClick={handleCopy}
                    className="flex items-center gap-2 px-6 py-3 rounded-2xl border-2 border-slate-100 hover:bg-slate-50 transition-colors text-slate-600 font-bold"
                  >
                    {copySuccess ? 'تم النسخ!' : <><Share2 size={20} /> مشاركة</>}
                  </button>
                  <div className="flex items-center gap-2 bg-slate-50 px-6 py-3 rounded-2xl text-slate-600 font-bold border border-slate-100">
                    <Clock size={20} />
                    <span>{idea.estimatedTime}</span>
                  </div>
                </div>
              </div>

              <div className="grid md:grid-cols-5 gap-10">
                <div className="md:col-span-3 space-y-8">
                  <div>
                    <h4 className="text-[#064E3B] font-black text-xl mb-4 flex items-center flex-row-reverse gap-2">
                      <span className="w-2 h-6 bg-[#B45309] rounded-full" />
                      شرح الفكرة
                    </h4>
                    <p className="text-slate-600 text-lg leading-relaxed font-medium">
                      {idea.description}
                    </p>
                  </div>

                  <div>
                    <h4 className="text-[#064E3B] font-black text-xl mb-6 flex items-center flex-row-reverse gap-2">
                      <span className="w-2 h-6 bg-[#064E3B] rounded-full" />
                      خطوات التنفيذ
                    </h4>
                    <div className="space-y-4">
                      {idea.steps.map((step, idx) => (
                        <div key={idx} className="flex flex-row-reverse gap-4 group">
                          <span className="flex-shrink-0 w-10 h-10 rounded-full bg-slate-100 text-[#064E3B] flex items-center justify-center font-black text-lg group-hover:bg-[#064E3B] group-hover:text-white transition-colors">
                            {idx + 1}
                          </span>
                          <p className="text-slate-600 text-lg py-1.5 font-medium flex-1">{step}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="md:col-span-2">
                  <div className="bg-[#064E3B] rounded-[2.5rem] p-8 text-white h-full shadow-lg relative overflow-hidden text-center">
                    <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-white/5 rounded-full" />
                    <h4 className="font-black text-2xl mb-6 flex items-center justify-center gap-3">
                      <Trophy size={28} className="text-orange-300" />
                      أثر الفكرة
                    </h4>
                    <p className="text-orange-50 text-xl leading-relaxed font-bold italic">
                      " {idea.benefit} "
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      <footer className="mt-20 text-center text-slate-400 font-bold text-sm">
        جميع الحقوق محفوظة &copy; تطبيق مُعين المحفظ الذكي 2024
      </footer>
    </div>
  );
};

export default App;

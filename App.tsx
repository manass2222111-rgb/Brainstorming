
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
  Key,
  ExternalLink
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
  const [error, setError] = useState<string | null>(null);
  const [hasKey, setHasKey] = useState<boolean>(true);

  useEffect(() => {
    checkKeyStatus();
  }, []);

  const checkKeyStatus = async () => {
    if (window.aistudio && typeof window.aistudio.hasSelectedApiKey === 'function') {
      const selected = await window.aistudio.hasSelectedApiKey();
      setHasKey(selected);
    }
  };

  const handleOpenKeyDialog = async () => {
    if (window.aistudio && typeof window.aistudio.openSelectKey === 'function') {
      await window.aistudio.openSelectKey();
      // نفترض النجاح حسب التعليمات
      setHasKey(true);
      setError(null);
    }
  };

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
      console.error("Error generating idea:", err);
      if (err.message === "API_KEY_MISSING") {
        setHasKey(false);
      } else {
        setError(err.message || "حدث خطأ غير متوقع");
      }
    } finally {
      setLoading(false);
    }
  };

  if (!hasKey) {
    return (
      <div className="min-h-screen bg-[#FDFDFB] flex flex-col items-center justify-center p-6 text-center" dir="rtl">
        <div className="bg-white p-12 rounded-[3rem] shadow-2xl border border-slate-100 max-w-md w-full">
          <div className="bg-orange-50 w-20 h-20 rounded-3xl flex items-center justify-center mx-auto mb-8 text-[#B45309]">
            <Key size={40} />
          </div>
          <h2 className="text-3xl font-black text-[#064E3B] mb-4 text-center">تفعيل المفتاح</h2>
          <p className="text-slate-500 font-bold mb-8 leading-relaxed">
            للبدء باستخدام مُعين المحفظ، يرجى تفعيل مفتاح التشغيل الخاص بك. تأكد من استخدام مشروع مدفوع.
          </p>
          <button 
            onClick={handleOpenKeyDialog}
            className="w-full bg-[#064E3B] text-white py-6 rounded-2xl font-black text-xl flex items-center justify-center gap-3 hover:bg-[#053a2b] transition-all"
          >
            تفعيل المفتاح الآن
          </button>
          <a 
            href="https://ai.google.dev/gemini-api/docs/billing" 
            target="_blank" 
            className="mt-6 inline-flex items-center gap-2 text-sm font-bold text-[#B45309] hover:underline"
          >
            حول فوترة المفتاح <ExternalLink size={14} />
          </a>
        </div>
      </div>
    );
  }

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
              <p className="text-[10px] md:text-sm text-[#B45309] font-bold mt-1 uppercase tracking-widest leading-none">بنك الأفكار المهارية</p>
            </div>
          </div>
          <button 
            onClick={handleOpenKeyDialog}
            className="p-2 text-slate-400 hover:text-[#B45309] transition-colors"
            title="تغيير المفتاح"
          >
            <Key size={20} />
          </button>
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

        {/* Categories Grid - 3 Columns on md+ */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-8 mb-12">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`flex flex-col items-center justify-center gap-3 p-6 md:p-10 rounded-[2.5rem] bg-white transition-all duration-300 border-2 active:scale-95 shadow-sm ${
                selectedCategory === cat.id 
                  ? 'border-[#B45309] shadow-xl -translate-y-1' 
                  : 'border-transparent hover:border-slate-100'
              }`}
            >
              <div className={`transition-all duration-300 p-4 rounded-2xl flex items-center justify-center ${
                selectedCategory === cat.id 
                  ? 'bg-[#B45309] text-white scale-110 shadow-lg' 
                  : 'bg-slate-50 text-slate-300'
              }`}>
                {cat.icon}
              </div>
              <span className={`text-base md:text-xl font-black ${selectedCategory === cat.id ? 'text-[#064E3B]' : 'text-slate-400'}`}>
                {cat.label}
              </span>
            </button>
          ))}
        </div>

        {/* Generate Button */}
        <div className="flex justify-center mb-16">
          <button
            onClick={handleGenerate}
            disabled={loading}
            className={`w-full py-6 md:py-9 rounded-[2.5rem] text-2xl md:text-4xl font-black flex items-center justify-center gap-4 transition-all duration-300 shadow-2xl active:scale-[0.98] ${
              loading 
                ? 'bg-slate-100 text-slate-300 cursor-not-allowed' 
                : 'bg-[#064E3B] text-white hover:bg-[#053a2b]'
            }`}
          >
            {loading ? <RefreshCw className="animate-spin" size={36} /> : (
              <>
                <span>استلهم فكرة جديدة</span>
                <Sparkles className="text-yellow-400" size={36} />
              </>
            )}
          </button>
        </div>

        {/* Error Handling */}
        {error && (
          <div className="bg-red-50 border-2 border-red-100 p-8 rounded-[2.5rem] text-center mb-12">
            <AlertCircle className="mx-auto text-red-500 mb-4" size={48} />
            <p className="text-xl font-bold text-red-800">حدث خطأ: {error}</p>
          </div>
        )}

        {/* Result Area */}
        <div id="result-section">
          {idea && !loading && (
            <div className="bg-white rounded-[4rem] shadow-2xl overflow-hidden border border-slate-50 animate-in slide-in-from-bottom-20 duration-700">
              <div className="bg-[#064E3B] p-10 md:p-20 text-white relative">
                <div className="flex justify-between items-center mb-8">
                  <span className="bg-white/10 px-4 py-1 rounded-full text-sm font-bold border border-white/20">
                    {idea.category}
                  </span>
                  <div className="flex items-center gap-2 text-sm font-bold opacity-80">
                    <Clock size={18} /> {idea.estimatedTime}
                  </div>
                </div>
                <h3 className="text-3xl md:text-6xl font-black leading-tight mb-6">{idea.title}</h3>
                <div className="absolute -bottom-8 right-12 bg-[#B45309] p-5 md:p-7 rounded-3xl shadow-2xl ring-[10px] ring-white floating">
                  <Lightbulb className="text-white" size={40} />
                </div>
              </div>

              <div className="p-10 md:p-20 pt-20 text-right">
                <div className="bg-slate-50 p-8 md:p-12 rounded-[2.5rem] border border-slate-100 mb-12 text-center">
                  <p className="text-xl md:text-3xl text-slate-600 font-medium italic leading-relaxed">"{idea.description}"</p>
                </div>

                <div className="space-y-10 mb-14">
                  <h4 className="font-black text-[#064E3B] text-2xl md:text-4xl flex items-center gap-3 flex-row-reverse">
                    <span className="w-2 h-10 bg-[#B45309] rounded-full"></span>
                    خطوات التنفيذ
                  </h4>
                  <div className="grid gap-6">
                    {idea.steps.map((step, i) => (
                      <div key={i} className="flex flex-row-reverse gap-6 items-start group">
                        <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-[#064E3B] text-white font-black text-xl flex items-center justify-center shadow-md">
                          {i + 1}
                        </div>
                        <p className="text-slate-500 font-bold text-lg md:text-2xl pt-2 leading-relaxed flex-1">{step}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-gradient-to-br from-orange-50 to-white rounded-[3rem] p-10 border border-orange-100 mb-14 text-center">
                  <div className="flex items-center justify-center gap-3 mb-4 text-[#B45309]">
                    <Trophy size={32} />
                    <h4 className="font-black text-lg uppercase tracking-widest">الثمرة المرجوة</h4>
                  </div>
                  <p className="text-[#064E3B] font-black text-2xl md:text-4xl leading-tight">{idea.benefit}</p>
                </div>

                <button
                  onClick={() => {
                    const text = `💡 فكرة من مُعين المحفظ: *${idea.title}*\n\n🌟 الثمرة: ${idea.benefit}`;
                    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
                  }}
                  className="w-full bg-[#064E3B] text-white py-7 rounded-[2.5rem] font-black text-2xl flex items-center justify-center gap-4 hover:bg-[#053a2b] transition-all shadow-xl active:scale-95"
                >
                  <Share2 size={28} /> مشاركة الفكرة
                </button>
              </div>
            </div>
          )}
        </div>
      </main>

      <footer className="mt-20 text-center opacity-30 px-6">
        <p className="text-xs font-black text-slate-400 uppercase tracking-[0.4em] mb-2">مُعين المحفظ • بنك الأفكار المهارية</p>
        <p className="text-[10px] font-bold text-slate-300">نعتز بخدمة أهل القرآن الكريم • ٢٠٢٥</p>
      </footer>
    </div>
  );
};

export default App;

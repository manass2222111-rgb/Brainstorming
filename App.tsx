
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
  AlertTriangle
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
        document.getElementById('result-section')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 100);
    } catch (err: any) {
      console.error(err);
      if (err.message === "API_KEY_NOT_FOUND") {
        setError('تنبيه: لم يتم العثور على المفتاح. في Vercel، تأكد من إضافة API_KEY ثم عمل Deploy من جديد.');
      } else {
        setError('حدث خطأ في الاتصال. يرجى التأكد من صلاحية المفتاح وحالة الإنترنت.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    if (!idea) return;
    const text = `💡 فكرة إبداعية من مُعين المحفظ:\n\n*${idea.title}*\n\n${idea.description}\n\n🌟 الثمرة: ${idea.benefit}\n\nتم التوليد بواسطة مُعين المحفظ.`;
    navigator.clipboard.writeText(text);
    setCopySuccess(true);
    setTimeout(() => setCopySuccess(false), 2000);
  };

  return (
    <div className="min-h-screen bg-[#FDFDFB] text-[#1E293B] font-['Tajawal'] pb-20 selection:bg-[#064E3B] selection:text-white" dir="rtl">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-slate-100 mb-8 sticky top-0 z-50">
        <header className={`max-w-6xl mx-auto px-6 py-4 flex items-center justify-between transition-all duration-1000 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
          <div className="flex items-center gap-4">
            <div className="bg-white p-1 rounded-xl shadow-sm border border-slate-50 overflow-hidden w-12 h-12 md:w-16 md:h-16">
              <img 
                src="https://www.awqaf.gov.ae/assets/mediakit/AwqafLogoIcon.png" 
                alt="Logo" 
                className="w-full h-full object-contain"
              />
            </div>
            <div>
              <h1 className="text-xl md:text-3xl font-[900] text-[#064E3B] leading-none">مُعين المحفظ</h1>
              <p className="text-[10px] md:text-sm text-[#B45309] font-bold mt-1 uppercase tracking-widest">بنك الأفكار المهارية</p>
            </div>
          </div>
        </header>
      </div>

      <main className="max-w-4xl mx-auto px-6">
        {/* Title Section */}
        <section className={`text-center mt-6 mb-12 transition-all duration-1000 delay-200 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
          <h2 className="text-3xl sm:text-5xl md:text-7xl font-[900] text-[#064E3B] leading-tight">
            ابتكر أسلوباً <span className="text-[#B45309]">جديداً</span> في حلقتك
          </h2>
        </section>

        {/* Level Switcher */}
        <div className="flex justify-center mb-10">
          <div className="bg-white rounded-full p-1.5 flex shadow-inner border border-slate-100 w-full max-w-sm relative">
            <button
              onClick={() => setStudentLevel(StudentLevel.CHILDREN)}
              className={`flex-1 flex items-center justify-center gap-2 py-4 rounded-full text-lg font-bold transition-all duration-500 z-10 ${
                studentLevel === StudentLevel.CHILDREN ? 'text-white' : 'text-slate-400'
              }`}
            >
              <Baby size={22} /> للأطفال
            </button>
            <button
              onClick={() => setStudentLevel(StudentLevel.ADULTS)}
              className={`flex-1 flex items-center justify-center gap-2 py-4 rounded-full text-lg font-bold transition-all duration-500 z-10 ${
                studentLevel === StudentLevel.ADULTS ? 'text-white' : 'text-slate-400'
              }`}
            >
              <User size={22} /> للكبار
            </button>
            <div 
              className={`absolute top-1.5 bottom-1.5 w-[calc(50%-6px)] bg-[#064E3B] rounded-full transition-all duration-500 shadow-lg ${
                studentLevel === StudentLevel.CHILDREN ? 'right-1.5' : 'right-[50%]'
              }`}
            />
          </div>
        </div>

        {/* Categories Grid - 3 Columns (Exactly as requested) */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-5 mb-14">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`flex flex-col items-center justify-center gap-4 p-8 rounded-[2.5rem] bg-white transition-all duration-300 border-2 active:scale-95 group shadow-sm ${
                selectedCategory === cat.id 
                  ? 'border-[#B45309] shadow-xl -translate-y-2' 
                  : 'border-transparent hover:border-slate-100 hover:shadow-md'
              }`}
            >
              <div className={`transition-all duration-500 p-4 rounded-2xl flex items-center justify-center ${
                selectedCategory === cat.id 
                  ? 'bg-[#B45309] text-white scale-110 shadow-lg shadow-orange-200' 
                  : 'bg-slate-50 text-slate-300 group-hover:bg-slate-100'
              }`}>
                {cat.icon}
              </div>
              <span className={`text-lg font-black transition-colors duration-300 ${selectedCategory === cat.id ? 'text-[#064E3B]' : 'text-slate-400'}`}>
                {cat.label}
              </span>
            </button>
          ))}
        </div>

        {/* Generate Button - Enhanced Elevation */}
        <div className="flex justify-center mb-16">
          <button
            onClick={handleGenerate}
            disabled={loading}
            className={`w-full py-7 rounded-[2.2rem] text-2xl md:text-3xl font-black flex items-center justify-center gap-4 transition-all duration-500 shadow-2xl active:scale-[0.98] transform group ${
              loading 
                ? 'bg-slate-100 text-slate-300 cursor-not-allowed' 
                : 'bg-[#064E3B] text-white hover:bg-[#053a2b] hover:shadow-emerald-900/30'
            }`}
          >
            {loading ? (
              <RefreshCw className="animate-spin" size={32} />
            ) : (
              <>
                <span className="group-hover:scale-105 transition-transform">استلهم فكرة جديدة</span>
                <Sparkles className="text-yellow-400 group-hover:rotate-12 transition-transform" size={32} />
              </>
            )}
          </button>
        </div>

        {/* Detailed Error Section */}
        {error && (
          <div className="bg-red-50 border border-red-100 text-red-800 p-10 rounded-[2.5rem] mb-12 text-center shadow-lg animate-in zoom-in duration-300">
            <div className="flex justify-center mb-4 text-red-500">
              <AlertTriangle size={48} />
            </div>
            <p className="font-black text-xl mb-4">{error}</p>
            <div className="text-sm text-red-600/70 space-y-2 font-medium">
              <p>خطوات الحل السريع:</p>
              <ul className="list-disc list-inside">
                <li>ادخل على إعدادات Vercel</li>
                <li>تأكد من وجود متغير باسم <code className="bg-red-100 px-2 py-0.5 rounded">API_KEY</code></li>
                <li>بعد الحفظ، اذهب لتبويب <code className="bg-red-100 px-2 py-0.5 rounded">Deployments</code></li>
                <li>اضغط على النقاط الثلاث واختر <code className="bg-red-100 px-2 py-0.5 rounded">Redeploy</code></li>
              </ul>
            </div>
          </div>
        )}

        {/* Results Section */}
        <div id="result-section">
          {idea && !loading && (
            <div className="bg-white rounded-[3.5rem] shadow-2xl overflow-hidden border border-slate-50 animate-in fade-in slide-in-from-bottom-20 duration-1000">
              {/* Card Header Area */}
              <div className="bg-[#064E3B] p-12 md:p-20 text-white relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -mr-32 -mt-32"></div>
                <div className="flex justify-between items-center mb-10 relative z-10">
                  <span className="text-xs md:text-sm bg-white/10 px-6 py-2 rounded-full font-black border border-white/20 uppercase tracking-widest">
                    {idea.category}
                  </span>
                  <div className="flex items-center gap-2 text-sm font-bold bg-black/20 px-4 py-2 rounded-full">
                    <Clock size={18} /> {idea.estimatedTime}
                  </div>
                </div>
                <h3 className="text-5xl md:text-7xl font-black leading-tight mb-6 relative z-10 drop-shadow-lg">{idea.title}</h3>
                <div className="absolute -bottom-8 right-12 md:right-20 bg-[#B45309] p-6 rounded-3xl shadow-2xl ring-[10px] ring-white transform rotate-6 floating">
                  <Lightbulb className="text-white" size={40} />
                </div>
              </div>

              {/* Card Content Area */}
              <div className="p-12 md:p-20 pt-20">
                <div className="bg-slate-50/80 p-12 rounded-[3rem] border border-slate-100 mb-14 text-center">
                  <p className="text-2xl md:text-4xl text-slate-600 font-medium italic leading-relaxed">
                    "{idea.description}"
                  </p>
                </div>

                <div className="space-y-12 mb-16 text-right">
                  <div className="flex items-center flex-row-reverse gap-4">
                    <div className="w-3 h-12 bg-[#B45309] rounded-full"></div>
                    <h4 className="font-black text-[#064E3B] text-3xl md:text-5xl tracking-tight">خطة التنفيذ المهاري</h4>
                  </div>
                  <div className="grid gap-8">
                    {idea.steps.map((step, i) => (
                      <div key={i} className="flex flex-row-reverse gap-8 group">
                        <div className="flex-shrink-0 w-16 h-16 rounded-[1.5rem] bg-[#064E3B] text-white font-black text-3xl flex items-center justify-center shadow-xl group-hover:scale-110 transition-transform">
                          {i + 1}
                        </div>
                        <p className="text-slate-500 font-bold text-2xl md:text-3xl pt-3 leading-relaxed flex-1">{step}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* The Reward Section */}
                <div className="bg-gradient-to-br from-orange-50 to-white rounded-[3rem] p-12 border border-orange-100 mb-16 text-center relative overflow-hidden">
                  <div className="absolute top-0 left-0 w-full h-1 bg-[#B45309]"></div>
                  <div className="flex items-center justify-center gap-4 mb-6">
                    <Trophy size={40} className="text-[#B45309]" />
                    <h4 className="text-[#B45309] font-black text-lg uppercase tracking-[0.3em]">الثمرة التعليمية</h4>
                  </div>
                  <p className="text-[#064E3B] font-black text-3xl md:text-5xl leading-tight">
                    {idea.benefit}
                  </p>
                </div>

                {/* Footer Buttons */}
                <div className="flex flex-col md:flex-row gap-6">
                  <button
                    onClick={() => {
                      const text = `💡 فكرة من مُعين المحفظ: *${idea.title}*\n\n${idea.description}\n\n🌟 الإنجاز: ${idea.benefit}`;
                      window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
                    }}
                    className="flex-[2] bg-[#064E3B] text-white py-7 rounded-[2.5rem] font-black text-2xl md:text-3xl flex items-center justify-center gap-4 hover:bg-[#053a2b] transition-all shadow-2xl active:scale-95"
                  >
                    <Share2 size={32} /> مشاركة الفكرة
                  </button>
                  <button
                    onClick={handleCopy}
                    className={`flex-1 py-7 rounded-[2.5rem] font-black text-xl md:text-2xl border-4 transition-all flex items-center justify-center gap-4 active:scale-95 ${
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

      <footer className="mt-24 text-center opacity-40 px-6">
        <p className="text-sm font-black text-slate-400 uppercase tracking-[0.5em] mb-2">مُعين المحفظ • بنك الأفكار المهارية</p>
        <p className="text-xs font-bold text-slate-300">نعتز بخدمة أهل القرآن الكريم • ٢٠٢٥</p>
      </footer>
    </div>
  );
};

export default App;


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
      setError('المفتاح غير متاح حالياً. تأكد من إضافة API_KEY في إعدادات Vercel ثم اضغط Redeploy.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FDFDFB] text-[#1E293B] font-['Tajawal'] pb-20" dir="rtl">
      {/* Header - Matching Screenshot */}
      <div className="bg-white shadow-sm border-b border-slate-100 mb-8 sticky top-0 z-50">
        <header className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4 flex-row-reverse">
            <div className="bg-white p-1 rounded-xl shadow-sm border border-slate-100 overflow-hidden w-12 h-12 md:w-16 md:h-16">
              <img 
                src="https://www.awqaf.gov.ae/assets/mediakit/AwqafLogoIcon.png" 
                alt="Logo" 
                className="w-full h-full object-contain"
              />
            </div>
            <div className="text-right">
              <h1 className="text-xl md:text-3xl font-[900] text-[#064E3B] leading-none">مُعين المحفظ</h1>
              <p className="text-[10px] md:text-sm text-[#B45309] font-bold mt-1 uppercase tracking-widest">بنك الأفكار المهارية</p>
            </div>
          </div>
        </header>
      </div>

      <main className="max-w-5xl mx-auto px-6">
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
        <div className="grid grid-cols-2 md:grid-cols-3 gap-6 mb-12">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`flex flex-col items-center justify-center gap-4 p-8 rounded-[2.5rem] bg-white transition-all duration-300 border-2 active:scale-95 shadow-sm ${
                selectedCategory === cat.id 
                  ? 'border-[#B45309] shadow-xl -translate-y-2' 
                  : 'border-transparent hover:border-slate-100 hover:shadow-md text-slate-400'
              }`}
            >
              <div className={`transition-all duration-500 p-4 rounded-2xl flex items-center justify-center ${
                selectedCategory === cat.id 
                  ? 'bg-[#B45309] text-white scale-110 shadow-lg' 
                  : 'bg-slate-50 text-slate-300'
              }`}>
                {cat.icon}
              </div>
              <span className={`text-lg font-black ${selectedCategory === cat.id ? 'text-[#064E3B]' : ''}`}>
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
            className={`w-full py-7 rounded-[2.2rem] text-2xl md:text-4xl font-black flex items-center justify-center gap-4 transition-all duration-500 shadow-2xl active:scale-95 ${
              loading 
                ? 'bg-slate-100 text-slate-300' 
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

        {/* Improved Error UI */}
        {error && (
          <div className="bg-red-50 border-2 border-red-100 p-10 rounded-[3rem] text-center mb-12 animate-in fade-in zoom-in duration-500">
            <div className="flex justify-center mb-6 text-red-500">
              <AlertCircle size={64} />
            </div>
            <h3 className="text-2xl font-black text-red-800 mb-4">{error}</h3>
            <div className="text-red-600/70 space-y-2 font-bold max-w-md mx-auto leading-relaxed">
              <p>ملاحظة هامة: بعد إضافة API_KEY في Vercel، يجب الضغط على <span className="bg-red-100 px-2 rounded">Redeploy</span> من قائمة النقاط الثلاث في صفحة الـ Deployments ليتم تفعيل المفتاح.</p>
            </div>
          </div>
        )}

        {/* Result Area */}
        <div id="result-section">
          {idea && !loading && (
            <div className="bg-white rounded-[3.5rem] shadow-2xl overflow-hidden border border-slate-50 animate-in slide-in-from-bottom-20 duration-1000">
              <div className="bg-[#064E3B] p-12 md:p-20 text-white relative">
                <div className="flex justify-between items-center mb-10">
                  <span className="bg-white/10 px-6 py-2 rounded-full font-black border border-white/20 uppercase text-sm tracking-widest">
                    {idea.category}
                  </span>
                  <div className="flex items-center gap-2 text-sm font-bold bg-black/20 px-4 py-2 rounded-full">
                    <Clock size={18} /> {idea.estimatedTime}
                  </div>
                </div>
                <h3 className="text-5xl md:text-7xl font-black leading-tight mb-6">{idea.title}</h3>
                <div className="absolute -bottom-8 right-12 bg-[#B45309] p-6 rounded-3xl shadow-2xl ring-[10px] ring-white floating">
                  <Lightbulb className="text-white" size={48} />
                </div>
              </div>

              <div className="p-12 md:p-20 pt-24 text-right">
                <div className="bg-slate-50 p-12 rounded-[3rem] border border-slate-100 mb-14 text-center">
                  <p className="text-2xl md:text-4xl text-slate-600 font-medium italic leading-relaxed">"{idea.description}"</p>
                </div>

                <div className="space-y-12 mb-16">
                  <div className="flex items-center flex-row-reverse gap-4">
                    <div className="w-3 h-12 bg-[#B45309] rounded-full"></div>
                    <h4 className="font-black text-[#064E3B] text-3xl md:text-5xl">خطة التنفيذ</h4>
                  </div>
                  <div className="grid gap-8">
                    {idea.steps.map((step, i) => (
                      <div key={i} className="flex flex-row-reverse gap-8 items-start group">
                        <div className="flex-shrink-0 w-16 h-16 rounded-2xl bg-[#064E3B] text-white font-black text-3xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                          {i + 1}
                        </div>
                        <p className="text-slate-500 font-bold text-2xl md:text-3xl pt-2 leading-relaxed flex-1">{step}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-gradient-to-br from-orange-50 to-white rounded-[3rem] p-12 border border-orange-100 mb-16 text-center">
                  <div className="flex items-center justify-center gap-4 mb-6">
                    <Trophy size={40} className="text-[#B45309]" />
                    <h4 className="text-[#B45309] font-black text-lg uppercase tracking-[0.3em]">الثمرة التعليمية</h4>
                  </div>
                  <p className="text-[#064E3B] font-black text-3xl md:text-5xl leading-tight">{idea.benefit}</p>
                </div>

                <button
                  onClick={() => {
                    const text = `💡 فكرة من مُعين المحفظ: *${idea.title}*\n\n${idea.description}\n\n🌟 الإنجاز: ${idea.benefit}`;
                    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
                  }}
                  className="w-full bg-[#064E3B] text-white py-8 rounded-[2.5rem] font-black text-2xl md:text-3xl flex items-center justify-center gap-4 hover:bg-[#053a2b] transition-all shadow-2xl active:scale-95"
                >
                  <Share2 size={36} /> مشاركة الفكرة عبر واتساب
                </button>
              </div>
            </div>
          )}
        </div>
      </main>

      <footer className="mt-24 text-center opacity-30 px-6">
        <p className="text-sm font-black text-slate-400 uppercase tracking-[0.5em] mb-2">مُعين المحفظ • بنك الأفكار المهارية</p>
        <p className="text-xs font-bold text-slate-300">نعتز بخدمة أهل القرآن الكريم • ٢٠٢٥</p>
      </footer>
    </div>
  );
};

export default App;

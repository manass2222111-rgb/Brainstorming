
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
  ChevronLeft
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
      }, 150);
    } catch (err: any) {
      console.error("Gemini Error Context:", err);
      const isKeyMissing = !process.env.API_KEY || process.env.API_KEY === 'undefined';
      setError({
        title: isKeyMissing ? "تنبيه: إعدادات المفتاح" : "عذراً، حدث خطأ",
        msg: isKeyMissing 
          ? "لم يتم العثور على API_KEY. يرجى التأكد من إضافته في إعدادات Vercel وعمل Redeploy." 
          : "هناك مشكلة في الاتصال بخدمة Gemini. تأكد من صلاحية المفتاح والاتصال.",
        isKeyIssue: isKeyMissing
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FDFDFB] text-[#1E293B] font-['Tajawal'] pb-24" dir="rtl">
      {/* Header */}
      <header className="bg-white/90 backdrop-blur-xl sticky top-0 z-50 border-b border-slate-100 shadow-sm">
        <div className="max-w-6xl mx-auto px-6 py-5 flex items-center justify-between">
          <div className="flex items-center gap-4 flex-row-reverse">
            <div className="bg-[#064E3B] p-2.5 rounded-2xl shadow-lg rotate-2">
              <img src="https://www.awqaf.gov.ae/assets/mediakit/AwqafLogoIcon.png" alt="Awqaf" className="w-9 h-9 object-contain invert" />
            </div>
            <div className="text-right">
              <h1 className="text-2xl font-black text-[#064E3B] leading-none">مُعين المحفظ</h1>
              <p className="text-[10px] font-bold text-[#B45309] mt-1 tracking-widest uppercase">الابتكار في تعليم القرآن</p>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 mt-12">
        {/* Student Level Selector */}
        <div className="flex justify-center mb-16">
          <div className="bg-slate-100 p-1.5 rounded-[2.5rem] flex w-full max-w-sm shadow-inner relative">
            <button
              onClick={() => setStudentLevel(StudentLevel.CHILDREN)}
              className={`flex-1 py-4 rounded-[2rem] text-base font-black transition-all duration-500 z-10 flex items-center justify-center gap-2 ${
                studentLevel === StudentLevel.CHILDREN ? 'text-white' : 'text-slate-400'
              }`}
            >
              <Baby size={20} /> للأطفال
            </button>
            <button
              onClick={() => setStudentLevel(StudentLevel.ADULTS)}
              className={`flex-1 py-4 rounded-[2rem] text-base font-black transition-all duration-500 z-10 flex items-center justify-center gap-2 ${
                studentLevel === StudentLevel.ADULTS ? 'text-white' : 'text-slate-400'
              }`}
            >
              <User size={20} /> للكبار
            </button>
            <div 
              className={`absolute top-1.5 bottom-1.5 w-[calc(50%-6px)] bg-[#064E3B] rounded-[2rem] transition-all duration-500 shadow-xl ${
                studentLevel === StudentLevel.CHILDREN ? 'right-1.5' : 'right-[50%]'
              }`}
            />
          </div>
        </div>

        {/* Categories Grid - 3 Columns on Desktop */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 mb-20">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`group flex flex-col items-center justify-center p-12 rounded-[3.5rem] transition-all duration-500 border-2 active:scale-95 ${
                selectedCategory === cat.id 
                  ? 'bg-white border-[#B45309] shadow-2xl shadow-orange-100 scale-[1.03] ring-4 ring-orange-50' 
                  : 'bg-white border-transparent shadow-sm hover:shadow-xl hover:border-slate-100'
              }`}
            >
              <div className={`mb-6 p-6 rounded-3xl transition-all duration-500 ${
                selectedCategory === cat.id 
                  ? 'bg-[#B45309] text-white shadow-lg rotate-6 scale-110' 
                  : 'bg-slate-50 text-slate-300 group-hover:bg-orange-50 group-hover:text-orange-300'
              }`}>
                {cat.icon}
              </div>
              <span className={`text-xl md:text-2xl font-black ${
                selectedCategory === cat.id ? 'text-[#064E3B]' : 'text-slate-400'
              }`}>
                {cat.label}
              </span>
            </button>
          ))}
        </div>

        {/* Generate Button */}
        <div className="max-w-md mx-auto mb-24">
          <button
            onClick={handleGenerate}
            disabled={loading}
            className={`w-full py-8 rounded-[3rem] text-2xl font-black flex items-center justify-center gap-4 transition-all duration-500 shadow-2xl relative overflow-hidden ${
              loading 
                ? 'bg-slate-100 text-slate-300 scale-95' 
                : 'bg-[#064E3B] text-white hover:bg-[#043d2e] hover:shadow-emerald-900/20 hover:-translate-y-1'
            }`}
          >
            {loading ? <RefreshCw className="animate-spin" size={32} /> : (
              <>
                <span>استلهم فكرة</span>
                <Sparkles className="text-yellow-400" size={28} />
              </>
            )}
          </button>
        </div>

        {/* Diagnostics & Error Section */}
        {error && (
          <div className="max-w-2xl mx-auto bg-white border-2 border-red-50 p-12 rounded-[4rem] shadow-2xl text-center mb-24 animate-in zoom-in-95 duration-500">
            <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-8">
              <AlertCircle className="text-red-500" size={48} />
            </div>
            <h3 className="text-2xl font-black text-red-900 mb-4">{error.title}</h3>
            <p className="text-red-600 font-bold mb-10 text-lg leading-relaxed">{error.msg}</p>
            
            {error.isKeyIssue && (
              <div className="bg-slate-900 p-8 rounded-[2.5rem] text-right text-white relative overflow-hidden shadow-2xl">
                <div className="flex items-center gap-3 mb-6 text-emerald-400 font-black">
                  <Key size={20} /> تقرير التشخيص الفني
                </div>
                <div className="space-y-4 font-bold text-slate-300 text-sm">
                  <div className="flex items-start gap-3">
                    <span className="bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded text-xs">INFO</span>
                    <p>الحالة: المفتاح غير معروف للمتصفح (undefined).</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <span className="bg-blue-500/20 text-blue-400 px-2 py-0.5 rounded text-xs">FIX</span>
                    <p>تأكد من تسمية المتغير في Vercel بـ <code className="bg-white/10 px-1 rounded">API_KEY</code>.</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <span className="bg-orange-500/20 text-orange-400 px-2 py-0.5 rounded text-xs">REQ</span>
                    <p>يجب الضغط على <b>Redeploy</b> بعد حفظ الإعدادات.</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Result Area */}
        <div id="result-section">
          {idea && !loading && (
            <div className="bg-white rounded-[5rem] shadow-2xl overflow-hidden border border-slate-50 animate-in slide-in-from-bottom-20 duration-1000">
              <div className="bg-gradient-to-br from-[#064E3B] to-[#043d2e] p-16 md:p-24 text-white relative">
                <div className="flex justify-between items-center mb-10">
                  <div className="bg-white/10 px-6 py-2 rounded-full text-xs font-black border border-white/20 backdrop-blur-md">
                    {idea.category}
                  </div>
                  <div className="flex items-center gap-2 text-sm font-bold opacity-70">
                    <Clock size={20} /> {idea.estimatedTime}
                  </div>
                </div>
                <h3 className="text-4xl md:text-6xl font-black mb-8 leading-tight">{idea.title}</h3>
                <div className="absolute -bottom-10 right-16 md:right-24 bg-[#B45309] p-8 rounded-[2.5rem] shadow-2xl ring-[12px] ring-white floating">
                  <Lightbulb className="text-white" size={48} />
                </div>
              </div>

              <div className="p-16 md:p-28 pt-24">
                <div className="bg-orange-50/50 p-10 md:p-16 rounded-[3rem] border border-orange-100/50 mb-20 text-center shadow-inner">
                  <p className="text-2xl md:text-4xl text-slate-700 font-medium italic leading-relaxed">"{idea.description}"</p>
                </div>

                <div className="space-y-12 mb-20">
                  <h4 className="font-black text-[#064E3B] text-3xl flex items-center gap-5">
                    <div className="w-3 h-12 bg-[#B45309] rounded-full"></div>
                    خطوات التنفيذ العميق
                  </h4>
                  <div className="grid gap-6">
                    {idea.steps.map((step, i) => (
                      <div key={i} className="flex gap-8 items-start bg-slate-50/50 p-8 md:p-10 rounded-[3rem] border border-transparent hover:border-orange-100 transition-all duration-300 group">
                        <div className="w-14 h-14 rounded-2xl bg-white text-[#B45309] font-black text-2xl flex items-center justify-center flex-shrink-0 shadow-md border border-orange-50 group-hover:scale-110 transition-transform">
                          {i + 1}
                        </div>
                        <p className="text-slate-600 font-bold text-xl md:text-2xl pt-2 leading-relaxed">{step}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-[#064E3B] p-16 rounded-[4rem] text-center mb-16 shadow-2xl shadow-emerald-900/10">
                  <Trophy className="mx-auto text-yellow-400 mb-6" size={64} />
                  <h4 className="font-black text-[10px] text-yellow-400 uppercase tracking-[0.5em] mb-4">الثمرة التربوية المرجوة</h4>
                  <p className="text-white font-black text-3xl md:text-5xl leading-tight">{idea.benefit}</p>
                </div>

                <button
                  onClick={() => {
                    const text = `💡 استلهمت فكرة إبداعية للحلقة: *${idea.title}*\n\n🌟 الأثر: ${idea.benefit}\n\nعبر تطبيق "مُعين المحفظ" الذكي.`;
                    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
                  }}
                  className="w-full bg-slate-900 text-white py-8 rounded-[3rem] font-black text-2xl flex items-center justify-center gap-4 hover:bg-black transition-all shadow-2xl active:scale-95"
                >
                  <Share2 size={32} /> شارك الفائدة مع المعلمين
                </button>
              </div>
            </div>
          )}
        </div>
      </main>

      <footer className="mt-40 text-center opacity-30 pb-16">
        <p className="text-xs font-black text-slate-400 uppercase tracking-[0.6em]">مُعين المحفظ • رؤية إبداعية لجيل القرآن • ٢٠٢٥</p>
      </footer>
    </div>
  );
};

export default App;

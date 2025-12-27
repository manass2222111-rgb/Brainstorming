
import React, { useState } from 'react';
import { 
  Sparkles, RefreshCw, Share2, Filter, Trophy, Brain, Users, 
  Book, Wind, Baby, User, Clock, Lightbulb, AlertTriangle, CheckCircle 
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

  const handleGenerate = async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await generateIdea(selectedCategory, studentLevel);
      setIdea(result);
      document.getElementById('result')?.scrollIntoView({ behavior: 'smooth' });
    } catch (err: any) {
      if (err.message === "API_KEY_MISSING") {
        setError("مفتاح API غير مفعّل. يرجى التأكد من إضافة API_KEY في إعدادات Vercel.");
      } else {
        setError("حدث خطأ أثناء الاتصال. يرجى المحاولة مرة أخرى.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8F9FA] font-['Tajawal'] antialiased text-slate-900 pb-20" dir="rtl">
      {/* Header */}
      <nav className="bg-white border-b border-slate-200 sticky top-0 z-50 px-6 py-4 shadow-sm">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="bg-[#064E3B] p-2 rounded-xl shadow-md">
              <img src="https://www.awqaf.gov.ae/assets/mediakit/AwqafLogoIcon.png" className="w-8 h-8 invert" alt="Logo" />
            </div>
            <h1 className="text-xl font-extrabold text-[#064E3B]">مُعين المحفظ</h1>
          </div>
          <div className="hidden md:block text-[10px] font-bold text-slate-400 tracking-widest uppercase">AI-Powered Teaching Assistant</div>
        </div>
      </nav>

      <main className="max-w-6xl mx-auto px-6 pt-12">
        {/* Selector */}
        <div className="flex justify-center mb-12">
          <div className="bg-slate-200 p-1 rounded-full flex w-full max-w-xs shadow-inner relative">
            <button 
              onClick={() => setStudentLevel(StudentLevel.CHILDREN)}
              className={`flex-1 py-3 rounded-full text-sm font-bold z-10 transition-colors ${studentLevel === StudentLevel.CHILDREN ? 'text-white' : 'text-slate-500'}`}
            >الأطفال</button>
            <button 
              onClick={() => setStudentLevel(StudentLevel.ADULTS)}
              className={`flex-1 py-3 rounded-full text-sm font-bold z-10 transition-colors ${studentLevel === StudentLevel.ADULTS ? 'text-white' : 'text-slate-500'}`}
            >الكبار</button>
            <div className={`absolute top-1 bottom-1 w-[calc(50%-4px)] bg-[#064E3B] rounded-full transition-all duration-300 shadow-md ${studentLevel === StudentLevel.CHILDREN ? 'right-1' : 'right-[50%]'}`} />
          </div>
        </div>

        {/* 3-Column Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`p-8 rounded-[2.5rem] bg-white border-2 transition-all duration-300 text-center flex flex-col items-center gap-4 group ${
                selectedCategory === cat.id ? 'border-[#B45309] shadow-xl scale-[1.02]' : 'border-transparent hover:border-slate-200 shadow-sm'
              }`}
            >
              <div className={`p-5 rounded-2xl transition-colors ${selectedCategory === cat.id ? 'bg-[#B45309] text-white' : 'bg-slate-50 text-slate-300 group-hover:text-[#B45309]'}`}>
                {cat.icon}
              </div>
              <span className={`text-xl font-bold ${selectedCategory === cat.id ? 'text-[#064E3B]' : 'text-slate-400'}`}>{cat.label}</span>
            </button>
          ))}
        </div>

        {/* CTA */}
        <div className="flex flex-col items-center gap-6">
          <button
            onClick={handleGenerate}
            disabled={loading}
            className={`px-12 py-6 rounded-full text-xl font-black flex items-center gap-3 transition-all shadow-2xl ${
              loading ? 'bg-slate-200 text-slate-400 scale-95' : 'bg-[#064E3B] text-white hover:bg-[#043d2e] hover:-translate-y-1'
            }`}
          >
            {loading ? <RefreshCw className="animate-spin" /> : <Sparkles className="text-yellow-400" />}
            {loading ? 'جاري التفكير...' : 'توليد فكرة إبداعية'}
          </button>

          {error && (
            <div className="bg-red-50 border border-red-100 p-4 rounded-2xl flex items-center gap-3 text-red-700 font-bold animate-bounce">
              <AlertTriangle size={20} />
              {error}
            </div>
          )}
        </div>

        {/* Result */}
        <div id="result" className="mt-20">
          {idea && !loading && (
            <div className="bg-white rounded-[3rem] shadow-2xl overflow-hidden border border-slate-100 animate-in fade-in slide-in-from-bottom-10 duration-700">
              <div className="bg-[#064E3B] p-10 md:p-16 text-white text-center relative">
                <div className="bg-white/10 backdrop-blur-md px-4 py-1 rounded-full text-[10px] inline-block mb-4 border border-white/20">{idea.category}</div>
                <h2 className="text-3xl md:text-5xl font-black mb-4 leading-tight">{idea.title}</h2>
                <div className="flex justify-center items-center gap-2 opacity-70 text-sm font-bold">
                  <Clock size={16} /> {idea.estimatedTime}
                </div>
                <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 bg-[#B45309] p-5 rounded-2xl shadow-xl floating">
                  <Lightbulb className="text-white" size={32} />
                </div>
              </div>
              
              <div className="p-10 md:p-20 pt-16">
                <div className="text-center mb-12">
                  <p className="text-xl md:text-2xl text-slate-600 font-medium leading-relaxed italic">"{idea.description}"</p>
                </div>

                <div className="grid md:grid-cols-2 gap-12">
                  <div className="space-y-6">
                    <h3 className="text-xl font-black text-[#064E3B] flex items-center gap-2 border-r-4 border-[#B45309] pr-3">خطة التنفيذ:</h3>
                    <div className="space-y-4">
                      {idea.steps.map((step, i) => (
                        <div key={i} className="flex gap-4 items-start">
                          <span className="w-8 h-8 rounded-lg bg-emerald-50 text-[#064E3B] font-bold flex items-center justify-center flex-shrink-0">{i+1}</span>
                          <p className="font-bold text-slate-700 leading-relaxed">{step}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="bg-slate-50 p-8 rounded-[2rem] border border-slate-100 self-start">
                    <h3 className="text-xl font-black text-[#064E3B] mb-4 flex items-center gap-2">
                      <CheckCircle size={20} className="text-[#B45309]" />
                      الهدف والنتيجة:
                    </h3>
                    <p className="text-lg font-bold text-slate-600 leading-relaxed">{idea.benefit}</p>
                  </div>
                </div>

                <button 
                  onClick={() => {
                    const msg = `💡 فكرة إبداعية للحلقة: *${idea.title}*\n\n🌟 الأثر: ${idea.benefit}\n\nتوليد عبر: مُعين المحفظ الذكي.`;
                    window.open(`https://wa.me/?text=${encodeURIComponent(msg)}`, '_blank');
                  }}
                  className="mt-16 w-full py-6 rounded-2xl bg-[#25D366] text-white font-black text-xl flex items-center justify-center gap-3 hover:opacity-90 transition-opacity shadow-lg"
                >
                  <Share2 /> شاركها عبر واتساب
                </button>
              </div>
            </div>
          )}
        </div>
      </main>

      <footer className="mt-40 pb-20 text-center opacity-30 pointer-events-none">
        <p className="text-[10px] font-black uppercase tracking-[1em]">مُعين المحفظ • ذكاء اصطناعي قرآني • ٢٠٢٥</p>
      </footer>
    </div>
  );
};

export default App;

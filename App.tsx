
import React, { useState } from 'react';
import { 
  Sparkles, 
  BookOpen, 
  Target, 
  Heart, 
  Settings, 
  Music, 
  Lightbulb, 
  Copy, 
  Check, 
  RefreshCw,
  AlertCircle
} from 'lucide-react';
import { CategoryId, TeachingIdea, Category } from './types.ts';
import { fetchTeachingIdea } from './geminiService.ts';

const CATEGORIES: Category[] = [
  { id: CategoryId.ALL, label: 'الكل', description: 'أفكار متنوعة', color: 'bg-emerald-800' },
  { id: CategoryId.HIFZ, label: 'الحفظ', description: 'تثبيت الجديد', color: 'bg-green-700' },
  { id: CategoryId.REVIEW, label: 'المراجعة', description: 'ضبط الماضي', color: 'bg-teal-700' },
  { id: CategoryId.MOTIVATION, label: 'التحفيز', description: 'بث الحماس', color: 'bg-amber-600' },
  { id: CategoryId.MANAGEMENT, label: 'الإدارة', description: 'ضبط الحلقة', color: 'bg-rose-700' },
  { id: CategoryId.TAJWEED, label: 'التجويد', description: 'إتقان الأداء', color: 'bg-cyan-700' },
];

const App: React.FC = () => {
  const [activeCat, setActiveCat] = useState<CategoryId>(CategoryId.ALL);
  const [idea, setIdea] = useState<TeachingIdea | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isCopied, setIsCopied] = useState(false);

  const generateNewIdea = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await fetchTeachingIdea(activeCat);
      setIdea(result);
    } catch (err: any) {
      setError(err.message || 'فشل توليد الفكرة. حاول مرة أخرى.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = () => {
    if (!idea) return;
    const text = `🔹 ${idea.title}\n\n📝 الوصف: ${idea.description}\n\n✅ الخطوات:\n${idea.steps.map((s, i) => `${i+1}. ${s}`).join('\n')}\n\n💡 الفائدة: ${idea.benefit}`;
    navigator.clipboard.writeText(text);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  const getIcon = (id: CategoryId) => {
    switch(id) {
      case CategoryId.HIFZ: return <BookOpen className="w-5 h-5" />;
      case CategoryId.REVIEW: return <Target className="w-5 h-5" />;
      case CategoryId.MOTIVATION: return <Heart className="w-5 h-5" />;
      case CategoryId.MANAGEMENT: return <Settings className="w-5 h-5" />;
      case CategoryId.TAJWEED: return <Music className="w-5 h-5" />;
      default: return <Sparkles className="w-5 h-5" />;
    }
  };

  return (
    <div className="min-h-screen p-4 md:p-8 flex flex-col items-center">
      {/* Header */}
      <header className="w-full max-w-xl text-center mb-10">
        <div className="inline-block p-4 bg-emerald-100 rounded-full mb-4 float-anim">
          <Sparkles className="w-8 h-8 text-emerald-700" />
        </div>
        <h1 className="text-3xl font-black text-emerald-900 mb-2">مُعين المُعلم</h1>
        <p className="text-emerald-600 font-medium">ابتكار أساليب قرآنية تربوية بذكاء</p>
      </header>

      {/* Categories Selector */}
      <section className="w-full max-w-2xl mb-8">
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCat(cat.id)}
              className={`flex items-center gap-3 p-4 rounded-2xl transition-all border-2 ${
                activeCat === cat.id 
                ? 'bg-emerald-600 border-emerald-600 text-white shadow-lg scale-105' 
                : 'bg-white border-emerald-50 text-emerald-800 hover:border-emerald-200'
              }`}
            >
              <div className={`${activeCat === cat.id ? 'text-emerald-100' : 'text-emerald-500'}`}>
                {getIcon(cat.id)}
              </div>
              <span className="font-bold text-sm">{cat.label}</span>
            </button>
          ))}
        </div>
      </section>

      {/* Primary Action */}
      <button
        onClick={generateNewIdea}
        disabled={isLoading}
        className="w-full max-w-md py-5 bg-emerald-900 text-white rounded-[2rem] font-black text-xl flex items-center justify-center gap-4 shadow-xl hover:bg-emerald-800 active:scale-95 transition-all disabled:opacity-50 mb-10"
      >
        {isLoading ? (
          <>
            <RefreshCw className="w-6 h-6 animate-spin" />
            <span>جاري استحضار الفكرة...</span>
          </>
        ) : (
          <>
            <Lightbulb className="w-6 h-6 text-amber-400" />
            <span>ابتكر أسلوبًا جديدًا</span>
          </>
        )}
      </button>

      {/* Content Area */}
      <main className="w-full max-w-xl">
        {error && (
          <div className="bg-rose-50 border border-rose-100 p-6 rounded-3xl flex flex-col items-center text-center">
            <AlertCircle className="w-12 h-12 text-rose-500 mb-2" />
            <p className="text-rose-900 font-bold">{error}</p>
          </div>
        )}

        {idea && !isLoading && (
          <div className="glass-effect p-8 rounded-[2.5rem] shadow-2xl border-b-4 border-emerald-700 animate-in fade-in slide-in-from-bottom-5">
            <div className="flex justify-between items-center mb-6">
              <span className="px-4 py-1 bg-emerald-100 text-emerald-800 rounded-full text-xs font-black uppercase tracking-widest">
                {idea.category}
              </span>
              <button 
                onClick={handleCopy}
                className="p-2 hover:bg-emerald-50 rounded-xl transition-colors text-emerald-600"
                title="نسخ الفكرة"
              >
                {isCopied ? <Check className="w-5 h-5 text-green-600" /> : <Copy className="w-5 h-5" />}
              </button>
            </div>

            <h2 className="text-2xl font-black text-emerald-900 mb-4">{idea.title}</h2>
            <p className="text-emerald-700 mb-8 leading-relaxed font-medium">{idea.description}</p>

            <div className="space-y-4 mb-8">
              <h3 className="font-black text-sm text-emerald-500 uppercase flex items-center gap-2">
                <Target className="w-4 h-4" /> خطوات التطبيق
              </h3>
              {idea.steps.map((step, idx) => (
                <div key={idx} className="flex gap-4 items-start bg-emerald-50/50 p-4 rounded-2xl">
                  <span className="bg-emerald-700 text-white w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 text-xs font-bold">
                    {idx + 1}
                  </span>
                  <p className="text-emerald-900 text-sm font-bold">{step}</p>
                </div>
              ))}
            </div>

            <div className="bg-amber-50 p-5 rounded-2xl border border-amber-100">
              <h4 className="text-amber-700 text-xs font-black mb-1 uppercase">الأثر المرجو</h4>
              <p className="text-amber-900 font-bold text-sm italic">"{idea.benefit}"</p>
            </div>
          </div>
        )}

        {!idea && !isLoading && !error && (
          <div className="flex flex-col items-center opacity-40 py-20">
            <BookOpen className="w-20 h-20 text-emerald-200 mb-4" />
            <p className="font-bold text-emerald-900">اختر تصنيفًا وابدأ الابتكار</p>
          </div>
        )}
      </main>

      <footer className="mt-auto py-8 text-emerald-300 text-xs font-bold">
        مُعين | صُنع لخدمة أهل القرآن
      </footer>
    </div>
  );
};

export default App;

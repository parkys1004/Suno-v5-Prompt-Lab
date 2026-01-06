
import React, { useState, useEffect } from 'react';
import { generateSunoPrompt } from './services/gemini';
import { PromptResult, HistoryItem } from './types';
import ResultCard from './components/ResultCard';
import { 
  MusicalNoteIcon, 
  SparklesIcon, 
  ClockIcon,
  TrashIcon,
  ArrowRightIcon,
  MagnifyingGlassIcon
} from '@heroicons/react/24/outline';

const App: React.FC = () => {
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<PromptResult | null>(null);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem('suno_prompt_history');
    if (saved) setHistory(JSON.parse(saved));
  }, []);

  const handleGenerate = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!input.trim() || loading) return;

    setLoading(true);
    setError(null);
    try {
      const data = await generateSunoPrompt(input);
      setResult(data);
      
      const newHistoryItem: HistoryItem = {
        ...data,
        id: Math.random().toString(36).substr(2, 9),
        timestamp: Date.now()
      };
      
      const updatedHistory = [newHistoryItem, ...history].slice(0, 10);
      setHistory(updatedHistory);
      localStorage.setItem('suno_prompt_history', JSON.stringify(updatedHistory));
      setInput('');
    } catch (err) {
      setError('AI가 응답을 생성하는 도중 오류가 발생했습니다. 다시 시도해 주세요.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const clearHistory = () => {
    setHistory([]);
    localStorage.removeItem('suno_prompt_history');
  };

  const loadFromHistory = (item: HistoryItem) => {
    setResult(item);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen pb-20">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-slate-900/80 backdrop-blur-md border-b border-slate-800">
        <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/20">
              <MusicalNoteIcon className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400">
              Suno v5 Prompt Lab
            </h1>
          </div>
          <div className="hidden md:flex items-center gap-6 text-sm text-slate-400">
            <span className="hover:text-white cursor-default transition-colors">Style Generator</span>
            <span className="hover:text-white cursor-default transition-colors">Lyrics Assistant</span>
            <span className="hover:text-white cursor-default transition-colors">Pro Mode</span>
          </div>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 pt-12">
        {/* Intro */}
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-black text-white mb-4 tracking-tight">
            Perfect Your Sound.
          </h2>
          <p className="text-slate-400 text-lg">
            Suno v5를 위한 최적의 스타일과 가사를 생성하세요.<br/> 
            아이디어만 입력하면 AI가 마법을 부립니다.
          </p>
        </div>

        {/* Input Form */}
        <form onSubmit={handleGenerate} className="relative mb-12">
          <div className="relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl blur opacity-25 group-hover:opacity-40 transition duration-1000 group-hover:duration-200"></div>
            <div className="relative flex flex-col md:flex-row gap-3 bg-slate-900 p-3 rounded-2xl border border-slate-700">
              <div className="flex-1 flex items-center px-4">
                <MagnifyingGlassIcon className="w-5 h-5 text-slate-500 mr-3" />
                <input 
                  type="text" 
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="예: 90년대 한국 시티팝 느낌의 감성적인 노래"
                  className="w-full bg-transparent border-none text-white focus:ring-0 placeholder-slate-500 text-lg"
                />
              </div>
              <button 
                type="submit"
                disabled={loading || !input.trim()}
                className="bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed text-white px-8 py-4 rounded-xl font-bold flex items-center justify-center gap-2 transition-all shadow-lg shadow-indigo-500/20"
              >
                {loading ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                ) : (
                  <>
                    <SparklesIcon className="w-5 h-5" />
                    <span>생성하기</span>
                  </>
                )}
              </button>
            </div>
          </div>
          {error && <p className="mt-3 text-red-400 text-sm text-center">{error}</p>}
        </form>

        {/* Result Area */}
        {result ? (
          <div className="mb-16">
            <ResultCard result={result} />
          </div>
        ) : !loading && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-16">
            <div className="p-6 rounded-2xl bg-slate-800/30 border border-slate-700/50">
              <div className="w-10 h-10 bg-blue-500/10 rounded-lg flex items-center justify-center mb-4">
                <SparklesIcon className="w-6 h-6 text-blue-400" />
              </div>
              <h3 className="text-white font-bold mb-2">스마트 스타일 태깅</h3>
              <p className="text-slate-400 text-sm">Suno v5 알고리즘에 최적화된 장르, 악기, 분위기 태그를 조합하여 생성합니다.</p>
            </div>
            <div className="p-6 rounded-2xl bg-slate-800/30 border border-slate-700/50">
              <div className="w-10 h-10 bg-purple-500/10 rounded-lg flex items-center justify-center mb-4">
                <ArrowRightIcon className="w-6 h-6 text-purple-400" />
              </div>
              <h3 className="text-white font-bold mb-2">구조적 가사 생성</h3>
              <p className="text-slate-400 text-sm">[Verse], [Chorus] 등 Suno 전용 마커가 포함된 구조화된 가사를 제공합니다.</p>
            </div>
          </div>
        )}

        {/* History Area */}
        {history.length > 0 && (
          <div className="space-y-4">
            <div className="flex items-center justify-between px-2">
              <div className="flex items-center gap-2 text-slate-300">
                <ClockIcon className="w-5 h-5" />
                <h3 className="font-bold">최근 실험 기록</h3>
              </div>
              <button 
                onClick={clearHistory}
                className="text-slate-500 hover:text-red-400 transition-colors flex items-center gap-1 text-sm"
              >
                <TrashIcon className="w-4 h-4" />
                전체 삭제
              </button>
            </div>
            <div className="space-y-3">
              {history.map((item) => (
                <button
                  key={item.id}
                  onClick={() => loadFromHistory(item)}
                  className="w-full text-left p-4 rounded-xl bg-slate-800/40 border border-slate-700/50 hover:bg-slate-700/40 hover:border-slate-600 transition-all flex justify-between items-center group"
                >
                  <div>
                    <h4 className="text-white font-medium mb-1 group-hover:text-indigo-300 transition-colors">
                      {item.title}
                    </h4>
                    <p className="text-slate-500 text-xs truncate max-w-md">
                      {item.style}
                    </p>
                  </div>
                  <div className="text-slate-600 text-xs whitespace-nowrap">
                    {new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}
      </main>

      {/* Footer / Floating CTA */}
      <footer className="fixed bottom-0 left-0 right-0 p-4 pointer-events-none">
        <div className="max-w-3xl mx-auto flex justify-end pointer-events-auto">
          <div className="bg-slate-900/90 backdrop-blur border border-slate-700 px-4 py-2 rounded-full text-xs text-slate-500 flex items-center gap-3 shadow-2xl">
            <span>Powered by Gemini 3 Pro</span>
            <div className="w-1 h-1 bg-slate-700 rounded-full"></div>
            <span>Optimized for Suno v5</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;

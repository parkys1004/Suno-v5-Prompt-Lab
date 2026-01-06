
import React, { useState, useEffect } from 'react';
import { generateSunoPrompt } from './services/gemini';
import { PromptResult, HistoryItem } from './types';
import ResultCard from './components/ResultCard';
import { GENRE_DATA } from './constants/genres';
import { 
  MusicalNoteIcon, 
  SparklesIcon, 
  ClockIcon,
  TrashIcon,
  ArrowRightIcon,
  MagnifyingGlassIcon,
  TagIcon
} from '@heroicons/react/24/outline';

const App: React.FC = () => {
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<PromptResult | null>(null);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [activeGenre, setActiveGenre] = useState(GENRE_DATA[0].id);

  useEffect(() => {
    const saved = localStorage.getItem('suno_prompt_history');
    if (saved) setHistory(JSON.parse(saved));
  }, []);

  const handleGenerate = async (e?: React.FormEvent, customInput?: string) => {
    e?.preventDefault();
    const targetInput = customInput || input;
    if (!targetInput.trim() || loading) return;

    setLoading(true);
    setError(null);
    try {
      const data = await generateSunoPrompt(targetInput);
      setResult(data);
      
      const newHistoryItem: HistoryItem = {
        ...data,
        id: Math.random().toString(36).substr(2, 9),
        timestamp: Date.now()
      };
      
      const updatedHistory = [newHistoryItem, ...history].slice(0, 10);
      setHistory(updatedHistory);
      localStorage.setItem('suno_prompt_history', JSON.stringify(updatedHistory));
      if (!customInput) setInput('');
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

  const currentGenre = GENRE_DATA.find(g => g.id === activeGenre);

  return (
    <div className="min-h-screen pb-20 bg-[#0f172a]">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-slate-900/80 backdrop-blur-md border-b border-slate-800">
        <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => setResult(null)}>
            <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/20">
              <MusicalNoteIcon className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400">
              Suno v5 Prompt Lab
            </h1>
          </div>
          <div className="hidden md:flex items-center gap-6 text-sm text-slate-400">
            <span className="hover:text-white cursor-pointer transition-colors">Style Lab</span>
            <span className="hover:text-white cursor-pointer transition-colors">Lyrics AI</span>
            <span className="px-3 py-1 bg-indigo-500/10 text-indigo-400 rounded-full border border-indigo-500/20">v5 Optimized</span>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 pt-12">
        {/* Intro */}
        <div className="text-center mb-10">
          <h2 className="text-4xl md:text-5xl font-black text-white mb-4 tracking-tight">
            Perfect Your Sound.
          </h2>
          <p className="text-slate-400 text-lg">
            Suno v5를 위한 마스터 프롬프트를 생성하세요.
          </p>
        </div>

        {/* Input Form */}
        <form onSubmit={(e) => handleGenerate(e)} className="relative mb-16">
          <div className="relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl blur opacity-25 group-hover:opacity-40 transition duration-1000 group-hover:duration-200"></div>
            <div className="relative flex flex-col md:flex-row gap-3 bg-slate-900 p-3 rounded-2xl border border-slate-700">
              <div className="flex-1 flex items-center px-4">
                <MagnifyingGlassIcon className="w-5 h-5 text-slate-500 mr-3" />
                <input 
                  type="text" 
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="아이디어를 입력하세요 (예: 비오는 날 듣기 좋은 시티팝)"
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
                    <span>생성</span>
                  </>
                )}
              </button>
            </div>
          </div>
          {error && <p className="mt-3 text-red-400 text-sm text-center font-medium">{error}</p>}
        </form>

        {/* Genre Explorer */}
        <div className="mb-16">
          <div className="flex items-center gap-2 mb-6 px-1">
            <TagIcon className="w-5 h-5 text-indigo-400" />
            <h3 className="text-lg font-bold text-white">장르별 마스터 프롬프트</h3>
          </div>
          
          <div className="flex flex-wrap gap-2 mb-8">
            {GENRE_DATA.map((genre) => (
              <button
                key={genre.id}
                onClick={() => setActiveGenre(genre.id)}
                className={`px-5 py-2.5 rounded-full text-sm font-semibold transition-all border ${
                  activeGenre === genre.id 
                  ? `bg-gradient-to-r ${genre.color} text-white border-transparent shadow-lg` 
                  : 'bg-slate-800/50 text-slate-400 border-slate-700 hover:border-slate-500'
                }`}
              >
                <span className="mr-2">{genre.icon}</span>
                {genre.name}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 animate-in fade-in slide-in-from-bottom-2 duration-500">
            {currentGenre?.prompts.map((prompt, idx) => (
              <button
                key={idx}
                onClick={() => handleGenerate(undefined, prompt)}
                className="group text-left p-4 rounded-xl bg-slate-800/30 border border-slate-700/50 hover:bg-slate-700/40 hover:border-indigo-500/50 transition-all flex items-start justify-between gap-4"
              >
                <span className="text-slate-300 text-sm font-medium line-clamp-2 leading-relaxed">
                  {prompt}
                </span>
                <ArrowRightIcon className="w-4 h-4 text-slate-600 group-hover:text-indigo-400 mt-1 flex-shrink-0 transition-colors" />
              </button>
            ))}
          </div>
        </div>

        {/* Result Area */}
        {result && (
          <div className="mb-16 scroll-mt-24" id="result-view">
            <ResultCard result={result} />
          </div>
        )}

        {/* History Area */}
        {history.length > 0 && (
          <div className="space-y-4 pt-10 border-t border-slate-800">
            <div className="flex items-center justify-between px-2">
              <div className="flex items-center gap-2 text-slate-300">
                <ClockIcon className="w-5 h-5" />
                <h3 className="font-bold">최근 생성 내역</h3>
              </div>
              <button 
                onClick={clearHistory}
                className="text-slate-500 hover:text-red-400 transition-colors flex items-center gap-1 text-sm"
              >
                <TrashIcon className="w-4 h-4" />
                기록 삭제
              </button>
            </div>
            <div className="grid grid-cols-1 gap-3">
              {history.map((item) => (
                <button
                  key={item.id}
                  onClick={() => loadFromHistory(item)}
                  className="w-full text-left p-4 rounded-xl bg-slate-800/20 border border-slate-700/30 hover:bg-slate-700/30 hover:border-slate-600 transition-all flex justify-between items-center group"
                >
                  <div className="flex-1 min-w-0">
                    <h4 className="text-white font-medium mb-0.5 group-hover:text-indigo-300 transition-colors truncate">
                      {item.title}
                    </h4>
                    <p className="text-slate-500 text-xs truncate">
                      {item.style}
                    </p>
                  </div>
                  <div className="ml-4 text-slate-600 text-xs font-mono">
                    {new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="mt-20 border-t border-slate-800/50 py-10 text-center">
        <p className="text-slate-500 text-sm">
          Suno v5 Prompt Lab © 2024 • Powered by Gemini 3 Pro
        </p>
      </footer>
    </div>
  );
};

export default App;

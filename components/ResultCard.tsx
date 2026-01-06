
import React, { useState } from 'react';
import { PromptResult } from '../types';
import { ClipboardDocumentIcon, CheckIcon } from '@heroicons/react/24/outline';

interface ResultCardProps {
  result: PromptResult;
}

const ResultCard: React.FC<ResultCardProps> = ({ result }) => {
  const [copied, setCopied] = useState<string | null>(null);

  const copyToClipboard = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopied(key);
    setTimeout(() => setCopied(null), 2000);
  };

  return (
    <div className="bg-slate-800/50 border border-slate-700 rounded-2xl p-6 shadow-xl backdrop-blur-sm animate-in fade-in duration-500">
      <div className="flex justify-between items-start mb-6">
        <div>
          <h2 className="text-2xl font-bold text-white mb-1">{result.title}</h2>
          <p className="text-indigo-400 font-medium">{result.vibe}</p>
        </div>
        <div className="flex gap-2">
          {result.tags.map(tag => (
            <span key={tag} className="px-3 py-1 bg-slate-700 text-slate-300 rounded-full text-xs font-medium">
              #{tag}
            </span>
          ))}
        </div>
      </div>

      <div className="space-y-6">
        <section>
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider">Style Prompt</h3>
            <button 
              onClick={() => copyToClipboard(result.style, 'style')}
              className="text-slate-400 hover:text-white transition-colors flex items-center gap-1 text-xs"
            >
              {copied === 'style' ? <CheckIcon className="w-4 h-4 text-green-400" /> : <ClipboardDocumentIcon className="w-4 h-4" />}
              {copied === 'style' ? 'Copied' : 'Copy Style'}
            </button>
          </div>
          <div className="bg-slate-900 rounded-xl p-4 mono text-indigo-300 text-sm border border-slate-700/50 leading-relaxed">
            {result.style}
          </div>
        </section>

        <section>
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider">Lyrics</h3>
            <button 
              onClick={() => copyToClipboard(result.lyrics, 'lyrics')}
              className="text-slate-400 hover:text-white transition-colors flex items-center gap-1 text-xs"
            >
              {copied === 'lyrics' ? <CheckIcon className="w-4 h-4 text-green-400" /> : <ClipboardDocumentIcon className="w-4 h-4" />}
              {copied === 'lyrics' ? 'Copied' : 'Copy Lyrics'}
            </button>
          </div>
          <div className="bg-slate-900 rounded-xl p-4 mono text-slate-300 text-sm border border-slate-700/50 whitespace-pre-wrap leading-relaxed max-h-[400px] overflow-y-auto">
            {result.lyrics}
          </div>
        </section>
      </div>
    </div>
  );
};

// Re-export icons since we used them
import { ClipboardDocumentIcon as Clipboard, CheckIcon as Check } from '@heroicons/react/24/outline';
export default ResultCard;

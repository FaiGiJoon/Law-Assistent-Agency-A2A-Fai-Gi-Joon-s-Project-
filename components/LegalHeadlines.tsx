import React from 'react';
import { useTranslations, Language } from '../lib/i18n';

interface Headline {
  title: string;
  prompt: string;
}

const NewspaperIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3 flex-shrink-0 text-slate-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 22h16a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2z"></path>
        <path d="M4 9h16"></path>
        <path d="M4 15h16"></path>
        <path d="M10 3v18"></path>
    </svg>
);

const getHeadlines = (t: any): Headline[] => [
  {
    title: t.headline1Title,
    prompt: t.headline1Prompt,
  },
  {
    title: t.headline2Title,
    prompt: t.headline2Prompt,
  },
  {
    title: t.headline3Title,
    prompt: t.headline3Prompt,
  },
];

interface LegalHeadlinesProps {
  onPromptClick: (prompt: string) => void;
  lang: Language;
}

const LegalHeadlines: React.FC<LegalHeadlinesProps> = ({ onPromptClick, lang }) => {
  const t = useTranslations(lang);
  const headlines = getHeadlines(t);

  return (
    <div className="max-w-2xl mx-auto">
      <h3 className="text-center text-slate-500 mb-4 text-xs font-bold uppercase tracking-widest">
        {t.headlinesTitle}
      </h3>
      <div className="space-y-3">
        {headlines.map((headline, index) => (
          <button
            key={index}
            onClick={() => onPromptClick(headline.prompt)}
            className="w-full glass-card p-4 rounded-2xl text-left flex items-center hover:bg-white/5 transition-all duration-300 group focus:outline-none focus:ring-2 focus:ring-violet-500"
            aria-label={`Ask about ${headline.title}`}
          >
            <div className="bg-violet-500/10 p-2 rounded-xl mr-4 group-hover:bg-violet-500/20 transition-colors">
                <NewspaperIcon />
            </div>
            <span className="text-slate-200 text-sm font-medium">{headline.title}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default LegalHeadlines;
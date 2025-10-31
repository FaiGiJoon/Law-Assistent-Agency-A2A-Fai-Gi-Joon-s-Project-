import React from 'react';
import { useTranslations, Language } from '../lib/i18n';

interface PromptSuggestion {
  title: string;
  prompt: string;
  icon: React.ReactElement;
}

const CarAccidentIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 mb-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.5 18.5l-1.5-6.5h8l-1.5 6.5" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h8" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12H6m12 0h1.5" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M7 12V9.5a2.5 2.5 0 012.5-2.5h5A2.5 2.5 0 0117 9.5V12" />
        <circle cx="8" cy="18" r="1.5" />
        <circle cx="16" cy="18" r="1.5" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M19 8l-2-2m2 2l-2 2" />
    </svg>
);

const FamilyCourtIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 mb-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M7 21v-4a2 2 0 012-2h6a2 2 0 012 2v4" />
        <circle cx="12" cy="7" r="3" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 21v-2a2 2 0 012-2h1" />
        <circle cx="6" cy="9" r="2" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M21 21v-2a2 2 0 00-2-2h-1" />
        <circle cx="18" cy="9" r="2" />
    </svg>
);

const getSuggestions = (t: any): PromptSuggestion[] => [
  {
    title: t.suggestion1Title,
    prompt: t.suggestion1Prompt,
    icon: <CarAccidentIcon />,
  },
  {
    title: t.suggestion2Title,
    prompt: t.suggestion2Prompt,
    icon: <FamilyCourtIcon />,
  },
];

interface PromptSuggestionsProps {
  onPromptClick: (prompt: string) => void;
  lang: Language;
}

const PromptSuggestions: React.FC<PromptSuggestionsProps> = ({ onPromptClick, lang }) => {
  const t = useTranslations(lang);
  const suggestions = getSuggestions(t);

  return (
    <div>
        <h3 className="text-center text-slate-400 mb-4 text-sm font-medium">{t.suggestionsTitle}</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl mx-auto">
            {suggestions.map((suggestion, index) => (
                <button
                    key={index}
                    onClick={() => onPromptClick(suggestion.prompt)}
                    className="bg-slate-700/60 p-4 rounded-lg text-left hover:bg-slate-600/80 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 focus:ring-offset-slate-900"
                    aria-label={`Start conversation about ${suggestion.title}`}
                >
                    <div className="flex flex-col items-center text-center">
                        <div className="text-emerald-400">{suggestion.icon}</div>
                        <p className="font-semibold text-slate-200">{suggestion.title}</p>
                    </div>
                </button>
            ))}
        </div>
    </div>
  );
};

export default PromptSuggestions;
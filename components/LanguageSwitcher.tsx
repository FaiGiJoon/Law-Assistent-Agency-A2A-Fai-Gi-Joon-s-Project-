import React from 'react';
import { Language } from '../lib/i18n';

interface LanguageSwitcherProps {
  currentLang: Language;
  onLangChange: (lang: Language) => void;
}

const LanguageSwitcher: React.FC<LanguageSwitcherProps> = ({ currentLang, onLangChange }) => {
  const languages: { code: Language; name: string }[] = [
    { code: 'en', name: 'English' },
    { code: 'nl', name: 'Nederlands' },
  ];

  return (
    <div className="flex justify-center items-center space-x-2">
      {languages.map(({ code, name }) => {
        const isActive = currentLang === code;
        return (
          <button
            key={code}
            onClick={() => onLangChange(code)}
            className={`px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:ring-offset-2 focus:ring-offset-[#050505] ${
              isActive
                ? 'accent-gradient text-white shadow-lg shadow-violet-500/20 cursor-default'
                : 'bg-white/5 text-slate-400 hover:bg-white/10 hover:text-white'
            }`}
            disabled={isActive}
            aria-pressed={isActive}
          >
            {name}
          </button>
        );
      })}
    </div>
  );
};

export default LanguageSwitcher;
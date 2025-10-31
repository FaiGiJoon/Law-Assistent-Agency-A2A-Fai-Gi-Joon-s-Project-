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
            className={`px-4 py-2 rounded-md text-sm font-semibold transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 focus:ring-offset-slate-900 ${
              isActive
                ? 'bg-emerald-600 text-white cursor-default'
                : 'bg-slate-700/60 text-slate-300 hover:bg-slate-600/80'
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
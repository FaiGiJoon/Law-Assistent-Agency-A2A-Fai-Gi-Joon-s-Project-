import React from 'react';
import { useTranslations, Language } from '../lib/i18n';

const LawBookIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-violet-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path>
        <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path>
    </svg>
);

const BackIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
    </svg>
);


interface HeaderProps {
    onBookAppointmentClick: () => void;
    lang: Language;
    hasMessages: boolean;
    onResetChat: () => void;
}

const Header: React.FC<HeaderProps> = ({ onBookAppointmentClick, lang, hasMessages, onResetChat }) => {
    const t = useTranslations(lang);

    return (
        <header className="bg-[#050505]/80 backdrop-blur-xl border-b border-white/5 p-4 z-20 sticky top-0">
            <div className="container mx-auto flex items-center justify-between">
                <div className="flex items-center">
                    {hasMessages && (
                         <button 
                            onClick={onResetChat}
                            className="text-slate-300 hover:text-white transition-colors mr-3 p-1 rounded-full hover:bg-white/5 focus:outline-none focus:ring-2 focus:ring-violet-500"
                            aria-label={t.mainMenu}
                        >
                            <BackIcon />
                        </button>
                    )}
                    <LawBookIcon />
                    <h1 className="text-xl md:text-2xl font-bold text-white ml-3 tracking-tight">
                        {t.headerTitle} <span className="gradient-text">{t.headerSubtitle}</span>
                    </h1>
                </div>
                <button
                    onClick={onBookAppointmentClick}
                    className="accent-gradient text-white px-5 py-2.5 rounded-full text-sm font-semibold hover:opacity-90 transition-all duration-200 shadow-lg shadow-violet-500/20 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:ring-offset-2 focus:ring-offset-black"
                >
                    {t.bookAppointment}
                </button>
            </div>
        </header>
    );
};

export default Header;
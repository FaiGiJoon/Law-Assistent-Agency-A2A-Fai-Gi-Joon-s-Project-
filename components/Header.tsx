import React from 'react';
import { useTranslations, Language } from '../lib/i18n';

const LawBookIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-emerald-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path>
        <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path>
    </svg>
);

interface HeaderProps {
    onBookAppointmentClick: () => void;
    lang: Language;
}

const Header: React.FC<HeaderProps> = ({ onBookAppointmentClick, lang }) => {
    const t = useTranslations(lang);

    return (
        <header className="bg-slate-900/70 backdrop-blur-md border-b border-slate-700 p-4 shadow-lg z-20">
            <div className="container mx-auto flex items-center justify-between">
                <div className="flex items-center">
                    <LawBookIcon />
                    <h1 className="text-xl md:text-2xl font-bold text-slate-100 ml-3 tracking-wide">
                        {t.headerTitle} <span className="text-emerald-400">{t.headerSubtitle}</span>
                    </h1>
                </div>
                <button
                    onClick={onBookAppointmentClick}
                    className="bg-emerald-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-emerald-500 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 focus:ring-offset-slate-900"
                >
                    {t.bookAppointment}
                </button>
            </div>
        </header>
    );
};

export default Header;
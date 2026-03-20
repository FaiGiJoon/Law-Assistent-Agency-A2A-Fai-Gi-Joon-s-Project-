
import React from 'react';
import { useTranslations, Language } from '../lib/i18n';

interface FooterProps {
    lang: Language;
}

const Footer: React.FC<FooterProps> = ({ lang }) => {
    const t = useTranslations(lang);
    return (
        <footer className="bg-[#050505]/80 backdrop-blur-xl border-t border-white/5 p-4 text-center z-20">
            <p className="text-xs text-slate-500 max-w-2xl mx-auto leading-relaxed">
                {t.footerDisclaimer}
            </p>
        </footer>
    );
};

export default Footer;
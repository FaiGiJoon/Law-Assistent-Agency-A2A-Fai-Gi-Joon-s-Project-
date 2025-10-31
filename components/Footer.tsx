
import React from 'react';
import { useTranslations, Language } from '../lib/i18n';

interface FooterProps {
    lang: Language;
}

const Footer: React.FC<FooterProps> = ({ lang }) => {
    const t = useTranslations(lang);
    return (
        <footer className="bg-slate-900/70 backdrop-blur-md border-t border-slate-700 p-3 text-center z-20">
            <p className="text-xs text-slate-400">
                {t.footerDisclaimer}
            </p>
        </footer>
    );
};

export default Footer;
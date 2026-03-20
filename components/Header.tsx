import React from 'react';
import { useTranslations, Language } from '../lib/i18n';
import LanguageSwitcher from './LanguageSwitcher';
import { jsPDF } from 'jspdf';
import { ChatMessage, MessageRole } from '../types';

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

const DownloadIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
        <polyline points="7 10 12 15 17 10"></polyline>
        <line x1="12" y1="15" x2="12" y2="3"></line>
    </svg>
);

interface HeaderProps {
    lang: Language;
    setLang: (lang: Language) => void;
    hasMessages: boolean;
    onResetChat: () => void;
    messages: ChatMessage[];
}

const Header: React.FC<HeaderProps> = ({ lang, setLang, hasMessages, onResetChat, messages }) => {
    const t = useTranslations(lang);

    const downloadPdf = () => {
        const doc = new jsPDF();
        const pageWidth = doc.internal.pageSize.getWidth();
        const pageHeight = doc.internal.pageSize.getHeight();
        const margin = 20;
        const contentWidth = pageWidth - 2 * margin;
        let yPos = margin;

        const cleanText = (text: string) => {
            return text
                .replace(/[\u{1F600}-\u{1F64F}\u{1F300}-\u{1F5FF}\u{1F680}-\u{1F6FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]/gu, "") // Remove emojis
                .replace(/\*\*/g, "") // Remove bold markdown
                .replace(/###/g, "") // Remove header markdown
                .replace(/#/g, "") // Remove other header markdown
                .replace(/\[ \]/g, "- [ ]") // Format unchecked
                .replace(/\[x\]/g, "- [x]") // Format checked
                .trim();
        };

        const addHeader = () => {
            doc.setFontSize(22);
            doc.setFont("helvetica", "bold");
            doc.setTextColor(79, 70, 229); // Indigo-600
            doc.text(t.headerTitle, margin, yPos);
            
            yPos += 8;
            doc.setFontSize(12);
            doc.setFont("helvetica", "normal");
            doc.setTextColor(147, 51, 234); // Purple-600
            doc.text(t.headerSubtitle, margin, yPos);
            
            yPos += 6;
            doc.setDrawColor(226, 232, 240); // Slate-200
            doc.line(margin, yPos, pageWidth - margin, yPos);
            yPos += 15;
        };

        const addFooter = (pageNum: number) => {
            doc.setFontSize(8);
            doc.setTextColor(148, 163, 184); // Slate-400
            
            // Copyright and Credits
            const copyrightText = "© Casper Klootwijk | Made with Gemini by Casper";
            doc.text(copyrightText, margin, pageHeight - 15);
            
            doc.text(`Page ${pageNum}`, pageWidth / 2, pageHeight - 10, { align: "center" });
            doc.text(`Netherlands Legal Navigator - ${new Date().toLocaleDateString()}`, pageWidth - margin, pageHeight - 10, { align: "right" });
        };

        addHeader();
        let currentPage = 1;

        messages.forEach((msg, index) => {
            const isUser = msg.role === MessageRole.USER;
            const roleLabel = isUser ? "USER" : "LEGAL ASSISTANT";
            
            // Role Label
            doc.setFontSize(9);
            doc.setFont("helvetica", "bold");
            doc.setTextColor(isUser ? 71 : 99, isUser ? 85 : 102, isUser ? 105 : 241); // Slate-600 or Violet-500
            
            if (yPos > pageHeight - 40) {
                addFooter(currentPage);
                doc.addPage();
                currentPage++;
                yPos = margin;
                addHeader();
            }

            doc.text(roleLabel, margin, yPos);
            yPos += 6;

            // Content
            doc.setFont("helvetica", "normal");
            doc.setFontSize(10);
            doc.setTextColor(30, 41, 59); // Slate-800
            
            const cleanedContent = cleanText(msg.content);
            const splitText = doc.splitTextToSize(cleanedContent, contentWidth);
            
            // Add a left border for AI responses
            if (!isUser) {
                doc.setDrawColor(99, 102, 241); // Violet-500
                doc.setLineWidth(1);
                doc.line(margin - 5, yPos - 4, margin - 5, yPos + splitText.length * 5);
            }

            // Check if content fits, otherwise add page
            if (yPos + splitText.length * 5 > pageHeight - 20) {
                addFooter(currentPage);
                doc.addPage();
                currentPage++;
                yPos = margin;
                addHeader();
                // Re-draw role label on new page if it was split
                doc.setFontSize(9);
                doc.setFont("helvetica", "bold");
                doc.setTextColor(isUser ? 71 : 99, isUser ? 85 : 102, isUser ? 105 : 241);
                doc.text(roleLabel + " (continued)", margin, yPos);
                yPos += 6;
                doc.setFont("helvetica", "normal");
                doc.setFontSize(10);
                doc.setTextColor(30, 41, 59);
            }

            doc.text(splitText, margin, yPos);
            yPos += splitText.length * 5 + 12;
        });

        addFooter(currentPage);
        doc.save("Dutch-Law-AI-Summary.pdf");
    };

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
                <div className="flex items-center space-x-4">
                    {hasMessages && (
                        <button
                            onClick={downloadPdf}
                            className="flex items-center space-x-2 text-slate-300 hover:text-white transition-colors p-2 rounded-lg hover:bg-white/5 focus:outline-none focus:ring-2 focus:ring-violet-500"
                            title={t.downloadPdf}
                        >
                            <DownloadIcon />
                            <span className="hidden sm:inline text-sm font-medium">{t.downloadPdf}</span>
                        </button>
                    )}
                    <LanguageSwitcher currentLang={lang} onLangChange={setLang} />
                </div>
            </div>
        </header>
    );
};

export default Header;
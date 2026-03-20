import React, { useState, useEffect, useRef } from 'react';
import { useTranslations, Language } from '../lib/i18n';

interface PromptSuggestion {
  title: string;
  prompt: string;
  icon: React.ReactElement;
}

const ArrowLeftIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M19 12H5M12 19l-7-7 7-7"></path>
    </svg>
);

const ArrowRightIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M5 12h14M12 5l7 7-7 7"></path>
    </svg>
);

const CarAccidentIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
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
    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M7 21v-4a2 2 0 012-2h6a2 2 0 012 2v4" />
        <circle cx="12" cy="7" r="3" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 21v-2a2 2 0 012-2h1" />
        <circle cx="6" cy="9" r="2" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M21 21v-2a2 2 0 00-2-2h-1" />
        <circle cx="18" cy="9" r="2" />
    </svg>
);

const EmploymentIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect>
        <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path>
    </svg>
);

const RentalIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="7.5" cy="15.5" r="5.5" />
        <path d="M12 11.5L21 2.5" />
        <path d="M18 5.5L21.5 2" />
    </svg>
);

const BusinessIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M18 20V10H6v10"></path>
        <path d="M6 10l6-6 6 6"></path>
        <path d="M10 20v-5h4v5"></path>
    </svg>
);

const ConsumerRightsIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="9" cy="21" r="1"></circle>
        <circle cx="20" cy="21" r="1"></circle>
        <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
        <path d="M12 12l3.5 3.5L22 9"></path>
    </svg>
);

const ImmigrationIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <rect x="4" y="2" width="16" height="20" rx="2"></rect>
        <circle cx="12" cy="12" r="4"></circle>
        <path d="M12 2v20"></path>
    </svg>
);

const IntellectualPropertyIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M9 18h6" /><path d="M10 22h4" />
        <path d="M12 2a7 7 0 0 0-7 7c0 2.5 1 4.5 3 6h8c2-1.5 3-3.5 3-6a7 7 0 0 0-7-7z" />
        <circle cx="12" cy="12" r="2.5" />
    </svg>
);

const NoiseNuisanceIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
        <line x1="23" y1="9" x2="17" y2="15"></line>
        <line x1="17" y1="9" x2="23" y2="15"></line>
    </svg>
);

const DebtCollectionIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
        <polyline points="14 2 14 8 20 8"></polyline>
        <path d="M12 18v-6"></path><path d="M10 14h4"></path>
        <path d="M12 12h-1.5a1.5 1.5 0 0 0 0 3h1a1.5 1.5 0 0 1 0 3H10"></path>
    </svg>
);

const PrivacyIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
        <circle cx="12" cy="12" r="3"></circle>
        <line x1="2" y1="22" x2="22" y2="2"></line>
    </svg>
);

const WillIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20.9 14.1l-4.2-4.2c-1.2-1.2-3.1-1.2-4.2 0L2 20.3c-.4.4-.6 1-.6 1.7v0c0 1.1.9 2 2 2h1.7c.7 0 1.3-.2 1.7-.6L16.7 9.9c1.2-1.2 1.2-3.1 0-4.2z" />
        <path d="m15 5 6 6" />
    </svg>
);

const PrivacyAtWorkIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
        <path d="M12 8v4"></path>
        <path d="M12 16h.01"></path>
    </svg>
);

const SmallClaimsIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2v20"></path>
        <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
    </svg>
);

const EnergyIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"></path>
    </svg>
);

const TransportIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <rect x="7" y="5" width="10" height="12" rx="2"></rect>
        <path d="M7 13h10"></path>
        <path d="M9 17v2"></path>
        <path d="M15 17v2"></path>
    </svg>
);

const getSuggestions = (t: any): PromptSuggestion[] => [
  { title: t.suggestion1Title, prompt: t.suggestion1Prompt, icon: <CarAccidentIcon /> },
  { title: t.suggestion2Title, prompt: t.suggestion2Prompt, icon: <FamilyCourtIcon /> },
  { title: t.suggestion3Title, prompt: t.suggestion3Prompt, icon: <EmploymentIcon /> },
  { title: t.suggestion4Title, prompt: t.suggestion4Prompt, icon: <RentalIcon /> },
  { title: t.suggestion5Title, prompt: t.suggestion5Prompt, icon: <BusinessIcon /> },
  { title: t.suggestion6Title, prompt: t.suggestion6Prompt, icon: <ConsumerRightsIcon /> },
  { title: t.suggestion7Title, prompt: t.suggestion7Prompt, icon: <ImmigrationIcon /> },
  { title: t.suggestion8Title, prompt: t.suggestion8Prompt, icon: <IntellectualPropertyIcon /> },
  { title: t.suggestion9Title, prompt: t.suggestion9Prompt, icon: <NoiseNuisanceIcon /> },
  { title: t.suggestion10Title, prompt: t.suggestion10Prompt, icon: <DebtCollectionIcon /> },
  { title: t.suggestion11Title, prompt: t.suggestion11Prompt, icon: <PrivacyIcon /> },
  { title: t.suggestion12Title, prompt: t.suggestion12Prompt, icon: <WillIcon /> },
  { title: t.suggestion13Title, prompt: t.suggestion13Prompt, icon: <PrivacyAtWorkIcon /> },
  { title: t.suggestion14Title, prompt: t.suggestion14Prompt, icon: <SmallClaimsIcon /> },
  { title: t.suggestion15Title, prompt: t.suggestion15Prompt, icon: <EnergyIcon /> },
  { title: t.suggestion16Title, prompt: t.suggestion16Prompt, icon: <TransportIcon /> },
];

const shuffleArray = <T,>(array: T[]): T[] => {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
};

interface PromptSuggestionsProps {
  onPromptClick: (prompt: string) => void;
  lang: Language;
}

const PromptSuggestions: React.FC<PromptSuggestionsProps> = ({ onPromptClick, lang }) => {
  const t = useTranslations(lang);
  const [shuffledSuggestions, setShuffledSuggestions] = useState<PromptSuggestion[]>([]);
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const { scrollLeft, clientWidth } = scrollRef.current;
      const scrollTo = direction === 'left' ? scrollLeft - clientWidth / 2 : scrollLeft + clientWidth / 2;
      scrollRef.current.scrollTo({ left: scrollTo, behavior: 'smooth' });
    }
  };

  useEffect(() => {
    const allSuggestions = getSuggestions(t);
    // Shuffle the array and take the first 6 to display
    setShuffledSuggestions(shuffleArray(allSuggestions).slice(0, 6));
  }, [lang]);

  return (
    <div className="max-w-2xl mx-auto">
        <div className="flex items-center justify-between mb-4 px-2">
            <h3 className="text-slate-400 text-sm font-medium">{t.suggestionsTitle}</h3>
            <div className="flex space-x-2">
                <button 
                    onClick={() => scroll('left')}
                    className="p-1.5 rounded-full bg-white/5 hover:bg-white/10 text-slate-400 transition-colors focus:outline-none focus:ring-2 focus:ring-violet-500"
                    aria-label="Scroll suggestions left"
                >
                    <ArrowLeftIcon />
                </button>
                <button 
                    onClick={() => scroll('right')}
                    className="p-1.5 rounded-full bg-white/5 hover:bg-white/10 text-slate-400 transition-colors focus:outline-none focus:ring-2 focus:ring-violet-500"
                    aria-label="Scroll suggestions right"
                >
                    <ArrowRightIcon />
                </button>
            </div>
        </div>
        <div className="relative">
            <div 
                ref={scrollRef}
                className="flex items-stretch space-x-4 overflow-x-auto pb-4 no-scrollbar snap-x snap-mandatory" 
                style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            >
                {shuffledSuggestions.map((suggestion) => (
                    <button
                        key={suggestion.title}
                        onClick={() => onPromptClick(suggestion.prompt)}
                        className="glass-card p-4 rounded-2xl hover:bg-white/10 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:ring-offset-2 focus:ring-offset-[#050505] w-40 flex-shrink-0 group snap-center"
                        aria-label={`Start conversation about ${suggestion.title}`}
                    >
                        <div className="flex flex-col items-center text-center h-full">
                           <div className="text-violet-400 flex-shrink-0 group-hover:scale-110 transition-transform duration-300">{suggestion.icon}</div>
                           <p className="font-semibold text-slate-200 text-sm mt-3 flex-grow flex items-center justify-center">
                                 <span>{suggestion.title}</span>
                           </p>
                        </div>
                    </button>
                ))}
            </div>
        </div>
    </div>
  );
};

export default PromptSuggestions;
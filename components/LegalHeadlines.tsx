import React, { useRef } from 'react';
import { useTranslations, Language } from '../lib/i18n';

interface Agent {
  title: string;
  prompt: string;
  icon: React.ReactNode;
}

const CarIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="1" y="13" width="22" height="8" rx="2"></rect>
        <path d="M7 13V5a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v8"></path>
        <circle cx="7" cy="17" r="2"></circle>
        <circle cx="17" cy="17" r="2"></circle>
    </svg>
);

const HouseIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
        <polyline points="9 22 9 12 15 12 15 22"></polyline>
    </svg>
);

const DebtIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <line x1="12" y1="1" x2="12" y2="23"></line>
        <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
    </svg>
);

const ContractIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
        <polyline points="14 2 14 8 20 8"></polyline>
        <line x1="16" y1="13" x2="8" y2="13"></line>
        <line x1="16" y1="17" x2="8" y2="17"></line>
        <polyline points="10 9 9 9 8 9"></polyline>
    </svg>
);

const ConsumerIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="9" cy="21" r="1"></circle>
        <circle cx="20" cy="21" r="1"></circle>
        <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
    </svg>
);

const VisaIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22 12h-4l-3 9L9 3l-3 9H2"></path>
    </svg>
);

const TaxIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect>
        <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path>
    </svg>
);

const ArrowLeftIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M19 12H5M12 19l-7-7 7-7"></path>
    </svg>
);

const ArrowRightIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M5 12h14M12 5l7 7-7 7"></path>
    </svg>
);

const getAgents = (t: any): Agent[] => [
  {
    title: t.agent3Name,
    prompt: t.suggestion1Prompt,
    icon: <CarIcon />,
  },
  {
    title: t.agent4Name,
    prompt: t.suggestion4Prompt,
    icon: <HouseIcon />,
  },
  {
    title: t.agent5Name,
    prompt: t.suggestion10Prompt,
    icon: <DebtIcon />,
  },
  {
    title: t.agent6Name,
    prompt: t.suggestion3Prompt,
    icon: <ContractIcon />,
  },
  {
    title: t.agent7Name,
    prompt: t.suggestion6Prompt,
    icon: <ConsumerIcon />,
  },
  {
    title: t.agent8Name,
    prompt: t.suggestion7Prompt,
    icon: <VisaIcon />,
  },
  {
    title: t.agent9Name,
    prompt: t.suggestion5Prompt,
    icon: <TaxIcon />,
  },
];

interface LegalHeadlinesProps {
  onPromptClick: (prompt: string) => void;
  onAgentClick: (agentTitle: string, prompt: string) => void;
  lang: Language;
}

const LegalHeadlines: React.FC<LegalHeadlinesProps> = ({ onPromptClick, onAgentClick, lang }) => {
  const t = useTranslations(lang);
  const agents = getAgents(t);
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const { scrollLeft, clientWidth } = scrollRef.current;
      const scrollTo = direction === 'left' ? scrollLeft - clientWidth / 2 : scrollLeft + clientWidth / 2;
      scrollRef.current.scrollTo({ left: scrollTo, behavior: 'smooth' });
    }
  };

  return (
    <div className="w-full max-w-5xl mx-auto px-4">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-slate-500 text-xs font-bold uppercase tracking-widest">
          {t.headlinesTitle}
        </h3>
        <div className="flex space-x-2">
          <button 
            onClick={() => scroll('left')}
            className="p-2 rounded-full bg-white/5 hover:bg-white/10 text-slate-400 transition-colors focus:outline-none focus:ring-2 focus:ring-violet-500"
            aria-label="Scroll left"
          >
            <ArrowLeftIcon />
          </button>
          <button 
            onClick={() => scroll('right')}
            className="p-2 rounded-full bg-white/5 hover:bg-white/10 text-slate-400 transition-colors focus:outline-none focus:ring-2 focus:ring-violet-500"
            aria-label="Scroll right"
          >
            <ArrowRightIcon />
          </button>
        </div>
      </div>
      
      <div 
        ref={scrollRef}
        className="flex overflow-x-auto space-x-4 pb-6 scrollbar-hide snap-x snap-mandatory no-scrollbar"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {agents.map((agent, index) => (
          <button
            key={index}
            onClick={() => onAgentClick(agent.title, agent.prompt)}
            className="flex-shrink-0 w-64 glass-card p-6 rounded-3xl text-center flex flex-col items-center hover:bg-white/5 transition-all duration-300 group focus:outline-none focus:ring-2 focus:ring-violet-500 snap-center"
            aria-label={`Talk to ${agent.title}`}
          >
            <div className="bg-violet-500/10 p-4 rounded-2xl mb-4 text-violet-400 group-hover:bg-violet-500/20 transition-colors">
                {agent.icon}
            </div>
            <span className="text-slate-200 text-sm font-bold leading-tight">{agent.title}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default LegalHeadlines;
import React from 'react';

interface Headline {
  title: string;
  prompt: string;
}

const NewspaperIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3 flex-shrink-0 text-slate-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 22h16a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2z"></path>
        <path d="M4 9h16"></path>
        <path d="M4 15h16"></path>
        <path d="M10 3v18"></path>
    </svg>
);


const headlines: Headline[] = [
  {
    title: 'New Rental Laws in Amsterdam: What Tenants Need to Know',
    prompt: 'Can you explain the new rental laws for the private sector that were recently implemented in Amsterdam?',
  },
  {
    title: 'Rise in Online Scams: How to Protect Yourself Legally',
    prompt: 'What are my legal options in the Netherlands if I become a victim of an online scam?',
  },
  {
    title: "Debate on 'Box 3' Wealth Tax Continues: What's the Latest?",
    prompt: "What is the current status of the 'Box 3' wealth tax in the Netherlands and what are the proposed changes?",
  },
];

interface LegalHeadlinesProps {
  onPromptClick: (prompt: string) => void;
}

const LegalHeadlines: React.FC<LegalHeadlinesProps> = ({ onPromptClick }) => {
  return (
    <div className="max-w-2xl mx-auto">
      <h3 className="text-center text-slate-300 mb-4 text-sm font-semibold tracking-wide">
        Trending Legal Topics in The Netherlands
      </h3>
      <div className="space-y-3">
        {headlines.map((headline, index) => (
          <button
            key={index}
            onClick={() => onPromptClick(headline.prompt)}
            className="w-full bg-slate-800/50 p-3 rounded-lg text-left flex items-center hover:bg-slate-700/70 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 focus:ring-offset-slate-900"
            aria-label={`Ask about ${headline.title}`}
          >
            <NewspaperIcon />
            <span className="text-slate-200 text-sm">{headline.title}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default LegalHeadlines;
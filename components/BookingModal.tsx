import React, { useState, useEffect, useCallback } from 'react';
import type { VirtualAgent } from '../types';
import { useTranslations, Language } from '../lib/i18n';

interface BookingModalProps {
    isOpen: boolean;
    onClose: () => void;
    lang: Language;
}

type BookingStep = 'selection' | 'confirmation' | 'success';

const CarAccidentIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 mb-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.5 18.5l-1.5-6.5h8l-1.5 6.5" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h8" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12H6m12 0h1.5" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M7 12V9.5a2.5 2.5 0 012.5-2.5h5A2.5 2.5 0 0117 9.5V12" />
        <circle cx="8" cy="18" r="1.5" />
        <circle cx="16"cy="18" r="1.5" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M19 8l-2-2m2 2l-2 2" />
    </svg>
);

const FamilyCourtIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 mb-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M7 21v-4a2 2 0 012-2h6a2 2 0 012 2v4" />
        <circle cx="12" cy="7" r="3" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 21v-2a2 2 0 012-2h1" />
        <circle cx="6" cy="9" r="2" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M21 21v-2a2 2 0 00-2-2h-1" />
        <circle cx="18" cy="9" r="2" />
    </svg>
);

const CheckCircleIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-violet-400 mx-auto" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
        <polyline points="22 4 12 14.01 9 11.01"></polyline>
    </svg>
);

const getVirtualAgents = (t: any): VirtualAgent[] => [
    {
        id: 'car-health',
        name: t.agent1Name,
        description: t.agent1Desc,
        icon: <CarAccidentIcon />,
    },
    {
        id: 'family-court',
        name: t.agent2Name,
        description: t.agent2Desc,
        icon: <FamilyCourtIcon />,
    },
];

const BookingModal: React.FC<BookingModalProps> = ({ isOpen, onClose, lang }) => {
    const [step, setStep] = useState<BookingStep>('selection');
    const [selectedAgent, setSelectedAgent] = useState<VirtualAgent | null>(null);
    const t = useTranslations(lang);
    const VIRTUAL_AGENTS = getVirtualAgents(t);

    const handleClose = useCallback(() => {
        onClose();
        setTimeout(() => {
            setStep('selection');
            setSelectedAgent(null);
        }, 300);
    }, [onClose]);
    
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                handleClose();
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [handleClose]);


    if (!isOpen) return null;

    const handleAgentSelect = (agent: VirtualAgent) => {
        setSelectedAgent(agent);
        setStep('confirmation');
    };

    const handleConfirm = () => {
        setStep('success');
    };

    const renderContent = () => {
        switch (step) {
            case 'selection':
                return (
                    <>
                        <h2 className="text-3xl font-bold text-center text-white tracking-tight">{t.modalTitle}</h2>
                        <p className="text-slate-400 text-center mt-2 mb-8">{t.modalSubtitle}</p>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {VIRTUAL_AGENTS.map(agent => (
                                <button
                                    key={agent.id}
                                    onClick={() => handleAgentSelect(agent)}
                                    className="glass-card p-8 rounded-3xl text-center hover:bg-white/10 transition-all duration-300 group focus:outline-none focus:ring-2 focus:ring-violet-500"
                                >
                                    <div className="text-violet-400 flex justify-center group-hover:scale-110 transition-transform duration-300">{agent.icon}</div>
                                    <h3 className="font-bold text-white mt-4 text-lg">{agent.name}</h3>
                                    <p className="text-sm text-slate-400 mt-2 leading-relaxed">{agent.description}</p>
                                </button>
                            ))}
                        </div>
                    </>
                );
            case 'confirmation':
                if (!selectedAgent) return null;
                return (
                     <>
                        <h2 className="text-3xl font-bold text-center text-white tracking-tight">{t.confirmTitle}</h2>
                        <div className="glass-card p-8 rounded-3xl my-8 text-center">
                             <div className="text-violet-400 flex justify-center scale-110">{selectedAgent.icon}</div>
                             <h3 className="font-bold text-white mt-6 text-xl">{selectedAgent.name}</h3>
                             <p className="text-base text-slate-400 mt-2 leading-relaxed">{selectedAgent.description}</p>
                        </div>
                        <p className="text-slate-500 text-center text-sm max-w-sm mx-auto">{t.confirmNotice}</p>
                        <div className="flex justify-center space-x-4 mt-8">
                            <button onClick={() => setStep('selection')} className="bg-white/5 text-white px-8 py-3 rounded-2xl font-semibold hover:bg-white/10 transition-colors border border-white/10">{t.backButton}</button>
                            <button onClick={handleConfirm} className="accent-gradient text-white px-8 py-3 rounded-2xl font-semibold hover:opacity-90 transition-all shadow-lg shadow-violet-500/20">{t.confirmButton}</button>
                        </div>
                    </>
                );
             case 'success':
                return (
                    <div className="text-center py-8">
                        <CheckCircleIcon />
                        <h2 className="text-3xl font-bold text-center text-white mt-6 tracking-tight">{t.successTitle}</h2>
                        <p className="text-slate-400 mt-3 text-lg leading-relaxed">{t.successMessage.replace('{agentName}', selectedAgent?.name || '')}</p>
                        <p className="text-sm text-slate-500 mt-6">{t.successNotice}</p>
                        <button onClick={handleClose} className="mt-10 accent-gradient text-white px-10 py-4 rounded-2xl font-bold hover:opacity-90 transition-all shadow-xl shadow-violet-500/20">
                            {t.closeButton}
                        </button>
                    </div>
                );
        }
    }


    return (
        <div 
            className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center z-50 p-4"
            onClick={handleClose}
            role="dialog"
            aria-modal="true"
        >
            <div 
                className="bg-[#0b0b14] border border-white/5 rounded-[2.5rem] shadow-2xl p-10 w-full max-w-2xl relative overflow-hidden"
                onClick={e => e.stopPropagation()}
            >
                <div className="absolute top-0 left-0 w-full h-1 accent-gradient opacity-50"></div>
                {renderContent()}
                <button
                    onClick={handleClose}
                    className="absolute top-6 right-6 text-slate-500 hover:text-white transition-colors p-2 rounded-full hover:bg-white/5"
                    aria-label="Close"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
            </div>
        </div>
    );
};

export default BookingModal;
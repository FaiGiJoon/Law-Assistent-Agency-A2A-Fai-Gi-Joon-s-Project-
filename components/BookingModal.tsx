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
    <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-emerald-400 mx-auto" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
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
                        <h2 className="text-2xl font-bold text-center text-white">{t.modalTitle}</h2>
                        <p className="text-slate-400 text-center mt-2 mb-6">{t.modalSubtitle}</p>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {VIRTUAL_AGENTS.map(agent => (
                                <button
                                    key={agent.id}
                                    onClick={() => handleAgentSelect(agent)}
                                    className="bg-slate-700/60 p-6 rounded-lg text-center hover:bg-slate-600/80 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 focus:ring-offset-slate-900"
                                >
                                    <div className="text-emerald-400 flex justify-center">{agent.icon}</div>
                                    <h3 className="font-semibold text-slate-100 mt-2">{agent.name}</h3>
                                    <p className="text-xs text-slate-400 mt-1">{agent.description}</p>
                                </button>
                            ))}
                        </div>
                    </>
                );
            case 'confirmation':
                if (!selectedAgent) return null;
                return (
                     <>
                        <h2 className="text-2xl font-bold text-center text-white">{t.confirmTitle}</h2>
                        <div className="bg-slate-700/60 p-6 rounded-lg my-6 text-center">
                             <div className="text-emerald-400 flex justify-center">{selectedAgent.icon}</div>
                             <h3 className="font-semibold text-slate-100 mt-4 text-lg">{selectedAgent.name}</h3>
                             <p className="text-sm text-slate-400 mt-1">{selectedAgent.description}</p>
                        </div>
                        <p className="text-slate-400 text-center text-sm">{t.confirmNotice}</p>
                        <div className="flex justify-center space-x-4 mt-6">
                            <button onClick={() => setStep('selection')} className="bg-slate-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-slate-500 transition-colors">{t.backButton}</button>
                            <button onClick={handleConfirm} className="bg-emerald-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-emerald-500 transition-colors">{t.confirmButton}</button>
                        </div>
                    </>
                );
             case 'success':
                return (
                    <div className="text-center">
                        <CheckCircleIcon />
                        <h2 className="text-2xl font-bold text-center text-white mt-4">{t.successTitle}</h2>
                        <p className="text-slate-400 mt-2">{t.successMessage.replace('{agentName}', selectedAgent?.name || '')}</p>
                        <p className="text-xs text-slate-500 mt-4">{t.successNotice}</p>
                        <button onClick={handleClose} className="mt-6 bg-emerald-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-emerald-500 transition-colors">
                            {t.closeButton}
                        </button>
                    </div>
                );
        }
    }


    return (
        <div 
            className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            onClick={handleClose}
            role="dialog"
            aria-modal="true"
        >
            <div 
                className="bg-slate-800/80 border border-slate-700 rounded-2xl shadow-2xl p-8 w-full max-w-2xl"
                onClick={e => e.stopPropagation()}
            >
                {renderContent()}
                <button
                    onClick={handleClose}
                    className="absolute top-4 right-4 text-slate-500 hover:text-white transition-colors"
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
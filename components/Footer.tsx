
import React from 'react';

const Footer: React.FC = () => {
    return (
        <footer className="bg-slate-900/70 backdrop-blur-md border-t border-slate-700 p-3 text-center z-20">
            <p className="text-xs text-slate-400">
                This AI is for informational purposes only and does not constitute legal advice. 
                Always consult with a qualified professional for legal matters.
            </p>
        </footer>
    );
};

export default Footer;

import React from 'react';
import type { ChatMessage } from '../types';
import { MessageRole } from '../types';

const UserIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
        <circle cx="12" cy="7" r="4"></circle>
    </svg>
);

const BotIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-violet-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2L2 7l10 5 10-5-10-5z"></path>
        <path d="M2 17l10 5 10-5"></path>
        <path d="M2 12l10 5 10-5"></path>
    </svg>
);

const PlayIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polygon points="5 3 19 12 5 21 5 3"></polygon>
    </svg>
);

const StopIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="6" y="6" width="12" height="12"></rect>
    </svg>
);

const AudioLoadingSpinner = () => (
    <svg className="animate-spin h-4 w-4 text-violet-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
    </svg>
);

const SourceIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path>
        <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path>
    </svg>
);

const ThinkingIndicator: React.FC<{ lang: string }> = ({ lang }) => {
    const [step, setStep] = React.useState(0);
    const steps = lang === 'nl' 
        ? ["Analyseren van de vraag...", "Nederlandse wetgeving raadplegen...", "Bronnen verifiëren...", "Antwoord formuleren..."]
        : ["Analyzing query...", "Consulting Dutch statutes...", "Verifying sources...", "Formulating response..."];

    React.useEffect(() => {
        const interval = setInterval(() => {
            setStep((s) => (s + 1) % steps.length);
        }, 2000);
        return () => clearInterval(interval);
    }, [steps.length]);

    return (
        <div className="flex flex-col space-y-2">
            <div className="flex items-center space-x-2 text-violet-400">
                <div className="w-2 h-2 bg-violet-400 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                <div className="w-2 h-2 bg-violet-400 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                <div className="w-2 h-2 bg-violet-400 rounded-full animate-bounce"></div>
                <span className="text-xs font-medium ml-2 animate-pulse">{steps[step]}</span>
            </div>
        </div>
    );
};

// Basic markdown-to-HTML renderer to avoid external dependencies in this snippet.
const SimpleMarkdown: React.FC<{ content: string }> = ({ content }) => {
    const formattedContent = content
        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
        .replace(/\*(.*?)\*/g, '<em>$1</em>')
        .replace(/`([^`]+)`/g, '<code class="bg-slate-800/50 text-violet-300 px-1 py-0.5 rounded text-sm">$1</code>')
        .replace(/(\n\s*-\s)/g, '<br/>&bull;&nbsp;')
        .replace(/\n/g, '<br />');

    return <div dangerouslySetInnerHTML={{ __html: formattedContent }} />;
};

interface AudioPlayerProps {
    messageId: string;
    content: string;
    onPlayAudio: (messageId: string, text: string) => void;
    audioState: { playingMessageId: string | null; isLoading: boolean; };
}

const AudioPlayer: React.FC<AudioPlayerProps> = ({ messageId, content, onPlayAudio, audioState }) => {
    const { playingMessageId, isLoading } = audioState;
    const isThisMessagePlaying = playingMessageId === messageId;
    const isThisMessageLoading = isLoading && isThisMessagePlaying;
    
    return (
        <button 
            onClick={() => onPlayAudio(messageId, content)}
            disabled={isThisMessageLoading}
            className="absolute top-2 right-2 p-1.5 rounded-full bg-slate-800/50 hover:bg-slate-700/70 text-slate-300 transition-colors focus:outline-none focus:ring-2 focus:ring-violet-500"
            aria-label={isThisMessagePlaying && !isLoading ? "Stop audio" : "Play audio"}
        >
            {isThisMessageLoading ? <AudioLoadingSpinner /> : isThisMessagePlaying ? <StopIcon /> : <PlayIcon />}
        </button>
    );
};

interface MessageProps {
    message: ChatMessage;
    audioState: { playingMessageId: string | null; isLoading: boolean; };
    onPlayAudio: (messageId: string, text: string) => void;
    lang?: string;
}

const Message: React.FC<MessageProps> = ({ message, audioState, onPlayAudio, lang = 'en' }) => {
    const isUser = message.role === MessageRole.USER;

    const wrapperClasses = isUser ? 'justify-end' : 'justify-start';
    const messageClasses = isUser 
        ? 'accent-gradient text-white rounded-br-none'
        : 'glass-card text-slate-200 rounded-bl-none relative';
    const iconContainerClasses = isUser ? 'ml-3 order-2' : 'mr-3 order-1';
    const contentContainerClasses = isUser ? 'order-1' : 'order-2';

    return (
        <div className={`flex items-start ${wrapperClasses}`}>
            <div className={`flex-shrink-0 p-2 rounded-full bg-slate-800/50 ${iconContainerClasses}`}>
                {isUser ? <UserIcon /> : <BotIcon />}
            </div>
            <div className={`max-w-xl md:max-w-2xl px-5 py-3 rounded-2xl shadow-xl ${messageClasses} ${contentContainerClasses}`}>
                {!isUser && message.content && (
                    <AudioPlayer 
                        messageId={message.id}
                        content={message.content}
                        audioState={audioState}
                        onPlayAudio={onPlayAudio}
                    />
                )}
                <div className="prose prose-invert prose-sm max-w-none prose-p:my-2 prose-headings:my-3">
                   {message.content ? (
                        <SimpleMarkdown content={message.content} />
                   ) : (
                        <ThinkingIndicator lang={lang} />
                   )}
                </div>
                 {message.sources && message.sources.length > 0 && (
                    <div className="mt-4 pt-3 border-t border-slate-800/50">
                        <h4 className="text-xs font-semibold text-slate-400 mb-2 flex items-center">
                           <SourceIcon/> SOURCES
                        </h4>
                        <ol className="list-decimal list-inside space-y-1">
                            {message.sources.map((source, index) => (
                                <li key={index} className="text-xs truncate">
                                    <a 
                                        href={source.uri} 
                                        target="_blank" 
                                        rel="noopener noreferrer"
                                        className="text-violet-400 hover:underline"
                                        title={source.title}
                                    >
                                        {source.title}
                                    </a>
                                </li>
                            ))}
                        </ol>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Message;
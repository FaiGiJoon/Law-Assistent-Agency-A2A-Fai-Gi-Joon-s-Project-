import React, { useRef, useEffect } from 'react';
import { ChatMessage, MessageRole } from '../types';
import Message from './Message';
import ChatInput from './ChatInput';
import PromptSuggestions from './PromptSuggestions';
import LegalHeadlines from './LegalHeadlines';
import LanguageSwitcher from './LanguageSwitcher';
import { useTranslations, Language } from '../lib/i18n';

const LawBookIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-violet-400 mx-auto" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path>
        <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path>
    </svg>
);

interface ChatViewProps {
    lang: Language;
    setLang: (lang: Language) => void;
    audioState: { playingMessageId: string | null; isLoading: boolean; };
    onPlayAudio: (messageId: string, text: string) => void;
    messages: ChatMessage[];
    isLoading: boolean;
    error: string | null;
    onSendMessage: (inputText: string) => void;
}

const ChatView: React.FC<ChatViewProps> = ({ 
    lang, 
    setLang, 
    audioState, 
    onPlayAudio,
    messages,
    isLoading,
    error,
    onSendMessage
}) => {
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const t = useTranslations(lang);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  const handleLanguageChange = (newLang: Language) => {
    if (newLang !== lang) {
      setLang(newLang);
    }
  };
    
  const hasMessages = messages.length > 0;

  return (
    <div className="flex flex-col h-full bg-[#050505] relative">
      <div ref={chatContainerRef} className="flex-1 overflow-y-auto p-4 md:p-6">
        {!hasMessages && !isLoading ? (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <div className="glass-card p-8 rounded-3xl max-w-3xl w-full">
                <LanguageSwitcher currentLang={lang} onLangChange={handleLanguageChange} />
                <div className="my-6 border-b border-white/5 max-w-xl mx-auto"></div>
                <LawBookIcon />
                <h2 className="text-3xl font-bold text-white mt-4 tracking-tight">
                    {t.welcomeTitle}
                </h2>
                <p className="text-slate-400 mt-2 mb-8 max-w-md mx-auto">
                    {t.welcomeMessage}
                </p>
                <PromptSuggestions onPromptClick={onSendMessage} lang={lang} />
                <div className="my-8 border-b border-white/5 max-w-xl mx-auto"></div>
                <LegalHeadlines onPromptClick={onSendMessage} lang={lang} />
            </div>
          </div>
        ) : (
          <div className="space-y-6 max-w-4xl mx-auto w-full">
            {messages.map((msg) => (
              <Message 
                key={msg.id} 
                message={msg}
                audioState={audioState}
                onPlayAudio={onPlayAudio}
                lang={lang}
              />
            ))}
            {isLoading && messages[messages.length-1]?.role === MessageRole.USER && (
                <Message 
                    message={{id: 'typing', role: MessageRole.MODEL, content: ''}}
                    audioState={audioState}
                    onPlayAudio={onPlayAudio}
                    lang={lang}
                />
            )}
            {error && (
                <div className="text-red-400 bg-red-900/20 border border-red-900/50 p-4 rounded-xl text-sm">
                    <strong>Error:</strong> {error}
                </div>
            )}
          </div>
        )}
      </div>
      <ChatInput onSendMessage={onSendMessage} isLoading={isLoading} lang={lang} />
    </div>
  );
};

export default ChatView;
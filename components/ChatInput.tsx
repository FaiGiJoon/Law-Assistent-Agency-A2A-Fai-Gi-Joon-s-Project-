import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useTranslations, Language } from '../lib/i18n';
import { useSpeechRecognition } from '../hooks/useSpeechRecognition';

interface ChatInputProps {
  onSendMessage: (message: string, isVoice?: boolean) => void;
  isLoading: boolean;
  lang: Language;
}

const SendIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <line x1="22" y1="2" x2="11" y2="13"></line>
        <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
    </svg>
);

const MicIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"></path>
        <path d="M19 10v2a7 7 0 0 1-14 0v-2"></path>
        <line x1="12" y1="19" x2="12" y2="23"></line>
    </svg>
);


const LoadingSpinner = () => (
    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
);

const ChatInput: React.FC<ChatInputProps> = ({ onSendMessage, isLoading, lang }) => {
  const [text, setText] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const t = useTranslations(lang);
  
  const handleFinalTranscript = useCallback((transcript: string) => {
    if (transcript.trim() && !isLoading) {
      onSendMessage(transcript, true);
      setText('');
    }
  }, [onSendMessage, isLoading]);

  const {
      isListening,
      startListening,
      stopListening,
      isSupported,
  } = useSpeechRecognition({ lang, onFinalTranscript: handleFinalTranscript });

  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = 'auto';
      const scrollHeight = textarea.scrollHeight;
      textarea.style.height = `${scrollHeight}px`;
    }
  }, [text]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (text.trim() && !isLoading) {
      onSendMessage(text);
      setText('');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e as any);
    }
  };

  return (
    <div className="bg-[#050505]/80 backdrop-blur-xl border-t border-white/5 p-4 pb-8">
      <form onSubmit={handleSubmit} className="container mx-auto max-w-4xl flex items-end space-x-3">
        <div className="flex-1 relative">
            <textarea
              ref={textareaRef}
              value={text}
              onChange={(e) => setText(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={t.chatPlaceholder}
              className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 pr-12 resize-none text-white placeholder-slate-500 focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all duration-200 max-h-48 overflow-y-auto"
              rows={1}
              disabled={isLoading || isListening}
            />
            {isSupported && (
                <button
                    type="button"
                    onClick={isListening ? stopListening : startListening}
                    disabled={isLoading}
                    className={`absolute right-3 bottom-3 h-8 w-8 flex items-center justify-center rounded-full transition-all duration-200 disabled:opacity-50 ${
                        isListening ? 'text-red-500 animate-pulse' : 'text-slate-400 hover:text-white'
                    }`}
                    aria-label={isListening ? 'Stop listening' : 'Start listening'}
                >
                    <MicIcon />
                </button>
            )}
        </div>
        <button
          type="submit"
          disabled={isLoading || !text.trim()}
          className="accent-gradient text-white rounded-2xl h-14 w-14 flex-shrink-0 flex items-center justify-center transition-all duration-200 enabled:hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-violet-500/20 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:ring-offset-2 focus:ring-offset-black"
          aria-label="Send message"
        >
          {isLoading ? <LoadingSpinner /> : <SendIcon />}
        </button>
      </form>
    </div>
  );
};

export default ChatInput;
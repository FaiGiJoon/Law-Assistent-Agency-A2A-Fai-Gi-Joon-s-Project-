import React, { useState, useRef, useEffect, useCallback } from 'react';
import { createChat, streamMessage } from '../services/geminiService';
import type { Chat } from '@google/genai';
import { ChatMessage, MessageRole, Source } from '../types';
import Message from './Message';
import ChatInput from './ChatInput';
import TypingIndicator from './TypingIndicator';
import PromptSuggestions from './PromptSuggestions';
import LegalHeadlines from './LegalHeadlines';

const LawBookIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-emerald-400 mx-auto" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path>
        <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path>
    </svg>
);


const ChatView: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const chatRef = useRef<Chat | null>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatRef.current = createChat();
  }, []);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  const handleSendMessage = useCallback(async (inputText: string) => {
    if (!inputText.trim() || isLoading || !chatRef.current) return;

    setIsLoading(true);
    setError(null);
    const userMessage: ChatMessage = { role: MessageRole.USER, content: inputText };
    setMessages(prev => [...prev, userMessage]);
    
    let fullResponse = '';
    const sources: Source[] = [];
    const sourceMap = new Map<string, Source>();
    
    try {
        const stream = await streamMessage(chatRef.current, inputText);
        
        // Add a placeholder for the model's response
        setMessages(prev => [...prev, { role: MessageRole.MODEL, content: '' }]);

        for await (const chunk of stream) {
            const chunkText = chunk.text;
            fullResponse += chunkText;

            const groundingChunks = chunk.candidates?.[0]?.groundingMetadata?.groundingChunks;
            if (groundingChunks) {
                for (const chunk of groundingChunks) {
                    if (chunk.web) {
                       if (chunk.web.uri && !sourceMap.has(chunk.web.uri)) {
                           const newSource = { uri: chunk.web.uri, title: chunk.web.title || chunk.web.uri };
                           sourceMap.set(chunk.web.uri, newSource);
                           sources.push(newSource);
                       }
                    }
                }
            }

            setMessages(prev => {
                const newMessages = [...prev];
                const lastMessage = newMessages[newMessages.length - 1];
                lastMessage.content = fullResponse;
                if (sources.length > 0) {
                    lastMessage.sources = [...sources];
                }
                return newMessages;
            });
        }
    } catch (err) {
        console.error(err);
        const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred.';
        setError(`Failed to get response. ${errorMessage}`);
        setMessages(prev => {
            // Remove placeholder if it exists
            const lastMessage = prev[prev.length - 1];
            if (lastMessage.role === MessageRole.MODEL && lastMessage.content === '') {
                return prev.slice(0, -1);
            }
            return prev;
        });
    } finally {
        setIsLoading(false);
    }
  }, [isLoading]);

  return (
    <div className="flex flex-col h-full bg-slate-800/50">
      <div ref={chatContainerRef} className="flex-1 overflow-y-auto p-4 md:p-6">
        {messages.length === 0 && !isLoading ? (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <div className="bg-slate-900/40 backdrop-blur-sm p-8 rounded-2xl max-w-3xl w-full border border-slate-700/50">
                <LawBookIcon />
                <h2 className="text-2xl font-bold text-slate-100 mt-4">
                    Dutch Law AI Assistant
                </h2>
                <p className="text-slate-400 mt-2 mb-8 max-w-md mx-auto">
                    How can I assist you with Dutch law today?
                    Type your question below or choose a starting point.
                </p>
                <PromptSuggestions onPromptClick={handleSendMessage} />
                <div className="my-8 border-b border-slate-700/50 max-w-xl mx-auto"></div>
                <LegalHeadlines onPromptClick={handleSendMessage} />
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {messages.map((msg, index) => (
              <Message key={index} message={msg} />
            ))}
            {isLoading && messages[messages.length-1]?.role === MessageRole.USER && <TypingIndicator />}
            {error && (
                <div className="text-red-400 bg-red-900/50 p-3 rounded-lg text-sm">
                    <strong>Error:</strong> {error}
                </div>
            )}
          </div>
        )}
      </div>
      <ChatInput onSendMessage={handleSendMessage} isLoading={isLoading} />
    </div>
  );
};

export default ChatView;
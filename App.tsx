import React, { useState, useRef, useCallback, useEffect } from 'react';
import ChatView from './components/ChatView';
import Header from './components/Header';
import Footer from './components/Footer';
import BookingModal from './components/BookingModal';
import { Language } from './lib/i18n';
import { generateSpeech, createChat, streamMessage } from './services/geminiService';
import { decode, decodeAudioData } from './lib/audioUtils';
import type { Chat } from '@google/genai';
// FIX: `MessageRole` is an enum, which is used as a value at runtime (e.g., MessageRole.USER). It cannot be a type-only import.
import { MessageRole } from './types';
import type { ChatMessage, Source } from './types';

function App() {
  const [lang, setLang] = useState<Language>('en');
  const [activeAgent, setActiveAgent] = useState<string | undefined>(undefined);

  const audioContextRef = useRef<AudioContext | null>(null);
  const audioSourceRef = useRef<AudioBufferSourceNode | null>(null);

  const [audioState, setAudioState] = useState<{
      playingMessageId: string | null;
      isLoading: boolean;
  }>({ playingMessageId: null, isLoading: false });

  // Chat state and logic lifted from ChatView
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const chatRef = useRef<Chat | null>(null);

  const [pendingPrompt, setPendingPrompt] = useState<string | null>(null);

  const handleSendMessage = useCallback(async (inputText: string) => {
    if (!inputText.trim() || isLoading || !chatRef.current) return;

    setIsLoading(true);
    setError(null);
    const userMessage: ChatMessage = { id: `user-${Date.now()}`, role: MessageRole.USER, content: inputText };
    setMessages(prev => [...prev, userMessage]);
    
    let fullResponse = '';
    const sources: Source[] = [];
    const sourceMap = new Map<string, Source>();
    const modelMessageId = `model-${Date.now()}`;
    
    try {
        const stream = await streamMessage(chatRef.current, inputText);
        
        setMessages(prev => [...prev, { id: modelMessageId, role: MessageRole.MODEL, content: '' }]);

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
                if (lastMessage && lastMessage.id === modelMessageId) {
                    lastMessage.content = fullResponse;
                    if (sources.length > 0) {
                        lastMessage.sources = [...sources];
                    }
                }
                return newMessages;
            });
        }
    } catch (err) {
        console.error(err);
        const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred.';
        setError(`Failed to get response. ${errorMessage}`);
        setMessages(prev => prev.filter(m => m.id !== modelMessageId));
    } finally {
        setIsLoading(false);
    }
  }, [isLoading, lang]);

  useEffect(() => {
    // Re-initialize chat when language or agent changes
    chatRef.current = createChat(lang, activeAgent);
    setMessages([]); // Clear chat history on language or agent switch
  }, [lang, activeAgent]);

  useEffect(() => {
    if (pendingPrompt && chatRef.current) {
      handleSendMessage(pendingPrompt);
      setPendingPrompt(null);
    }
  }, [pendingPrompt, handleSendMessage]);

  const handleResetChat = useCallback(() => {
    setMessages([]);
    chatRef.current = createChat(lang, activeAgent);
    setActiveAgent(undefined);
  }, [lang, activeAgent]);

  const handleAgentClick = useCallback((agentTitle: string, prompt: string) => {
    setActiveAgent(agentTitle);
    setPendingPrompt(prompt);
  }, []);

  const stopCurrentAudio = useCallback(() => {
      if (audioSourceRef.current) {
          audioSourceRef.current.stop();
          audioSourceRef.current.disconnect();
          audioSourceRef.current = null;
      }
      setAudioState({ playingMessageId: null, isLoading: false });
  }, []);

  const handlePlayAudio = useCallback(async (messageId: string, text: string) => {
      if (audioState.playingMessageId || audioState.isLoading) {
          const wasPlaying = audioState.playingMessageId === messageId;
          stopCurrentAudio();
          if (wasPlaying) return;
      }

      setAudioState({ playingMessageId: messageId, isLoading: true });

      try {
          if (!audioContextRef.current) {
              audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
          }
          
          const base64Audio = await generateSpeech(text);
          if (!base64Audio) throw new Error("No audio data received.");

          const audioBytes = decode(base64Audio);
          const audioBuffer = await decodeAudioData(audioBytes, audioContextRef.current, 24000, 1);
          
          const source = audioContextRef.current.createBufferSource();
          source.buffer = audioBuffer;
          source.connect(audioContextRef.current.destination);
          source.start();
          
          audioSourceRef.current = source;
          setAudioState({ playingMessageId: messageId, isLoading: false });

          source.onended = () => {
              if (audioSourceRef.current === source) {
                  stopCurrentAudio();
              }
          };

      } catch (error) {
          console.error("Failed to play audio:", error);
          stopCurrentAudio();
      }
  }, [audioState.playingMessageId, audioState.isLoading, stopCurrentAudio]);

  const hasMessages = messages.length > 0;

  return (
    <div className="flex flex-col h-screen font-sans bg-[#050505] text-slate-100">
      <Header 
        lang={lang}
        setLang={setLang}
        hasMessages={hasMessages}
        onResetChat={handleResetChat}
      />
      <main className="flex-1 overflow-hidden">
        <ChatView 
          lang={lang} 
          audioState={audioState}
          onPlayAudio={handlePlayAudio}
          messages={messages}
          isLoading={isLoading}
          error={error}
          onSendMessage={handleSendMessage}
          onAgentClick={handleAgentClick}
        />
      </main>
      <Footer lang={lang} />
    </div>
  );
}

export default App;
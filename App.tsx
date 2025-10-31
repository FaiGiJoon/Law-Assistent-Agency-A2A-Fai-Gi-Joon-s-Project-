import React, { useState, useRef, useCallback } from 'react';
import ChatView from './components/ChatView';
import Header from './components/Header';
import Footer from './components/Footer';
import BookingModal from './components/BookingModal';
import { Language } from './lib/i18n';
import { generateSpeech } from './services/geminiService';
import { decode, decodeAudioData } from './lib/audioUtils';

function App() {
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [lang, setLang] = useState<Language>('en');

  const audioContextRef = useRef<AudioContext | null>(null);
  const audioSourceRef = useRef<AudioBufferSourceNode | null>(null);

  const [audioState, setAudioState] = useState<{
      playingMessageId: string | null;
      isLoading: boolean;
  }>({ playingMessageId: null, isLoading: false });

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

  return (
    <div className="flex flex-col h-screen font-sans bg-slate-900 text-slate-100">
      <Header 
        lang={lang}
        onBookAppointmentClick={() => setIsBookingModalOpen(true)} 
      />
      <main className="flex-1 overflow-hidden">
        <ChatView 
          lang={lang} 
          setLang={setLang}
          audioState={audioState}
          onPlayAudio={handlePlayAudio}
        />
      </main>
      <Footer lang={lang} />
      <BookingModal 
        isOpen={isBookingModalOpen} 
        onClose={() => setIsBookingModalOpen(false)}
        lang={lang}
      />
    </div>
  );
}

export default App;
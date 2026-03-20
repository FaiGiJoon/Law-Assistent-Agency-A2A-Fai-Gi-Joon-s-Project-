import { useState, useEffect, useCallback, useRef } from 'react';
import { Language } from '../lib/i18n';

interface UseSpeechRecognitionProps {
    lang: Language;
    onFinalTranscript?: (transcript: string) => void;
}

export const useSpeechRecognition = ({ lang, onFinalTranscript }: UseSpeechRecognitionProps) => {
    const [isListening, setIsListening] = useState(false);
    const [finalTranscript, setFinalTranscript] = useState('');
    const [isSupported, setIsSupported] = useState(false);
    const recognitionRef = useRef<any>(null);

    useEffect(() => {
        const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
        if (SpeechRecognition) {
            setIsSupported(true);
            const recognition = new SpeechRecognition();
            recognition.continuous = false;
            recognition.interimResults = false;
            recognition.lang = lang === 'nl' ? 'nl-NL' : 'en-US';

            recognition.onstart = () => setIsListening(true);
            recognition.onend = () => setIsListening(false);
            recognition.onerror = (event: any) => {
                console.error('Speech recognition error', event.error);
                setIsListening(false);
            };
            recognition.onresult = (event: any) => {
                const transcript = event.results[0][0].transcript;
                setFinalTranscript(transcript);
                if (onFinalTranscript) {
                    onFinalTranscript(transcript);
                }
            };

            recognitionRef.current = recognition;
        }
    }, [lang, onFinalTranscript]);

    const startListening = useCallback(() => {
        if (recognitionRef.current) {
            setFinalTranscript('');
            recognitionRef.current.start();
        }
    }, []);

    const stopListening = useCallback(() => {
        if (recognitionRef.current) {
            recognitionRef.current.stop();
        }
    }, []);

    return {
        isListening,
        startListening,
        stopListening,
        finalTranscript,
        isSupported,
    };
};

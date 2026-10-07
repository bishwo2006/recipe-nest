import { useState, useEffect, useCallback, useRef } from 'react';

const useVoice = (onTranscript) => {
    const [isListening, setIsListening] = useState(false);
    const [isSpeaking, setIsSpeaking] = useState(false);
    const [language, setLanguage] = useState('ne-NP'); 
    const recognitionRef = useRef(null);
    const synthRef = useRef(window.speechSynthesis);

    const onTranscriptRef = useRef(onTranscript);
    
    // Always keep the ref up to date
    useEffect(() => {
        onTranscriptRef.current = onTranscript;
    }, [onTranscript]);

    useEffect(() => {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (SpeechRecognition) {
            recognitionRef.current = new SpeechRecognition();
            recognitionRef.current.continuous = false; 
            recognitionRef.current.interimResults = true; 
            recognitionRef.current.lang = language;
            recognitionRef.current.maxAlternatives = 3; 

            recognitionRef.current.onstart = () => setIsListening(true);
            recognitionRef.current.onend = () => setIsListening(false);
            
            recognitionRef.current.onspeechstart = () => {
                if (synthRef.current.speaking) {
                    synthRef.current.cancel();
                    setIsSpeaking(false);
                }
            };
            
            recognitionRef.current.onresult = (event) => {
                if (synthRef.current.speaking) {
                    synthRef.current.cancel();
                    setIsSpeaking(false);
                }

                const isFinal = event.results[event.results.length - 1].isFinal;
                const transcript = event.results[event.results.length - 1][0].transcript;
                
                if (isFinal && onTranscriptRef.current) {
                    onTranscriptRef.current(transcript);
                }
            };

            recognitionRef.current.onerror = (event) => {
                console.error('Speech Recognition Error', event.error);
                setIsListening(false);
            };
        }
    }, [language]); // ONLY re-run on language change, not every transcript callback change

    const startListening = useCallback(() => {
        if (recognitionRef.current && !isListening) {
            // NOTE: We no longer cancel speech here to allow "Listen while Speaking"
            try {
                recognitionRef.current.start();
            } catch (err) {
                console.error("Failed to start recognition:", err);
            }
        }
    }, [isListening]);

    const stopListening = useCallback(() => {
        if (recognitionRef.current && isListening) {
            recognitionRef.current.stop();
        }
    }, [isListening]);

    const speak = useCallback((text) => {
        if (!text || !synthRef.current) return;

        synthRef.current.cancel();

        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = language;
        utterance.rate = 0.95;
        utterance.pitch = 1.0;
        
        const voices = synthRef.current.getVoices();
        
        const findVoice = (langCode) => {
            return voices.find(v => v.lang.replace('_', '-').toLowerCase() === langCode.toLowerCase() && v.name.includes('Google')) ||
                   voices.find(v => v.lang.startsWith(langCode.split('-')[0]) && v.name.includes('Natural')) ||
                   voices.find(v => v.lang.startsWith(langCode.split('-')[0]));
        };

        let preferredVoice = findVoice(language);

        if (!preferredVoice && language.startsWith('ne')) {
            preferredVoice = findVoice('hi-IN');
            if (preferredVoice) utterance.lang = 'hi-IN';
        }
            
        if (preferredVoice) utterance.voice = preferredVoice;

        utterance.onstart = () => setIsSpeaking(true);
        utterance.onend = () => setIsSpeaking(false);
        utterance.onerror = (e) => {
            console.error("Speech error:", e);
            setIsSpeaking(false);
        };

        synthRef.current.speak(utterance);
    }, [language]);

    const stopAll = useCallback(() => {
        if (synthRef.current) synthRef.current.cancel();
        if (recognitionRef.current) recognitionRef.current.stop();
        setIsSpeaking(false);
        setIsListening(false);
    }, []);

    const cancelSpeech = useCallback(() => {
        synthRef.current.cancel();
        setIsSpeaking(false);
    }, []);

    return {
        isListening,
        isSpeaking,
        language,
        setLanguage,
        startListening,
        stopListening,
        speak,
        cancelSpeech,
        stopAll
    };
};

export default useVoice;

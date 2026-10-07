import React, { useState, useEffect, useRef, useCallback } from 'react';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import { Send, Bot, User as UserIcon, Sparkles, Loader2, ArrowLeft, Mic, MicOff, Volume2, Languages, X } from 'lucide-react';
import { Link } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import goluIcon from '../../assets/golumolu.png';
import useVoice from '../../hooks/useVoice';
import { toast } from 'react-hot-toast';

const AIHelper = () => {
    const { user } = useAuth();
    const [prompt, setPrompt] = useState('');
    const [messages, setMessages] = useState([
        {
            role: 'ai',
            content: "Hi! I'm **Mr. Golumolu**. Ready to cook something delicious?"
        }
    ]);
    const [loading, setLoading] = useState(false);
    const [isHandsFree, setIsHandsFree] = useState(false);
    const messagesEndRef = useRef(null);

    const onTranscriptRef = useRef(null);
    
    const {
        isListening,
        isSpeaking,
        language,
        setLanguage,
        startListening,
        stopListening,
        speak,
        cancelSpeech,
        stopAll
    } = useVoice((text) => onTranscriptRef.current?.(text));

    const handleSend = useCallback(async (messageText) => {
        if (!messageText.trim() || loading) return;

        const userMessage = { role: 'user', content: messageText };
        setMessages(prev => [...prev, userMessage]);
        setLoading(true);

        try {
            const config = { headers: { Authorization: `Bearer ${user.token}` } };
            const { data } = await axios.post('http://localhost:5000/api/ai/ask', { prompt: messageText }, config);
            
            const aiMessage = data.message;
            setMessages(prev => [...prev, { role: 'ai', content: aiMessage }]);
            
            const cleanText = aiMessage
                .replace(/[#*`_~]/g, '')
                .replace(/\[.*?\]\(.*?\)/g, '')
                .replace(/\n+/g, '. ')
                .trim();

            speak(cleanText);

            if (isHandsFree) {
                setTimeout(() => {
                    startListening();
                }, 500);
            }

        } catch (error) {
            setMessages(prev => [...prev, { 
                role: 'ai', 
                content: "Mr. Golumolu dropped his spatula. Please ask again!" 
            }]);
        } finally {
            setLoading(false);
        }
    }, [user, loading, isHandsFree, speak, startListening]);

    useEffect(() => {
        onTranscriptRef.current = (text) => {
            setPrompt(text);
            handleSend(text);
            setPrompt('');
        };
    }, [handleSend]);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    // Hands-free "Ping-Pong" logic
    useEffect(() => {
        if (isHandsFree && !isSpeaking && !loading && messages[messages.length-1]?.role === 'ai') {
            const timer = setTimeout(() => {
                startListening();
            }, 300); // Super fast transition for Ping-Pong
            return () => clearTimeout(timer);
        }
    }, [isHandsFree, isSpeaking, loading, messages, startListening]);

    const handleSubmit = (e) => {
        e.preventDefault();
        handleSend(prompt);
        setPrompt('');
    };

    const toggleSiri = () => {
        if (isListening) {
            stopListening();
        } else {
            startListening();
        }
    };

    return (
        <div className="max-w-4xl mx-auto h-[calc(100vh-140px)] flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                    <Link to="/user" className="p-2 hover:bg-white rounded-full transition-colors text-slate-500">
                        <ArrowLeft className="w-5 h-5" />
                    </Link>
                    <div className="p-1 bg-white rounded-xl shadow-lg border border-orange-100 overflow-hidden w-12 h-12">
                        <img src={goluIcon} alt="Mr. Golumolu" className="w-full h-full object-cover rounded-lg" />
                    </div>
                    <div>
                        <h2 className="text-xl font-black text-slate-800">Mr. Golumolu</h2>
                        <span className="text-xs font-bold text-orange-500 flex items-center">
                            <Sparkles className="w-3 h-3 mr-1" /> AI KITCHEN HELPER
                        </span>
                    </div>
                </div>

                <div className="flex items-center space-x-2">
                    <button 
                        onClick={() => {
                            const newLang = language === 'en-US' ? 'ne-NP' : 'en-US';
                            setLanguage(newLang);
                            toast.success(`Switched to ${newLang === 'en-US' ? 'English' : 'Nepali'}`);
                        }}
                        className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all border ${
                            language === 'ne-NP' 
                            ? 'bg-orange-50 border-orange-200 text-orange-700' 
                            : 'bg-white border-slate-200 text-slate-600'
                        }`}
                    >
                        <Languages className="w-3.5 h-3.5" />
                        <span>{language === 'en-US' ? 'English' : 'Nepali'}</span>
                    </button>
                    <button 
                        onClick={() => setIsHandsFree(!isHandsFree)}
                        className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all border ${
                            isHandsFree 
                            ? 'bg-green-50 border-green-200 text-green-700 ring-2 ring-green-100' 
                            : 'bg-white border-slate-200 text-slate-500 hover:bg-slate-50'
                        }`}
                        title={isHandsFree ? "Disable Hands-free Mode" : "Enable Hands-free Mode"}
                    >
                        <Sparkles className={`w-3.5 h-3.5 ${isHandsFree ? 'animate-spin' : ''}`} />
                        <span>{isHandsFree ? 'Hands-Free ON' : 'Hands-Free'}</span>
                    </button>
                    <button 
                        onClick={stopAll}
                        className="p-2 bg-rose-500 text-white rounded-xl shadow-lg shadow-rose-500/20 hover:bg-rose-600 transition-all transform active:scale-95"
                        title="Stop All (Cancel Speech & Mic)"
                    >
                        <X className="w-5 h-5 font-bold" />
                    </button>
                </div>
            </div>

            {/* Chat Container */}
            <div className="flex-1 bg-white rounded-3xl shadow-xl shadow-slate-200 border border-slate-100 overflow-hidden flex flex-col mb-4">
                {/* Messages Area */}
                <div className="flex-1 overflow-y-auto p-6 space-y-6 scrollbar-hide">
                    {messages.map((msg, index) => (
                        <div key={index} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                            <div className={`flex max-w-[85%] ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                                <div className={`shrink-0 h-10 w-10 rounded-xl flex items-center justify-center overflow-hidden shadow-md ${
                                    msg.role === 'user' 
                                    ? 'ml-3 bg-slate-800 text-white' 
                                    : 'mr-3 bg-white border border-orange-100 p-0.5'
                                }`}>
                                    {msg.role === 'user' ? <UserIcon className="w-5 h-5" /> : <img src={goluIcon} className="w-full h-full object-cover rounded-lg" />}
                                </div>
                                <div className={`p-4 rounded-2xl shadow-sm ${
                                    msg.role === 'user'
                                    ? 'bg-slate-800 text-white rounded-tr-none'
                                    : 'bg-slate-50 text-slate-700 border border-slate-100 rounded-tl-none'
                                }`}>
                                    <div className="prose prose-sm max-w-none prose-slate">
                                        <ReactMarkdown>{msg.content}</ReactMarkdown>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                    {loading && (
                        <div className="flex justify-start">
                            <div className="bg-slate-50 border border-slate-100 p-4 rounded-2xl rounded-tl-none shadow-sm flex items-center space-x-2">
                                <Loader2 className="w-4 h-4 text-orange-500 animate-spin" />
                                <span className="text-sm font-medium text-slate-500 italic">Mr. Golumolu is thinking...</span>
                            </div>
                        </div>
                    )}
                    <div ref={messagesEndRef} />
                </div>

                {/* Input Area */}
                <div className="p-4 bg-slate-50 border-t border-slate-100">
                    <form onSubmit={handleSubmit} className="flex items-center space-x-3">
                        <div className="relative flex-1">
                            <textarea
                                rows="1"
                                value={prompt}
                                onChange={(e) => setPrompt(e.target.value)}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter' && !e.shiftKey) {
                                      e.preventDefault();
                                      handleSubmit(e);
                                    }
                                }}
                                placeholder={isListening ? "Listening... Speak now" : "Ask Mr. Golumolu anything..."}
                                className={`w-full bg-white border rounded-2xl pl-4 pr-14 py-3 text-slate-700 text-sm focus:outline-none focus:ring-2 shadow-sm resize-none transition-all ${
                                    isListening 
                                    ? 'border-orange-400 ring-4 ring-orange-100 placeholder-orange-500 font-medium' 
                                    : 'border-slate-200 focus:ring-orange-200 focus:border-orange-400'
                                }`}
                            />
                            {isListening && (
                                <div className="absolute left-4 top-[-20px] flex items-center space-x-1">
                                    <div className="w-1.5 h-1.5 bg-orange-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                                    <div className="w-1.5 h-1.5 bg-orange-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                                    <div className="w-1.5 h-1.5 bg-orange-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                                    <span className="text-[10px] text-orange-500 font-bold uppercase tracking-widest ml-1">Listening</span>
                                </div>
                            )}
                            <button
                                type="submit"
                                disabled={!prompt.trim() || loading}
                                className="absolute right-2 top-1.5 p-2 bg-orange-500 text-white rounded-xl shadow-md shadow-orange-500/20 hover:bg-orange-600 disabled:opacity-50 transition-all"
                            >
                                <Send className="w-5 h-5" />
                            </button>
                        </div>
                        
                        <button
                            type="button"
                            onClick={toggleSiri}
                            className={`p-4 rounded-2xl shadow-lg transition-all transform active:scale-95 ${
                                isListening 
                                ? 'bg-gradient-to-tr from-orange-500 to-rose-500 text-white animate-pulse ring-4 ring-orange-200 scale-110' 
                                : 'bg-white border-2 border-orange-100 text-orange-500 hover:bg-orange-50'
                            }`}
                        >
                            {isListening ? <MicOff className="w-6 h-6" /> : <Mic className="w-6 h-6" />}
                        </button>
                    </form>
                    <p className="text-[10px] text-slate-400 mt-2 text-center">Mr. Golumolu provides general culinary advice. Always practice kitchen safety!</p>
                </div>
            </div>
        </div>
    );
};

export default AIHelper;

import { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { useMutation, useFetch } from '../hooks/useApi';

interface Message {
    id: string;
    text: string;
    sender: 'user' | 'bot';
    timestamp: Date;
    intent?: any;
    ticketAction?: string;
}

const getPageContext = (pathname: string): string => {
    if (pathname.startsWith('/portfolio')) return 'Portfolio';
    if (pathname.startsWith('/properties')) return 'Marketplace';
    if (pathname.includes('kyc') || pathname.includes('settings')) return 'Verification';
    return 'General';
};

export default function Chatbot() {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<Message[]>([
        {
            id: 'init',
            text: "Hello! I'm Hermeos Guide. How can I assist you today?",
            sender: 'bot',
            timestamp: new Date()
        }
    ]);
    const [inputValue, setInputValue] = useState('');
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const location = useLocation();

    // API Hooks
    const { mutate: sendMessage, isLoading: isTyping } = useMutation('/api/chatbot/message', 'POST', {
        onSuccess: (data) => {
            const botMsg: Message = {
                id: Date.now().toString(),
                text: data.data.reply,
                sender: 'bot',
                timestamp: new Date(),
                intent: data.data.intent,
                ticketAction: data.data.ticketAction
            };
            setMessages(prev => [...prev, botMsg]);
        },
        onError: () => {
            setMessages(prev => [...prev, {
                id: Date.now().toString(),
                text: "I'm having trouble connecting to the support server. Please try again later.",
                sender: 'bot',
                timestamp: new Date()
            }]);
        }
    });

    const { data: broadcasts } = useFetch('/api/chatbot/broadcasts');

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const handleSend = () => {
        if (!inputValue.trim()) return;

        const userMsg: Message = {
            id: Date.now().toString(),
            text: inputValue,
            sender: 'user',
            timestamp: new Date()
        };

        setMessages(prev => [...prev, userMsg]);
        setInputValue('');

        sendMessage({
            message: userMsg.text,
            context: getPageContext(location.pathname)
        });
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    return (
        <>
            {/* Chat Button */}
            {!isOpen && (
                <button
                    onClick={() => setIsOpen(true)}
                    className="fixed bottom-6 right-6 z-50 flex items-center gap-3 bg-primary hover:bg-primary/90 text-white px-5 py-3 rounded-full shadow-xl transition-all hover:scale-105 min-h-[48px]"
                >
                    <span className="material-symbols-outlined text-[24px]">chat</span>
                    <span className="hidden sm:inline font-medium">Need Help?</span>
                </button>
            )}

            {/* Chat Window */}
            {isOpen && (
                <div className="fixed bottom-6 right-6 z-50 w-full sm:w-[400px] h-[600px] max-h-[80vh] bg-white dark:bg-[#1a2632] rounded-2xl shadow-2xl flex flex-col border border-slate-200 dark:border-slate-700 overflow-hidden font-sans">
                    {/* Header */}
                    <div className="bg-gradient-to-r from-primary to-blue-600 text-white px-6 py-4 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                                <span className="material-symbols-outlined">support_agent</span>
                            </div>
                            <div>
                                <h3 className="font-bold text-lg">Hermeos Support</h3>
                                <div className="flex items-center gap-2">
                                    <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
                                    <p className="text-xs text-blue-100">Online</p>
                                </div>
                            </div>
                        </div>
                        <button onClick={() => setIsOpen(false)} className="p-2 hover:bg-white/10 rounded-lg">
                            <span className="material-symbols-outlined">close</span>
                        </button>
                    </div>

                    {/* Broadcasts */}
                    {broadcasts?.data && broadcasts.data.length > 0 && (
                        <div className="bg-yellow-50 dark:bg-yellow-900/30 p-3 text-xs border-b border-yellow-100 dark:border-yellow-800">
                            <strong>Announcement:</strong> {broadcasts.data[0].message}
                        </div>
                    )}

                    {/* Messages */}
                    <div className="flex-1 overflow-y-auto p-4 space-y-4">
                        {messages.map((message) => (
                            <div key={message.id} className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                                <div className={`max-w-[85%] rounded-2xl px-4 py-3 ${message.sender === 'user'
                                        ? 'bg-primary text-white'
                                        : 'bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white'
                                    }`}>
                                    <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.text}</p>

                                    {/* Ticket Action Badge */}
                                    {message.ticketAction && (
                                        <div className="mt-2 pt-2 border-t border-black/10 dark:border-white/10 flex items-center gap-2 text-xs font-semibold">
                                            <span className="material-symbols-outlined text-[16px]">confirmation_number</span>
                                            {message.ticketAction === 'created' ? 'Ticket Created' : 'Ticket Updated'}
                                        </div>
                                    )}

                                    <p className="text-[10px] opacity-70 mt-1 text-right">
                                        {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    </p>
                                </div>
                            </div>
                        ))}

                        {isTyping && (
                            <div className="flex justify-start">
                                <div className="bg-slate-100 dark:bg-slate-800 rounded-2xl px-4 py-3">
                                    <div className="flex gap-1">
                                        <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"></div>
                                        <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce delay-100"></div>
                                        <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce delay-200"></div>
                                    </div>
                                </div>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Input */}
                    <div className="border-t border-slate-200 dark:border-slate-700 p-4 bg-white dark:bg-[#1a2632]">
                        <div className="flex gap-2">
                            <input
                                type="text"
                                value={inputValue}
                                onChange={(e) => setInputValue(e.target.value)}
                                onKeyPress={handleKeyPress}
                                placeholder="Type your message..."
                                disabled={isTyping}
                                className="flex-1 px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-xl bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary disabled:opacity-50"
                            />
                            <button
                                onClick={handleSend}
                                disabled={!inputValue.trim() || isTyping}
                                className="px-4 py-3 bg-primary text-white rounded-xl hover:bg-primary/90 disabled:opacity-50 transition-colors min-w-[48px] flex items-center justify-center"
                            >
                                <span className="material-symbols-outlined">send</span>
                            </button>
                        </div>
                        <p className="text-[10px] text-slate-400 mt-2 text-center">
                            Support tickets are automatically created for complex issues.
                        </p>
                    </div>
                </div>
            )}
        </>
    );
}

import { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';

interface Message {
    id: string;
    text: string;
    sender: 'user' | 'bot';
    timestamp: Date;
}

const getPageContext = (pathname: string): string => {
    const contexts: Record<string, string> = {
        '/': 'Dashboard Overview',
        '/portfolio': 'Ownership Register',
        '/properties': 'Available Property Listings',
        '/performance': 'Distribution History',
        '/proceeds': 'Income Distributions',
        '/settings': 'Account Settings',
        '/support': 'Support Center',
        '/login': 'Login Page',
        '/signup': 'Account Registration',
        '/admin': 'Admin Dashboard'
    };

    for (const [path, context] of Object.entries(contexts)) {
        if (pathname.startsWith(path)) {
            return context;
        }
    }
    return 'Platform Navigation';
};

const getBotResponse = (userMessage: string, context: string): string => {
    const msg = userMessage.toLowerCase();

    // Greeting responses
    if (msg.includes('hello') || msg.includes('hi') || msg.includes('hey')) {
        return `Hello! I'm Hermeos Guide, here to help you understand the platform and navigate features. I can see you're currently viewing the ${context} section. What would you like to know?`;
    }

    // Help with navigation
    if (msg.includes('help') || msg.includes('lost') || msg.includes('confused')) {
        return `I understand. You're currently on the ${context} page. I can help explain what you're looking at, guide you through available actions, or answer questions about how things work here. What specifically would you like to understand?`;
    }

    // Property-related queries
    if (msg.includes('property') || msg.includes('properties')) {
        return `Properties on Hermeos represent real estate assets available for documented ownership participation. Each property listing shows location, size, total value, and historical income information. Would you like me to explain how ownership registration works, or help you understand specific property details?`;
    }

    // Ownership queries
    if (msg.includes('ownership') || msg.includes('own') || msg.includes('buy')) {
        return `When you register ownership on Hermeos, you're acquiring documented participation rights in a real estate asset. This means your name and ownership percentage are legally recorded. The platform manages the property itself. Important note: ownership registration is a formal administrative process, not an instant transaction. Would you like to understand the registration steps?`;
    }

    // Income/Returns queries (carefully worded)
    if (msg.includes('return') || msg.includes('income') || msg.includes('profit') || msg.includes('yield')) {
        return `I can help you understand income distributions, but I cannot predict outcomes or guarantee amounts. What you see on the platform are historical distribution records from rental income, which vary based on property performance, tenant payments, and operational costs. These distributions are not guaranteed and can fluctuate. Would you like to see where to find distribution history?`;
    }

    // Exit/Liquidity queries
    if (msg.includes('exit') || msg.includes('sell') || msg.includes('withdraw') || msg.includes('transfer')) {
        return `Ownership transfer requests are manual, administrative processes that depend on availability of interested parties and operational considerations. They are not instant and are not guaranteed to complete. If you'd like to understand how transfer requests work and what factors affect them, I can explain that process.`;
    }

    // KYC/Verification
    if (msg.includes('kyc') || msg.includes('verify') || msg.includes('verification')) {
        return `Identity verification (KYC) is required to comply with Nigerian regulations. You'll need a valid government-issued ID (International Passport, Driver's License, or NIN Slip) and proof of address (utility bill or bank statement dated within 3 months). Verification typically takes 24-48 hours. Would you like help navigating to the verification page?`;
    }

    // Account queries
    if (msg.includes('account') || msg.includes('profile') || msg.includes('settings')) {
        return `Your account section lets you manage personal information, security settings, and preferences. You can also view account tier information and update verification documents. What specific account setting would you like to understand?`;
    }

    // Default helpful response
    return `I'm here to help you understand how Hermeos works. Currently, you're viewing the ${context} section. I can explain features, guide you through processes, or clarify terminology. What would you like to know more about? For example, I can help with: property listings, ownership registration, distribution history, account verification, or platform navigation.`;
};

export default function Chatbot() {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<Message[]>([
        {
            id: '1',
            text: "Hello! I'm Hermeos Guide. I can help you understand the platform, navigate features, and clarify how things work. What would you like to know?",
            sender: 'bot',
            timestamp: new Date()
        }
    ]);
    const [inputValue, setInputValue] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const location = useLocation();
    const [pageContext, setPageContext] = useState('');

    useEffect(() => {
        setPageContext(getPageContext(location.pathname));
    }, [location.pathname]);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const handleSend = () => {
        if (!inputValue.trim()) return;

        const userMessage: Message = {
            id: Date.now().toString(),
            text: inputValue,
            sender: 'user',
            timestamp: new Date()
        };

        setMessages(prev => [...prev, userMessage]);
        setInputValue('');
        setIsTyping(true);

        // Simulate bot thinking delay
        setTimeout(() => {
            const botResponse: Message = {
                id: (Date.now() + 1).toString(),
                text: getBotResponse(inputValue, pageContext),
                sender: 'bot',
                timestamp: new Date()
            };
            setMessages(prev => [...prev, botResponse]);
            setIsTyping(false);
        }, 1000);
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
                <div className="fixed bottom-6 right-6 z-50 w-full sm:w-[400px] h-[600px] max-h-[80vh] bg-white dark:bg-[#1a2632] rounded-2xl shadow-2xl flex flex-col border border-slate-200 dark:border-slate-700 overflow-hidden">
                    {/* Header */}
                    <div className="bg-gradient-to-r from-primary to-blue-600 text-white px-6 py-4 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                                <span className="material-symbols-outlined">apartment</span>
                            </div>
                            <div>
                                <h3 className="font-bold text-lg">Hermeos Guide</h3>
                                <p className="text-xs text-blue-100">Context: {pageContext}</p>
                            </div>
                        </div>
                        <button
                            onClick={() => setIsOpen(false)}
                            className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                        >
                            <span className="material-symbols-outlined">close</span>
                        </button>
                    </div>

                    {/* Messages */}
                    <div className="flex-1 overflow-y-auto p-4 space-y-4">
                        {messages.map((message) => (
                            <div
                                key={message.id}
                                className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                            >
                                <div
                                    className={`max-w-[80%] rounded-2xl px-4 py-3 ${message.sender === 'user'
                                            ? 'bg-primary text-white'
                                            : 'bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white'
                                        }`}
                                >
                                    <p className="text-sm leading-relaxed">{message.text}</p>
                                    <p className="text-xs opacity-70 mt-1">
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
                                        <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                                        <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                                    </div>
                                </div>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Input */}
                    <div className="border-t border-slate-200 dark:border-slate-700 p-4">
                        <div className="flex gap-2">
                            <input
                                type="text"
                                value={inputValue}
                                onChange={(e) => setInputValue(e.target.value)}
                                onKeyPress={handleKeyPress}
                                placeholder="Ask about the platform..."
                                className="flex-1 px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-xl bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary"
                            />
                            <button
                                onClick={handleSend}
                                disabled={!inputValue.trim()}
                                className="px-4 py-3 bg-primary text-white rounded-xl hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors min-w-[48px]"
                            >
                                <span className="material-symbols-outlined">send</span>
                            </button>
                        </div>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 text-center">
                            Hermeos Guide provides information only, not financial advice
                        </p>
                    </div>
                </div>
            )}
        </>
    );
}

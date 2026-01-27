import { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { Button } from '../ui/button';
import { useNavigate } from 'react-router-dom';

export function WelcomeModal() {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [isOpen, setIsOpen] = useState(false);

    useEffect(() => {
        // Show only if user is logged in, NOT verified, and hasn't seen it this session
        const hasSeen = sessionStorage.getItem('hasSeenWelcomeModal');
        if (user && !user.isVerified && !hasSeen) {
            setIsOpen(true);
            sessionStorage.setItem('hasSeenWelcomeModal', 'true');
        }
    }, [user]);

    if (!isOpen || !user) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
            <div className="bg-white dark:bg-[#1a2632] w-full max-w-md rounded-2xl shadow-2xl overflow-hidden border border-slate-200 dark:border-slate-700 mx-4 transform transition-all animate-in zoom-in-95 duration-300">

                {/* Header with Confetti effect (simulated with emoji or CSS) */}
                <div className="bg-gradient-to-r from-primary to-blue-600 p-6 text-center relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-full opacity-10 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')]"></div>
                    <span className="text-5xl mb-2 block animate-bounce">🎉</span>
                    <h2 className="text-2xl font-bold text-white relative z-10">Welcome, {user.firstName}!</h2>
                    <p className="text-blue-100 text-sm mt-1 relative z-10">You've joined 2,000+ smart investors.</p>
                </div>

                <div className="p-8">
                    {/* Gamified Status */}
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-bold uppercase text-slate-500">Current Status</span>
                        <span className="text-xs font-bold uppercase text-primary">Level 1</span>
                    </div>

                    <div className="flex items-center gap-3 mb-6 bg-slate-50 dark:bg-slate-800 p-3 rounded-lg border border-slate-100 dark:border-slate-700">
                        <div className="size-12 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center text-2xl border-2 border-slate-300 dark:border-slate-600">
                            🥚
                        </div>
                        <div>
                            <h3 className="font-bold text-slate-900 dark:text-white">Rookie Investor</h3>
                            <p className="text-xs text-slate-500">Complete verification to unlock Silver Tier.</p>
                        </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="mb-6">
                        <div className="flex justify-between text-xs mb-1">
                            <span className="font-semibold text-slate-600 dark:text-slate-400">Setup Progress</span>
                            <span className="font-bold text-primary">33%</span>
                        </div>
                        <div className="h-2 w-full bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                            <div className="h-full bg-primary w-1/3 rounded-full"></div>
                        </div>
                    </div>

                    {/* Action */}
                    <div className="flex flex-col gap-3">
                        <Button
                            onClick={() => { setIsOpen(false); navigate('/kyc/info'); }}
                            className="w-full h-12 text-base font-bold shadow-lg shadow-blue-500/20"
                        >
                            🚀 Complete Profile to Level Up
                        </Button>
                        <button
                            onClick={() => setIsOpen(false)}
                            className="text-sm text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 font-medium"
                        >
                            I'll do this later
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

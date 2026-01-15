import { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '../../components/ui/button';
import { Shield, Check, ArrowRight, Timer, ArrowLeft, ExternalLink, RefreshCw } from 'lucide-react';
import { useMutation } from '../../hooks/useApi';
import { useToast } from '../../contexts/ToastContext';

export default function EmailVerificationPage() {
    const navigate = useNavigate();
    const { showToast } = useToast();
    const [otp, setOtp] = useState(['', '', '', '', '', '']);
    const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
    const [timeLeft, setTimeLeft] = useState(30);

    useEffect(() => {
        if (timeLeft > 0) {
            const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
            return () => clearTimeout(timer);
        }
    }, [timeLeft]);

    const handleChange = (index: number, value: string) => {
        if (!/^\d*$/.test(value)) return;

        const newOtp = [...otp];
        newOtp[index] = value;
        setOtp(newOtp);

        if (value && index < 5) {
            inputRefs.current[index + 1]?.focus();
        }
    };

    const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Backspace' && !otp[index] && index > 0) {
            inputRefs.current[index - 1]?.focus();
        }
    };

    const { mutate: verifyEmail, isLoading: isVerifying } = useMutation('/api/auth/verify-email', 'POST', {
        onSuccess: () => {
            alert('Email Verified Successfully!');
            navigate('/dashboard');
        },
        onError: (err) => alert(err.message || 'Verification Failed')
    });

    const { mutate: resendCode, isLoading: isResending } = useMutation('/api/auth/resend-verification', 'POST', {
        onSuccess: () => {
            alert('Verification code resent to your email.');
            setTimeLeft(30);
        },
        onError: (err) => alert(err.message || 'Failed to resend code')
    });

    const handleVerify = () => {
        const code = otp.join('');
        if (code.length === 6) {
            verifyEmail({ code });
        } else {
            alert("Please enter a complete 6-digit code.");
        }
    };

    const handleResend = () => {
        if (timeLeft === 0 && !isResending) {
            resendCode({});
        }
    };

    return (
        <div className="min-h-screen flex flex-col bg-background-light dark:bg-background-dark font-display text-slate-900 dark:text-white transition-colors duration-200 bg-[radial-gradient(#cbd5e1_1px,transparent_1px)] dark:bg-[radial-gradient(#334155_1px,transparent_1px)] [background-size:20px_20px]">
            {/* Header */}
            <header className="w-full py-6 px-4 sm:px-8 flex justify-between items-center z-10">
                <div className="flex items-center gap-3">
                    <div className="w-9 h-9 bg-primary rounded-lg flex items-center justify-center text-white shadow-lg shadow-blue-900/10">
                        {/* Abstract Logo */}
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                            <path d="M11.47 3.84a.75.75 0 011.06 0l8.69 8.69a.75.75 0 101.06-1.06l-8.689-8.69a2.25 2.25 0 00-3.182 0l-8.69 8.69a.75.75 0 001.061 1.06l8.69-8.69z" />
                            <path d="M12 5.432l8.159 8.159c.03.03.06.058.091.086v6.198c0 1.035-.84 1.875-1.875 1.875H15a.75.75 0 01-.75-.75v-4.5a.75.75 0 00-.75-.75h-3a.75.75 0 00-.75.75V21a.75.75 0 01-.75.75H5.625a1.875 1.875 0 01-1.875-1.875v-6.198a2.29 2.29 0 00.091-.086L12 5.43z" />
                        </svg>
                    </div>
                    <div className="flex flex-col leading-none">
                        <span className="text-lg font-bold tracking-tight text-slate-900 dark:text-white">Hermeos</span>
                        <span className="text-[10px] uppercase tracking-wider text-slate-500 font-semibold">Proptech</span>
                    </div>
                </div>
                <div className="hidden sm:flex items-center gap-2 text-xs font-medium text-slate-500 dark:text-slate-400 bg-white dark:bg-surface-dark px-3 py-1.5 rounded-full border border-border-light dark:border-border-dark shadow-sm">
                    <span className="w-1.5 h-1.5 rounded-full bg-secondary animate-pulse"></span>
                    System Operational
                </div>
            </header>

            {/* Main Content */}
            <main className="flex-grow flex items-center justify-center p-4 relative z-0">
                {/* Background Blob */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/10 rounded-full blur-3xl -z-10 pointer-events-none"></div>

                <div className="w-full max-w-[480px] bg-surface-light dark:bg-surface-dark rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-border-light dark:border-border-dark overflow-hidden relative">
                    {/* Top Bar */}
                    <div className="h-1.5 w-full bg-gradient-to-r from-primary via-blue-400 to-primary absolute top-0 left-0"></div>

                    <div className="px-8 pt-10 pb-8 flex flex-col items-center text-center">
                        <div className="relative mb-6">
                            <div className="w-16 h-16 bg-blue-50 dark:bg-primary/20 rounded-2xl flex items-center justify-center transform rotate-3 transition-transform hover:rotate-6">
                                <Shield className="w-8 h-8 text-primary" />
                            </div>
                            <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-white dark:bg-surface-dark border-2 border-white dark:border-surface-dark rounded-full flex items-center justify-center shadow-sm">
                                <Check className="w-4 h-4 text-secondary font-bold" />
                            </div>
                        </div>

                        <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Verify your identity</h1>
                        <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed mb-8 max-w-[90%]">
                            We’ve sent a 6-digit code to <span className="font-semibold text-slate-700 dark:text-slate-200">user@example.com</span>. Please enter it below to secure your Hermeos account.
                        </p>

                        {/* OTP Inputs */}
                        <div className="w-full mb-8">
                            <div className="flex justify-between gap-2 sm:gap-3">
                                {otp.map((digit, idx) => (
                                    <input
                                        key={idx}
                                        ref={el => inputRefs.current[idx] = el} // Fix ref assignment
                                        type="text"
                                        maxLength={1}
                                        value={digit}
                                        onChange={(e) => handleChange(idx, e.target.value)}
                                        onKeyDown={(e) => handleKeyDown(idx, e)}
                                        className="w-full h-14 text-center rounded-lg border border-border-light dark:border-border-dark bg-background-light dark:bg-background-dark text-xl font-bold text-slate-900 dark:text-white focus:border-primary focus:ring-2 focus:ring-primary/20 focus:outline-none transition-all placeholder:text-gray-300"
                                        placeholder="-"
                                        autoFocus={idx === 0}
                                    />
                                ))}
                            </div>
                        </div>

                        <Button onClick={handleVerify} className="w-full bg-primary hover:bg-primary/90 text-white font-bold h-12 rounded-lg transition-all transform active:scale-[0.99] flex items-center justify-center gap-2 mb-6 shadow-md shadow-blue-900/10">
                            <span>Verify Account</span>
                            <ArrowRight className="w-5 h-5" />
                        </Button>

                        <div className="flex flex-col gap-1 items-center">
                            <p className="text-sm text-slate-500 dark:text-slate-400">
                                Didn't receive the code?
                            </p>
                            <div className="flex items-center gap-2">
                                <span className={`text-sm font-semibold flex items-center gap-1 ${timeLeft > 0 ? 'text-slate-400 dark:text-slate-500 cursor-not-allowed' : 'text-primary cursor-pointer hover:underline'}`} onClick={() => timeLeft === 0 && setTimeLeft(30)}>
                                    {timeLeft > 0 ? (
                                        <>
                                            <Timer className="w-4 h-4" /> Resend in 00:{timeLeft.toString().padStart(2, '0')}
                                        </>
                                    ) : (
                                        <>
                                            <RefreshCw className="w-4 h-4" /> Resend Code
                                        </>
                                    )}
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className="bg-slate-50 dark:bg-slate-800/50 px-8 py-4 border-t border-border-light dark:border-border-dark flex justify-between items-center text-xs font-medium">
                        <Link to="/login" className="text-slate-500 hover:text-primary transition-colors flex items-center gap-1 group">
                            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
                            Change email
                        </Link>
                        <a href="#" className="text-slate-500 hover:text-primary transition-colors flex items-center gap-1">
                            Contact Support
                            <ExternalLink className="w-4 h-4" />
                        </a>
                    </div>
                </div>
            </main>

            {/* Footer */}
            <footer className="w-full py-6 text-center text-xs text-slate-400 dark:text-slate-500 z-10">
                <div className="flex justify-center gap-4 mb-2">
                    <span>© 2024 Hermeos Proptech.</span>
                    <span className="hidden sm:inline opacity-30">|</span>
                    <span className="hidden sm:inline flex items-center gap-1">
                        Lagos, Nigeria
                    </span>
                </div>
                <div className="flex justify-center gap-6">
                    <a href="#" className="hover:text-primary transition-colors">Privacy Policy</a>
                    <a href="#" className="hover:text-primary transition-colors">Terms of Service</a>
                </div>
            </footer>
        </div>
    );
}

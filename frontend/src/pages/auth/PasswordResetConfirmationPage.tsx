import { Link } from 'react-router-dom';
import { MailCheck, ArrowRight, RefreshCw, Warehouse } from 'lucide-react';

export default function PasswordResetConfirmationPage() {
    return (
        <div className="relative flex min-h-screen w-full flex-col justify-center items-center overflow-hidden bg-background-light dark:bg-background-dark font-display text-slate-900 dark:text-white transition-colors duration-200">
            {/* Background */}
            <div className="absolute inset-0 z-0 opacity-40 pointer-events-none">
                <div className="absolute -top-[20%] -left-[10%] w-[50%] h-[50%] bg-primary/10 rounded-full blur-[120px]"></div>
                <div className="absolute top-[40%] -right-[10%] w-[40%] h-[60%] bg-[#57818e]/10 rounded-full blur-[100px]"></div>
            </div>

            <div className="relative z-10 w-full max-w-md px-4">
                {/* Logo */}
                <div className="flex justify-center mb-8">
                    <div className="flex items-center gap-2">
                        <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-primary text-white">
                            <Warehouse className="w-6 h-6" />
                        </div>
                        <span className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">Hermeos Proptech</span>
                    </div>
                </div>

                {/* Card */}
                <div className="bg-white dark:bg-surface-dark rounded-xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 dark:border-slate-800 p-8 flex flex-col items-center text-center">
                    <div className="relative mb-6">
                        <div className="absolute inset-0 bg-primary/20 rounded-full scale-150 blur-xl opacity-50"></div>
                        <div className="relative flex items-center justify-center w-20 h-20 rounded-full bg-primary/10 text-primary">
                            <MailCheck className="w-10 h-10" />
                        </div>
                    </div>

                    <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-3">Check your email</h1>
                    <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed mb-6">
                        We've sent a password reset link to <span className="font-medium text-slate-900 dark:text-slate-200">user@example.com</span>.
                        <br /><br />
                        If an account is associated with this email, you will receive instructions shortly. Please check your spam folder if you don't see it.
                    </p>

                    <div className="w-full h-px bg-slate-100 dark:bg-slate-800 mb-6"></div>

                    <Link to="/login" className="w-full flex items-center justify-center h-11 px-6 rounded-lg bg-primary hover:bg-primary/90 text-white font-semibold transition-all duration-200 shadow-sm hover:shadow-md mb-4 focus:ring-4 focus:ring-primary/20 outline-none">
                        <span className="mr-2">Back to Login</span>
                        <ArrowRight className="w-5 h-5" />
                    </Link>

                    <div className="flex flex-col gap-1 items-center">
                        <button className="text-sm font-medium text-slate-500 hover:text-primary dark:text-slate-400 dark:hover:text-primary transition-colors flex items-center gap-1 group">
                            <RefreshCw className="w-5 h-5 group-hover:rotate-180 transition-transform duration-500" />
                            Click to resend email
                        </button>
                    </div>
                </div>

                {/* Footer */}
                <footer className="mt-8 text-center">
                    <p className="text-slate-400 dark:text-slate-600 text-xs">
                        © 2024 Hermeos Proptech. Secure Asset Platform.
                    </p>
                </footer>
            </div>

            {/* Top Bar */}
            <div className="fixed top-0 left-0 w-full h-1 bg-gradient-to-r from-primary/60 via-primary to-primary/60"></div>
        </div>
    );
}

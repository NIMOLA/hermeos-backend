import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { Button } from '../../components/ui/button';
import { useAuth } from '../../contexts/AuthContext';
import { Eye, EyeOff } from 'lucide-react';

import { TwoFactorModal } from '../../components/auth/TwoFactorModal';

export default function AdminLoginPage() {
    const navigate = useNavigate();
    const { login } = useAuth();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    // 2FA State
    const [showTwoFactor, setShowTwoFactor] = useState(false);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setIsLoading(true);

        try {
            const result: any = await login(email, password);

            if (result.requires2FA) {
                setShowTwoFactor(true);
                return;
            }

            const user = result;

            // Strict Role Check for Admin Portal
            if (user?.role === 'ADMIN' || user?.role === 'SUPER_ADMIN') {
                navigate('/admin');
            } else {
                // If a regular user tries to login here, deny access
                // Do NOT redirect to dashboard.
                setError('Unauthorized access. This portal is for administrators only.');
                // Optionally logout to clear the session if it was set
                // logout(); // But login() just set it.
            }
        } catch (err: any) {
            setError(err.message || 'Login failed. Please check your credentials.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleVerifyTwoFactor = async (token: string) => {
        try {
            const user: any = await login(email, password, token);
            if (user?.role === 'ADMIN' || user?.role === 'SUPER_ADMIN') {
                navigate('/admin');
            } else {
                navigate('/dashboard');
            }
        } catch (err: any) {
            throw err; // Modal handles error display
        }
    };

    const handleSocialLogin = async (provider: 'google' | 'apple') => {
        // Disabled
        console.log(`${provider} login disabled`);
    };

    return (
        <div className="min-h-screen flex w-full relative bg-slate-900">
            {/* Back to Home */}
            <Link
                to="/"
                className="absolute top-6 left-6 z-50 flex items-center gap-2 px-3 py-2 text-slate-400 hover:text-white transition-colors bg-white/5 rounded-lg border border-white/10 hover:bg-white/10"
            >
                <span className="material-symbols-outlined text-[20px]">arrow_back</span>
                <span className="text-sm font-medium">Back to Home</span>
            </Link>

            <div className="w-full flex items-center justify-center p-4">
                <div className="w-full max-w-md bg-[#0F172A] border border-slate-700 shadow-2xl rounded-2xl overflow-hidden relative">
                    {/* Top Accent Line */}
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-red-600 to-red-900"></div>

                    <div className="p-8 sm:p-12">
                        <div className="flex flex-col items-center text-center mb-8">
                            <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mb-4">
                                <span className="material-symbols-outlined text-3xl text-red-500">admin_panel_settings</span>
                            </div>
                            <h2 className="text-2xl font-bold text-white mb-2">Admin Portal</h2>
                            <p className="text-slate-400 text-sm">
                                Restricted access. Authorized personnel only.
                            </p>
                        </div>

                        {error && (
                            <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-lg flex items-start gap-3">
                                <span className="material-symbols-outlined text-red-500 text-xl mt-0.5">error</span>
                                <p className="text-sm text-red-400">{error}</p>
                            </div>
                        )}

                        <form onSubmit={handleLogin} className="space-y-5">
                            <div>
                                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                                    Administrative Email
                                </label>
                                <div className="relative">
                                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 material-symbols-outlined text-[20px]">mail</span>
                                    <input
                                        type="email"
                                        required
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="w-full bg-slate-800/50 border border-slate-700 text-white rounded-lg pl-10 pr-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-red-500/50 focus:border-red-500 transition-all placeholder-slate-600"
                                        placeholder="admin@hermeos.com"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                                    Password
                                </label>
                                <div className="relative">
                                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 material-symbols-outlined text-[20px]">lock</span>
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        required
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="w-full bg-slate-800/50 border border-slate-700 text-white rounded-lg pl-10 pr-10 py-2.5 focus:outline-none focus:ring-2 focus:ring-red-500/50 focus:border-red-500 transition-all placeholder-slate-600"
                                        placeholder="••••••••"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300"
                                    >
                                        {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                    </button>
                                </div>
                            </div>

                            <Button
                                type="submit"
                                className="w-full bg-gradient-to-r from-red-600 to-red-800 hover:from-red-700 hover:to-red-900 text-white font-medium py-2.5 rounded-lg transition-all transform active:scale-[0.98] shadow-lg shadow-red-900/20 border-0"
                                disabled={isLoading}
                            >
                                {isLoading ? (
                                    <span className="flex items-center justify-center gap-2">
                                        <span className="size-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                                        Authenticating...
                                    </span>
                                ) : 'Access Dashboard'}
                            </Button>
                        </form>

                        <div className="mt-8 pt-6 border-t border-slate-700/50 text-center">
                            <p className="text-xs text-slate-500">
                                This system is monitored. All access attempts are logged.
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            <TwoFactorModal
                isOpen={showTwoFactor}
                onClose={() => setShowTwoFactor(false)}
                onVerify={handleVerifyTwoFactor}
                email={email}
            />
        </div>
    );
}

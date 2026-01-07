import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { Button } from '../../components/ui/button';
import { useAuth } from '../../contexts/AuthContext';
import { Eye, EyeOff } from 'lucide-react';

export default function LoginPage() {
    const navigate = useNavigate();
    const { login } = useAuth();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setIsLoading(true);

        try {
            await login(email, password);
            // Redirect based on user role or default to dashboard
            navigate('/dashboard');
        } catch (err: any) {
            setError(err.message || 'Login failed. Please check your credentials.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleSocialLogin = async (provider: 'google' | 'apple') => {
        // Disabled
        console.log(`${provider} login disabled`);
    };

    return (
        <div className="min-h-screen flex w-full relative">
            {/* Back to Landing Page */}
            <Link
                to="/"
                className="absolute top-6 left-6 z-50 flex items-center gap-2 px-3 py-2 text-slate-600 dark:text-slate-400 hover:text-primary dark:hover:text-primary bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-lg transition-all hover:shadow-md"
            >
                <span className="material-symbols-outlined text-[20px]">arrow_back</span>
                <span className="text-sm font-medium">Back to Home</span>
            </Link>

            {/* Brand Section - Hidden on Mobile */}
            <div className="hidden lg:flex w-1/2 bg-slate-900 relative overflow-hidden items-center justify-center">
                <div className="absolute inset-0 bg-cover bg-center opacity-60" style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuDKqm_3hafcwEcIR-Qmz-d51w8bXcoC9yeG04p41z5x-YlQUTefqqy9NfGBtY-u6Bo2XxxvmHJpX_NtYSuDUJmC1l_YovzXDAdG8OXsBQhw9qCDrRUoIAwDnnqKjwnz8MLimhjfEoWN8SJnsDeNZpS8a0JCpY8wzDYkwei5Ki8dpLZGRuYGV-Cnpe3NEyzMZX3WVoZC-1V-n1zMzDVtbMi6ca5IGSJWnf4qVONysTjHyGgvkCFQv5iuMvfVLEmF14bIlT9FLjNxi547")' }}></div>
                <div className="relative z-10 p-12 text-white max-w-lg">
                    <div className="mb-8">
                        <span className="material-symbols-outlined text-[48px] text-primary">apartment</span>
                    </div>
                    <h1 className="text-4xl font-bold mb-6">Acquire Premium Real Estate with Confidence.</h1>
                    <p className="text-lg text-slate-300 leading-relaxed">
                        Hermeos Proptech gives you access to high-yield residential and commercial properties across Nigeria. Track your portfolio, receive dividends, and manage assets all in one place.
                    </p>
                    <div className="mt-12 flex gap-4">
                        <div className="flex -space-x-4">
                            {[1, 2, 3, 4].map(i => (
                                <div key={i} className="w-10 h-10 rounded-full border-2 border-slate-900 bg-slate-700"></div>
                            ))}
                        </div>
                        <div className="flex flex-col justify-center">
                            <span className="text-sm font-bold text-white">2,000+ Partners</span>
                            <span className="text-xs text-slate-400">Trust Hermeos</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Login Form Section */}
            <div className="w-full lg:w-1/2 bg-white dark:bg-[#111921] px-6 py-12 flex flex-col justify-center items-center overflow-y-auto">
                <div className="w-full max-w-md space-y-8">
                    <div className="text-center lg:text-left">
                        <h2 className="text-3xl font-bold text-slate-900 dark:text-white">Welcome back</h2>
                        <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">Please enter your details to access your account.</p>
                    </div>

                    <form className="mt-8 space-y-6" onSubmit={handleLogin}>
                        {error && (
                            <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 text-sm rounded-lg">
                                {error}
                            </div>
                        )}

                        <div className="space-y-5">
                            <div>
                                <label htmlFor="email" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Email address</label>
                                <input
                                    id="email"
                                    name="email"
                                    type="email"
                                    autoComplete="email"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="appearance-none block w-full px-3 py-2.5 border border-slate-300 dark:border-slate-700 rounded-lg shadow-sm placeholder-slate-400 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm dark:bg-[#1a2632] dark:text-white"
                                    placeholder="you@example.com"
                                />
                            </div>
                            <div>
                                <div className="flex items-center justify-between mb-1.5">
                                    <label htmlFor="password" className="block text-sm font-medium text-slate-700 dark:text-slate-300">Password</label>
                                    <Link to="/forgot-password" className="text-sm font-medium text-primary hover:text-blue-500">Forgot password?</Link>
                                </div>
                                <div className="relative">
                                    <input
                                        id="password"
                                        name="password"
                                        type={showPassword ? "text" : "password"}
                                        autoComplete="current-password"
                                        required
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="appearance-none block w-full px-3 py-2.5 pr-10 border border-slate-300 dark:border-slate-700 rounded-lg shadow-sm placeholder-slate-400 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm dark:bg-[#1a2632] dark:text-white"
                                        placeholder="••••••••"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
                                    >
                                        {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                    </button>
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center">
                            <input id="remember-me" name="remember-me" type="checkbox" className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded" />
                            <label htmlFor="remember-me" className="ml-2 block text-sm text-slate-900 dark:text-slate-300">Remember me for 30 days</label>
                        </div>

                        <div>
                            <Button type="submit" className="w-full h-11 text-base" disabled={isLoading}>
                                {isLoading ? (
                                    <span className="flex items-center gap-2">
                                        <span className="size-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                                        Signing in...
                                    </span>
                                ) : 'Sign in'}
                            </Button>
                        </div>
                    </form>

                    <div className="relative">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-gray-200 dark:border-slate-700"></div>
                        </div>
                        <div className="relative flex justify-center text-sm">
                            <span className="px-2 bg-white dark:bg-[#111921] text-slate-500">Or continue with</span>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3 opacity-50 pointer-events-none">
                        <button
                            type="button"
                            disabled
                            onClick={() => handleSocialLogin('google')}
                            className="flex items-center justify-center gap-2 px-4 py-2.5 border border-slate-200 dark:border-slate-700 rounded-lg bg-slate-100 dark:bg-slate-800 cursor-not-allowed"
                        >
                            <img src="https://www.svgrepo.com/show/475656/google-color.svg" className="w-5 h-5" alt="Google" />
                            <span className="text-sm font-medium text-slate-500">Google</span>
                        </button>
                        <button
                            type="button"
                            disabled
                            onClick={() => handleSocialLogin('apple')}
                            className="flex items-center justify-center gap-2 px-4 py-2.5 border border-slate-200 dark:border-slate-700 rounded-lg bg-slate-100 dark:bg-slate-800 cursor-not-allowed"
                        >
                            <span className="material-symbols-outlined text-[20px] text-slate-500">apple</span>
                            <span className="text-sm font-medium text-slate-500">Apple</span>
                        </button>
                    </div>

                    <p className="text-center text-sm text-slate-600 dark:text-slate-400">
                        Don't have an account? <Link to="/signup" className="font-semibold text-primary hover:text-blue-500">Sign up</Link>
                    </p>

                    <div className="mt-8 pt-6 border-t border-slate-100 dark:border-slate-800 text-center">
                        <Link to="/admin" className="text-xs text-slate-400 hover:text-slate-600">Admin Portal Login</Link>
                    </div>
                </div>
            </div>
        </div>
    );
}

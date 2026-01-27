
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '../../components/ui/button';
import { useAuth } from '../../contexts/AuthContext';
import { Eye, EyeOff } from 'lucide-react';

export default function SignupPage() {
    const navigate = useNavigate();
    const { register } = useAuth();
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        password: '',
        confirmPassword: ''
    });
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        if (error) setError(null);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.name || !formData.email || !formData.password) {
            setError('Please fill in all required fields');
            return;
        }

        if (formData.password.length < 8) {
            setError('Password must be at least 8 characters');
            return;
        }

        if (formData.password !== formData.confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;
        if (!passwordRegex.test(formData.password)) {
            setError('Password must contain at least 8 characters, one uppercase, one lowercase, one number, and one special character.');
            return;
        }

        setError(null);
        setLoading(true);

        try {
            const nameParts = formData.name.trim().split(' ');
            const firstName = nameParts[0] || '';
            const lastName = nameParts.slice(1).join(' ') || 'Partner';

            await register({
                email: formData.email,
                password: formData.password,
                firstName,
                lastName,
                phone: formData.phone
            });

            // Navigate to KYC/Onboarding
            navigate('/kyc/info');
        } catch (err: any) {
            let errorMessage = err.message || 'Something went wrong. Please try again.';

            // Check for network/CORS errors (statusCode 0 indicates network failure)
            if (err.statusCode === 0) {
                errorMessage = 'Unable to connect to the server. Please check your internet connection and try again.';
            } else if (err.errors && Array.isArray(err.errors) && err.errors.length > 0) {
                errorMessage = err.errors[0].msg || err.errors[0].message || errorMessage;
            }

            setError(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    const handleSocialSignup = async (provider: 'google' | 'apple') => {
        // Disabled for security reasons - Phase 6
        console.log(`Starting ${provider} signup...`);
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
            {/* Brand Section - Testimonial Carousel */}
            <div className="hidden lg:flex w-1/2 bg-slate-900 relative overflow-hidden items-center justify-center">
                <div className="absolute inset-0 bg-cover bg-center opacity-40" style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=2070&auto=format&fit=crop")' }}></div>
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/50 to-transparent"></div>

                <div className="relative z-10 p-12 text-white max-w-lg flex flex-col justify-between h-full py-20">
                    <div>
                        <div className="flex items-center gap-2 text-primary mb-6">
                            <span className="material-symbols-outlined text-3xl">apartment</span>
                            <span className="text-2xl font-bold tracking-tight text-white">Hermeos</span>
                        </div>
                        <h1 className="text-4xl font-bold leading-tight mb-4">
                            Build Wealth, <br />
                            <span className="text-primary">Brick by Brick.</span>
                        </h1>
                    </div>

                    <div className="bg-white/10 backdrop-blur-md border border-white/10 p-6 rounded-2xl shadow-xl">
                        <div className="flex gap-1 text-yellow-400 mb-3">
                            {[1, 2, 3, 4, 5].map(i => <span key={i} className="material-symbols-outlined text-sm fill-current">star</span>)}
                        </div>
                        <p className="text-lg text-slate-200 leading-relaxed italic mb-4">
                            "I always wanted to invest in Lekki real estate but didn't have ₦50M. Hermeos let me start with ₦500k. The dashboard transparency is unmatched."
                        </p>
                        <div className="flex items-center gap-3">
                            <div className="size-10 rounded-full bg-primary flex items-center justify-center font-bold text-white">
                                OA
                            </div>
                            <div>
                                <p className="font-bold text-white">Oluwaseun A.</p>
                                <p className="text-xs text-slate-400">Bronze Partner • Joined 2024</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Signup Form Section */}
            <div className="w-full lg:w-1/2 bg-white dark:bg-[#111921] px-6 py-12 flex flex-col justify-center items-center overflow-y-auto">
                <div className="w-full max-w-md space-y-6">
                    <div className="text-center lg:text-left">
                        <h2 className="text-3xl font-bold text-slate-900 dark:text-white">Create an account</h2>
                        <p className="mt-2 text-slate-600 dark:text-slate-400">Join Hermeos PropTech today.</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-5">
                        {error && (
                            <div className="p-3 bg-red-50 border border-red-200 text-red-600 text-sm rounded-lg animate-in fade-in slide-in-from-top-1 duration-200">
                                {error}
                            </div>
                        )}

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Full Legal Name</label>
                                <input type="text" name="name" required value={formData.name} onChange={handleChange} className="w-full px-3 py-2.5 border border-slate-300 dark:border-slate-700 rounded-lg dark:bg-[#1a2632] dark:text-white focus:ring-primary focus:border-primary" placeholder="e.g. Chinedu Okeke" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Email address</label>
                                <input type="email" name="email" required value={formData.email} onChange={handleChange} className="w-full px-3 py-2.5 border border-slate-300 dark:border-slate-700 rounded-lg dark:bg-[#1a2632] dark:text-white focus:ring-primary focus:border-primary" placeholder="you@example.com" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Phone Number <span className="text-slate-400 font-normal">(Optional)</span></label>
                                <input type="tel" name="phone" value={formData.phone} onChange={handleChange} className="w-full px-3 py-2.5 border border-slate-300 dark:border-slate-700 rounded-lg dark:bg-[#1a2632] dark:text-white focus:ring-primary focus:border-primary" placeholder="+234..." />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Password</label>
                                <div className="relative">
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        name="password"
                                        required
                                        minLength={8}
                                        value={formData.password}
                                        onChange={handleChange}
                                        className="w-full px-3 py-2.5 pr-10 border border-slate-300 dark:border-slate-700 rounded-lg dark:bg-[#1a2632] dark:text-white focus:ring-primary focus:border-primary"
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
                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Confirm Password</label>
                                <div className="relative">
                                    <input
                                        type={showConfirmPassword ? "text" : "password"}
                                        name="confirmPassword"
                                        required
                                        value={formData.confirmPassword}
                                        onChange={handleChange}
                                        className="w-full px-3 py-2.5 pr-10 border border-slate-300 dark:border-slate-700 rounded-lg dark:bg-[#1a2632] dark:text-white focus:ring-primary focus:border-primary"
                                        placeholder="••••••••"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
                                    >
                                        {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                    </button>
                                </div>
                            </div>
                            <div className="flex items-start">
                                <input id="terms" type="checkbox" required className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded mt-1" />
                                <label htmlFor="terms" className="ml-2 block text-sm text-slate-600 dark:text-slate-400">
                                    I agree to the <Link to="/terms" className="font-medium text-primary hover:underline" target="_blank">Terms of Service</Link> and <Link to="/privacy" className="font-medium text-primary hover:underline" target="_blank">Privacy Policy</Link>.
                                </label>
                            </div>
                        </div>

                        <div className="pt-4">
                            <Button type="submit" className="w-full" disabled={loading}>
                                {loading ? (
                                    <span className="flex items-center justify-center gap-2">
                                        <span className="size-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                                        Creating Account...
                                    </span>
                                ) : 'Create Account'}
                            </Button>
                        </div>
                    </form>

                    <div className="relative my-6">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-gray-200 dark:border-slate-700"></div>
                        </div>
                        <div className="relative flex justify-center text-sm">
                            <span className="px-2 bg-white dark:bg-[#111921] text-slate-500">Or continue with</span>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3 pb-6 border-b border-slate-100 dark:border-slate-800 opacity-50 pointer-events-none">
                        <button
                            type="button"
                            disabled
                            onClick={() => handleSocialSignup('google')}
                            className="flex items-center justify-center gap-2 px-4 py-2.5 border border-slate-200 dark:border-slate-700 rounded-lg bg-slate-100 dark:bg-slate-800 cursor-not-allowed"
                        >
                            <img src="https://www.svgrepo.com/show/475656/google-color.svg" className="w-5 h-5" alt="Google" />
                            <span className="text-sm font-medium text-slate-500">Google</span>
                        </button>
                        <button
                            type="button"
                            disabled
                            onClick={() => handleSocialSignup('apple')}
                            className="flex items-center justify-center gap-2 px-4 py-2.5 border border-slate-200 dark:border-slate-700 rounded-lg bg-slate-100 dark:bg-slate-800 cursor-not-allowed"
                        >
                            <span className="material-symbols-outlined text-[20px] text-slate-500">apple</span>
                            <span className="text-sm font-medium text-slate-500">Apple</span>
                        </button>
                    </div>

                    <p className="text-center text-sm text-slate-600 dark:text-slate-400 mt-6">
                        Already have an account? <Link to="/login" className="font-semibold text-primary hover:text-blue-500">Sign in</Link>
                    </p>
                </div>
            </div>
        </div>
    );
}

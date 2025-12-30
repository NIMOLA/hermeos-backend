
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../../components/ui/button';
import { cn } from '../../lib/utils';

export default function SignupPage() {
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        password: '',
        confirmPassword: '',
        accountType: 'Starter'
    });
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        if (error) setError(null);
    };

    const handleNext = () => setStep((prev) => Math.min(prev + 1, 3));
    const handleBack = () => setStep((prev) => Math.max(prev - 1, 1));

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Basic validation
        if (!formData.name || !formData.email || !formData.password) {
            setError('Please fill in all required fields');
            return;
        }

        if (formData.password !== formData.confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        setError(null);
        setLoading(true);

        try {
            const nameParts = formData.name.trim().split(' ');
            const firstName = nameParts[0] || '';
            const lastName = nameParts.slice(1).join(' ') || 'Partner';

            // Map frontend tier names to backend expected values
            const tierMap: Record<string, string> = {
                'Starter': 'basic',
                'Pro': 'premium',
                'Institutional': 'institutional'
            };

            const response = await fetch('/api/auth/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email: formData.email,
                    password: formData.password,
                    firstName,
                    lastName,
                    phone: formData.phone,
                    tier: tierMap[formData.accountType] || 'basic',
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Registration failed');
            }

            localStorage.setItem('token', data.token);
            localStorage.setItem('user', JSON.stringify(data.user));

            window.location.href = '/kyc/info';
        } catch (err: any) {
            setError(err.message || 'Something went wrong. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleSocialSignup = async (provider: 'google' | 'apple') => {
        try {
            console.log(`Starting ${provider} signup...`);
            // Simulating successful social signup/login
            window.location.href = '/proceeds';
        } catch (error) {
            console.error(`${provider} signup failed:`, error);
        }
    };

    const steps = [
        { id: 1, title: 'Basic Info' },
        { id: 2, title: 'Security' },
        { id: 3, title: 'Account Type' }
    ];

    return (
        <div className="min-h-screen flex w-full">
            {/* Brand Section - Hidden on Mobile */}
            <div className="hidden lg:flex w-1/2 bg-slate-900 relative overflow-hidden items-center justify-center">
                <div className="absolute inset-0 bg-cover bg-center opacity-60" style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuDKqm_3hafcwEcIR-Qmz-d51w8bXcoC9yeG04p41z5x-YlQUTefqqy9NfGBtY-u6Bo2XxxvmHJpX_NtYSuDUJmC1l_YovzXDAdG8OXsBQhw9qCDrRUoIAwDnnqKjwnz8MLimhjfEoWN8SJnsDeNZpS8a0JCpY8wzDYkwei5Ki8dpLZGRuYGV-Cnpe3NEyzMZX3WVoZC-1V-n1zMzDVtbMi6ca5IGSJWnf4qVONysTjHyGgvkCFQv5iuMvfVLEmF14bIlT9FLjNxi547")' }}></div>
                <div className="relative z-10 p-12 text-white max-w-lg">
                    <div className="mb-8">
                        <span className="material-symbols-outlined text-[48px] text-primary">apartment</span>
                    </div>
                    <h1 className="text-4xl font-bold mb-6">Join 2,000+ Equity Partners Building Wealth.</h1>
                    <p className="text-lg text-slate-300 leading-relaxed">
                        Create your free account today and start acquiring premium real estate assets with as little as ₦500,000.
                    </p>
                </div>
            </div>

            {/* Signup Form Section */}
            <div className="w-full lg:w-1/2 bg-white dark:bg-[#111921] px-6 py-12 flex flex-col justify-center items-center overflow-y-auto">
                <div className="w-full max-w-md space-y-6">
                    <div className="text-center lg:text-left">
                        <h2 className="text-3xl font-bold text-slate-900 dark:text-white">Create an account</h2>
                        <div className="flex items-center gap-2 mt-4 mb-8">
                            {steps.map((s) => (
                                <div key={s.id} className="flex items-center gap-2">
                                    <div className={cn("size-8 rounded-full flex items-center justify-center text-sm font-bold border", step >= s.id ? "bg-primary border-primary text-white" : "border-slate-300 text-slate-500")}>
                                        {s.id}
                                    </div>
                                    <div className={cn("h-1 w-8 rounded-full", step > s.id ? "bg-primary" : "bg-slate-200")}></div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-5">
                        {error && (
                            <div className="p-3 bg-red-50 border border-red-200 text-red-600 text-sm rounded-lg animate-in fade-in slide-in-from-top-1 duration-200">
                                {error}
                            </div>
                        )}

                        {step === 1 && (
                            <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
                                <h3 className="text-lg font-bold text-slate-900 dark:text-white">Basic Information</h3>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Full Legal Name</label>
                                    <input type="text" name="name" required value={formData.name} onChange={handleChange} className="w-full px-3 py-2.5 border border-slate-300 dark:border-slate-700 rounded-lg dark:bg-[#1a2632] dark:text-white focus:ring-primary focus:border-primary" placeholder="e.g. Chinedu Okeke" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Email address</label>
                                    <input type="email" name="email" required value={formData.email} onChange={handleChange} className="w-full px-3 py-2.5 border border-slate-300 dark:border-slate-700 rounded-lg dark:bg-[#1a2632] dark:text-white focus:ring-primary focus:border-primary" placeholder="you@example.com" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Phone Number</label>
                                    <input type="tel" name="phone" value={formData.phone} onChange={handleChange} className="w-full px-3 py-2.5 border border-slate-300 dark:border-slate-700 rounded-lg dark:bg-[#1a2632] dark:text-white focus:ring-primary focus:border-primary" placeholder="+234..." />
                                </div>
                            </div>
                        )}

                        {step === 2 && (
                            <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
                                <h3 className="text-lg font-bold text-slate-900 dark:text-white">Account Security</h3>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Password</label>
                                    <input type="password" name="password" required minLength={8} value={formData.password} onChange={handleChange} className="w-full px-3 py-2.5 border border-slate-300 dark:border-slate-700 rounded-lg dark:bg-[#1a2632] dark:text-white focus:ring-primary focus:border-primary" placeholder="••••••••" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Confirm Password</label>
                                    <input type="password" name="confirmPassword" required value={formData.confirmPassword} onChange={handleChange} className="w-full px-3 py-2.5 border border-slate-300 dark:border-slate-700 rounded-lg dark:bg-[#1a2632] dark:text-white focus:ring-primary focus:border-primary" placeholder="••••••••" />
                                </div>
                                <div className="flex items-start">
                                    <input id="terms" type="checkbox" required className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded mt-1" />
                                    <label htmlFor="terms" className="ml-2 block text-sm text-slate-600 dark:text-slate-400">
                                        I agree to the <a href="#" className="font-medium text-primary hover:underline">Terms of Service</a> and <a href="#" className="font-medium text-primary hover:underline">Privacy Policy</a>.
                                    </label>
                                </div>
                            </div>
                        )}

                        {step === 3 && (
                            <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
                                <h3 className="text-lg font-bold text-slate-900 dark:text-white">Select Account Type</h3>
                                <div className="grid grid-cols-1 gap-3">
                                    {['Starter', 'Pro', 'Institutional'].map((type) => (
                                        <div key={type} className={`flex items-center p-4 border rounded-xl cursor-pointer hover:border-primary hover:bg-slate-50 dark:hover:bg-slate-800 transition-all ${formData.accountType === type ? 'border-primary bg-slate-50 dark:bg-slate-800' : 'border-slate-200 dark:border-slate-700'}`} onClick={() => setFormData({ ...formData, accountType: type })}>
                                            <input type="radio" name="accountType" checked={formData.accountType === type} readOnly className="h-4 w-4 text-primary focus:ring-primary border-gray-300" />
                                            <div className="ml-3">
                                                <span className="block text-sm font-bold text-slate-900 dark:text-white">{type} Equity Partner</span>
                                                <span className="block text-xs text-slate-500">
                                                    {type === 'Starter' ? 'Acquire up to ₦10M/year' : type === 'Pro' ? 'Acquire up to ₦100M/year + Priority Access' : 'Unlimited acquisitions + Dedicated Manager'}
                                                </span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        <div className="flex gap-3 pt-4">
                            {step > 1 && (
                                <Button type="button" variant="outline" className="flex-1" onClick={handleBack} disabled={loading}>Back</Button>
                            )}
                            {step < 3 ? (
                                <Button type="button" className="flex-1" onClick={handleNext}>Next Step</Button>
                            ) : (
                                <Button type="submit" className="flex-1" disabled={loading}>
                                    {loading ? (
                                        <span className="flex items-center gap-2">
                                            <span className="size-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                                            Creating...
                                        </span>
                                    ) : 'Create Account'}
                                </Button>
                            )}
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

                    <div className="grid grid-cols-2 gap-3 pb-6 border-b border-slate-100 dark:border-slate-800">
                        <button
                            type="button"
                            onClick={() => handleSocialSignup('google')}
                            className="flex items-center justify-center gap-2 px-4 py-2.5 border border-slate-200 dark:border-slate-700 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                        >
                            <img src="https://www.svgrepo.com/show/475656/google-color.svg" className="w-5 h-5" alt="Google" />
                            <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Google</span>
                        </button>
                        <button
                            type="button"
                            onClick={() => handleSocialSignup('apple')}
                            className="flex items-center justify-center gap-2 px-4 py-2.5 border border-slate-200 dark:border-slate-700 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                        >
                            <span className="material-symbols-outlined text-[20px]">apple</span>
                            <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Apple</span>
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

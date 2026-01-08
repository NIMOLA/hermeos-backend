
import { Link } from 'react-router-dom';
import { Button } from '../../components/ui/button';

export default function ForgotPasswordPage() {
    return (
        <div className="min-h-screen flex w-full bg-slate-50 dark:bg-background-dark items-center justify-center p-4">
            <div className="bg-white dark:bg-[#1a2632] w-full max-w-md p-8 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
                <div className="text-center mb-8">
                    <div className="bg-primary/10 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                        <span className="material-symbols-outlined text-primary text-3xl">lock_reset</span>
                    </div>
                    <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Forgot Password?</h1>
                    <p className="text-slate-500 dark:text-slate-400 mt-2 text-sm">No worries, we'll send you reset instructions.</p>
                </div>

                <form className="space-y-6">
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Email address</label>
                        <input id="email" name="email" type="email" required className="appearance-none block w-full px-3 py-2.5 border border-slate-300 dark:border-slate-700 rounded-lg shadow-sm placeholder-slate-400 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm dark:bg-[#1a2632] dark:text-white" placeholder="Enter your email" />
                    </div>

                    <Button className="w-full h-11 text-base">Reset Password</Button>
                </form>

                <div className="mt-8 text-center">
                    <Link to="/login" className="text-sm font-semibold text-slate-600 dark:text-slate-400 hover:text-primary flex items-center justify-center gap-2">
                        <span className="material-symbols-outlined text-sm">arrow_back</span>
                        Back to log in
                    </Link>
                </div>
            </div>
        </div>
    );
}


import { Link } from 'react-router-dom';
import { Button } from '../../components/ui/button';

export default function DashboardTourPage() {
    return (
        <div className="min-h-[85vh] flex flex-col items-center justify-center p-6 text-center">
            <div className="max-w-4xl w-full">
                <div className="mb-12">
                    <h1 className="text-4xl font-extrabold text-slate-900 dark:text-white mb-4">Welcome to Hermeos</h1>
                    <p className="text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
                        Your gateway to fractional real estate ownership. Here's a quick tour of what you can do on the platform.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-left">
                    <div className="bg-white dark:bg-[#1a2632] p-8 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-lg transition-shadow relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                            <span className="material-symbols-outlined text-[100px] text-primary">apartment</span>
                        </div>
                        <div className="bg-primary/10 w-12 h-12 rounded-lg flex items-center justify-center mb-6">
                            <span className="material-symbols-outlined text-primary text-2xl">apartment</span>
                        </div>
                        <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Acquire Assets</h3>
                        <p className="text-slate-500 dark:text-slate-400 text-sm mb-6 leading-relaxed">
                            Browse verified properties in the Marketplace. Buy fractions of high-yield assets starting from just 1 sqm.
                        </p>
                        <Link to="/properties" className="text-primary font-bold text-sm hover:underline">Go to Marketplace →</Link>
                    </div>

                    <div className="bg-white dark:bg-[#1a2632] p-8 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-lg transition-shadow relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                            <span className="material-symbols-outlined text-[100px] text-emerald-500">monitoring</span>
                        </div>
                        <div className="bg-emerald-100 w-12 h-12 rounded-lg flex items-center justify-center mb-6">
                            <span className="material-symbols-outlined text-emerald-600 text-2xl">monitoring</span>
                        </div>
                        <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Track Performance</h3>
                        <p className="text-slate-500 dark:text-slate-400 text-sm mb-6 leading-relaxed">
                            Monitor your portfolio value, rental yield accumulation, and capital appreciation in real-time.
                        </p>
                        <Link to="/performance" className="text-emerald-600 font-bold text-sm hover:underline">View Performance →</Link>
                    </div>

                    <div className="bg-white dark:bg-[#1a2632] p-8 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-lg transition-shadow relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                            <span className="material-symbols-outlined text-[100px] text-purple-500">account_balance_wallet</span>
                        </div>
                        <div className="bg-purple-100 w-12 h-12 rounded-lg flex items-center justify-center mb-6">
                            <span className="material-symbols-outlined text-purple-600 text-2xl">account_balance_wallet</span>
                        </div>
                        <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Manage Returns</h3>
                        <p className="text-slate-500 dark:text-slate-400 text-sm mb-6 leading-relaxed">
                            Receive rental dividends directly to your wallet. Reinvest or withdraw to your bank account instantly.
                        </p>
                        <Link to="/proceeds" className="text-purple-600 font-bold text-sm hover:underline">Check Wallet →</Link>
                    </div>
                </div>

                <div className="mt-16">
                    <Link to="/properties">
                        <Button size="lg" className="w-full sm:w-auto h-12 px-8 text-base font-bold shadow-lg shadow-primary/20">
                            Start Acquiring
                        </Button>
                    </Link>
                </div>
            </div>
        </div>
    );
}


import { Link } from 'react-router-dom';
import { Button } from '../../components/ui/button';

export default function KYCInfoPage() {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-slate-50 dark:bg-background-dark">
            <div className="max-w-2xl w-full bg-white dark:bg-[#1a2632] rounded-2xl p-8 border border-slate-200 dark:border-slate-800 shadow-sm text-center">
                <div className="bg-primary/10 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6">
                    <span className="material-symbols-outlined text-primary text-4xl">verified_user</span>
                </div>
                <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-4">Let's Get You Verified</h1>
                <p className="text-slate-600 dark:text-slate-400 mb-8 max-w-lg mx-auto">
                    To comply with Nigerian financial regulations and ensure the security of your assets, we need to verify your identity. This process typically takes less than 5 minutes.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8 text-left">
                    <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700">
                        <div className="flex items-center gap-3 mb-2">
                            <span className="material-symbols-outlined text-emerald-500">check_circle</span>
                            <h3 className="font-bold text-slate-900 dark:text-white">Why Verify?</h3>
                        </div>
                        <ul className="text-sm text-slate-600 dark:text-slate-400 space-y-2 ml-9 list-disc">
                            <li>Unlock wallet deposits & withdrawals</li>
                            <li>Legally own property fractions</li>
                            <li>Receive rental income distributions</li>
                        </ul>
                    </div>
                    <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700">
                        <div className="flex items-center gap-3 mb-2">
                            <span className="material-symbols-outlined text-blue-500">folder_open</span>
                            <h3 className="font-bold text-slate-900 dark:text-white">What You'll Need</h3>
                        </div>
                        <ul className="text-sm text-slate-600 dark:text-slate-400 space-y-2 ml-9 list-disc">
                            <li>Valid Gov ID (Passport, NIN, DL)</li>
                            <li>Proof of Address (Utility Bill)</li>
                            <li>Your Bank Verification Number (BVN)</li>
                        </ul>
                    </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Link to="/proceeds">
                        <Button variant="outline" className="w-full sm:w-auto">Do This Later</Button>
                    </Link>
                    <Link to="/kyc/status">
                        <Button className="w-full sm:w-auto px-8">Start Verification</Button>
                    </Link>
                </div>
            </div>
        </div>
    );
}

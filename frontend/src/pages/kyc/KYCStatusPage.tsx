
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../../components/ui/button';

export default function KYCStatusPage() {
    const [status, setStatus] = useState<'pending' | 'review' | 'verified'>('pending');

    const handleUpload = () => {
        // Simulate upload delay
        setTimeout(() => setStatus('review'), 1000);
    };

    return (
        <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-slate-50 dark:bg-background-dark">
            <div className="max-w-3xl w-full">
                <div className="flex items-center justify-between mb-8">
                    <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Verification Status</h1>
                    <Link to="/proceeds">
                        <Button variant="outline" className="text-xs">Skip to Dashboard</Button>
                    </Link>
                </div>

                <div className="bg-white dark:bg-[#1a2632] rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
                    <div className="p-8 border-b border-slate-200 dark:border-slate-800 text-center">
                        <div className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-bold mb-4 ${status === 'pending' ? 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400' :
                            status === 'review' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' :
                                'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400'
                            }`}>
                            <span className="material-symbols-outlined text-lg">
                                {status === 'pending' ? 'pending' : status === 'review' ? 'hourglass_top' : 'verified'}
                            </span>
                            {status === 'pending' ? 'Action Required' : status === 'review' ? 'Under Review' : 'Verified'}
                        </div>
                        <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
                            {status === 'pending' ? 'Please upload your documents' : status === 'review' ? 'We are checking your details' : 'You are fully verified!'}
                        </h2>
                        <p className="text-slate-500 dark:text-slate-400 max-w-md mx-auto">
                            {status === 'pending' ? 'Complete the steps below to unlock full platform access.' : status === 'review' ? 'This usually takes 24-48 hours. You will receive an email once complete.' : 'Thank you for completing the KYC process. You can now acquire property equity freely.'}
                        </p>
                    </div>

                    <div className="p-8">
                        <div className="space-y-6">
                            {/* Document Item 1 */}
                            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700">
                                <div className="flex items-center gap-4">
                                    <div className="bg-white dark:bg-[#1a2632] p-3 rounded-lg border border-slate-200 dark:border-slate-700">
                                        <span className="material-symbols-outlined text-slate-600 dark:text-slate-300">badge</span>
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-slate-900 dark:text-white">Government ID</h3>
                                        <p className="text-xs text-slate-500">Passport, Driver's License, or NIN</p>
                                    </div>
                                </div>
                                {status === 'pending' ? (
                                    <Button size="sm" onClick={handleUpload}><span className="material-symbols-outlined mr-2 text-lg">upload</span> Upload</Button>
                                ) : (
                                    <span className="text-emerald-500 font-bold flex items-center gap-1 text-sm"><span className="material-symbols-outlined">check</span> Submitted</span>
                                )}
                            </div>

                            {/* Document Item 2 */}
                            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700">
                                <div className="flex items-center gap-4">
                                    <div className="bg-white dark:bg-[#1a2632] p-3 rounded-lg border border-slate-200 dark:border-slate-700">
                                        <span className="material-symbols-outlined text-slate-600 dark:text-slate-300">receipt_long</span>
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-slate-900 dark:text-white">Proof of Address</h3>
                                        <p className="text-xs text-slate-500">Utility Bill or Bank Statement</p>
                                    </div>
                                </div>
                                {status === 'pending' ? (
                                    <Button size="sm" variant="outline" onClick={handleUpload}><span className="material-symbols-outlined mr-2 text-lg">upload</span> Upload</Button>
                                ) : (
                                    <span className="text-emerald-500 font-bold flex items-center gap-1 text-sm"><span className="material-symbols-outlined">check</span> Submitted</span>
                                )}
                            </div>
                        </div>
                    </div>
                    {status === 'review' && (
                        <div className="p-4 bg-blue-50 dark:bg-blue-900/10 border-t border-blue-100 dark:border-blue-900/30 text-center">
                            <Link to="/proceeds">
                                <Button>Go to Dashboard</Button>
                            </Link>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

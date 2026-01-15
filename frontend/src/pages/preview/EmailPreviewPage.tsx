import React from 'react';
import { Download, Printer, ArrowRight, ShieldCheck, CreditCard } from 'lucide-react';

const EmailPreviewPage: React.FC = () => {
    return (
        <div className="bg-slate-50 dark:bg-slate-900 min-h-screen flex flex-col items-center justify-start py-10 font-display text-slate-900 dark:text-white transition-colors duration-200">

            <div className="w-full max-w-[640px] bg-white dark:bg-slate-800 rounded-2xl shadow-xl overflow-hidden border border-slate-200 dark:border-slate-700 flex flex-col relative mx-4">
                {/* Top Accent Bar */}
                <div className="h-2 w-full bg-primary"></div>

                {/* Header */}
                <div className="px-8 pt-8 pb-4 flex justify-between items-center">
                    <div className="flex items-center gap-2">
                        <div className="h-8 w-8 bg-primary rounded-lg flex items-center justify-center text-white">
                            <ShieldCheck className="w-5 h-5" />
                        </div>
                        <span className="text-xl font-bold tracking-tight">Hermeos Proptech</span>
                    </div>
                    <a href="#" className="text-sm text-primary font-medium hover:underline">View in browser</a>
                </div>

                {/* Hero Image */}
                <div className="px-8 py-2">
                    <div className="w-full h-32 rounded-xl bg-cover bg-center overflow-hidden relative" style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuARJTpCOt_reEOVMBHOOALTebHhPCZ3Ng38gHPtsWQcJ7ol8Bc2OnG1UWxtsaaOKpxxEIVg8olnuqWLGPPfxoy-hMWEXT40Ca6qRtYoZD664nfWkSE095481DKC3tvQsFq5HyrAoDtG0RJU08psY-cxifmqA5MbOjTfNUVdlVHecpWIF4TPOF-pAv3PMRWfd9xh54rvqy52G23anE97TIy42TQBIILzs2MIl48KD6ADookD1oW0TPo64CifulCwOu_IYYOV3iMZ3ScT')" }}>
                        <div className="absolute inset-0 bg-primary/80 mix-blend-multiply"></div>
                        <div className="absolute inset-0 flex items-center px-6">
                            <h2 className="text-white text-2xl font-bold tracking-tight drop-shadow-md">Asset Acquisition Confirmed</h2>
                        </div>
                    </div>
                </div>

                {/* Greeting */}
                <div className="px-8 py-6">
                    <h1 className="text-3xl font-black leading-tight mb-4">Welcome, Alexander.</h1>
                    <p className="text-slate-500 dark:text-slate-300 text-base font-normal leading-relaxed">
                        Thank you for joining our platform. Your account has been successfully verified, and your initial deposit for the <strong>Highland Park Residency</strong> acquisition has been processed securely.
                    </p>
                </div>

                {/* Stats */}
                <div className="px-8 py-2">
                    <div className="flex flex-col sm:flex-row gap-4">
                        <div className="flex-1 flex flex-col gap-1 rounded-xl p-5 border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/50">
                            <div className="flex items-center gap-2 mb-1">
                                <ShieldCheck className="text-primary w-5 h-5" />
                                <p className="text-slate-500 text-xs font-bold uppercase tracking-wider">Membership Status</p>
                            </div>
                            <div className="flex items-center gap-2">
                                <p className="text-xl font-bold">Active Investor</p>
                                <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">Verified</span>
                            </div>
                        </div>
                        <div className="flex-1 flex flex-col gap-1 rounded-xl p-5 border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/50">
                            <div className="flex items-center gap-2 mb-1">
                                <CreditCard className="text-primary w-5 h-5" />
                                <p className="text-slate-500 text-xs font-bold uppercase tracking-wider">Member ID</p>
                            </div>
                            <p className="text-xl font-bold font-mono">#HP-88291</p>
                        </div>
                    </div>
                </div>

                {/* Receipt Table */}
                <div className="px-8 pt-8 pb-2">
                    <div className="flex items-center justify-between">
                        <h3 className="text-lg font-bold">Transaction Receipt</h3>
                        <div className="flex gap-2">
                            <button className="p-2 text-slate-400 hover:text-primary transition-colors"><Download className="w-5 h-5" /></button>
                            <button className="p-2 text-slate-400 hover:text-primary transition-colors"><Printer className="w-5 h-5" /></button>
                        </div>
                    </div>
                </div>

                <div className="px-8 pb-6">
                    <div className="flex flex-col overflow-hidden rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-slate-50 dark:bg-slate-700/50 border-b border-slate-200 dark:border-slate-700">
                                    <th className="px-6 py-3 text-slate-500 text-xs font-semibold uppercase tracking-wider">Item Details</th>
                                    <th className="px-6 py-3 text-slate-500 text-xs font-semibold uppercase tracking-wider text-right">Amount</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                                <tr>
                                    <td className="px-6 py-4">
                                        <div className="flex flex-col">
                                            <span className="text-sm font-semibold">Asset Acquisition Deposit</span>
                                            <span className="text-slate-500 text-xs">Highland Park Residency - Unit 4B</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-right align-top"><span className="text-sm font-medium font-mono">$25,000.00</span></td>
                                </tr>
                                <tr>
                                    <td className="px-6 py-4">
                                        <div className="flex flex-col">
                                            <span className="text-sm font-semibold">Processing Fee</span>
                                            <span className="text-slate-500 text-xs">Standard Tier 1 Handling</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-right align-top"><span className="text-sm font-medium font-mono">$150.00</span></td>
                                </tr>
                                <tr className="bg-primary/5 dark:bg-primary/10">
                                    <td className="px-6 py-4">
                                        <span className="text-primary dark:text-blue-300 text-sm font-bold uppercase tracking-wider">Total Paid</span>
                                        <div className="text-slate-500 text-xs mt-1">Charged to Visa ending in 4242</div>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <span className="text-primary dark:text-blue-300 text-xl font-bold font-mono">$25,150.00</span>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Footer Action */}
                <div className="px-8 pb-10 flex flex-col gap-4 items-center">
                    <button className="w-full sm:w-auto min-w-[240px] bg-primary hover:bg-primary-dark text-white font-bold py-4 px-8 rounded-lg shadow-lg flex items-center justify-center gap-2">
                        <span>Go to Dashboard</span>
                        <ArrowRight className="w-4 h-4" />
                    </button>
                    <p className="text-sm text-slate-500">Need assistance? <a href="#" className="text-primary font-semibold hover:underline">Contact Support</a></p>
                </div>

            </div>
        </div>
    );
};

export default EmailPreviewPage;

import { Card } from '../../components/ui/card';

export default function ProceedsPage() {
    return (
        <div className="w-full max-w-[1200px] mx-auto px-4 sm:px-6 py-8">
            <div className="mb-8">
                <h2 className="text-3xl md:text-4xl font-black leading-tight tracking-[-0.033em] text-slate-900 dark:text-white mb-2">
                    Proceeds & Allocations
                </h2>
                <p className="text-slate-500 dark:text-text-secondary text-base font-normal">
                    Monitor your ownership returns and proceeds from property performance.
                </p>
            </div>

            {/* KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                <Card className="flex flex-col gap-2 p-6">
                    <div className="flex items-center justify-between">
                        <p className="text-slate-500 dark:text-text-secondary text-sm font-medium uppercase tracking-wider">
                            Total Proceeds
                        </p>
                        <span className="material-symbols-outlined text-primary">account_balance_wallet</span>
                    </div>
                    <p className="text-slate-900 dark:text-white text-3xl font-bold leading-tight tracking-tight">
                        ₦ 4,500,000.00
                    </p>
                    <div className="flex items-center gap-1 text-xs text-emerald-500 mt-1">
                        <span className="material-symbols-outlined text-sm">trending_up</span>
                        <span>+12% in value realized</span>
                    </div>
                </Card>

                <Card className="flex flex-col gap-2 p-6">
                    <div className="flex items-center justify-between">
                        <p className="text-slate-500 dark:text-text-secondary text-sm font-medium uppercase tracking-wider">
                            Active Ownership
                        </p>
                        <span className="material-symbols-outlined text-primary">real_estate_agent</span>
                    </div>
                    <p className="text-slate-900 dark:text-white text-3xl font-bold leading-tight tracking-tight">
                        5 Properties
                    </p>
                    <div className="text-xs text-slate-400 dark:text-slate-500 mt-1">
                        Generating periodic yields
                    </div>
                </Card>

                <Card className="flex flex-col gap-2 p-6">
                    <div className="flex items-center justify-between">
                        <p className="text-slate-500 dark:text-text-secondary text-sm font-medium uppercase tracking-wider">
                            Upcoming Distribution
                        </p>
                        <span className="material-symbols-outlined text-primary">calendar_clock</span>
                    </div>
                    <p className="text-slate-900 dark:text-white text-3xl font-bold leading-tight tracking-tight">
                        ₦ 150,000.00
                    </p>
                    <div className="text-xs text-slate-500 dark:text-text-secondary mt-1">
                        Due Oct 25, 2024 • Ikeja Heights
                    </div>
                </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Distribution History */}
                <div className="lg:col-span-2 flex flex-col gap-6">
                    <div className="flex flex-wrap items-center justify-between gap-4">
                        <h3 className="text-xl font-bold text-slate-900 dark:text-white">Distribution History</h3>
                        <div className="flex gap-2">
                            <button className="flex h-9 items-center gap-2 rounded-lg bg-gray-100 dark:bg-border-dark px-3 hover:bg-gray-200 dark:hover:bg-[#344d65] transition-colors">
                                <span className="text-sm font-medium text-slate-700 dark:text-white">All Properties</span>
                                <span className="material-symbols-outlined text-base">expand_more</span>
                            </button>
                            <button className="flex h-9 items-center gap-2 rounded-lg bg-gray-100 dark:bg-border-dark px-3 hover:bg-gray-200 dark:hover:bg-[#344d65] transition-colors">
                                <span className="text-sm font-medium text-slate-700 dark:text-white">2024</span>
                                <span className="material-symbols-outlined text-base">expand_more</span>
                            </button>
                        </div>
                    </div>

                    <div className="flex flex-col gap-3">
                        {/* Item 1 */}
                        <div className="group flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-xl border border-gray-200 dark:border-border-dark bg-white dark:bg-surface-dark p-4 shadow-sm hover:border-primary/50 transition-colors">
                            <div className="flex items-center gap-4">
                                <div
                                    className="h-14 w-14 shrink-0 rounded-lg bg-cover bg-center"
                                    style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuB81SZYjznYYK9crTg5rAZaXQkca4whqvOb5oUJis4auNBdRwGitfRgzn2PaNLOtIO43bQxFZgL1L_LGSFs7IhBv1uBx5FIp3BzRhjcHvt1PJCTXr51sCp3L-QoFKG1tMtEE8h0NIofSewW8hYremmKudyJXnafncxfv-O_iPIzv8BHoOan8UYpQCKgildI0lZUZ5FJjJEUQTCtDjtlViiXJSi-W_uLFW1uywI30GU6Qu39R4490CgpaOnCqf3zrITZQVcsd9Ic2EBf')" }}
                                ></div>
                                <div>
                                    <h4 className="font-bold text-slate-900 dark:text-white">Lagos Mainland Apartments</h4>
                                    <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-text-secondary">
                                        <span className="material-symbols-outlined text-[16px]">calendar_today</span>
                                        <span>Q3 2024 Distribution</span>
                                    </div>
                                </div>
                            </div>
                            <div className="flex flex-col sm:items-end gap-1 pl-[72px] sm:pl-0">
                                <span className="text-lg font-bold text-slate-900 dark:text-white">₦ 250,000.00</span>
                                <span className="flex items-center gap-1 rounded bg-emerald-500/10 px-2 py-0.5 text-xs font-medium text-emerald-600 dark:text-emerald-400 w-fit">
                                    <span className="material-symbols-outlined text-[14px]">check_circle</span> Disbursed
                                </span>
                                <p className="text-[10px] text-slate-400 dark:text-slate-500 mt-1">Calculated based on purchase contribution</p>
                            </div>
                        </div>

                        {/* Item 2 */}
                        <div className="group flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-xl border border-gray-200 dark:border-border-dark bg-white dark:bg-surface-dark p-4 shadow-sm hover:border-primary/50 transition-colors">
                            <div className="flex items-center gap-4">
                                <div
                                    className="h-14 w-14 shrink-0 rounded-lg bg-cover bg-center"
                                    style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuAASfLaEIrO1POPkyu_6LgffOzQoWLT3K8kLYILZFtktzZM_yxCOiO92SwY0dT7GvFhPArK0dvALPnopoC77neeSh0LENfrIgwXdzzOkVpTQgFKVBdhH1RWxijMtzOIT-JZWeTt1MorQ_QqYikaEpnsQ7WJyVcdmWE2uVfg8jDDeRegDppmW9KsdcE2HOjC3qG7TIBkWCn6G2W9QV7naS2ppPP4h-zftvYdxvQzjDt5u6auhxn1HTbocKpVyVjNFl6pfv9qAQSievgw')" }}
                                ></div>
                                <div>
                                    <h4 className="font-bold text-slate-900 dark:text-white">Victoria Island Commercial Hub</h4>
                                    <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-text-secondary">
                                        <span className="material-symbols-outlined text-[16px]">calendar_today</span>
                                        <span>Q2 2024 Distribution</span>
                                    </div>
                                </div>
                            </div>
                            <div className="flex flex-col sm:items-end gap-1 pl-[72px] sm:pl-0">
                                <span className="text-lg font-bold text-slate-900 dark:text-white">₦ 580,000.00</span>
                                <span className="flex items-center gap-1 rounded bg-emerald-500/10 px-2 py-0.5 text-xs font-medium text-emerald-600 dark:text-emerald-400 w-fit">
                                    <span className="material-symbols-outlined text-[14px]">check_circle</span> Disbursed
                                </span>
                                <p className="text-[10px] text-slate-400 dark:text-slate-500 mt-1">Calculated based on purchase contribution</p>
                            </div>
                        </div>
                    </div>

                    <div className="flex justify-center mt-2">
                        <button className="text-sm font-bold text-primary hover:underline">View Full Statement</button>
                    </div>
                </div>

                {/* Sidebar */}
                <div className="flex flex-col gap-6">
                    <div className="rounded-xl border border-gray-200 dark:border-border-dark bg-white dark:bg-surface-dark overflow-hidden">
                        <div className="p-4 border-b border-gray-100 dark:border-border-dark bg-gray-50 dark:bg-[#202b36]">
                            <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                                <span className="material-symbols-outlined text-primary">event_upcoming</span>
                                Upcoming Distributions
                            </h3>
                        </div>
                        <div className="p-4 flex flex-col gap-4">
                            <div className="relative pl-4 border-l-2 border-primary">
                                <p className="text-xs font-semibold text-primary uppercase mb-1">Oct 25, 2024</p>
                                <h4 className="text-sm font-bold text-slate-900 dark:text-white">Ikeja Heights</h4>
                                <p className="text-xs text-slate-500 dark:text-text-secondary mt-1">Q3 2024 Yield</p>
                                <p className="text-sm font-semibold text-slate-900 dark:text-white mt-2">Est. ₦ 150,000.00</p>
                            </div>
                            <div className="relative pl-4 border-l-2 border-slate-300 dark:border-gray-700">
                                <p className="text-xs font-semibold text-slate-500 uppercase mb-1">Nov 15, 2024</p>
                                <h4 className="text-sm font-bold text-slate-900 dark:text-white">Royal Palm Residence</h4>
                                <p className="text-xs text-slate-500 dark:text-text-secondary mt-1">Q3 2024 Yield</p>
                                <p className="text-sm font-semibold text-slate-900 dark:text-white mt-2">Est. ₦ 320,000.00</p>
                            </div>
                        </div>
                    </div>

                    <div className="rounded-xl border border-primary/20 bg-primary/5 p-4">
                        <div className="flex items-start gap-3">
                            <span className="material-symbols-outlined text-primary mt-0.5">info</span>
                            <div>
                                <h4 className="text-sm font-bold text-slate-900 dark:text-white mb-1">About Your Proceeds</h4>
                                <p className="text-xs leading-relaxed text-slate-600 dark:text-text-secondary">
                                    Proceeds are derived from the actual performance of the properties you own a share of. These distributions are allocated based on your proportional ownership stake.
                                </p>
                                <a href="#" className="inline-block mt-3 text-xs font-bold text-primary hover:underline">Read Distribution Policy</a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

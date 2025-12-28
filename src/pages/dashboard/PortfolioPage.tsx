import { Link } from 'react-router-dom';

export default function PortfolioPage() {
    return (
        <div className="w-full max-w-[1440px] mx-auto px-4 md:px-8 lg:px-12 py-8">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
                <div>
                    <h1 className="text-3xl md:text-4xl font-black leading-tight tracking-[-0.033em] text-slate-900 dark:text-white mb-2">
                        My Portfolio
                    </h1>
                    <p className="text-slate-500 dark:text-text-secondary text-base font-normal">
                        Overview of your asset holdings and performance.
                    </p>
                </div>
                <button className="flex items-center gap-2 rounded-lg bg-white dark:bg-[#1a2632] border border-gray-200 dark:border-slate-700 px-4 py-2 text-sm font-bold text-slate-700 dark:text-white shadow-sm hover:bg-gray-50 dark:hover:bg-slate-800 transition-colors">
                    <span className="material-symbols-outlined text-[20px]">download</span>
                    <span>Export Portfolio</span>
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-10">
                {/* Asset Allocation Chart */}
                <div className="bg-white dark:bg-[#1a2632] rounded-xl border border-gray-200 dark:border-slate-800 p-6 shadow-sm flex flex-col items-center justify-center relative overflow-hidden">
                    <h3 className="absolute top-6 left-6 text-lg font-bold text-slate-900 dark:text-white">Asset Allocation</h3>
                    <div className="relative size-48 rounded-full mt-8" style={{ background: "conic-gradient(#197fe6 0% 45%, #10b981 45% 75%, #f59e0b 75% 100%)" }}>
                        <div className="absolute inset-4 bg-white dark:bg-[#1a2632] rounded-full flex flex-col items-center justify-center z-10">
                            <span className="text-sm text-slate-500 font-medium">Total Value</span>
                            <span className="text-2xl font-bold text-slate-900 dark:text-white">₦ 42.5M</span>
                        </div>
                    </div>
                    <div className="flex gap-4 mt-6">
                        <div className="flex items-center gap-2">
                            <span className="w-3 h-3 rounded-full bg-primary"></span>
                            <span className="text-xs font-bold text-slate-600 dark:text-slate-300">Residential (45%)</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="w-3 h-3 rounded-full bg-emerald-500"></span>
                            <span className="text-xs font-bold text-slate-600 dark:text-slate-300">Commercial (30%)</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="w-3 h-3 rounded-full bg-amber-500"></span>
                            <span className="text-xs font-bold text-slate-600 dark:text-slate-300">Industrial (25%)</span>
                        </div>
                    </div>
                </div>

                {/* Summary Stats */}
                <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="bg-white dark:bg-[#1a2632] rounded-xl p-6 border border-gray-200 dark:border-slate-800 shadow-sm flex flex-col justify-between">
                        <div className="flex justify-between items-start">
                            <div>
                                <p className="text-sm font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Total Acquisition Value</p>
                                <h3 className="text-3xl font-bold text-slate-900 dark:text-white mt-2">₦ 38,500,000</h3>
                            </div>
                            <div className="p-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg text-primary">
                                <span className="material-symbols-outlined text-2xl">account_balance</span>
                            </div>
                        </div>
                        <div className="mt-4 flex items-center gap-2 text-sm">
                            <span className="text-emerald-500 font-bold flex items-center"><span className="material-symbols-outlined text-sm">trending_up</span> +12.5%</span>
                            <span className="text-slate-400">appreciation</span>
                        </div>
                    </div>

                    <div className="bg-white dark:bg-[#1a2632] rounded-xl p-6 border border-gray-200 dark:border-slate-800 shadow-sm flex flex-col justify-between">
                        <div className="flex justify-between items-start">
                            <div>
                                <p className="text-sm font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Net Yield (YTD)</p>
                                <h3 className="text-3xl font-bold text-slate-900 dark:text-white mt-2">₦ 4,200,000</h3>
                            </div>
                            <div className="p-2 bg-emerald-50 dark:bg-emerald-900/20 rounded-lg text-emerald-600">
                                <span className="material-symbols-outlined text-2xl">payments</span>
                            </div>
                        </div>
                        <div className="mt-4 flex items-center gap-2 text-sm">
                            <span className="text-slate-500 dark:text-slate-400">Avg. Yield:</span>
                            <span className="text-slate-900 dark:text-white font-bold">10.9% p.a.</span>
                        </div>
                    </div>

                    <div className="bg-white dark:bg-[#1a2632] rounded-xl p-6 border border-gray-200 dark:border-slate-800 shadow-sm flex flex-col justify-between">
                        <div className="flex justify-between items-start">
                            <div>
                                <p className="text-sm font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Properties Owned</p>
                                <h3 className="text-3xl font-bold text-slate-900 dark:text-white mt-2">5</h3>
                            </div>
                            <div className="p-2 bg-purple-50 dark:bg-purple-900/20 rounded-lg text-purple-600">
                                <span className="material-symbols-outlined text-2xl">apartment</span>
                            </div>
                        </div>
                        <div className="mt-4 flex items-center gap-2 text-sm">
                            <span className="text-slate-500 dark:text-slate-400">Across 3 locations</span>
                        </div>
                    </div>

                    <div className="bg-gradient-to-br from-primary to-blue-600 rounded-xl p-6 shadow-lg shadow-primary/20 text-white flex flex-col justify-between group cursor-pointer relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-8 opacity-10 transform group-hover:scale-110 transition-transform duration-500">
                            <span className="material-symbols-outlined text-[100px]">add_business</span>
                        </div>
                        <div className="relative z-10">
                            <h3 className="text-xl font-bold mb-1">Expand Portfolio</h3>
                            <p className="text-blue-100 text-sm">Browse new high-yield opportunities.</p>
                        </div>
                        <div className="relative z-10 mt-4">
                            <span className="inline-flex items-center gap-1 bg-white/20 hover:bg-white/30 backdrop-blur-sm px-3 py-1.5 rounded-lg text-sm font-bold transition-colors">
                                View Marketplace <span className="material-symbols-outlined text-sm">arrow_forward</span>
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Table */}
            <div className="bg-white dark:bg-[#1a2632] border border-gray-200 dark:border-slate-800 rounded-xl shadow-sm overflow-hidden">
                <div className="px-6 py-5 border-b border-gray-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-4">
                    <h2 className="text-lg font-bold text-slate-900 dark:text-white">Active Holdings</h2>
                    <div className="relative">
                        <span className="material-symbols-outlined absolute left-3 top-2.5 text-slate-400 text-[18px]">search</span>
                        <input type="text" placeholder="Search properties..." className="pl-9 pr-4 py-2 bg-gray-50 dark:bg-slate-800 border-none rounded-lg text-sm focus:ring-2 focus:ring-primary/50 w-64" />
                    </div>
                </div>
                <div className="overflow-x-auto">
                    <div className="table-wrapper">
                        <table className="w-full text-left border-collapse">
                            <thead className="bg-gray-50 dark:bg-slate-800/50 text-slate-500 dark:text-slate-400 font-medium text-xs uppercase tracking-wider">
                                <tr>
                                    <th className="px-6 py-4">Property</th>
                                    <th className="px-6 py-4">Status</th>
                                    <th className="px-6 py-4">Ownership %</th>
                                    <th className="px-6 py-4">Current Value</th>
                                    <th className="px-6 py-4">Total Yield</th>
                                    <th className="px-6 py-4"></th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100 dark:divide-slate-700/50 text-sm">
                                {[
                                    { name: "Lekki Phase 1 Apartments", img: "https://lh3.googleusercontent.com/aida-public/AB6AXuB81SZYjznYYK9crTg5rAZaXQkca4whqvOb5oUJis4auNBdRwGitfRgzn2PaNLOtIO43bQxFZgL1L_LGSFs7IhBv1uBx5FIp3BzRhjcHvt1PJCTXr51sCp3L-QoFKG1tMtEE8h0NIofSewW8hYremmKudyJXnafncxfv-O_iPIzv8BHoOan8UYpQCKgildI0lZUZ5FJjJEUQTCvDjtlViiXJSi-W_uLFW1uywI30GU6Qu39R4490CgpaOnCqf3zrITZQVcsd9Ic2EBf", loc: "Lekki, Lagos", status: "Active", pct: "1.5%", val: "₦ 12,500,000", yield: "₦ 1,850,000" },
                                    { name: "Victoria Island Commercial Hub", img: "https://lh3.googleusercontent.com/aida-public/AB6AXuAASfLaEIrO1POPkyu_6LgffOzQoWLT3K8kLYILZFtktzZM_yxCOiO92SwY0dT7GvFhPArK0dvALPnopoC77neeSh0LENfrIgwXdzzOkVpTQgFKVBdhH1RWxijMtzOIT-JZWeTt1MorQ_QqYikaEpnsQ7WJyVcdmWE2uVfg8jDDeRegDppmW9KsdcE2HOjC3qG7TIBkWCn6G2W9QV7naS2ppPP4h-zftvYdxvQzjDt5u6auhxn1HTbocKpVyVjNFl6pfv9qAQSievgw", loc: "Victoria Island, Lagos", status: "Active", pct: "0.8%", val: "₦ 8,200,000", yield: "₦ 940,000" },
                                    { name: "Ikeja Heights", img: "https://lh3.googleusercontent.com/aida-public/AB6AXuDKqm_3hafcwEcIR-Qmz-d51w8bXcoC9yeG04p41z5x-YlQUTefqqy9NfGBtY-u6Bo2XxxvmHJpX_NtYSuDUJmC1l_YovzXDAdG8OXsBQhw9qCDrRUoIAwDnnqKjwnz8MLimhjfEoWN5SJnsDeNZpS8a0JCpY8wzDYkwei5Ki8dpLZGRuYGV-Cnpe3NEyzMZX3WVoZC-1V-n1zMzDVtbMi6ca5IGSJWnf4qVONysTjHyGgvkCFQv5iuMvfVLEmF14bIlT9FLjNxi547", loc: "Ikeja GRA, Lagos", status: "Active", pct: "2.1%", val: "₦ 15,300,000", yield: "₦ 1,200,000" },
                                    { name: "Royal Palm Residence", img: "https://lh3.googleusercontent.com/aida-public/AB6AXuD8RfIgUnna4if2aQlP1S1ckTWQq-o5LYnadiMAHaJDEDtV9sNw879mg4LOd5b_mZtkh9QUcwxpKM7jB7yBzMCGMN-29nrKoJdRUDUz9jIODt46Hie7nkNJi_1BwXS8Y1SlqGzxbZJmGyoEAh5w47dnbov7QGIhqMYmvatNu4P_hYVpndulof75g0hG7vV3SNrPbUJm8aiGUBAwi-tjts_rPRCJoXHZXkn3maXJ1UaYbPehDq_QzTAqqR0yFYr7InTsAOkjUHYaaPPW", loc: "Abuja Central", status: "Active", pct: "0.5%", val: "₦ 4,100,000", yield: "₦ 210,000" }
                                ].map((row, i) => (
                                    <tr key={i} className="hover:bg-slate-50 dark:hover:bg-slate-800/20 transition-colors group cursor-pointer">
                                        <td className="px-6 py-4">
                                            <Link to="/properties" className="flex items-center gap-4">
                                                <div className="size-10 rounded-lg bg-cover bg-center shrink-0" style={{ backgroundImage: `url('${row.img}')` }}></div>
                                                <div>
                                                    <p className="font-bold text-slate-900 dark:text-white group-hover:text-primary transition-colors">{row.name}</p>
                                                    <p className="text-xs text-slate-500 dark:text-slate-400">{row.loc}</p>
                                                </div>
                                            </Link>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="inline-flex items-center px-2 py-1 rounded bg-emerald-50 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-800 text-xs font-medium">
                                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mr-1.5"></span>
                                                {row.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 font-medium text-slate-700 dark:text-slate-300">{row.pct}</td>
                                        <td className="px-6 py-4 font-bold text-slate-900 dark:text-white">{row.val}</td>
                                        <td className="px-6 py-4 font-medium text-emerald-600 dark:text-emerald-400">{row.yield}</td>
                                        <td className="px-6 py-4">
                                            <span className="material-symbols-outlined text-slate-400 group-hover:text-primary">chevron_right</span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}

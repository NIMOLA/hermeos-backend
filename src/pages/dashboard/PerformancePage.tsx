import { Link } from 'react-router-dom';

export default function PerformancePage() {
    return (
        <div className="w-full max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {/* Breadcrumbs */}
            <div className="flex flex-wrap items-center gap-2 mb-6 text-sm">
                <Link to="/" className="text-[#4e7397] dark:text-slate-400 hover:text-primary transition-colors font-medium">Home</Link>
                <span className="material-symbols-outlined text-[16px] text-[#4e7397] dark:text-slate-500">chevron_right</span>
                <Link to="/portfolio" className="text-[#4e7397] dark:text-slate-400 hover:text-primary transition-colors font-medium">Portfolio</Link>
                <span className="material-symbols-outlined text-[16px] text-[#4e7397] dark:text-slate-500">chevron_right</span>
                <Link to="/properties" className="text-[#4e7397] dark:text-slate-400 hover:text-primary transition-colors font-medium">Lekki Phase 1 Apartments</Link>
                <span className="material-symbols-outlined text-[16px] text-[#4e7397] dark:text-slate-500">chevron_right</span>
                <span className="text-[#0e141b] dark:text-slate-100 font-semibold">Performance</span>
            </div>

            {/* Page Header & Controls */}
            <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-8">
                <div className="flex flex-col gap-2 max-w-2xl">
                    <h1 className="text-[#0e141b] dark:text-white text-3xl md:text-4xl font-extrabold leading-tight tracking-tight">Property Performance</h1>
                    <p className="text-[#4e7397] dark:text-slate-400 text-base md:text-lg font-normal">Detailed financial insights and ownership returns for <span className="font-semibold text-slate-700 dark:text-slate-300">Lekki Phase 1 Apartments</span>.</p>
                </div>
                <div className="flex flex-wrap items-center gap-3">
                    {/* Property Selector */}
                    <div className="relative group min-w-[200px]">
                        <span className="absolute inset-y-0 left-3 flex items-center pointer-events-none text-slate-500">
                            <span className="material-symbols-outlined text-[20px]">apartment</span>
                        </span>
                        <select className="w-full h-11 pl-10 pr-8 bg-white dark:bg-[#1a2632] border border-[#d0dbe7] dark:border-slate-600 rounded-lg text-sm font-medium text-[#0e141b] dark:text-slate-100 focus:ring-2 focus:ring-primary/20 focus:border-primary appearance-none cursor-pointer">
                            <option value="lekki">Lekki Phase 1 Apts</option>
                            <option value="vi">Victoria Island Heights</option>
                            <option value="ikoyi">Ikoyi Bridge View</option>
                        </select>
                        <span className="absolute inset-y-0 right-2 flex items-center pointer-events-none text-slate-500">
                            <span className="material-symbols-outlined text-[20px]">expand_more</span>
                        </span>
                    </div>
                    {/* Date Range */}
                    <div className="relative group min-w-[160px]">
                        <span className="absolute inset-y-0 left-3 flex items-center pointer-events-none text-slate-500">
                            <span className="material-symbols-outlined text-[20px]">calendar_month</span>
                        </span>
                        <select className="w-full h-11 pl-10 pr-8 bg-white dark:bg-[#1a2632] border border-[#d0dbe7] dark:border-slate-600 rounded-lg text-sm font-medium text-[#0e141b] dark:text-slate-100 focus:ring-2 focus:ring-primary/20 focus:border-primary appearance-none cursor-pointer">
                            <option value="ytd">Year to Date</option>
                            <option value="12m">Last 12 Months</option>
                            <option value="q3">Q3 2023</option>
                        </select>
                        <span className="absolute inset-y-0 right-2 flex items-center pointer-events-none text-slate-500">
                            <span className="material-symbols-outlined text-[20px]">expand_more</span>
                        </span>
                    </div>
                    {/* Download Action */}
                    <button className="flex items-center justify-center gap-2 h-11 px-5 bg-[#e7edf3] hover:bg-[#dbe4ed] dark:bg-slate-700 dark:hover:bg-slate-600 text-[#0e141b] dark:text-white text-sm font-bold rounded-lg transition-colors">
                        <span className="material-symbols-outlined text-[20px]">download</span>
                        <span>Download Report</span>
                    </button>
                </div>
            </div>

            {/* KPI Summary Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                {[
                    { title: "Total Income Generated", icon: "payments", val: "₦ 45,230,000", sub: "+12.5% vs last year", color: "primary", track: "trending_up", trackColor: "text-emerald-600" },
                    { title: "Net Distributions", icon: "account_balance_wallet", val: "₦ 3,850,000", sub: "Deposited to Wallet", color: "purple-600", bg: "bg-purple-50 dark:bg-purple-900/20", trackColor: "text-slate-400" },
                    { title: "Occupancy Rate", icon: "key", val: "94%", sub: "Above target (90%)", color: "amber-500", bg: "bg-amber-50 dark:bg-amber-900/20", track: "check_circle", trackColor: "text-emerald-600" },
                    { title: "Next Payout", icon: "event", val: "Oct 31, 2023", sub: "Approx. ₦ 245,000", color: "blue-500", bg: "bg-blue-50 dark:bg-blue-900/20", trackColor: "text-slate-400" }
                ].map((item, index) => (
                    <div key={index} className="bg-white dark:bg-[#1a2632] p-5 rounded-xl border border-slate-100 dark:border-slate-700 shadow-sm flex flex-col justify-between h-32">
                        <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
                            <span className="text-sm font-medium">{item.title}</span>
                            <span className={`material-symbols-outlined text-${item.color} ${item.bg || 'bg-primary/10'} p-1.5 rounded-lg`}>{item.icon}</span>
                        </div>
                        <div>
                            <p className="text-2xl font-extrabold text-[#0e141b] dark:text-white tracking-tight">{item.val}</p>
                            <p className={`text-xs font-medium ${item.trackColor} flex items-center gap-1 mt-1`}>
                                {item.track && <span className="material-symbols-outlined text-[14px]">{item.track}</span>}
                                {item.sub}
                            </p>
                        </div>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                {/* Income Trends Chart (CSS Only) */}
                <div className="lg:col-span-2 bg-white dark:bg-[#1a2632] p-6 rounded-xl border border-slate-100 dark:border-slate-700 shadow-sm">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="text-lg font-bold text-[#0e141b] dark:text-white">Income Trends</h3>
                        <div className="flex gap-2">
                            <span className="flex items-center gap-1.5 text-xs font-medium text-slate-500">
                                <span className="w-2 h-2 rounded-full bg-primary"></span> Revenue
                            </span>
                            <span className="flex items-center gap-1.5 text-xs font-medium text-slate-500">
                                <span className="w-2 h-2 rounded-full bg-slate-200 dark:bg-slate-600"></span> Expenses
                            </span>
                        </div>
                    </div>
                    <div className="overflow-x-auto pb-2 -mx-2 px-2 scrollbar-hide">
                        <div className="h-64 min-w-[500px] flex items-end justify-between gap-4 pt-4 border-b border-slate-200 dark:border-slate-700 relative">
                            {/* Background Grid Lines */}
                            <div className="absolute inset-0 flex flex-col justify-between pointer-events-none pb-0">
                                <div className="w-full h-px bg-slate-100 dark:bg-slate-700/50"></div>
                                <div className="w-full h-px bg-slate-100 dark:bg-slate-700/50"></div>
                                <div className="w-full h-px bg-slate-100 dark:bg-slate-700/50"></div>
                                <div className="w-full h-px bg-slate-100 dark:bg-slate-700/50"></div>
                                <div className="w-full h-px bg-transparent"></div>
                            </div>

                            {/* Bars */}
                            {[
                                { m: 'May', h1: '60%', h2: '30%', v: '₦2.4M' },
                                { m: 'Jun', h1: '75%', h2: '35%', v: '₦3.1M' },
                                { m: 'Jul', h1: '65%', h2: '40%', v: '₦2.8M' },
                                { m: 'Aug', h1: '85%', h2: '25%', v: '₦3.5M' },
                                { m: 'Sep', h1: '80%', h2: '32%', v: '₦3.3M' },
                                { m: 'Oct', h1: '92%', h2: '28%', v: '₦3.9M', active: true },
                            ].map((d, i) => (
                                <div key={i} className="flex flex-col items-center gap-2 flex-1 min-w-[60px] group cursor-pointer z-10">
                                    <div className="w-full max-w-[40px] flex items-end h-[180px] gap-1">
                                        <div
                                            className={`w-1/2 ${d.active ? 'bg-primary shadow-lg shadow-primary/20' : 'bg-primary/80 group-hover:bg-primary'} rounded-t-sm transition-all relative`}
                                            style={{ height: d.h1 }}
                                        >
                                            <div className={`${d.active ? '' : 'opacity-0 group-hover:opacity-100'} absolute -top-8 left-1/2 -translate-x-1/2 bg-slate-800 text-white text-[10px] py-1 px-2 rounded whitespace-nowrap z-20 transition-opacity`}>{d.v}</div>
                                        </div>
                                        <div
                                            className={`w-1/2 ${d.active ? 'bg-slate-300 dark:bg-slate-500' : 'bg-slate-200 dark:bg-slate-600'} rounded-t-sm`}
                                            style={{ height: d.h2 }}
                                        ></div>
                                    </div>
                                    <span className={`text-xs ${d.active ? 'text-slate-900 dark:text-white font-bold' : 'text-slate-400 font-medium'}`}>{d.m}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Allocation Chart */}
                <div className="bg-white dark:bg-[#1a2632] p-6 rounded-xl border border-slate-100 dark:border-slate-700 shadow-sm flex flex-col">
                    <h3 className="text-lg font-bold text-[#0e141b] dark:text-white mb-6">Revenue Allocations</h3>
                    <div className="flex-1 flex flex-col items-center justify-center gap-8">
                        <div className="relative size-48 rounded-full" style={{ background: "conic-gradient(#197fe6 0% 65%, #cbd5e1 65% 85%, #f59e0b 85% 100%)" }}>
                            <div className="absolute inset-4 bg-white dark:bg-[#1a2632] rounded-full flex flex-col items-center justify-center">
                                <span className="text-3xl font-bold text-[#0e141b] dark:text-white">65%</span>
                                <span className="text-xs text-slate-500 font-medium">Net Distribution</span>
                            </div>
                        </div>
                        {/* Legend */}
                        <div className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-3">
                            {[
                                { label: "Partner Distribution", val: "65%", color: "bg-[#197fe6]" },
                                { label: "Maintenance & Ops", val: "20%", color: "bg-slate-300" },
                                { label: "Proptech Fees", val: "15%", color: "bg-amber-500" }
                            ].map((l, i) => (
                                <div key={i} className="flex items-center justify-between text-sm">
                                    <div className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
                                        <span className={`size-3 rounded-full ${l.color}`}></span>
                                        <span>{l.label}</span>
                                    </div>
                                    <span className="font-bold text-[#0e141b] dark:text-white">{l.val}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Detailed Ledger Table */}
            <div className="flex flex-col bg-white dark:bg-[#1a2632] border border-slate-100 dark:border-slate-700 rounded-xl shadow-sm overflow-hidden">
                <div className="px-6 py-5 border-b border-slate-100 dark:border-slate-700 flex flex-wrap items-center justify-between gap-4">
                    <h3 className="text-lg font-bold text-[#0e141b] dark:text-white">Transaction Ledger</h3>
                    <div className="flex items-center gap-2 w-full sm:w-auto">
                        <div className="relative flex-1 sm:flex-none">
                            <span className="absolute inset-y-0 left-3 flex items-center pointer-events-none text-slate-400">
                                <span className="material-symbols-outlined text-[18px]">search</span>
                            </span>
                            <input className="pl-9 pr-4 py-2 bg-slate-50 dark:bg-slate-800 border-none rounded-lg text-sm text-[#0e141b] dark:text-white focus:ring-2 focus:ring-primary/20 w-full sm:w-48 md:w-64 placeholder:text-slate-400" placeholder="Search transactions..." type="text" />
                        </div>
                        <button className="p-2 text-slate-500 hover:text-primary hover:bg-slate-50 dark:hover:bg-slate-700 rounded-lg transition-colors">
                            <span className="material-symbols-outlined">filter_list</span>
                        </button>
                    </div>
                </div>

                {/* Desktop View */}
                <div className="hidden md:block overflow-x-auto custom-scrollbar">
                    <table className="w-full min-w-[800px] text-left border-collapse">
                        <thead className="bg-slate-50 dark:bg-slate-800/50 text-slate-500 dark:text-slate-400 font-medium text-xs uppercase tracking-wider">
                            <tr>
                                <th className="px-6 py-4">Date</th>
                                <th className="px-6 py-4">Description</th>
                                <th className="px-6 py-4">Category</th>
                                <th className="px-6 py-4">Status</th>
                                <th className="px-6 py-4 text-right">Amount (₦)</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 dark:divide-slate-700 text-sm">
                            {[
                                { date: "Oct 24, 2023", desc: "Monthly Rental Distribution - Unit 4B", cat: "Income", status: "Processing", amt: "+ ₦ 125,000.00", amtColor: "text-emerald-600 dark:text-emerald-400", catColor: "bg-emerald-50 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-400 border-emerald-100 dark:border-emerald-800", catDot: "bg-emerald-500", statusColor: "bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-300" },
                                { date: "Oct 15, 2023", desc: "Emergency Plumbing Repair - Block C", cat: "Expense", status: "Paid", amt: "- ₦ 45,000.00", amtColor: "text-slate-600 dark:text-slate-400", catColor: "bg-red-50 text-red-700 dark:bg-red-900/20 dark:text-red-400 border-red-100 dark:border-red-800", catDot: "bg-red-500", statusColor: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400" },
                                { date: "Sep 30, 2023", desc: "Q3 Quarterly Dividend Payout", cat: "Distribution", status: "Completed", amt: "+ ₦ 450,000.00", amtColor: "text-emerald-600 dark:text-emerald-400", catColor: "bg-purple-50 text-purple-700 dark:bg-purple-900/20 dark:text-purple-400 border-purple-100 dark:border-purple-800", catDot: "bg-purple-500", statusColor: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400" }
                            ].map((row, i) => (
                                <tr key={i} className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
                                    <td className="px-6 py-4 text-slate-600 dark:text-slate-300 font-medium">{row.date}</td>
                                    <td className="px-6 py-4 text-[#0e141b] dark:text-white font-medium">{row.desc}</td>
                                    <td className="px-6 py-4">
                                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${row.catColor}`}>
                                            <span className={`w-1.5 h-1.5 rounded-full ${row.catDot}`}></span>
                                            {row.cat}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium ${row.statusColor}`}>
                                            {row.status}
                                        </span>
                                    </td>
                                    <td className={`px-6 py-4 text-right font-bold ${row.amtColor}`}>{row.amt}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Mobile Card View */}
                <div className="md:hidden divide-y divide-slate-100 dark:divide-slate-800">
                    {[
                        { date: "Oct 24, 2023", desc: "Monthly Rental Distribution - Unit 4B", cat: "Income", status: "Processing", amt: "+ ₦ 125,000.00", amtColor: "text-emerald-600 dark:text-emerald-400", catColor: "bg-emerald-50 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-400 border-emerald-100 dark:border-emerald-800", catDot: "bg-emerald-500", statusColor: "bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-300" },
                        { date: "Oct 15, 2023", desc: "Emergency Plumbing Repair - Block C", cat: "Expense", status: "Paid", amt: "- ₦ 45,000.00", amtColor: "text-slate-600 dark:text-slate-400", catColor: "bg-red-50 text-red-700 dark:bg-red-900/20 dark:text-red-400 border-red-100 dark:border-red-800", catDot: "bg-red-500", statusColor: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400" },
                        { date: "Sep 30, 2023", desc: "Q3 Quarterly Dividend Payout", cat: "Distribution", status: "Completed", amt: "+ ₦ 450,000.00", amtColor: "text-emerald-600 dark:text-emerald-400", catColor: "bg-purple-50 text-purple-700 dark:bg-purple-900/20 dark:text-purple-400 border-purple-100 dark:border-purple-800", catDot: "bg-purple-500", statusColor: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400" }
                    ].map((row, i) => (
                        <div key={i} className="p-4 bg-white dark:bg-[#1a2632]">
                            <div className="flex justify-between items-start mb-2">
                                <span className="text-xs text-slate-500 font-medium">{row.date}</span>
                                <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold ${row.statusColor}`}>
                                    {row.status}
                                </span>
                            </div>
                            <h4 className="text-sm font-bold text-[#0e141b] dark:text-white mb-3">{row.desc}</h4>
                            <div className="flex justify-between items-center">
                                <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold border ${row.catColor}`}>
                                    {row.cat}
                                </span>
                                <span className={`text-sm font-bold ${row.amtColor}`}>{row.amt}</span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

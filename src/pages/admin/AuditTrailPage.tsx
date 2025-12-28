
export default function AuditTrailPage() {
    return (
        <div className="max-w-6xl mx-auto flex flex-col gap-6">
            <nav className="flex flex-wrap gap-2 items-center text-sm">
                <a href="#" className="text-slate-500 hover:text-primary transition-colors font-medium">Dashboard</a>
                <span className="text-slate-400">/</span>
                <a href="#" className="text-slate-500 hover:text-primary transition-colors font-medium">System</a>
                <span className="text-slate-400">/</span>
                <span className="text-slate-900 dark:text-white font-semibold">Audit Trail</span>
            </nav>

            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div className="flex flex-col gap-2 max-w-2xl">
                    <h1 className="text-[#0e141b] dark:text-white text-3xl md:text-4xl font-extrabold leading-tight tracking-tight">System Audit Log</h1>
                    <p className="text-[#4e7397] dark:text-slate-400 text-base md:text-lg font-normal">Track all administrative actions, data modifications, and security events.</p>
                </div>
                <div className="flex items-center gap-3">
                    <div className="relative group min-w-[160px]">
                        <span className="absolute inset-y-0 left-3 flex items-center pointer-events-none text-slate-500">
                            <span className="material-symbols-outlined text-[20px]">calendar_month</span>
                        </span>
                        <select className="w-full h-11 pl-10 pr-8 bg-white dark:bg-[#1a2632] border border-[#d0dbe7] dark:border-slate-600 rounded-lg text-sm font-medium text-[#0e141b] dark:text-slate-100 focus:ring-2 focus:ring-primary/20 focus:border-primary appearance-none cursor-pointer">
                            <option>Last 7 Days</option>
                            <option>Last 30 Days</option>
                            <option>Custom Range</option>
                        </select>
                        <span className="absolute inset-y-0 right-2 flex items-center pointer-events-none text-slate-500">
                            <span className="material-symbols-outlined text-[20px]">expand_more</span>
                        </span>
                    </div>
                    <button className="flex items-center justify-center gap-2 h-11 px-5 bg-[#e7edf3] hover:bg-[#dbe4ed] dark:bg-slate-700 dark:hover:bg-slate-600 text-[#0e141b] dark:text-white text-sm font-bold rounded-lg transition-colors">
                        <span className="material-symbols-outlined text-[20px]">download</span>
                        <span>Export Log</span>
                    </button>
                </div>
            </div>

            <div className="bg-surface-light dark:bg-surface-dark rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
                <div className="px-6 py-5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                        <span className="font-bold text-slate-900 dark:text-white">Filter by:</span>
                        <div className="flex gap-2">
                            <span className="px-3 py-1 rounded-full text-xs font-semibold bg-primary/10 text-primary border border-primary/20 cursor-pointer">All Events</span>
                            <span className="px-3 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300 border border-slate-200 dark:border-slate-700 cursor-pointer hover:bg-slate-200 dark:hover:bg-slate-700">Modifications</span>
                            <span className="px-3 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300 border border-slate-200 dark:border-slate-700 cursor-pointer hover:bg-slate-200 dark:hover:bg-slate-700">Security</span>
                            <span className="px-3 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300 border border-slate-200 dark:border-slate-700 cursor-pointer hover:bg-slate-200 dark:hover:bg-slate-700">User Access</span>
                        </div>
                    </div>
                    <div className="relative">
                        <span className="absolute inset-y-0 left-3 flex items-center pointer-events-none text-slate-400">
                            <span className="material-symbols-outlined text-[18px]">search</span>
                        </span>
                        <input className="pl-9 pr-4 py-2 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-lg text-sm text-[#0e141b] dark:text-white focus:ring-2 focus:ring-primary/20 w-64 placeholder:text-slate-400" placeholder="Search logs..." type="text" />
                    </div>
                </div>

                <div className="p-0">
                    <table className="w-full text-left border-collapse">
                        <thead className="bg-slate-50 dark:bg-slate-800/50 text-slate-500 dark:text-slate-400 font-medium text-xs uppercase tracking-wider">
                            <tr>
                                <th className="px-6 py-4 w-48">Timestamp</th>
                                <th className="px-6 py-4 w-40">User</th>
                                <th className="px-6 py-4 w-40">Action Type</th>
                                <th className="px-6 py-4">Details</th>
                                <th className="px-6 py-4 text-right">IP Address</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 dark:divide-slate-700 text-sm">
                            {[
                                { time: "Oct 24, 14:32:01", user: "Admin (You)", action: "Update Asset", detail: "Modified valuation for #PROP-LG-8821 from ₦820M to ₦850M", ip: "192.168.1.45", icon: "edit", color: "blue" },
                                { time: "Oct 24, 11:15:22", user: "Chinedu Okeke", action: "Upload Document", detail: "Uploaded C_of_O.pdf to Asset #PROP-LG-8821", ip: "105.112.44.12", icon: "upload_file", color: "purple" },
                                { time: "Oct 24, 09:45:10", user: "System", action: "Auto-Distribution", detail: "Processed Q3 Payouts for Lekki Phase 1 (Batch #9921)", ip: "System", icon: "settings_suggest", color: "slate" },
                                { time: "Oct 23, 16:20:05", user: "Admin (You)", action: "Login Success", detail: "Authentication via 2FA", ip: "192.168.1.45", icon: "login", color: "green" },
                                { time: "Oct 23, 14:10:00", user: "Sarah Johnson", action: "User Flagged", detail: "Flagged account #USER-9921 for KYC review", ip: "102.12.33.11", icon: "flag", color: "orange" },
                            ].map((row, i) => (
                                <tr key={i} className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
                                    <td className="px-6 py-4 text-slate-500 dark:text-slate-400 font-mono text-xs">{row.time}</td>
                                    <td className="px-6 py-4 font-medium text-slate-900 dark:text-white flex items-center gap-2">
                                        <div className="size-6 rounded-full bg-slate-200 dark:bg-slate-700"></div>
                                        {row.user}
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-${row.color}-50 text-${row.color}-700 dark:bg-${row.color}-900/20 dark:text-${row.color}-400 border border-${row.color}-100 dark:border-${row.color}-800`}>
                                            <span className="material-symbols-outlined text-[14px]">{row.icon}</span>
                                            {row.action}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-slate-600 dark:text-slate-300">{row.detail}</td>
                                    <td className="px-6 py-4 text-right text-slate-400 font-mono text-xs">{row.ip}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                <div className="px-6 py-4 border-t border-slate-100 dark:border-slate-700 flex items-center justify-between">
                    <p className="text-sm text-slate-500 dark:text-slate-400">Showing <span className="font-bold text-[#0e141b] dark:text-white">1-5</span> of <span className="font-bold text-[#0e141b] dark:text-white">1,240</span> events</p>
                    <div className="flex items-center gap-2">
                        <button className="p-2 border border-[#d0dbe7] dark:border-slate-600 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed">
                            <span className="material-symbols-outlined text-[18px]">chevron_left</span>
                        </button>
                        <button className="p-2 border border-[#d0dbe7] dark:border-slate-600 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700">
                            <span className="material-symbols-outlined text-[18px]">chevron_right</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

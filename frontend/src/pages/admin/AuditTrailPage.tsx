import { useState } from 'react';
import { useFetch } from '../../hooks/useApi';

export default function AuditTrailPage() {
    const [page, setPage] = useState(1);
    const { data: responseData, isLoading: loading } = useFetch<any>(`/admin/management/audit-logs?page=${page}&limit=20`);
    const logs = responseData?.data || [];
    const pagination = responseData?.pagination || { total: 0, page: 1, pages: 1 };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleString('en-US', {
            month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit', second: '2-digit'
        });
    };

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
                    <button className="flex items-center justify-center gap-2 h-11 px-5 bg-[#e7edf3] hover:bg-[#dbe4ed] dark:bg-slate-700 dark:hover:bg-slate-600 text-[#0e141b] dark:text-white text-sm font-bold rounded-lg transition-colors">
                        <span className="material-symbols-outlined text-[20px]">download</span>
                        <span>Export Log</span>
                    </button>
                </div>
            </div>

            <div className="bg-surface-light dark:bg-surface-dark rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
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
                            {loading ? (
                                <tr><td colSpan={5} className="p-8 text-center text-slate-500">Loading logs...</td></tr>
                            ) : logs.length === 0 ? (
                                <tr><td colSpan={5} className="p-8 text-center text-slate-500">No audit logs found.</td></tr>
                            ) : (
                                logs.map((row: any) => (
                                    <tr key={row.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
                                        <td className="px-6 py-4 text-slate-500 dark:text-slate-400 font-mono text-xs">{formatDate(row.createdAt)}</td>
                                        <td className="px-6 py-4 font-medium text-slate-900 dark:text-white flex items-center gap-2">
                                            <div className="size-6 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center text-xs">
                                                {row.admin?.firstName?.[0] || 'S'}
                                            </div>
                                            {row.admin ? `${row.admin.firstName} ${row.admin.lastName}` : 'System'}
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300">
                                                {row.action}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-slate-600 dark:text-slate-300">
                                            {typeof row.details === 'string' ? row.details : JSON.stringify(row.details)}
                                        </td>
                                        <td className="px-6 py-4 text-right text-slate-400 font-mono text-xs">{row.ipAddress || '-'}</td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
                <div className="px-6 py-4 border-t border-slate-100 dark:border-slate-700 flex items-center justify-between">
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                        Page <span className="font-bold text-[#0e141b] dark:text-white">{page}</span> of <span className="font-bold text-[#0e141b] dark:text-white">{pagination.pages}</span> (Total: {pagination.total})
                    </p>
                    <div className="flex items-center gap-2">
                        <button
                            disabled={page <= 1}
                            onClick={() => setPage(p => p - 1)}
                            className="p-2 border border-[#d0dbe7] dark:border-slate-600 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed">
                            <span className="material-symbols-outlined text-[18px]">chevron_left</span>
                        </button>
                        <button
                            disabled={page >= pagination.pages}
                            onClick={() => setPage(p => p + 1)}
                            className="p-2 border border-[#d0dbe7] dark:border-slate-600 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed">
                            <span className="material-symbols-outlined text-[18px]">chevron_right</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

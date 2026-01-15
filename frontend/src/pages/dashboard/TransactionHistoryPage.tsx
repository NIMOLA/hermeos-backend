import { useState } from 'react';
import { useFetch } from '../../hooks/useApi';
import { Search, Calendar, Download, MoreHorizontal, TrendingUp, TrendingDown } from 'lucide-react';

interface Transaction {
    id: string;
    reference: string;
    description: string;
    type: string;
    amount: number;
    status: string;
    createdAt: string;
    property?: { name: string };
}

export default function TransactionHistoryPage() {
    const { data, isLoading, error } = useFetch<{ data: Transaction[], pagination: any }>('/api/transactions?limit=20');
    const transactions = data?.data || [];

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN' }).format(amount);
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString();
    };

    const formatTime = (dateString: string) => {
        return new Date(dateString).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };

    return (
        <div className="flex flex-col min-h-screen bg-background-light dark:bg-background-dark font-display text-slate-900 dark:text-white pb-20">

            {/* Main Content Area in Dashboard */}
            <div className="w-full max-w-[1200px] mx-auto p-4 md:p-8 space-y-8">

                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                    <div>
                        <h1 className="text-3xl md:text-4xl font-black tracking-tight mb-2">Transaction History</h1>
                        <p className="text-slate-500 dark:text-slate-400 max-w-xl">View and manage your financial records across all your real estate assets.</p>
                    </div>
                    <button className="flex items-center justify-center h-11 px-6 bg-primary hover:bg-primary/90 text-white text-sm font-bold rounded-lg shadow-lg shadow-primary/20 transition-all active:scale-95 gap-2">
                        <Download className="w-4 h-4" /> Export CSV
                    </button>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-surface-light dark:bg-surface-dark p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-1">Total Inflow (YTD)</p>
                            <p className="text-2xl font-bold tracking-tight tabular-nums">₦ 0.00</p>
                        </div>
                        <div className="w-12 h-12 rounded-full bg-emerald-50 dark:bg-emerald-900/20 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
                            <TrendingUp className="w-6 h-6" />
                        </div>
                    </div>
                    <div className="bg-surface-light dark:bg-surface-dark p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-1">Total Outflow (YTD)</p>
                            <p className="text-2xl font-bold tracking-tight tabular-nums">₦ 0.00</p>
                        </div>
                        <div className="w-12 h-12 rounded-full bg-rose-50 dark:bg-rose-900/20 flex items-center justify-center text-rose-600 dark:text-rose-400">
                            <TrendingDown className="w-6 h-6" />
                        </div>
                    </div>
                </div>

                {/* Filters */}
                <div className="bg-surface-light dark:bg-surface-dark rounded-t-xl border border-slate-200 dark:border-slate-800 shadow-sm p-5 md:p-6">
                    <div className="flex flex-col md:flex-row gap-4 mb-6">
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                            <input className="w-full pl-10 pr-4 h-11 bg-slate-50 dark:bg-background-dark border border-slate-200 dark:border-slate-700 rounded-lg text-sm text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-primary/50" placeholder="Search by Ref ID or Description..." />
                        </div>
                        <div className="relative w-full md:w-auto md:min-w-[240px]">
                            <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                            <input className="w-full pl-10 pr-4 h-11 bg-slate-50 dark:bg-background-dark border border-slate-200 dark:border-slate-700 rounded-lg text-sm text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-primary/50" defaultValue="Date Range" />
                        </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-3 pt-5 border-t border-dashed border-slate-200 dark:border-slate-800">
                        <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase mr-1">Filter Type:</span>
                        {['All', 'Deposits', 'Purchases', 'Income', 'Withdrawals'].map((filter, i) => (
                            <button key={filter} className={`px-4 py-1.5 rounded-full text-sm font-medium border border-transparent transition-all ${i === 0 ? 'bg-primary text-white shadow-md' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'}`}>
                                {filter}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Table */}
                <div className="bg-surface-light dark:bg-surface-dark border-x border-b border-slate-200 dark:border-slate-800 rounded-b-xl shadow-sm overflow-hidden">
                    <div className="overflow-x-auto">
                        {isLoading ? (
                            <div className="p-8 text-center text-slate-500">Loading transactions...</div>
                        ) : transactions.length === 0 ? (
                            <div className="p-8 text-center text-slate-500">No transactions found.</div>
                        ) : (
                            <table className="w-full text-left border-collapse min-w-[800px]">
                                <thead>
                                    <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-white/5">
                                        <th className="py-4 px-6 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Date</th>
                                        <th className="py-4 px-6 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Ref ID</th>
                                        <th className="py-4 px-6 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Description</th>
                                        <th className="py-4 px-6 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Type</th>
                                        <th className="py-4 px-6 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider text-right">Amount</th>
                                        <th className="py-4 px-6 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider text-center">Status</th>
                                        <th className="py-4 px-4 w-10"></th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                                    {transactions.map((tx: Transaction, idx: number) => (
                                        <tr key={idx} className="group hover:bg-slate-50 dark:hover:bg-white/5 transition-colors">
                                            <td className="py-4 px-6 whitespace-nowrap">
                                                <p className="text-sm font-semibold">{formatDate(tx.createdAt)}</p>
                                                <p className="text-xs text-slate-500">{formatTime(tx.createdAt)}</p>
                                            </td>
                                            <td className="py-4 px-6 whitespace-nowrap">
                                                <span className="font-mono text-xs text-slate-500 bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded">{tx.reference.substring(0, 10)}...</span>
                                            </td>
                                            <td className="py-4 px-6">
                                                <p className="text-sm">{tx.description || (tx.property ? tx.property.name : 'Unknown Transaction')}</p>
                                            </td>
                                            <td className="py-4 px-6 whitespace-nowrap">
                                                <div className="flex items-center gap-2">
                                                    <span className="text-sm text-slate-700 dark:text-slate-300 capitalize">{tx.type.replace('_', ' ').toLowerCase()}</span>
                                                </div>
                                            </td>
                                            <td className="py-4 px-6 whitespace-nowrap text-right">
                                                <span className={`text-sm font-bold tabular-nums ${['DEPOSIT', 'INCOME', 'DISTRIBUTION'].includes(tx.type) ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-900 dark:text-white'}`}>
                                                    {['DEPOSIT', 'INCOME'].includes(tx.type) ? '+' : ''} {formatCurrency(Number(tx.amount))}
                                                </span>
                                            </td>
                                            <td className="py-4 px-6 whitespace-nowrap text-center">
                                                <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${tx.status === 'COMPLETED' ? 'bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 border-emerald-100 dark:border-emerald-800' : tx.status === 'FAILED' ? 'bg-rose-50 dark:bg-rose-900/30 text-rose-700 dark:text-rose-400 border-rose-100 dark:border-rose-800' : 'bg-amber-50 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 border-amber-100 dark:border-amber-800'}`}>
                                                    {tx.status}
                                                </span>
                                            </td>
                                            <td className="py-4 px-4 text-center">
                                                <button className="text-slate-400 hover:text-primary p-1 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800">
                                                    <MoreHorizontal className="w-5 h-5" />
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

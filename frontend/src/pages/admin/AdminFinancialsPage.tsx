import { useState, useEffect } from 'react';
import { Button } from '../../components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { apiClient } from '../../lib/api-client';

interface Transaction {
    id: string;
    type: string;
    amount: number;
    status: string;
    createdAt: string;
    user: {
        firstName: string;
        lastName: string;
    } | null;
    property: {
        name: string;
    } | null;
    fee?: number;
}

export default function AdminFinancialsPage() {
    const [selectedPeriod, setSelectedPeriod] = useState('current_month');
    const [showExportModal, setShowExportModal] = useState(false);
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchTransactions = async () => {
            try {
                const response = await apiClient.get<{ transactions: Transaction[] }>('/admin/dashboard/transactions');
                // The backend returns { data: { transactions: [...] } } but apiClient.get returns response.data if wrapped?
                // Wait, apiClient.request returns data.
                // My backend returns { success: true, data: { transactions: [...] } }
                // apiClient returns the whole JSON?
                // Let's check api-client.ts again.
                // const data = await response.json(); return data;
                // So response is { success: true, data: { transactions: [...] } }
                // But Typescript might need casting.
                // Let's assume apiClient returns the full response object as T.
                setTransactions((response as any).data.transactions);
            } catch (error) {
                console.error('Failed to fetch transactions:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchTransactions();
    }, []);

    const handleExport = (format: string) => {
        console.log(`Exporting financials as ${format}`);
        setShowExportModal(false);
        // In a real app, this would trigger a download
    };

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN' }).format(amount);
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    // Calculate KPIs from transactions
    const totalRevenue = transactions.reduce((acc, t) => acc + t.amount, 0);
    const platformFees = transactions.reduce((acc, t) => acc + (t.fee || 0), 0);
    const distributions = transactions.filter(t => t.type === 'DISTRIBUTION').reduce((acc, t) => acc + t.amount, 0);
    const pendingSettlements = transactions.filter(t => t.status === 'PENDING').reduce((acc, t) => acc + t.amount, 0);

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Financials & Reports</h1>
                    <p className="text-slate-500 dark:text-slate-400 text-sm">Platform revenue, transactions, and financial analytics</p>
                </div>
                <div className="flex gap-2">
                    <select
                        value={selectedPeriod}
                        onChange={(e) => setSelectedPeriod(e.target.value)}
                        className="px-3 py-2 border border-slate-300 dark:border-slate-700 rounded-lg bg-white dark:bg-[#111921] text-slate-700 dark:text-white text-sm outline-none focus:ring-2 focus:ring-primary"
                    >
                        <option value="current_month">This Month</option>
                        <option value="last_month">Last Month</option>
                        <option value="current_quarter">This Quarter</option>
                        <option value="current_year">This Year</option>
                    </select>
                    <Button variant="outline" size="sm" onClick={() => setShowExportModal(true)}>
                        <span className="material-symbols-outlined text-sm mr-2">download</span>
                        Export
                    </Button>
                </div>
            </div>

            {/* KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <Card>
                    <CardContent className="pt-6">
                        <div className="flex items-center justify-between mb-2">
                            <p className="text-sm font-medium text-slate-500 uppercase">Total Revenue</p>
                            <span className="material-symbols-outlined text-emerald-500">trending_up</span>
                        </div>
                        <h3 className="text-2xl font-bold text-slate-900 dark:text-white">{formatCurrency(totalRevenue)}</h3>
                        <p className="text-xs text-emerald-600 mt-1">Based on {transactions.length} transactions</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="pt-6">
                        <div className="flex items-center justify-between mb-2">
                            <p className="text-sm font-medium text-slate-500 uppercase">Platform Fees</p>
                            <span className="material-symbols-outlined text-blue-500">account_balance</span>
                        </div>
                        <h3 className="text-2xl font-bold text-slate-900 dark:text-white">{formatCurrency(platformFees)}</h3>
                        <p className="text-xs text-slate-500 mt-1">{totalRevenue > 0 ? ((platformFees / totalRevenue) * 100).toFixed(1) : 0}% fee rate</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="pt-6">
                        <div className="flex items-center justify-between mb-2">
                            <p className="text-sm font-medium text-slate-500 uppercase">Distributions Paid</p>
                            <span className="material-symbols-outlined text-purple-500">payments</span>
                        </div>
                        <h3 className="text-2xl font-bold text-slate-900 dark:text-white">{formatCurrency(distributions)}</h3>
                        <p className="text-xs text-slate-500 mt-1">Total Payouts</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="pt-6">
                        <div className="flex items-center justify-between mb-2">
                            <p className="text-sm font-medium text-slate-500 uppercase">Pending Settlements</p>
                            <span className="material-symbols-outlined text-amber-500">pending</span>
                        </div>
                        <h3 className="text-2xl font-bold text-slate-900 dark:text-white">{formatCurrency(pendingSettlements)}</h3>
                        <p className="text-xs text-amber-600 mt-1">{transactions.filter(t => t.status === 'PENDING').length} pending</p>
                    </CardContent>
                </Card>
            </div>

            {/* Revenue Breakdown & Quick Stats */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <Card className="lg:col-span-2">
                    <CardHeader>
                        <CardTitle>Revenue Sources</CardTitle>
                    </CardHeader>
                    <CardContent>
                        {transactions.length > 0 ? (
                            <div className="space-y-4">
                                {/* Improved Mock Logic for Demo Purposes if real types aren't distinguished yet */}
                                <div>
                                    <div className="flex justify-between items-center mb-2">
                                        <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Property Contributions</span>
                                        <span className="text-sm font-bold text-slate-900 dark:text-white">
                                            {formatCurrency(transactions.filter(t => t.type === 'INVESTMENT').reduce((acc, t) => acc + t.amount, 0))}
                                        </span>
                                    </div>
                                    <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2">
                                        <div className="bg-blue-500 h-2 rounded-full" style={{ width: `${totalRevenue > 0 ? (transactions.filter(t => t.type === 'INVESTMENT').reduce((acc, t) => acc + t.amount, 0) / totalRevenue) * 100 : 0}%` }}></div>
                                    </div>
                                </div>
                                <div>
                                    <div className="flex justify-between items-center mb-2">
                                        <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Wallet Deposits</span>
                                        <span className="text-sm font-bold text-slate-900 dark:text-white">
                                            {formatCurrency(transactions.filter(t => t.type === 'DEPOSIT').reduce((acc, t) => acc + t.amount, 0))}
                                        </span>
                                    </div>
                                    <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2">
                                        <div className="bg-emerald-500 h-2 rounded-full" style={{ width: `${totalRevenue > 0 ? (transactions.filter(t => t.type === 'DEPOSIT').reduce((acc, t) => acc + t.amount, 0) / totalRevenue) * 100 : 0}%` }}></div>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="text-center py-8 text-slate-500">No revenue data available for breakdown.</div>
                        )}
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Quick Stats</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex justify-between items-center py-2 border-b border-slate-100 dark:border-slate-800">
                            <span className="text-sm text-slate-500">Total Transactions</span>
                            <span className="text-sm font-bold text-slate-900 dark:text-white">{transactions.length}</span>
                        </div>
                        <div className="flex justify-between items-center py-2 border-b border-slate-100 dark:border-slate-800">
                            <span className="text-sm text-slate-500">Avg Transaction</span>
                            <span className="text-sm font-bold text-slate-900 dark:text-white">
                                {transactions.length > 0 ? formatCurrency(totalRevenue / transactions.length) : '₦0'}
                            </span>
                        </div>
                        <div className="flex justify-between items-center py-2">
                            <span className="text-sm text-slate-500">Success Rate</span>
                            <span className="text-sm font-bold text-emerald-600">
                                {transactions.length > 0
                                    ? ((transactions.filter(t => t.status === 'COMPLETED' || t.status === 'SUCCESS').length / transactions.length) * 100).toFixed(1)
                                    : 0}%
                            </span>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Transaction History */}
            <Card>
                <CardHeader>
                    <CardTitle>Recent Transactions</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="table-wrapper">
                        <table className="w-full text-left">
                            <thead className="bg-slate-50 dark:bg-slate-900/50 border-b border-slate-200 dark:border-slate-800">
                                <tr>
                                    <th className="p-4 text-xs font-bold text-slate-500 uppercase">Transaction ID</th>
                                    <th className="p-4 text-xs font-bold text-slate-500 uppercase">Date</th>
                                    <th className="p-4 text-xs font-bold text-slate-500 uppercase">Type</th>
                                    <th className="p-4 text-xs font-bold text-slate-500 uppercase">User</th>
                                    <th className="p-4 text-xs font-bold text-slate-500 uppercase">Asset</th>
                                    <th className="p-4 text-xs font-bold text-slate-500 uppercase">Amount</th>
                                    <th className="p-4 text-xs font-bold text-slate-500 uppercase">Fee</th>
                                    <th className="p-4 text-xs font-bold text-slate-500 uppercase">Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                                {loading ? (
                                    <tr>
                                        <td colSpan={8} className="p-8 text-center text-slate-500">Loading transactions...</td>
                                    </tr>
                                ) : transactions.length === 0 ? (
                                    <tr>
                                        <td colSpan={8} className="p-8 text-center text-slate-500">No transactions found</td>
                                    </tr>
                                ) : (
                                    transactions.map((txn) => (
                                        <tr key={txn.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                                            <td className="p-4 text-sm font-medium text-primary truncate max-w-[150px]" title={txn.id}>{txn.id}</td>
                                            <td className="p-4 text-sm text-slate-600 dark:text-slate-400">{formatDate(txn.createdAt)}</td>
                                            <td className="p-4">
                                                <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/20 dark:text-blue-400">
                                                    {txn.type}
                                                </Badge>
                                            </td>
                                            <td className="p-4 text-sm text-slate-600 dark:text-slate-400">
                                                {txn.user ? `${txn.user.firstName} ${txn.user.lastName}` : 'System'}
                                            </td>
                                            <td className="p-4 text-sm text-slate-600 dark:text-slate-400">
                                                {txn.property ? txn.property.name : 'N/A'}
                                            </td>
                                            <td className="p-4 text-sm font-bold text-slate-900 dark:text-white">{formatCurrency(txn.amount)}</td>
                                            <td className="p-4 text-sm text-emerald-600">{txn.fee ? formatCurrency(txn.fee) : '-'}</td>
                                            <td className="p-4">
                                                <Badge className={txn.status === 'COMPLETED' ? 'bg-emerald-100 text-emerald-700' : 'bg-orange-100 text-orange-700'}>
                                                    {txn.status}
                                                </Badge>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </CardContent>
            </Card>

            {/* Export Modal */}
            {showExportModal && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-white dark:bg-[#1a2632] rounded-xl shadow-2xl max-w-md w-full border border-slate-200 dark:border-slate-800">
                        <div className="p-6 border-b border-slate-200 dark:border-slate-800 flex justify-between items-start">
                            <div>
                                <h2 className="text-xl font-bold text-slate-900 dark:text-white">Export Financials</h2>
                                <p className="text-sm text-slate-500 mt-1">Choose export format</p>
                            </div>
                            <button
                                onClick={() => setShowExportModal(false)}
                                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
                            >
                                <span className="material-symbols-outlined">close</span>
                            </button>
                        </div>

                        <div className="p-6 space-y-3">
                            <button
                                onClick={() => handleExport('csv')}
                                className="w-full p-4 border border-slate-200 dark:border-slate-700 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors flex items-center gap-4"
                            >
                                <span className="material-symbols-outlined text-emerald-500 text-2xl">table_chart</span>
                                <div className="text-left">
                                    <p className="font-bold text-slate-900 dark:text-white">CSV Format</p>
                                    <p className="text-xs text-slate-500">Compatible with Excel & Google Sheets</p>
                                </div>
                            </button>
                            <button
                                onClick={() => handleExport('pdf')}
                                className="w-full p-4 border border-slate-200 dark:border-slate-700 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors flex items-center gap-4"
                            >
                                <span className="material-symbols-outlined text-red-500 text-2xl">picture_as_pdf</span>
                                <div className="text-left">
                                    <p className="font-bold text-slate-900 dark:text-white">PDF Report</p>
                                    <p className="text-xs text-slate-500">Formatted financial statement</p>
                                </div>
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

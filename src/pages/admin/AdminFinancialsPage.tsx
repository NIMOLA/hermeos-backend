import { useState } from 'react';
import { Button } from '../../components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';

export default function AdminFinancialsPage() {
    const [selectedPeriod, setSelectedPeriod] = useState('current_month');
    const [showExportModal, setShowExportModal] = useState(false);

    const handleExport = (format: string) => {
        console.log(`Exporting financials as ${format}`);
        setShowExportModal(false);
        // In a real app, this would trigger a download
    };

    const transactions = [
        { id: 'TXN-2024-001', date: 'Dec 23, 2024', type: 'Acquisition', user: 'Aisha Bello', asset: 'Oceanview Apartments', amount: '₦500,000', status: 'Completed', fee: '₦7,500' },
        { id: 'TXN-2024-002', date: 'Dec 22, 2024', type: 'Distribution', user: 'All Partners', asset: 'Greenfield Estate', amount: '₦2,400,000', status: 'Completed', fee: '₦0' },
        { id: 'TXN-2024-003', date: 'Dec 20, 2024', type: 'Exit', user: 'David Okafor', asset: 'Lekki Heights', amount: '₦350,000', status: 'Processing', fee: '₦5,250' },
        { id: 'TXN-2024-004', date: 'Dec 19, 2024', type: 'Acquisition', user: 'Emeka Balogun', asset: 'Victoria Island Plaza', amount: '₦1,200,000', status: 'Completed', fee: '₦18,000' },
        { id: 'TXN-2024-005', date: 'Dec 18, 2024', type: 'Wallet Deposit', user: 'John Doe', asset: 'N/A', amount: '₦750,000', status: 'Completed', fee: '₦0' },
    ];

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
                        <h3 className="text-2xl font-bold text-slate-900 dark:text-white">₦5,200,000</h3>
                        <p className="text-xs text-emerald-600 mt-1">+18% vs last month</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="pt-6">
                        <div className="flex items-center justify-between mb-2">
                            <p className="text-sm font-medium text-slate-500 uppercase">Platform Fees</p>
                            <span className="material-symbols-outlined text-blue-500">account_balance</span>
                        </div>
                        <h3 className="text-2xl font-bold text-slate-900 dark:text-white">₦78,000</h3>
                        <p className="text-xs text-slate-500 mt-1">1.5% avg fee rate</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="pt-6">
                        <div className="flex items-center justify-between mb-2">
                            <p className="text-sm font-medium text-slate-500 uppercase">Distributions Paid</p>
                            <span className="material-symbols-outlined text-purple-500">payments</span>
                        </div>
                        <h3 className="text-2xl font-bold text-slate-900 dark:text-white">₦2,400,000</h3>
                        <p className="text-xs text-slate-500 mt-1">8 properties</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="pt-6">
                        <div className="flex items-center justify-between mb-2">
                            <p className="text-sm font-medium text-slate-500 uppercase">Pending Settlements</p>
                            <span className="material-symbols-outlined text-amber-500">pending</span>
                        </div>
                        <h3 className="text-2xl font-bold text-slate-900 dark:text-white">₦350,000</h3>
                        <p className="text-xs text-amber-600 mt-1">1 exit request</p>
                    </CardContent>
                </Card>
            </div>

            {/* Revenue Breakdown */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <Card className="lg:col-span-2">
                    <CardHeader>
                        <CardTitle>Revenue Sources</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            <div>
                                <div className="flex justify-between items-center mb-2">
                                    <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Acquisition Fees</span>
                                    <span className="text-sm font-bold text-slate-900 dark:text-white">₦48,750 (62.5%)</span>
                                </div>
                                <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2">
                                    <div className="bg-blue-500 h-2 rounded-full" style={{ width: '62.5%' }}></div>
                                </div>
                            </div>
                            <div>
                                <div className="flex justify-between items-center mb-2">
                                    <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Exit Fees</span>
                                    <span className="text-sm font-bold text-slate-900 dark:text-white">₦18,250 (23.4%)</span>
                                </div>
                                <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2">
                                    <div className="bg-emerald-500 h-2 rounded-full" style={{ width: '23.4%' }}></div>
                                </div>
                            </div>
                            <div>
                                <div className="flex justify-between items-center mb-2">
                                    <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Management Fees</span>
                                    <span className="text-sm font-bold text-slate-900 dark:text-white">₦11,000 (14.1%)</span>
                                </div>
                                <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2">
                                    <div className="bg-purple-500 h-2 rounded-full" style={{ width: '14.1%' }}></div>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Quick Stats</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex justify-between items-center py-2 border-b border-slate-100 dark:border-slate-800">
                            <span className="text-sm text-slate-500">Total Transactions</span>
                            <span className="text-sm font-bold text-slate-900 dark:text-white">142</span>
                        </div>
                        <div className="flex justify-between items-center py-2 border-b border-slate-100 dark:border-slate-800">
                            <span className="text-sm text-slate-500">Avg Transaction</span>
                            <span className="text-sm font-bold text-slate-900 dark:text-white">₦36,620</span>
                        </div>
                        <div className="flex justify-between items-center py-2">
                            <span className="text-sm text-slate-500">Processing Success Rate</span>
                            <span className="text-sm font-bold text-emerald-600">98.5%</span>
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
                                {transactions.map((txn) => (
                                    <tr key={txn.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                                        <td className="p-4 text-sm font-medium text-primary">{txn.id}</td>
                                        <td className="p-4 text-sm text-slate-600 dark:text-slate-400">{txn.date}</td>
                                        <td className="p-4">
                                            <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/20 dark:text-blue-400">
                                                {txn.type}
                                            </Badge>
                                        </td>
                                        <td className="p-4 text-sm text-slate-600 dark:text-slate-400">{txn.user}</td>
                                        <td className="p-4 text-sm text-slate-600 dark:text-slate-400">{txn.asset}</td>
                                        <td className="p-4 text-sm font-bold text-slate-900 dark:text-white">{txn.amount}</td>
                                        <td className="p-4 text-sm text-emerald-600">{txn.fee}</td>
                                        <td className="p-4">
                                            <Badge className={txn.status === 'Completed' ? 'bg-emerald-100 text-emerald-700' : 'bg-orange-100 text-orange-700'}>
                                                {txn.status}
                                            </Badge>
                                        </td>
                                    </tr>
                                ))}
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

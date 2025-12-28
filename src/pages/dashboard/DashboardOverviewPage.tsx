
import { Link } from 'react-router-dom';
import { Button } from '../../components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/card';

export default function DashboardOverviewPage() {
    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 mb-2">
                <div>
                    <h1 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white leading-tight">Good Morning, Chinedu</h1>
                    <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">Here is what is happening with your portfolio today.</p>
                </div>
                <div className="flex flex-row gap-3">
                    <Link to="/properties" className="flex-1 sm:flex-none">
                        <Button variant="outline" className="w-full touch-target"><span className="material-symbols-outlined sm:mr-2">add</span> <span className="hidden sm:inline">Add Funds</span></Button>
                    </Link>
                    <Link to="/properties" className="flex-1 sm:flex-none">
                        <Button className="w-full touch-target"><span className="material-symbols-outlined sm:mr-2">search</span> <span className="hidden sm:inline">Marketplace</span></Button>
                    </Link>
                </div>
            </div>

            {/* Quick Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl p-6 text-white text-opacity-90 shadow-xl overflow-hidden relative">
                    <div className="absolute top-0 right-0 p-4 opacity-10">
                        <span className="material-symbols-outlined text-9xl">account_balance_wallet</span>
                    </div>
                    <p className="text-sm font-medium opacity-80 mb-1">Total Portfolio Value</p>
                    <h2 className="text-3xl font-bold mb-4">₦12,500,000.00</h2>
                    <div className="flex items-center gap-2 text-sm">
                        <span className="bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded text-xs font-bold flex items-center">
                            <span className="material-symbols-outlined text-sm mr-1">trending_up</span> +12.5%
                        </span>
                        <span className="opacity-60">vs last month</span>
                    </div>
                </div>

                <div className="bg-white dark:bg-[#1a2632] border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm">
                    <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-1">Total Rental Earnings</p>
                    <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">₦850,000.00</h2>
                    <Link to="/proceeds" className="text-primary text-sm font-bold hover:underline">View Distribution History</Link>
                </div>

                <div className="bg-white dark:bg-[#1a2632] border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm">
                    <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-1">Active Assets</p>
                    <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">4 Properties</h2>
                    <Link to="/portfolio" className="text-primary text-sm font-bold hover:underline">Manage Portfolio</Link>
                </div>
            </div>

            {/* Content Area */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Main Content */}
                <div className="lg:col-span-2 space-y-6">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between">
                            <CardTitle>Recent Activity</CardTitle>
                            <Button variant="ghost" size="sm">View All</Button>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                <div className="flex items-center gap-4 py-3 border-b border-slate-100 dark:border-slate-800">
                                    <div className="bg-emerald-100 text-emerald-600 p-2 rounded-full">
                                        <span className="material-symbols-outlined text-xl">payments</span>
                                    </div>
                                    <div className="flex-1">
                                        <h4 className="font-bold text-slate-900 dark:text-white text-sm">Rental Dividend Received</h4>
                                        <p className="text-xs text-slate-500">Oceanview Apartments • Q4 Distribution</p>
                                    </div>
                                    <span className="font-bold text-emerald-600">+₦125,000</span>
                                </div>
                                <div className="flex items-center gap-4 py-3 border-b border-slate-100 dark:border-slate-800">
                                    <div className="bg-blue-100 text-primary p-2 rounded-full">
                                        <span className="material-symbols-outlined text-xl">apartment</span>
                                    </div>
                                    <div className="flex-1">
                                        <h4 className="font-bold text-slate-900 dark:text-white text-sm">Unit Purchased</h4>
                                        <p className="text-xs text-slate-500">Greenfield Estate • 10 Units</p>
                                    </div>
                                    <span className="font-bold text-slate-900 dark:text-white">-₦500,000</span>
                                </div>
                                <div className="flex items-center gap-4 py-3">
                                    <div className="bg-purple-100 text-purple-600 p-2 rounded-full">
                                        <span className="material-symbols-outlined text-xl">account_balance_wallet</span>
                                    </div>
                                    <div className="flex-1">
                                        <h4 className="font-bold text-slate-900 dark:text-white text-sm">Wallet Deposit</h4>
                                        <p className="text-xs text-slate-500">Bank Transfer</p>
                                    </div>
                                    <span className="font-bold text-emerald-600">+₦1,000,000</span>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>New Opportunities</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="flex items-center gap-4 p-4 border border-slate-200 dark:border-slate-800 rounded-xl hover:border-primary transition-colors cursor-pointer group">
                                <div className="w-24 h-16 bg-slate-200 rounded-lg bg-cover bg-center shrink-0" style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuDKqm_3hafcwEcIR-Qmz-d51w8bXcoC9yeG04p41z5x-YlQUTefqqy9NfGBtY-u6Bo2XxxvmHJpX_NtYSuDUJmC1l_YovzXDAdG8OXsBQhw9qCDrRUoIAwDnnqKjwnz8MLimhjfEoWN8SJnsDeNZpS8a0JCpY8wzDYkwei5Ki8dpLZGRuYGV-Cnpe3NEyzMZX3WVoZC-1V-n1zMzDVtbMi6ca5IGSJWnf4qVONysTjHyGgvkCFQv5iuMvfVLEmF14bIlT9FLjNxi547")' }}></div>
                                <div className="flex-1">
                                    <h4 className="font-bold text-slate-900 dark:text-white group-hover:text-primary transition-colors">Lakepoint Towers, VI</h4>
                                    <p className="text-xs text-slate-500">Commercial Office • 15% Target Yield</p>
                                </div>
                                <Button size="sm" variant="outline">View</Button>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Sidebar Widgets */}
                <div className="space-y-6">
                    <Card className="bg-blue-50 dark:bg-blue-900/10 border-blue-100 dark:border-blue-900/30">
                        <CardContent className="p-6">
                            <h3 className="font-bold text-blue-900 dark:text-blue-300 mb-2">Complete Verification</h3>
                            <p className="text-sm text-blue-700 dark:text-blue-400 mb-4">Unlock higher limits and withdrawal features by completing your KYC.</p>
                            <Link to="/kyc/status">
                                <Button size="sm" className="w-full bg-blue-600 hover:bg-blue-700 text-white border-none">Check Status</Button>
                            </Link>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Market Insights</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="text-sm">
                                <p className="font-medium text-slate-900 dark:text-white">Lagos Real Estate Market Report Q4</p>
                                <p className="text-xs text-slate-500 mt-1">Property values in Lekki increased by 8%...</p>
                                <a href="#" className="flex items-center gap-1 text-primary text-xs font-bold mt-2">Read More <span className="material-symbols-outlined text-xs">arrow_forward</span></a>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}

import { Link, useParams, useSearchParams } from 'react-router-dom';
import { BarChart, Bar, PieChart, Pie, Cell, AreaChart, Area, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useFetch } from '../../hooks/useApi';

// Interfaces
interface IncomeData {
    month: string;
    revenue: number;
    expenses: number;
}

interface AllocationData {
    name: string;
    value: number;
    color: string;
    [key: string]: string | number;
}

interface Transaction {
    id: string;
    date: string;
    description: string;
    category: string;
    status: string;
    amount: number;
}

interface PerformanceData {
    property: {
        id: string;
        name: string;
        location: string;
    };
    kpis: {
        totalIncome: number;
        netDistributions: number;
        occupancyRate: number;
        nextPayout: {
            date: string;
            estimatedAmount: number;
        } | null;
    };
    incomeTrends: IncomeData[];
    allocations: {
        partnerDistribution: number;
        maintenanceOps: number;
        proptechFees: number;
    };
    transactions: Transaction[];
}

interface IncomeTrendData {
    month: string;
    income: number;
    cumulativeIncome: number;
}

// Custom tooltip for charts
const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
        return (
            <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-3 rounded-lg shadow-lg">
                <p className="text-sm font-semibold text-slate-900 dark:text-white mb-1">{label}</p>
                {payload.map((entry: any, index: number) => (
                    <p key={index} className="text-xs text-slate-600 dark:text-slate-300">
                        <span style={{ color: entry.color }} className="font-bold">{entry.name}:</span>{' '}
                        ₦{(entry.value / 1000).toFixed(1)}k
                    </p>
                ))}
            </div>
        );
    }
    return null;
};

const formatCurrency = (value: number) => {
    if (value >= 1000000) return `₦${(value / 1000000).toFixed(1)}M`;
    if (value >= 1000) return `₦${(value / 1000).toFixed(0)}k`;
    return `₦${value.toFixed(0)}`;
};

export default function PerformancePage() {
    const { propertyId } = useParams();
    const [searchParams, setSearchParams] = useSearchParams();
    const period = searchParams.get('period') || 'ytd';

    // Fetch performance data for specific property
    const { data: performanceData, isLoading: loading, error } = useFetch<PerformanceData>(
        propertyId ? `/performance/property/${propertyId}?period=${period}` : ''
    );

    // Fetch overall income trends
    const { data: incomeTrends } = useFetch<IncomeTrendData[]>('/performance/income-trends?months=12');

    // Prepare allocation data
    const allocationData: AllocationData[] = performanceData ? [
        { name: 'Partner Distribution', value: performanceData.allocations.partnerDistribution, color: '#197fe6' },
        { name: 'Maintenance & Ops', value: performanceData.allocations.maintenanceOps, color: '#cbd5e1' },
        { name: 'Proptech Fees', value: performanceData.allocations.proptechFees, color: '#f59e0b' },
    ] : [];

    const handlePeriodChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setSearchParams({ period: e.target.value });
    };

    if (loading) {
        return (
            <div className="w-full max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="animate-pulse space-y-8">
                    <div className="h-12 bg-slate-200 dark:bg-slate-700 rounded w-1/3"></div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        {[1, 2, 3, 4].map(i => (
                            <div key={i} className="h-32 bg-slate-200 dark:bg-slate-700 rounded"></div>
                        ))}
                    </div>
                    <div className="h-96 bg-slate-200 dark:bg-slate-700 rounded"></div>
                </div>
            </div>
        );
    }

    if (error || !performanceData) {
        return (
            <div className="w-full max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-6 text-center">
                    <p className="text-red-700 dark:text-red-400 font-medium">
                        {error?.message || 'Failed to load performance data'}
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="w-full max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {/* Breadcrumbs */}
            <div className="flex flex-wrap items-center gap-2 mb-6 text-sm">
                <Link to="/" className="text-[#4e7397] dark:text-slate-400 hover:text-primary transition-colors font-medium">Home</Link>
                <span className="material-symbols-outlined text-[16px] text-[#4e7397] dark:text-slate-500">chevron_right</span>
                <Link to="/portfolio" className="text-[#4e7397] dark:text-slate-400 hover:text-primary transition-colors font-medium">Portfolio</Link>
                <span className="material-symbols-outlined text-[16px] text-[#4e7397] dark:text-slate-500">chevron_right</span>
                <Link to="/properties" className="text-[#4e7397] dark:text-slate-400 hover:text-primary transition-colors font-medium">{performanceData.property.name}</Link>
                <span className="material-symbols-outlined text-[16px] text-[#4e7397] dark:text-slate-500">chevron_right</span>
                <span className="text-[#0e141b] dark:text-slate-100 font-semibold">Performance</span>
            </div>

            {/* Page Header & Controls */}
            <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-8">
                <div className="flex flex-col gap-2 max-w-2xl">
                    <h1 className="text-[#0e141b] dark:text-white text-3xl md:text-4xl font-extrabold leading-tight tracking-tight">Property Performance</h1>
                    <p className="text-[#4e7397] dark:text-slate-400 text-base md:text-lg font-normal">Detailed financial insights and ownership returns for <span className="font-semibold text-slate-700 dark:text-slate-300">{performanceData.property.name}</span>.</p>
                </div>
                <div className="flex flex-wrap items-center gap-3">
                    {/* Date Range */}
                    <div className="relative group min-w-[160px]">
                        <span className="absolute inset-y-0 left-3 flex items-center pointer-events-none text-slate-500">
                            <span className="material-symbols-outlined text-[20px]">calendar_month</span>
                        </span>
                        <select
                            value={period}
                            onChange={handlePeriodChange}
                            className="w-full h-11 pl-10 pr-8 bg-white dark:bg-[#1a2632] border border-[#d0dbe7] dark:border-slate-600 rounded-lg text-sm font-medium text-[#0e141b] dark:text-slate-100 focus:ring-2 focus:ring-primary/20 focus:border-primary appearance-none cursor-pointer">
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
                    {
                        title: "Total Income Generated",
                        icon: "payments",
                        val: formatCurrency(performanceData.kpis.totalIncome),
                        sub: "+12.5% vs last year",
                        color: "primary",
                        track: "trending_up",
                        trackColor: "text-emerald-600"
                    },
                    {
                        title: "Net Distributions",
                        icon: "account_balance_wallet",
                        val: formatCurrency(performanceData.kpis.netDistributions),
                        sub: "Deposited to Wallet",
                        color: "purple-600",
                        bg: "bg-purple-50 dark:bg-purple-900/20",
                        trackColor: "text-slate-400"
                    },
                    {
                        title: "Occupancy Rate",
                        icon: "key",
                        val: `${performanceData.kpis.occupancyRate}%`,
                        sub: "Above target (90%)",
                        color: "amber-500",
                        bg: "bg-amber-50 dark:bg-amber-900/20",
                        track: "check_circle",
                        trackColor: "text-emerald-600"
                    },
                    {
                        title: "Next Payout",
                        icon: "event",
                        val: performanceData.kpis.nextPayout ? new Date(performanceData.kpis.nextPayout.date).toLocaleDateString() : "N/A",
                        sub: performanceData.kpis.nextPayout ? `Approx. ${formatCurrency(performanceData.kpis.nextPayout.estimatedAmount)}` : "No upcoming payout",
                        color: "blue-500",
                        bg: "bg-blue-50 dark:bg-blue-900/20",
                        trackColor: "text-slate-400"
                    }
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
                {/* Income Trends Bar Chart */}
                <div className="lg:col-span-2 bg-white dark:bg-[#1a2632] p-6 rounded-xl border border-slate-100 dark:border-slate-700 shadow-sm">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="text-lg font-bold text-[#0e141b] dark:text-white">Income Trends</h3>
                        <div className="flex gap-2">
                            <span className="flex items-center gap-1.5 text-xs font-medium text-slate-500">
                                <span className="w-2 h-2 rounded-full bg-primary"></span> Revenue
                            </span>
                            <span className="flex items-center gap-1.5 text-xs font-medium text-slate-500">
                                <span className="w-2 h-2 rounded-full bg-slate-300 dark:bg-slate-600"></span> Expenses
                            </span>
                        </div>
                    </div>
                    <ResponsiveContainer width="100%" height={280}>
                        <BarChart data={performanceData.incomeTrends} margin={{ top: 5, right: 10, left: 10, bottom: 5 }}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" opacity={0.3} />
                            <XAxis
                                dataKey="month"
                                stroke="#94a3b8"
                                style={{ fontSize: '12px', fontWeight: 500 }}
                            />
                            <YAxis
                                stroke="#94a3b8"
                                style={{ fontSize: '12px' }}
                                tickFormatter={(value) => formatCurrency(value)}
                            />
                            <Tooltip content={<CustomTooltip />} />
                            <Bar dataKey="revenue" fill="#197fe6" radius={[4, 4, 0, 0]} />
                            <Bar dataKey="expenses" fill="#cbd5e1" radius={[4, 4, 0, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>

                {/* Allocation Pie Chart */}
                <div className="bg-white dark:bg-[#1a2632] p-6 rounded-xl border border-slate-100 dark:border-slate-700 shadow-sm flex flex-col">
                    <h3 className="text-lg font-bold text-[#0e141b] dark:text-white mb-6">Revenue Allocations</h3>
                    <div className="flex-1 flex flex-col items-center justify-center gap-6">
                        <ResponsiveContainer width="100%" height={200}>
                            <PieChart>
                                <Pie
                                    data={allocationData}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={60}
                                    outerRadius={80}
                                    paddingAngle={2}
                                    dataKey="value"
                                >
                                    {allocationData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} />
                                    ))}
                                </Pie>
                                <Tooltip
                                    formatter={(value: number) => `${value}%`}
                                    contentStyle={{
                                        background: '#1a2632',
                                        border: '1px solid #334155',
                                        borderRadius: '8px',
                                        fontSize: '12px'
                                    }}
                                />
                            </PieChart>
                        </ResponsiveContainer>
                        {/* Legend */}
                        <div className="w-full grid grid-cols-1 gap-3">
                            {allocationData.map((item, i) => (
                                <div key={i} className="flex items-center justify-between text-sm">
                                    <div className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
                                        <span className="size-3 rounded-full" style={{ backgroundColor: item.color }}></span>
                                        <span>{item.name}</span>
                                    </div>
                                    <span className="font-bold text-[#0e141b] dark:text-white">{item.value}%</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Cumulative Income Area Chart */}
            {incomeTrends && incomeTrends.length > 0 && (
                <div className="bg-white dark:bg-[#1a2632] p-6 rounded-xl border border-slate-100 dark:border-slate-700 shadow-sm mb-8">
                    <h3 className="text-lg font-bold text-[#0e141b] dark:text-white mb-6">Cumulative Income Growth</h3>
                    <ResponsiveContainer width="100%" height={300}>
                        <AreaChart data={incomeTrends} margin={{ top: 10, right: 10, left: 10, bottom: 5 }}>
                            <defs>
                                <linearGradient id="colorIncome" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#197fe6" stopOpacity={0.3} />
                                    <stop offset="95%" stopColor="#197fe6" stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" opacity={0.3} />
                            <XAxis
                                dataKey="month"
                                stroke="#94a3b8"
                                style={{ fontSize: '12px', fontWeight: 500 }}
                            />
                            <YAxis
                                stroke="#94a3b8"
                                style={{ fontSize: '12px' }}
                                tickFormatter={(value) => formatCurrency(value)}
                            />
                            <Tooltip content={<CustomTooltip />} />
                            <Area
                                type="monotone"
                                dataKey="cumulativeIncome"
                                stroke="#197fe6"
                                fillOpacity={1}
                                fill="url(#colorIncome)"
                                strokeWidth={2}
                            />
                            <Line
                                type="monotone"
                                dataKey="income"
                                stroke="#10b981"
                                strokeWidth={2}
                                dot={{ fill: '#10b981', r: 4 }}
                            />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            )}

            {/* Transaction Ledger */}
            <div className="flex flex-col bg-white dark:bg-[#1a2632] border border-slate-100 dark:border-slate-700 rounded-xl shadow-sm overflow-hidden">
                <div className="px-6 py-5 border-b border-slate-100 dark:border-slate-700 flex flex-wrap items-center justify-between gap-4">
                    <h3 className="text-lg font-bold text-[#0e141b] dark:text-white">Transaction Ledger</h3>
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
                            {performanceData.transactions.map((row) => {
                                const isPositive = row.amount > 0;
                                return (
                                    <tr key={row.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
                                        <td className="px-6 py-4 text-slate-600 dark:text-slate-300 font-medium">
                                            {new Date(row.date).toLocaleDateString()}
                                        </td>
                                        <td className="px-6 py-4 text-[#0e141b] dark:text-white font-medium">{row.description}</td>
                                        <td className="px-6 py-4">
                                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border bg-emerald-50 text-emerald-700 border-emerald-100">
                                                {row.category}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-green-100 text-green-700">
                                                {row.status}
                                            </span>
                                        </td>
                                        <td className={`px-6 py-4 text-right font-bold ${isPositive ? 'text-emerald-600' : 'text-slate-600'}`}>
                                            {isPositive ? '+' : '-'} {formatCurrency(Math.abs(row.amount))}
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

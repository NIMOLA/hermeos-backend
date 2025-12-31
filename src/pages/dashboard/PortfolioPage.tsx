import { Link } from 'react-router-dom';
import { useState } from 'react';
import { useFetch } from '../../hooks/useApi';

interface PortfolioSummary {
    totalValue: number;
    acquisitionValue: number;
    appreciation: number;
    netYield: number;
    averageYield: number;
    propertiesCount: number;
    locations: number;
    allocation: {
        residential: number;
        commercial: number;
        industrial: number;
    };
}

interface PropertyHolding {
    id: string;
    name: string;
    location: string;
    imageUrl: string;
    status: 'active' | 'pending' | 'exited';
    ownershipPercent: number;
    currentValue: number;
    totalYield: number;
}

export default function PortfolioPage() {
    const [searchQuery, setSearchQuery] = useState('');

    // Fetch portfolio summary
    const { data: summary, isLoading: summaryLoading } = useFetch<PortfolioSummary>('/user/portfolio/summary');

    // Fetch holdings
    const { data: holdings, isLoading: holdingsLoading } = useFetch<PropertyHolding[]>('/user/portfolio/holdings');

    // Format currency
    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-NG', {
            style: 'currency',
            currency: 'NGN',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        }).format(amount);
    };

    // Format large numbers
    const formatLargeNumber = (amount: number) => {
        if (amount >= 1000000) {
            return `₦ ${(amount / 1000000).toFixed(1)}M`;
        }
        return formatCurrency(amount);
    };

    // Filter holdings by search
    const filteredHoldings = holdings?.filter(h =>
        h.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        h.location.toLowerCase().includes(searchQuery.toLowerCase())
    ) || [];

    // Status badge styling
    const getStatusBadge = (status: string) => {
        const configs: Record<string, string> = {
            active: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-400 border-emerald-100 dark:border-emerald-800',
            pending: 'bg-orange-50 text-orange-700 dark:bg-orange-900/20 dark:text-orange-400 border-orange-100 dark:border-orange-800',
            exited: 'bg-slate-50 text-slate-700 dark:bg-slate-800 dark:text-slate-400 border-slate-100 dark:border-slate-700'
        };
        return configs[status] || configs.active;
    };

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
                    {summaryLoading ? (
                        <div className="size-48 mt-8 bg-slate-200 dark:bg-slate-700 rounded-full animate-pulse"></div>
                    ) : summary ? (
                        <>
                            <div
                                className="relative size-48 rounded-full mt-8"
                                style={{
                                    background: `conic-gradient(
                                        #197fe6 0% ${summary.allocation.residential}%, 
                                        #10b981 ${summary.allocation.residential}% ${summary.allocation.residential + summary.allocation.commercial}%, 
                                        #f59e0b ${summary.allocation.residential + summary.allocation.commercial}% 100%
                                    )`
                                }}
                            >
                                <div className="absolute inset-4 bg-white dark:bg-[#1a2632] rounded-full flex flex-col items-center justify-center z-10">
                                    <span className="text-sm text-slate-500 font-medium">Total Value</span>
                                    <span className="text-2xl font-bold text-slate-900 dark:text-white">
                                        {formatLargeNumber(summary.totalValue)}
                                    </span>
                                </div>
                            </div>
                            <div className="flex gap-4 mt-6 flex-wrap justify-center">
                                <div className="flex items-center gap-2">
                                    <span className="w-3 h-3 rounded-full bg-primary"></span>
                                    <span className="text-xs font-bold text-slate-600 dark:text-slate-300">
                                        Residential ({summary.allocation.residential}%)
                                    </span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className="w-3 h-3 rounded-full bg-emerald-500"></span>
                                    <span className="text-xs font-bold text-slate-600 dark:text-slate-300">
                                        Commercial ({summary.allocation.commercial}%)
                                    </span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className="w-3 h-3 rounded-full bg-amber-500"></span>
                                    <span className="text-xs font-bold text-slate-600 dark:text-slate-300">
                                        Industrial ({summary.allocation.industrial}%)
                                    </span>
                                </div>
                            </div>
                        </>
                    ) : null}
                </div>

                {/* Summary Stats */}
                <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="bg-white dark:bg-[#1a2632] rounded-xl p-6 border border-gray-200 dark:border-slate-800 shadow-sm flex flex-col justify-between">
                        <div className="flex justify-between items-start">
                            <div>
                                <p className="text-sm font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Total Acquisition Value</p>
                                {summaryLoading ? (
                                    <div className="h-9 w-32 bg-slate-200 dark:bg-slate-700 rounded animate-pulse mt-2"></div>
                                ) : (
                                    <h3 className="text-3xl font-bold text-slate-900 dark:text-white mt-2">
                                        {formatCurrency(summary?.acquisitionValue || 0)}
                                    </h3>
                                )}
                            </div>
                            <div className="p-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg text-primary">
                                <span className="material-symbols-outlined text-2xl">account_balance</span>
                            </div>
                        </div>
                        <div className="mt-4 flex items-center gap-2 text-sm">
                            {summary?.appreciation !== undefined && (
                                <>
                                    <span className={`font-bold flex items-center ${summary.appreciation >= 0 ? 'text-emerald-500' : 'text-red-500'}`}>
                                        <span className="material-symbols-outlined text-sm">
                                            {summary.appreciation >= 0 ? 'trending_up' : 'trending_down'}
                                        </span>
                                        {summary.appreciation >= 0 ? '+' : ''}{summary.appreciation.toFixed(1)}%
                                    </span>
                                    <span className="text-slate-400">appreciation</span>
                                </>
                            )}
                        </div>
                    </div>

                    <div className="bg-white dark:bg-[#1a2632] rounded-xl p-6 border border-gray-200 dark:border-slate-800 shadow-sm flex flex-col justify-between">
                        <div className="flex justify-between items-start">
                            <div>
                                <p className="text-sm font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Net Yield (YTD)</p>
                                {summaryLoading ? (
                                    <div className="h-9 w-32 bg-slate-200 dark:bg-slate-700 rounded animate-pulse mt-2"></div>
                                ) : (
                                    <h3 className="text-3xl font-bold text-slate-900 dark:text-white mt-2">
                                        {formatCurrency(summary?.netYield || 0)}
                                    </h3>
                                )}
                            </div>
                            <div className="p-2 bg-emerald-50 dark:bg-emerald-900/20 rounded-lg text-emerald-600">
                                <span className="material-symbols-outlined text-2xl">payments</span>
                            </div>
                        </div>
                        <div className="mt-4 flex items-center gap-2 text-sm">
                            <span className="text-slate-500 dark:text-slate-400">Avg. Yield:</span>
                            <span className="text-slate-900 dark:text-white font-bold">
                                {summary?.averageYield.toFixed(1)}% p.a.
                            </span>
                        </div>
                    </div>

                    <div className="bg-white dark:bg-[#1a2632] rounded-xl p-6 border border-gray-200 dark:border-slate-800 shadow-sm flex flex-col justify-between">
                        <div className="flex justify-between items-start">
                            <div>
                                <p className="text-sm font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Properties Owned</p>
                                {summaryLoading ? (
                                    <div className="h-9 w-16 bg-slate-200 dark:bg-slate-700 rounded animate-pulse mt-2"></div>
                                ) : (
                                    <h3 className="text-3xl font-bold text-slate-900 dark:text-white mt-2">
                                        {summary?.propertiesCount || 0}
                                    </h3>
                                )}
                            </div>
                            <div className="p-2 bg-purple-50 dark:bg-purple-900/20 rounded-lg text-purple-600">
                                <span className="material-symbols-outlined text-2xl">apartment</span>
                            </div>
                        </div>
                        <div className="mt-4 flex items-center gap-2 text-sm">
                            <span className="text-slate-500 dark:text-slate-400">
                                Across {summary?.locations || 0} locations
                            </span>
                        </div>
                    </div>

                    <Link to="/properties" className="bg-gradient-to-br from-primary to-blue-600 rounded-xl p-6 shadow-lg shadow-primary/20 text-white flex flex-col justify-between group cursor-pointer relative overflow-hidden">
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
                    </Link>
                </div>
            </div>

            {/* Table */}
            <div className="bg-white dark:bg-[#1a2632] border border-gray-200 dark:border-slate-800 rounded-xl shadow-sm overflow-hidden">
                <div className="px-6 py-5 border-b border-gray-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-4">
                    <h2 className="text-lg font-bold text-slate-900 dark:text-white">Active Holdings</h2>
                    <div className="relative">
                        <span className="material-symbols-outlined absolute left-3 top-2.5 text-slate-400 text-[18px]">search</span>
                        <input
                            type="text"
                            placeholder="Search properties..."
                            className="pl-9 pr-4 py-2 bg-gray-50 dark:bg-slate-800 border-none rounded-lg text-sm focus:ring-2 focus:ring-primary/50 w-64"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
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
                                {holdingsLoading ? (
                                    [...Array(4)].map((_, i) => (
                                        <tr key={i}>
                                            <td className="px-6 py-4" colSpan={6}>
                                                <div className="flex items-center gap-4">
                                                    <div className="size-10 rounded-lg bg-slate-200 dark:bg-slate-700 animate-pulse"></div>
                                                    <div className="flex-1 space-y-2">
                                                        <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-48 animate-pulse"></div>
                                                        <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded w-32 animate-pulse"></div>
                                                    </div>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                ) : filteredHoldings.length > 0 ? (
                                    filteredHoldings.map((holding) => (
                                        <tr key={holding.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/20 transition-colors group cursor-pointer">
                                            <td className="px-6 py-4">
                                                <Link to={`/properties/${holding.id}`} className="flex items-center gap-4">
                                                    <div className="size-10 rounded-lg bg-cover bg-center shrink-0" style={{ backgroundImage: `url('${holding.imageUrl}')` }}></div>
                                                    <div>
                                                        <p className="font-bold text-slate-900 dark:text-white group-hover:text-primary transition-colors">{holding.name}</p>
                                                        <p className="text-xs text-slate-500 dark:text-slate-400">{holding.location}</p>
                                                    </div>
                                                </Link>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className={`inline-flex items-center px-2 py-1 rounded border text-xs font-medium ${getStatusBadge(holding.status)}`}>
                                                    <span className={`w-1.5 h-1.5 rounded-full mr-1.5 ${holding.status === 'active' ? 'bg-emerald-500' : holding.status === 'pending' ? 'bg-orange-500' : 'bg-slate-500'}`}></span>
                                                    {holding.status.charAt(0).toUpperCase() + holding.status.slice(1)}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 font-medium text-slate-700 dark:text-slate-300">
                                                {holding.ownershipPercent.toFixed(2)}%
                                            </td>
                                            <td className="px-6 py-4 font-bold text-slate-900 dark:text-white">
                                                {formatCurrency(holding.currentValue)}
                                            </td>
                                            <td className="px-6 py-4 font-medium text-emerald-600 dark:text-emerald-400">
                                                {formatCurrency(holding.totalYield)}
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className="material-symbols-outlined text-slate-400 group-hover:text-primary">chevron_right</span>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={6} className="px-6 py-12 text-center">
                                            <div className="flex flex-col items-center justify-center text-slate-500">
                                                <span className="material-symbols-outlined text-6xl mb-4 opacity-50">search_off</span>
                                                <p className="text-sm font-medium">No properties found</p>
                                                <p className="text-xs mt-1">Try adjusting your search</p>
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}

import { Link } from 'react-router-dom';
import { useState, useMemo } from 'react';
import { useFetch } from '../../hooks/useApi';

interface MarketplaceProperty {
    id: string;
    name: string;
    location: string;
    type: 'Residential' | 'Commercial' | 'Industrial' | 'Mixed Use';
    targetYield: string;
    minInvestment: number;
    imageUrl: string;
    fundingProgress: number;
    status: 'open' | 'funding' | 'closed';
}

export default function PropertiesListPage() {
    const [selectedType, setSelectedType] = useState<string>('all');
    const [searchQuery, setSearchQuery] = useState('');

    // Fetch marketplace properties
    const { data: properties, isLoading } = useFetch<MarketplaceProperty[]>('/properties/marketplace');

    // Format currency
    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-NG', {
            style: 'currency',
            currency: 'NGN',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        }).format(amount);
    };

    // Filter properties
    const filteredProperties = useMemo(() => {
        if (!properties) return [];

        return properties.filter(prop => {
            // Type filter
            const matchesType = selectedType === 'all' || prop.type.toLowerCase() === selectedType.toLowerCase();

            // Search filter (name or location)
            const matchesSearch = searchQuery === '' ||
                prop.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                prop.location.toLowerCase().includes(searchQuery.toLowerCase());

            return matchesType && matchesSearch;
        });
    }, [properties, selectedType, searchQuery]);

    // Type filter buttons
    const typeFilters = [
        { label: 'All Assets', value: 'all' },
        { label: 'Residential', value: 'residential' },
        { label: 'Commercial', value: 'commercial' },
        { label: 'Industrial', value: 'industrial' }
    ];

    return (
        <div className="w-full max-w-[1440px] mx-auto px-4 md:px-8 lg:px-12 py-8">
            {/* Hero / Header */}
            <div className="mb-8">
                <h1 className="text-3xl md:text-4xl font-black leading-tight tracking-[-0.033em] text-slate-900 dark:text-white mb-2">
                    Marketplace
                </h1>
                <p className="text-slate-500 dark:text-text-secondary text-base font-normal max-w-2xl">
                    Diverse portfolio of high-yield Nigerian real estate opportunities. Acquire fractional ownership starting from ₦500k.
                </p>
            </div>

            {/* Filters Toolbar */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 bg-white dark:bg-[#1a2632] p-4 rounded-xl border border-gray-200 dark:border-slate-800 shadow-sm sticky top-16 z-20">
                <div className="flex items-center gap-2 overflow-x-auto scrollbar-hide no-scrollbar pb-1 md:pb-0 touch-pan-x">
                    {typeFilters.map((filter) => (
                        <button
                            key={filter.value}
                            onClick={() => setSelectedType(filter.value)}
                            className={`px-4 py-2 rounded-lg font-bold text-sm whitespace-nowrap min-h-[44px] transition-colors ${selectedType === filter.value
                                    ? 'bg-primary text-white'
                                    : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 font-medium'
                                }`}
                        >
                            {filter.label}
                        </button>
                    ))}
                </div>
                <div className="flex items-center gap-3 w-full md:w-auto mt-2 md:mt-0">
                    <div className="relative flex-1 md:flex-none">
                        <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-[18px]">search</span>
                        <input
                            type="text"
                            placeholder="Search location..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full md:w-64 pl-9 pr-4 py-2.5 bg-gray-50 dark:bg-slate-800 border-none rounded-lg text-sm focus:ring-2 focus:ring-primary/50"
                        />
                    </div>
                    <button className="p-2.5 border border-gray-200 dark:border-slate-700 rounded-lg text-slate-500 hover:text-primary hover:border-primary transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center">
                        <span className="material-symbols-outlined">filter_list</span>
                    </button>
                </div>
            </div>

            {/* Property Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {isLoading ? (
                    // Loading skeletons
                    [...Array(6)].map((_, i) => (
                        <div key={i} className="bg-white dark:bg-[#1a2632] rounded-xl border border-gray-200 dark:border-slate-800 shadow-sm overflow-hidden">
                            <div className="h-48 bg-slate-200 dark:bg-slate-700 animate-pulse"></div>
                            <div className="p-5 space-y-4">
                                <div className="space-y-2">
                                    <div className="h-5 bg-slate-200 dark:bg-slate-700 rounded w-3/4 animate-pulse"></div>
                                    <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-1/2 animate-pulse"></div>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="h-12 bg-slate-200 dark:bg-slate-700 rounded animate-pulse"></div>
                                    <div className="h-12 bg-slate-200 dark:bg-slate-700 rounded animate-pulse"></div>
                                </div>
                                <div className="h-10 bg-slate-200 dark:bg-slate-700 rounded animate-pulse"></div>
                            </div>
                        </div>
                    ))
                ) : filteredProperties.length > 0 ? (
                    filteredProperties.map((item) => (
                        <div key={item.id} className="group bg-white dark:bg-[#1a2632] rounded-xl border border-gray-200 dark:border-slate-800 shadow-sm hover:shadow-lg transition-all overflow-hidden flex flex-col">
                            <div className="relative h-48 bg-gray-200 overflow-hidden">
                                <img
                                    src={item.imageUrl}
                                    alt={item.name}
                                    loading="lazy"
                                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                                    onError={(e) => {
                                        (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&q=80&w=800';
                                    }}
                                />
                                <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm px-2 py-1 rounded text-xs font-bold text-slate-900 uppercase tracking-wide shadow-sm">
                                    {item.type}
                                </div>
                                <div className="absolute top-3 right-3 bg-emerald-500 text-white px-2 py-1 rounded text-xs font-bold shadow-sm">
                                    Est. Yield: {item.targetYield}
                                </div>
                            </div>
                            <div className="p-5 flex-1 flex flex-col">
                                <div className="mb-4">
                                    <h3 className="text-lg font-bold text-slate-900 dark:text-white leading-tight mb-1 group-hover:text-primary transition-colors">
                                        {item.name}
                                    </h3>
                                    <p className="text-sm text-slate-500 dark:text-slate-400 flex items-center gap-1">
                                        <span className="material-symbols-outlined text-[16px]">location_on</span> {item.location}
                                    </p>
                                </div>

                                <div className="grid grid-cols-2 gap-4 mb-4">
                                    <div className="bg-slate-50 dark:bg-slate-800/50 p-2 rounded-lg">
                                        <p className="text-[10px] uppercase text-slate-400 font-bold mb-0.5">Min Contribution</p>
                                        <p className="text-sm font-bold text-slate-900 dark:text-white">
                                            {formatCurrency(item.minInvestment)}
                                        </p>
                                    </div>
                                    <div className="bg-slate-50 dark:bg-slate-800/50 p-2 rounded-lg">
                                        <p className="text-[10px] uppercase text-slate-400 font-bold mb-0.5">Funded</p>
                                        <div className="flex items-center gap-2">
                                            <div className="flex-1 h-1.5 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                                                <div className="h-full bg-primary rounded-full" style={{ width: `${item.fundingProgress}%` }}></div>
                                            </div>
                                            <span className="text-xs font-bold text-primary">{item.fundingProgress}%</span>
                                        </div>
                                    </div>
                                </div>

                                <Link
                                    to={`/properties/${item.id}`}
                                    className="mt-auto w-full py-2.5 rounded-lg border border-primary text-primary hover:bg-primary hover:text-white font-bold text-sm transition-all text-center block"
                                >
                                    View Opportunity
                                </Link>
                            </div>
                        </div>
                    ))
                ) : (
                    // Empty state
                    <div className="col-span-full flex flex-col items-center justify-center py-16 text-slate-500">
                        <span className="material-symbols-outlined text-8xl mb-4 opacity-50">search_off</span>
                        <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">No properties found</h3>
                        <p className="text-sm">Try adjusting your filters or search query</p>
                        {(selectedType !== 'all' || searchQuery) && (
                            <button
                                onClick={() => {
                                    setSelectedType('all');
                                    setSearchQuery('');
                                }}
                                className="mt-4 px-4 py-2 bg-primary text-white rounded-lg font-bold text-sm hover:bg-blue-700 transition-colors"
                            >
                                Clear Filters
                            </button>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}

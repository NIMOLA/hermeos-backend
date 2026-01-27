import React, { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Button } from '../../components/ui/button';
import { Card } from '../../components/ui/card';
import { useFetch } from '../../hooks/useApi';
import { getImageUrl } from '../../utils/imageUtils';

interface Property {
    id: string;
    name: string;
    location: string;
    description: string;
    totalValue: number; // Corrected from totalValuation
    projectedYield: number;
    holdingPeriod: number;
    riskProfile: string;
    totalUnits: number; // Renamed to "Total Slots" in UI
    availableUnits: number;
    pricePerUnit: number;
    images: string[];
    financialDetails?: {
        scenarios?: {
            conservative: { label: string; appreciation: number; rentGrowth: number; result: number };
            marketTrend: { label: string; appreciation: number; rentGrowth: number; result: number };
        };
    };
}

export default function PropertyDetailsPage() {
    const { id } = useParams<{ id: string }>();
    const { data: property, isLoading, error } = useFetch<Property>(id ? `/properties/${id}` : '');

    // State for interactive calculator
    const [slots, setSlots] = useState<number>(50); // Default 50 Slots (5M)
    const pricePerSlot = property?.pricePerUnit || 100000;

    const investmentAmount = slots * pricePerSlot;

    const handleSlotsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = parseInt(e.target.value) || 0;
        setSlots(val);
    };

    const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = parseInt(e.target.value);
        setSlots(val);
    };

    // Range Calculations
    const conservativeReturn = property?.financialDetails?.scenarios?.conservative
        ? investmentAmount * ((property.financialDetails.scenarios.conservative.appreciation + property.financialDetails.scenarios.conservative.rentGrowth) / 100)
        : investmentAmount * 0.22; // Fallback

    const targetReturn = property?.financialDetails?.scenarios?.marketTrend
        ? investmentAmount * ((property.financialDetails.scenarios.marketTrend.appreciation + property.financialDetails.scenarios.marketTrend.rentGrowth) / 100)
        : investmentAmount * 0.31; // Fallback

    const ownershipShare = property ? (slots / property.totalUnits) * 100 : 0;


    if (isLoading) return <div className="p-8 text-center animate-pulse">Loading property details...</div>;
    if (error || !property) return <div className="p-8 text-center text-red-500">Error loading property</div>;

    return (
        <div className="w-full max-w-[1440px] mx-auto px-4 md:px-8 lg:px-12 py-8">
            {/* Breadcrumbs */}
            <div className="flex flex-wrap gap-2 mb-6">
                <Link to="/properties" className="text-gray-500 dark:text-[#93adc8] text-sm font-medium hover:text-primary transition-colors">Marketplace</Link>
                <span className="text-gray-400 dark:text-[#586e84] text-sm font-medium">/</span>
                <Link to="/properties" className="text-gray-500 dark:text-[#93adc8] text-sm font-medium hover:text-primary transition-colors">Commercial</Link>
                <span className="text-gray-400 dark:text-[#586e84] text-sm font-medium">/</span>
                <span className="text-gray-900 dark:text-white text-sm font-medium">{property.name}</span>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 relative">
                {/* Main Content (Left) */}
                <div className="lg:col-span-8 flex flex-col gap-8">
                    <div className="flex flex-col gap-4">
                        <div className="flex justify-between items-start">
                            <div>
                                <h1 className="text-3xl md:text-4xl font-black leading-tight tracking-[-0.033em] mb-2 text-gray-900 dark:text-white">
                                    {property.name}
                                </h1>
                                <div className="flex items-center gap-2 text-gray-500 dark:text-[#93adc8]">
                                    <span className="material-symbols-outlined text-[18px]">location_on</span>
                                    <p className="text-base font-normal">{property.location}</p>
                                </div>
                            </div>
                            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-green-500/10 text-green-500 border border-green-500/20">
                                <span className="w-2 h-2 rounded-full bg-green-500 mr-2 animate-pulse"></span>
                                Acquisition Open
                            </span>
                        </div>

                        {/* Image Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 h-[400px] md:h-[480px]">
                            {/* Use real images or fallback */}
                            <div className="md:col-span-2 md:row-span-2 relative group rounded-xl overflow-hidden">
                                <div
                                    className="w-full h-full bg-center bg-cover bg-no-repeat transition-transform duration-500 group-hover:scale-105"
                                    style={{ backgroundImage: `url('${getImageUrl(property.images?.[0])}')` }}
                                ></div>
                            </div>
                            <div className="relative group rounded-xl overflow-hidden hidden md:block">
                                <div
                                    className="w-full h-full bg-center bg-cover bg-no-repeat transition-transform duration-500 group-hover:scale-105"
                                    style={{ backgroundImage: `url('${getImageUrl(property.images?.[1])}')` }}
                                ></div>
                            </div>
                            <div className="relative group rounded-xl overflow-hidden hidden md:block">
                                <div
                                    className="w-full h-full bg-center bg-cover bg-no-repeat transition-transform duration-500 group-hover:scale-105"
                                    style={{ backgroundImage: `url('${getImageUrl(property.images?.[2])}')` }}
                                ></div>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="bg-white dark:bg-card-dark border border-gray-200 dark:border-card-border p-5 rounded-lg">
                            <p className="text-gray-500 dark:text-[#93adc8] text-sm font-medium mb-1">Total Valuation</p>
                            <p className="text-primary text-xl md:text-2xl font-bold tracking-tight">₦ {((property.totalValue || 0) / 1000000).toFixed(0)}M</p>
                        </div>
                        <div className="bg-white dark:bg-card-dark border border-gray-200 dark:border-card-border p-5 rounded-lg">
                            <p className="text-gray-500 dark:text-[#93adc8] text-sm font-medium mb-1">Projected Yield</p>
                            <p className="text-gray-900 dark:text-white text-xl md:text-2xl font-bold tracking-tight">{property.projectedYield}% <span className="text-sm font-normal text-gray-500 dark:text-gray-400">p.a.</span></p>
                        </div>
                        <div className="bg-white dark:bg-card-dark border border-gray-200 dark:border-card-border p-5 rounded-lg">
                            <p className="text-gray-500 dark:text-[#93adc8] text-sm font-medium mb-1">Holding Period</p>
                            <p className="text-gray-900 dark:text-white text-xl md:text-2xl font-bold tracking-tight">{property.holdingPeriod || 5} Years</p>
                        </div>
                        <div className="bg-white dark:bg-card-dark border border-gray-200 dark:border-card-border p-5 rounded-lg">
                            <p className="text-gray-500 dark:text-[#93adc8] text-sm font-medium mb-1">Risk Profile</p>
                            <div className="flex items-center gap-2">
                                <span className="w-2 h-2 rounded-full bg-yellow-500"></span>
                                <p className="text-gray-900 dark:text-white text-xl md:text-2xl font-bold tracking-tight">{property.riskProfile || 'Moderate'}</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white dark:bg-card-dark border border-gray-200 dark:border-card-border rounded-xl p-6 md:p-8">
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Property Overview</h3>
                        <div className="prose dark:prose-invert max-w-none text-gray-600 dark:text-gray-300">
                            <p className="mb-4 leading-relaxed">
                                {property.description}
                            </p>
                        </div>
                        <div className="border-t border-gray-200 dark:border-gray-700 my-8"></div>
                        <div className="flex flex-col md:flex-row gap-6 justify-between">
                            <div className="flex-1">
                                <p className="text-gray-500 dark:text-[#93adc8] text-sm font-medium mb-2 uppercase tracking-wider">Management Entity</p>
                                <div className="flex items-start gap-4">
                                    <div className="w-12 h-12 rounded-lg bg-gray-100 dark:bg-[#243647] flex items-center justify-center text-primary">
                                        <span className="material-symbols-outlined text-[28px]">apartment</span>
                                    </div>
                                    <div>
                                        <p className="text-base font-bold text-gray-900 dark:text-white">Hermeos Proptech Asset Management Ltd.</p>
                                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                                            Licensed asset manager responsible for property maintenance, tenant relations, and financial reporting.
                                        </p>
                                    </div>
                                </div>
                            </div>
                            <div className="flex-1">
                                <p className="text-gray-500 dark:text-[#93adc8] text-sm font-medium mb-2 uppercase tracking-wider">Target Purchase Contribution</p>
                                <div className="flex items-start gap-4">
                                    <div className="w-12 h-12 rounded-lg bg-gray-100 dark:bg-[#243647] flex items-center justify-center text-primary">
                                        <span className="material-symbols-outlined text-[28px]">target</span>
                                    </div>
                                    <div>
                                        <p className="text-base font-bold text-gray-900 dark:text-white">₦ {(property.pricePerUnit * 100).toLocaleString()}</p>
                                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                                            Total participation value available in this tranche. Remaining capital secured via financing.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Sidebar (Right) */}
                <div className="lg:col-span-4 relative">
                    <div className="sticky top-24 flex flex-col gap-4">
                        <div className="bg-primary/10 border border-primary/30 rounded-xl p-5 relative overflow-hidden">
                            <div className="absolute top-0 right-0 p-3 opacity-10">
                                <span className="material-symbols-outlined text-[80px] text-primary">pie_chart</span>
                            </div>
                            <div className="flex items-start gap-3 relative z-10">
                                <span className="material-symbols-outlined text-primary mt-0.5">info</span>
                                <div>
                                    <h4 className="text-primary font-bold text-sm uppercase tracking-wide mb-1">Ownership Mechanics</h4>
                                    <p className="text-sm text-gray-700 dark:text-gray-300 leading-snug">
                                        Participants acquire equity ownership proportional to the amount contributed. Allocation units are used only to structure minimum and maximum contribution access.
                                    </p>
                                </div>
                            </div>
                        </div>

                        <Card className="shadow-xl overflow-hidden p-0">
                            <div className="p-6 flex flex-col gap-6">
                                <div>
                                    <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Acquire Co-ownership</h3>

                                    {/* Range Calculator */}
                                    <div className="bg-slate-50 dark:bg-slate-900 rounded-xl p-4 border border-slate-200 dark:border-slate-800 mb-6">
                                        <div className="flex justify-between items-center mb-4">
                                            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Projected Portfolio Growth</span>
                                            <span className="text-xs font-bold text-emerald-500 flex items-center gap-1">
                                                <span className="material-symbols-outlined text-[14px]">trending_up</span>
                                                Target: ~31%
                                            </span>
                                        </div>

                                        {/* Scenario A (Floor) */}
                                        <div className="flex gap-4 items-center mb-2 opacity-70">
                                            <div className="w-1/3">
                                                <p className="text-[10px] text-slate-400 uppercase font-bold">Conservative</p>
                                                <p className="text-xs text-slate-500">12% Appr + 10% Rent</p>
                                            </div>
                                            <div className="flex-1 border-b-2 border-dotted border-slate-300 dark:border-slate-700 relative h-4">
                                                <div className="absolute right-0 bottom-1 font-bold text-slate-600 dark:text-slate-400 text-sm">₦ {(investmentAmount + conservativeReturn).toLocaleString()}</div>
                                            </div>
                                        </div>

                                        {/* Scenario B (Target) */}
                                        <div className="flex gap-4 items-center mb-4">
                                            <div className="w-1/3">
                                                <p className="text-[10px] text-primary uppercase font-bold">Market Trend</p>
                                                <p className="text-xs text-primary/80">16% Appr + 15% Rent</p>
                                            </div>
                                            <div className="flex-1 border-b-2 border-solid border-primary relative h-4">
                                                <div className="absolute right-0 bottom-1 font-bold text-emerald-600 text-lg">₦ {(investmentAmount + targetReturn).toLocaleString()}</div>
                                            </div>
                                        </div>
                                    </div>

                                    <label className="flex flex-col gap-2">
                                        <span className="text-sm font-medium text-gray-500 dark:text-[#93adc8]">Enter Number of Slots</span>
                                        <div className="relative">
                                            <input
                                                className="block w-full px-4 py-3 bg-gray-50 dark:bg-[#111921] border-gray-200 dark:border-[#344d65] rounded-lg text-gray-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-primary focus:border-transparent font-bold text-lg"
                                                placeholder="50"
                                                type="number"
                                                value={slots === 0 ? '' : slots}
                                                onChange={handleSlotsChange}
                                            />
                                            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                                                <span className="text-gray-400 text-xs font-bold">SLOTS</span>
                                            </div>
                                        </div>
                                        <div className="px-1 mt-2">
                                            <input
                                                type="range"
                                                min="5"
                                                max="500"
                                                step="5"
                                                value={slots}
                                                onChange={handleSliderChange}
                                                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700 accent-primary"
                                            />
                                        </div>
                                        <div className="flex justify-between text-xs text-gray-400 mt-1">
                                            <span>Min: 5 Slots</span>
                                            <span>Max: 500 Slots</span>
                                        </div>
                                    </label>
                                </div>

                                <div className="bg-background-light dark:bg-[#111921] rounded-lg p-4 border border-gray-200 dark:border-[#344d65]">
                                    <div className="flex justify-between items-center mb-2">
                                        <span className="text-sm text-gray-500 dark:text-[#93adc8]">Total Contribution</span>
                                        <span className="text-sm font-bold text-gray-900 dark:text-white">₦ {investmentAmount.toLocaleString()}</span>
                                    </div>
                                    <div className="flex justify-between items-center pt-2 border-t border-gray-200 dark:border-[#344d65]">
                                        <span className="text-sm text-gray-500 dark:text-[#93adc8]">Your Portfolio Share</span>
                                        <span className="text-lg font-bold text-primary">{ownershipShare.toFixed(3)}%</span>
                                    </div>
                                </div>

                                <label className="flex items-start gap-3 cursor-pointer group">
                                    <div className="relative flex items-center">
                                        <input type="checkbox" className="peer h-5 w-5 cursor-pointer appearance-none rounded border border-gray-300 dark:border-gray-500 bg-transparent checked:border-primary checked:bg-primary transition-all" />
                                        <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 opacity-0 peer-checked:opacity-100 text-white pointer-events-none">
                                            <svg className="h-3.5 w-3.5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                                                <path clip-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" fill-rule="evenodd"></path>
                                            </svg>
                                        </span>
                                    </div>
                                    <span className="text-xs text-gray-500 dark:text-gray-400 leading-snug group-hover:text-gray-700 dark:group-hover:text-gray-300 transition-colors">
                                        I accept the <b>12-Month Lock-up Period</b> and the <a href="#" className="text-primary underline">Cooperative Constitution</a> (Electronic Deed of Adherence).
                                    </span>
                                </label>
                                <Link to={`/properties/${property.id}/review?slots=${slots}`}>
                                    <Button className="w-full h-auto py-4 text-lg shadow-lg shadow-primary/20">
                                        <span className="material-symbols-outlined mr-2">account_balance_wallet</span>
                                        Secure {slots} Slots
                                    </Button>
                                </Link>
                                <p className="text-center text-xs text-gray-400 dark:text-gray-500">
                                    Funds held in escrow by First Trustees
                                </p>
                            </div>
                        </Card>

                        {/* Support link */}
                        <div className="flex justify-center mt-6 mb-24 lg:mb-0">
                            <Link to="/support" className="text-sm text-gray-500 hover:text-primary flex items-center gap-2 transition-colors">
                                <span className="material-symbols-outlined text-[18px]">support_agent</span>
                                Contact Asset Support
                            </Link>
                        </div>

                        {/* Mobile Sticky CTA */}
                        <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white dark:bg-card-dark border-t border-gray-200 dark:border-card-border p-4 z-40 flex items-center justify-between shadow-[0_-4px_10px_rgba(0,0,0,0.05)]">
                            <div className="flex flex-col">
                                <p className="text-xs text-gray-500">Ownership Share</p>
                                <p className="font-bold text-primary">₦ {investmentAmount.toLocaleString()} ({ownershipShare.toFixed(2)}%)</p>
                            </div>
                            <Link to={`/properties/${property.id}/review`} className="flex-shrink-0">
                                <Button size="sm" className="px-6">
                                    Secure Slots
                                </Button>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

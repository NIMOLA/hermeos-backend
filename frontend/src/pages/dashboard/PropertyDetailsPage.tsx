import { Link, useParams } from 'react-router-dom';
import { Button } from '../../components/ui/button';
import { Card } from '../../components/ui/card';
import { useFetch } from '../../hooks/useApi';

interface Property {
    id: string;
    name: string;
    location: string;
    description: string;
    totalValuation: number;
    projectedYield: number;
    holdingPeriod: number;
    riskProfile: string;
    totalUnits: number;
    availableUnits: number;
    pricePerUnit: number;
    images: string[];
    // Add other fields as needed based on backend response
}

export default function PropertyDetailsPage() {
    const { id } = useParams<{ id: string }>();
    const { data: property, isLoading, error } = useFetch<Property>(id ? `/properties/${id}` : '');

    if (isLoading) return <div className="p-8 text-center">Loading property details...</div>;
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
                                    style={{ backgroundImage: `url('${property.images?.[0] || 'https://lh3.googleusercontent.com/aida-public/AB6AXuCwlJIuJXNqlfuXy1JejpudfFLBhkxl_gVvWIKFAOyzcdj9MBWt2yx_58QPln1ooif1nz-ifQdvlcF9mWLodyxgvfMYiJvEqle1-4dFNPWwYSgVMM6GVMdvTD7Qlx2i-wxpUk-ubK-GiQ6r60_hdZi8jBk6HXkE6Kqfn-pEXgOPmN8G0oT-OzDX7-zDtgB82tMw6YCSjUO4XIOnHbLIJeHjHksOmCuvjolfIFLkqQgRv16thQKBidjecK2QYKm-HoE5PhoRlle4SqMx'}')` }}
                                ></div>
                            </div>
                            <div className="relative group rounded-xl overflow-hidden hidden md:block">
                                <div
                                    className="w-full h-full bg-center bg-cover bg-no-repeat transition-transform duration-500 group-hover:scale-105"
                                    style={{ backgroundImage: `url('${property.images?.[1] || 'https://lh3.googleusercontent.com/aida-public/AB6AXuD8RfIgUnna4if2aQlP1S1ckTWQq-o5LYnadiMAHaJDEDtV9sNw879mg4LOd5b_mZtkh9QUcwxpKM7jB7yBzMCGMN-29nrKoJdRUDUz9jIODt46Hie7nkNJi_1BwXS8Y1SlqGzxbZJmGyoEAh5w47dnbov7QGIhqMYmvatNu4P_hYVpndulof75g0hG7vV3SNqvbUJm8aiGUBAwi-tjts_rPRCJoXHZXkn3maXJ1UaYbPehDq_QzTAqqR0yFYr7InTsAOkjUHYaaPPW'}')` }}
                                ></div>
                            </div>
                            <div className="relative group rounded-xl overflow-hidden hidden md:block">
                                <div
                                    className="w-full h-full bg-center bg-cover bg-no-repeat transition-transform duration-500 group-hover:scale-105"
                                    style={{ backgroundImage: `url('${property.images?.[2] || 'https://lh3.googleusercontent.com/aida-public/AB6AXuCjIM1IuUaedXBubhvLbohr97MD98nJ9S8wmmSs3oguZhNPGeW_vVRQHr2QdFS4oWbSEWirjtjSNkDmVz53sjJtwjzM2eG9igbgBPXOkgUUv9mU7B0J2Js1bJmNVvlxymxaCf_3VoaUKH0Ki_eRMh1XW-JvasLS4XjA48rzL4ZoMT_03VCQmdnyIj0PcRPk00GWmjfOkNi3VrVT7zvvvmeBzy6b4NBbch_Ji-NTZ2sSOCgvYIYFQqekWcr-LsnWc8bqdgrBwPAd2zId'}')` }}
                                ></div>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="bg-white dark:bg-card-dark border border-gray-200 dark:border-card-border p-5 rounded-lg">
                            <p className="text-gray-500 dark:text-[#93adc8] text-sm font-medium mb-1">Total Valuation</p>
                            <p className="text-primary text-xl md:text-2xl font-bold tracking-tight">₦ {(property.totalValuation / 1000000).toFixed(0)}M</p>
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
                                            Total ownership equity available in this tranche. Remaining capital secured via financing.
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
                                    <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Acquire Equity</h3>
                                    <label className="flex flex-col gap-2">
                                        <span className="text-sm font-medium text-gray-500 dark:text-[#93adc8]">Enter Purchase Contribution (₦)</span>
                                        <div className="relative">
                                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                <span className="text-gray-400 font-bold">₦</span>
                                            </div>
                                            <input
                                                className="block w-full pl-8 pr-12 py-3 bg-gray-50 dark:bg-[#111921] border-gray-200 dark:border-[#344d65] rounded-lg text-gray-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-primary focus:border-transparent font-bold text-lg"
                                                placeholder="5,000,000"
                                                type="text"
                                                defaultValue="5,000,000"
                                            />
                                            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                                                <span className="text-gray-400 text-xs">NGN</span>
                                            </div>
                                        </div>
                                        <div className="flex justify-between text-xs text-gray-400 mt-1">
                                            <span>Min: ₦500,000</span>
                                            <span>Max: ₦25,000,000</span>
                                        </div>
                                    </label>
                                </div>

                                <div className="bg-background-light dark:bg-[#111921] rounded-lg p-4 border border-gray-200 dark:border-[#344d65]">
                                    <div className="flex justify-between items-center mb-2">
                                        <span className="text-sm text-gray-500 dark:text-[#93adc8]">Purchase Contribution</span>
                                        <span className="text-sm font-bold text-gray-900 dark:text-white">₦ 5,000,000</span>
                                    </div>
                                    <div className="flex justify-between items-center pt-2 border-t border-gray-200 dark:border-[#344d65]">
                                        <span className="text-sm text-gray-500 dark:text-[#93adc8]">Estimated Ownership Share</span>
                                        <span className="text-lg font-bold text-primary">1.11%</span>
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
                                        I understand that resale or exit is not guaranteed and may be processed manually. I have read the <a href="#" className="text-primary underline">Prospectus</a>.
                                    </span>
                                </label>
                                <Link to={`/properties/${property.id}/review`}>
                                    <Button className="w-full h-auto py-4 text-lg shadow-lg shadow-primary/20">
                                        <span className="material-symbols-outlined mr-2">account_balance_wallet</span>
                                        Acquire Equity
                                    </Button>
                                </Link>
                                <p className="text-center text-xs text-gray-400 dark:text-gray-500">
                                    Secure transaction processed by Hermeos
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
                                <p className="font-bold text-primary">₦ 5,000,000 (1.11%)</p>
                            </div>
                            <Link to={`/properties/${property.id}/review`} className="flex-shrink-0">
                                <Button size="sm" className="px-6">
                                    Acquire Equity
                                </Button>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

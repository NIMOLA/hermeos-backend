import { Link } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import { useState, useEffect } from 'react';
import heroImage from '../assets/hero-lekki.jpg';

export default function LandingPage() {
    const { theme } = useTheme();

    const [featuredProperties, setFeaturedProperties] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProperties = async () => {
            try {
                // Fetch public marketplace properties
                // Using relative path assuming proxy is set up or base URL logic handles it
                // If not, might need a utility. Typically /api/properties/marketplace
                const response = await fetch('/api/properties/marketplace');
                if (response.ok) {
                    const data = await response.json();
                    setFeaturedProperties(data || []);
                }
            } catch (error) {
                console.error("Failed to fetch featured properties", error);
            } finally {
                setLoading(false);
            }
        };
        fetchProperties();
    }, []);

    return (
        <div className="flex-grow flex flex-col items-center w-full">
            {/* Hero Section */}
            <section className="w-full max-w-7xl px-4 md:px-10 py-12 md:py-20">
                <div className="@container">
                    <div className="flex flex-col-reverse gap-8 md:gap-12 lg:flex-row lg:items-center">
                        {/* Content */}
                        <div className="flex flex-1 flex-col gap-6 lg:max-w-xl">
                            <div className="flex flex-col gap-4 text-left">
                                <h1 className="text-4xl md:text-5xl lg:text-6xl font-black leading-tight tracking-tight text-slate-900 dark:text-white">
                                    Own a Piece of <span className="text-primary">Nigeria’s Future</span>
                                </h1>
                                <h2 className="text-lg text-slate-600 dark:text-slate-300 font-medium leading-relaxed">
                                    Hermeos Proptech simplifies property acquisition and equity participation in premium managed real estate assets across Nigeria.
                                </h2>
                            </div>
                            <div className="flex flex-col sm:flex-row gap-4 pt-2">
                                <Link to="/signup">
                                    <button className="flex h-12 w-full sm:w-auto items-center justify-center rounded-lg bg-primary px-8 text-base font-bold text-white shadow-lg hover:bg-blue-600 transition-transform active:scale-95">
                                        <span className="truncate">Start Your Journey</span>
                                    </button>
                                </Link>
                                <Link to="/properties">
                                    <button className="flex h-12 w-full sm:w-auto items-center justify-center rounded-lg border border-slate-300 dark:border-slate-700 bg-transparent px-8 text-base font-bold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
                                        <span className="truncate">Explore Properties</span>
                                    </button>
                                </Link>
                            </div>
                            {/* Trust Indicators */}
                            <div className="flex items-center gap-6 pt-4 opacity-80 flex-wrap">
                                <div className="flex items-center gap-2">
                                    <span className="material-symbols-outlined text-primary text-[20px]">verified</span>
                                    <span className="text-sm font-semibold text-slate-600 dark:text-slate-400">Vetted Assets</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className="material-symbols-outlined text-primary text-[20px]">lock</span>
                                    <span className="text-sm font-semibold text-slate-600 dark:text-slate-400">Secure Titles</span>
                                </div>
                                <div className="flex items-center gap-4 ml-auto sm:ml-0">
                                    <Link to="/about" className="text-sm font-bold text-primary hover:underline">About Us</Link>
                                    <Link to="/support" className="text-sm font-bold text-primary hover:underline">Support</Link>
                                </div>
                            </div>
                        </div>
                        {/* Hero Image */}
                        <div className="flex-1 w-full">
                            <div className="relative w-full aspect-[4/3] overflow-hidden rounded-2xl shadow-2xl bg-slate-200 dark:bg-slate-800">
                                <div className="absolute inset-0 bg-cover bg-center transition-transform hover:scale-105 duration-700" style={{ backgroundImage: `url(${heroImage})` }}>
                                </div>
                                <div className="absolute bottom-4 left-4 bg-white/90 dark:bg-slate-900/90 backdrop-blur px-3 py-1 rounded-md text-xs font-bold shadow-sm flex items-center gap-1 text-slate-900 dark:text-white">
                                    <span className="material-symbols-outlined text-primary text-[16px]">location_on</span>
                                    <span>Badore, Ajah, Lagos</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Live Opportunities Carousel */}
            <section className="w-full max-w-[1440px] px-4 md:px-10 mb-12">
                <div className="flex items-center justify-between mb-4 px-2">
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white">Live Opportunities</h3>
                    <div className="hidden md:flex gap-2">
                        <span className="text-xs text-slate-500 uppercase tracking-wider font-semibold">Scroll to view</span>
                        <span className="material-symbols-outlined text-slate-400 text-sm">arrow_forward</span>
                    </div>
                </div>

                {loading ? (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-pulse">
                        {[1, 2, 3].map(i => (
                            <div key={i} className="h-64 bg-slate-100 dark:bg-slate-800 rounded-xl"></div>
                        ))}
                    </div>
                ) : featuredProperties.length > 0 ? (
                    <div className="flex overflow-x-auto gap-6 pb-8 snap-x scrollbar-hide -mx-4 px-4 md:mx-0 md:px-0">
                        {featuredProperties.map((prop) => (
                            <div key={prop.id} className="min-w-[300px] md:min-w-[340px] flex-shrink-0 snap-center rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900/50 overflow-hidden shadow-sm hover:shadow-md transition-all group">
                                <div className="h-40 w-full bg-slate-200 dark:bg-slate-800 relative bg-cover bg-center" style={{ backgroundImage: `url(${prop.imageUrl || heroImage})` }}>
                                    <div className="absolute top-2 right-2 bg-white/90 dark:bg-slate-900/90 backdrop-blur px-2 py-1 rounded text-xs font-bold text-slate-900 dark:text-white shadow-sm">
                                        {prop.targetYield} ROI
                                    </div>
                                    <div className="absolute bottom-2 left-2 bg-black/60 backdrop-blur px-2 py-1 rounded text-xs font-medium text-white">
                                        Min: ₦{Number(prop.minInvestment).toLocaleString()}
                                    </div>
                                </div>
                                <div className="p-4 flex flex-col gap-3">
                                    <div>
                                        <h4 className="text-lg font-bold text-slate-900 dark:text-white truncate" title={prop.name}>{prop.name}</h4>
                                        <div className="flex items-center text-slate-500 dark:text-slate-400 text-xs">
                                            <span className="material-symbols-outlined text-[14px] mr-1">location_on</span>
                                            <span className="truncate">{prop.location}</span>
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-2 gap-2 text-xs text-slate-600 dark:text-slate-300 border-t border-slate-100 dark:border-slate-800 pt-3">
                                        <div className="flex items-center gap-1">
                                            <span className="material-symbols-outlined text-[14px] text-primary">category</span>
                                            <span className="truncate">{prop.type || 'Residential'}</span>
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <span className="material-symbols-outlined text-[14px] text-primary">pie_chart</span>
                                            <span>{prop.fundingProgress}% Funded</span>
                                        </div>
                                    </div>
                                    {/* Action - View Only trigger */}
                                    <button onClick={() => window.location.href = '/signup'} className="mt-1 w-full py-2 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-900 dark:text-white text-sm font-bold transition-colors">
                                        View Details
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="p-8 text-center border border-dashed border-slate-300 dark:border-slate-700 rounded-xl">
                        <p className="text-slate-500">No active properties available for public preview.</p>
                    </div>
                )}
            </section>

            {/* Important Disclaimer Band */}
            <section className="w-full bg-primary/10 border-y border-primary/20">
                <div className="max-w-7xl mx-auto px-4 py-4 flex flex-col sm:flex-row items-start sm:items-center justify-center gap-3 text-center sm:text-left">
                    <span className="material-symbols-outlined text-primary shrink-0">info</span>
                    <p className="text-sm text-slate-700 dark:text-slate-300 font-medium">
                        <strong>Disclaimer:</strong> Hermeos Proptech is a property technology platform, not a financial advisory or financial services firm. All asset participation involves risk.
                    </p>
                </div>
            </section>

            {/* Feature Section */}
            <section className="w-full max-w-7xl px-4 md:px-10 py-16 md:py-24">
                <div className="flex flex-col gap-12">
                    <div className="max-w-2xl">
                        <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-slate-900 dark:text-white mb-4">
                            Why Choose Hermeos?
                        </h2>
                        <p className="text-lg text-slate-600 dark:text-slate-400">
                            We provide a secure and transparent pathway to real estate ownership, handling the complexities so you can focus on building your portfolio.
                        </p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {/* Feature 1 */}
                        <div className="group flex flex-col gap-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/50 p-6 hover:border-primary/50 transition-colors shadow-sm hover:shadow-md">
                            <div className="size-12 rounded-lg bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-colors">
                                <span className="material-symbols-outlined text-3xl">gavel</span>
                            </div>
                            <div>
                                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Vetted Titles & Documentation</h3>
                                <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                                    We ensure every asset has clean, verified government documentation before it ever hits our platform.
                                </p>
                            </div>
                        </div>
                        {/* Feature 2 */}
                        <div className="group flex flex-col gap-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/50 p-6 hover:border-primary/50 transition-colors shadow-sm hover:shadow-md">
                            <div className="size-12 rounded-lg bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-colors">
                                <span className="material-symbols-outlined text-3xl">apartment</span>
                            </div>
                            <div>
                                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Managed Property Assets</h3>
                                <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                                    Our properties are professionally managed to maintain high asset quality and tenant satisfaction.
                                </p>
                            </div>
                        </div>
                        {/* Feature 3 */}
                        <div className="group flex flex-col gap-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/50 p-6 hover:border-primary/50 transition-colors shadow-sm hover:shadow-md">
                            <div className="size-12 rounded-lg bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-colors">
                                <span className="material-symbols-outlined text-3xl">policy</span>
                            </div>
                            <div>
                                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Transparent Equity Structure</h3>
                                <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                                    Enjoy a clear, legal framework for your property ownership participation with full digital transparency.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}

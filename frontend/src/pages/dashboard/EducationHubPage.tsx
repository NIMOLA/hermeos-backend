import { useState } from 'react';
import { Card, CardContent } from '../../components/ui/card';
import { PlayCircle, ChevronRight } from 'lucide-react';
import { Button } from '../../components/ui/button';

import { Search } from 'lucide-react';
import { useFetch } from '../../hooks/useApi';
import { Link } from 'react-router-dom';

export default function EducationHubPage() {
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [searchQuery, setSearchQuery] = useState('');

    // Construct API URL with query params
    const query = new URLSearchParams();
    if (selectedCategory !== 'All') query.append('category', selectedCategory);
    if (searchQuery) query.append('search', searchQuery);

    // Auto-fetches when key changes (depends on useFetch implementation details, usually recalculates url)
    // If useFetch doesn't support dynamic URL dependencies well, we might need a manual fetch or useEffect.
    // Assuming useFetch calls API when URL changes or we refetch. 
    // Simplified: Passing a dynamic string to your custom hook usually triggers re-fetch.
    const url = `/blog/posts?${query.toString()}`;
    const { data: postsData, isLoading } = useFetch<{ success: boolean; data: any[] }>(url);
    const articles = postsData?.data || [];

    const categories = ['All', 'Basics', 'Legal', 'Strategy', 'Market Updates', 'Guides'];

    return (
        <div className="space-y-8 pb-12">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div className="flex flex-col gap-2">
                    <h1 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white">Education Hub</h1>
                    <p className="text-slate-500 dark:text-slate-400">Master real estate investing with our curated resources.</p>
                </div>

                {/* Search Bar */}
                <div className="relative w-full md:w-64">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                        type="text"
                        placeholder="Search articles..."
                        className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
            </div>

            {/* Featured Hero (Static for now, could be dynamic later) */}
            <div className="relative rounded-2xl overflow-hidden bg-slate-900 aspect-[21/9] md:aspect-[3/1] shadow-xl">
                <img
                    src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=1600"
                    alt="Hero"
                    className="absolute inset-0 w-full h-full object-cover opacity-60"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex items-end p-6 md:p-10">
                    <div className="max-w-2xl animate-in slide-in-from-bottom-5 duration-700">
                        <span className="bg-primary text-white text-xs font-bold px-3 py-1.5 rounded-full mb-4 inline-block shadow-lg shadow-primary/30 uppercase tracking-widest">Featured Course</span>
                        <h2 className="text-2xl md:text-4xl font-bold text-white mb-3">Real Estate Investing 101</h2>
                        <p className="text-slate-200 mb-6 hidden md:block text-lg leading-relaxed opacity-90">A comprehensive guide for beginners looking to build generational wealth through property assets.</p>
                        <Button className="gap-2 h-12 px-6 rounded-xl font-bold text-base shadow-xl shadow-primary/20 hover:scale-105 transition-transform active:scale-95">
                            <PlayCircle className="w-5 h-5" /> Start Learning
                        </Button>
                    </div>
                </div>
            </div>

            {/* Categories */}
            <div className="sticky top-[72px] z-10 bg-background/80 backdrop-blur-md py-4 -mx-4 px-4 md:mx-0 md:px-0 md:bg-transparent md:backdrop-filter-none md:static">
                <div className="flex gap-3 overflow-x-auto pb-2 no-scrollbar snap-x">
                    {categories.map((cat, i) => (
                        <button
                            key={i}
                            onClick={() => setSelectedCategory(cat)}
                            className={`
                                px-5 py-2.5 rounded-full text-sm font-bold whitespace-nowrap transition-all duration-300 snap-center
                                ${selectedCategory === cat
                                    ? 'bg-primary text-white shadow-lg shadow-primary/25 scale-105'
                                    : 'bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300'
                                }
                            `}
                        >
                            {cat}
                        </button>
                    ))}
                </div>
            </div>

            {/* Articles Grid */}
            {isLoading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[1, 2, 3, 4].map(i => (
                        <div key={i} className="h-80 bg-slate-100 dark:bg-slate-800 rounded-2xl animate-pulse"></div>
                    ))}
                </div>
            ) : articles.length === 0 ? (
                <div className="text-center py-20 bg-slate-50 dark:bg-slate-800/50 rounded-3xl border border-dashed border-slate-200 dark:border-slate-700">
                    <span className="material-symbols-outlined text-4xl text-slate-400 mb-4">search_off</span>
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">No articles found</h3>
                    <p className="text-slate-500">Try adjusting your search or category filter.</p>
                    <button
                        onClick={() => { setSelectedCategory('All'); setSearchQuery(''); }}
                        className="mt-4 text-primary font-bold hover:underline"
                    >
                        Clear Filters
                    </button>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6 md:gap-8">
                    {articles.map((article: any) => (
                        <Link to={`/education/${article.slug}`} key={article.id}>
                            <Card className="group h-full cursor-pointer hover:shadow-2xl hover:shadow-primary/5 transition-all duration-300 hover:-translate-y-2 border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/40 overflow-hidden rounded-2xl">
                                <div className="aspect-[4/3] relative overflow-hidden bg-slate-200">
                                    <img
                                        src={article.coverImage || "https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&q=80&w=800"}
                                        alt={article.title}
                                        className="object-cover w-full h-full group-hover:scale-110 transition-transform duration-700"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                    <div className="absolute top-4 left-4 bg-white/90 dark:bg-slate-900/90 backdrop-blur text-[10px] uppercase tracking-wider font-bold px-3 py-1.5 rounded-lg shadow-sm">
                                        {article.category}
                                    </div>
                                </div>
                                <CardContent className="p-6 flex flex-col gap-3 h-auto">
                                    <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 uppercase tracking-wide">
                                        <ClockIcon className="w-3.5 h-3.5" /> {article.readTime || '5 min read'}
                                    </div>
                                    <h3 className="font-bold text-xl text-slate-900 dark:text-white leading-snug line-clamp-2 group-hover:text-primary transition-colors">
                                        {article.title}
                                    </h3>
                                    <p className="text-sm text-slate-500 dark:text-slate-400 line-clamp-3 leading-relaxed">
                                        {article.excerpt || article.content?.substring(0, 150) + "..."}
                                    </p>
                                    <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center text-primary text-sm font-bold group-hover:translate-x-1 transition-transform origin-left">
                                        Read Article <ChevronRight className="w-4 h-4 ml-1" />
                                    </div>
                                </CardContent>
                            </Card>
                        </Link>
                    ))}
                </div>
            )}
        </div>
    );
}

function ClockIcon({ className }: { className?: string }) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
            <circle cx="12" cy="12" r="10" />
            <polyline points="12 6 12 12 16 14" />
        </svg>
    )
}



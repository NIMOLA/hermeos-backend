import { Card, CardContent } from '../../components/ui/card';
import { PlayCircle, ChevronRight } from 'lucide-react';
import { Button } from '../../components/ui/button';

export default function EducationHubPage() {
    const articles = [
        {
            title: "Understanding Fractional Real Estate",
            category: "Basics",
            readTime: "5 min read",
            image: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&q=80&w=800",
            description: "Learn how fractional ownership allows you to invest in premium real estate with lower capital."
        },
        {
            title: "How Co-operatives Protect Your Participation",
            category: "Legal",
            readTime: "8 min read",
            image: "https://images.unsplash.com/photo-1554224155-984bbcd58d86?auto=format&fit=crop&q=80&w=800",
            description: "Deep dive into the legal structure of Manymiles Cooperative and asset security."
        },
        {
            title: "Maximizing ROI: Rental vs Capital Appreciation",
            category: "Strategy",
            readTime: "6 min read",
            image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=800",
            description: "Analyzing the two main ways you earn money from real estate participation."
        },
        {
            title: "Navigating the KYC Process",
            category: "Guide",
            readTime: "3 min read",
            image: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?auto=format&fit=crop&q=80&w=800",
            description: "Step-by-step guide to verifying your identity and securing your account."
        }
    ];

    return (
        <div className="space-y-8">
            <div className="flex flex-col gap-2">
                <h1 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white">Education Hub</h1>
                <p className="text-slate-500 dark:text-slate-400">Master real estate investing with our curated resources.</p>
            </div>

            {/* Featured Hero */}
            <div className="relative rounded-2xl overflow-hidden bg-slate-900 aspect-[21/9] md:aspect-[3/1]">
                <img
                    src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=1600"
                    alt="Hero"
                    className="absolute inset-0 w-full h-full object-cover opacity-60"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex items-end p-8">
                    <div className="max-w-2xl">
                        <span className="bg-primary text-white text-xs font-bold px-2 py-1.5 rounded mb-3 inline-block">FEATURED COURSE</span>
                        <h2 className="text-2xl md:text-4xl font-bold text-white mb-2">Real Estate Investing 101</h2>
                        <p className="text-slate-200 mb-4 hidden md:block">A comprehensive guide for beginners looking to build generational wealth through property assets.</p>
                        <Button className="gap-2">
                            <PlayCircle className="w-5 h-5" /> Start Learning
                        </Button>
                    </div>
                </div>
            </div>

            {/* Categories */}
            <div className="flex gap-4 overflow-x-auto pb-2 no-scrollbar">
                {['All', 'Basics', 'Legal', 'Strategy', 'Market Updates'].map((cat, i) => (
                    <button key={i} className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${i === 0 ? 'bg-primary text-white' : 'bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300'}`}>
                        {cat}
                    </button>
                ))}
            </div>

            {/* Articles Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4 gap-6">
                {articles.map((article, i) => (
                    <Card key={i} className="group cursor-pointer hover:shadow-lg transition-all hover:-translate-y-1">
                        <div className="aspect-video relative overflow-hidden rounded-t-xl bg-slate-200">
                            <img src={article.image} alt={article.title} className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500" />
                            <div className="absolute top-3 left-3 bg-white/90 backdrop-blur text-xs font-bold px-2 py-1 rounded shadow-sm">
                                {article.category}
                            </div>
                        </div>
                        <CardContent className="p-5 flex flex-col gap-3">
                            <div className="flex items-center gap-2 text-xs text-slate-500">
                                <ClockIcon className="w-3.5 h-3.5" /> {article.readTime}
                            </div>
                            <h3 className="font-bold text-lg text-slate-900 dark:text-white leading-tight line-clamp-2 group-hover:text-primary transition-colors">
                                {article.title}
                            </h3>
                            <p className="text-sm text-slate-500 line-clamp-3">
                                {article.description}
                            </p>
                            <div className="mt-auto pt-2 flex items-center text-primary text-sm font-bold">
                                Read Article <ChevronRight className="w-4 h-4" />
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
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

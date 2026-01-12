
import { Link } from 'react-router-dom';
import { Button } from '../../components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/card';
import { useAuth } from '../../contexts/AuthContext';
import { useFetch } from '../../hooks/useApi';

interface DashboardStats {
    portfolioValue: number;
    portfolioGrowth: number;
    totalEarnings: number;
    activeAssets: number;
}

interface Activity {
    id: string;
    type: 'dividend' | 'purchase' | 'deposit' | 'withdrawal';
    title: string;
    description: string;
    amount: number;
    createdAt: string;
}

interface NewOpportunity {
    id: string;
    name: string;
    location: string;
    type: string;
    targetYield: string;
    imageUrl: string;
}

export default function DashboardOverviewPage() {
    const { user } = useAuth();

    // Fetch dashboard stats
    const { data: stats, isLoading: statsLoading } = useFetch<DashboardStats>('/user/dashboard/stats');

    // Fetch recent activity
    const { data: activities, isLoading: activitiesLoading } = useFetch<Activity[]>('/user/activity', {
        limit: 3
    });

    // Fetch featured opportunity
    const { data: opportunity } = useFetch<NewOpportunity>('/properties/featured');

    // Get user's first name for greeting
    const firstName = user?.firstName || 'Partner';
    const greeting = new Date().getHours() < 12 ? 'Good Morning' : new Date().getHours() < 18 ? 'Good Afternoon' : 'Good Evening';

    // Format currency
    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-NG', {
            style: 'currency',
            currency: 'NGN',
            minimumFractionDigits: 2
        }).format(amount);
    };

    // Format relative time
    const formatRelativeTime = (dateString: string) => {
        const date = new Date(dateString);
        const now = new Date();
        const diffMs = now.getTime() - date.getTime();
        const diffMins = Math.floor(diffMs / 60000);
        const diffHours = Math.floor(diffMs / 3600000);
        const diffDays = Math.floor(diffMs / 86400000);

        if (diffMins < 60) return `${diffMins} min ago`;
        if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
        if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
        return date.toLocaleDateString();
    };

    // Activity type configs
    const getActivityConfig = (type: string) => {
        const configs: Record<string, { icon: string; color: string; bgColor: string }> = {
            dividend: { icon: 'payments', color: 'text-emerald-600', bgColor: 'bg-emerald-100' },
            purchase: { icon: 'apartment', color: 'text-primary', bgColor: 'bg-blue-100' },
            deposit: { icon: 'account_balance_wallet', color: 'text-purple-600', bgColor: 'bg-purple-100' },
            withdrawal: { icon: 'trending_down', color: 'text-orange-600', bgColor: 'bg-orange-100' },
        };
        return configs[type] || configs.deposit;
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 mb-2">
                <div>
                    <h1 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white leading-tight">
                        {greeting}, {firstName}
                    </h1>
                    <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">
                        Here is what is happening with your portfolio today.
                    </p>
                </div>
                <div className="flex flex-row gap-3">

                    <Link to="/properties" className="flex-1 sm:flex-none">
                        <Button className="w-full touch-target">
                            <span className="material-symbols-outlined sm:mr-2">search</span>{' '}
                            <span className="hidden sm:inline">Marketplace</span>
                        </Button>
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
                    {statsLoading ? (
                        <div className="h-9 bg-white/10 rounded animate-pulse mb-4"></div>
                    ) : (
                        <h2 className="text-3xl font-bold mb-4">
                            {formatCurrency(stats?.portfolioValue || 0)}
                        </h2>
                    )}
                    <div className="flex items-center gap-2 text-sm">
                        {stats?.portfolioGrowth !== undefined && (
                            <>
                                <span className={`px-2 py-0.5 rounded text-xs font-bold flex items-center ${stats.portfolioGrowth >= 0
                                    ? 'bg-emerald-500/20 text-emerald-300'
                                    : 'bg-red-500/20 text-red-300'
                                    }`}>
                                    <span className="material-symbols-outlined text-sm mr-1">
                                        {stats.portfolioGrowth >= 0 ? 'trending_up' : 'trending_down'}
                                    </span>
                                    {stats.portfolioGrowth >= 0 ? '+' : ''}{stats.portfolioGrowth.toFixed(1)}%
                                </span>
                                <span className="opacity-60">vs last month</span>
                            </>
                        )}
                    </div>
                </div>

                <div className="bg-white dark:bg-[#1a2632] border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm">
                    <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-1">Total Rental Earnings</p>
                    {statsLoading ? (
                        <div className="h-8 bg-slate-200 dark:bg-slate-700 rounded animate-pulse mb-4"></div>
                    ) : (
                        <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">
                            {formatCurrency(stats?.totalEarnings || 0)}
                        </h2>
                    )}
                    <Link to="/proceeds" className="text-primary text-sm font-bold hover:underline">
                        View Distribution History
                    </Link>
                </div>

                <div className="bg-white dark:bg-[#1a2632] border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm">
                    <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-1">Active Assets</p>
                    {statsLoading ? (
                        <div className="h-8 bg-slate-200 dark:bg-slate-700 rounded animate-pulse mb-4"></div>
                    ) : (
                        <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">
                            {stats?.activeAssets || 0} {stats?.activeAssets === 1 ? 'Property' : 'Properties'}
                        </h2>
                    )}
                    <Link to="/portfolio" className="text-primary text-sm font-bold hover:underline">
                        Manage Portfolio
                    </Link>
                </div>
            </div>

            {/* Content Area */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Main Content */}
                <div className="lg:col-span-2 space-y-6">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between">
                            <CardTitle>Recent Activity</CardTitle>
                            <Link to="/performance">
                                <Button variant="ghost" size="sm">View All</Button>
                            </Link>
                        </CardHeader>
                        <CardContent>
                            {activitiesLoading ? (
                                <div className="space-y-4">
                                    {[1, 2, 3].map((i) => (
                                        <div key={i} className="flex items-center gap-4 py-3">
                                            <div className="bg-slate-200 dark:bg-slate-700 p-2 rounded-full w-10 h-10 animate-pulse"></div>
                                            <div className="flex-1 space-y-2">
                                                <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-3/4 animate-pulse"></div>
                                                <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded w-1/2 animate-pulse"></div>
                                            </div>
                                            <div className="h-6 w-20 bg-slate-200 dark:bg-slate-700 rounded animate-pulse"></div>
                                        </div>
                                    ))}
                                </div>
                            ) : activities && activities.length > 0 ? (
                                <div className="space-y-4">
                                    {activities.map((activity) => {
                                        const config = getActivityConfig(activity.type);
                                        return (
                                            <div
                                                key={activity.id}
                                                className="flex items-center gap-4 py-3 border-b border-slate-100 dark:border-slate-800 last:border-0"
                                            >
                                                <div className={`${config.bgColor} ${config.color} p-2 rounded-full`}>
                                                    <span className="material-symbols-outlined text-xl">{config.icon}</span>
                                                </div>
                                                <div className="flex-1">
                                                    <h4 className="font-bold text-slate-900 dark:text-white text-sm">
                                                        {activity.title}
                                                    </h4>
                                                    <p className="text-xs text-slate-500">{activity.description}</p>
                                                </div>
                                                <div className="text-right">
                                                    <span className={`font-bold ${activity.amount >= 0 ? 'text-emerald-600' : 'text-slate-900 dark:text-white'}`}>
                                                        {activity.amount >= 0 ? '+' : ''}{formatCurrency(Math.abs(activity.amount))}
                                                    </span>
                                                    {activity.createdAt && (
                                                        <p className="text-xs text-slate-400 mt-1">{formatRelativeTime(activity.createdAt)}</p>
                                                    )}
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            ) : (
                                <div className="text-center py-8 text-slate-500">
                                    <span className="material-symbols-outlined text-4xl mb-2 opacity-50">inbox</span>
                                    <p className="text-sm">No recent activity</p>
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {opportunity && (
                        <Card>
                            <CardHeader>
                                <CardTitle>New Opportunities</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <Link
                                    to={`/properties/${opportunity.id}`}
                                    className="flex items-center gap-4 p-4 border border-slate-200 dark:border-slate-800 rounded-xl hover:border-primary transition-colors cursor-pointer group"
                                >
                                    <div
                                        className="w-24 h-16 bg-slate-200 rounded-lg bg-cover bg-center shrink-0"
                                        style={{ backgroundImage: `url("${opportunity.imageUrl}")` }}
                                    ></div>
                                    <div className="flex-1">
                                        <h4 className="font-bold text-slate-900 dark:text-white group-hover:text-primary transition-colors">
                                            {opportunity.name}
                                        </h4>
                                        <p className="text-xs text-slate-500">
                                            {opportunity.type} • {opportunity.targetYield} Target Yield
                                        </p>
                                    </div>
                                    <Button size="sm" variant="outline">
                                        View
                                    </Button>
                                </Link>
                            </CardContent>
                        </Card>
                    )}
                </div>

                {/* Sidebar Widgets */}
                <div className="space-y-6">
                    <Card className="bg-blue-50 dark:bg-blue-900/10 border-blue-100 dark:border-blue-900/30">
                        <CardContent className="p-6">
                            <h3 className="font-bold text-blue-900 dark:text-blue-300 mb-2">Complete Verification</h3>
                            <p className="text-sm text-blue-700 dark:text-blue-400 mb-4">
                                Unlock higher limits and withdrawal features by completing your KYC.
                            </p>
                            <Link to="/kyc/status">
                                <Button size="sm" className="w-full bg-blue-600 hover:bg-blue-700 text-white border-none">
                                    Check Status
                                </Button>
                            </Link>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Market Insights</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="text-sm">
                                <p className="font-medium text-slate-900 dark:text-white">
                                    Lagos Real Estate Market Report Q4
                                </p>
                                <p className="text-xs text-slate-500 mt-1">Property values in Lekki increased by 8%...</p>
                                <a
                                    href="#"
                                    className="flex items-center gap-1 text-primary text-xs font-bold mt-2"
                                >
                                    Read More{' '}
                                    <span className="material-symbols-outlined text-xs">arrow_forward</span>
                                </a>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}

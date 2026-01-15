import { useState, useEffect } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import Chatbot from '../components/Chatbot';
import { useAuth } from '../contexts/AuthContext';
import logoFull from '../assets/logo-full.png';
import logoIcon from '../assets/logo-icon.png';
import Sidebar from '../components/Sidebar';
import Footer from '../components/Footer';

export default function RootLayout() {
    const { isAuthenticated, user, logout } = useAuth();
    const { theme, toggleTheme } = useTheme();
    const navigate = useNavigate();
    const location = useLocation();

    // Define route state variables
    const isLandingPage = location.pathname === '/';
    // Public marketing/info pages that should share the public layout (no sidebar)
    const isPublicInfoPage = ['/about', '/support', '/privacy', '/terms', '/contact'].includes(location.pathname);
    const isAuthPage = ['/login', '/signup', '/forgot-password', '/verify-email', '/password-reset-sent', '/admin/login', '/admin/accept-invitation'].some(path => location.pathname.startsWith(path));
    const isAdminRoute = location.pathname.startsWith('/admin') && !location.pathname.startsWith('/admin/login') && !location.pathname.startsWith('/admin/accept-invitation');

    // We want to hide the User Sidebar/Nav for: Landing, Auth, Admin, and Public Info pages
    const shouldHideNav = isLandingPage || isPublicInfoPage || isAuthPage || isAdminRoute;

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const isActive = (path: string) => {
        return location.pathname === path || location.pathname.startsWith(path + '/');
    };

    // Define public and private navs separately
    const publicNav = [{ path: '/properties', label: 'Marketplace', icon: 'home_work' }];
    const privateNav = [
        { path: '/dashboard', label: 'Dashboard', icon: 'dashboard' },
        { path: '/portfolio', label: 'Portfolio', icon: 'account_balance_wallet' },
        { path: '/performance', label: 'Performance', icon: 'trending_up' },
        { path: '/notifications', label: 'Notifications', icon: 'notifications' },
        { path: '/referrals', label: 'Referrals', icon: 'group_add' },
        { path: '/education', label: 'Learn', icon: 'school' },
        { path: '/support', label: 'Support', icon: 'support_agent' },
        { path: '/settings', label: 'Settings', icon: 'settings' },
    ];

    const [isCollapsed, setIsCollapsed] = useState(false);
    const [isMobileOpen, setIsMobileOpen] = useState(false);

    // Close mobile menu on route change
    useEffect(() => {
        setIsMobileOpen(false);
    }, [location.pathname]);

    // Handle authentication redirect
    if (!isAuthenticated && !isLandingPage && !isAuthPage) {
        // This is handled by ProtectedRoute, but RootLayout wraps everything.
        // We can just render Outlet, but the Sidebar won't have user data.
        // It's safer to let ProtectedRoute handle redirects, but for layout purposes:
    }

    if (shouldHideNav) {
        // For Admin Routes (excluding login), we strictly return Outlet because AdminLayout handles the UI
        if (isAdminRoute) {
            return <Outlet />;
        }

        return (
            <div className="min-h-screen bg-background-light dark:bg-background-dark flex flex-col">
                <header className="sticky top-0 z-40 bg-white dark:bg-surface-dark border-b border-gray-200 dark:border-border-dark shadow-sm">
                    <div className="max-w-[1800px] mx-auto px-4 sm:px-6 lg:px-8 mobile:px-reduced">
                        <div className="flex items-center justify-between h-16">
                            <Link to="/" className="flex items-center gap-2 group">
                                <img src={logoFull} alt="Hermeos" className="h-8 w-auto hidden md:block dark:hidden" />
                                <span className="font-bold text-xl md:hidden">Hermeos</span>
                            </Link>

                            <div className="flex items-center gap-4">
                                <Link to="/admin/login">
                                    <button className="text-slate-600 dark:text-slate-300 hover:text-primary font-medium text-sm transition-colors hidden md:block">
                                        Admin Login
                                    </button>
                                </Link>
                                <Link to="/login">
                                    <button className="bg-primary text-white px-5 py-2 rounded-lg text-sm font-bold shadow-md hover:bg-blue-600 transition-colors">
                                        Login
                                    </button>
                                </Link>
                            </div>
                        </div>
                    </div>
                </header>
                <main className="flex-grow w-full">
                    <Outlet />
                </main>
                <Footer />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background-light dark:bg-background-dark flex font-display text-slate-900 dark:text-white">
            <Sidebar
                isCollapsed={isCollapsed}
                toggleCollapse={() => setIsCollapsed(!isCollapsed)}
                isMobileOpen={isMobileOpen}
                toggleMobile={() => setIsMobileOpen(!isMobileOpen)}
            />

            {/* Main Content Wrapper */}
            <div className={`flex-1 flex flex-col min-h-screen transition-all duration-300 ${isCollapsed ? 'md:ml-20' : 'md:ml-64'}`}>

                {/* Mobile Header */}
                <header className="md:hidden sticky top-0 z-30 bg-white dark:bg-surface-dark border-b border-slate-200 dark:border-slate-800 h-16 flex items-center justify-between px-4">
                    <button onClick={() => setIsMobileOpen(true)} className="p-2 -ml-2 text-slate-600 dark:text-slate-400">
                        <span className="material-symbols-outlined">menu</span>
                    </button>
                    <span className="font-bold text-lg">Hermeos</span>
                    <div className="w-8"></div> {/* Spacer */}
                </header>

                {/* Content Area */}
                <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-x-hidden">
                    <Outlet />
                </main>
            </div>

            <Chatbot />
        </div>
    );
}

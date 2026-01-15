import { useState, useEffect } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import Chatbot from '../components/Chatbot';
import { useAuth } from '../contexts/AuthContext';
import logoFull from '../assets/logo-full.png';
import logoIcon from '../assets/logo-icon.png';
import Sidebar from '../components/Sidebar';

export default function RootLayout() {
    const { isAuthenticated, user, logout } = useAuth();
    const { theme, toggleTheme } = useTheme();
    const navigate = useNavigate();
    const location = useLocation();

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
        return (
            <div className="min-h-screen bg-background-light dark:bg-background-dark">
                {/* Only show simplified header for Auth/Landing if needed, or just Outlet */}
                {/* Re-use the existing Landing Page header logic if we want, or let LandingPage handle its own header */}
                {/* For now, we'll keep the minimal header for Auth/Landing inside this return or assume pages handle it if we return just Outlet */}
                <div className="min-h-screen bg-background-light dark:bg-background-dark">
                    {/* We can reproduce the Landing Header here or just render Outlet. 
                         The previous implementation had a specific Header for Landing. 
                         Let's keep the Outlet. LandingPage usually has its own Layout if complex.
                     */}
                    <header className="sticky top-0 z-40 bg-white dark:bg-surface-dark border-b border-gray-200 dark:border-border-dark shadow-sm">
                        <div className="max-w-[1800px] mx-auto px-4 sm:px-6 lg:px-8 mobile:px-reduced">
                            <div className="flex items-center justify-between h-16">
                                <Link to="/" className="flex items-center gap-2 group">
                                    {/* Logo Logic */}
                                    <img src={logoFull} alt="Hermeos" className="h-8 w-auto hidden md:block dark:hidden" />
                                    {/* Dark mode logo handling if needed */}
                                    <span className="font-bold text-xl md:hidden">Hermeos</span>
                                </Link>

                                {isLandingPage && (
                                    <div className="flex items-center gap-4">
                                        <Link to="/login"><button className="bg-primary text-white px-5 py-2 rounded-lg text-sm font-bold">Login</button></Link>
                                    </div>
                                )}
                            </div>
                        </div>
                    </header>
                    <main>
                        <Outlet />
                    </main>
                </div>
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

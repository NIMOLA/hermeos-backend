import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import Chatbot from '../components/Chatbot';
import { useAuth } from '../contexts/AuthContext';

export default function RootLayout() {
    const { isAuthenticated, isLoading, user, logout } = useAuth();
    const navigate = useNavigate();

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
        { path: '/support', label: 'Support', icon: 'support_agent' },
        { path: '/settings', label: 'Settings', icon: 'settings' },
    ];

    // Build the navItems depending on auth state
    const navItems = isAuthenticated ? [...privateNav, ...publicNav] : [...publicNav];

    const isLandingPage = location.pathname === '/';
    const isAuthPage = ['/login', '/signup', '/forgot-password'].includes(location.pathname);
    const shouldHideNav = isLandingPage || isAuthPage;

    return (
        <div className="min-h-screen bg-background-light dark:bg-background-dark">
            {/* Header */}
            <header className="sticky top-0 z-40 bg-white dark:bg-surface-dark border-b border-gray-200 dark:border-border-dark shadow-sm">
                <div className="max-w-[1800px] mx-auto px-4 sm:px-6 lg:px-8 mobile:px-reduced">
                    <div className="flex items-center justify-between h-16">
                        {/* Logo */}
                        <Link to="/" className="flex items-center gap-2 group">
                            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                                <span className="material-symbols-outlined text-white text-xl">apartment</span>
                            </div>
                            <span className="text-xl font-black text-slate-900 dark:text-white tracking-tight">
                                Hermeos
                            </span>
                        </Link>

                        {/* Public Action (Login/Theme) - Show on Landing Page only */}
                        {isLandingPage && (
                            <div className="flex items-center gap-4">
                                <button
                                    onClick={toggleTheme}
                                    className="p-2 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
                                >
                                    <span className="material-symbols-outlined">
                                        {theme === 'dark' ? 'light_mode' : 'dark_mode'}
                                    </span>
                                </button>
                                <Link to="/login">
                                    <button className="bg-primary text-white px-5 py-2 rounded-lg text-sm font-bold hover:bg-blue-600 transition-colors">
                                        Login
                                    </button>
                                </Link>
                            </div>
                        )}

                        {/* Show only theme toggle on Auth pages */}
                        {isAuthPage && (
                            <div className="flex items-center gap-4">
                                <button
                                    onClick={toggleTheme}
                                    className="p-2 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
                                >
                                    <span className="material-symbols-outlined">
                                        {theme === 'dark' ? 'light_mode' : 'dark_mode'}
                                    </span>
                                </button>
                            </div>
                        )}

                        {!shouldHideNav && (
                            <>
                                {/* Desktop Navigation */}
                                <nav className="hidden md:flex items-center gap-1">
                                    {navItems.map((item) => (
                                        <Link
                                            key={item.path}
                                            to={item.path}
                                            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${isActive(item.path)
                                                ? 'bg-primary/10 text-primary'
                                                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white'
                                                }`}
                                        >
                                            <span className="material-symbols-outlined text-[20px]">{item.icon}</span>
                                            <span>{item.label}</span>
                                        </Link>
                                    ))}
                                </nav>

                                {/* User Menu - show only when authenticated */}
                                <div className="flex items-center gap-3">
                                    <button
                                        onClick={toggleTheme}
                                        className="p-2 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
                                        title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
                                    >
                                        <span className="material-symbols-outlined">
                                            {theme === 'dark' ? 'light_mode' : 'dark_mode'}
                                        </span>
                                    </button>

                                    {isAuthenticated ? (
                                        <>
                                            <button className="relative p-2 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg">
                                                <span className="material-symbols-outlined">notifications</span>
                                                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full"></span>
                                            </button>
                                            <div className="flex items-center gap-3 pl-3 border-l border-slate-200 dark:border-slate-700">
                                                <div className="hidden sm:block text-right">
                                                    <p className="text-sm font-medium text-slate-900 dark:text-white">{user?.firstName ?? 'User'} {user?.lastName ?? ''}</p>
                                                    <p className="text-xs text-slate-500">{/* Insert tier or role if available */}</p>
                                                </div>
                                                <div className="w-9 h-9 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold">
                                                    {user?.firstName?.[0] ?? 'U'}{user?.lastName?.[0] ?? ''}
                                                </div>

                                            </div>
                                        </>
                                    ) : (
                                        // If not authenticated show login button only (or avatar placeholder)
                                        <div className="flex items-center gap-3">
                                            <Link to="/login" className="text-sm font-semibold text-slate-600 dark:text-slate-400 hover:text-primary">
                                                Login
                                            </Link>
                                        </div>
                                    )}
                                </div>
                            </>
                        )}
                    </div>

                    {!shouldHideNav && (
                        /* Mobile Navigation */
                        <nav className="md:hidden flex items-center gap-1 overflow-x-auto pb-2 scrollbar-hide">
                            {navItems.map((item) => (
                                <Link
                                    key={item.path}
                                    to={item.path}
                                    className={`flex flex-col items-center gap-1 px-2.5 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider whitespace-nowrap transition-all ${isActive(item.path)
                                        ? 'bg-primary/10 text-primary'
                                        : 'text-slate-500 dark:text-slate-400'
                                        }`}
                                >
                                    <span className="material-symbols-outlined text-[18px]">{item.icon}</span>
                                    <span>{item.label}</span>
                                </Link>
                            ))}
                        </nav>
                    )}
                </div>
            </header>

            {/* Main Content */}
            <main className="max-w-[1800px] mx-auto px-4 sm:px-6 lg:px-8 py-6 mobile:px-reduced">
                <Outlet />
            </main>

            {/* Footer */}
            <footer className="bg-white dark:bg-surface-dark border-t border-gray-200 dark:border-border-dark mt-16">
                <div className="max-w-[1800px] mx-auto px-4 sm:px-6 lg:px-8 py-8 mobile:px-reduced">
                    <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                        <p className="text-sm text-slate-500">© 2024 Hermeos Proptech. All rights reserved.</p>
                        <div className="flex gap-6">
                            <a href="#" className="text-sm text-slate-500 hover:text-primary transition-colors">Privacy Policy</a>
                            <a href="#" className="text-sm text-slate-500 hover:text-primary transition-colors">Terms of Service</a>
                            <a href="#" className="text-sm text-slate-500 hover:text-primary transition-colors">Contact</a>
                        </div>
                    </div>
                </div>
            </footer>

            {/* Chatbot Assistant */}
            <Chatbot />
        </div>
    );
}

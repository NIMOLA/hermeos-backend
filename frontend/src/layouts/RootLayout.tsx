import { useState, useEffect } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import Chatbot from '../components/Chatbot';
import { useAuth } from '../contexts/AuthContext';
import Sidebar from '../components/Sidebar';
import Footer from '../components/Footer';
import Header from '../components/Header';
import CookieConsent from '../components/CookieConsent';

export default function RootLayout() {
    const { isAuthenticated, logout } = useAuth();
    const { theme } = useTheme();
    const navigate = useNavigate();
    const location = useLocation();

    // Define route state variables
    const isLandingPage = location.pathname === '/';
    // Public marketing/info pages that should share the public layout (no sidebar)
    // Included /properties to ensure it uses public layout
    const isPublicInfoPage = ['/about', '/support', '/privacy', '/terms', '/contact'].includes(location.pathname) || location.pathname.startsWith('/properties');
    const isAuthPage = ['/login', '/signup', '/forgot-password', '/verify-email', '/password-reset-sent', '/admin/login', '/admin/accept-invitation'].some(path => location.pathname.startsWith(path));
    const isAdminRoute = location.pathname.startsWith('/admin') && !location.pathname.startsWith('/admin/login') && !location.pathname.startsWith('/admin/accept-invitation');

    // We want to hide the User Sidebar/Nav for: Landing, Auth, Admin, and Public Info pages
    const shouldHideNav = isLandingPage || isPublicInfoPage || isAuthPage || isAdminRoute;

    const [isCollapsed, setIsCollapsed] = useState(false);
    const [isMobileOpen, setIsMobileOpen] = useState(false);

    // Close mobile menu on route change
    useEffect(() => {
        setIsMobileOpen(false);
    }, [location.pathname]);

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    if (shouldHideNav) {
        // For Admin Routes (excluding login), we strictly return Outlet because AdminLayout handles the UI
        if (isAdminRoute) {
            return <Outlet />;
        }

        return (
            <div className="min-h-screen bg-background-light dark:bg-background-dark flex flex-col">
                <Header />
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
            <CookieConsent />
        </div>
    );
}

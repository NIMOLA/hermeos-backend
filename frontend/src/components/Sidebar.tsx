
import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import logoFull from '../assets/logo-full.png';
import { useAuth } from '../contexts/AuthContext';
import {
    LayoutDashboard,
    Wallet,
    Building2,
    History,
    Settings,
    LifeBuoy,
    ChevronLeft,
    ChevronRight,
    LogOut,
    Users,
    GraduationCap
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import ThemeToggle from './ThemeToggle';

interface SidebarProps {
    isCollapsed: boolean;
    toggleCollapse: () => void;
    isMobileOpen: boolean;
    toggleMobile: () => void;
}

export default function Sidebar({ isCollapsed, toggleCollapse, isMobileOpen, toggleMobile }: SidebarProps) {
    const { user, logout } = useAuth();
    const location = useLocation();
    const { theme } = useTheme();

    const isActive = (path: string) => {
        return location.pathname === path || location.pathname.startsWith(path + '/');
    };

    // Customer Navigation
    const navItems = [
        { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
        { path: '/properties', label: 'Assets', icon: Building2 }, // Renamed to Assets for clarity
        { path: '/portfolio', label: 'Portfolio', icon: Wallet },
        { path: '/transactions', label: 'Transactions', icon: History },
        { path: '/education', label: 'Learn', icon: GraduationCap },
        { path: '/support', label: 'Support', icon: LifeBuoy },
        { path: '/settings', label: 'Settings', icon: Settings },
    ];

    // Admin Navigation - Simplified to avoid duplicates
    const adminItems = [
        { path: '/admin', label: 'Overview', icon: LayoutDashboard },
        { path: '/admin/users', label: 'Users', icon: Users }, // Explicit Users link
        { path: '/admin/content', label: 'Content', icon: GraduationCap },
        // { path: '/admin/approvals', label: 'Approvals', icon: CheckSquare }, // Add if needed
    ];

    // Determine which items to show
    const itemsToShow = (user?.role === 'ADMIN' || user?.role === 'SUPER_ADMIN')
        ? adminItems // Admins see ONLY admin items? Or hybrid? Usually hybrid or toggle. 
        // Based on screenshot, it seems mixed. 
        // Let's assume admins mostly want Admin + limited user features or Full Admin Sidebar.
        // Screenshot shows: Dashboard, Assets, Users, Users(dup), Support, Content Center...
        // This implies a mix.
        // Let's manually construct the Admin Sidebar to match the screenshot but CLEAN.
        : navItems;

    // Fixed Admin List matching the screenshot style but corrected
    const adminSidebar = [
        { path: '/admin', label: 'Dashboard', icon: LayoutDashboard },
        { path: '/admin/properties', label: 'Assets', icon: Building2 },
        { path: '/admin/users', label: 'Users', icon: Users },
        { path: '/admin/support', label: 'Support', icon: LifeBuoy },
        { path: '/admin/content', label: 'Content Center', icon: GraduationCap },
        { path: '/admin/audit', label: 'Audit Trail', icon: History },
        // Settings is usually at bottom or specialized
        { path: '/settings', label: 'Settings', icon: Settings },
    ];

    const displayedItems = (user?.role === 'ADMIN' || user?.role === 'SUPER_ADMIN')
        ? adminSidebar
        : navItems;

    return (
        <>
            {/* Mobile Overlay */}
            {isMobileOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-40 md:hidden glass-effect"
                    onClick={toggleMobile}
                />
            )}

            {/* Sidebar Container */}
            <aside
                className={`
                    fixed top-0 left-0 z-[60] h-screen bg-white dark:bg-card-dark border-r border-slate-200 dark:border-slate-800 transition-all duration-300 ease-in-out
                    ${isCollapsed ? 'w-20' : 'w-64'}
                    ${isMobileOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
                `}
            >
                {/* Header / Logo */}
                <div className="h-16 flex items-center justify-between px-4 border-b border-slate-200 dark:border-slate-800">
                    <div className={`flex items-center gap-3 overflow-hidden ${isCollapsed ? 'justify-center w-full' : ''}`}>
                        <div className="h-10 w-auto flex items-center justify-center shrink-0">
                            <img
                                src={logoFull}
                                alt="Hermeos"
                                className={`h-full w-auto object-contain dark:brightness-0 dark:invert transition-all duration-300 ${isCollapsed ? 'opacity-0 w-0' : 'opacity-100'}`}
                            />
                            {isCollapsed && (
                                <span className="absolute text-xl font-bold text-primary dark:text-white">H</span>
                            )}
                        </div>
                    </div>
                </div>

                {/* Navigation */}
                <nav className="p-3 space-y-1 mt-4 overflow-y-auto max-h-[calc(100vh-200px)] custom-scrollbar">
                    {navItems.map((item) => {
                        const active = isActive(item.path);
                        return (
                            <Link
                                key={item.path}
                                to={item.path}
                                onClick={() => isMobileOpen && toggleMobile()}
                                className={`
                                    flex items-center gap-3 px-3 py-3 rounded-lg transition-all duration-200 group relative
                                    ${active
                                        ? 'bg-primary text-white shadow-md shadow-primary/20'
                                        : 'text-slate-500 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white'
                                    }
                                    ${isCollapsed ? 'justify-center' : ''}
                                `}
                                title={isCollapsed ? item.label : ''}
                            >
                                <item.icon className={`w-5 h-5 ${active ? 'text-white' : ''} shrink-0`} />
                                {!isCollapsed && (
                                    <span className="text-sm font-medium whitespace-nowrap">{item.label}</span>
                                )}

                                {isCollapsed && (
                                    <div className="absolute left-full ml-4 px-2 py-1 bg-slate-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-50 pointer-events-none">
                                        {item.label}
                                    </div>
                                )}
                            </Link>
                        );
                    })}

                    {/* Admin Switcher */}
                    {(user?.role === 'ADMIN' || user?.role === 'SUPER_ADMIN') && (
                        <div className="mt-6 pt-6 border-t border-slate-200 dark:border-slate-800">
                            <Link
                                to="/admin"
                                className={`
                                    flex items-center gap-3 px-3 py-3 rounded-lg transition-all duration-200 group relative
                                    text-purple-600 dark:text-purple-400 hover:bg-purple-50 dark:hover:bg-purple-900/20 font-medium
                                    ${isCollapsed ? 'justify-center' : ''}
                                `}
                                title="Switch to Admin"
                            >
                                <Users className="w-5 h-5 shrink-0" />
                                {!isCollapsed && (
                                    <span className="text-sm whitespace-nowrap">Switch to Admin</span>
                                )}
                            </Link>
                        </div>
                    )}
                </nav>

                {/* Footer / User Profile */}
                <div className="absolute bottom-0 left-0 w-full p-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-card-dark/50">
                    <div className={`flex items-center gap-3 ${isCollapsed ? 'justify-center' : ''}`}>
                        <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold shrink-0">
                            {user?.firstName?.[0] || 'U'}
                        </div>
                        {!isCollapsed && (
                            <div className="overflow-hidden">
                                <p className="text-sm font-semibold text-slate-900 dark:text-white truncate">{user?.firstName} {user?.lastName}</p>
                                <p className="text-xs text-slate-500 truncate capitalize">{user?.role?.replace('_', ' ').toLowerCase()}</p>
                            </div>
                        )}
                    </div>

                    <div className={`mt-4 flex ${isCollapsed ? 'flex-col gap-2' : 'justify-between'} items-center`}>
                        <button
                            onClick={toggleCollapse}
                            className="hidden md:flex p-1.5 rounded-md hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-500 transition-colors"
                        >
                            {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
                        </button>
                        <ThemeToggle className="text-slate-400 hover:text-slate-900 dark:hover:text-white" />
                        <button
                            onClick={logout}
                            className="p-1.5 rounded-md hover:bg-red-50 hover:text-red-500 text-slate-400 transition-colors"
                            title="Logout"
                        >
                            <LogOut className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            </aside>
        </>
    );
}

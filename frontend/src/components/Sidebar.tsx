import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
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
    Bell,
    Users,
    GraduationCap,
    Menu
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

    const navItems = [
        { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
        { path: '/properties', label: 'Marketplace', icon: Building2 },
        { path: '/portfolio', label: 'Portfolio', icon: Wallet },
        { path: '/transactions', label: 'Transactions', icon: History },
        { path: '/education', label: 'Learn', icon: GraduationCap },
        { path: '/support', label: 'Support', icon: LifeBuoy },
        { path: '/settings', label: 'Settings', icon: Settings },
    ];

    const adminItems = [
        { path: '/admin', label: 'Admin Panel', icon: Users },
    ];

    const allItems = user?.role === 'ADMIN' || user?.role === 'SUPER_ADMIN'
        ? [...navItems, ...adminItems]
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
                    fixed top-0 left-0 z-50 h-screen bg-white dark:bg-card-dark border-r border-slate-200 dark:border-slate-800 transition-all duration-300 ease-in-out
                    ${isCollapsed ? 'w-20' : 'w-64'}
                    ${isMobileOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
                `}
            >
                {/* Header / Logo */}
                <div className="h-16 flex items-center justify-between px-4 border-b border-slate-200 dark:border-slate-800">
                    <div className={`flex items-center gap-3 overflow-hidden ${isCollapsed ? 'justify-center w-full' : ''}`}>
                        <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center shrink-0">
                            {/* Simple Logo Icon */}
                            <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M3 21h18v-2H3v2zm0-4h18v-2H3v2zm0-4h18v-2H3v2zm0-4h18V7H3v2zm0-6v2h18V3H3z" />
                            </svg>
                        </div>
                        {!isCollapsed && (
                            <span className="font-bold text-lg tracking-tight text-slate-900 dark:text-white whitespace-nowrap">
                                Hermeos
                            </span>
                        )}
                    </div>
                    {/* Desktop Collapse Button - Only show when expanded to avoid clutter in collapsed mode, or position absolute */}
                </div>

                {/* Navigation */}
                <nav className="p-3 space-y-1 mt-4 overflow-y-auto max-h-[calc(100vh-140px)] custom-scrollbar">
                    {allItems.map((item) => {
                        const active = isActive(item.path);
                        return (
                            <Link
                                key={item.path}
                                to={item.path}
                                onClick={() => isMobileOpen && toggleMobile()} // Close mobile menu on click
                                className={`
                                    flex items-center gap-3 px-3 py-3 rounded-lg transition-all duration-200 group relative
                                    ${active
                                        ? 'bg-primary text-white shadow-md shadow-primary/20'
                                        : 'text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white'
                                    }
                                    ${isCollapsed ? 'justify-center' : ''}
                                `}
                                title={isCollapsed ? item.label : ''}
                            >
                                <item.icon className={`w-5 h-5 ${active ? 'text-white' : ''} shrink-0`} />
                                {!isCollapsed && (
                                    <span className="text-sm font-medium whitespace-nowrap">{item.label}</span>
                                )}

                                {/* Tooltip for collapsed mode */}
                                {isCollapsed && (
                                    <div className="absolute left-full ml-4 px-2 py-1 bg-slate-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-50 pointer-events-none">
                                        {item.label}
                                    </div>
                                )}
                            </Link>
                        );
                    })}
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
                                <p className="text-xs text-slate-500 truncate">{user?.email}</p>
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

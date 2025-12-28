import { Link, Outlet, useLocation } from 'react-router-dom';

export default function AdminLayout() {
    const location = useLocation();

    const isActive = (path: string) => {
        if (path === '/admin') {
            return location.pathname === '/admin';
        }
        return location.pathname.startsWith(path);
    };

    const navItems = [
        { path: '/admin', label: 'Dashboard', icon: 'dashboard' },
        { path: '/admin/assets', label: 'Assets', icon: 'apartment' },
        { path: '/admin/users', label: 'Partners', icon: 'group' },
        { path: '/admin/exits', label: 'Exit Requests', icon: 'logout' },
        { path: '/admin/financials', label: 'Financials', icon: 'attach_money' },
        { path: '/admin/audit-trail', label: 'Audit Trail', icon: 'history' },
        { path: '/admin/settings', label: 'Settings', icon: 'settings' },
    ];

    return (
        <div className="flex h-screen w-full overflow-hidden bg-background-light dark:bg-background-dark text-[#0e141b] dark:text-[#e2e8f0] font-display antialiased">
            {/* Sidebar */}
            <aside className="w-64 flex-shrink-0 flex flex-col bg-surface-light dark:bg-surface-dark border-r border-slate-200 dark:border-slate-800 h-full overflow-y-auto z-20 hidden md:flex transition-colors duration-300">
                {/* Logo/Header */}
                <div className="p-6 pb-4 border-b border-slate-200 dark:border-slate-800">
                    <Link to="/admin" className="flex gap-3 items-center group">
                        <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
                            <span className="material-symbols-outlined text-white text-xl">shield</span>
                        </div>
                        <div className="flex flex-col">
                            <h1 className="text-[#0e141b] dark:text-white text-base font-bold leading-tight">Hermeos Admin</h1>
                            <p className="text-[#4e7397] dark:text-slate-400 text-xs font-normal leading-tight">Management Console</p>
                        </div>
                    </Link>
                </div>

                {/* Navigation */}
                <nav className="flex flex-col gap-1 p-4 flex-1">
                    {navItems.map((item) => (
                        <Link
                            key={item.path}
                            to={item.path}
                            className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all group ${isActive(item.path)
                                ? 'bg-primary/10 text-primary font-medium'
                                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                                }`}
                        >
                            <span className={`material-symbols-outlined transition-colors ${isActive(item.path) ? 'text-primary' : 'group-hover:text-primary'
                                }`}>
                                {item.icon}
                            </span>
                            <p className="text-sm leading-normal">{item.label}</p>
                        </Link>
                    ))}
                </nav>

                {/* Footer Section */}
                <div className="p-4 border-t border-slate-200 dark:border-slate-800 mt-auto">
                    <Link
                        to="/"
                        className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-600 dark:text-slate-400 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-600 dark:hover:text-red-400 transition-colors group"
                    >
                        <span className="material-symbols-outlined">exit_to_app</span>
                        <p className="text-sm font-medium leading-normal">Exit Admin Panel</p>
                    </Link>
                </div>
            </aside>

            <main className="flex-1 flex flex-col h-full overflow-hidden bg-background-light dark:bg-background-dark relative">
                {/* Mobile Header */}
                <div className="md:hidden h-16 bg-surface-light dark:bg-surface-dark border-b border-slate-200 dark:border-slate-800 flex items-center px-4 justify-between sticky top-0 z-10">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                            <span className="material-symbols-outlined text-white text-lg">shield</span>
                        </div>
                        <span className="font-bold text-lg dark:text-white">Hermeos Admin</span>
                    </div>
                    <Link to="/" className="text-slate-600 dark:text-slate-400 hover:text-primary">
                        <span className="material-symbols-outlined">exit_to_app</span>
                    </Link>
                </div>

                {/* Mobile Navigation */}
                <nav className="md:hidden bg-surface-light dark:bg-surface-dark border-b border-slate-200 dark:border-slate-800 overflow-x-auto">
                    <div className="flex gap-1 p-2">
                        {navItems.map((item) => (
                            <Link
                                key={item.path}
                                to={item.path}
                                className={`flex flex-col items-center gap-1 px-3 py-2 rounded-lg whitespace-nowrap transition-all ${isActive(item.path)
                                    ? 'bg-primary/10 text-primary'
                                    : 'text-slate-600 dark:text-slate-400'
                                    }`}
                            >
                                <span className="material-symbols-outlined text-[18px]">{item.icon}</span>
                                <span className="text-xs font-medium">{item.label}</span>
                            </Link>
                        ))}
                    </div>
                </nav>

                {/* Content Area */}
                <div className="flex-1 overflow-y-auto p-4 md:p-8">
                    <Outlet />
                </div>
            </main>
        </div>
    );
}

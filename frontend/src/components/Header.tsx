import { useState } from 'react';
import { Link } from 'react-router-dom';
import ThemeToggle from './ThemeToggle';
import logoFull from '../assets/logo-full.png';
import { useAuth } from '../contexts/AuthContext';

export default function Header() {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const { isAuthenticated } = useAuth();

    return (
        <header className="sticky top-0 z-50 w-full border-b border-gray-200 dark:border-border-dark bg-white dark:bg-[#111a22]">
            <div className="mx-auto flex h-32 max-w-[1440px] items-center justify-between px-4 sm:px-6 lg:px-8">
                {/* Logo Area */}
                <div className="flex items-center gap-4">
                    <Link to="/">
                        <img
                            src={logoFull}
                            alt="Hermeos Proptech"
                            // Assuming Logo is WHITE/LIGHT by default (hence invisible in light mode)
                            // We Invert it in Light Mode (to black) and reset in Dark Mode (to white)
                            className="h-10 md:h-12 w-auto invert dark:invert-0 object-contain"
                        />
                    </Link>
                </div>

                {/* Desktop Navigation - Visible only when NOT authenticated */}
                {!isAuthenticated && (
                    <nav className="hidden md:flex items-center gap-8">
                        <Link to="/about" className="text-sm font-medium text-slate-600 dark:text-gray-300 hover:text-primary dark:hover:text-white transition-colors">
                            About Us
                        </Link>
                        <Link to="/support" className="text-sm font-medium text-slate-600 dark:text-gray-300 hover:text-primary dark:hover:text-white transition-colors">
                            Support
                        </Link>
                    </nav>
                )}

                {/* Right Side Actions */}
                <div className="flex items-center gap-4">
                    <ThemeToggle />

                    {isAuthenticated ? (
                        <div className="flex items-center gap-4">
                            <Link to="/notifications" className="relative text-slate-500 hover:text-primary transition-colors">
                                <span className="material-symbols-outlined text-[24px]">notifications</span>
                            </Link>

                            {/* Replaced Avatar with Dashboard Button */}
                            <Link to="/dashboard">
                                <button className="bg-primary text-white px-5 py-2 rounded-lg text-sm font-bold shadow-md hover:bg-blue-600 transition-colors flex items-center gap-2">
                                    <span className="material-symbols-outlined text-[18px]">dashboard</span>
                                    <span>Dashboard</span>
                                </button>
                            </Link>
                        </div>
                    ) : (
                        <Link to="/login">
                            <button className="bg-primary text-white px-5 py-2 rounded-lg text-sm font-bold shadow-md hover:bg-blue-600 transition-colors flex items-center gap-2">
                                <span className="material-symbols-outlined text-[18px]">login</span>
                                <span>Login</span>
                            </button>
                        </Link>
                    )}

                    {/* Mobile Menu Button */}
                    <button
                        className="md:hidden p-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                    >
                        <span className="material-symbols-outlined text-[28px]">
                            {isMobileMenuOpen ? 'close' : 'menu'}
                        </span>
                    </button>
                </div>
            </div>

            {/* Mobile Navigation Menu */}
            {isMobileMenuOpen && (
                <div className="md:hidden absolute top-32 left-0 w-full bg-white dark:bg-[#111a22] border-b border-gray-200 dark:border-border-dark shadow-xl animate-in slide-in-from-top-5 duration-200">
                    <div className="flex flex-col p-4 space-y-4">
                        {!isAuthenticated && (
                            <>
                                <Link
                                    to="/"
                                    className="flex items-center gap-3 p-3 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 font-medium transition-colors"
                                    onClick={() => setIsMobileMenuOpen(false)}
                                >
                                    <span className="material-symbols-outlined">home</span>
                                    Home
                                </Link>
                                <Link
                                    to="/about"
                                    className="flex items-center gap-3 p-3 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 font-medium transition-colors"
                                    onClick={() => setIsMobileMenuOpen(false)}
                                >
                                    <span className="material-symbols-outlined">info</span>
                                    About Us
                                </Link>
                                <Link
                                    to="/support"
                                    className="flex items-center gap-3 p-3 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 font-medium transition-colors"
                                    onClick={() => setIsMobileMenuOpen(false)}
                                >
                                    <span className="material-symbols-outlined">help</span>
                                    Support Center
                                </Link>
                                <div className="h-px bg-slate-200 dark:bg-slate-700 my-2"></div>
                            </>
                        )}
                        {isAuthenticated ? (
                            <Link
                                to="/dashboard"
                                className="flex items-center gap-3 p-3 rounded-lg bg-primary/10 text-primary font-bold hover:bg-primary/20 transition-colors"
                                onClick={() => setIsMobileMenuOpen(false)}
                            >
                                <span className="material-symbols-outlined">dashboard</span>
                                Go to Dashboard
                            </Link>
                        ) : (
                            <Link
                                to="/login"
                                className="flex items-center gap-3 p-3 rounded-lg bg-primary text-white font-bold hover:bg-primary/90 transition-colors"
                                onClick={() => setIsMobileMenuOpen(false)}
                            >
                                <span className="material-symbols-outlined">login</span>
                                Login
                            </Link>
                        )}
                    </div>
                </div>
            )}
        </header>
    );
}

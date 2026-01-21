import { useState } from 'react';
import { Link } from 'react-router-dom';
import ThemeToggle from './ThemeToggle';
import logoFull from '../assets/logo-full.png';

export default function Header() {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    return (
        <header className="sticky top-0 z-50 w-full border-b border-gray-200 dark:border-border-dark bg-white dark:bg-[#111a22]">
            <div className="mx-auto flex h-16 max-w-[1440px] items-center justify-between px-4 sm:px-6 lg:px-8">
                {/* Logo Area */}
                <div className="flex items-center gap-4">
                    <Link to="/">
                        <img
                            src={logoFull}
                            alt="Hermeos Proptech"
                            className="h-8 md:h-32 w-auto brightness-0 dark:invert object-contain"
                            style={{ maxHeight: '40px' }}
                        />
                        {/* Note: adjusted h-32 to max-height style because h-32 (128px) is too big for a h-16 (64px) header container */}
                    </Link>
                </div>

                {/* Desktop Navigation */}
                <nav className="hidden md:flex items-center gap-8">
                    <Link to="/" className="text-sm font-medium text-slate-600 dark:text-gray-300 hover:text-primary dark:hover:text-white transition-colors">
                        Home
                    </Link>
                    <Link to="/properties" className="text-sm font-medium text-slate-600 dark:text-gray-300 hover:text-primary dark:hover:text-white transition-colors">
                        Properties
                    </Link>
                    <Link to="/about" className="text-sm font-medium text-slate-600 dark:text-gray-300 hover:text-primary dark:hover:text-white transition-colors">
                        About
                    </Link>
                    <Link to="/support" className="text-sm font-medium text-slate-600 dark:text-gray-300 hover:text-primary dark:hover:text-white transition-colors">
                        Support
                    </Link>
                </nav>

                {/* Right Side Actions */}
                <div className="flex items-center gap-4">
                    <ThemeToggle />
                    <Link to="/notifications" className="relative text-slate-500 hover:text-primary transition-colors">
                        <span className="material-symbols-outlined text-[24px]">notifications</span>
                    </Link>
                    <button className="hidden sm:flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-bold text-white shadow hover:bg-primary/90 transition-colors">
                        <span className="material-symbols-outlined text-[20px]">download</span>
                        <span>Report</span>
                    </button>

                    {/* User Avatar */}
                    <Link to="/dashboard">
                        <div
                            className="h-10 w-10 rounded-full bg-cover bg-center ring-2 ring-gray-200 dark:ring-border-dark cursor-pointer hover:ring-primary transition-all"
                            style={{
                                backgroundImage:
                                    "url('https://lh3.googleusercontent.com/aida-public/AB6AXuAedh3qjkN5ysGOenDMQp7NU49X0HxKA0ev6Xi9HEOtA_DBEIAqfMVCEFfFYOvd7BGhBfmvdLxNqAxuGc2Hy4LxuG1-GjnGUV1a3SmK-KXZ5Mrz9Tk8thAqshM-mxB9q7mGN7X7mRj_6CXp-eyPJcNY0SYYFIFaquOVGAAyJpDzRBQaZwIpKos72a1TtsRXJkRcw3xw7x21uHLfiASat4OxLNCSJFEzv8cZd_ZE2-0wTyaHRtT0R4P6SA4mf0uxJ-ATXFVWfY0bHAd3')",
                            }}
                        ></div>
                    </Link>

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
                <div className="md:hidden absolute top-16 left-0 w-full bg-white dark:bg-[#111a22] border-b border-gray-200 dark:border-border-dark shadow-xl animate-in slide-in-from-top-5 duration-200">
                    <div className="flex flex-col p-4 space-y-4">
                        <Link
                            to="/"
                            className="flex items-center gap-3 p-3 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 font-medium transition-colors"
                            onClick={() => setIsMobileMenuOpen(false)}
                        >
                            <span className="material-symbols-outlined">home</span>
                            Home
                        </Link>
                        <Link
                            to="/properties"
                            className="flex items-center gap-3 p-3 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 font-medium transition-colors"
                            onClick={() => setIsMobileMenuOpen(false)}
                        >
                            <span className="material-symbols-outlined">apartment</span>
                            Properties
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
                        <Link
                            to="/dashboard"
                            className="flex items-center gap-3 p-3 rounded-lg bg-primary/10 text-primary font-bold hover:bg-primary/20 transition-colors"
                            onClick={() => setIsMobileMenuOpen(false)}
                        >
                            <span className="material-symbols-outlined">dashboard</span>
                            Go to Dashboard
                        </Link>
                    </div>
                </div>
            )}
        </header>
    );
}

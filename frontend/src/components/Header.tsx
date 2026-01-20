import { Link } from 'react-router-dom';
import ThemeToggle from './ThemeToggle';
import logoFull from '../assets/logo-full.png';

export default function Header() {
    return (
        <header className="sticky top-0 z-50 w-full border-b border-gray-200 dark:border-border-dark bg-white dark:bg-[#111a22]">
            <div className="mx-auto flex h-16 max-w-[1440px] items-center justify-between px-4 sm:px-6 lg:px-8">
                <div className="flex items-center gap-4">
                    <Link to="/">
                        <img
                            src={logoFull}
                            alt="Hermeos Proptech"
                            className="h-32 w-auto brightness-0 dark:invert"
                        />
                    </Link>
                </div>
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
                    <Link to="/contact" className="text-sm font-medium text-slate-600 dark:text-gray-300 hover:text-primary dark:hover:text-white transition-colors">
                        Contact
                    </Link>
                </nav>
                <div className="flex items-center gap-4">
                    <ThemeToggle />
                    <Link to="/notifications" className="relative text-slate-500 hover:text-primary transition-colors">
                        <span className="material-symbols-outlined text-[24px]">notifications</span>
                    </Link>
                    <button className="hidden sm:flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-bold text-white shadow hover:bg-primary/90 transition-colors">
                        <span className="material-symbols-outlined text-[20px]">download</span>
                        <span>Report</span>
                    </button>
                    <div
                        className="h-10 w-10 rounded-full bg-cover bg-center ring-2 ring-gray-200 dark:ring-border-dark cursor-pointer"
                        data-alt="User profile avatar showing a professional person"
                        style={{
                            backgroundImage:
                                "url('https://lh3.googleusercontent.com/aida-public/AB6AXuAedh3qjkN5ysGOenDMQp7NU49X0HxKA0ev6Xi9HEOtA_DBEIAqfMVCEFfFYOvd7BGhBfmvdLxNqAxuGc2Hy4LxuG1-GjnGUV1a3SmK-KXZ5Mrz9Tk8thAqshM-mxB9q7mGN7X7mRj_6CXp-eyPJcNY0SYYFIFaquOVGAAyJpDzRBQaZwIpKos72a1TtsRXJkRcw3xw7x21uHLfiASat4OxLNCSJFEzv8cZd_ZE2-0wTyaHRtT0R4P6SA4mf0uxJ-ATXFVWfY0bHAd3')",
                        }}
                    ></div>
                </div>
            </div>
        </header>
    );
}

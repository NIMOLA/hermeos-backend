import { Link } from 'react-router-dom';

export default function Header() {
    return (
        <header className="sticky top-0 z-50 w-full border-b border-gray-200 dark:border-border-dark bg-white dark:bg-[#111a22]">
            <div className="mx-auto flex h-16 max-w-[1440px] items-center justify-between px-4 sm:px-6 lg:px-8">
                <div className="flex items-center gap-4">
                    <div className="flex items-center justify-center size-8 rounded bg-primary/10 text-primary">
                        <span className="material-symbols-outlined">domain</span>
                    </div>
                    <h1 className="text-lg font-bold leading-tight tracking-[-0.015em] text-slate-900 dark:text-white">
                        Hermeos Proptech
                    </h1>
                </div>
                <nav className="hidden md:flex items-center gap-8">
                    <Link to="/" className="text-sm font-medium text-slate-600 dark:text-gray-300 hover:text-primary dark:hover:text-white transition-colors">
                        Portfolio
                    </Link>
                    <Link to="/properties" className="text-sm font-medium text-slate-600 dark:text-gray-300 hover:text-primary dark:hover:text-white transition-colors">
                        Properties
                    </Link>
                    <Link to="/proceeds" className="text-sm font-medium text-slate-600 dark:text-gray-300 hover:text-primary dark:hover:text-white transition-colors">
                        Proceeds
                    </Link>
                    <Link to="/settings" className="text-sm font-medium text-slate-600 dark:text-gray-300 hover:text-primary dark:hover:text-white transition-colors">
                        Settings
                    </Link>
                </nav>
                <div className="flex items-center gap-4">
                    <Link to="/admin">
                        <button className="hidden sm:flex items-center gap-2 rounded-lg bg-slate-900 dark:bg-slate-800 text-white px-4 py-2 text-sm font-bold shadow hover:bg-slate-800 dark:hover:bg-slate-700 transition-colors border border-slate-700">
                            <span className="material-symbols-outlined text-[20px]">admin_panel_settings</span>
                            <span>Admin</span>
                        </button>
                    </Link>
                    <button className="hidden sm:flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-bold text-white shadow hover:bg-primary/90 transition-colors">
                        <span className="material-symbols-outlined text-[20px]">download</span>
                        <span>Report</span>
                    </button>
                    <div
                        className="h-10 w-10 rounded-full bg-cover bg-center ring-2 ring-gray-200 dark:ring-border-dark"
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

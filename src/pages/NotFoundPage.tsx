
import { Link } from 'react-router-dom';
import { Button } from '../components/ui/button';

export default function NotFoundPage() {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 dark:bg-background-dark p-6 text-center">
            <div className="bg-primary/10 rounded-full p-6 mb-6">
                <span className="material-symbols-outlined text-primary text-6xl">travel_explore</span>
            </div>
            <h1 className="text-6xl font-black text-slate-900 dark:text-white mb-2">404</h1>
            <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-200 mb-4">Page Not Found</h2>
            <p className="text-slate-600 dark:text-slate-400 max-w-md mb-8">
                The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
            </p>
            <div className="flex gap-4">
                <Link to="/">
                    <Button variant="outline">Go Home</Button>
                </Link>
                <Link to="/proceeds">
                    <Button>Back to Dashboard</Button>
                </Link>
            </div>
        </div>
    );
}


import { Button } from '../../components/ui/button';

export default function NotificationsPage() {
    const notifications = [
        { id: 1, type: 'success', title: 'Dividend Distribution', message: 'You received ₦125,000.00 dividend from Oceanview Apartments.', time: '2 hours ago', read: false },
        { id: 2, type: 'info', title: 'New Asset Listed', message: 'Greenfield Estate, Abuja is now open for co-ownership.', time: '1 day ago', read: false },
        { id: 3, type: 'warning', title: 'KYC Update Required', message: 'Please update your proof of address to ensure compliance.', time: '3 days ago', read: true },
        { id: 4, type: 'system', title: 'System Maintenance', message: 'Hermeos will be undergoing scheduled maintenance on Saturday.', time: '1 week ago', read: true },
    ];

    return (
        <div className="max-w-4xl mx-auto p-6 space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Notifications</h1>
                <Button variant="outline" size="sm">Mark all as read</Button>
            </div>

            <div className="space-y-4">
                {notifications.map((note) => (
                    <div key={note.id} className={`flex gap-4 p-4 rounded-xl border transition-colors ${note.read ? 'bg-white dark:bg-[#1a2632] border-slate-200 dark:border-slate-800' : 'bg-blue-50 dark:bg-blue-900/10 border-blue-100 dark:border-blue-900/30'}`}>
                        <div className={`mt-1 size-10 flex items-center justify-center rounded-full shrink-0 ${note.type === 'success' ? 'bg-emerald-100 text-emerald-600' :
                                note.type === 'warning' ? 'bg-orange-100 text-orange-600' :
                                    note.type === 'info' ? 'bg-blue-100 text-blue-600' : 'bg-slate-100 text-slate-600'
                            }`}>
                            <span className="material-symbols-outlined">
                                {note.type === 'success' ? 'payments' : note.type === 'warning' ? 'warning' : note.type === 'info' ? 'campaign' : 'settings'}
                            </span>
                        </div>
                        <div className="flex-1">
                            <div className="flex justify-between items-start">
                                <h3 className={`font-bold text-base ${note.read ? 'text-slate-900 dark:text-white' : 'text-slate-900 dark:text-white'}`}>{note.title}</h3>
                                <span className="text-xs text-slate-500 whitespace-nowrap ml-2">{note.time}</span>
                            </div>
                            <p className={`text-sm mt-1 ${note.read ? 'text-slate-500 dark:text-slate-400' : 'text-slate-700 dark:text-slate-300'}`}>
                                {note.message}
                            </p>
                        </div>
                        {!note.read && (
                            <div className="mt-2 text-primary">
                                <span className="block size-2.5 rounded-full bg-primary"></span>
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}

import { Button } from '../../components/ui/button';
import { useFetch, apiClient } from '../../hooks/useApi';
import { useState } from 'react';

interface Notification {
    id: string;
    type: 'success' | 'info' | 'warning' | 'system';
    title: string;
    message: string;
    createdAt: string;
    read: boolean;
}

export default function NotificationsPage() {
    // Assuming GET /notifications returns the list directly or { data: [] }
    // Adjust endpoint based on backend route check
    const { data: notifications, isLoading, setData } = useFetch<Notification[]>('/notifications');
    const [marking, setMarking] = useState(false);

    const markAllRead = async () => {
        setMarking(true);
        try {
            await apiClient.put('/notifications/read-all');
            // Optimistic update
            if (notifications) {
                setData(notifications.map(n => ({ ...n, read: true })));
            }
        } catch (error) {
            console.error('Failed to mark all as read', error);
        } finally {
            setMarking(false);
        }
    };

    const formatTime = (dateStr: string) => {
        const date = new Date(dateStr);
        const now = new Date();
        const diff = Math.floor((now.getTime() - date.getTime()) / 1000);

        if (diff < 60) return 'Just now';
        if (diff < 3600) return `${Math.floor(diff / 60)} mins ago`;
        if (diff < 86400) return `${Math.floor(diff / 3600)} hours ago`;
        return `${Math.floor(diff / 86400)} days ago`;
    };

    if (isLoading) return <div className="p-8 text-center">Loading notifications...</div>;

    return (
        <div className="max-w-4xl mx-auto p-6 space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Notifications</h1>
                <Button variant="outline" size="sm" onClick={markAllRead} disabled={marking || !notifications?.some(n => !n.read)}>
                    {marking ? 'Marking...' : 'Mark all as read'}
                </Button>
            </div>

            <div className="space-y-4">
                {notifications && notifications.length > 0 ? notifications.map((note) => (
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
                                <span className="text-xs text-slate-500 whitespace-nowrap ml-2">{formatTime(note.createdAt)}</span>
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
                )) : (
                    <div className="text-center py-12 text-slate-500">
                        <span className="material-symbols-outlined text-4xl mb-2 opacity-50">notifications_off</span>
                        <p>No notifications yet</p>
                    </div>
                )}
            </div>
        </div>
    );
}

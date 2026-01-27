import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../../components/ui/button';

export default function AdminDashboardPage() {
    const [showAnnouncementModal, setShowAnnouncementModal] = useState(false);
    const [announcementData, setAnnouncementData] = useState({
        recipient: 'all',
        subject: '',
        message: ''
    });
    const [kpis, setKpis] = useState<any>(null);
    const [activities, setActivities] = useState<any[]>([]);
    const [systemStatus, setSystemStatus] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem('token');
        const headers = { 'Authorization': `Bearer ${token}` };

        Promise.all([
            fetch('/api/admin/dashboard/stats', { headers }).then(res => res.json()),
            fetch('/api/admin/dashboard/activity?limit=5', { headers }).then(res => res.json()),
            fetch('/api/admin/dashboard/system-status', { headers }).then(res => res.json())
        ]).then(([statsData, activityData, statusData]) => {
            if (statsData.success) setKpis(statsData.data);
            if (activityData.success) setActivities(activityData.data);
            if (statusData.success) setSystemStatus(statusData.data);
        }).catch(err => {
            console.error('Error fetching dashboard data:', err);
        }).finally(() => {
            setLoading(false);
        });
    }, []);

    const handleSendAnnouncement = async () => {
        try {
            const token = localStorage.getItem('token');
            const res = await fetch('/api/admin/announcements', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(announcementData)
            });

            const data = await res.json();

            if (data.success) {
                alert(`Announcement "${announcementData.subject}" broadcasted successfully!`);
                setShowAnnouncementModal(false);
                setAnnouncementData({ recipient: 'all', subject: '', message: '' });
            } else {
                alert(`Failed to send announcement: ${data.message || 'Unknown error'}`);
            }
        } catch (error) {
            console.error('Error sending announcement:', error);
            alert('An error occurred while sending the announcement.');
        }
    };

    const kpiData = kpis ? [
        {
            label: "Total Partners",
            value: kpis.totalPartners.value.toLocaleString(),
            sub: kpis.totalPartners.label,
            icon: "group",
            color: "blue"
        },
        {
            label: "Assets Under Mgmt",
            value: kpis.assetsUnderManagement.formatted,
            sub: kpis.assetsUnderManagement.label,
            icon: "account_balance",
            color: "emerald"
        },
        {
            label: "Active Distributions",
            value: kpis.activeDistributions.value.toString(),
            sub: kpis.activeDistributions.label,
            icon: "payments",
            color: "purple"
        },
        {
            label: "Pending KYC",
            value: kpis.pendingKYC.value.toString(),
            sub: kpis.pendingKYC.label,
            icon: "badge",
            color: "amber"
        }
    ] : [];

    return (
        <div className="max-w-7xl mx-auto flex flex-col gap-8">
            <div>
                <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Admin Dashboard</h1>
                <p className="text-slate-500 dark:text-slate-400 mt-1">System overview and platform metrics.</p>
            </div>

            {/* KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {loading ? (
                    <div className="col-span-4 text-center py-8 text-slate-500">Loading dashboard stats...</div>
                ) : (
                    kpiData.map((kpi, i) => (
                        <div key={i} className="bg-white dark:bg-[#1a2632] p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between h-32">
                            <div className="flex justify-between items-start">
                                <div>
                                    <p className="text-sm font-medium text-slate-500 dark:text-slate-400">{kpi.label}</p>
                                    <h3 className="text-2xl font-bold text-slate-900 dark:text-white mt-1">{kpi.value}</h3>
                                </div>
                                <div className={`p-2 rounded-lg bg-${kpi.color}-50 text-${kpi.color}-600 dark:bg-${kpi.color}-900/20 dark:text-${kpi.color}-400`}>
                                    <span className="material-symbols-outlined text-xl">{kpi.icon}</span>
                                </div>
                            </div>
                            <span className="text-xs font-medium text-slate-400">{kpi.sub}</span>
                        </div>
                    ))
                )}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Main Content Area (e.g., Recent Activity) */}
                <div className="lg:col-span-2 bg-white dark:bg-[#1a2632] rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
                    <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center">
                        <h3 className="font-bold text-slate-900 dark:text-white">Recent System Activity</h3>
                        <Link to="/admin/audit-trail" className="text-sm text-primary font-medium hover:underline">View All</Link>
                    </div>
                    <div className="divide-y divide-slate-100 dark:divide-slate-800">
                        {loading ? (
                            <div className="px-6 py-8 text-center text-slate-500">Loading activity...</div>
                        ) : activities.length > 0 ? (
                            activities.map((item, i) => (
                                <div key={i} className="px-6 py-4 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-700 flex items-center justify-center text-xs font-bold text-slate-500">
                                            {item.user.charAt(0)}
                                        </div>
                                        <p className="text-sm text-slate-600 dark:text-slate-300">
                                            <span className="font-semibold text-slate-900 dark:text-white">{item.user}</span> {item.action} <span className="font-medium text-slate-800 dark:text-slate-200">{item.target}</span>
                                        </p>
                                    </div>
                                    <span className="text-xs text-slate-400 whitespace-nowrap">{item.time}</span>
                                </div>
                            ))
                        ) : (
                            <div className="px-6 py-8 text-center text-slate-500">No recent activity</div>
                        )}
                    </div>
                </div>

                {/* Quick Actions Sidebar */}
                <div className="flex flex-col gap-6">
                    <div className="bg-white dark:bg-[#1a2632] rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm p-6">
                        <h3 className="font-bold text-slate-900 dark:text-white mb-4">Quick Actions</h3>
                        <div className="grid grid-cols-2 gap-3">
                            <Link to="/admin/assets/new" className="p-3 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors flex flex-col items-center gap-2 text-center group">
                                <span className="material-symbols-outlined text-primary group-hover:scale-110 transition-transform">add_home</span>
                                <span className="text-xs font-medium text-slate-700 dark:text-slate-300">New Asset</span>
                            </Link>

                            {/* Invite User - ADMIN & SUPER_ADMIN only */}
                            {['ADMIN', 'SUPER_ADMIN'].includes(localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')!).role : '') && (
                                <Link to="/admin/users" className="p-3 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors flex flex-col items-center gap-2 text-center group">
                                    <span className="material-symbols-outlined text-emerald-500 group-hover:scale-110 transition-transform">person_add</span>
                                    <span className="text-xs font-medium text-slate-700 dark:text-slate-300">Invite User</span>
                                </Link>
                            )}

                            <Link to="/admin/audit-trail" className="p-3 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors flex flex-col items-center gap-2 text-center group">
                                <span className="material-symbols-outlined text-purple-500 group-hover:scale-110 transition-transform">upload_file</span>
                                <span className="text-xs font-medium text-slate-700 dark:text-slate-300">Upload Doc</span>
                            </Link>

                            <button
                                onClick={() => setShowAnnouncementModal(true)}
                                className="p-3 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors flex flex-col items-center gap-2 text-center group"
                            >
                                <span className="material-symbols-outlined text-amber-500 group-hover:scale-110 transition-transform">campaign</span>
                                <span className="text-xs font-medium text-slate-700 dark:text-slate-300">Announcement</span>
                            </button>
                        </div>
                    </div>

                    <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-xl shadow-lg p-6 text-white">
                        <h3 className="font-bold mb-2">System Status</h3>
                        <div className="flex items-center gap-2 mb-4">
                            <span className="flex h-3 w-3 relative">
                                <span className={`animate-ping absolute inline-flex h-full w-full rounded-full ${systemStatus?.services.api === 'Operational' ? 'bg-emerald-400' : 'bg-red-400'} opacity-75`}></span>
                                <span className={`relative inline-flex rounded-full h-3 w-3 ${systemStatus?.services.api === 'Operational' ? 'bg-emerald-500' : 'bg-red-500'}`}></span>
                            </span>
                            <span className={`text-sm font-medium ${systemStatus?.services.api === 'Operational' ? 'text-emerald-400' : 'text-red-400'}`}>
                                {systemStatus?.services.api === 'Operational' ? 'All Systems Operational' : 'System Issues Detected'}
                            </span>
                        </div>
                        <div className="text-xs text-slate-400 space-y-1">
                            <div className="flex justify-between">
                                <span>CPU Usage:</span>
                                <span className={systemStatus?.cpu.usage > 80 ? 'text-amber-400' : 'text-slate-300'}>{systemStatus ? `${systemStatus.cpu.usage}%` : '...'}</span>
                            </div>
                            <div className="flex justify-between">
                                <span>Memory:</span>
                                <span className={systemStatus?.memory.percentage > 80 ? 'text-amber-400' : 'text-slate-300'}>{systemStatus ? `${systemStatus.memory.percentage}%` : '...'}</span>
                            </div>
                            <div className="flex justify-between">
                                <span>Database:</span>
                                <span>{systemStatus?.services.database || '...'}</span>
                            </div>
                            <div className="flex justify-between">
                                <span>API Latency:</span>
                                <span>{systemStatus?.latency.api || '...'}ms</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Announcement Modal */}
            {showAnnouncementModal && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-white dark:bg-[#1a2632] rounded-xl shadow-2xl max-w-2xl w-full border border-slate-200 dark:border-slate-800">
                        <div className="p-6 border-b border-slate-200 dark:border-slate-800 flex justify-between items-start">
                            <div>
                                <h2 className="text-xl font-bold text-slate-900 dark:text-white">Send Announcement</h2>
                                <p className="text-sm text-slate-500 mt-1">Broadcast a message to platform users</p>
                            </div>
                            <button
                                onClick={() => setShowAnnouncementModal(false)}
                                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
                            >
                                <span className="material-symbols-outlined">close</span>
                            </button>
                        </div>

                        <div className="p-6 space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                                    Send To
                                </label>
                                <select
                                    value={announcementData.recipient}
                                    onChange={(e) => setAnnouncementData({ ...announcementData, recipient: e.target.value })}
                                    className="w-full px-3 py-2 border border-slate-300 dark:border-slate-700 rounded-lg bg-white dark:bg-[#111921] dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent transition-all outline-none"
                                >
                                    <option value="all">All Users</option>
                                    <option value="investors">All Partners</option>
                                    <option value="verified">Verified Users Only</option>
                                    <option value="pending">Pending KYC</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                                    Subject
                                </label>
                                <input
                                    type="text"
                                    value={announcementData.subject}
                                    onChange={(e) => setAnnouncementData({ ...announcementData, subject: e.target.value })}
                                    placeholder="Enter announcement subject..."
                                    className="w-full px-3 py-2 border border-slate-300 dark:border-slate-700 rounded-lg bg-white dark:bg-[#111921] dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent transition-all outline-none"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                                    Message
                                </label>
                                <textarea
                                    value={announcementData.message}
                                    onChange={(e) => setAnnouncementData({ ...announcementData, message: e.target.value })}
                                    placeholder="Compose your announcement message..."
                                    rows={6}
                                    className="w-full px-3 py-2 border border-slate-300 dark:border-slate-700 rounded-lg bg-white dark:bg-[#111921] dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent transition-all outline-none resize-none"
                                />
                            </div>

                            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 flex gap-3">
                                <span className="material-symbols-outlined text-blue-600 dark:text-blue-400">info</span>
                                <p className="text-sm text-blue-700 dark:text-blue-300">
                                    Announcements will be sent via email and displayed in the user's notification center.
                                </p>
                            </div>
                        </div>

                        <div className="p-6 border-t border-slate-200 dark:border-slate-800 flex justify-end gap-3">
                            <Button
                                variant="outline"
                                onClick={() => setShowAnnouncementModal(false)}
                            >
                                Cancel
                            </Button>
                            <Button
                                onClick={handleSendAnnouncement}
                                disabled={!announcementData.subject || !announcementData.message}
                                className="bg-amber-600 hover:bg-amber-700 text-white disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <span className="material-symbols-outlined text-sm mr-2">send</span>
                                Send Announcement
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

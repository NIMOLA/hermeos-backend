import { Link } from 'react-router-dom';
import { Button } from '../../components/ui/button';

export default function AdminUsersPage() {
    const users = [
        { id: 1, name: "Chinedu Okeke", email: "chinedu@example.com", kyc: "Verified", role: "Partner", joined: "Oct 24, 2024" },
        { id: 2, name: "Sarah Williams", email: "sarah.w@example.com", kyc: "Pending", role: "Partner", joined: "Nov 12, 2024" },
        { id: 3, name: "Emeka Balogun", email: "emeka.b@example.com", kyc: "Verified", role: "Partner", joined: "Dec 01, 2024" },
        { id: 4, name: "Grace Adeyemi", email: "grace.a@example.com", kyc: "Verified", role: "Admin", joined: "Sep 15, 2024" },
        { id: 5, name: "Amina Yusuf", email: "amina.y@example.com", kyc: "Rejected", role: "Partner", joined: "Dec 20, 2024" },
    ];

    return (
        <div className="flex flex-col gap-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Partners</h1>
                    <p className="text-slate-500 dark:text-slate-400 text-sm">Track and manage partner accounts and KYC status.</p>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline"><span className="material-symbols-outlined mr-2">download</span> Export CSV</Button>
                    <Button><span className="material-symbols-outlined mr-2">person_add</span> Invite User</Button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-white dark:bg-[#1a2632] border border-slate-200 dark:border-slate-800 rounded-xl p-4 flex items-center gap-4">
                    <div className="bg-blue-100 dark:bg-blue-900/30 text-primary p-3 rounded-full">
                        <span className="material-symbols-outlined">group</span>
                    </div>
                    <div>
                        <p className="text-xs text-slate-500 uppercase font-bold">Total Users</p>
                        <p className="text-2xl font-bold text-slate-900 dark:text-white">1,248</p>
                    </div>
                </div>
                <div className="bg-white dark:bg-[#1a2632] border border-slate-200 dark:border-slate-800 rounded-xl p-4 flex items-center gap-4">
                    <div className="bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 p-3 rounded-full">
                        <span className="material-symbols-outlined">verified</span>
                    </div>
                    <div>
                        <p className="text-xs text-slate-500 uppercase font-bold">Verified KYC</p>
                        <p className="text-2xl font-bold text-slate-900 dark:text-white">982</p>
                    </div>
                </div>
                <div className="bg-white dark:bg-[#1a2632] border border-slate-200 dark:border-slate-800 rounded-xl p-4 flex items-center gap-4">
                    <div className="bg-orange-100 dark:bg-orange-900/30 text-orange-600 p-3 rounded-full">
                        <span className="material-symbols-outlined">pending_actions</span>
                    </div>
                    <div>
                        <p className="text-xs text-slate-500 uppercase font-bold">Pending Review</p>
                        <p className="text-2xl font-bold text-slate-900 dark:text-white">45</p>
                    </div>
                </div>
            </div>

            <div className="bg-white dark:bg-[#1a2632] border border-slate-200 dark:border-slate-800 rounded-xl shadow-sm overflow-hidden">
                <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row gap-4 justify-between">
                    <div className="relative flex-1 max-w-sm">
                        <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">search</span>
                        <input className="w-full pl-10 pr-4 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-sm outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all" placeholder="Search users by name or email..." />
                    </div>
                    <div className="flex gap-2">
                        <select className="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 rounded-lg px-3 py-2 text-sm outline-none">
                            <option>All Roles</option>
                            <option>Partner</option>
                            <option>Admin</option>
                        </select>
                        <select className="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 rounded-lg px-3 py-2 text-sm outline-none">
                            <option>All Status</option>
                            <option>Verified</option>
                            <option>Pending</option>
                            <option>Rejected</option>
                        </select>
                    </div>
                </div>
                <div className="table-wrapper text-slate-900 dark:text-white">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-50 dark:bg-slate-900/50 border-b border-slate-200 dark:border-slate-800">
                                <th className="p-4 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">User</th>
                                <th className="p-4 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Role</th>
                                <th className="p-4 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Joined Date</th>
                                <th className="p-4 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">KYC Status</th>
                                <th className="p-4 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.map((user) => (
                                <tr key={user.id} className="border-b border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                                    <td className="p-4">
                                        <div className="flex flex-col">
                                            <span className="text-sm font-semibold text-slate-900 dark:text-white">{user.name}</span>
                                            <span className="text-xs text-slate-500">{user.email}</span>
                                        </div>
                                    </td>
                                    <td className="p-4 text-sm text-slate-600 dark:text-slate-300">{user.role}</td>
                                    <td className="p-4 text-sm text-slate-600 dark:text-slate-300">{user.joined}</td>
                                    <td className="p-4">
                                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${user.kyc === 'Verified' ? 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-900/20 dark:text-emerald-400 dark:border-emerald-900/30' :
                                                user.kyc === 'Pending' ? 'bg-orange-50 text-orange-700 border-orange-200 dark:bg-orange-900/20 dark:text-orange-400 dark:border-orange-900/30' :
                                                    user.kyc === 'Rejected' ? 'bg-red-50 text-red-700 border-red-200 dark:bg-red-900/20 dark:text-red-400 dark:border-red-900/30' :
                                                        'bg-slate-100 text-slate-600 border-slate-200 dark:bg-slate-800 dark:text-slate-400 dark:border-slate-700'
                                            }`}>
                                            {user.kyc}
                                        </span>
                                    </td>
                                    <td className="p-4 text-right">
                                        <Link to={`/admin/users/${user.id}`}>
                                            <button className="text-slate-400 hover:text-primary transition-colors p-1">
                                                <span className="material-symbols-outlined text-[20px]">visibility</span>
                                            </button>
                                        </Link>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

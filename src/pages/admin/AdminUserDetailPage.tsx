
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/card';

export default function AdminUserDetailPage() {
    // Mock user data
    const user = {
        name: 'Chinedu Okeke',
        email: 'chinedu.okeke@example.com',
        phone: '+234 801 234 5678',
        role: 'Partner (Pro)',
        status: 'Active',
        kyc: 'Verified',
        joined: 'Dec 12, 2023',
        bvn: '222****8901',
        totalInvested: '₦12,500,000.00',
        walletBalance: '₦450,000.00'
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900 dark:text-white">{user.name}</h1>
                    <p className="text-slate-500 dark:text-slate-400">User ID: #USR-2023-8901</p>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline">Reset Password</Button>
                    <Button variant="destructive">Suspend User</Button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Profile Card */}
                <Card className="md:col-span-1">
                    <CardHeader>
                        <CardTitle>Profile Details</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex flex-col items-center mb-6">
                            <div className="w-24 h-24 bg-slate-200 rounded-full mb-4 flex items-center justify-center text-3xl font-bold text-slate-500">
                                {user.name.charAt(0)}
                            </div>
                            <Badge className="bg-emerald-100 text-emerald-800">{user.kyc}</Badge>
                        </div>
                        <div className="space-y-3">
                            <div className="flex justify-between border-b pb-2 border-slate-100 dark:border-slate-800">
                                <span className="text-sm text-slate-500">Email</span>
                                <span className="text-sm font-medium dark:text-white truncate max-w-[150px]">{user.email}</span>
                            </div>
                            <div className="flex justify-between border-b pb-2 border-slate-100 dark:border-slate-800">
                                <span className="text-sm text-slate-500">Phone</span>
                                <span className="text-sm font-medium dark:text-white">{user.phone}</span>
                            </div>
                            <div className="flex justify-between border-b pb-2 border-slate-100 dark:border-slate-800">
                                <span className="text-sm text-slate-500">Role</span>
                                <span className="text-sm font-medium dark:text-white">{user.role}</span>
                            </div>
                            <div className="flex justify-between border-b pb-2 border-slate-100 dark:border-slate-800">
                                <span className="text-sm text-slate-500">BVN</span>
                                <span className="text-sm font-medium dark:text-white">{user.bvn}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-sm text-slate-500">Joined</span>
                                <span className="text-sm font-medium dark:text-white">{user.joined}</span>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Financial Overview */}
                <div className="md:col-span-2 space-y-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <Card>
                            <div className="p-6 bg-blue-50/50 dark:bg-blue-900/10 rounded-2xl border border-blue-100 dark:border-blue-900/20">
                                <p className="text-sm text-slate-500 font-medium uppercase">Total Ownership Value</p>
                                <h3 className="text-2xl font-bold text-slate-900 dark:text-white mt-1">12,500,000.00</h3>
                            </div>
                        </Card>
                        <Card>
                            <CardContent className="pt-6">
                                <p className="text-sm text-slate-500 font-medium uppercase">Wallet Balance</p>
                                <h3 className="text-2xl font-bold text-slate-900 dark:text-white mt-1">{user.walletBalance}</h3>
                            </CardContent>
                        </Card>
                    </div>

                    <Card>
                        <CardHeader>
                            <CardTitle>Portfolio Holdings</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <table className="w-full text-left">
                                <thead className="bg-slate-50 dark:bg-slate-900/50">
                                    <tr>
                                        <th className="p-3 text-xs font-bold text-slate-500 uppercase rounded-l-lg">Asset</th>
                                        <th className="p-3 text-xs font-bold text-slate-500 uppercase">Units</th>
                                        <th className="p-3 text-xs font-bold text-slate-500 uppercase">Value</th>
                                        <th className="p-3 text-xs font-bold text-slate-500 uppercase rounded-r-lg">Status</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                                    <tr>
                                        <td className="p-3 text-sm font-medium dark:text-white">Oceanview Apartments</td>
                                        <td className="p-3 text-sm text-slate-600 dark:text-slate-400">50</td>
                                        <td className="p-3 text-sm text-slate-600 dark:text-slate-400">₦2,500,000</td>
                                        <td className="p-3"><Badge className="bg-green-100 text-green-700">Active</Badge></td>
                                    </tr>
                                    <tr>
                                        <td className="p-3 text-sm font-medium dark:text-white">Greenfield Estate</td>
                                        <td className="p-3 text-sm text-slate-600 dark:text-slate-400">200</td>
                                        <td className="p-3 text-sm text-slate-600 dark:text-slate-400">₦10,000,000</td>
                                        <td className="p-3"><Badge className="bg-green-100 text-green-700">Active</Badge></td>
                                    </tr>
                                </tbody>
                            </table>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Recent Activity</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                <div className="flex items-start gap-3">
                                    <div className="bg-blue-100 p-2 rounded text-blue-600">
                                        <span className="material-symbols-outlined text-sm">login</span>
                                    </div>
                                    <div>
                                        <p className="text-sm font-bold dark:text-white">Logged in from IP 192.168.1.1</p>
                                        <p className="text-xs text-slate-500">2 hours ago</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3">
                                    <div className="bg-emerald-100 p-2 rounded text-emerald-600">
                                        <span className="material-symbols-outlined text-sm">payments</span>
                                    </div>
                                    <div>
                                        <p className="text-sm font-bold dark:text-white">Deposited ₦500,000 via Bank Transfer</p>
                                        <p className="text-xs text-slate-500">1 day ago</p>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}

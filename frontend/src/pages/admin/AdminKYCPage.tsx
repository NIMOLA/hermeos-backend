import { Link } from 'react-router-dom';
import { Button } from '../../components/ui/button';
import { Card, CardContent } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { useFetch } from '../../hooks/useApi';

interface KYCUser {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    kycStatus: string; // 'pending', 'submitted', 'pending_admin_review', 'verified'
    createdAt: string;
}

export default function AdminKYCPage() {
    const { data: responseData, isLoading, error, refetch } = useFetch<any>('/admin/kyc/pending');
    const users: KYCUser[] = responseData?.data || [];

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900 dark:text-white">KYC Requests</h1>
                    <p className="text-slate-500 dark:text-slate-400 text-sm">Review user identity documents for completeness.</p>
                </div>
                <Button variant="outline" onClick={refetch}>
                    <span className="material-symbols-outlined mr-2">refresh</span> Refresh
                </Button>
            </div>

            <Card>
                <CardContent className="p-0">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-slate-50 dark:bg-slate-900/50 border-b border-slate-200 dark:border-slate-800">
                                <tr>
                                    <th className="p-4 text-xs font-bold text-slate-500 uppercase">User</th>
                                    <th className="p-4 text-xs font-bold text-slate-500 uppercase">Email</th>
                                    <th className="p-4 text-xs font-bold text-slate-500 uppercase">Submitted</th>
                                    <th className="p-4 text-xs font-bold text-slate-500 uppercase">Status</th>
                                    <th className="p-4 text-xs font-bold text-slate-500 uppercase text-right">Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                                {loading ? (
                                    <tr><td colSpan={5} className="p-8 text-center text-slate-500">Loading requests...</td></tr>
                                ) : error ? (
                                    <tr><td colSpan={5} className="p-8 text-center text-red-500">Failed to load requests</td></tr>
                                ) : users.length === 0 ? (
                                    <tr><td colSpan={5} className="p-8 text-center text-slate-500">No pending KYC requests found.</td></tr>
                                ) : (
                                    users.map((user) => (
                                        <tr key={user.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                                            <td className="p-4 font-medium text-slate-900 dark:text-white">{user.firstName} {user.lastName}</td>
                                            <td className="p-4 text-slate-600 dark:text-slate-400">{user.email}</td>
                                            <td className="p-4 text-slate-600 dark:text-slate-400">{new Date(user.createdAt).toLocaleDateString()}</td>
                                            <td className="p-4">
                                                <Badge className={
                                                    user.kycStatus === 'pending_admin_review' ? 'bg-blue-100 text-blue-700' :
                                                        'bg-orange-100 text-orange-700'
                                                }>
                                                    {user.kycStatus === 'pending_admin_review' ? 'Checked' : 'Pending Check'}
                                                </Badge>
                                            </td>
                                            <td className="p-4 text-right">
                                                <Link to={`/admin/users/${user.id}?tab=kyc`}>
                                                    <Button size="sm" variant="outline">
                                                        <span className="material-symbols-outlined text-sm mr-2">visibility</span>
                                                        Review
                                                    </Button>
                                                </Link>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}

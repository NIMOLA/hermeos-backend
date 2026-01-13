import { useParams } from 'react-router-dom';
import { useFetch, apiClient } from '../../hooks/useApi';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/card';

export default function AdminUserDetailPage() {
    const { id } = useParams<{ id: string }>();
    const { data: responseData, loading, error, refetch } = useFetch<any>(`/admin/users/${id}`);

    // Safety check: Backend returns { success: true, data: user }
    const user = responseData?.data;

    const handleApproveKYC = async () => {
        // Find the pending KYC ID. If user has multiple, prioritize pending.
        const pendingKyc = user?.kyc?.find((k: any) => k.status === 'PENDING') || user?.kyc?.[0];

        if (!pendingKyc) {
            alert("No KYC record found for this user.");
            return;
        }

        if (!confirm(`Are you sure you want to APPROVE KYC for ${user.firstName}?`)) return;

        try {
            await apiClient.put(`/admin/kyc/${pendingKyc.id}/approve`);
            alert('KYC Approved Successfully');
            refetch();
        } catch (err) {
            console.error(err);
            alert('Failed to approve KYC');
        }
    };

    const handleRejectKYC = async () => {
        const pendingKyc = user?.kyc?.find((k: any) => k.status === 'PENDING') || user?.kyc?.[0];
        if (!pendingKyc) return;

        const reason = prompt("Enter rejection reason:");
        if (!reason) return;

        try {
            await apiClient.put(`/admin/kyc/${pendingKyc.id}/reject`, { rejectionReason: reason });
            alert('KYC Rejected');
            refetch();
        } catch (err) {
            console.error(err);
            alert('Failed to reject KYC');
        }
    };

    if (loading) return <div className="p-8 text-center">Loading user details...</div>;
    if (error || !user) return <div className="p-8 text-center text-red-500">Error loading user or user not found.</div>;

    // Helper to determine badge color
    const getKycBadgeColor = (status: string) => {
        switch (status) {
            case 'VERIFIED': return 'bg-emerald-100 text-emerald-800';
            case 'PENDING': return 'bg-orange-100 text-orange-800';
            case 'REJECTED': return 'bg-red-100 text-red-800';
            default: return 'bg-slate-100 text-slate-800';
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900 dark:text-white">{user.firstName} {user.lastName}</h1>
                    <p className="text-slate-500 dark:text-slate-400">User ID: #{user.id.substring(0, 8)}</p>
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
                                {user.firstName?.charAt(0)}
                            </div>
                            <Badge className={getKycBadgeColor(user.kycStatus || 'UNVERIFIED')}>
                                {user.kycStatus || 'UNVERIFIED'}
                            </Badge>

                            {/* KYC Action Buttons */}
                            {user.kycStatus === 'PENDING' && (
                                <div className="flex gap-2 mt-4 w-full">
                                    <Button onClick={handleApproveKYC} size="sm" className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white">
                                        Approve
                                    </Button>
                                    <Button onClick={handleRejectKYC} size="sm" variant="outline" className="flex-1 border-red-200 text-red-600 hover:bg-red-50">
                                        Reject
                                    </Button>
                                </div>
                            )}
                        </div>
                        <div className="space-y-3">
                            <div className="flex justify-between border-b pb-2 border-slate-100 dark:border-slate-800">
                                <span className="text-sm text-slate-500">Email</span>
                                <span className="text-sm font-medium dark:text-white truncate max-w-[150px]" title={user.email}>{user.email}</span>
                            </div>
                            <div className="flex justify-between border-b pb-2 border-slate-100 dark:border-slate-800">
                                <span className="text-sm text-slate-500">Phone</span>
                                <span className="text-sm font-medium dark:text-white">{user.phone || 'N/A'}</span>
                            </div>
                            <div className="flex justify-between border-b pb-2 border-slate-100 dark:border-slate-800">
                                <span className="text-sm text-slate-500">Role</span>
                                <span className="text-sm font-medium dark:text-white">{user.role}</span>
                            </div>
                            <div className="flex justify-between border-b pb-2 border-slate-100 dark:border-slate-800">
                                <span className="text-sm text-slate-500">Tier</span>
                                <span className="text-sm font-medium dark:text-white">{user.tier}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-sm text-slate-500">Joined</span>
                                <span className="text-sm font-medium dark:text-white">{new Date(user.createdAt).toLocaleDateString()}</span>
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
                                <h3 className="text-2xl font-bold text-slate-900 dark:text-white mt-1">
                                    {/* Calculate sum of ownerships if needed, or use a field */}
                                    ₦{(user.ownerships?.reduce((sum: number, o: any) => sum + (Number(o.acquisitionPrice) || 0), 0) || 0).toLocaleString()}
                                </h3>
                            </div>
                        </Card>
                        <Card>
                            <CardContent className="pt-6">
                                <p className="text-sm text-slate-500 font-medium uppercase">Wallet Balance</p>
                                <h3 className="text-2xl font-bold text-slate-900 dark:text-white mt-1">
                                    ₦{(user.walletBalance || 0).toLocaleString()}
                                </h3>
                            </CardContent>
                        </Card>
                    </div>

                    <Card>
                        <CardHeader>
                            <CardTitle>Portfolio Holdings</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="overflow-x-auto">
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
                                        {user.ownerships?.length > 0 ? (
                                            user.ownerships.map((ownership: any) => (
                                                <tr key={ownership.id}>
                                                    <td className="p-3 text-sm font-medium dark:text-white">{ownership.property?.name}</td>
                                                    <td className="p-3 text-sm text-slate-600 dark:text-slate-400">{ownership.quantity}</td>
                                                    <td className="p-3 text-sm text-slate-600 dark:text-slate-400">₦{Number(ownership.acquisitionPrice).toLocaleString()}</td>
                                                    <td className="p-3"><Badge className="bg-green-100 text-green-700">Active</Badge></td>
                                                </tr>
                                            ))
                                        ) : (
                                            <tr><td colSpan={4} className="p-4 text-center text-sm text-slate-500">No holdings found</td></tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Recent Activity</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {user.transactions?.length > 0 ? (
                                    user.transactions.map((tx: any) => (
                                        <div key={tx.id} className="flex items-start gap-3 border-b border-slate-50 dark:border-slate-800 pb-3 last:border-0 last:pb-0">
                                            <div className={`p-2 rounded ${tx.type === 'DEPOSIT' ? 'bg-emerald-100 text-emerald-600' : 'bg-blue-100 text-blue-600'}`}>
                                                <span className="material-symbols-outlined text-sm">
                                                    {tx.type === 'DEPOSIT' ? 'payments' : 'swap_horiz'}
                                                </span>
                                            </div>
                                            <div>
                                                <p className="text-sm font-bold dark:text-white">
                                                    {tx.type} - ₦{Number(tx.amount).toLocaleString()}
                                                </p>
                                                <p className="text-xs text-slate-500">
                                                    {new Date(tx.createdAt).toLocaleString()} - {tx.status}
                                                </p>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <p className="text-sm text-slate-500">No recent transactions</p>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}

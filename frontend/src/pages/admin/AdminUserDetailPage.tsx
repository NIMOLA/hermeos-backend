import { useParams } from 'react-router-dom';
import { useFetch, apiClient } from '../../hooks/useApi';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/card';
import { useAuth } from '../../contexts/AuthContext';
import { useState } from 'react';

export default function AdminUserDetailPage() {
    const { id } = useParams<{ id: string }>();
    const { user: currentUser } = useAuth();
    const { data: responseData, isLoading, error, refetch } = useFetch<any>(`/admin/users/${id}`);
    const [actionLoading, setActionLoading] = useState(false);

    // Safety check: Backend returns { success: true, data: user }
    const user = responseData?.data;

    // Moderator Action: Submit for Review
    const handleReviewKYC = async () => {
        if (!confirm(`Submit ${user.firstName}'s KYC for Admin review?`)) return;
        setActionLoading(true);
        try {
            await apiClient.put(`/admin/kyc/${user.id}/review`, { note: 'Moderator Review Completed' });
            alert('Submitted for Admin Review');
            refetch();
        } catch (err: any) {
            console.error(err);
            alert(err.response?.data?.message || 'Failed to submit review');
        } finally {
            setActionLoading(false);
        }
    };

    // Admin Action: Approve
    const handleApproveKYC = async () => {
        if (!confirm(`Are you sure you want to FINAL APPROVE ${user.firstName}?`)) return;
        setActionLoading(true);
        try {
            await apiClient.put(`/admin/kyc/${user.id}/approve`);
            alert('KYC Approved Successfully');
            refetch();
        } catch (err: any) {
            console.error(err);
            alert(err.response?.data?.message || 'Failed to approve KYC');
        } finally {
            setActionLoading(false);
        }
    };

    const handleRejectKYC = async () => {
        const reason = prompt("Enter rejection reason:");
        if (!reason) return;
        setActionLoading(true);
        try {
            await apiClient.put(`/admin/kyc/${user.id}/reject`, { reason });
            alert('KYC Rejected');
            refetch();
        } catch (err: any) {
            console.error(err);
            alert(err.response?.data?.message || 'Failed to reject KYC');
        } finally {
            setActionLoading(false);
        }
    };

    if (isLoading) return <div className="p-8 text-center">Loading user details...</div>;
    if (error || !user) return <div className="p-8 text-center text-red-500">Error loading user or user not found.</div>;

    const getKycBadgeColor = (status: string) => {
        switch (status) {
            case 'verified': return 'bg-emerald-100 text-emerald-800 border-emerald-200';
            case 'pending_admin_review': return 'bg-blue-100 text-blue-800 border-blue-200'; // Intermediate state
            case 'pending': return 'bg-orange-100 text-orange-800 border-orange-200';
            case 'rejected': return 'bg-red-100 text-red-800 border-red-200';
            default: return 'bg-slate-100 text-slate-800 border-slate-200';
        }
    };

    const isModerator = currentUser?.role === 'MODERATOR' || currentUser?.role === 'SUPER_ADMIN';
    const isAdmin = currentUser?.role === 'ADMIN' || currentUser?.role === 'SUPER_ADMIN';

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
                <Card className="md:col-span-1">
                    <CardHeader>
                        <CardTitle>Profile Details</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex flex-col items-center mb-6">
                            <div className="w-24 h-24 bg-slate-200 rounded-full mb-4 flex items-center justify-center text-3xl font-bold text-slate-500">
                                {user.firstName?.charAt(0)}
                            </div>
                            <Badge className={getKycBadgeColor(user.kycStatus || 'not_submitted')} variant="outline">
                                {(user.kycStatus || 'NOT SUBMITTED').replace(/_/g, ' ').toUpperCase()}
                            </Badge>

                            {/* KYC Actions with Strict Workflow */}
                            <div className="flex flex-col gap-2 mt-4 w-full">
                                {/* Moderator View: Can only review 'pending' users */}
                                {isModerator && user.kycStatus === 'pending' && (
                                    <Button onClick={handleReviewKYC} disabled={actionLoading} size="sm" className="w-full bg-blue-600 hover:bg-blue-700">
                                        Review & Submit to Admin
                                    </Button>
                                )}

                                {/* Admin View: Can only approve 'pending_admin_review' users */}
                                {isAdmin && user.kycStatus === 'pending_admin_review' && (
                                    <div className="flex gap-2 w-full">
                                        <Button onClick={handleApproveKYC} disabled={actionLoading} size="sm" className="flex-1 bg-emerald-600 hover:bg-emerald-700">
                                            Final Approve
                                        </Button>
                                        <Button onClick={handleRejectKYC} disabled={actionLoading} size="sm" variant="outline" className="flex-1 border-red-200 text-red-600 hover:bg-red-50">
                                            Reject
                                        </Button>
                                    </div>
                                )}

                                {/* Fallback/Status Messages */}
                                {user.kycStatus === 'pending' && !isModerator && (
                                    <p className="text-xs text-orange-600 text-center mt-2">Waiting for Moderator Review</p>
                                )}
                                {user.kycStatus === 'pending_admin_review' && !isAdmin && (
                                    <p className="text-xs text-blue-600 text-center mt-2">Waiting for Admin Approval</p>
                                )}
                            </div>
                        </div>
                        <div className="space-y-3">
                            <div className="flex justify-between border-b pb-2 border-slate-100 dark:border-slate-800">
                                <span className="text-sm text-slate-500">Email</span>
                                <span className="text-sm font-medium dark:text-white truncate max-w-[150px]" title={user.email}>{user.email}</span>
                            </div>
                            <div className="flex justify-between border-b pb-2 border-slate-100 dark:border-slate-800">
                                <span className="text-sm text-slate-500">Role</span>
                                <span className="text-sm font-medium dark:text-white">{user.role}</span>
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
                </div>
            </div>
        </div>
    );
}

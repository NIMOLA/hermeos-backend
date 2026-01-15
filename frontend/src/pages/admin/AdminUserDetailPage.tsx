import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useFetch, apiClient } from '../../hooks/useApi';
import { useAuth } from '../../contexts/AuthContext';

export default function AdminUserDetailPage() {
    const { user: currentUser } = useAuth();
    const { id } = useParams<{ id: string }>();
    const { data: responseData, isLoading, error, refetch } = useFetch<any>(`/admin/users/${id}`);
    const [actionLoading, setActionLoading] = useState(false);
    const [activeTab, setActiveTab] = useState('profile');

    // Safety check: Backend returns { success: true, data: user }
    const user = responseData?.data;

    // Form State for Personal Info
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        phone: '',
        address: '',
        state: '',
        lga: '',
        dateOfBirth: ''
    });

    useEffect(() => {
        if (user) {
            setFormData({
                firstName: user.firstName || '',
                lastName: user.lastName || '',
                phone: user.phone || '',
                address: user.address || '',
                state: user.state || '',
                lga: user.lga || '',
                dateOfBirth: user.dateOfBirth ? new Date(user.dateOfBirth).toISOString().split('T')[0] : ''
            });
        }
    }, [user]);

    const handleSuspend = async () => {
        if (!confirm(`Are you sure you want to suspend ${user.firstName}?`)) return;
        setActionLoading(true);
        try {
            await apiClient.put(`/admin/users/${user.id}/suspend`);
            alert('User suspended successfully');
            refetch();
        } catch (err: any) {
            console.error(err);
            alert(err.response?.data?.message || 'Failed to suspend user');
        } finally {
            setActionLoading(false);
        }
    };

    const handleSaveProfile = async () => {
        setActionLoading(true);
        try {
            await apiClient.put(`/admin/users/${user.id}/profile`, formData);
            alert('Profile updated successfully');
            refetch();
        } catch (err: any) {
            console.error(err);
            alert(err.response?.data?.message || 'Failed to update profile');
        } finally {
            setActionLoading(false);
        }
    };

    const handleReviewKYC = async () => {
        if (!confirm(`Confirm that all documents for ${user.firstName} are complete and valid?`)) return;
        setActionLoading(true);
        try {
            await apiClient.put(`/admin/kyc/${user.id}/review`);
            refetch();
        } catch (err: any) {
            alert(err.response?.data?.message || 'Failed to submit review');
        } finally {
            setActionLoading(false);
        }
    };

    const handleApproveKYC = async () => {
        if (!confirm(`Final Approve KYC for ${user.firstName}?`)) return;
        setActionLoading(true);
        try {
            await apiClient.put(`/admin/kyc/${user.id}/approve`);
            refetch();
        } catch (err: any) {
            alert(err.response?.data?.message || 'Failed to approve');
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
            refetch();
        } catch (err: any) {
            alert(err.response?.data?.message || 'Failed to reject');
        } finally {
            setActionLoading(false);
        }
    };

    if (isLoading) return <div className="min-h-screen flex items-center justify-center text-slate-500">Loading user details...</div>;
    if (error || !user) return <div className="p-8 text-center text-red-500">User not found or error loading data.</div>;

    return (
        <div className="flex flex-col gap-6">
            {/* Breadcrumbs */}
            <div className="flex flex-wrap gap-2 text-sm">
                <Link to="/admin" className="text-[#4e7397] hover:text-primary transition-colors font-medium">Dashboard</Link>
                <span className="text-[#4e7397] font-medium">/</span>
                <Link to="/admin/users" className="text-[#4e7397] hover:text-primary transition-colors font-medium">User Management</Link>
                <span className="text-[#4e7397] font-medium">/</span>
                <span className="text-slate-900 dark:text-white font-medium">{user.firstName} {user.lastName}</span>
            </div>

            {/* Page Header & Actions */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-slate-900 dark:text-white text-3xl font-extrabold leading-tight tracking-tight">{user.firstName} {user.lastName}</h1>
                    <p className="text-[#4e7397] text-sm mt-1">User ID: <span className="font-mono text-slate-900 dark:text-gray-300">#{user.id.substring(0, 8)}</span> | Role: <span className="font-medium text-primary">{user.role}</span></p>
                </div>
                <div className="flex flex-wrap gap-3">
                    {/* Only Admin+ can suspend */}
                    {(currentUser?.role === 'ADMIN' || currentUser?.role === 'SUPER_ADMIN') && (
                        <button
                            onClick={handleSuspend}
                            disabled={actionLoading}
                            className="flex items-center gap-2 px-4 h-10 bg-white dark:bg-surface-dark border border-red-200 dark:border-red-900 text-red-600 dark:text-red-400 text-sm font-bold rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors disabled:opacity-50"
                        >
                            <span className="material-symbols-outlined text-[18px]">block</span>
                            Suspend Account
                        </button>
                    )}
                    {(currentUser?.role === 'ADMIN' || currentUser?.role === 'SUPER_ADMIN') && (
                        <button
                            onClick={handleSaveProfile}
                            disabled={actionLoading}
                            className="flex items-center gap-2 px-4 h-10 bg-primary text-white text-sm font-bold rounded-lg shadow-sm hover:bg-blue-600 transition-colors disabled:opacity-50"
                        >
                            <span className="material-symbols-outlined text-[18px]">save</span>
                            Save Changes
                        </button>
                    )}
                </div>
            </div>

            {/* Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left Column: Quick Profile & Stats */}
                <div className="lg:col-span-1 flex flex-col gap-6">
                    {/* Profile Card */}
                    <div className="bg-surface-light dark:bg-surface-dark rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 p-6 flex flex-col items-center text-center">
                        <div className="relative">
                            <div className="size-32 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center text-4xl font-bold text-slate-400 mb-4 overflow-hidden border-4 border-white dark:border-slate-700 shadow-md">
                                {user.avatar ? (
                                    <img src={user.avatar} alt="Profile" className="w-full h-full object-cover" />
                                ) : (
                                    <span>{user.firstName?.charAt(0)}{user.lastName?.charAt(0)}</span>
                                )}
                            </div>
                            <div className={`absolute bottom-4 right-0 rounded-full p-1.5 border-2 border-white dark:border-slate-800 ${user.lockedUntil ? 'bg-red-500' : 'bg-green-500'}`} title={user.lockedUntil ? "Suspended" : "Active"}>
                                <div className="size-2 bg-white rounded-full"></div>
                            </div>
                        </div>
                        <h2 className="text-xl font-bold text-slate-900 dark:text-white">{user.firstName} {user.lastName}</h2>
                        <p className="text-[#4e7397] text-sm mb-4">Joined {new Date(user.createdAt).toLocaleDateString()}</p>

                        <div className={`flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-6 ${user.kycStatus === 'verified' ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400' :
                            user.kycStatus === 'pending' ? 'bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400' :
                                'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                            }`}>
                            <span className="material-symbols-outlined text-[16px]">
                                {user.kycStatus === 'verified' ? 'verified' : 'pending'}
                            </span>
                            {user.kycStatus || 'Not Submitted'}
                        </div>

                        <div className="w-full grid grid-cols-2 gap-4 border-t border-slate-200 dark:border-slate-800 pt-6">
                            <div className="flex flex-col gap-1">
                                <span className="text-[#4e7397] text-xs">Total Invested</span>
                                <span className="text-slate-900 dark:text-white font-bold text-lg">
                                    ₦{(user.ownerships?.reduce((sum: any, o: any) => sum + Number(o.acquisitionPrice), 0) || 0).toLocaleString()}
                                </span>
                            </div>
                            <div className="flex flex-col gap-1">
                                <span className="text-[#4e7397] text-xs">Assets Owned</span>
                                <span className="text-slate-900 dark:text-white font-bold text-lg">{user.ownerships?.length || 0}</span>
                            </div>
                        </div>
                    </div>

                    {/* Account Security Card */}
                    <div className="bg-surface-light dark:bg-surface-dark rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 p-6">
                        <h3 className="text-base font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                            <span className="material-symbols-outlined text-primary">security</span>
                            Security & Access
                        </h3>
                        <div className="flex flex-col gap-3">
                            <div className="flex justify-between items-center p-3 bg-background-light dark:bg-slate-800 rounded-lg">
                                <div className="flex flex-col">
                                    <span className="text-xs text-[#4e7397]">2FA Status</span>
                                    <span className={`text-sm font-medium ${user.twoFactorEnabled ? 'text-green-600' : 'text-slate-500'}`}>
                                        {user.twoFactorEnabled ? 'Enabled' : 'Disabled'}
                                    </span>
                                </div>
                                <button className="text-xs text-primary font-bold">Manage</button>
                            </div>
                            <div className="flex justify-between items-center p-3 bg-background-light dark:bg-slate-800 rounded-lg">
                                <div className="flex flex-col">
                                    <span className="text-xs text-[#4e7397]">Last Login</span>
                                    <span className="text-sm font-medium text-slate-900 dark:text-white">
                                        {user.lastLogin ? new Date(user.lastLogin).toLocaleString() : 'Never'}
                                    </span>
                                </div>
                            </div>
                            <button className="mt-2 w-full py-2 border border-slate-200 dark:border-slate-700 rounded-lg text-sm font-medium hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors text-slate-600 dark:text-slate-300">
                                Send Password Reset
                            </button>
                        </div>
                    </div>
                </div>

                {/* Right Column: Detailed Tabs/Sections */}
                <div className="lg:col-span-2 flex flex-col gap-6">
                    {/* Tabs Navigation */}
                    <div className="flex border-b border-slate-200 dark:border-slate-800 overflow-x-auto no-scrollbar">
                        {['profile', 'kyc', 'portfolio', 'financials'].map((tab) => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab)}
                                className={`px-6 py-3 border-b-2 text-sm font-medium whitespace-nowrap transition-colors ${activeTab === tab
                                    ? 'border-primary text-primary font-bold'
                                    : 'border-transparent text-[#4e7397] hover:text-slate-900 dark:hover:text-white'
                                    }`}
                            >
                                {tab === 'kyc' ? 'KYC Documentation' :
                                    tab === 'portfolio' ? 'Portfolio & Assets' :
                                        tab === 'financials' ? 'Financial History' :
                                            'Profile Details'}
                            </button>
                        ))}
                    </div>

                    {/* Tab: Profile Details */}
                    {activeTab === 'profile' && (
                        <div className="bg-surface-light dark:bg-surface-dark rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 p-6">
                            <div className="flex justify-between items-center mb-6">
                                <h3 className="text-lg font-bold text-slate-900 dark:text-white">Personal Information</h3>
                                <span className="text-xs text-[#4e7397]">* Required fields for localized KYC</span>
                            </div>
                            <form className="grid grid-cols-1 md:grid-cols-2 gap-6" onSubmit={(e) => { e.preventDefault(); handleSaveProfile(); }}>
                                <div className="flex flex-col gap-1.5">
                                    <label className="text-xs font-semibold text-[#4e7397] uppercase">First Name</label>
                                    <input
                                        className="w-full h-11 px-4 rounded-lg bg-background-light dark:bg-slate-800 border-none text-slate-900 dark:text-white focus:ring-1 focus:ring-primary placeholder:text-gray-400"
                                        value={formData.firstName}
                                        onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                                    />
                                </div>
                                <div className="flex flex-col gap-1.5">
                                    <label className="text-xs font-semibold text-[#4e7397] uppercase">Last Name</label>
                                    <input
                                        className="w-full h-11 px-4 rounded-lg bg-background-light dark:bg-slate-800 border-none text-slate-900 dark:text-white focus:ring-1 focus:ring-primary placeholder:text-gray-400"
                                        value={formData.lastName}
                                        onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                                    />
                                </div>
                                <div className="flex flex-col gap-1.5">
                                    <label className="text-xs font-semibold text-[#4e7397] uppercase">Phone Number</label>
                                    <input
                                        className="w-full h-11 px-4 rounded-lg bg-background-light dark:bg-slate-800 border-none text-slate-900 dark:text-white focus:ring-1 focus:ring-primary placeholder:text-gray-400"
                                        value={formData.phone}
                                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                    />
                                </div>
                                <div className="flex flex-col gap-1.5">
                                    <label className="text-xs font-semibold text-[#4e7397] uppercase">Date of Birth</label>
                                    <input
                                        type="date"
                                        className="w-full h-11 px-4 rounded-lg bg-background-light dark:bg-slate-800 border-none text-slate-900 dark:text-white focus:ring-1 focus:ring-primary"
                                        value={formData.dateOfBirth}
                                        onChange={(e) => setFormData({ ...formData, dateOfBirth: e.target.value })}
                                    />
                                </div>
                                <div className="flex flex-col gap-1.5 md:col-span-2">
                                    <label className="text-xs font-semibold text-[#4e7397] uppercase">Residential Address</label>
                                    <input
                                        className="w-full h-11 px-4 rounded-lg bg-background-light dark:bg-slate-800 border-none text-slate-900 dark:text-white focus:ring-1 focus:ring-primary placeholder:text-gray-400"
                                        value={formData.address}
                                        onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                                    />
                                </div>
                            </form>
                        </div>
                    )}

                    {/* Tab: KYC Documentation */}
                    {activeTab === 'kyc' && (
                        <div className="bg-surface-light dark:bg-surface-dark rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 p-6">
                            <div className="flex justify-between items-center mb-6">
                                <div>
                                    <h3 className="text-lg font-bold text-slate-900 dark:text-white">KYC Documentation</h3>
                                    <p className="text-sm text-[#4e7397]">Status: <span className="font-medium text-slate-900 dark:text-white capitalize">{user.kycStatus?.replace(/_/g, ' ')}</span></p>
                                </div>
                                {(currentUser?.role === 'ADMIN' || currentUser?.role === 'SUPER_ADMIN' || currentUser?.role === 'MODERATOR') && (
                                    <div className="flex gap-2">
                                        {/* Step 1: Mark as Checked (Moderator/Admin) */}
                                        {user.kycStatus !== 'verified' && user.kycStatus !== 'pending_admin_review' && (
                                            <button
                                                onClick={handleReviewKYC}
                                                disabled={actionLoading}
                                                className="text-blue-600 hover:bg-blue-50 px-3 py-1 rounded font-bold text-sm border border-blue-200"
                                            >
                                                Check Complete
                                            </button>
                                        )}

                                        {/* Step 2: Final Approve (Admin Only - Requires Check) */}
                                        {(currentUser?.role === 'ADMIN' || currentUser?.role === 'SUPER_ADMIN') ? (
                                            <button
                                                onClick={handleApproveKYC}
                                                disabled={actionLoading || user.kycStatus !== 'pending_admin_review'}
                                                className={`px-3 py-1 rounded font-bold text-sm border ${user.kycStatus === 'pending_admin_review'
                                                    ? 'text-green-600 hover:bg-green-50 border-green-200'
                                                    : 'text-slate-400 border-slate-200 cursor-not-allowed'
                                                    }`}
                                                title={user.kycStatus !== 'pending_admin_review' ? "Must be checked by a Moderator first" : "Final Verification"}
                                            >
                                                Verify User
                                            </button>
                                        ) : null}

                                        <button onClick={handleRejectKYC} className="text-red-600 hover:bg-red-50 px-3 py-1 rounded font-bold text-sm border border-red-200">Reject</button>
                                    </div>
                                )}
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {user.documents?.map((doc: any) => (
                                    <div key={doc.id} className="border border-slate-200 dark:border-slate-800 rounded-lg overflow-hidden group">
                                        <div className="h-32 bg-slate-100 dark:bg-slate-800 relative flex items-center justify-center overflow-hidden">
                                            {/* Assuming doc has previewUrl or url */}
                                            <div className="absolute inset-0 bg-cover bg-center opacity-80" style={{ backgroundImage: `url(${doc.url})` }}></div>
                                            <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                                <a href={doc.url} target="_blank" rel="noopener noreferrer" className="bg-white/90 text-black px-3 py-1 rounded text-xs font-bold shadow">View</a>
                                            </div>
                                        </div>
                                        <div className="p-3 flex flex-col gap-2">
                                            <p className="text-sm font-bold text-slate-900 dark:text-white truncate">{doc.type}</p>
                                            <p className="text-xs text-[#4e7397]">Uploaded {new Date(doc.createdAt).toLocaleDateString()}</p>
                                        </div>
                                    </div>
                                ))}
                                {(!user.documents || user.documents.length === 0) && (
                                    <div className="col-span-3 text-center py-8 text-slate-500">No documents uploaded.</div>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Tab: Portfolio */}
                    {activeTab === 'portfolio' && (
                        <div className="bg-surface-light dark:bg-surface-dark rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 p-6 flex flex-col">
                            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4">Property Portfolio</h3>
                            <div className="overflow-x-auto">
                                <table className="w-full text-left text-sm">
                                    <thead className="bg-background-light dark:bg-slate-800 text-[#4e7397]">
                                        <tr>
                                            <th className="py-2 pl-2 rounded-l-lg font-medium">Property</th>
                                            <th className="py-2 font-medium">Units</th>
                                            <th className="py-2 pr-2 rounded-r-lg font-medium text-right">Value (₦)</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                                        {user.ownerships?.map((own: any) => (
                                            <tr key={own.id}>
                                                <td className="py-3 pl-2">
                                                    <div className="font-medium text-slate-900 dark:text-white">{own.property?.name}</div>
                                                    <div className="text-xs text-[#4e7397]">{own.property?.location}</div>
                                                </td>
                                                <td className="py-3 font-medium text-slate-600 dark:text-slate-400">{own.quantity}</td>
                                                <td className="py-3 pr-2 text-right font-medium">{Number(own.acquisitionPrice).toLocaleString()}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}

                    {/* Tab: Financials */}
                    {activeTab === 'financials' && (
                        <div className="bg-surface-light dark:bg-surface-dark rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 p-6 flex flex-col">
                            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4">Financial Activity</h3>
                            <div className="overflow-x-auto">
                                <table className="w-full text-left text-sm">
                                    <thead className="bg-background-light dark:bg-slate-800 text-[#4e7397]">
                                        <tr>
                                            <th className="py-2 pl-2 rounded-l-lg font-medium">Type</th>
                                            <th className="py-2 font-medium">Date</th>
                                            <th className="py-2 pr-2 rounded-r-lg font-medium text-right">Amount</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                                        {user.transactions?.map((tx: any) => (
                                            <tr key={tx.id}>
                                                <td className="py-3 pl-2">
                                                    <div className="flex items-center gap-2">
                                                        <div className={`size-2 rounded-full ${tx.amount < 0 ? 'bg-orange-500' : 'bg-green-500'}`}></div>
                                                        <span className="font-medium text-slate-900 dark:text-white capitalize">{tx.type.replace(/_/g, ' ').toLowerCase()}</span>
                                                    </div>
                                                </td>
                                                <td className="py-3 text-xs text-[#4e7397]">{new Date(tx.createdAt).toLocaleDateString()}</td>
                                                <td className={`py-3 pr-2 text-right font-medium ${tx.amount < 0 ? 'text-slate-900 dark:text-white' : 'text-green-600'}`}>
                                                    {Number(tx.amount) > 0 ? '+' : ''}₦{Number(tx.amount).toLocaleString()}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div >
    );
}

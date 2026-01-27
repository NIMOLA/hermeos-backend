
import { useParams, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useFetch, apiClient } from '../../hooks/useApi';
import { Button } from '../../components/ui/button';
import { useAuth } from '../../contexts/AuthContext';

export default function AdminUserDetailPage() {
    const { user: currentUser } = useAuth();
    const { id } = useParams();
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('profile');

    // Fallback search state
    const [searchEmail, setSearchEmail] = useState('');
    const [isSearching, setIsSearching] = useState(false);
    const [actionLoading, setActionLoading] = useState(false);

    // Main Fetch
    const { data: responseData, isLoading, error, refetch } = useFetch<any>(`/admin/users/${id}`);

    // Safety check: Backend returns { success: true, data: user }
    const user = responseData?.data;

    // Form State (initially empty, filled via effect)
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

    // Handle Manual Search Logic
    const handleSearchByEmail = async () => {
        if (!searchEmail) return;
        setIsSearching(true);
        try {
            // Use the LIST endpoint which we know works
            const res = await apiClient.get<any>(`/admin/management/list-admins?search=${encodeURIComponent(searchEmail)}`); // Try admin list first? No, we need user list.
            // Wait, admin.controller has getAllUsers. access is /api/admin/users
            // adminManagement.routes has /api/admin/management ...
            // Let's try the generic user list endpoint if available, or just a direct fetch if we can.
            // Actually, let's use the one we saw in admin.controller: getAllUsers
            // route: /api/admin/users

            const res2 = await fetch(`/api/admin/users?search=${encodeURIComponent(searchEmail)}`, {
                headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
            });
            const data = await res2.json();

            if (data.success && data.data && data.data.length > 0) {
                // Found the user! Navigate to their REAL ID.
                const foundUser = data.data[0];
                if (confirm(`User found: ${foundUser.email} (ID: ${foundUser.id}). Redirect?`)) {
                    navigate(`/admin/users/${foundUser.id}`, { replace: true });
                    window.location.reload(); // Force reload to ensure fresh state
                }
            } else {
                alert('No user found with that email.');
            }
        } catch (e) {
            console.error(e);
            alert('Search failed.');
        } finally {
            setIsSearching(false);
        }
    };

    const handleSuspend = async () => {
        if (!user) return;
        if (!confirm(`Are you sure you want to suspend ${user.firstName}?`)) return;
        setActionLoading(true);
        try {
            await apiClient.put(`/admin/management/users/${user.id}/suspend`);
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
        if (!user) return;
        setActionLoading(true);
        try {
            await apiClient.put(`/admin/management/users/${user.id}/profile`, formData);
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
        if (!user) return;
        if (!confirm(`Confirm that all documents for ${user.firstName} are complete and valid?`)) return;
        setActionLoading(true);
        try {
            // Assuming this route exists or we create it. Using placeholder for now or existing logic.
            // Based on previous files, maybe it's /admin/kyc...
            await apiClient.put(`/admin/kyc/${user.id}/review`);
            refetch();
        } catch (err: any) {
            alert(err.response?.data?.message || 'Failed to submit review');
        } finally {
            setActionLoading(false);
        }
    };

    const handleApproveKYC = async () => {
        if (!user) return;
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
        if (!user) return;
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


    if (isLoading) {
        return (
            <div className="p-8 flex items-center justify-center min-h-[400px]">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                    <p className="text-slate-500">Loading user profile...</p>
                </div>
            </div>
        );
    }

    if (error || !user) {
        return (
            <div className="p-8 max-w-2xl mx-auto mt-10 bg-white dark:bg-[#1a2632] border border-red-200 dark:border-red-900/30 rounded-xl shadow-sm text-center">
                <div className="w-16 h-16 bg-red-100 dark:bg-red-900/20 text-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="material-symbols-outlined text-3xl">error</span>
                </div>
                <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-2">User Not Found</h2>
                <p className="text-slate-500 dark:text-slate-400 mb-6">{error?.message || 'The requested user could not be located.'}</p>

                {/* Debug Info */}
                <div className="bg-slate-100 dark:bg-slate-900 p-3 rounded-lg text-xs font-mono text-slate-500 mb-6 overflow-hidden text-ellipsis">
                    REQUESTED ID: {id}
                </div>

                <div className="flex flex-col gap-4 max-w-sm mx-auto">
                    <Button onClick={() => refetch()} variant="outline">
                        <span className="material-symbols-outlined mr-2">refresh</span> Retry Connection
                    </Button>

                    <div className="relative my-2">
                        <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-slate-200 dark:border-slate-700"></div></div>
                        <div className="relative flex justify-center text-xs uppercase"><span className="bg-white dark:bg-[#1a2632] px-2 text-slate-500">Or Search By Email</span></div>
                    </div>

                    <div className="flex gap-2">
                        <input
                            value={searchEmail}
                            onChange={(e) => setSearchEmail(e.target.value)}
                            placeholder="Enter user email..."
                            className="flex-1 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg px-3 text-sm outline-none focus:ring-2 focus:ring-primary/20"
                        />
                        <Button disabled={isSearching} onClick={handleSearchByEmail}>
                            {isSearching ? '...' : 'Search'}
                        </Button>
                    </div>
                </div>

                <div className="mt-8">
                    <button onClick={() => navigate('/admin/users')} className="text-sm text-slate-500 hover:text-primary underline">Back to Users List</button>
                </div>
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-6 max-w-7xl mx-auto pb-20">
            {/* Header / Breadcrumb */}
            <div className="flex items-center gap-2 text-sm text-slate-500">
                <span className="cursor-pointer hover:text-slate-800" onClick={() => navigate('/admin/users')}>Users</span>
                <span className="material-symbols-outlined text-xs">chevron_right</span>
                <span className="text-slate-900 dark:text-white font-medium">User Profile</span>
            </div>

            {/* Profile Header Card */}
            <div className="bg-white dark:bg-[#1a2632] border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm">
                <div className="flex flex-col md:flex-row gap-6 items-start md:items-center justify-between">
                    <div className="flex items-center gap-6">
                        <div className="w-20 h-20 bg-primary/10 text-primary rounded-full flex items-center justify-center text-3xl font-bold border-4 border-white dark:border-[#1a2632] shadow-sm">
                            {user.headerAvatar ? (
                                <img src={user.headerAvatar} className="w-full h-full object-cover rounded-full" />
                            ) : (
                                <span>{user.firstName?.charAt(0)}{user.lastName?.charAt(0)}</span>
                            )}
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-3">
                                {user.firstName} {user.lastName}
                                {user.kycStatus === 'verified' && <span className="material-symbols-outlined text-emerald-500 text-xl" title="Verified">verified</span>}
                            </h1>
                            <div className="flex items-center gap-3 text-sm text-slate-500 dark:text-slate-400 mt-1">
                                <span className="flex items-center gap-1"><span className="material-symbols-outlined text-base">mail</span> {user.email}</span>
                                <span className="w-1 h-1 bg-slate-300 rounded-full"></span>
                                <span className="flex items-center gap-1"><span className="material-symbols-outlined text-base">calendar_month</span> Joined {new Date(user.createdAt).toLocaleDateString()}</span>
                            </div>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="flex flex-col items-end gap-2">

                            <div className="flex gap-2">
                                <span className={`px-3 py-1 rounded-full text-sm font-medium border capitalize ${user.role === 'ADMIN' ? 'bg-purple-50 text-purple-700 border-purple-200' :
                                    user.role === 'SUPER_ADMIN' ? 'bg-indigo-50 text-indigo-700 border-indigo-200' :
                                        'bg-slate-100 text-slate-600 border-slate-200'
                                    }`}>
                                    {user.role?.replace('_', ' ')}
                                </span>
                                <div className={`px-3 py-1 rounded-full text-sm font-medium border capitalize ${user.kycStatus === 'verified' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
                                    user.kycStatus === 'pending' || user.kycStatus === 'submitted' ? 'bg-orange-50 text-orange-700 border-orange-200' :
                                        'bg-red-50 text-red-700 border-red-200'
                                    }`}>
                                    KYC: {user.kycStatus?.replace('_', ' ')}
                                </div>
                            </div>

                            {(currentUser?.role === 'ADMIN' || currentUser?.role === 'SUPER_ADMIN') && (
                                <div className="flex gap-2">
                                    <Button size="sm" variant="outline" onClick={handleSuspend} disabled={actionLoading} className="text-red-600 border-red-200 hover:bg-red-50">
                                        Suspend
                                    </Button>
                                    <Button size="sm" onClick={handleSaveProfile} disabled={actionLoading}>
                                        Save Changes
                                    </Button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Tabs */}
                <div className="flex gap-6 mt-8 border-b border-slate-200 dark:border-slate-800">
                    {['profile', 'kyc', 'portfolio', 'financials'].map((tab) => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`pb-3 text-sm font-medium border-b-2 transition-colors capitalize ${activeTab === tab
                                ? 'border-primary text-primary'
                                : 'border-transparent text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
                                }`}
                        >
                            {tab === 'kyc' ? 'KYC Documentation' : tab === 'profile' ? 'Profile Details' : tab}
                        </button>
                    ))}
                </div>
            </div>

            {/* Content Area */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left Column - Main Content */}
                <div className="lg:col-span-2 space-y-6">
                    {activeTab === 'profile' && (
                        <div className="bg-white dark:bg-[#1a2632] border border-slate-200 dark:border-slate-800 rounded-xl p-6">
                            <h3 className="font-bold text-lg mb-4 text-slate-900 dark:text-white">Personal Information</h3>
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

                    {activeTab === 'kyc' && (
                        <div className="bg-white dark:bg-[#1a2632] border border-slate-200 dark:border-slate-800 rounded-xl p-6">
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="font-bold text-lg text-slate-900 dark:text-white">KYC Verification</h3>

                                <div className="flex gap-2">
                                    {user.kycStatus !== 'verified' && (
                                        <>
                                            <Button size="sm" variant="outline" onClick={handleReviewKYC}>Mark Reviewed</Button>
                                            <Button size="sm" onClick={handleApproveKYC}>Approve</Button>
                                            <Button size="sm" variant="destructive" onClick={handleRejectKYC}>Reject</Button>
                                        </>
                                    )}
                                </div>
                            </div>

                            {user.documents && user.documents.length > 0 ? (
                                <div className="grid grid-cols-2 gap-4">
                                    {user.documents.map((doc: any) => (
                                        <div key={doc.id} className="p-4 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg">
                                            <div className="flex justify-between mb-2">
                                                <span className="font-medium text-slate-900 dark:text-white text-sm">{doc.type}</span>
                                                <a href={doc.url} target="_blank" className="text-xs text-primary underline">View</a>
                                            </div>
                                            <p className="text-xs text-slate-500">{new Date(doc.createdAt).toLocaleDateString()}</p>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center p-8 text-slate-500 bg-slate-50 dark:bg-slate-900 rounded-xl">
                                    <span className="material-symbols-outlined text-4xl mb-2 opacity-50">badge</span>
                                    <p>No KYC documents submitted yet.</p>
                                </div>
                            )}
                        </div>
                    )}

                    {activeTab === 'portfolio' && (
                        <div className="bg-white dark:bg-[#1a2632] border border-slate-200 dark:border-slate-800 rounded-xl p-6">
                            <h3 className="font-bold text-lg mb-4 text-slate-900 dark:text-white">Assets Owned</h3>
                            {user.ownerships && user.ownerships.length > 0 ? (
                                <div className="space-y-3">
                                    {user.ownerships.map((own: any) => (
                                        <div key={own.id} className="flex justify-between items-center p-3 border-b border-slate-100 dark:border-slate-800 last:border-0">
                                            <div>
                                                <p className="font-medium text-slate-900 dark:text-white">{own.property?.name || 'Unknown Property'}</p>
                                                <p className="text-xs text-slate-500">{own.units} Units</p>
                                            </div>
                                            <p className="font-bold text-slate-900 dark:text-white">₦{Number(own.acquisitionPrice).toLocaleString()}</p>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-slate-500 italic">No assets owned.</p>
                            )}
                        </div>
                    )}

                    {activeTab === 'financials' && (
                        <div className="bg-white dark:bg-[#1a2632] border border-slate-200 dark:border-slate-800 rounded-xl p-6">
                            <h3 className="font-bold text-lg mb-4 text-slate-900 dark:text-white">Transaction History</h3>
                            {user.transactions && user.transactions.length > 0 ? (
                                <div className="space-y-3">
                                    {user.transactions.map((tx: any) => (
                                        <div key={tx.id} className="flex justify-between items-center p-3 border-b border-slate-100 dark:border-slate-800 last:border-0">
                                            <div className="flex items-center gap-3">
                                                <div className={`size-2 rounded-full ${tx.amount < 0 ? 'bg-orange-500' : 'bg-green-500'}`}></div>
                                                <div>
                                                    <p className="font-medium text-slate-900 dark:text-white capitalize">{tx.type.replace(/_/g, ' ').toLowerCase()}</p>
                                                    <p className="text-xs text-slate-500">{new Date(tx.createdAt).toLocaleDateString()}</p>
                                                </div>
                                            </div>
                                            <p className={`font-mono font-medium ${tx.amount < 0 ? 'text-slate-900 dark:text-white' : 'text-green-600'}`}>
                                                {Number(tx.amount) > 0 ? '+' : ''}₦{Number(tx.amount).toLocaleString()}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-slate-500 italic">No transactions found.</p>
                            )}
                        </div>
                    )}
                </div>

                {/* Right Column - Stats & Actions */}
                <div className="space-y-6">
                    <div className="bg-white dark:bg-[#1a2632] border border-slate-200 dark:border-slate-800 rounded-xl p-6">
                        <h3 className="font-bold text-sm uppercase text-slate-500 mb-4">Financial Summary</h3>
                        <div className="space-y-4">
                            <div className="flex justify-between items-center">
                                <span className="text-sm text-slate-600 dark:text-slate-400">Wallet Balance</span>
                                <span className="font-bold text-lg text-slate-900 dark:text-white">₦{Number(user.walletBalance || 0).toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-sm text-slate-600 dark:text-slate-400">Total Assets</span>
                                <span className="font-medium text-slate-900 dark:text-white">{user.ownerships?.length || 0} Properties</span>
                            </div>
                        </div>
                    </div>
                    <div className="bg-white dark:bg-[#1a2632] border border-slate-200 dark:border-slate-800 rounded-xl p-6">
                        <h3 className="font-bold text-sm uppercase text-slate-500 mb-4">Quick Actions</h3>
                        <div className="space-y-2">
                            <Button variant="outline" className="w-full justify-start"><span className="material-symbols-outlined mr-2 text-primary">mail</span> Send Email</Button>
                            <Button variant="outline" className="w-full justify-start"><span className="material-symbols-outlined mr-2">lock_reset</span> Reset Password</Button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

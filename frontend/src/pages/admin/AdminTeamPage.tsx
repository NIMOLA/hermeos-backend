
import { useState, useEffect } from 'react';
import { Button } from '../../components/ui/button';
import { useAuth } from '../../contexts/AuthContext';
import { useFetch } from '../../hooks/useApi';

interface AdminUser {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    role: 'SUPER_ADMIN' | 'ADMIN' | 'MODERATOR' | 'SUPPORT';
    createdAt: string;
    lastLogin: string;
}

export default function AdminTeamPage() {
    const { user: currentUser } = useAuth();
    const [admins, setAdmins] = useState<AdminUser[]>([]);
    const [loading, setLoading] = useState(true);
    const [showInviteModal, setShowInviteModal] = useState(false);

    // Invitation Form State
    const [inviteEmail, setInviteEmail] = useState('');
    const [inviteRole, setInviteRole] = useState('ADMIN');
    const [invitationLink, setInvitationLink] = useState('');
    const [inviteError, setInviteError] = useState('');
    const [isInviting, setIsInviting] = useState(false);

    const fetchAdmins = async () => {
        try {
            const res = await fetch('/api/admin/management/list-admins', {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });
            const data = await res.json();
            if (data.success) {
                setAdmins(data.data.admins);
            }
        } catch (error) {
            console.error('Failed to fetch admins', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAdmins();
    }, []);

    const handleInvite = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsInviting(true);
        setInviteError('');
        setInvitationLink('');

        try {
            const res = await fetch('/api/admin/management/create-invitation', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify({ email: inviteEmail, role: inviteRole })
            });
            const data = await res.json();

            if (data.success) {
                setInvitationLink(data.data.invitation.invitationLink);
                setInviteEmail('');
                // Don't close modal yet, let them copy the link
            } else {
                setInviteError(data.message || 'Failed to create invitation');
            }
        } catch (error) {
            setInviteError('Network error');
        } finally {
            setIsInviting(false);
        }
    };

    const handleRevoke = async (adminId: string) => {
        if (!confirm('Are you sure you want to revoke this admin access? They will become a regular user.')) return;

        try {
            const res = await fetch(`/api/admin/management/${adminId}/revoke`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });
            const data = await res.json();
            if (data.success) {
                alert('Access revoked');
                fetchAdmins(); // Refresh list
            } else {
                alert(data.message);
            }
        } catch (error) {
            alert('Error revoking access');
        }
    };

    if (currentUser?.role !== 'SUPER_ADMIN') {
        return <div className="p-8 text-center text-red-500">Access Denied. Super Admin only.</div>;
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Team Management</h1>
                    <p className="text-slate-500 text-sm">Manage administrators and moderators.</p>
                </div>
                <Button onClick={() => setShowInviteModal(true)}>
                    <span className="material-symbols-outlined mr-2">person_add</span>
                    Invite Admin
                </Button>
            </div>

            {/* Admins Table */}
            <div className="bg-white dark:bg-[#1a2632] border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden shadow-sm">
                <table className="w-full text-left border-collapse">
                    <thead className="bg-slate-50 dark:bg-slate-900/50">
                        <tr>
                            <th className="p-4 text-xs font-bold text-slate-500 uppercase">User</th>
                            <th className="p-4 text-xs font-bold text-slate-500 uppercase">Role</th>
                            <th className="p-4 text-xs font-bold text-slate-500 uppercase">Created</th>
                            <th className="p-4 text-xs font-bold text-slate-500 uppercase text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                        {loading ? (
                            <tr><td colSpan={4} className="p-6 text-center">Loading...</td></tr>
                        ) : admins.map(admin => (
                            <tr key={admin.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                                <td className="p-4">
                                    <div className="font-bold text-slate-900 dark:text-white">{admin.firstName} {admin.lastName}</div>
                                    <div className="text-xs text-slate-500">{admin.email}</div>
                                </td>
                                <td className="p-4">
                                    <span className={`px-2 py-1 rounded-md text-xs font-bold border ${admin.role === 'SUPER_ADMIN' ? 'bg-purple-100 text-purple-700 border-purple-200' :
                                            admin.role === 'ADMIN' ? 'bg-blue-100 text-blue-700 border-blue-200' :
                                                'bg-slate-100 text-slate-700 border-slate-200'
                                        }`}>
                                        {admin.role}
                                    </span>
                                </td>
                                <td className="p-4 text-sm text-slate-500">
                                    {new Date(admin.createdAt).toLocaleDateString()}
                                </td>
                                <td className="p-4 text-right">
                                    {admin.role !== 'SUPER_ADMIN' && currentUser.id !== admin.id && (
                                        <Button variant="outline" size="sm" onClick={() => handleRevoke(admin.id)} className="text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200">
                                            Revoke
                                        </Button>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Invite Modal */}
            {showInviteModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
                    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-2xl max-w-md w-full p-6 animate-in fade-in zoom-in duration-200">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-xl font-bold text-slate-900 dark:text-white">Invite New Admin</h2>
                            <button onClick={() => setShowInviteModal(false)} className="text-slate-400 hover:text-slate-600">
                                <span className="material-symbols-outlined">close</span>
                            </button>
                        </div>

                        {!invitationLink ? (
                            <form onSubmit={handleInvite} className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Email Address</label>
                                    <input
                                        type="email"
                                        required
                                        className="w-full p-2 border border-slate-300 dark:border-slate-600 rounded bg-transparent text-slate-900 dark:text-white"
                                        value={inviteEmail}
                                        onChange={e => setInviteEmail(e.target.value)}
                                        placeholder="colleague@hermeos.com"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Role</label>
                                    <select
                                        className="w-full p-2 border border-slate-300 dark:border-slate-600 rounded bg-transparent text-slate-900 dark:text-white"
                                        value={inviteRole}
                                        onChange={e => setInviteRole(e.target.value)}
                                    >
                                        <option value="ADMIN">Admin (Full Access)</option>
                                        <option value="MODERATOR">Moderator (User/Content Management)</option>
                                        <option value="SUPPORT">Support (View Only)</option>
                                    </select>
                                </div>

                                {inviteError && <p className="text-red-500 text-sm">{inviteError}</p>}

                                <div className="flex justify-end gap-3 mt-6">
                                    <Button type="button" variant="outline" onClick={() => setShowInviteModal(false)}>Cancel</Button>
                                    <Button type="submit" disabled={isInviting}>
                                        {isInviting ? 'Generating...' : 'Generate Invite Link'}
                                    </Button>
                                </div>
                            </form>
                        ) : (
                            <div className="space-y-4">
                                <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg border border-green-200 dark:border-green-800 text-center">
                                    <span className="material-symbols-outlined text-green-600 text-4xl mb-2">check_circle</span>
                                    <h3 className="font-bold text-green-800 dark:text-green-400">Invitation Generated!</h3>
                                    <p className="text-sm text-green-700 dark:text-green-300">Share this link with the new team member.</p>
                                </div>

                                <div className="relative">
                                    <input
                                        readOnly
                                        value={invitationLink}
                                        className="w-full p-3 pr-10 bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded font-mono text-xs text-slate-600"
                                    />
                                    <button
                                        className="absolute right-2 top-1/2 -translate-y-1/2 text-primary hover:text-blue-700"
                                        onClick={() => navigator.clipboard.writeText(invitationLink)}
                                        title="Copy Link"
                                    >
                                        <span className="material-symbols-outlined text-lg">content_copy</span>
                                    </button>
                                </div>

                                <Button className="w-full" onClick={() => { setShowInviteModal(false); setInvitationLink(''); fetchAdmins(); }}>
                                    Done
                                </Button>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}

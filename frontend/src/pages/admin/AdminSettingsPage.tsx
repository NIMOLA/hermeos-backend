import { useState, useEffect } from 'react';
import { Button } from '../../components/ui/button';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { apiClient } from '../../lib/api-client';
import { useAuth } from '../../contexts/AuthContext';

export default function AdminSettingsPage() {
    const { user } = useAuth();
    const [activeTab, setActiveTab] = useState('general');
    const [team, setTeam] = useState<any[]>([]);
    const [keys, setKeys] = useState({
        paystackPublic: '',
        paystackSecret: '',
        sendgridKey: '',
        maintenance: false
    });
    const [loading, setLoading] = useState(false);

    // Invite Modal State
    const [showInviteModal, setShowInviteModal] = useState(false);
    const [inviteData, setInviteData] = useState({ email: '', firstName: '', lastName: '', role: 'ADMIN' });
    const [inviteLoading, setInviteLoading] = useState(false);
    const [tempCreds, setTempCreds] = useState<{ email: string, password: string } | null>(null);

    useEffect(() => {
        // Mock fetch setup - in production replace with actual API calls
        // For now, we only have team data via /users filtering
        if (activeTab === 'team') {
            apiClient.get('/admin/users')
                .then((res: any) => {
                    // Filter for Admin/SuperAdmin/Moderator
                    const admins = (res.data.users || []).filter((u: any) =>
                        ['ADMIN', 'SUPER_ADMIN', 'MODERATOR'].includes(u.role)
                    );
                    setTeam(admins);
                })
                .catch(err => console.error(err));
        }
    }, [activeTab]);

    const handleInvite = async (e: React.FormEvent) => {
        e.preventDefault();
        setInviteLoading(true);
        try {
            const res = await apiClient.post<any>('/admin/invite', inviteData);
            if (res.success) {
                setTempCreds({ email: res.data.user.email, password: res.data.tempPassword });
                // Refresh list
                setTeam([...team, res.data.user]);
                setInviteData({ email: '', firstName: '', lastName: '', role: 'ADMIN' });
                setShowInviteModal(false);
            }
        } catch (error: any) {
            alert(error.response?.data?.message || 'Failed to invite user');
        } finally {
            setInviteLoading(false);
        }
    };

    const handleSaveGeneral = () => {
        setLoading(true);
        // Simulate API call
        setTimeout(() => {
            alert('Settings saved successfully!');
            setLoading(false);
        }, 1000);
    };

    const handleSaveIntegrations = () => {
        setLoading(true);
        // Simulate saving keys
        console.log("Saving keys:", keys);
        setTimeout(() => {
            alert('Integrations updated!');
            setLoading(false);
        }, 1000);
    };

    const renderContent = () => {
        switch (activeTab) {
            case 'general':
                return (
                    <div className="space-y-6">
                        <Card>
                            <CardHeader>
                                <CardTitle>Platform Configuration</CardTitle>
                                <CardDescription>Manage core platform settings and operation modes.</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="flex items-center justify-between p-4 border border-slate-200 dark:border-slate-800 rounded-lg bg-slate-50 dark:bg-slate-900/50">
                                    <div>
                                        <h3 className="font-bold text-slate-900 dark:text-white text-sm">Maintenance Mode</h3>
                                        <p className="text-xs text-slate-500">Disable user access for scheduled updates.</p>
                                    </div>
                                    <div className="relative inline-block w-10 mr-2 align-middle select-none transition duration-200 ease-in">
                                        <input
                                            type="checkbox"
                                            name="toggle"
                                            id="maintenance"
                                            checked={keys.maintenance}
                                            onChange={(e) => setKeys({ ...keys, maintenance: e.target.checked })}
                                            className="toggle-checkbox absolute block w-5 h-5 rounded-full bg-white border-4 appearance-none cursor-pointer"
                                        />
                                        <label htmlFor="maintenance" className={`toggle-label block overflow-hidden h-5 rounded-full cursor-pointer ${keys.maintenance ? 'bg-primary' : 'bg-slate-300 dark:bg-slate-600'}`}></label>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                        <div className="flex justify-end">
                            <Button onClick={handleSaveGeneral} disabled={loading}>{loading ? 'Saving...' : 'Save Changes'}</Button>
                        </div>
                    </div>
                );

            case 'integrations':
                return (
                    <div className="space-y-6">
                        <Card>
                            <CardHeader>
                                <CardTitle>Payment Gateways</CardTitle>
                                <CardDescription>Configure payment providers for deposits and withdrawals.</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-3">
                                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">Paystack Public Key</label>
                                    <input
                                        type="text"
                                        value={keys.paystackPublic}
                                        onChange={(e) => setKeys({ ...keys, paystackPublic: e.target.value })}
                                        placeholder="pk_test_..."
                                        className="w-full px-3 py-2 border border-slate-300 dark:border-slate-700 rounded-lg bg-white dark:bg-[#111921] text-slate-900 dark:text-white focus:ring-2 focus:ring-primary outline-none"
                                    />
                                </div>
                                <div className="space-y-3">
                                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">Paystack Secret Key</label>
                                    <input
                                        type="password"
                                        value={keys.paystackSecret}
                                        onChange={(e) => setKeys({ ...keys, paystackSecret: e.target.value })}
                                        placeholder="sk_test_..."
                                        className="w-full px-3 py-2 border border-slate-300 dark:border-slate-700 rounded-lg bg-white dark:bg-[#111921] text-slate-900 dark:text-white focus:ring-2 focus:ring-primary outline-none"
                                    />
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>Email & Notifications</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-3">
                                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">SendGrid API Key</label>
                                    <div className="flex gap-2">
                                        <input
                                            type="password"
                                            value={keys.sendgridKey}
                                            onChange={(e) => setKeys({ ...keys, sendgridKey: e.target.value })}
                                            placeholder="SG.xxxxxxxxxxxxxxxxxxxx"
                                            className="flex-1 px-3 py-2 border border-slate-300 dark:border-slate-700 rounded-lg bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white text-sm font-mono outline-none focus:ring-2 focus:ring-primary"
                                        />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                        <div className="flex justify-end">
                            <Button onClick={handleSaveIntegrations} disabled={loading}>{loading ? 'Saving...' : 'Save Configuration'}</Button>
                        </div>
                    </div>
                );
            case 'security':
                return (
                    <div className="space-y-6">
                        <Card>
                            <CardHeader>
                                <CardTitle>Access Policies</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-sm text-slate-500">Security settings are managed globally.</p>
                            </CardContent>
                        </Card>
                    </div>
                );
            default:
                return null;
        }
    };

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Admin Settings</h1>
                <p className="text-slate-500 dark:text-slate-400 text-sm">Manage platform configurations and administrative access.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                {/* Settings Sidebar */}
                <div className="space-y-1">
                    {['general', 'integrations', 'security'].map(tab => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`w-full text-left px-4 py-2 rounded-lg text-sm font-medium transition-colors capitalize ${activeTab === tab ? 'bg-primary/10 text-primary' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/50'}`}
                        >
                            {tab}
                        </button>
                    ))}
                </div>

                {/* Content Area */}
                <div className="md:col-span-3">
                    {renderContent()}
                </div>
            </div>
        </div>
    );
}


import { useState } from 'react';
import { Button } from '../../components/ui/button';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';

export default function AdminSettingsPage() {
    const [activeTab, setActiveTab] = useState('general');

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
                                        <input type="checkbox" name="toggle" id="maintenance" className="toggle-checkbox absolute block w-5 h-5 rounded-full bg-white border-4 appearance-none cursor-pointer" />
                                        <label htmlFor="maintenance" className="toggle-label block overflow-hidden h-5 rounded-full bg-slate-300 dark:bg-slate-600 cursor-pointer"></label>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">Support Contact Email</label>
                                        <input type="email" defaultValue="support@hermeos.ng" className="w-full px-3 py-2 border border-slate-300 dark:border-slate-700 rounded-lg bg-white dark:bg-[#111921] dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent transition-all outline-none" />
                                    </div>

                                    <div className="space-y-2">
                                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">Platform Currency</label>
                                        <select className="w-full px-3 py-2 border border-slate-300 dark:border-slate-700 rounded-lg bg-white dark:bg-[#111921] dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent transition-all outline-none">
                                            <option>NGN (Nigerian Naira)</option>
                                            <option>USD (United States Dollar)</option>
                                        </select>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                        <div className="flex justify-end">
                            <Button>Save Changes</Button>
                        </div>
                    </div>
                );
            case 'team':
                return (
                    <div className="space-y-6">
                        <div className="flex justify-between items-center">
                            <div>
                                <h3 className="text-lg font-bold text-slate-900 dark:text-white">Team Members</h3>
                                <p className="text-sm text-slate-500">Manage administrative access and roles.</p>
                            </div>
                            <Button size="sm"><span className="material-symbols-outlined text-sm mr-2">add</span> Invite Member</Button>
                        </div>
                        <Card>
                            <CardContent className="p-0">
                                <table className="w-full text-left">
                                    <thead className="bg-slate-50 dark:bg-slate-900/50 border-b border-slate-200 dark:border-slate-800">
                                        <tr>
                                            <th className="p-4 text-xs font-bold text-slate-500 uppercase">User</th>
                                            <th className="p-4 text-xs font-bold text-slate-500 uppercase">Role</th>
                                            <th className="p-4 text-xs font-bold text-slate-500 uppercase">Last Active</th>
                                            <th className="p-4 text-xs font-bold text-slate-500 uppercase text-right">Action</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                                        <tr>
                                            <td className="p-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-xs">JD</div>
                                                    <div>
                                                        <p className="text-sm font-medium text-slate-900 dark:text-white">John Doe</p>
                                                        <p className="text-xs text-slate-500">john@hermeos.ng</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="p-4"><Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">Super Admin</Badge></td>
                                            <td className="p-4 text-sm text-slate-500">2 mins ago</td>
                                            <td className="p-4 text-right">
                                                <button className="text-slate-400 hover:text-red-500 transition-colors"><span className="material-symbols-outlined text-lg">delete</span></button>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td className="p-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-xs">SM</div>
                                                    <div>
                                                        <p className="text-sm font-medium text-slate-900 dark:text-white">Sarah Musa</p>
                                                        <p className="text-xs text-slate-500">sarah@hermeos.ng</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="p-4"><Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">Editor</Badge></td>
                                            <td className="p-4 text-sm text-slate-500">1 day ago</td>
                                            <td className="p-4 text-right">
                                                <button className="text-slate-400 hover:text-red-500 transition-colors"><span className="material-symbols-outlined text-lg">delete</span></button>
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </CardContent>
                        </Card>
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
                                <div className="p-4 border border-slate-200 dark:border-slate-800 rounded-lg flex items-center justify-between">
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 bg-blue-900 text-white rounded flex items-center justify-center font-bold">P</div>
                                        <div>
                                            <h4 className="font-bold text-slate-900 dark:text-white text-sm">Paystack</h4>
                                            <p className="text-xs text-slate-500">Connected</p>
                                        </div>
                                    </div>
                                    <Button variant="outline" size="sm">Configure</Button>
                                </div>
                                <div className="p-4 border border-slate-200 dark:border-slate-800 rounded-lg flex items-center justify-between opacity-60">
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 bg-orange-500 text-white rounded flex items-center justify-center font-bold">F</div>
                                        <div>
                                            <h4 className="font-bold text-slate-900 dark:text-white text-sm">Flutterwave</h4>
                                            <p className="text-xs text-slate-500">Not Connected</p>
                                        </div>
                                    </div>
                                    <Button variant="outline" size="sm">Connect</Button>
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
                                        <input type="password" value="SG.xxxxxxxxxxxxxxxxxxxx" readOnly className="flex-1 px-3 py-2 border border-slate-300 dark:border-slate-700 rounded-lg bg-slate-50 dark:bg-slate-900 text-slate-500 text-sm font-mono" />
                                        <Button variant="outline">Update</Button>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                );
            case 'security':
                return (
                    <div className="space-y-6">
                        <Card>
                            <CardHeader>
                                <CardTitle>Access Policies</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="flex items-center justify-between py-2 border-b border-slate-100 dark:border-slate-800">
                                    <div>
                                        <h4 className="font-bold text-slate-900 dark:text-white text-sm">Enforce 2FA for Admins</h4>
                                        <p className="text-xs text-slate-500">Require Two-Factor Authentication for all team members.</p>
                                    </div>
                                    <div className="relative inline-block w-10 align-middle select-none">
                                        <input type="checkbox" defaultChecked name="toggle" id="2fa_policy" className="toggle-checkbox absolute block w-5 h-5 rounded-full bg-white border-4 appearance-none cursor-pointer translate-x-5 border-emerald-500" />
                                        <label htmlFor="2fa_policy" className="toggle-label block overflow-hidden h-5 rounded-full bg-emerald-500 cursor-pointer"></label>
                                    </div>
                                </div>
                                <div className="flex items-center justify-between py-2">
                                    <div>
                                        <h4 className="font-bold text-slate-900 dark:text-white text-sm">Session Timeout</h4>
                                        <p className="text-xs text-slate-500">Auto-logout inactive users after 15 minutes.</p>
                                    </div>
                                    <div className="relative inline-block w-10 align-middle select-none">
                                        <input type="checkbox" name="toggle" id="timeout" className="toggle-checkbox absolute block w-5 h-5 rounded-full bg-white border-4 appearance-none cursor-pointer" />
                                        <label htmlFor="timeout" className="toggle-label block overflow-hidden h-5 rounded-full bg-slate-300 dark:bg-slate-600 cursor-pointer"></label>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>Audit Logging</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="bg-slate-50 dark:bg-slate-900/50 p-4 rounded-lg border border-slate-200 dark:border-slate-800">
                                    <div className="flex items-center gap-3 mb-2">
                                        <span className="material-symbols-outlined text-blue-500">history</span>
                                        <p className="text-sm font-bold text-slate-900 dark:text-white">Log Retention Policy</p>
                                    </div>
                                    <p className="text-xs text-slate-500 mb-4">System logs are currently retained for <strong>90 days</strong>. Older logs are automatically archived to cold storage.</p>
                                    <Button variant="outline" size="sm">Configure Retention</Button>
                                </div>
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
                    <button
                        onClick={() => setActiveTab('general')}
                        className={`w-full text-left px-4 py-2 rounded-lg text-sm font-medium transition-colors ${activeTab === 'general' ? 'bg-primary/10 text-primary' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/50'}`}
                    >
                        General
                    </button>
                    <button
                        onClick={() => setActiveTab('team')}
                        className={`w-full text-left px-4 py-2 rounded-lg text-sm font-medium transition-colors ${activeTab === 'team' ? 'bg-primary/10 text-primary' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/50'}`}
                    >
                        Team Members
                    </button>
                    <button
                        onClick={() => setActiveTab('integrations')}
                        className={`w-full text-left px-4 py-2 rounded-lg text-sm font-medium transition-colors ${activeTab === 'integrations' ? 'bg-primary/10 text-primary' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/50'}`}
                    >
                        Integrations
                    </button>
                    <button
                        onClick={() => setActiveTab('security')}
                        className={`w-full text-left px-4 py-2 rounded-lg text-sm font-medium transition-colors ${activeTab === 'security' ? 'bg-primary/10 text-primary' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/50'}`}
                    >
                        Security
                    </button>
                </div>

                {/* Content Area */}
                <div className="md:col-span-3">
                    {renderContent()}
                </div>
            </div>
        </div>
    );
}

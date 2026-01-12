import { Link } from 'react-router-dom';
import { useState } from 'react';
import { cn } from '../../lib/utils';
import { useAuth } from '../../contexts/AuthContext';
import { useFetch } from '../../hooks/useApi';
import { TwoFactorSetupModal } from '../../components/auth/TwoFactorSetupModal';

export default function SettingsPage() {
    const { user } = useAuth();
    const { data: profile } = useFetch<any>('/user/profile'); // Fetch additional profile info if needed
    const [activeTab, setActiveTab] = useState("Personal Details");
    const [showTwoFactorSetup, setShowTwoFactorSetup] = useState(false);

    const tabs = ["Personal Details", "Ownership Access", "Security", "Notifications"];

    return (
        <div className="flex flex-col lg:flex-row min-h-[calc(100vh-64px)] w-full overflow-hidden bg-background-light dark:bg-background-dark">
            {/* Sidebar */}
            <aside className="hidden lg:flex flex-col w-72 bg-white dark:bg-[#1a2632] border-r border-slate-200 dark:border-slate-800 h-full flex-shrink-0">
                <div className="p-6">
                    <div className="flex gap-3 items-center mb-8">
                        <div className="bg-primary/10 rounded-xl p-2">
                            <span className="material-symbols-outlined text-primary text-3xl">domain</span>
                        </div>
                        <div className="flex flex-col">
                            <h1 className="text-slate-900 dark:text-white text-lg font-bold leading-tight">Hermeos</h1>
                            <p className="text-slate-500 dark:text-slate-400 text-xs font-medium">Proptech</p>
                        </div>
                    </div>
                    <div className="flex flex-col gap-2">
                        <Link to="/dashboard" className="flex items-center gap-3 px-3 py-3 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors group">
                            <span className="material-symbols-outlined text-slate-500 dark:text-slate-400 group-hover:text-primary transition-colors">dashboard</span>
                            <p className="text-slate-600 dark:text-slate-300 text-sm font-medium">Dashboard</p>
                        </Link>
                        <Link to="/portfolio" className="flex items-center gap-3 px-3 py-3 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors group">
                            <span className="material-symbols-outlined text-slate-500 dark:text-slate-400 group-hover:text-primary transition-colors">pie_chart</span>
                            <p className="text-slate-600 dark:text-slate-300 text-sm font-medium">My Assets</p>
                        </Link>
                        <Link to="/properties" className="flex items-center gap-3 px-3 py-3 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors group">
                            <span className="material-symbols-outlined text-slate-500 dark:text-slate-400 group-hover:text-primary transition-colors">storefront</span>
                            <p className="text-slate-600 dark:text-slate-300 text-sm font-medium">Property Listings</p>
                        </Link>
                        <div className="flex items-center gap-3 px-3 py-3 rounded-lg bg-primary/10 border-l-4 border-primary">
                            <span className="material-symbols-outlined text-primary">settings</span>
                            <p className="text-primary text-sm font-bold">Settings</p>
                        </div>
                    </div>
                </div>
                <div className="mt-auto p-6 border-t border-slate-200 dark:border-slate-800">
                    <div className="flex gap-3 items-center">
                        <div className="bg-center bg-no-repeat bg-cover rounded-full h-10 w-10 ring-2 ring-white dark:ring-slate-700" style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuCuGcK1zD3xC1IM0Dy9k9CiSX2x0E_-wIJ8PCiiIJoq3eLQ7kDZujM66KEO49rb08Sx2AB1u6LQxOvMLV2Zmd3PRYlh-afPwcA1E2YTfDBZ6WuE6zN_-hWSOJytLpewciIGXSOT9F7A8Ha8msDlifIeOVhEUurCz1wpFs5YSwWJspn10fMTNu0bJVAKis324uFCxgnPsU9dZPlqVhLUVDnWv1GCqGFkqeon2464sTtbwSRJQQrjDEQEM2YsLcTh2Mn4_FKAJm2Mla1-")' }}></div>
                        <div className="flex flex-col">
                            <p className="text-slate-900 dark:text-white text-sm font-semibold">{user?.firstName} {user?.lastName}</p>
                            <p className="text-slate-500 dark:text-slate-400 text-xs">{user?.role || 'Asset Holder'}</p>
                        </div>
                    </div>
                </div>
            </aside>

            <div className="flex-1 h-full overflow-y-auto bg-background-light dark:bg-background-dark scroll-smooth no-scrollbar">
                <div className="max-w-[1024px] mx-auto px-6 py-8 md:px-10 md:py-12 flex flex-col gap-8">
                    <div className="flex flex-col gap-2">
                        <h1 className="text-slate-900 dark:text-white text-3xl md:text-4xl font-black tracking-tight">Settings & Profile</h1>
                        <p className="text-slate-500 dark:text-slate-400 text-base md:text-lg">Manage your profile, NIN verification, and ownership contribution preferences.</p>
                    </div>

                    {/* Tabs (Horizontal Scroll on Mobile) */}
                    <div className="sticky top-0 z-10 bg-background-light dark:bg-background-dark pt-2 pb-4 border-b border-slate-200 dark:border-slate-700/50">
                        <div className="flex overflow-x-auto gap-8 no-scrollbar">
                            {tabs.map((tab) => (
                                <button
                                    key={tab}
                                    onClick={() => setActiveTab(tab)}
                                    className={cn(
                                        "flex flex-col items-center justify-center border-b-[3px] pb-3 pt-2 px-1 whitespace-nowrap transition-colors",
                                        activeTab === tab
                                            ? 'border-primary text-primary'
                                            : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'
                                    )}
                                >
                                    <span className="text-sm font-bold tracking-wide">{tab}</span>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Tab Content */}
                    <div className="w-full">
                        {activeTab === "Personal Details" && (
                            <div className="flex flex-col gap-8">
                                <section className="flex flex-col gap-4">
                                    <div className="flex items-center gap-2">
                                        <h2 className="text-slate-900 dark:text-white text-xl font-bold">Identity & Verification</h2>
                                        <span className="material-symbols-outlined text-slate-400 text-lg">verified_user</span>
                                    </div>
                                    <div className="bg-white dark:bg-[#1a2632] rounded-xl border border-emerald-200 dark:border-emerald-900/30 shadow-sm p-6 relative overflow-hidden">
                                        <div className="absolute top-0 left-0 w-1.5 h-full bg-emerald-500"></div>
                                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                                            <div className="flex gap-5 items-start">
                                                <div className="bg-emerald-100 dark:bg-emerald-900/40 text-emerald-600 dark:text-emerald-400 p-3 rounded-full flex-shrink-0">
                                                    <span className="material-symbols-outlined text-2xl">check_circle</span>
                                                </div>
                                                <div className="flex flex-col gap-1">
                                                    <p className="text-slate-900 dark:text-white text-base font-bold">NIN Verification Status: {user?.isVerified ? 'Verified' : 'Pending'}</p>
                                                    <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed max-w-xl">
                                                        {user?.isVerified
                                                            ? "Your National Identity has been confirmed. You are fully eligible to hold asset units in managed properties and receive ownership distributions."
                                                            : "Your identity verification is currently pending. Please complete the verification process to access all features."}
                                                    </p>
                                                </div>
                                            </div>
                                            <button className="flex-shrink-0 bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200 px-4 py-2 rounded-lg text-sm font-semibold transition-colors">
                                                View Documents
                                            </button>
                                        </div>
                                    </div>
                                </section>

                                <section className="flex flex-col gap-4">
                                    <h2 className="text-slate-900 dark:text-white text-xl font-bold">Personal Information</h2>
                                    <div className="bg-white dark:bg-[#1a2632] rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm p-6 md:p-8">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div className="flex flex-col gap-2">
                                                <label className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Full Legal Name</label>
                                                <input className="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg px-4 py-2.5 text-slate-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all" type="text" defaultValue={`${user?.firstName} ${user?.lastName} `} />
                                            </div>
                                            <div className="flex flex-col gap-2">
                                                <label className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Email Address</label>
                                                <input className="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg px-4 py-2.5 text-slate-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all" type="email" defaultValue={user?.email} disabled />
                                            </div>
                                            <div className="flex flex-col gap-2">
                                                <label className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Phone Number</label>
                                                <input className="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg px-4 py-2.5 text-slate-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all" type="tel" placeholder="+234..." defaultValue={profile?.phoneNumber || ''} />
                                            </div>
                                            <div className="flex flex-col gap-2">
                                                <label className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">National Identification Number (NIN)</label>
                                                <input className="bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-4 py-2.5 text-slate-500 dark:text-slate-400 cursor-not-allowed" disabled type="text" defaultValue="***********" />
                                            </div>
                                            <div className="flex flex-col gap-2 md:col-span-2">
                                                <label className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Residential Address</label>
                                                <input className="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg px-4 py-2.5 text-slate-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all" type="text" placeholder="Enter address" defaultValue={profile?.address || ''} />
                                            </div>
                                        </div>
                                        <div className="mt-8 flex justify-end">
                                            <button className="bg-primary hover:bg-blue-600 text-white px-6 py-2.5 rounded-lg text-sm font-bold shadow-md shadow-blue-500/20 transition-all transform active:scale-95">
                                                Save Changes
                                            </button>
                                        </div>
                                    </div>
                                </section>
                            </div>
                        )}

                        {activeTab === "Ownership Access" && (
                            <section className="flex flex-col gap-4">
                                <h2 className="text-slate-900 dark:text-white text-xl font-bold">Ownership Access</h2>
                                <div className="bg-white dark:bg-[#1a2632] rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
                                    <div className="p-6 md:p-8 flex flex-col md:flex-row gap-6">
                                        <div className="flex-1">
                                            <div className="flex items-center gap-3 mb-3">
                                                <span className="bg-blue-100 dark:bg-blue-900/30 text-primary px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide">Current Status</span>
                                                <h3 className="text-slate-900 dark:text-white text-lg font-bold">Verified Asset Participant</h3>
                                            </div>
                                            <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed mb-4">
                                                Your account status grants you <span className="text-slate-900 dark:text-white font-semibold">unlimited access</span> to contribute towards ownership units in both residential and commercial asset classes. You have full transparency into property financials and priority access to new listings.
                                            </p>
                                            <a href="#" className="text-primary text-sm font-bold hover:underline inline-flex items-center gap-1">
                                                View Contribution Limits <span className="material-symbols-outlined text-sm">arrow_forward</span>
                                            </a>
                                        </div>
                                        <div className="w-full md:w-1/3 bg-slate-50 dark:bg-slate-900/50 rounded-lg p-5 border border-slate-100 dark:border-slate-700/50">
                                            <h4 className="text-slate-900 dark:text-white text-sm font-bold mb-3">Privileges</h4>
                                            <ul className="flex flex-col gap-2">
                                                {[
                                                    'Commercial Properties', 'Priority Asset Access', 'Auto-Asset Allocation'
                                                ].map((priv, i) => (
                                                    <li key={i} className="flex items-start gap-2">
                                                        <span className="material-symbols-outlined text-green-500 text-lg">check</span>
                                                        <span className="text-slate-600 dark:text-slate-300 text-sm">{priv}</span>
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                            </section>
                        )}

                        {activeTab === "Security" && (
                            <section className="flex flex-col gap-4">
                                <h2 className="text-slate-900 dark:text-white text-xl font-bold">Security</h2>
                                <div className="bg-white dark:bg-[#1a2632] rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm p-6 max-w-2xl">
                                    <div className="flex flex-col gap-4">
                                        <h3 className="text-base font-bold text-slate-900 dark:text-white">Change Password</h3>
                                        <div className="space-y-3">
                                            <input className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg px-4 py-2 text-sm text-slate-900 dark:text-white outline-none focus:border-primary transition-colors" placeholder="Current Password" type="password" />
                                            <input className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg px-4 py-2 text-sm text-slate-900 dark:text-white outline-none focus:border-primary transition-colors" placeholder="New Password" type="password" />
                                            <input className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg px-4 py-2 text-sm text-slate-900 dark:text-white outline-none focus:border-primary transition-colors" placeholder="Confirm New Password" type="password" />
                                        </div>
                                        <div className="flex justify-start mt-2">
                                            <button className="text-primary text-sm font-bold hover:text-blue-700 dark:hover:text-blue-400">Update Password</button>
                                        </div>
                                    </div>
                                    <div className="border-t border-slate-100 dark:border-slate-700 mt-6 pt-6">
                                        <div className="flex items-center justify-between">
                                            <div className="flex flex-col">
                                                <p className="text-sm font-bold text-slate-900 dark:text-white">2-Factor Authentication</p>
                                                <p className="text-xs text-slate-500 dark:text-slate-400">Secure your account with 2FA.</p>
                                            </div>
                                            <label className="relative inline-flex items-center cursor-pointer">
                                                <input
                                                    type="checkbox"
                                                    className="sr-only peer"
                                                    checked={user?.twoFactorEnabled || false}
                                                    onChange={() => setShowTwoFactorSetup(true)}
                                                    disabled={user?.twoFactorEnabled} // Can only enable here for now, disable needs separate flow
                                                />
                                                <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-primary"></div>
                                            </label>
                                        </div>
                                        {user?.twoFactorEnabled && (
                                            <div className="mt-4">
                                                <p className="text-xs text-green-600 font-medium">2FA is currently active.</p>
                                                {/* Add Disable Button logic later if needed */}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </section>
                        )}

                        {activeTab === "Notifications" && (
                            <section className="flex flex-col gap-4">
                                <h2 className="text-slate-900 dark:text-white text-xl font-bold">Preferences</h2>
                                <div className="bg-white dark:bg-[#1a2632] rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm p-6 max-w-2xl">
                                    <h3 className="text-base font-bold text-slate-900 dark:text-white mb-4">Email Notifications</h3>
                                    <div className="flex flex-col gap-6">
                                        {[
                                            { icon: 'apartment', title: 'New Asset Alerts', sub: 'Get notified when new assets are available for ownership participation.', color: 'bg-blue-50 dark:bg-blue-900/20 text-primary', checked: true },
                                            { icon: 'trending_up', title: 'Asset Status Reports', sub: 'Weekly summaries of your asset portfolio in ₦ (Naira).', color: 'bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400', checked: true },
                                            { icon: 'campaign', title: 'Platform News', sub: 'Updates about Hermeos Proptech features and property laws.', color: 'bg-orange-50 dark:bg-orange-900/20 text-orange-600 dark:text-orange-400', checked: false }
                                        ].map((pref, i) => (
                                            <div key={i} className="flex items-center justify-between">
                                                <div className="flex gap-3">
                                                    <div className={`${pref.color} p - 2 rounded - lg h - fit`}>
                                                        <span className="material-symbols-outlined text-xl">{pref.icon}</span>
                                                    </div>
                                                    <div className="flex flex-col">
                                                        <p className="text-sm font-bold text-slate-900 dark:text-white">{pref.title}</p>
                                                        <p className="text-xs text-slate-500 dark:text-slate-400 max-w-[200px]">{pref.sub}</p>
                                                    </div>
                                                </div>
                                                <label className="relative inline-flex items-center cursor-pointer">
                                                    <input type="checkbox" className="sr-only peer" defaultChecked={pref.checked} />
                                                    <div className="w-11 h-6 bg-slate-200 rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-primary"></div>
                                                </label>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </section>
                        )}
                    </div>
                </div>
                <TwoFactorSetupModal
                    isOpen={showTwoFactorSetup}
                    onClose={() => setShowTwoFactorSetup(false)}
                />
            </div>
        </div>
    );
}

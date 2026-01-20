import { useState } from 'react';
import { Button } from '../../components/ui/button';
import { useAuth } from '../../contexts/AuthContext';
import { apiClient } from '../../lib/api-client';

export default function SupportPage() {
    const { user } = useAuth();
    const [activeTab, setActiveTab] = useState<'help-center' | 'inbox'>('help-center');
    const [searchQuery, setSearchQuery] = useState('');
    const [formData, setFormData] = useState({
        name: user ? `${user.firstName} ${user.lastName}` : '',
        email: user?.email || '',
        subject: '',
        category: 'Account Verification',
        assetRef: '',
        message: ''
    });
    const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        // Implement search logic later or redirect to FAQ
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.subject || !formData.message) {
            return;
        }

        setIsSubmitting(true);
        try {
            await apiClient.post('/support', {
                category: formData.category,
                subject: formData.subject,
                message: formData.message,
                assetRef: formData.assetRef
            });
            setSubmitStatus('success');
            setFormData(prev => ({ ...prev, subject: '', message: '', assetRef: '' }));
            setTimeout(() => setSubmitStatus('idle'), 3000);
        } catch (error) {
            console.error('Support ticket failed', error);
            setSubmitStatus('error');
        } finally {
            setIsSubmitting(false);
        }
    };

    const topics = [
        { icon: 'verified_user', title: 'Account Verification', desc: 'Guide to KYC, BVN/NIN validation, and identity verification requirements in Nigeria.', link: '#verification' },
        { icon: 'real_estate_agent', title: 'Asset Acquisition', desc: 'Understanding co-ownership structures, fractional units, and purchasing processes.', link: '#acquisition' },
        { icon: 'account_balance_wallet', title: 'Wallet & Payments', desc: 'Funding your wallet via bank transfer, managing rental income withdrawals.', link: '#wallet' },
        { icon: 'description', title: 'Documents & Deeds', desc: 'Accessing your digital deeds, Certificates of Ownership (C of O), and legal records.', link: '#documents' }
    ];

    const tabs = [
        { id: 'help-center', label: 'Help Center', icon: 'support' },
        { id: 'inbox', label: 'My Tickets', icon: 'inbox' }
    ];

    return (
        <div className="flex flex-col min-h-screen relative bg-background-light dark:bg-background-dark">
            {/* Tab Navigation */}
            <div className="bg-white dark:bg-[#111921] border-b border-gray-200 dark:border-gray-800 shadow-sm sticky top-0 z-20">
                <div className="max-w-[1440px] mx-auto px-4 md:px-12 flex gap-8">
                    {tabs.map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id as any)}
                            className={`flex items-center gap-2 py-4 border-b-2 font-bold text-sm transition-colors ${activeTab === tab.id
                                ? 'border-primary text-primary'
                                : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
                                }`}
                        >
                            <span className="material-symbols-outlined text-[20px]">{tab.icon}</span>
                            {tab.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* Content Area */}
            {activeTab === 'help-center' && (
                <div className="animate-in fade-in duration-300">
                    {/* Hero Section */}
                    <section className="relative w-full">
                        <div className="px-4 py-8 md:px-40 md:py-12 flex justify-center bg-white dark:bg-[#111921]">
                            <div className="flex flex-col max-w-[960px] w-full items-center">
                                <div
                                    className="w-full rounded-2xl overflow-hidden relative min-h-[300px] flex flex-col gap-6 items-center justify-center p-6 text-center shadow-lg bg-cover bg-center"
                                    style={{ backgroundImage: 'linear-gradient(rgba(17, 25, 33, 0.7) 0%, rgba(17, 25, 33, 0.8) 100%), url("https://lh3.googleusercontent.com/aida-public/AB6AXuDvyTnbOglVb1g05pmqaRq8SajpZDGojcbxMyfqOCkerwrcoyv5xLsAn0YSD6-RqtgkH_g29zIrmPVEZ_KGLWpInopoMTCVWyGa7pm7AixcdIsaDOvAn2SDctVnqPERRh8qsZca8B9egXuEAm2HEIiFzLyAILqu8bo2vXriU7xM7gQ11W8d3FVAVcU67_CZoGZ9zRXtGQ4rimM_OGSuDlb4ill2lPrSmdNwG7HwXzJmyH9uRU5uSuDnRmY_2hiA3-9N7d9wlqxm_cMS")' }}
                                >
                                    <div className="flex flex-col gap-3 max-w-2xl z-10">
                                        <h1 className="text-white text-3xl md:text-5xl font-black leading-tight tracking-[-0.033em]">
                                            Support & Resources
                                        </h1>
                                        <p className="text-slate-200 text-sm md:text-lg font-medium leading-relaxed">
                                            We are here to assist you in managing your property portfolio.
                                        </p>
                                    </div>
                                    <form onSubmit={handleSearch} className="w-full max-w-[540px] z-10 mt-4">
                                        <label className="relative flex w-full items-center">
                                            <div className="absolute left-4 text-slate-400">
                                                <span className="material-symbols-outlined">search</span>
                                            </div>
                                            <input
                                                className="w-full h-14 pl-12 pr-28 rounded-xl border-0 bg-white shadow-xl text-slate-900 placeholder:text-slate-400 focus:ring-2 focus:ring-primary text-base outline-none"
                                                placeholder="Search articles..."
                                                value={searchQuery}
                                                onChange={(e) => setSearchQuery(e.target.value)}
                                            />
                                            <button
                                                type="submit"
                                                className="absolute right-2 top-2 bottom-2 bg-primary hover:bg-blue-600 text-white font-bold rounded-lg px-6 transition-colors"
                                            >
                                                Search
                                            </button>
                                        </label>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Browse by Topic */}
                    <section className="px-4 md:px-40 py-8 bg-background-light dark:bg-background-dark">
                        <div className="max-w-[960px] mx-auto w-full flex flex-col gap-6">
                            <h2 className="text-slate-900 dark:text-white text-2xl font-bold leading-tight px-2">Browse by Topic</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {topics.map((topic, i) => (
                                    <a
                                        key={i}
                                        href={topic.link}
                                        className="flex flex-col sm:flex-row gap-4 rounded-xl bg-white dark:bg-[#1a2632] p-5 shadow-sm border border-slate-200 dark:border-slate-700 hover:shadow-md transition-shadow cursor-pointer group"
                                    >
                                        <div className="flex flex-col gap-2 flex-[3]">
                                            <div className="flex items-center gap-2 mb-1">
                                                <span className="material-symbols-outlined text-primary">{topic.icon}</span>
                                                <p className="text-slate-900 dark:text-white text-lg font-bold">{topic.title}</p>
                                            </div>
                                            <p className="text-slate-500 dark:text-slate-400 text-sm">{topic.desc}</p>
                                            <span className="text-primary text-sm font-bold mt-auto pt-2 group-hover:underline">View Articles →</span>
                                        </div>
                                    </a>
                                ))}
                            </div>
                        </div>
                    </section>

                    {/* FAQ Section */}
                    <section className="px-4 md:px-40 py-12 bg-white dark:bg-[#111921]">
                        <div className="max-w-[800px] mx-auto w-full">
                            <h2 className="text-slate-900 dark:text-white text-2xl font-bold mb-8 text-center">Frequently Asked Questions</h2>
                            <div className="flex flex-col gap-4">
                                {[
                                    { q: "Is Hermeos Proptech a trading or stock platform?", a: "No. We are a Digital Cooperative Platform. When you subscribe, you join Manymiles Cooperative Multipurpose Society as a member. You are \"contributing\" to develop real assets, not buying stocks." },
                                    { q: "Who owns the land?", a: "The legal title is held by Manymiles Cooperative Multipurpose Society on behalf of all members. You hold a Digital Certificate of Beneficial Ownership." },
                                    { q: "How do I make money?", a: "You earn Patronage Refunds. When the Cooperative generates a Surplus from the Iré Portfolio, it is distributed back to members based on the number of Slots they hold." },
                                    { q: "Is this legal?", a: "Yes. We are regulated by the Director of Cooperative Services at the Lagos State Ministry of Commerce, Industry and Cooperatives." },
                                    { q: "Can I withdraw my money anytime?", a: "No. Real estate requires time to build value. All contributions have a mandatory Lock-in Period (usually 12 months). After this period, you can request liquidation (subject to 90 days notice) or transfer your slots to another member." },
                                    { q: "Is the Surplus (Payout) guaranteed?", a: "No, because honest business performance varies. However, the Cooperative structure ensures that Surplus is distributed transparently to members, and our construction expertise minimizes risk." }
                                ].map((faq, i) => (
                                    <details key={i} className="group bg-background-light dark:bg-[#1a2632] rounded-lg overflow-hidden border border-slate-200 dark:border-slate-700">
                                        <summary className="flex justify-between items-center font-bold cursor-pointer list-none p-5 text-slate-900 dark:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors [&::webkit-details-marker]:hidden">
                                            <span>{faq.q}</span>
                                            <span className="transition group-open:rotate-180">
                                                <span className="material-symbols-outlined">expand_more</span>
                                            </span>
                                        </summary>
                                        <div className="text-slate-600 dark:text-slate-300 p-5 pt-0 leading-relaxed text-sm animate-sweep">
                                            {faq.a}
                                        </div>
                                    </details>
                                ))}
                            </div>
                        </div>
                    </section>

                    {/* Contact & Form Section */}
                    <section className="px-4 md:px-40 py-12 bg-background-light dark:bg-background-dark">
                        <div className="max-w-[960px] mx-auto w-full">
                            <div className="flex flex-col lg:flex-row gap-8 items-start">
                                {/* Left: Contact Info */}
                                <div className="flex-1 w-full lg:w-auto bg-primary rounded-2xl p-8 text-white shadow-lg">
                                    <h3 className="text-2xl font-bold mb-6">Still need help?</h3>
                                    <p className="mb-8 text-blue-100">Our Lagos-based support team is available Mon-Fri, 8am - 6pm WAT to assist with your inquiries.</p>
                                    <div className="flex flex-col gap-6">
                                        {[
                                            { icon: 'call', title: 'Phone Support', val: '+234 1 234 5678', href: 'tel:+2341234567' },
                                            { icon: 'chat', title: 'WhatsApp', val: '+234 800 HERMEOS', href: 'https://wa.me/234800437636' },
                                            { icon: 'mail', title: 'Email', val: 'support@hermeos.ng', href: 'mailto:support@hermeos.ng' },
                                            { icon: 'location_on', title: 'Office', val: '12A Admiralty Way, Lekki Phase 1, Lagos, Nigeria', href: 'https://maps.google.com/?q=12A+Admiralty+Way+Lekki' }
                                        ].map((item, i) => (
                                            <a
                                                key={i}
                                                href={item.href}
                                                target={item.icon === 'location_on' ? '_blank' : undefined}
                                                rel={item.icon === 'location_on' ? 'noopener noreferrer' : undefined}
                                                className="flex items-center gap-4 hover:opacity-90 transition-opacity"
                                            >
                                                <div className="size-10 rounded-full bg-white/20 flex items-center justify-center">
                                                    <span className="material-symbols-outlined">{item.icon}</span>
                                                </div>
                                                <div>
                                                    <p className="text-xs text-blue-200 font-bold uppercase tracking-wider">{item.title}</p>
                                                    <p className="font-bold text-base md:text-lg leading-snug">{item.val}</p>
                                                </div>
                                            </a>
                                        ))}
                                    </div>
                                </div>

                                {/* Right: Form */}
                                <div className="flex-[1.5] w-full lg:w-auto bg-white dark:bg-[#1a2632] p-8 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm">
                                    <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-6">Submit a Request</h3>

                                    {submitStatus === 'success' && (
                                        <div className="mb-4 p-4 bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 rounded-lg flex items-center gap-2">
                                            <span className="material-symbols-outlined text-emerald-600">check_circle</span>
                                            <p className="text-sm text-emerald-700 dark:text-emerald-400">Your ticket has been submitted successfully!</p>
                                        </div>
                                    )}

                                    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                                            <label className="flex flex-col gap-1.5">
                                                <span className="text-sm font-bold text-slate-900 dark:text-slate-200">Full Name *</span>
                                                <input
                                                    className="rounded-lg border-slate-300 bg-slate-50 dark:bg-slate-800 dark:border-slate-600 dark:text-white focus:ring-primary focus:border-primary p-2.5 w-full outline-none border"
                                                    placeholder="Enter your full name"
                                                    type="text"
                                                    value={formData.name}
                                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                                    required
                                                />
                                            </label>
                                            <label className="flex flex-col gap-1.5">
                                                <span className="text-sm font-bold text-slate-900 dark:text-slate-200">Email Address *</span>
                                                <input
                                                    className="rounded-lg border-slate-300 bg-slate-100 dark:bg-slate-900 dark:border-slate-600 dark:text-slate-400 p-2.5 w-full outline-none border cursor-not-allowed"
                                                    type="email"
                                                    value={formData.email}
                                                    disabled
                                                />
                                            </label>
                                        </div>
                                        <label className="flex flex-col gap-1.5">
                                            <span className="text-sm font-bold text-slate-900 dark:text-slate-200">Subject *</span>
                                            <input
                                                className="rounded-lg border-slate-300 bg-slate-50 dark:bg-slate-800 dark:border-slate-600 dark:text-white focus:ring-primary focus:border-primary p-2.5 w-full outline-none border"
                                                placeholder="Brief summary of your request"
                                                type="text"
                                                value={formData.subject}
                                                onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                                                required
                                            />
                                        </label>
                                        <label className="flex flex-col gap-1.5">
                                            <span className="text-sm font-bold text-slate-900 dark:text-slate-200">Category</span>
                                            <select
                                                className="rounded-lg border-slate-300 bg-slate-50 dark:bg-slate-800 dark:border-slate-600 dark:text-white focus:ring-primary focus:border-primary p-2.5 w-full outline-none border"
                                                value={formData.category}
                                                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                            >
                                                <option>Account Verification</option>
                                                <option>Wallet Funding / Withdrawal</option>
                                                <option>Property Ownership / Deeds</option>
                                                <option>Technical Issue</option>
                                                <option>Other</option>
                                            </select>
                                        </label>
                                        <label className="flex flex-col gap-1.5">
                                            <span className="text-sm font-bold text-slate-900 dark:text-slate-200">Asset Reference ID (Optional)</span>
                                            <input
                                                className="rounded-lg border-slate-300 bg-slate-50 dark:bg-slate-800 dark:border-slate-600 dark:text-white focus:ring-primary focus:border-primary p-2.5 w-full outline-none border"
                                                placeholder="e.g. #LAG-LKK-002"
                                                type="text"
                                                value={formData.assetRef}
                                                onChange={(e) => setFormData({ ...formData, assetRef: e.target.value })}
                                            />
                                        </label>
                                        <label className="flex flex-col gap-1.5">
                                            <span className="text-sm font-bold text-slate-900 dark:text-slate-200">Message *</span>
                                            <textarea
                                                className="rounded-lg border-slate-300 bg-slate-50 dark:bg-slate-800 dark:border-slate-600 dark:text-white focus:ring-primary focus:border-primary p-2.5 w-full outline-none border resize-none"
                                                placeholder="Describe your issue in detail..."
                                                rows={4}
                                                value={formData.message}
                                                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                                                required
                                            />
                                        </label>
                                        <Button type="submit" className="w-full py-3 h-auto shadow-sm" disabled={isSubmitting}>
                                            {isSubmitting ? 'Submitting...' : 'Submit Ticket'}
                                        </Button>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </section>
                </div>
            )}

            {activeTab === 'inbox' && (
                <div className="flex-1 flex flex-col items-center justify-center p-12 text-center text-slate-500 dark:text-slate-400 animate-in fade-in duration-300">
                    <div className="bg-slate-100 dark:bg-slate-800 p-6 rounded-full mb-4">
                        <span className="material-symbols-outlined text-4xl">inbox</span>
                    </div>
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">No tickets yet</h3>
                    <p className="max-w-md">Your support requests and conversations will appear here. If you need assistance, please submit a request from the Help Center.</p>
                    <button
                        onClick={() => setActiveTab('help-center')}
                        className="mt-6 text-primary font-bold hover:underline"
                    >
                        Go to Help Center
                    </button>
                </div>
            )}

            {/* Floating WhatsApp Button */}
            <a
                href="https://wa.me/234800437636"
                target="_blank"
                rel="noopener noreferrer"
                className="fixed bottom-6 left-6 z-50 flex items-center gap-2 bg-[#25D366] hover:bg-[#20bd5a] text-white py-3 px-5 rounded-full shadow-xl transition-transform hover:-translate-y-1"
            >
                <span className="material-symbols-outlined">chat</span>
                <span className="font-bold">Chat with us</span>
            </a>
        </div>
    );
}

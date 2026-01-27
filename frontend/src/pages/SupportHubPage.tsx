
import React, { useState } from 'react';
import { Search, CheckCircle, Home, Wallet, FileText, ChevronDown, Phone, MessageCircle, Mail, MapPin, Lock, AlertCircle, Check } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useMutation } from '../hooks/useApi';

const SupportHubPage: React.FC = () => {
    const { user } = useAuth();
    const [formData, setFormData] = useState({
        fullName: `${user?.firstName || ''} ${user?.lastName || ''}`,
        email: user?.email || '',
        category: 'Account Verification',
        assetRef: '',
        message: '',
        subject: '' // Derived or explicit
    });

    const [showSuccess, setShowSuccess] = useState(false);
    const [ticketData, setTicketData] = useState<any>(null);

    const { mutate, isLoading, error } = useMutation('/support', 'POST', {
        onSuccess: (data) => {
            setTicketData(data);
            setShowSuccess(true);
            setFormData(prev => ({ ...prev, message: '', assetRef: '' }));
        }
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Auto-generate subject if not provided (simple logic)
        const subject = `${formData.category} Request from ${formData.fullName}`;

        mutate({
            ...formData,
            subject
        });
    };

    const isVIP = user?.tier === 'Tier 3' || user?.tier === 'Institutional' || user?.tier === 'Gold';

    return (
        <div className="bg-background-light dark:bg-background-dark font-display text-text-main dark:text-gray-100 antialiased overflow-x-hidden relative">

            {/* Success Modal */}
            {showSuccess && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
                    <div className="bg-white dark:bg-slate-800 rounded-2xl p-8 max-w-md w-full shadow-2xl flex flex-col items-center text-center animate-in fade-in zoom-in duration-300">
                        <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mb-4">
                            <Check className="w-8 h-8 text-green-600 dark:text-green-400" />
                        </div>
                        <h3 className="text-2xl font-bold mb-2">Ticket Created!</h3>
                        <p className="text-slate-600 dark:text-slate-400 mb-6">
                            Reference: <span className="font-mono font-bold bg-slate-100 dark:bg-slate-700 px-2 py-1 rounded">#{ticketData?.id.slice(0, 8)}</span>
                        </p>

                        {ticketData?.vipStatus === 'Active' && (
                            <div className="mb-6 px-4 py-2 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg text-amber-700 dark:text-amber-400 text-sm font-bold flex items-center gap-2">
                                <span className="material-symbols-outlined text-sm">star</span>
                                VIP Priority Active - 24h SLA
                            </div>
                        )}

                        <button
                            onClick={() => setShowSuccess(false)}
                            className="bg-primary hover:bg-primary-dark text-white font-bold py-3 px-8 rounded-xl transition-all w-full"
                        >
                            Got it
                        </button>
                    </div>
                </div>
            )}

            {/* Hero Search Section */}
            <section className="relative w-full">
                <div className="px-4 py-8 md:px-40 md:py-12 flex justify-center bg-white dark:bg-slate-900">
                    <div className="flex flex-col max-w-[960px] w-full items-center">
                        <div
                            className="w-full rounded-2xl overflow-hidden relative min-h-[320px] md:min-h-[400px] flex flex-col gap-6 items-center justify-center p-6 text-center shadow-lg"
                            style={{
                                backgroundImage: `linear-gradient(rgba(17, 25, 33, 0.7) 0%, rgba(17, 25, 33, 0.85) 100%), url("https://lh3.googleusercontent.com/aida-public/AB6AXuDvyTnbOglVb1g05pmqaRq8SajpZDGojcbxMyfqOCkerwrcoyv5xLsAn0YSD6-RqtgkH_g29zIrmPVEZ_KGLWpInopoMTCVWyGa7pm7AixcdIsaDOvAn2SDctVnqPERRh8qsZca8B9egXuEAm2HEIiFzLyAILqu8bo2vXriU7xM7gQ11W8d3FVAVcU67_CZoGZ9zRXtGQ4rimM_OGSuDlb4ill2lPrSmdNwG7HwXzJmyH9uRU5uSuDnRmY_2hiA3-9N7d9wlqxm_cMS")`,
                                backgroundSize: 'cover',
                                backgroundPosition: 'center'
                            }}
                        >
                            <div className="flex flex-col gap-3 max-w-2xl z-10">
                                <h1 className="text-white text-3xl md:text-5xl font-black leading-tight tracking-[-0.033em]">
                                    FAQ & Support Hub
                                </h1>
                                <p className="text-slate-200 text-sm md:text-lg font-medium leading-relaxed">
                                    Find answers about property co-ownership, wallet management, and asset security in Nigeria.
                                </p>
                            </div>
                            <div className="w-full max-w-[540px] z-10 mt-4">
                                <label className="relative flex w-full items-center">
                                    <div className="absolute left-4 text-slate-400">
                                        <Search className="w-5 h-5" />
                                    </div>
                                    <input className="w-full h-14 pl-12 pr-28 rounded-xl border-0 bg-white shadow-xl text-slate-900 placeholder:text-slate-400 focus:ring-2 focus:ring-primary text-base" placeholder="Search topics (e.g. rent, verification, deeds)" />
                                    <button className="absolute right-2 top-2 bottom-2 bg-primary hover:bg-primary-dark text-white font-bold rounded-lg px-6 transition-colors">
                                        Search
                                    </button>
                                </label>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Browse by Topic */}
            <section className="px-4 md:px-40 py-8 bg-background-light dark:bg-background-dark">
                <div className="max-w-[960px] mx-auto w-full flex flex-col gap-6">
                    <h2 className="text-text-main dark:text-white text-2xl font-bold leading-tight px-2">Browse by Topic</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <a href="#verification" className="flex flex-col sm:flex-row gap-4 rounded-xl bg-white dark:bg-slate-800 p-5 shadow-sm border border-slate-200 dark:border-slate-700 hover:shadow-md transition-shadow cursor-pointer group">
                            <div className="flex flex-col gap-2 flex-[3]">
                                <div className="flex items-center gap-2 mb-1">
                                    <CheckCircle className="text-primary w-5 h-5" />
                                    <p className="text-text-main dark:text-white text-lg font-bold">Account Verification</p>
                                </div>
                                <p className="text-text-secondary dark:text-slate-400 text-sm">Guide to KYC, BVN/NIN validation, and identity verification requirements in Nigeria.</p>
                                <span className="text-primary text-sm font-bold mt-auto pt-2 group-hover:underline">View Articles →</span>
                            </div>
                        </a>
                        <a href="#ownership" className="flex flex-col sm:flex-row gap-4 rounded-xl bg-white dark:bg-slate-800 p-5 shadow-sm border border-slate-200 dark:border-slate-700 hover:shadow-md transition-shadow cursor-pointer group">
                            <div className="flex flex-col gap-2 flex-[3]">
                                <div className="flex items-center gap-2 mb-1">
                                    <Home className="text-primary w-5 h-5" />
                                    <p className="text-text-main dark:text-white text-lg font-bold">Asset Acquisition</p>
                                </div>
                                <p className="text-text-secondary dark:text-slate-400 text-sm">Understanding co-ownership structures, fractional units, and purchasing processes.</p>
                                <span className="text-primary text-sm font-bold mt-auto pt-2 group-hover:underline">View Articles →</span>
                            </div>
                        </a>
                        <a href="#wallet" className="flex flex-col sm:flex-row gap-4 rounded-xl bg-white dark:bg-slate-800 p-5 shadow-sm border border-slate-200 dark:border-slate-700 hover:shadow-md transition-shadow cursor-pointer group">
                            <div className="flex flex-col gap-2 flex-[3]">
                                <div className="flex items-center gap-2 mb-1">
                                    <Wallet className="text-primary w-5 h-5" />
                                    <p className="text-text-main dark:text-white text-lg font-bold">Wallet & Payments</p>
                                </div>
                                <p className="text-text-secondary dark:text-slate-400 text-sm">Funding your wallet via bank transfer, managing rental income withdrawals.</p>
                                <span className="text-primary text-sm font-bold mt-auto pt-2 group-hover:underline">View Articles →</span>
                            </div>
                        </a>
                        <a href="#legal" className="flex flex-col sm:flex-row gap-4 rounded-xl bg-white dark:bg-slate-800 p-5 shadow-sm border border-slate-200 dark:border-slate-700 hover:shadow-md transition-shadow cursor-pointer group">
                            <div className="flex flex-col gap-2 flex-[3]">
                                <div className="flex items-center gap-2 mb-1">
                                    <FileText className="text-primary w-5 h-5" />
                                    <p className="text-text-main dark:text-white text-lg font-bold">Documents & Deeds</p>
                                </div>
                                <p className="text-text-secondary dark:text-slate-400 text-sm">Accessing your digital deeds, Certificates of Ownership (C of O), and legal records.</p>
                                <span className="text-primary text-sm font-bold mt-auto pt-2 group-hover:underline">View Articles →</span>
                            </div>
                        </a>
                    </div>
                </div>
            </section>

            {/* Content Section */}
            <section id="faq-content" className="px-4 md:px-40 py-12 md:py-20 bg-white dark:bg-slate-900">
                <div className="max-w-[1100px] mx-auto w-full">
                    <div className="flex flex-col md:flex-row gap-12 relative">
                        {/* Sidebar Menu */}
                        <div className="hidden md:block w-64 flex-shrink-0">
                            <div className="sticky top-28 flex flex-col gap-2">
                                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 px-4">Categories</h3>
                                <a href="#verification" className="flex items-center justify-between px-4 py-3 rounded-lg hover:bg-blue-50 dark:hover:bg-slate-800 text-text-secondary hover:text-primary dark:text-slate-400 dark:hover:text-white font-bold border-l-4 border-transparent hover:border-primary transition-all">
                                    <span>Verification</span>
                                </a>
                                <a href="#ownership" className="flex items-center justify-between px-4 py-3 rounded-lg hover:bg-blue-50 dark:hover:bg-slate-800 text-text-secondary hover:text-primary dark:text-slate-400 dark:hover:text-white font-bold border-l-4 border-transparent hover:border-primary transition-all">
                                    <span>Asset Ownership</span>
                                </a>
                                <a href="#wallet" className="flex items-center justify-between px-4 py-3 rounded-lg hover:bg-blue-50 dark:hover:bg-slate-800 text-text-secondary hover:text-primary dark:text-slate-400 dark:hover:text-white font-bold border-l-4 border-transparent hover:border-primary transition-all">
                                    <span>Wallet & Finance</span>
                                </a>
                                <a href="#legal" className="flex items-center justify-between px-4 py-3 rounded-lg hover:bg-blue-50 dark:hover:bg-slate-800 text-text-secondary hover:text-primary dark:text-slate-400 dark:hover:text-white font-bold border-l-4 border-transparent hover:border-primary transition-all">
                                    <span>Legal & Trust</span>
                                </a>
                            </div>
                        </div>

                        {/* Articles */}
                        <div className="flex-1 flex flex-col gap-16">

                            {/* Verification */}
                            <div id="verification" className="scroll-mt-28">
                                <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-100 dark:border-slate-800">
                                    <CheckCircle className="text-3xl text-primary w-8 h-8" />
                                    <h2 className="text-2xl font-bold text-text-main dark:text-white">Account & Verification</h2>
                                </div>
                                <div className="flex flex-col gap-4">
                                    <Details summary="What documents are required for Tier 2 verification?">
                                        To unlock full ownership capabilities on Hermeos, you must provide a valid Government ID (International Passport, NIN Slip, or Driver's License) and a recent utility bill (LAWMA, electricity, or water bill) for address verification, dated within the last 3 months.
                                    </Details>
                                    <Details summary="Why is my BVN required?">
                                        As a compliant property technology platform, we are required by Nigerian financial regulations to perform KYC checks. We use your Bank Verification Number (BVN) strictly to validate your identity and prevent fraud. We do not have access to your bank accounts or funds through this process.
                                    </Details>
                                    <Details summary="Can I register as a corporate entity?">
                                        Yes, Hermeos supports corporate accounts for Limited Liability Companies and Cooperatives. You will need to provide your CAC registration documents (RC Number, Status Report) and valid IDs for at least two directors. Please select "Corporate Account" during sign-up.
                                    </Details>
                                </div>
                            </div>

                            {/* Ownership */}
                            <div id="ownership" className="scroll-mt-28">
                                <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-100 dark:border-slate-800">
                                    <Home className="text-3xl text-primary w-8 h-8" />
                                    <h2 className="text-2xl font-bold text-text-main dark:text-white">Asset Ownership</h2>
                                </div>
                                <div className="flex flex-col gap-4">
                                    <Details summary="How is my co-ownership legally secured?">
                                        When you acquire a fraction of a property, you hold a 'beneficial interest' in the asset trust. This is legally backed by a Deed of Assignment held by our corporate trustees. Your name and ownership percentage are permanently recorded in the digital register, which serves as your proof of ownership.
                                    </Details>
                                    <Details summary="Can I sell my property fractions?">
                                        Absolutely. Hermeos provides a Secondary Marketplace where you can list your ownership fractions for sale to other verified members. Note that a 90-day minimum holding period applies to most assets before they can be listed for resale to ensure market stability.
                                    </Details>
                                    <Details summary="Can I physically inspect the property?">
                                        Yes, transparency is core to our model. We organize quarterly inspection tours for co-owners. You can also view virtual tours and detailed inspection reports on the asset dashboard at any time. Private viewings can be arranged upon request through support.
                                    </Details>
                                </div>
                            </div>

                            {/* Wallet */}
                            <div id="wallet" className="scroll-mt-28">
                                <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-100 dark:border-slate-800">
                                    <Wallet className="text-3xl text-primary w-8 h-8" />
                                    <h2 className="text-2xl font-bold text-text-main dark:text-white">Wallet & Finance</h2>
                                </div>
                                <div className="flex flex-col gap-4">
                                    <Details summary="When do I receive rental income?">
                                        Rental distributions depend on the asset type. For long-term residential leases in Lagos, rent is typically collected annually, and your share is credited to your wallet within 5 business days of collection. For short-let assets, income is distributed quarterly.
                                    </Details>
                                    <Details summary="How do I fund my wallet?">
                                        You can fund your wallet via direct bank transfer to your dedicated NUBAN account number provided on your dashboard, or by using a debit card (Verve, Mastercard, Visa) through our payment processor. Transfers are typically reflected instantly.
                                    </Details>
                                    <Details summary="Are there fees involved?">
                                        Hermeos charges a 1.5% transaction fee on asset acquisition. A standard property management fee (typically 10-15%) is deducted from gross rental income before distribution to cover maintenance, insurance, and facility management services.
                                    </Details>
                                </div>
                            </div>

                            {/* Legal */}
                            <div id="legal" className="scroll-mt-28">
                                <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-100 dark:border-slate-800">
                                    <FileText className="text-3xl text-primary w-8 h-8" />
                                    <h2 className="text-2xl font-bold text-text-main dark:text-white">Legal & Trust</h2>
                                </div>
                                <div className="flex flex-col gap-4">
                                    <Details summary="What happens if Hermeos shuts down?">
                                        Your assets are held in a secure SPV (Special Purpose Vehicle) trust structure, completely separate from Hermeos' operational accounts. This means your property ownership remains legally yours and unaffected, even in the unlikely event that the platform ceases operations.
                                    </Details>
                                    <Details summary="What happens to my assets if I die?">
                                        Your Hermeos portfolio is considered part of your estate. During account creation, you can designate a Next of Kin. In the event of death, your ownership rights can be transferred to your registered beneficiary upon presentation of valid Letters of Administration or Probate.
                                    </Details>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Support Contact Section */}
            <section className="px-4 md:px-40 py-12 bg-background-light dark:bg-background-dark">
                <div className="max-w-[960px] mx-auto w-full">
                    <div className="flex flex-col lg:flex-row gap-8 items-start">
                        {/* Contact Info */}
                        <div className="flex-1 w-full lg:w-auto bg-primary rounded-2xl p-8 text-white shadow-lg relative overflow-hidden">
                            {/* VIP Decoration */}
                            {isVIP && (
                                <div className="absolute top-0 right-0 bg-amber-400 text-primary px-4 py-1.5 rounded-bl-xl font-bold text-xs uppercase tracking-wider flex items-center gap-2">
                                    <span className="material-symbols-outlined text-base">star</span>
                                    Priority Line Active
                                </div>
                            )}

                            <h3 className="text-2xl font-bold mb-6">Still need help?</h3>
                            <p className="mb-8 text-blue-100">Our Lagos-based support team is available Mon-Fri, 8am - 6pm WAT to assist with your inquiries.</p>
                            <div className="flex flex-col gap-6">
                                <div className="flex items-center gap-4">
                                    <div className="size-10 rounded-full bg-white/20 flex items-center justify-center">
                                        <Phone className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <p className="text-xs text-blue-200 font-bold uppercase tracking-wider">Phone Support</p>
                                        <p className="font-bold text-lg">0201 330 6309</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4">
                                    <div className="size-10 rounded-full bg-white/20 flex items-center justify-center">
                                        <MessageCircle className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <p className="text-xs text-blue-200 font-bold uppercase tracking-wider">WhatsApp</p>
                                        <p className="font-bold text-lg">+234 800 HERMEOS</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4">
                                    <div className="size-10 rounded-full bg-white/20 flex items-center justify-center">
                                        <Mail className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <p className="text-xs text-blue-200 font-bold uppercase tracking-wider">Email</p>
                                        <p className="font-bold text-lg">support@hermeos.ng</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4">
                                    <div className="size-10 rounded-full bg-white/20 flex items-center justify-center">
                                        <MapPin className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <p className="text-xs text-blue-200 font-bold uppercase tracking-wider">Office</p>
                                        <p className="font-bold text-base leading-snug">12A Admiralty Way, Lekki Phase 1, Lagos, Nigeria</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Contact Form */}
                        <div className="flex-[1.5] w-full lg:w-auto bg-white dark:bg-slate-800 p-8 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm relative">
                            {error && (
                                <div className="absolute top-0 left-0 w-full bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 px-6 py-3 text-sm font-semibold rounded-t-2xl flex items-center gap-2">
                                    <AlertCircle className="w-4 h-4" />
                                    {error ? (error as any).message || 'Something went wrong.' : 'Error'}
                                </div>
                            )}

                            <h3 className="text-xl font-bold text-text-main dark:text-white mb-6 mt-2">Submit a Request</h3>
                            <form className="flex flex-col gap-5" onSubmit={handleSubmit}>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                                    <label className="flex flex-col gap-1.5">
                                        <span className="text-sm font-bold text-text-main dark:text-slate-200">Full Name</span>
                                        <input
                                            className="w-full p-2.5 rounded-lg border border-slate-300 bg-slate-50 dark:bg-slate-700 dark:border-slate-600 dark:text-white focus:ring-2 focus:ring-primary focus:border-primary outline-none"
                                            placeholder="Enter your full name"
                                            type="text"
                                            value={formData.fullName}
                                            onChange={e => setFormData({ ...formData, fullName: e.target.value })}
                                            disabled={isLoading}
                                        />
                                    </label>
                                    <label className="flex flex-col gap-1.5">
                                        <span className="text-sm font-bold text-text-main dark:text-slate-200">Email Address</span>
                                        <input
                                            className="w-full p-2.5 rounded-lg border border-slate-300 bg-slate-50 dark:bg-slate-700 dark:border-slate-600 dark:text-white focus:ring-2 focus:ring-primary focus:border-primary outline-none"
                                            placeholder="you@example.com"
                                            type="email"
                                            value={formData.email}
                                            onChange={e => setFormData({ ...formData, email: e.target.value })}
                                            disabled={isLoading}
                                        />
                                    </label>
                                </div>
                                <label className="flex flex-col gap-1.5">
                                    <span className="text-sm font-bold text-text-main dark:text-slate-200">Category</span>
                                    <select
                                        className="w-full p-2.5 rounded-lg border border-slate-300 bg-slate-50 dark:bg-slate-700 dark:border-slate-600 dark:text-white focus:ring-2 focus:ring-primary focus:border-primary outline-none"
                                        value={formData.category}
                                        onChange={e => setFormData({ ...formData, category: e.target.value })}
                                        disabled={isLoading}
                                    >
                                        <option>Account Verification</option>
                                        <option>Wallet Funding / Withdrawal</option>
                                        <option>Property Ownership / Deeds</option>
                                        <option>Technical Issue</option>
                                        <option>Other</option>
                                    </select>
                                </label>
                                <label className="flex flex-col gap-1.5">
                                    <span className="text-sm font-bold text-text-main dark:text-slate-200">Asset Reference ID (Optional)</span>
                                    <input
                                        className="w-full p-2.5 rounded-lg border border-slate-300 bg-slate-50 dark:bg-slate-700 dark:border-slate-600 dark:text-white focus:ring-2 focus:ring-primary focus:border-primary outline-none"
                                        placeholder="e.g. #LAG-LKK-002"
                                        type="text"
                                        value={formData.assetRef}
                                        onChange={e => setFormData({ ...formData, assetRef: e.target.value })}
                                        disabled={isLoading}
                                    />
                                </label>
                                <label className="flex flex-col gap-1.5">
                                    <span className="text-sm font-bold text-text-main dark:text-slate-200">Message</span>
                                    <textarea
                                        className="w-full p-2.5 rounded-lg border border-slate-300 bg-slate-50 dark:bg-slate-700 dark:border-slate-600 dark:text-white focus:ring-2 focus:ring-primary focus:border-primary resize-none outline-none"
                                        placeholder="Describe your issue in detail..."
                                        rows={4}
                                        value={formData.message}
                                        onChange={e => setFormData({ ...formData, message: e.target.value })}
                                        disabled={isLoading}
                                    ></textarea>
                                </label>
                                <div className="flex items-center gap-2 mb-2">
                                    <Lock className="text-green-500 w-4 h-4" />
                                    <span className="text-xs text-slate-500 dark:text-slate-400">Your data is transmitted securely via SSL encryption.</span>
                                </div>
                                <button
                                    className={`w-full bg-primary hover:bg-primary-dark text-white font-bold py-3 rounded-lg transition-colors shadow-sm flex items-center justify-center gap-2 ${isLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
                                    type="submit"
                                    disabled={isLoading}
                                >
                                    {isLoading ? 'Submitting...' : 'Submit Ticket'}
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

// Helper component for Details/Summary
const Details: React.FC<{ summary: string; children: React.ReactNode }> = ({ summary, children }) => (
    <details className="group bg-background-light dark:bg-slate-800 rounded-lg overflow-hidden border border-slate-200 dark:border-slate-700">
        <summary className="flex justify-between items-center font-bold cursor-pointer list-none p-5 text-text-main dark:text-white hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors">
            <span>{summary}</span>
            <span className="transition-transform duration-300 group-open:rotate-180">
                <ChevronDown className="w-5 h-5" />
            </span>
        </summary>
        <div className="text-text-secondary dark:text-slate-300 p-5 pt-0 leading-relaxed text-sm animate-sweep">
            {children}
        </div>
    </details>
);

export default SupportHubPage;

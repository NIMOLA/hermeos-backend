import React from 'react';
import { Link } from 'react-router-dom';

const PrivacyPage: React.FC = () => {
    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
            <div className="sm:mx-auto sm:w-full sm:max-w-4xl">
                <div className="bg-white dark:bg-slate-800 py-8 px-4 shadow sm:rounded-lg sm:px-10">
                    <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-6">Privacy Policy (NDPA Compliance)</h1>
                    <p className="text-sm text-slate-500 mb-6">Effective Date: January 14, 2026</p>

                    <div className="prose dark:prose-invert max-w-none text-slate-600 dark:text-slate-300">

                        <h2 className="text-xl font-semibold mt-6 mb-4">2.1 Introduction</h2>
                        <p>Welcome to Hermeos Proptech. This Privacy Policy governs your use of the Hermeos platform. It is important to understand that Hermeos Proptech acts as the Technical Partner and Portfolio Manager for the Manymiles Cooperative Multipurpose Society. While you interact with our technology, your Contributions and Portfolio Allocations are legally domiciled within the Cooperative structure.</p>

                        <h2 className="text-xl font-semibold mt-6 mb-4">2.2 Information We Collect</h2>
                        <p>To manage your membership and portfolio, we collect:</p>
                        <ul className="list-disc pl-5 space-y-2">
                            <li><strong>Identity Data:</strong> Name, DOB, BVN, Government ID (for KYC/AML).</li>
                            <li><strong>Contact Data:</strong> Email, Phone, Address.</li>
                            <li><strong>Financial Data:</strong> Bank account details (for payouts) and transaction history.</li>
                            <li><strong>Usage Data:</strong> IP address and device info.</li>
                        </ul>

                        <h2 className="text-xl font-semibold mt-6 mb-4">2.3 How We Use Your Data</h2>
                        <p>We process data to:</p>
                        <ul className="list-disc pl-5 space-y-2">
                            <li>Allocate real estate slots (Iré Portfolio) and issue digital certificates.</li>
                            <li>Register you as a member of Manymiles Cooperative Multipurpose Society.</li>
                            <li>Calculate and distribute Patronage Refunds (Surplus).</li>
                            <li>Comply with Lagos State Cooperative reporting requirements.</li>
                        </ul>

                        <h2 className="text-xl font-semibold mt-6 mb-4">2.4 Data Sharing (Platform to Issuer)</h2>
                        <p>By using Hermeos, you authorize Manymiles Consolidated Elite Services to transfer your KYC and Financial Data to Manymiles Cooperative Multipurpose Society. This is strictly necessary to perfect your legal title to the beneficial interest in the assets.</p>

                        <h2 className="text-xl font-semibold mt-6 mb-4">2.5 Your Rights</h2>
                        <p>Under the NDPA 2023, you have the right to access your data, request corrections, or request erasure (subject to statutory financial retention laws).</p>

                        <h2 className="text-xl font-semibold mt-6 mb-4">2.6 Contact Us</h2>
                        <p>For privacy inquiries, contact the Compliance Team at: <a href="mailto:compliance@hermeos.com" className="text-primary hover:underline">compliance@hermeos.com</a>.</p>

                    </div>
                    <div className="mt-8 pt-6 border-t border-slate-200 dark:border-slate-700">
                        <Link to="/" className="text-primary hover:text-primary-dark font-medium">
                            &larr; Back to Home
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PrivacyPage;

import React from 'react';
import { Link } from 'react-router-dom';

const PrivacyPage: React.FC = () => {
    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
            <div className="sm:mx-auto sm:w-full sm:max-w-4xl">
                <div className="bg-white dark:bg-slate-800 py-8 px-4 shadow sm:rounded-lg sm:px-10">
                    <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-6">Privacy Policy</h1>
                    <div className="prose dark:prose-invert max-w-none text-slate-600 dark:text-slate-300">
                        <p>Your privacy is important to us.</p>
                        <p>This Privacy Policy explains how Hermeos PropTech collects, uses, and protects your personal information.</p>

                        <h2 className="text-xl font-semibold mt-6 mb-4">1. Information We Collect</h2>
                        <p>We collect information you provide directly to us, such as when you create an account, update your profile, or make an investment.</p>

                        <h2 className="text-xl font-semibold mt-6 mb-4">2. How We Use Your Information</h2>
                        <p>We use the information we collect to provide, maintain, and improve our services, to process your transactions, and to communicate with you.</p>

                        <h2 className="text-xl font-semibold mt-6 mb-4">3. Data Security</h2>
                        <p>We take reasonable measures to help protect information about you from loss, theft, misuse and unauthorized access, disclosure, alteration and destruction.</p>
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

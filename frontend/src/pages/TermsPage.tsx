import React from 'react';
import { Link } from 'react-router-dom';

const TermsPage: React.FC = () => {
    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
            <div className="sm:mx-auto sm:w-full sm:max-w-4xl">
                <div className="bg-white dark:bg-slate-800 py-8 px-4 shadow sm:rounded-lg sm:px-10">
                    <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-6">Terms of Service</h1>
                    <div className="prose dark:prose-invert max-w-none text-slate-600 dark:text-slate-300">
                        <p>Welcome to Hermeos PropTech.</p>
                        <p>By accessing or using our platform, you agree to be bound by these Terms of Service.</p>

                        <h2 className="text-xl font-semibold mt-6 mb-4">1. Acceptance of Terms</h2>
                        <p>By accessing or using the Service you agree to be bound by these Terms. If you disagree with any part of the terms then you may not access the Service.</p>

                        <h2 className="text-xl font-semibold mt-6 mb-4">2. Accounts</h2>
                        <p>When you create an account with us, you must provide us information that is accurate, complete, and current at all times. Failure to do so constitutes a breach of the Terms, which may result in immediate termination of your account on our Service.</p>

                        <h2 className="text-xl font-semibold mt-6 mb-4">3. Investment Risks</h2>
                        <p>Real estate investments carry risks. You acknowledge that past performance is not indicative of future results.</p>
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

export default TermsPage;

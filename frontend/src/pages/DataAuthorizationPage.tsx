import React, { useState } from 'react';
import { Button } from '../../components/ui/button';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const DataAuthorizationPage: React.FC = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [accepted, setAccepted] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleAccept = async () => {
        setIsSubmitting(true);
        // In a real app, we would send this consent to the backend to log it.
        // For now, we simulate a delay and redirect.
        await new Promise(resolve => setTimeout(resolve, 1000));

        // Redirect to dashboard or next step
        navigate('/dashboard');
    };

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
            <div className="sm:mx-auto sm:w-full sm:max-w-2xl">
                <div className="bg-white dark:bg-slate-800 py-8 px-8 shadow-lg sm:rounded-xl border border-slate-200 dark:border-slate-700">
                    <div className="flex flex-col items-center mb-8">
                        <span className="material-symbols-outlined text-4xl text-primary mb-4">policy</span>
                        <h1 className="text-2xl font-bold text-slate-900 dark:text-white text-center">Data Sharing & Funds Authorization</h1>
                        <p className="text-slate-500 text-center mt-2">Please review and accept to proceed.</p>
                    </div>

                    <div className="border bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-700 rounded-lg p-6 mb-8 text-sm text-slate-700 dark:text-slate-300 space-y-4">
                        <p className="font-bold">I, THE CO-OPERATOR, HEREBY AUTHORIZE:</p>

                        <div className="flex gap-3">
                            <span className="material-symbols-outlined text-slate-400 shrink-0">payments</span>
                            <p><strong>FUNDS TRANSFER:</strong> I appoint Hermeos Proptech as my Limited Collection Agent to receive my Contribution and remit it to the Manymiles Cooperative Multipurpose Society. I agree that payment to Hermeos constitutes a valid discharge of my debt to the Cooperative.</p>
                        </div>

                        <div className="flex gap-3">
                            <span className="material-symbols-outlined text-slate-400 shrink-0">security</span>
                            <p><strong>DATA TRANSFER:</strong> I explicitly consent to the transfer of my Personal Data (Name, BVN, NIN, Bank Details) from Hermeos Proptech to the Cooperative for the purpose of membership registration, slot certification, and surplus distribution.</p>
                        </div>

                        <div className="flex gap-3">
                            <span className="material-symbols-outlined text-slate-400 shrink-0">gavel</span>
                            <p><strong>SOURCE OF FUNDS:</strong> I declare that my funds are from legitimate sources and authorize Hermeos to report suspicious transactions to the EFCC.</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-3 mb-8 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800 rounded-lg">
                        <input
                            type="checkbox"
                            id="accept-terms"
                            className="w-5 h-5 text-primary border-slate-300 rounded focus:ring-primary cursor-pointer"
                            checked={accepted}
                            onChange={(e) => setAccepted(e.target.checked)}
                        />
                        <label htmlFor="accept-terms" className="text-sm font-medium text-slate-700 dark:text-slate-200 cursor-pointer select-none">
                            I have read and fully accept the Data Sharing & Funds Authorization Agreement.
                        </label>
                    </div>

                    <Button
                        onClick={handleAccept}
                        disabled={!accepted || isSubmitting}
                        className="w-full py-4 text-base"
                    >
                        {isSubmitting ? 'Processing...' : 'Accept & Continue'}
                    </Button>

                    <div className="mt-6 text-center">
                        <Link to="/" className="text-sm text-slate-500 hover:text-primary">Cancel and Return Home</Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DataAuthorizationPage;


import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../../components/ui/button';
import { useApi } from '../../hooks/useApi';
import { useAuth } from '../../contexts/AuthContext';
import { apiClient } from '../../lib/api-client';

export default function KYCStatusPage() {
    const { user, refreshUser } = useAuth();
    // API Hooks
    const { data: kycData, isLoading, refetch } = useApi<any>('/kyc/status', 'GET', null, { immediate: true });

    // Document State
    const [documents, setDocuments] = useState({ id: false, address: false });
    const [docUrls, setDocUrls] = useState({ idUrl: '', addressUrl: '' });
    const [uploading, setUploading] = useState({ id: false, address: false });

    // Bank Verification State
    const [banks, setBanks] = useState<any[]>([]);
    const [bankForm, setBankForm] = useState({ bankCode: '', accountNumber: '' });
    const [resolvedAccountName, setResolvedAccountName] = useState('');
    const [isVerifyingBank, setIsVerifyingBank] = useState(false);
    const [bankVerified, setBankVerified] = useState(false);

    // File Inputs
    const idInputRef = useRef<HTMLInputElement>(null);
    const addressInputRef = useRef<HTMLInputElement>(null);

    const updateDocsMutation = useApi('/kyc/documents', 'PATCH');

    // Fetch Banks on Mount
    useEffect(() => {
        const fetchBanks = async () => {
            try {
                const response = await apiClient.get<any[]>('/bank');
                if (Array.isArray(response)) { // Adjust based on API structure (might be wrapped in data)
                    setBanks(response);
                } else if ((response as any).data) { // Handle wrapped response
                    setBanks((response as any).data);
                }
            } catch (err) {
                console.error('Failed to fetch banks', err);
            }
        };
        fetchBanks();
    }, []);

    // Effect to sync document state only
    useEffect(() => {
        if (kycData) {
            setDocuments(prev => {
                if (prev.id === !!kycData.idDocument && prev.address === !!kycData.proofOfAddress) return prev;
                return {
                    id: !!kycData.idDocument,
                    address: !!kycData.proofOfAddress
                };
            });

            // Also sync URLs if available (optional, depending on API response structure)
            if (kycData.idDocument) setDocUrls(prev => ({ ...prev, idUrl: kycData.idDocument }));
            if (kycData.proofOfAddress) setDocUrls(prev => ({ ...prev, addressUrl: kycData.proofOfAddress }));

            // Check if user has verified bank (need to add this field to kycData or user model)
            // For now, assume if they have an active bank account (we'd need to fetch accounts), it's done.
            // But for simplicity, we let them add/verify again.
        }
    }, [kycData]);

    // Helper to map backend status to UI
    const getStatus = () => {
        if (!kycData) return 'pending';
        const s = kycData.status.toLowerCase();
        if (s === 'verified' || s === 'approved') return 'verified';
        if (s === 'pending' || s === 'submitted') return 'review';
        if (s === 'rejected') return 'rejected';
        return 'pending';
    };

    const status = getStatus();

    const triggerUpload = (type: 'id' | 'address') => {
        if (type === 'id') idInputRef.current?.click();
        else addressInputRef.current?.click();
    };

    const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>, type: 'id' | 'address') => {
        const file = event.target.files?.[0];
        if (!file) return;

        setUploading(prev => ({ ...prev, [type]: true }));

        try {
            const formData = new FormData();
            formData.append('file', file);

            const response = await apiClient.upload<{ url: string }>('/upload', formData);

            setDocUrls(prev => ({ ...prev, [`${type}Url`]: response.url }));
            setDocuments(prev => ({ ...prev, [type]: true }));
        } catch (error) {
            console.error('Upload failed', error);
            alert('Failed to upload document. Please try again.');
        } finally {
            setUploading(prev => ({ ...prev, [type]: false }));
            // Reset input
            event.target.value = '';
        }
    };

    const handleVerifyBank = async () => {
        if (!bankForm.accountNumber || !bankForm.bankCode) {
            alert('Please select a bank and enter account number');
            return;
        }

        setIsVerifyingBank(true);
        try {
            const selectedBank = banks.find(b => b.code === bankForm.bankCode);
            const response = await apiClient.post<{ accountName: string }>('/bank/verify', {
                accountNumber: bankForm.accountNumber,
                bankCode: bankForm.bankCode,
                bankName: selectedBank?.name
            });

            // Assuming success returns accountName
            // Or response.data.accountName if wrapped
            const accName = (response as any).accountName || (response as any).data?.accountName;

            setResolvedAccountName(accName);
            setBankVerified(true);
            alert(`Bank Verified: ${accName}`);

        } catch (error: any) {
            console.error('Bank verification failed', error);
            alert(error.message || 'Bank verification failed. Please check details or ensure name matches profile.');
            setBankVerified(false);
            setResolvedAccountName('');
        } finally {
            setIsVerifyingBank(false);
        }
    };

    const handleSubmitForReview = async () => {
        try {
            if (!bankVerified && !kycData?.bvn) { // Simple check, ideally force bank verification
                // Optional: Ask user if they want to proceed without bank? 
                // But requirements say we MUST verify name with bank.
                if (!bankVerified) {
                    alert('Please verify your bank account first to match your identity.');
                    return;
                }
            }

            // 1. Submit KYC Data
            // We use the bank verification as "ID Type" proxy if needed, or stick to uploads.
            // The existing backend expects idType, idNumber, bvn.
            // We'll pass the bank details if API supports, but the bank/verify endpoint SAVED it already.

            await apiClient.post('/kyc/submit', {
                idType: 'PASSPORT', // Hardcoded as placeholder or add UI selector
                idNumber: 'A00000000',
                bvn: '22222222222'
            });

            // 2. Update Documents (Real URLs)
            await apiClient.patch('/kyc/documents', {
                idDocumentUrl: docUrls.idUrl,
                proofOfAddressUrl: docUrls.addressUrl
            });

            // 3. Refresh
            await refetch();
            refreshUser();

            // Force document state update just in case
            updateDocsMutation.refetch();
        } catch (error) {
            console.error(error);
            alert('Failed to submit verification. Please try again.');
        }
    };

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center p-6 bg-slate-50 dark:bg-background-dark">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-slate-50 dark:bg-background-dark">
            <div className="max-w-3xl w-full">
                <div className="flex items-center justify-between mb-8">
                    <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Verification Status</h1>
                    <Link to={user?.role === 'ADMIN' || user?.role === 'SUPER_ADMIN' ? '/admin' : '/dashboard'}>
                        <Button variant="outline" className="text-xs">Skip to Dashboard</Button>
                    </Link>
                </div>

                <div className="bg-white dark:bg-[#1a2632] rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
                    <div className="p-8 border-b border-slate-200 dark:border-slate-800 text-center">
                        <div className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-bold mb-4 ${status === 'pending' ? 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400' :
                            status === 'review' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' :
                                status === 'verified' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400' :
                                    'bg-red-100 text-red-700'
                            }`}>
                            <span className="material-symbols-outlined text-lg">
                                {status === 'pending' ? 'pending' : status === 'review' ? 'hourglass_top' : status === 'verified' ? 'verified' : 'error'}
                            </span>
                            {status === 'pending' ? 'Action Required' : status === 'review' ? 'Under Review' : status === 'verified' ? 'Verified' : 'Rejected'}
                        </div>
                        <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
                            {status === 'pending' ? 'Please upload your documents' :
                                status === 'review' ? 'We are checking your details' :
                                    status === 'verified' ? 'You are fully verified!' : 'Verification Failed'}
                        </h2>
                        <p className="text-slate-500 dark:text-slate-400 max-w-md mx-auto">
                            {status === 'pending' ? 'Complete the steps below to unlock full platform access.' :
                                status === 'review' ? 'This usually takes 24-48 hours. You will receive an email once complete.' :
                                    status === 'verified' ? 'Thank you for completing the KYC process. You can now acquire property equity freely.' :
                                        'Please contact support for assistance.'}
                        </p>
                    </div>

                    <div className="p-8">
                        {status === 'pending' && (
                            <div className="space-y-6">
                                {/* Hidden Inputs */}
                                <input
                                    type="file"
                                    ref={idInputRef}
                                    className="hidden"
                                    accept="image/*,.pdf"
                                    onChange={(e) => handleFileChange(e, 'id')}
                                    title="Upload Government ID"
                                    aria-label="Upload Government ID"
                                />
                                <input
                                    type="file"
                                    ref={addressInputRef}
                                    className="hidden"
                                    accept="image/*,.pdf"
                                    onChange={(e) => handleFileChange(e, 'address')}
                                    title="Upload Proof of Address"
                                    aria-label="Upload Proof of Address"
                                />

                                {/* Document Item 1 */}
                                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700">
                                    <div className="flex items-center gap-4">
                                        <div className="bg-white dark:bg-[#1a2632] p-3 rounded-lg border border-slate-200 dark:border-slate-700">
                                            <span className="material-symbols-outlined text-slate-600 dark:text-slate-300">badge</span>
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-slate-900 dark:text-white">Government ID</h3>
                                            <p className="text-xs text-slate-500">Passport, Driver's License, or NIN</p>
                                        </div>
                                    </div>
                                    {documents.id ? (
                                        <div className="flex items-center gap-2">
                                            <span className="text-emerald-500 font-bold flex items-center gap-1 text-sm"><span className="material-symbols-outlined">check</span> Uploaded</span>
                                            <Button size="sm" variant="ghost" className="text-xs h-6 px-2" onClick={() => triggerUpload('id')}>Change</Button>
                                        </div>
                                    ) : (
                                        <Button size="sm" onClick={() => triggerUpload('id')} disabled={uploading.id}>
                                            {uploading.id ? (
                                                <span className="flex items-center gap-2"><div className="w-3 h-3 border-2 border-white/50 border-t-white rounded-full animate-spin" /> Uploading...</span>
                                            ) : (
                                                <span className="flex items-center"><span className="material-symbols-outlined mr-2 text-lg">upload</span> Upload</span>
                                            )}
                                        </Button>
                                    )}
                                </div>

                                {/* Document Item 2 */}
                                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700">
                                    <div className="flex items-center gap-4">
                                        <div className="bg-white dark:bg-[#1a2632] p-3 rounded-lg border border-slate-200 dark:border-slate-700">
                                            <span className="material-symbols-outlined text-slate-600 dark:text-slate-300">receipt_long</span>
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-slate-900 dark:text-white">Proof of Address</h3>
                                            <p className="text-xs text-slate-500">Utility Bill or Bank Statement</p>
                                        </div>
                                    </div>
                                    {documents.address ? (
                                        <div className="flex items-center gap-2">
                                            <span className="text-emerald-500 font-bold flex items-center gap-1 text-sm"><span className="material-symbols-outlined">check</span> Uploaded</span>
                                            <Button size="sm" variant="ghost" className="text-xs h-6 px-2" onClick={() => triggerUpload('address')}>Change</Button>
                                        </div>
                                    ) : (
                                        <Button size="sm" variant="outline" onClick={() => triggerUpload('address')} disabled={uploading.address}>
                                            {uploading.address ? (
                                                <span className="flex items-center gap-2"><div className="w-3 h-3 border-2 border-slate-500/50 border-t-slate-500 rounded-full animate-spin" /> Uploading...</span>
                                            ) : (
                                                <span className="flex items-center"><span className="material-symbols-outlined mr-2 text-lg">upload</span> Upload</span>
                                            )}
                                        </Button>
                                    )}
                                </div>

                                {/* Bank Verification Section */}
                                <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700">
                                    <div className="flex items-center gap-4 mb-4">
                                        <div className="bg-white dark:bg-[#1a2632] p-3 rounded-lg border border-slate-200 dark:border-slate-700">
                                            <span className="material-symbols-outlined text-slate-600 dark:text-slate-300">account_balance</span>
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-slate-900 dark:text-white">Bank Verification</h3>
                                            <p className="text-xs text-slate-500">Verify your identity with your bank account</p>
                                        </div>
                                    </div>

                                    <div className="space-y-4">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div>
                                                <label htmlFor="bankSelect" className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">Select Bank</label>
                                                <select
                                                    id="bankSelect"
                                                    className="w-full h-10 px-3 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-[#1a2632] text-sm"
                                                    value={bankForm.bankCode}
                                                    onChange={(e) => setBankForm(prev => ({ ...prev, bankCode: e.target.value }))}
                                                >
                                                    <option value="">Select a bank</option>
                                                    {banks.map((bank: any) => (
                                                        <option key={bank.id || bank.code} value={bank.code}>{bank.name}</option>
                                                    ))}
                                                </select>
                                            </div>
                                            <div>
                                                <label htmlFor="accountNumber" className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">Account Number</label>
                                                <input
                                                    id="accountNumber"
                                                    type="text"
                                                    className="w-full h-10 px-3 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-[#1a2632] text-sm"
                                                    placeholder="1234567890"
                                                    value={bankForm.accountNumber}
                                                    onChange={(e) => setBankForm(prev => ({ ...prev, accountNumber: e.target.value }))}
                                                    maxLength={10}
                                                />
                                            </div>
                                        </div>

                                        {resolvedAccountName && (
                                            <div className="p-3 bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 rounded-lg">
                                                <p className="text-sm text-emerald-700 dark:text-emerald-400 font-medium flex items-center gap-2">
                                                    <span className="material-symbols-outlined text-lg">check_circle</span>
                                                    Verified Name: {resolvedAccountName}
                                                </p>
                                            </div>
                                        )}

                                        <div className="flex justify-end">
                                            <Button
                                                size="sm"
                                                variant={bankVerified ? "outline" : "default"}
                                                onClick={handleVerifyBank}
                                                disabled={isVerifyingBank || !bankForm.accountNumber || !bankForm.bankCode}
                                            >
                                                {isVerifyingBank ? 'Verifying...' : bankVerified ? 'Re-verify' : 'Verify Account'}
                                            </Button>
                                        </div>
                                    </div>
                                </div>

                                <div className="pt-4 flex justify-end">
                                    <Button
                                        disabled={!documents.id || !documents.address}
                                        onClick={handleSubmitForReview}
                                        className="w-full sm:w-auto"
                                    >
                                        Submit for Verification
                                    </Button>
                                </div>
                            </div>
                        )}

                        {(status === 'review' || status === 'verified') && (
                            <div className="text-center py-4">
                                <span className="text-emerald-500 font-bold flex items-center justify-center gap-2">
                                    <span className="material-symbols-outlined">check_circle</span>
                                    Documents Submitted
                                </span>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

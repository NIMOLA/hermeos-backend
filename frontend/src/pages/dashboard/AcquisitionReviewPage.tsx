import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Button } from '../../components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/card';
import { useAuth } from '../../contexts/AuthContext';
import { useFetch } from '../../hooks/useApi';
import { apiClient } from '../../lib/api-client';
import { CheckoutConsent } from '../../components/payment/CheckoutConsent';
import { getImageUrl } from '../../utils/imageUtils';

// Reusing Property interface or defining a subset
interface Property {
    id: string;
    name: string;
    location: string;
    pricePerUnit: number; // Assuming this exists or using totalValuation/units
    projectedYield: number;
    images: string[];
    // ...
}

interface BankDetails {
    bankName: string;
    accountName: string;
    accountNumber: string;
}

export default function AcquisitionReviewPage() {
    const { user } = useAuth();
    const { id } = useParams<{ id: string }>();
    const { data: property, isLoading, error } = useFetch<Property>(id ? `/properties/${id}` : '');
    const [agreedToTerms, setAgreedToTerms] = useState(false);

    // Simple state for quantity (could be expanded)
    const quantity = 10; // Default for now, or derive from query param?
    const unitPrice = property?.pricePerUnit || 50000; // Fallback
    const transactionFee = unitPrice * quantity * 0.015;
    const totalAmount = (unitPrice * quantity) + transactionFee;

    // State for payment processing
    const [isProcessing, setIsProcessing] = useState(false);
    const [paymentMethod, setPaymentMethod] = useState<'card' | 'bank'>('card');

    // Bank Transfer State
    const [showUploadModal, setShowUploadModal] = useState(false);
    const [bankDetails, setBankDetails] = useState<BankDetails | null>(null);
    const [receiptFile, setReceiptFile] = useState<File | null>(null);
    const [depositorName, setDepositorName] = useState('');
    const [transferDate, setTransferDate] = useState(new Date().toISOString().split('T')[0]);

    // Fetch bank details on mount or when method changes
    const fetchBankDetails = async () => {
        try {
            const res = await apiClient.get<{ success: boolean, data: BankDetails }>('/bank/details');
            if (res.data) setBankDetails(res.data);
        } catch (err) {
            console.error("Failed to fetch bank details", err);
            // Fallback
            setBankDetails({
                bankName: 'Premium Trust Bank',
                accountName: 'Hermeos Proptech',
                accountNumber: '0040225641'
            });
        }
    };

    if (paymentMethod === 'bank' && !bankDetails) {
        fetchBankDetails();
    }

    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setReceiptFile(e.target.files[0]);
        }
    };

    const handleBankTransferSubmit = async () => {
        if (!receiptFile || !depositorName) {
            alert("Please provide depositor name and upload receipt.");
            return;
        }
        setIsProcessing(true);
        try {
            // 1. Upload Receipt
            const formData = new FormData();
            formData.append('file', receiptFile);
            const uploadRes = await apiClient.upload<{ url: string }>('/upload', formData);

            // 2. Submit Proof
            await apiClient.post('/payments/bank-transfer/submit-proof', {
                propertyId: property!.id,
                units: quantity,
                amount: totalAmount,
                depositorName,
                transferDate,
                receiptUrl: uploadRes.url
            });

            alert("Payment proof submitted! Pending admin confirmation.");
            setShowUploadModal(false);
            // Redirect or show success state
            window.location.href = '/dashboard';

        } catch (err) {
            alert((err as Error).message || "Failed to submit proof");
        } finally {
            setIsProcessing(false);
        }
    };

    const handlePayment = async () => {
        if (!property) return;

        if (paymentMethod === 'bank') {
            setShowUploadModal(true);
            return;
        }

        setIsProcessing(true);
        try {
            // Wallet/Card flow
            const endpoint = '/payments/card/initialize'; // Corrected route
            const response = await apiClient.post<{ authorizationUrl: string; reference: string }>(endpoint, {
                propertyId: property.id,
                units: quantity,
                amount: totalAmount
            });

            // Open Paystack in a new tab
            if (response.authorizationUrl) {
                window.open(response.authorizationUrl, '_blank');
                // Optional: Show a message in the current tab explaining what to do next
                alert('Payment page opened in a new tab. Please complete the payment there.');
            } else {
                alert('Payment initialization failed: No authorization URL returned.');
            }
        } catch (err) {
            alert((err as Error).message || 'Failed to initialize payment');
        } finally {
            setIsProcessing(false);
        }
    };

    if (isLoading) return <div className="p-8 text-center">Loading review details...</div>;
    if (error || !property) return <div className="p-8 text-center text-red-500">Error loading property</div>;

    return (
        <div className="max-w-4xl mx-auto p-6 space-y-8">
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-6">Review Acquisition</h1>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="md:col-span-2 space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Asset Details</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex gap-4">
                                <div className="size-24 rounded-lg overflow-hidden bg-slate-200">
                                    <img
                                        src={getImageUrl(property.images?.[0])}
                                        alt={property.name}
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                                <div>
                                    <h3 className="font-bold text-lg text-slate-900 dark:text-white">{property.name}</h3>
                                    <p className="text-slate-500 text-sm">Residential • {property.location}</p>
                                    <div className="flex items-center gap-2 mt-2">
                                        <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 text-xs rounded-full font-bold">{property.projectedYield}% Net Yield</span>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Transaction Summary</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            <div className="flex justify-between text-sm">
                                <span className="text-slate-600 dark:text-slate-400">Unit Price</span>
                                <span className="font-medium text-slate-900 dark:text-white">₦{unitPrice.toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-slate-600 dark:text-slate-400">Quantity</span>
                                <span className="font-medium text-slate-900 dark:text-white">{quantity} Units</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-slate-600 dark:text-slate-400">Transaction Fee (1.5%)</span>
                                <span className="font-medium text-slate-900 dark:text-white">₦{transactionFee.toLocaleString()}</span>
                            </div>
                            <div className="border-t border-slate-200 dark:border-slate-700 my-2"></div>
                            <div className="flex justify-between text-lg font-bold">
                                <span className="text-slate-900 dark:text-white">Total Amount</span>
                                <span className="text-primary">₦{totalAmount.toLocaleString()}</span>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Consent Checkbox */}
                    <CheckoutConsent checked={agreedToTerms} onCheckedChange={setAgreedToTerms} />
                </div>

                <div className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Payment Method</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div
                                onClick={() => setPaymentMethod('card')}
                                className={`flex items-center gap-3 p-3 border rounded-lg cursor-pointer transition-all ${paymentMethod === 'card' ? 'border-primary bg-blue-50 dark:bg-blue-900/20 ring-1 ring-primary' : 'border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800'}`}
                            >
                                <span className="material-symbols-outlined text-primary">credit_card</span>
                                <div>
                                    <p className="text-sm font-bold text-slate-900 dark:text-white">Debit/Credit Card</p>
                                    <p className="text-xs text-slate-500">Secured by Paystack</p>
                                </div>
                                {paymentMethod === 'card' && <div className="ml-auto text-primary"><span className="material-symbols-outlined">check_circle</span></div>}
                            </div>

                            <div
                                onClick={() => setPaymentMethod('bank')}
                                className={`flex items-center gap-3 p-3 border rounded-lg cursor-pointer transition-all ${paymentMethod === 'bank' ? 'border-primary bg-blue-50 dark:bg-blue-900/20 ring-1 ring-primary' : 'border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800'}`}
                            >
                                <span className="material-symbols-outlined text-slate-500">account_balance</span>
                                <div>
                                    <p className="text-sm font-bold text-slate-900 dark:text-white">Bank Transfer</p>
                                    <p className="text-xs text-slate-500">Direct deposit</p>
                                </div>
                                {paymentMethod === 'bank' && <div className="ml-auto text-primary"><span className="material-symbols-outlined">check_circle</span></div>}
                            </div>
                        </CardContent>
                    </Card>

                    {paymentMethod === 'bank' && bankDetails && (
                        <Card className="bg-slate-50 dark:bg-slate-800 border-dashed">
                            <CardContent className="pt-6 space-y-2">
                                <h3 className="font-bold text-center text-slate-700 dark:text-slate-300">Make Transfer To:</h3>
                                <div className="text-center space-y-1">
                                    <p className="text-2xl font-mono font-bold text-slate-900 dark:text-white copy-text">{bankDetails.accountNumber}</p>
                                    <p className="font-medium">{bankDetails.bankName}</p>
                                    <p className="text-sm text-slate-500">{bankDetails.accountName}</p>
                                </div>
                                <div className="pt-2 text-center text-xs text-amber-600">
                                    Use your name as ref/remark.
                                </div>
                            </CardContent>
                        </Card>
                    )}

                    <div className="flex flex-col gap-3">
                        {user?.isVerified ? (
                            <Button
                                className="w-full h-12 text-lg shadow-lg"
                                disabled={!agreedToTerms || isProcessing}
                                onClick={handlePayment}
                            >
                                {isProcessing ? (
                                    <span className="flex items-center gap-2">
                                        <span className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></span>
                                        Processing...
                                    </span>
                                ) : (paymentMethod === 'bank' ? 'I have made payment' : 'Confirm Purchase')}
                            </Button>
                        ) : (
                            <Link to="/kyc/info">
                                <Button className="w-full h-12 text-lg shadow-lg bg-amber-500 hover:bg-amber-600">
                                    <span className="material-symbols-outlined mr-2">verified_user</span>
                                    Verify Identity to Invest
                                </Button>
                            </Link>
                        )}
                        <Link to={`/properties/${property.id}`}>
                            <Button variant="outline" className="w-full">Cancel</Button>
                        </Link>
                        <p className="text-xs text-center text-slate-500 mt-2">
                            Identity verification is required to complete this participation under regulatory guidelines.
                        </p>
                    </div>
                </div>
            </div>

            {/* Upload Modal */}
            {showUploadModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <Card className="max-w-md w-full animate-in fade-in zoom-in duration-300">
                        <CardHeader>
                            <CardTitle>Submit Payment Proof</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div>
                                <label htmlFor="depositorName" className="block text-sm font-medium mb-1">Depositor Name</label>
                                <input
                                    id="depositorName"
                                    className="w-full p-2 border rounded bg-transparent"
                                    placeholder="Name on bank account"
                                    value={depositorName}
                                    onChange={e => setDepositorName(e.target.value)}
                                />
                            </div>
                            <div>
                                <label htmlFor="transferDate" className="block text-sm font-medium mb-1">Transfer Date</label>
                                <input
                                    id="transferDate"
                                    type="date"
                                    className="w-full p-2 border rounded bg-transparent"
                                    value={transferDate}
                                    onChange={e => setTransferDate(e.target.value)}
                                />
                            </div>
                            <div>
                                <label htmlFor="receiptFile" className="block text-sm font-medium mb-1">Receipt Image</label>
                                <input
                                    id="receiptFile"
                                    type="file"
                                    accept="image/*"
                                    className="w-full p-2 border rounded"
                                    onChange={handleFileUpload}
                                />
                            </div>
                            <div className="flex gap-3 pt-2">
                                <Button variant="outline" className="flex-1" onClick={() => setShowUploadModal(false)}>Cancel</Button>
                                <Button
                                    className="flex-1"
                                    disabled={!receiptFile || !depositorName || isProcessing}
                                    onClick={handleBankTransferSubmit}
                                >
                                    {isProcessing ? 'Uploading...' : 'Submit Proof'}
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            )}
        </div>
    );
}

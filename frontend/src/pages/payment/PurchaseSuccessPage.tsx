
import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { apiClient } from '../../lib/api-client';
import { Button } from '../../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { getImageUrl } from '../../utils/imageUtils';

interface ReceiptData {
    id: string;
    reference: string;
    amount: number;
    units: number;
    status: string;
    date: string;
    property: {
        id: string;
        name: string;
        location: string;
        images: string[];
    };
    paymentMethod: string;
}

export default function PurchaseSuccessPage() {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const reference = searchParams.get('reference');
    const [receipt, setReceipt] = useState<ReceiptData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        if (!reference) {
            setError('No transaction reference provided.');
            setLoading(false);
            return;
        }

        const fetchReceipt = async () => {
            try {
                const response = await apiClient.get<{ data: ReceiptData }>(`/payments/receipt/${reference}`);
                setReceipt(response.data);
            } catch (err) {
                console.error('Failed to fetch receipt:', err);
                setError('Could not retrieve transaction details.');
            } finally {
                setLoading(false);
            }
        };

        fetchReceipt();
    }, [reference]);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-900">
                <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    if (error || !receipt) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-900 p-4">
                <Card className="max-w-md w-full text-center p-6">
                    <div className="w-16 h-16 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
                        <span className="material-symbols-outlined text-red-600 text-3xl">error</span>
                    </div>
                    <p className="text-slate-600 dark:text-slate-300 mb-6">{error || 'Receipt not found'}</p>
                    <Button onClick={() => navigate('/portfolio')} className="w-full">
                        Return to Portfolio
                    </Button>
                </Card>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-900 py-12 px-4 flex items-center justify-center">
            <Card className="max-w-lg w-full shadow-xl border-slate-200 dark:border-slate-800 relative overflow-hidden">
                {/* Decorative top border */}
                <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-emerald-500 to-teal-400"></div>

                <CardHeader className="text-center pb-2 pt-8">
                    <div className="w-20 h-20 bg-emerald-100 dark:bg-emerald-900/30 rounded-full flex items-center justify-center mx-auto mb-4 animate-bounce-short">
                        <span className="material-symbols-outlined text-emerald-600 text-[40px]">check_circle</span>
                    </div>
                    <CardTitle className="text-2xl font-black text-slate-900 dark:text-white">Payment Successful!</CardTitle>
                    <p className="text-slate-500 dark:text-slate-400 text-sm">Your investment has been secured.</p>
                </CardHeader>

                <CardContent className="space-y-6 pt-4">
                    {/* Certificate Preview */}
                    <div className="bg-slate-50 dark:bg-[#111921] border border-slate-200 dark:border-slate-800 rounded-xl p-6 relative">
                        <div className="absolute top-4 right-4 opacity-10">
                            <span className="material-symbols-outlined text-[60px] text-slate-900 dark:text-white">verified</span>
                        </div>

                        <div className="flex flex-col items-center text-center space-y-4 relative z-10">
                            <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400">Certificate of Purchase</h3>

                            <div className="size-24 rounded-lg overflow-hidden shadow-md border-2 border-white dark:border-slate-700 relative">
                                <img
                                    src={getImageUrl(receipt.property.images?.[0])}
                                    alt={receipt.property.name}
                                    className="w-full h-full object-cover"
                                />
                            </div>

                            <div>
                                <h4 className="text-lg font-bold text-slate-900 dark:text-white">{receipt.property.name}</h4>
                                <p className="text-sm text-slate-500 dark:text-slate-400">{receipt.property.location}</p>
                            </div>

                            <div className="w-full h-px bg-slate-200 dark:bg-slate-700 my-2"></div>

                            <div className="grid grid-cols-2 gap-x-8 gap-y-4 w-full max-w-xs text-left">
                                <div>
                                    <p className="text-xs text-slate-400 uppercase">Amount Paid</p>
                                    <p className="text-lg font-bold text-emerald-600">₦{receipt.amount.toLocaleString()}</p>
                                </div>
                                <div>
                                    <p className="text-xs text-slate-400 uppercase">Slots Purchased</p>
                                    <p className="text-lg font-bold text-slate-900 dark:text-white">{receipt.units} Units</p>
                                </div>
                                <div className="col-span-2">
                                    <p className="text-xs text-slate-400 uppercase">Reference ID</p>
                                    <p className="text-sm font-mono text-slate-600 dark:text-slate-300 break-all">{receipt.reference}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-3 print:hidden">
                        <Button
                            onClick={() => window.print()}
                            className="w-full py-6 text-lg shadow-lg shadow-emerald-500/20 bg-emerald-600 hover:bg-emerald-700"
                        >
                            <span className="material-symbols-outlined mr-2">download</span>
                            Download Receipt
                        </Button>
                        <Button variant="outline" className="w-full" onClick={() => navigate('/portfolio')}>
                            Go to Portfolio
                        </Button>
                    </div>

                    <style>{`
                        @media print {
                            body * {
                                visibility: hidden;
                            }
                            .bg-slate-50.dark\\:bg-\\[\\#111921\\] {
                                position: absolute;
                                left: 0;
                                top: 0;
                                width: 100%;
                                visibility: visible !important;
                                border: none !important;
                                box-shadow: none !important;
                            }
                            .bg-slate-50.dark\\:bg-\\[\\#111921\\] * {
                                visibility: visible !important;
                            }
                            /* Hide the URL/Date headers if possible or just ensure content is centered */
                        }
                    `}</style>
                </CardContent>
            </Card>
        </div>
    );
}

import { useEffect, useState, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { apiClient } from '../../lib/api-client';
import { Button } from '../../components/ui/button';
import { Card, CardContent } from '../../components/ui/card';

export default function PaymentCallbackPage() {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const reference = searchParams.get('reference');
    const [status, setStatus] = useState<'verifying' | 'success' | 'error'>(() => {
        return !reference ? 'error' : 'verifying';
    });
    const [message, setMessage] = useState(() => {
        return !reference ? 'Invalid payment reference used.' : 'Verifying your payment...';
    });
    const verificationAttempted = useRef(false);

    useEffect(() => {
        if (!reference) return;

        if (verificationAttempted.current) return;
        verificationAttempted.current = true;

        const verifyPayment = async () => {
            try {
                // Backend verification endpoint
                await apiClient.get(`/payments/card/verify/${reference}`);

                setStatus('success');
                setMessage('Payment successful! Redirecting to your receipt...');

                // Redirect after 3 seconds
                setTimeout(() => {
                    navigate(`/payment/success?reference=${reference}`);
                }, 2000);
            } catch (error) {
                console.error('Verification failed:', error);

                // If error suggests it was already verified (idempotency), treat as success
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                const err = error as any;
                if (err.message?.includes('already verified') || err.message?.includes('duplicate') || err.response?.status === 409 || err.message?.includes('Ownership already exists')) {
                    console.log('Payment already verified, redirecting...');
                    setStatus('success');
                    setMessage('Payment already verified! Redirecting to your receipt...');
                    setTimeout(() => navigate(`/payment/success?reference=${reference}`), 2000);
                    return;
                }

                setStatus('error');
                setMessage(err.message || 'Payment verification failed. Please contact support.');
            }
        };

        verifyPayment();
    }, [reference, navigate]);

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex items-center justify-center p-4">
            <Card className="max-w-md w-full text-center p-6">
                <CardContent className="space-y-6 pt-6">
                    {status === 'verifying' && (
                        <>
                            <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
                            <h2 className="text-xl font-bold dark:text-white">Verifying Payment</h2>
                            <p className="text-slate-500">{message}</p>
                        </>
                    )}

                    {status === 'success' && (
                        <>
                            <div className="w-16 h-16 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center mx-auto">
                                <span className="material-symbols-outlined text-green-600 text-4xl">check_circle</span>
                            </div>
                            <h2 className="text-xl font-bold dark:text-white">Success!</h2>
                            <p className="text-slate-500">{message}</p>
                            <Button onClick={() => navigate(`/payment/success?reference=${reference}`)} className="w-full mt-4">
                                View Receipt
                            </Button>
                        </>
                    )}

                    {status === 'error' && (
                        <>
                            <div className="w-16 h-16 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center mx-auto">
                                <span className="material-symbols-outlined text-red-600 text-4xl">error</span>
                            </div>
                            <h2 className="text-xl font-bold dark:text-white">Verification Failed</h2>
                            <p className="text-slate-500">{message}</p>
                            <div className="flex gap-3 mt-4">
                                <Button variant="outline" onClick={() => navigate('/dashboard')} className="flex-1">
                                    Dashboard
                                </Button>
                                <Button onClick={() => window.location.reload()} className="flex-1">
                                    Retry
                                </Button>
                            </div>
                        </>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}

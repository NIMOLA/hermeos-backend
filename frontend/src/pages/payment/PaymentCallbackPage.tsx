import { useEffect, useState, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { apiClient } from '../../lib/api-client';
import { Button } from '../../components/ui/button';
import { Card, CardContent } from '../../components/ui/card';

export default function PaymentCallbackPage() {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const reference = searchParams.get('reference');
    const [status, setStatus] = useState<'verifying' | 'success' | 'error'>('verifying');
    const [message, setMessage] = useState('Verifying your payment...');
    const verificationAttempted = useRef(false);

    useEffect(() => {
        if (!reference) {
            setStatus('error');
            setMessage('Invalid payment reference used.');
            return;
        }

        if (verificationAttempted.current) return;
        verificationAttempted.current = true;

        const verifyPayment = async () => {
            try {
                // Backend verification endpoint
                await apiClient.get(`/payment/card/verify/${reference}`);

                setStatus('success');
                setMessage('Payment successful! Redirecting to your portfolio...');

                // Redirect after 3 seconds
                setTimeout(() => {
                    navigate('/portfolio');
                }, 3000);
            } catch (error: any) {
                console.error('Verification failed:', error);

                // If error suggests it was already verified (idempotency), treat as success
                if (error.message?.includes('already verified') || error.message?.includes('duplicate')) {
                    setStatus('success');
                    setMessage('Payment successful! Redirecting...');
                    setTimeout(() => navigate('/portfolio'), 3000);
                    return;
                }

                setStatus('error');
                setMessage(error.message || 'Payment verification failed. Please contact support.');
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
                            <Button onClick={() => navigate('/portfolio')} className="w-full mt-4">
                                Go to Portfolio
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

import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle, XCircle, Loader2 } from 'lucide-react';
import { Card, CardContent } from '../../components/ui/card';

export default function PaystackCallbackPage() {
    const navigate = useNavigate();
    const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
    const [message, setMessage] = useState('Verifying payment...');

    useEffect(() => {
        const verifyPayment = async () => {
            const urlParams = new URLSearchParams(window.location.search);
            const reference = urlParams.get('reference');

            if (!reference) {
                setStatus('error');
                setMessage('Payment reference not found');
                return;
            }

            try {
                const token = localStorage.getItem('token');

                const response = await fetch(
                    `${import.meta.env.VITE_API_BASE_URL}/payments/card/verify/${reference}`,
                    {
                        headers: {
                            'Authorization': `Bearer ${token}`
                        }
                    }
                );

                const data = await response.json();

                if (response.ok && data.success) {
                    setStatus('success');
                    setMessage('Payment successful! Your ownership has been created.');

                    // Redirect to portfolio after 3 seconds
                    setTimeout(() => {
                        navigate('/dashboard/portfolio');
                    }, 3000);
                } else {
                    setStatus('error');
                    setMessage(data.message || 'Payment verification failed');
                }
            } catch (error) {
                setStatus('error');
                setMessage('An error occurred while verifying payment');
            }
        };

        verifyPayment();
    }, [navigate]);

    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 dark:from-gray-900 dark:to-purple-900 flex items-center justify-center p-4">
            <Card className="max-w-md w-full">
                <CardContent className="pt-6 text-center">
                    {status === 'loading' && (
                        <>
                            <Loader2 className="w-16 h-16 text-purple-500 mx-auto mb-4 animate-spin" />
                            <h2 className="text-2xl font-bold mb-2">Processing Payment</h2>
                            <p className="text-gray-600 dark:text-gray-400">
                                Please wait while we verify your payment...
                            </p>
                        </>
                    )}

                    {status === 'success' && (
                        <>
                            <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                            <h2 className="text-2xl font-bold mb-2 text-green-700 dark:text-green-400">
                                Payment Successful!
                            </h2>
                            <p className="text-gray-600 dark:text-gray-400 mb-4">
                                {message}
                            </p>
                            <p className="text-sm text-gray-500">
                                Redirecting to your portfolio...
                            </p>
                        </>
                    )}

                    {status === 'error' && (
                        <>
                            <XCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
                            <h2 className="text-2xl font-bold mb-2 text-red-700 dark:text-red-400">
                                Payment Failed
                            </h2>
                            <p className="text-gray-600 dark:text-gray-400 mb-6">
                                {message}
                            </p>
                            <button
                                onClick={() => navigate('/properties')}
                                className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                            >
                                Browse Properties
                            </button>
                        </>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}

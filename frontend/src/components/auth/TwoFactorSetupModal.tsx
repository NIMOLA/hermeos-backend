import { useState, useEffect } from 'react';
import { apiClient } from '../../hooks/useApi';
import { Button } from '../ui/button';
import { useAuth } from '../../contexts/AuthContext';

interface TwoFactorSetupModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export function TwoFactorSetupModal({ isOpen, onClose }: TwoFactorSetupModalProps) {
    const { refreshUser } = useAuth();
    const [step, setStep] = useState<'loading' | 'qr' | 'verify' | 'success'>('loading');
    const [qrCode, setQrCode] = useState('');
    const [secret, setSecret] = useState('');
    const [token, setToken] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (isOpen) {
            fetchSetup();
        } else {
            // Reset state on close
            setStep('loading');
            setToken('');
            setError('');
        }
    }, [isOpen]);

    const fetchSetup = async () => {
        try {
            setLoading(true);
            const response = await apiClient.post<{ qrCode: string; secret: string }>('/auth/2fa/setup');
            setQrCode(response.qrCode);
            setSecret(response.secret);
            setStep('qr');
        } catch (err: any) {
            setError(err.response?.data?.message || 'Failed to initialize 2FA setup');
        } finally {
            setLoading(false);
        }
    };

    const handleVerify = async () => {
        if (!token) return;
        try {
            setLoading(true);
            setError('');
            await apiClient.post('/auth/2fa/verify', { token });
            setStep('success');
            await refreshUser(); // Update user context to reflect 2FA enabled
            setTimeout(() => {
                onClose();
            }, 2000);
        } catch (err: any) {
            setError(err.response?.data?.message || 'Invalid code. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white dark:bg-[#1a2632] rounded-xl shadow-2xl max-w-md w-full p-6 border border-slate-200 dark:border-slate-800">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-bold text-slate-900 dark:text-white">Setup 2-Step Verification</h2>
                    <button onClick={onClose} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">
                        <span className="material-symbols-outlined">close</span>
                    </button>
                </div>

                {step === 'loading' && (
                    <div className="flex flex-col items-center py-8">
                        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mb-4"></div>
                        <p className="text-slate-500">Generating secure key...</p>
                    </div>
                )}

                {step === 'qr' && (
                    <div className="space-y-6">
                        <p className="text-sm text-slate-600 dark:text-slate-300">
                            Scan this QR code with your authenticator app (Google Authenticator, Authy, etc).
                        </p>
                        <div className="flex justify-center bg-white p-4 rounded-lg border border-slate-200">
                            {qrCode && <img src={qrCode} alt="2FA QR Code" className="w-48 h-48" />}
                        </div>
                        <div className="bg-slate-50 dark:bg-slate-900 p-3 rounded text-center">
                            <p className="text-xs text-slate-500 mb-1">Or enter code manually:</p>
                            <code className="text-sm font-mono font-bold text-slate-900 dark:text-white select-all">{secret}</code>
                        </div>
                        <Button className="w-full" onClick={() => setStep('verify')}>
                            Next: Verify Code
                        </Button>
                    </div>
                )}

                {step === 'verify' && (
                    <div className="space-y-6">
                        <p className="text-sm text-slate-600 dark:text-slate-300">
                            Enter the 6-digit code from your authenticator app to verify setup.
                        </p>
                        <div className="space-y-2">
                            <input
                                type="text"
                                value={token}
                                onChange={(e) => setToken(e.target.value.replace(/\D/g, '').slice(0, 6))}
                                placeholder="000 000"
                                className="w-full text-center text-3xl tracking-widest py-3 border border-slate-300 dark:border-slate-700 rounded-lg dark:bg-slate-900 dark:text-white focus:ring-2 focus:ring-primary outline-none"
                                autoFocus
                            />
                            {error && <p className="text-sm text-red-500 text-center">{error}</p>}
                        </div>
                        <div className="flex gap-3">
                            <Button variant="outline" className="w-full" onClick={() => setStep('qr')}>
                                Back
                            </Button>
                            <Button className="w-full" disabled={token.length !== 6 || loading} onClick={handleVerify}>
                                {loading ? 'Verifying...' : 'Verify & Enable'}
                            </Button>
                        </div>
                    </div>
                )}

                {step === 'success' && (
                    <div className="flex flex-col items-center py-8 text-center space-y-4">
                        <div className="w-16 h-16 bg-green-100 dark:bg-green-900/20 text-green-600 rounded-full flex items-center justify-center">
                            <span className="material-symbols-outlined text-4xl">check</span>
                        </div>
                        <h3 className="text-lg font-bold text-slate-900 dark:text-white">2FA Enabled!</h3>
                        <p className="text-sm text-slate-500">Your account is now more secure.</p>
                    </div>
                )}
            </div>
        </div>
    );
}

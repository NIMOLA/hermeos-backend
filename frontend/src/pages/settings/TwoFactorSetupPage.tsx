import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Alert, AlertDescription } from '../../components/ui/alert';
import { Shield, Smartphone, CheckCircle, Copy, AlertCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function TwoFactorSetupPage() {
    const navigate = useNavigate();
    const [step, setStep] = useState<'intro' | 'setup' | 'verify' | 'success'>('intro');
    const [qrCode, setQrCode] = useState('');
    const [secret, setSecret] = useState('');
    const [verificationToken, setVerificationToken] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [copied, setCopied] = useState(false);

    const handleSetup = async () => {
        setLoading(true);
        setError('');

        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/2fa/setup`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Failed to setup 2FA');
            }

            setQrCode(data.data.qrCode);
            setSecret(data.data.secret);
            setStep('setup');
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleVerify = async () => {
        if (verificationToken.length !== 6) {
            setError('Token must be 6 digits');
            return;
        }

        setLoading(true);
        setError('');

        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/2fa/verify`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ token: verificationToken })
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Invalid verification code');
            }

            setStep('success');
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const copySecret = () => {
        navigator.clipboard.writeText(secret);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 dark:from-gray-900 dark:to-purple-900 p-4">
            <div className="max-w-2xl mx-auto py-8">
                {/* Intro Step */}
                {step === 'intro' && (
                    <Card>
                        <CardHeader>
                            <div className="flex items-center space-x-3">
                                <Shield className="w-8 h-8 text-purple-600" />
                                <div>
                                    <CardTitle>Enable Two-Factor Authentication</CardTitle>
                                    <CardDescription>Add an extra layer of security to your account</CardDescription>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="space-y-4">
                                <h3 className="font-semibold">Why enable 2FA?</h3>
                                <ul className="space-y-2">
                                    <li className="flex items-start">
                                        <CheckCircle className="w-5 h-5 text-green-500 mr-2 mt-0.5" />
                                        <span>Protect your account from unauthorized access</span>
                                    </li>
                                    <li className="flex items-start">
                                        <CheckCircle className="w-5 h-5 text-green-500 mr-2 mt-0.5" />
                                        <span>Required for high-value transactions</span>
                                    </li>
                                    <li className="flex items-start">
                                        <CheckCircle className="w-5 h-5 text-green-500 mr-2 mt-0.5" />
                                        <span>Secure your property participation and personal data</span>
                                    </li>
                                </ul>
                            </div>

                            <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
                                <div className="flex items-start">
                                    <Smartphone className="w-5 h-5 text-blue-600 mr-2 mt-0.5" />
                                    <div>
                                        <p className="font-semibold text-blue-900 dark:text-blue-100">What you'll need:</p>
                                        <p className="text-sm text-blue-700 dark:text-blue-300 mt-1">
                                            A smartphone with Google Authenticator, Authy, or similar 2FA app installed
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {error && (
                                <Alert variant="destructive">
                                    <AlertCircle className="h-4 w-4" />
                                    <AlertDescription>{error}</AlertDescription>
                                </Alert>
                            )}

                            <Button
                                onClick={handleSetup}
                                disabled={loading}
                                className="w-full"
                                size="lg"
                            >
                                {loading ? 'Setting up...' : 'Begin Setup'}
                            </Button>
                        </CardContent>
                    </Card>
                )}

                {/* Setup Step */}
                {step === 'setup' && (
                    <Card>
                        <CardHeader>
                            <CardTitle>Scan QR Code</CardTitle>
                            <CardDescription>Use your authenticator app to scan this code</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            {/* QR Code */}
                            <div className="flex justify-center p-6 bg-white dark:bg-gray-800 rounded-lg">
                                {qrCode ? (
                                    <img src={qrCode} alt="2FA QR Code" className="w-64 h-64" />
                                ) : (
                                    <div className="w-64 h-64 bg-gray-200 dark:bg-gray-700 animate-pulse rounded" />
                                )}
                            </div>

                            {/* Manual Entry */}
                            <div>
                                <Label>Or enter this code manually:</Label>
                                <div className="flex items-center space-x-2 mt-2">
                                    <Input
                                        value={secret}
                                        readOnly
                                        className="font-mono"
                                    />
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={copySecret}
                                    >
                                        {copied ? <CheckCircle className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                                    </Button>
                                </div>
                            </div>

                            <Alert>
                                <AlertCircle className="h-4 w-4" />
                                <AlertDescription>
                                    Save this secret key in a secure location. You'll need it if you lose access to your authenticator app.
                                </AlertDescription>
                            </Alert>

                            <Button
                                onClick={() => setStep('verify')}
                                className="w-full"
                                size="lg"
                            >
                                I've Scanned the Code
                            </Button>
                        </CardContent>
                    </Card>
                )}

                {/* Verify Step */}
                {step === 'verify' && (
                    <Card>
                        <CardHeader>
                            <CardTitle>Verify Setup</CardTitle>
                            <CardDescription>Enter the 6-digit code from your authenticator app</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div>
                                <Label htmlFor="token">Verification Code</Label>
                                <Input
                                    id="token"
                                    type="text"
                                    maxLength={6}
                                    value={verificationToken}
                                    onChange={(e) => setVerificationToken(e.target.value.replace(/\D/g, ''))}
                                    placeholder="000000"
                                    className="text-center text-2xl tracking-widest font-mono"
                                />
                            </div>

                            {error && (
                                <Alert variant="destructive">
                                    <AlertCircle className="h-4 w-4" />
                                    <AlertDescription>{error}</AlertDescription>
                                </Alert>
                            )}

                            <div className="flex space-x-3">
                                <Button
                                    variant="outline"
                                    onClick={() => setStep('setup')}
                                    disabled={loading}
                                    className="flex-1"
                                >
                                    Back
                                </Button>
                                <Button
                                    onClick={handleVerify}
                                    disabled={loading || verificationToken.length !== 6}
                                    className="flex-1"
                                >
                                    {loading ? 'Verifying...' : 'Verify & Enable'}
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                )}

                {/* Success Step */}
                {step === 'success' && (
                    <Card>
                        <CardContent className="pt-6 text-center">
                            <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                            <h2 className="text-2xl font-bold mb-2">2FA Enabled!</h2>
                            <p className="text-gray-600 dark:text-gray-400 mb-6">
                                Your account is now protected with two-factor authentication.
                                You'll need to enter a code from your authenticator app each time you log in.
                            </p>
                            <Button
                                onClick={() => navigate('/dashboard')}
                                size="lg"
                            >
                                Return to Dashboard
                            </Button>
                        </CardContent>
                    </Card>
                )}
            </div>
        </div>
    );
}

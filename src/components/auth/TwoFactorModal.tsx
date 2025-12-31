import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '../ui/dialog';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Alert, AlertDescription } from '../ui/alert';
import { Shield, AlertCircle, Loader2 } from 'lucide-react';

interface TwoFactorModalProps {
    isOpen: boolean;
    onClose: () => void;
    onVerify: (token: string) => Promise<void>;
    email: string;
}

export function TwoFactorModal({ isOpen, onClose, onVerify, email }: TwoFactorModalProps) {
    const [token, setToken] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (token.length !== 6) {
            setError('Code must be 6 digits');
            return;
        }

        setLoading(true);
        setError('');

        try {
            await onVerify(token);
            setToken('');
        } catch (err: any) {
            setError(err.message || 'Invalid verification code');
        } finally {
            setLoading(false);
        }
    };

    const handleTokenChange = (value: string) => {
        const numericValue = value.replace(/\D/g, '').slice(0, 6);
        setToken(numericValue);
        setError('');
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <div className="flex items-center space-x-2">
                        <Shield className="w-6 h-6 text-purple-600" />
                        <DialogTitle>Two-Factor Authentication</DialogTitle>
                    </div>
                    <DialogDescription>
                        Enter the 6-digit code from your authenticator app
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <Label htmlFor="email" className="text-sm text-gray-600 dark:text-gray-400">
                            Email
                        </Label>
                        <Input
                            id="email"
                            type="email"
                            value={email}
                            disabled
                            className="bg-gray-100 dark:bg-gray-800"
                        />
                    </div>

                    <div>
                        <Label htmlFor="token">Verification Code</Label>
                        <Input
                            id="token"
                            type="text"
                            inputMode="numeric"
                            maxLength={6}
                            value={token}
                            onChange={(e) => handleTokenChange(e.target.value)}
                            placeholder="000000"
                            className="text-center text-2xl tracking-widest font-mono"
                            autoFocus
                            disabled={loading}
                        />
                        <p className="text-xs text-gray-500 mt-1">
                            Open your authenticator app to get the code
                        </p>
                    </div>

                    {error && (
                        <Alert variant="destructive">
                            <AlertCircle className="h-4 w-4" />
                            <AlertDescription>{error}</AlertDescription>
                        </Alert>
                    )}

                    <div className="flex space-x-3">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={onClose}
                            disabled={loading}
                            className="flex-1"
                        >
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            disabled={loading || token.length !== 6}
                            className="flex-1"
                        >
                            {loading ? (
                                <>
                                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                    Verifying...
                                </>
                            ) : (
                                'Verify'
                            )}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}

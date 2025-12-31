import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Alert, AlertDescription } from '../../components/ui/alert';
import { Upload, CheckCircle, AlertCircle, ArrowLeft } from 'lucide-react';

export default function BankTransferProofPage() {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();

    const propertyId = searchParams.get('propertyId');
    const units = parseInt(searchParams.get('units') || '0');
    const amount = parseFloat(searchParams.get('amount') || '0');

    const [formData, setFormData] = useState({
        depositorName: '',
        transferDate: '',
        transferReference: ''
    });
    const [receiptFile, setReceiptFile] = useState<File | null>(null);
    const [submitting, setSubmitting] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);
        setError('');

        try {
            const token = localStorage.getItem('token');

            const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/payments/bank-transfer/submit-proof`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    propertyId,
                    units,
                    amount,
                    ...formData
                })
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Failed to submit proof');
            }

            setSuccess(true);

            // Redirect after 3 seconds
            setTimeout(() => {
                navigate('/dashboard/portfolio');
            }, 3000);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setSubmitting(false);
        }
    };

    if (success) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 dark:from-gray-900 dark:to-purple-900 flex items-center justify-center p-4">
                <Card className="max-w-md w-full">
                    <CardContent className="pt-6 text-center">
                        <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                        <h2 className="text-2xl font-bold mb-2">Proof Submitted!</h2>
                        <p className="text-gray-600 dark:text-gray-400 mb-4">
                            Your bank transfer proof has been submitted successfully.
                            Our admin team will verify it within 24 hours.
                        </p>
                        <p className="text-sm text-gray-500">
                            Redirecting to portfolio...
                        </p>
                    </CardContent>
                </Card>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 dark:from-gray-900 dark:to-purple-900 p-4">
            <div className="max-w-2xl mx-auto py-8">
                <Button
                    variant="ghost"
                    onClick={() => navigate(-1)}
                    className="mb-4"
                >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back
                </Button>

                <Card>
                    <CardHeader>
                        <CardTitle>Submit Bank Transfer Proof</CardTitle>
                        <CardDescription>
                            Upload proof of your transfer to complete your investment
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        {/* Investment Summary */}
                        <div className="bg-purple-50 dark:bg-purple-900/20 rounded-lg p-4 mb-6">
                            <h3 className="font-semibold mb-2">Investment Summary</h3>
                            <div className="space-y-1 text-sm">
                                <p><span className="text-gray-600 dark:text-gray-400">Units:</span> <span className="font-semibold">{units}</span></p>
                                <p><span className="text-gray-600 dark:text-gray-400">Total Amount:</span> <span className="font-semibold text-lg">₦{amount.toLocaleString()}</span></p>
                            </div>
                        </div>

                        {error && (
                            <Alert variant="destructive" className="mb-6">
                                <AlertCircle className="h-4 w-4" />
                                <AlertDescription>{error}</AlertDescription>
                            </Alert>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-6">
                            {/* Depositor Name */}
                            <div>
                                <Label htmlFor="depositorName">Depositor Name *</Label>
                                <Input
                                    id="depositorName"
                                    type="text"
                                    required
                                    value={formData.depositorName}
                                    onChange={(e) => setFormData({ ...formData, depositorName: e.target.value })}
                                    placeholder="Name on the bank account used for transfer"
                                />
                                <p className="text-xs text-gray-500 mt-1">
                                    Must match the name on your bank account
                                </p>
                            </div>

                            {/* Transfer Date */}
                            <div>
                                <Label htmlFor="transferDate">Transfer Date *</Label>
                                <Input
                                    id="transferDate"
                                    type="date"
                                    required
                                    max={new Date().toISOString().split('T')[0]}
                                    value={formData.transferDate}
                                    onChange={(e) => setFormData({ ...formData, transferDate: e.target.value })}
                                />
                            </div>

                            {/* Transfer Reference */}
                            <div>
                                <Label htmlFor="transferReference">Transfer Reference (Optional)</Label>
                                <Input
                                    id="transferReference"
                                    type="text"
                                    value={formData.transferReference}
                                    onChange={(e) => setFormData({ ...formData, transferReference: e.target.value })}
                                    placeholder="Transaction reference from your bank"
                                />
                            </div>

                            {/* Receipt Upload */}
                            <div>
                                <Label htmlFor="receipt">Transfer Receipt (Optional)</Label>
                                <div className="mt-2">
                                    <label
                                        htmlFor="receipt"
                                        className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-lg cursor-pointer hover:border-purple-500 transition-colors"
                                    >
                                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                            <Upload className="w-8 h-8 mb-2 text-gray-400" />
                                            {receiptFile ? (
                                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                                    {receiptFile.name}
                                                </p>
                                            ) : (
                                                <>
                                                    <p className="mb-2 text-sm text-gray-500">
                                                        <span className="font-semibold">Click to upload</span> or drag and drop
                                                    </p>
                                                    <p className="text-xs text-gray-500">
                                                        PNG, JPG or PDF (MAX. 5MB)
                                                    </p>
                                                </>
                                            )}
                                        </div>
                                        <input
                                            id="receipt"
                                            type="file"
                                            className="hidden"
                                            accept="image/*,application/pdf"
                                            onChange={(e) => {
                                                const file = e.target.files?.[0];
                                                if (file && file.size <= 5 * 1024 * 1024) {
                                                    setReceiptFile(file);
                                                } else {
                                                    setError('File size must be less than 5MB');
                                                }
                                            }}
                                        />
                                    </label>
                                </div>
                            </div>

                            {/* Instructions */}
                            <Alert>
                                <AlertCircle className="h-4 w-4" />
                                <AlertDescription>
                                    <p className="font-semibold mb-2">Important:</p>
                                    <ul className="list-disc list-inside space-y-1 text-sm">
                                        <li>Ensure the transfer amount matches exactly: ₦{amount.toLocaleString()}</li>
                                        <li>Admin verification takes up to 24 hours</li>
                                        <li>You'll receive a notification once verified</li>
                                        <li>Ownership will be created automatically upon approval</li>
                                    </ul>
                                </AlertDescription>
                            </Alert>

                            {/* Submit Button */}
                            <Button
                                type="submit"
                                disabled={submitting}
                                className="w-full"
                                size="lg"
                            >
                                {submitting ? 'Submitting...' : 'Submit Proof'}
                            </Button>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}

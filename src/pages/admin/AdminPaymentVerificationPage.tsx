import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { Textarea } from '../../components/ui/textarea';
import { Alert, AlertDescription } from '../../components/ui/alert';
import { CheckCircle, XCircle, Eye, AlertCircle, Calendar, User, Building2, Hash } from 'lucide-react';

interface PaymentProof {
    id: string;
    user: {
        firstName: string;
        lastName: string;
        email: string;
    };
    property: {
        name: string;
        location: string;
    };
    units: number;
    amount: number;
    depositorName: string;
    transferDate: string;
    transferReference?: string;
    createdAt: string;
}

export default function AdminPaymentVerificationPage() {
    const [proofs, setProofs] = useState<PaymentProof[]>([]);
    const [selectedProof, setSelectedProof] = useState<PaymentProof | null>(null);
    const [loading, setLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState(false);
    const [rejectionReason, setRejectionReason] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    useEffect(() => {
        fetchPendingProofs();
    }, []);

    const fetchPendingProofs = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/admin/payment-proofs`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            const data = await response.json();
            if (response.ok) {
                setProofs(data.data);
            }
        } catch (err: any) {
            setError('Failed to load payment proofs');
        } finally {
            setLoading(false);
        }
    };

    const handleVerify = async (proofId: string) => {
        if (!confirm('Are you sure you want to approve this payment?')) return;

        setActionLoading(true);
        setError('');

        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/admin/payment-proofs/${proofId}/verify`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Failed to verify payment');
            }

            setSuccess('Payment approved! Ownership has been created.');
            setSelectedProof(null);
            fetchPendingProofs();
        } catch (err: any) {
            setError(err.message);
        } finally {
            setActionLoading(false);
        }
    };

    const handleReject = async (proofId: string) => {
        if (!rejectionReason.trim()) {
            setError('Please provide a rejection reason');
            return;
        }

        if (!confirm('Are you sure you want to reject this payment?')) return;

        setActionLoading(true);
        setError('');

        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/admin/payment-proofs/${proofId}/reject`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ reason: rejectionReason })
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Failed to reject payment');
            }

            setSuccess('Payment rejected. User will be notified.');
            setSelectedProof(null);
            setRejectionReason('');
            fetchPendingProofs();
        } catch (err: any) {
            setError(err.message);
        } finally {
            setActionLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
            <div className="max-w-7xl mx-auto">
                <div className="mb-6">
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Payment Verification</h1>
                    <p className="text-gray-600 dark:text-gray-400">Review and approve bank transfer payments</p>
                </div>

                {error && (
                    <Alert variant="destructive" className="mb-6">
                        <AlertCircle className="h-4 w-4" />
                        <AlertDescription>{error}</AlertDescription>
                    </Alert>
                )}

                {success && (
                    <Alert className="mb-6 bg-green-50 border-green-200">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        <AlertDescription className="text-green-800">{success}</AlertDescription>
                    </Alert>
                )}

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* List of Pending Proofs */}
                    <div className="space-y-4">
                        <Card>
                            <CardHeader>
                                <CardTitle>Pending Verifications ({proofs.length})</CardTitle>
                                <CardDescription>Bank transfer proofs awaiting review</CardDescription>
                            </CardHeader>
                            <CardContent>
                                {proofs.length === 0 ? (
                                    <div className="text-center py-8 text-gray-500">
                                        <CheckCircle className="w-12 h-12 mx-auto mb-2 text-gray-400" />
                                        <p>No pending payments</p>
                                    </div>
                                ) : (
                                    <div className="space-y-3">
                                        {proofs.map((proof) => (
                                            <div
                                                key={proof.id}
                                                onClick={() => setSelectedProof(proof)}
                                                className={`p-4 border rounded-lg cursor-pointer transition-all ${selectedProof?.id === proof.id
                                                        ? 'border-purple-600 bg-purple-50 dark:bg-purple-900/20'
                                                        : 'border-gray-200 dark:border-gray-700 hover:border-purple-300'
                                                    }`}
                                            >
                                                <div className="flex justify-between items-start mb-2">
                                                    <div>
                                                        <p className="font-semibold text-gray-900 dark:text-white">
                                                            {proof.user.firstName} {proof.user.lastName}
                                                        </p>
                                                        <p className="text-sm text-gray-600 dark:text-gray-400">{proof.user.email}</p>
                                                    </div>
                                                    <Badge className="bg-purple-100 text-purple-800">
                                                        ₦{proof.amount.toLocaleString()}
                                                    </Badge>
                                                </div>
                                                <p className="text-sm text-gray-700 dark:text-gray-300 mb-1">
                                                    {proof.property.name}
                                                </p>
                                                <div className="flex items-center text-xs text-gray-500">
                                                    <Calendar className="w-3 h-3 mr-1" />
                                                    {new Date(proof.createdAt).toLocaleDateString()}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </div>

                    {/* Selected Proof Details */}
                    <div>
                        {selectedProof ? (
                            <Card>
                                <CardHeader>
                                    <CardTitle>Payment Details</CardTitle>
                                    <CardDescription>Review and take action</CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-6">
                                    {/* User Info */}
                                    <div>
                                        <h3 className="font-semibold mb-2 flex items-center">
                                            <User className="w-4 h-4 mr-2" />
                                            Investor Information
                                        </h3>
                                        <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-3 space-y-1">
                                            <p><span className="text-gray-600 dark:text-gray-400">Name:</span> {selectedProof.user.firstName} {selectedProof.user.lastName}</p>
                                            <p><span className="text-gray-600 dark:text-gray-400">Email:</span> {selectedProof.user.email}</p>
                                        </div>
                                    </div>

                                    {/* Property Info */}
                                    <div>
                                        <h3 className="font-semibold mb-2 flex items-center">
                                            <Building2 className="w-4 h-4 mr-2" />
                                            Property Details
                                        </h3>
                                        <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-3 space-y-1">
                                            <p><span className="text-gray-600 dark:text-gray-400">Property:</span> {selectedProof.property.name}</p>
                                            <p><span className="text-gray-600 dark:text-gray-400">Location:</span> {selectedProof.property.location}</p>
                                            <p><span className="text-gray-600 dark:text-gray-400">Units:</span> {selectedProof.units}</p>
                                            <p className="text-lg font-bold"><span className="text-gray-600 dark:text-gray-400">Amount:</span> ₦{selectedProof.amount.toLocaleString()}</p>
                                        </div>
                                    </div>

                                    {/* Transfer Info */}
                                    <div>
                                        <h3 className="font-semibold mb-2 flex items-center">
                                            <Hash className="w-4 h-4 mr-2" />
                                            Transfer Information
                                        </h3>
                                        <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-3 space-y-1">
                                            <p><span className="text-gray-600 dark:text-gray-400">Depositor:</span> {selectedProof.depositorName}</p>
                                            <p><span className="text-gray-600 dark:text-gray-400">Date:</span> {new Date(selectedProof.transferDate).toLocaleDateString()}</p>
                                            {selectedProof.transferReference && (
                                                <p><span className="text-gray-600 dark:text-gray-400">Reference:</span> {selectedProof.transferReference}</p>
                                            )}
                                        </div>
                                    </div>

                                    {/* Rejection Reason */}
                                    <div>
                                        <label className="block text-sm font-medium mb-2">Rejection Reason (if rejecting)</label>
                                        <Textarea
                                            value={rejectionReason}
                                            onChange={(e) => setRejectionReason(e.target.value)}
                                            placeholder="Provide a clear reason for rejection..."
                                            rows={3}
                                        />
                                    </div>

                                    {/* Actions */}
                                    <div className="flex space-x-3">
                                        <Button
                                            onClick={() => handleVerify(selectedProof.id)}
                                            disabled={actionLoading}
                                            className="flex-1 bg-green-600 hover:bg-green-700"
                                        >
                                            <CheckCircle className="w-4 h-4 mr-2" />
                                            {actionLoading ? 'Processing...' : 'Approve'}
                                        </Button>
                                        <Button
                                            onClick={() => handleReject(selectedProof.id)}
                                            disabled={actionLoading || !rejectionReason.trim()}
                                            variant="destructive"
                                            className="flex-1"
                                        >
                                            <XCircle className="w-4 h-4 mr-2" />
                                            Reject
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        ) : (
                            <Card>
                                <CardContent className="pt-6 text-center py-12">
                                    <Eye className="w-12 h-12 mx-auto mb-2 text-gray-400" />
                                    <p className="text-gray-500">Select a payment to review</p>
                                </CardContent>
                            </Card>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

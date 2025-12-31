import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useFetch, useMutation } from '../../hooks/useApi';
import { Button } from '../../components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/card';

interface Ownership {
    id: string;
    property: {
        id: string;
        name: string;
        location: string;
        imageUrl: string;
    };
    units: number;
    ownershipPercent: number;
    currentValue: number;
}

interface ExitRequest {
    id: string;
    property: {
        id: string;
        name: string;
        location: string;
        imageUrl: string;
    };
    units: number;
    requestedPrice: number | null;
    status: string;
    reason: string;
    bankDetails: {
        bankName: string | null;
        accountNumber: string | null;
    };
    createdAt: string;
    reviewedAt: string | null;
    rejectionReason: string | null;
}

export default function ExitRequestPage() {
    const navigate = useNavigate();
    const [selectedOwnership, setSelectedOwnership] = useState('');
    const [units, setUnits] = useState('');
    const [reason, setReason] = useState('');
    const [bankName, setBankName] = useState('');
    const [accountNumber, setAccountNumber] = useState('');
    const [accountName, setAccountName] = useState('');
    const [error, setError] = useState('');

    // Fetch user's holdings
    const { data: holdings, isLoading: loadingHoldings } = useFetch<Ownership[]>('/user/portfolio/holdings');

    // Fetch existing exit requests
    const { data: exitRequests, isLoading: loadingRequests, refetch } = useFetch<ExitRequest[]>('/exit-requests/my-requests');

    // Submit mutation
    const { mutate: submitRequest, isLoading: submitting } = useMutation('/exit-requests', 'POST');

    const selectedHolding = holdings?.find(h => h.id === selectedOwnership);
    const maxUnits = selectedHolding?.units || 0;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (!selectedOwnership) {
            setError('Please select an asset');
            return;
        }

        const unitsNum = parseInt(units);
        if (!unitsNum || unitsNum <= 0) {
            setError('Please enter a valid number of units');
            return;
        }

        if (unitsNum > maxUnits) {
            setError(`You only own ${maxUnits} units of this property`);
            return;
        }

        if (!bankName || !accountNumber) {
            setError('Please provide bank details for payout');
            return;
        }

        if (!/^\d{10}$/.test(accountNumber)) {
            setError('Account number must be 10 digits');
            return;
        }

        try {
            await submitRequest({
                ownershipId: selectedOwnership,
                units: unitsNum,
                reason: reason || 'Liquidity needs',
                bankName,
                accountNumber,
                accountName: accountName || undefined
            });

            // Reset form
            setSelectedOwnership('');
            setUnits('');
            setReason('');
            setBankName('');
            setAccountNumber('');
            setAccountName('');

            // Refetch requests
            refetch();

            // Show success message
            alert('Exit request submitted successfully! You will be notified once it is reviewed.');
        } catch (err: any) {
            setError(err.message || 'Failed to submit exit request');
        }
    };

    const getStatusColor = (status: string) => {
        switch (status.toLowerCase()) {
            case 'pending': return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/20 dark:text-yellow-400';
            case 'approved': return 'bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400';
            case 'completed': return 'bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400';
            case 'rejected': return 'bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-400';
            case 'cancelled': return 'bg-gray-100 text-gray-700 dark:bg-gray-900/20 dark:text-gray-400';
            default: return 'bg-slate-100 text-slate-700 dark:bg-slate-900/20 dark:text-slate-400';
        }
    };

    if (loadingHoldings) {
        return (
            <div className="max-w-6xl mx-auto p-6">
                <div className="animate-pulse space-y-4">
                    <div className="h-8 bg-slate-200 dark:bg-slate-700 rounded w-1/3"></div>
                    <div className="h-64 bg-slate-200 dark:bg-slate-700 rounded"></div>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-6xl mx-auto p-4 sm:p-6 space-y-8">
            {/* Breadcrumbs */}
            <div className="flex flex-wrap items-center gap-2 text-sm">
                <Link to="/portfolio" className="text-primary hover:underline">Portfolio</Link>
                <span className="text-slate-400">/</span>
                <span className="text-slate-900 dark:text-white font-medium">Exit Request</span>
            </div>

            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">Request Asset Exit</h1>
                <p className="text-slate-500 dark:text-slate-400">
                    Submit a request to liquidate your holdings in a specific asset. Requests are subject to review and approval.
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Submit Form */}
                <div className="lg:col-span-2">
                    <Card>
                        <CardHeader>
                            <CardTitle>New Exit Request</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={handleSubmit} className="space-y-6">
                                {/* Asset Selection */}
                                <div className="space-y-2">
                                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                                        Select Asset<span className="text-red-500">*</span>
                                    </label>
                                    <select
                                        value={selectedOwnership}
                                        onChange={(e) => {
                                            setSelectedOwnership(e.target.value);
                                            setUnits(''); // Reset units when changing asset
                                        }}
                                        className="w-full px-3 py-2.5 border border-slate-300 dark:border-slate-700 rounded-lg dark:bg-[#1a2632] dark:text-white focus:ring-2 focus:ring-primary focus:border-primary"
                                        required
                                    >
                                        <option value="">Select an asset...</option>
                                        {holdings?.map(holding => (
                                            <option key={holding.id} value={holding.id}>
                                                {holding.property.name} - {holding.units} units ({holding.ownershipPercent}%)
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                {/* Units */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                                            Units to Sell<span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="number"
                                            min="1"
                                            max={maxUnits}
                                            value={units}
                                            onChange={(e) => setUnits(e.target.value)}
                                            className="w-full px-3 py-2.5 border border-slate-300 dark:border-slate-700 rounded-lg dark:bg-[#1a2632] dark:text-white focus:ring-2 focus:ring-primary focus:border-primary"
                                            placeholder={`Max: ${maxUnits}`}
                                            required
                                        />
                                        {selectedHolding && (
                                            <p className="text-xs text-slate-500">
                                                You own {maxUnits} units (₦{(selectedHolding.currentValue / selectedHolding.units).toFixed(0)}/unit)
                                            </p>
                                        )}
                                    </div>
                                    <div className="space-y-2">
                                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                                            Estimated Payout
                                        </label>
                                        <div className="w-full px-3 py-2.5 border border-slate-200 dark:border-slate-700 rounded-lg bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-bold">
                                            {selectedHolding && units ?
                                                `₦${((selectedHolding.currentValue / selectedHolding.units) * parseInt(units || '0')).toLocaleString()}`
                                                : '₦0'
                                            }
                                        </div>
                                        <p className="text-xs text-slate-500">2% processing fee applies</p>
                                    </div>
                                </div>

                                {/* Bank Details */}
                                <div className="space-y-4 p-4 bg-slate-50 dark:bg-slate-800/50 rounded-lg">
                                    <h3 className="font-semibold text-slate-900 dark:text-white">Bank Details for Payout</h3>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                                                Bank Name<span className="text-red-500">*</span>
                                            </label>
                                            <input
                                                type="text"
                                                value={bankName}
                                                onChange={(e) => setBankName(e.target.value)}
                                                className="w-full px-3 py-2.5 border border-slate-300 dark:border-slate-700 rounded-lg dark:bg-[#1a2632] dark:text-white focus:ring-2 focus:ring-primary focus:border-primary"
                                                placeholder="e.g. GTBank"
                                                required
                                            />
                                        </div>

                                        <div className="space-y-2">
                                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                                                Account Number<span className="text-red-500">*</span>
                                            </label>
                                            <input
                                                type="text"
                                                value={accountNumber}
                                                onChange={(e) => setAccountNumber(e.target.value)}
                                                className="w-full px-3 py-2.5 border border-slate-300 dark:border-slate-700 rounded-lg dark:bg-[#1a2632] dark:text-white focus:ring-2 focus:ring-primary focus:border-primary"
                                                placeholder="0123456789"
                                                maxLength={10}
                                                pattern="\d{10}"
                                                required
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                                            Account Name (Optional)
                                        </label>
                                        <input
                                            type="text"
                                            value={accountName}
                                            onChange={(e) => setAccountName(e.target.value)}
                                            className="w-full px-3 py-2.5 border border-slate-300 dark:border-slate-700 rounded-lg dark:bg-[#1a2632] dark:text-white focus:ring-2 focus:ring-primary focus:border-primary"
                                            placeholder="Full Name"
                                        />
                                    </div>
                                </div>

                                {/* Reason */}
                                <div className="space-y-2">
                                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                                        Reason for Exit (Optional)
                                    </label>
                                    <textarea
                                        value={reason}
                                        onChange={(e) => setReason(e.target.value)}
                                        className="w-full px-3 py-2.5 border border-slate-300 dark:border-slate-700 rounded-lg dark:bg-[#1a2632] dark:text-white focus:ring-2 focus:ring-primary focus:border-primary resize-none"
                                        rows={3}
                                        placeholder="Tell us why you prefer to exit..."
                                    />
                                </div>

                                {/* Notice */}
                                <div className="bg-yellow-50 dark:bg-yellow-900/10 p-4 rounded-lg border border-yellow-100 dark:border-yellow-900/30">
                                    <div className="flex gap-2">
                                        <span className="material-symbols-outlined text-yellow-600 dark:text-yellow-400 text-[20px]">info</span>
                                        <p className="text-sm text-yellow-800 dark:text-yellow-200">
                                            <span className="font-bold">Important:</span> Exit requests typically take 5-10 business days to process. A 2% processing fee applies to all secondary market sales.
                                        </p>
                                    </div>
                                </div>

                                {/* Error */}
                                {error && (
                                    <div className="bg-red-50 dark:bg-red-900/10 p-4 rounded-lg border border-red-100 dark:border-red-900/30">
                                        <p className="text-sm text-red-800 dark:text-red-200">{error}</p>
                                    </div>
                                )}

                                {/* Submit */}
                                <Button
                                    type="submit"
                                    className="w-full"
                                    disabled={submitting || !selectedOwnership}
                                >
                                    {submitting ? 'Submitting...' : 'Submit Exit Request'}
                                </Button>
                            </form>
                        </CardContent>
                    </Card>
                </div>

                {/* My Requests Sidebar */}
                <div className="lg:col-span-1">
                    <Card>
                        <CardHeader>
                            <CardTitle>My Exit Requests</CardTitle>
                        </CardHeader>
                        <CardContent>
                            {loadingRequests ? (
                                <div className="space-y-3">
                                    {[1, 2].map(i => (
                                        <div key={i} className="animate-pulse h-20 bg-slate-200 dark:bg-slate-700 rounded"></div>
                                    ))}
                                </div>
                            ) : exitRequests && exitRequests.length > 0 ? (
                                <div className="space-y-3 max-h-[600px] overflow-y-auto">
                                    {exitRequests.map(request => (
                                        <div
                                            key={request.id}
                                            className="p-4 border border-slate-200 dark:border-slate-700 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors cursor-pointer"
                                            onClick={() => navigate(`/exit-requests/${request.id}`)}
                                        >
                                            <div className="flex items-start justify-between mb-2">
                                                <h4 className="font-semibold text-sm text-slate-900 dark:text-white line-clamp-1">
                                                    {request.property.name}
                                                </h4>
                                                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${getStatusColor(request.status)}`}>
                                                    {request.status.toUpperCase()}
                                                </span>
                                            </div>
                                            <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">
                                                {request.units} units
                                            </p>
                                            <p className="text-xs text-slate-400 dark:text-slate-500">
                                                {new Date(request.createdAt).toLocaleDateString()}
                                            </p>
                                            {request.rejectionReason && (
                                                <p className="text-xs text-red-600 dark:text-red-400 mt-2">
                                                    Rejected: {request.rejectionReason}
                                                </p>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-8">
                                    <span className="material-symbols-outlined text-slate-300 dark:text-slate-700 text-5xl mb-2">inbox</span>
                                    <p className="text-sm text-slate-500 dark:text-slate-400">
                                        No exit requests yet
                                    </p>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}

import { useState } from 'react';
import { useFetch, apiClient } from '../../hooks/useApi'; // Ensure apiClient is imported
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/card';

interface ExitRequest {
    id: number;
    user: string;
    userId: string;
    email: string;
    asset: string;
    units: number;
    price: string;
    total: string;
    date: string;
    status: 'Pending' | 'Approved' | 'Rejected';
    reason: string;
    accountNumber?: string;
    bankName?: string;
}

export default function AdminExitRequestsPage() {
    const { data: requests, refetch } = useFetch<ExitRequest[]>('/transfer-requests/all');

    const [selectedRequest, setSelectedRequest] = useState<ExitRequest | null>(null);
    const [showDetailModal, setShowDetailModal] = useState(false);

    const handleApprove = async (id: number) => {
        if (!confirm('Are you sure you want to approve this request? This action cannot be undone.')) return;
        try {
            await apiClient.patch(`/transfer-requests/${id}/approve`);
            refetch();
            setShowDetailModal(false);
            alert('Request approved successfully');
        } catch (error) {
            console.error(error);
            alert('Failed to approve request');
        }
    };

    const handleReject = async (id: number) => {
        const reason = prompt('Please enter a rejection reason:');
        if (!reason) return;
        try {
            await apiClient.patch(`/transfer-requests/${id}/reject`, { rejectionReason: reason });
            refetch();
            setShowDetailModal(false);
            alert('Request rejected');
        } catch (error) {
            console.error(error);
            alert('Failed to reject request');
        }
    };

    const openDetailView = (request: ExitRequest) => {
        setSelectedRequest(request);
        setShowDetailModal(true);
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Exit Requests</h1>
                <div className="flex gap-2">
                    <Button variant="outline" size="sm">Export CSV</Button>
                </div>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Queue</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-slate-50 dark:bg-slate-900/50 border-b border-slate-200 dark:border-slate-800">
                                <tr>
                                    <th className="p-4 text-xs font-bold text-slate-500 uppercase">Request ID</th>
                                    <th className="p-4 text-xs font-bold text-slate-500 uppercase">User</th>
                                    <th className="p-4 text-xs font-bold text-slate-500 uppercase">Asset</th>
                                    <th className="p-4 text-xs font-bold text-slate-500 uppercase">Units / Price</th>
                                    <th className="p-4 text-xs font-bold text-slate-500 uppercase">Total</th>
                                    <th className="p-4 text-xs font-bold text-slate-500 uppercase">Date</th>
                                    <th className="p-4 text-xs font-bold text-slate-500 uppercase">Status</th>
                                    <th className="p-4 text-xs font-bold text-slate-500 uppercase text-right">Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                                {(requests || []).map((req) => (
                                    <tr key={req.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                                        <td className="p-4 text-sm font-medium text-slate-900 dark:text-white">#{req.id}</td>
                                        <td className="p-4 text-sm text-slate-600 dark:text-slate-400">{req.user}</td>
                                        <td className="p-4 text-sm text-slate-600 dark:text-slate-400">{req.asset}</td>
                                        <td className="p-4 text-sm text-slate-600 dark:text-slate-400">{req.units} @ {req.price}</td>
                                        <td className="p-4 text-sm font-bold text-slate-900 dark:text-white">{req.total}</td>
                                        <td className="p-4 text-sm text-slate-600 dark:text-slate-400">{req.date}</td>
                                        <td className="p-4">
                                            <Badge className={
                                                req.status === 'Pending' ? 'bg-orange-100 text-orange-700' :
                                                    req.status === 'Approved' ? 'bg-emerald-100 text-emerald-700' :
                                                        'bg-red-100 text-red-700'
                                            }>
                                                {req.status}
                                            </Badge>
                                        </td>
                                        <td className="p-4 text-right">
                                            <div className="flex justify-end gap-2">
                                                <button
                                                    onClick={() => openDetailView(req)}
                                                    className="h-8 w-8 p-0 flex items-center justify-center border border-blue-200 text-blue-600 hover:bg-blue-50 dark:border-blue-800 dark:text-blue-400 dark:hover:bg-blue-900/20 rounded transition-colors"
                                                    title="View Details"
                                                >
                                                    <span className="material-symbols-outlined text-sm">visibility</span>
                                                </button>
                                                {req.status === 'Pending' && (
                                                    <>
                                                        <button
                                                            onClick={() => handleApprove(req.id)}
                                                            className="h-8 w-8 p-0 flex items-center justify-center border border-green-200 text-green-600 hover:bg-green-50 dark:border-green-800 dark:text-green-400 dark:hover:bg-green-900/20 rounded transition-colors"
                                                            title="Approve"
                                                        >
                                                            <span className="material-symbols-outlined text-sm">check</span>
                                                        </button>
                                                        <button
                                                            onClick={() => handleReject(req.id)}
                                                            className="h-8 w-8 p-0 flex items-center justify-center border border-red-200 text-red-600 hover:bg-red-50 dark:border-red-800 dark:text-red-400 dark:hover:bg-red-900/20 rounded transition-colors"
                                                            title="Reject"
                                                        >
                                                            <span className="material-symbols-outlined text-sm">close</span>
                                                        </button>
                                                    </>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </CardContent>
            </Card>

            {/* Detail Modal */}
            {showDetailModal && selectedRequest && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-white dark:bg-[#1a2632] rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-slate-200 dark:border-slate-800">
                        <div className="p-6 border-b border-slate-200 dark:border-slate-800 flex justify-between items-start">
                            <div>
                                <h2 className="text-xl font-bold text-slate-900 dark:text-white">Exit Request Details</h2>
                                <p className="text-sm text-slate-500 mt-1">Request #{selectedRequest.id}</p>
                            </div>
                            <button
                                onClick={() => setShowDetailModal(false)}
                                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
                            >
                                <span className="material-symbols-outlined">close</span>
                            </button>
                        </div>

                        <div className="p-6 space-y-6">
                            {/* User Information */}
                            <div>
                                <h3 className="text-sm font-bold text-slate-500 uppercase mb-3">User Information</h3>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <p className="text-xs text-slate-500 mb-1">Name</p>
                                        <p className="text-sm font-medium text-slate-900 dark:text-white">{selectedRequest.user}</p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-slate-500 mb-1">User ID</p>
                                        <p className="text-sm font-medium text-slate-900 dark:text-white">{selectedRequest.userId}</p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-slate-500 mb-1">Email</p>
                                        <p className="text-sm font-medium text-slate-900 dark:text-white">{selectedRequest.email}</p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-slate-500 mb-1">Request Date</p>
                                        <p className="text-sm font-medium text-slate-900 dark:text-white">{selectedRequest.date}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Asset Information */}
                            <div className="border-t border-slate-200 dark:border-slate-800 pt-6">
                                <h3 className="text-sm font-bold text-slate-500 uppercase mb-3">Asset Details</h3>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <p className="text-xs text-slate-500 mb-1">Property</p>
                                        <p className="text-sm font-medium text-slate-900 dark:text-white">{selectedRequest.asset}</p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-slate-500 mb-1">Units to Sell</p>
                                        <p className="text-sm font-medium text-slate-900 dark:text-white">{selectedRequest.units} units</p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-slate-500 mb-1">Unit Price</p>
                                        <p className="text-sm font-medium text-slate-900 dark:text-white">{selectedRequest.price}</p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-slate-500 mb-1">Total Value</p>
                                        <p className="text-sm font-bold text-primary">{selectedRequest.total}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Payment Information */}
                            <div className="border-t border-slate-200 dark:border-slate-800 pt-6">
                                <h3 className="text-sm font-bold text-slate-500 uppercase mb-3">Payment Details</h3>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <p className="text-xs text-slate-500 mb-1">Bank Name</p>
                                        <p className="text-sm font-medium text-slate-900 dark:text-white">{selectedRequest.bankName}</p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-slate-500 mb-1">Account Number</p>
                                        <p className="text-sm font-medium text-slate-900 dark:text-white">{selectedRequest.accountNumber}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Reason */}
                            <div className="border-t border-slate-200 dark:border-slate-800 pt-6">
                                <h3 className="text-sm font-bold text-slate-500 uppercase mb-3">Reason for Exit</h3>
                                <p className="text-sm text-slate-600 dark:text-slate-400 bg-slate-50 dark:bg-slate-900/50 p-4 rounded-lg">
                                    {selectedRequest.reason}
                                </p>
                            </div>

                            {/* Status */}
                            <div className="border-t border-slate-200 dark:border-slate-800 pt-6">
                                <h3 className="text-sm font-bold text-slate-500 uppercase mb-3">Status</h3>
                                <Badge className={
                                    selectedRequest.status === 'Pending' ? 'bg-orange-100 text-orange-700 text-sm px-3 py-1' :
                                        selectedRequest.status === 'Approved' ? 'bg-emerald-100 text-emerald-700 text-sm px-3 py-1' :
                                            'bg-red-100 text-red-700 text-sm px-3 py-1'
                                }>
                                    {selectedRequest.status}
                                </Badge>
                            </div>
                        </div>

                        {/* Action Buttons */}
                        {selectedRequest.status === 'Pending' && (
                            <div className="p-6 border-t border-slate-200 dark:border-slate-800 flex justify-end gap-3">
                                <Button
                                    variant="outline"
                                    onClick={() => setShowDetailModal(false)}
                                >
                                    Cancel
                                </Button>
                                <Button
                                    variant="outline"
                                    onClick={() => handleReject(selectedRequest.id)}
                                    className="border-red-200 text-red-600 hover:bg-red-50 dark:border-red-800 dark:text-red-400 dark:hover:bg-red-900/20"
                                >
                                    <span className="material-symbols-outlined text-sm mr-2">close</span>
                                    Reject Request
                                </Button>
                                <Button
                                    onClick={() => handleApprove(selectedRequest.id)}
                                    className="bg-emerald-600 hover:bg-emerald-700 text-white"
                                >
                                    <span className="material-symbols-outlined text-sm mr-2">check</span>
                                    Approve & Process
                                </Button>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}

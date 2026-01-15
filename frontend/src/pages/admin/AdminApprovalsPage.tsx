import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useFetch } from '../../hooks/useApi';
import {
    CheckCircle, XCircle, AlertCircle, Clock,
    FileText, User, Building2, Search, Filter,
    ChevronRight, CreditCard, ArrowRight, Wallet
} from 'lucide-react';
import { Card } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { Button } from '../../components/ui/button';

export default function AdminApprovalsPage() {
    const [activeTab, setActiveTab] = useState<'all' | 'kyc' | 'transfers' | 'payments'>('all');

    // Fetch Data
    const { data: kycData, isLoading: loadingKYC, refetch: refetchKYC } = useFetch<any>('/admin/kyc/pending');
    const { data: paymentData, isLoading: loadingPayments, refetch: refetchPayments } = useFetch<any>('/admin/payment-proofs');
    const { data: transferData, isLoading: loadingTransfers, refetch: refetchTransfers } = useFetch<any>('/admin/transfers');

    const kycRequests = kycData?.data || [];
    const paymentRequests = paymentData?.data || [];
    const transferRequests = transferData?.data || [];

    // Filter Logic
    const getFilteredRequests = () => {
        let requests: any[] = [];

        // Normalize KYC
        if (activeTab === 'all' || activeTab === 'kyc') {
            requests = [...requests, ...kycRequests.map((k: any) => ({
                id: k.id,
                type: 'KYC Verification',
                user: { firstName: k.firstName, lastName: k.lastName, avatar: k.profileImage },
                details: 'Identity Verification',
                date: k.createdAt,
                status: k.kycStatus === 'pending_admin_review' ? 'Urgent' : 'Pending',
                raw: k,
                link: `/admin/users/${k.id}?tab=kyc`
            }))];
        }

        // Normalize Payments
        if (activeTab === 'all' || activeTab === 'payments') {
            requests = [...requests, ...paymentRequests.map((p: any) => ({
                id: p.id,
                type: 'Payment Proof',
                user: p.user,
                details: `₦${p.amount.toLocaleString()} - ${p.property.name}`,
                date: p.createdAt,
                status: 'Review',
                raw: p,
                link: `/admin/financials/payments` // Or deep link if available
            }))];
        }

        // Normalize Transfers (Exit/Transfer)
        if (activeTab === 'all' || activeTab === 'transfers') {
            // Filter only pending transfers if the API returns all
            const pendingTransfers = transferRequests.filter((t: any) => t.status === 'PENDING');
            requests = [...requests, ...pendingTransfers.map((t: any) => ({
                id: t.id,
                type: 'Transfer Request',
                user: t.user,
                details: `${t.type} - ${t.units} Units - ${t.property.name}`,
                date: t.createdAt,
                status: 'Pending',
                raw: t,
                link: `/admin/operations/exit-requests`
            }))];
        }

        // Sort by date desc
        return requests.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    };

    const requests = getFilteredRequests();
    const isLoading = loadingKYC || loadingPayments || loadingTransfers;

    const handleRefresh = () => {
        refetchKYC();
        refetchPayments();
        refetchTransfers();
    };

    return (
        <div className="flex-1 flex flex-col h-full overflow-hidden bg-gray-50 dark:bg-gray-900 relative">
            {/* Stats Row */}
            <div className="p-8 pb-4">
                <div className="max-w-[1200px] mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                    {/* Stat Cards */}
                    <div className="flex flex-col gap-1 rounded-lg p-5 border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-sm">
                        <div className="flex justify-between items-start">
                            <p className="text-gray-500 dark:text-gray-400 text-sm font-medium">Total Pending</p>
                            <span className="p-1 rounded bg-blue-100 text-blue-600 dark:bg-blue-900/40 dark:text-blue-400">
                                <Clock className="w-5 h-5" />
                            </span>
                        </div>
                        <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">{requests.length}</p>
                    </div>

                    <div className="flex flex-col gap-1 rounded-lg p-5 border border-red-200 dark:border-red-900/50 bg-red-50 dark:bg-red-900/10 shadow-sm">
                        <div className="flex justify-between items-start">
                            <p className="text-red-700 dark:text-red-400 text-sm font-medium">KYC Reviews</p>
                            <span className="p-1 rounded bg-red-100 text-red-600 dark:bg-red-900/40 dark:text-red-400">
                                <User className="w-5 h-5" />
                            </span>
                        </div>
                        <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">{kycRequests.length}</p>
                    </div>

                    <div className="flex flex-col gap-1 rounded-lg p-5 border border-purple-200 dark:border-purple-900/50 bg-purple-50 dark:bg-purple-900/10 shadow-sm">
                        <div className="flex justify-between items-start">
                            <p className="text-purple-700 dark:text-purple-400 text-sm font-medium">Payments</p>
                            <span className="p-1 rounded bg-purple-100 text-purple-600 dark:bg-purple-900/40 dark:text-purple-400">
                                <CreditCard className="w-5 h-5" />
                            </span>
                        </div>
                        <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">{paymentRequests.length}</p>
                    </div>

                    <div className="flex flex-col gap-1 rounded-lg p-5 border border-amber-200 dark:border-amber-900/50 bg-amber-50 dark:bg-amber-900/10 shadow-sm">
                        <div className="flex justify-between items-start">
                            <p className="text-amber-700 dark:text-amber-400 text-sm font-medium">Transfers</p>
                            <span className="p-1 rounded bg-amber-100 text-amber-600 dark:bg-amber-900/40 dark:text-amber-400">
                                <ArrowRight className="w-5 h-5" />
                            </span>
                        </div>
                        <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">{transferRequests.length}</p>
                    </div>
                </div>

                {/* Toolbar */}
                <div className="max-w-[1200px] mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-200 dark:border-gray-700 pb-2">
                    <div className="flex gap-6 overflow-x-auto no-scrollbar">
                        <button
                            onClick={() => setActiveTab('all')}
                            className={`pb-3 border-b-[3px] text-sm font-bold whitespace-nowrap transition-colors ${activeTab === 'all' ? 'border-gray-900 dark:border-white text-gray-900 dark:text-white' : 'border-transparent text-gray-500 hover:text-gray-900 dark:text-gray-400'}`}
                        >
                            All Requests <span className="ml-1 px-2 py-0.5 rounded-full bg-gray-100 dark:bg-gray-700 text-xs font-normal">{kycRequests.length + paymentRequests.length + transferRequests.length}</span>
                        </button>
                        <button
                            onClick={() => setActiveTab('kyc')}
                            className={`pb-3 border-b-[3px] text-sm font-bold whitespace-nowrap transition-colors ${activeTab === 'kyc' ? 'border-gray-900 dark:border-white text-gray-900 dark:text-white' : 'border-transparent text-gray-500 hover:text-gray-900 dark:text-gray-400'}`}
                        >
                            KYC Verification <span className="ml-1 px-2 py-0.5 rounded-full bg-gray-100 dark:bg-gray-700 text-xs font-normal">{kycRequests.length}</span>
                        </button>
                        <button
                            onClick={() => setActiveTab('payments')}
                            className={`pb-3 border-b-[3px] text-sm font-bold whitespace-nowrap transition-colors ${activeTab === 'payments' ? 'border-gray-900 dark:border-white text-gray-900 dark:text-white' : 'border-transparent text-gray-500 hover:text-gray-900 dark:text-gray-400'}`}
                        >
                            Transactions <span className="ml-1 px-2 py-0.5 rounded-full bg-gray-100 dark:bg-gray-700 text-xs font-normal">{paymentRequests.length}</span>
                        </button>
                        <button
                            onClick={() => setActiveTab('transfers')}
                            className={`pb-3 border-b-[3px] text-sm font-bold whitespace-nowrap transition-colors ${activeTab === 'transfers' ? 'border-gray-900 dark:border-white text-gray-900 dark:text-white' : 'border-transparent text-gray-500 hover:text-gray-900 dark:text-gray-400'}`}
                        >
                            Transfers <span className="ml-1 px-2 py-0.5 rounded-full bg-gray-100 dark:bg-gray-700 text-xs font-normal">{transferRequests.length}</span>
                        </button>
                    </div>

                    <div className="flex items-center gap-2">
                        <Button variant="outline" size="sm" onClick={handleRefresh} disabled={isLoading}>
                            <span className={`material-symbols-outlined mr-2 ${isLoading ? 'animate-spin' : ''}`}>refresh</span>
                            Refresh
                        </Button>
                    </div>
                </div>
            </div>

            {/* List */}
            <div className="flex-1 overflow-y-auto p-8 pt-0">
                <div className="max-w-[1200px] mx-auto flex flex-col gap-3 pb-20">
                    {/* Header Row */}
                    <div className="hidden md:grid grid-cols-12 gap-4 px-5 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                        <div className="col-span-4 pl-8">User & Request</div>
                        <div className="col-span-3">Details</div>
                        <div className="col-span-2">Date</div>
                        <div className="col-span-3 text-right">Actions</div>
                    </div>

                    {isLoading ? (
                        <div className="text-center py-12 text-gray-500">Loading requests...</div>
                    ) : requests.length === 0 ? (
                        <div className="text-center py-12 text-gray-500">
                            <CheckCircle className="w-12 h-12 mx-auto mb-2 text-gray-400" />
                            <p>No pending approvals found. All caught up!</p>
                        </div>
                    ) : (
                        requests.map((item) => (
                            <div key={`${item.type}-${item.id}`} className="group relative flex flex-col md:grid md:grid-cols-12 gap-4 items-center bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-all">
                                {/* Type Indicator Strip */}
                                <div className={`absolute left-0 top-0 bottom-0 w-1 rounded-l-lg 
                                    ${item.type === 'KYC Verification' ? 'bg-blue-500' :
                                        item.type === 'Payment Proof' ? 'bg-purple-500' :
                                            'bg-amber-500'}`}
                                />

                                {/* User Col */}
                                <div className="col-span-4 flex items-center gap-3 w-full md:pl-8">
                                    <div className="h-10 w-10 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center overflow-hidden">
                                        {item.user.avatar ? (
                                            <img src={item.user.avatar} alt="User" className="w-full h-full object-cover" />
                                        ) : (
                                            <span className="text-sm font-bold text-gray-500">{item.user.firstName?.charAt(0)}{item.user.lastName?.charAt(0)}</span>
                                        )}
                                    </div>
                                    <div className="flex flex-col min-w-0">
                                        <p className="text-sm font-bold text-gray-900 dark:text-white truncate">{item.user.firstName} {item.user.lastName}</p>
                                        <div className="flex items-center gap-2 mt-0.5">
                                            <span className={`inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-bold 
                                                ${item.type === 'KYC Verification' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300' :
                                                    item.type === 'Payment Proof' ? 'bg-purple-100 text-purple-800 dark:bg-purple-900/40 dark:text-purple-300' :
                                                        'bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300'}`}>
                                                {item.type.toUpperCase()}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                {/* Details Col */}
                                <div className="col-span-3 w-full flex flex-col justify-center">
                                    <p className="text-sm text-gray-900 dark:text-gray-200 font-medium">{item.details}</p>
                                    <p className="text-xs text-gray-500">ID: #{item.id.substring(0, 8)}</p>
                                </div>

                                {/* Date Col */}
                                <div className="col-span-2 w-full flex items-center gap-1.5">
                                    <div className={`size-2 rounded-full ${item.status === 'Urgent' ? 'bg-red-500 animate-pulse' : 'bg-green-500'}`}></div>
                                    <p className="text-sm font-medium text-gray-900 dark:text-gray-200">{new Date(item.date).toLocaleDateString()}</p>
                                </div>

                                {/* Actions Col */}
                                <div className="col-span-3 w-full flex items-center justify-end gap-2">
                                    <Link to={item.link}>
                                        <Button size="sm" className="bg-primary hover:bg-[#1f3f5e] shadow-sm flex items-center gap-1">
                                            Review
                                            <ChevronRight className="w-4 h-4" />
                                        </Button>
                                    </Link>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}

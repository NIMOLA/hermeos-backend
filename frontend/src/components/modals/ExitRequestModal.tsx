import { useState } from 'react';
import { Button } from '../../components/ui/button';
import { X, PieChart, LogOut, Info, Lock } from 'lucide-react';
import { useMutation } from '../../hooks/useApi';
import { useToast } from '../../contexts/ToastContext';

interface ExitRequestModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function ExitRequestModal({ isOpen, onClose }: ExitRequestModalProps) {
    const { showToast } = useToast();
    const [exitType, setExitType] = useState<'partial' | 'full'>('partial');
    const [amount, setAmount] = useState('');
    const [reason, setReason] = useState('');

    const { mutate: createExitRequest, isLoading } = useMutation('/api/exit-requests', 'POST', {
        onSuccess: () => {
            showToast('Exit request submitted successfully. You will be notified once processed.', 'success');
            onClose();
        },
        onError: (err) => showToast('Failed to submit exit request: ' + err.message, 'error')
    });

    if (!isOpen) return null;

    const handleSubmit = () => {
        if (!amount) {
            showToast('Please enter an amount', 'warning');
            return;
        }
        createExitRequest({
            type: exitType === 'partial' ? 'PARTIAL_EXIT' : 'FULL_EXIT',
            amount: parseFloat(amount),
            reason
        });
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-[#0e171b]/40 backdrop-blur-sm transition-opacity" onClick={onClose}></div>

            <div className="relative w-full max-w-2xl bg-surface-light dark:bg-surface-dark rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-700 overflow-hidden transform transition-all animate-in fade-in zoom-in-95 duration-200">
                {/* Header */}
                <div className="flex items-start justify-between p-6 pb-4 border-b border-slate-200 dark:border-slate-700 bg-white dark:bg-surface-dark sticky top-0 z-10">
                    <div>
                        <h2 className="text-2xl font-bold text-slate-900 dark:text-white leading-tight tracking-tight">Sell Ownership Position</h2>
                        <p className="text-slate-500 dark:text-gray-400 text-sm mt-1">Initiate a request to liquidate your equity in this asset.</p>
                    </div>
                    <button onClick={onClose} className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors text-slate-500 dark:text-gray-400">
                        <X className="w-6 h-6" />
                    </button>
                </div>

                {/* Content */}
                <div className="p-6 md:p-8 space-y-8 max-h-[80vh] overflow-y-auto">
                    {/* Asset Summary */}
                    <div className="bg-primary/10 border border-primary/20 rounded-xl p-4 flex gap-4 items-center">
                        <div className="h-16 w-24 bg-slate-200 rounded-lg shadow-sm shrink-0 overflow-hidden">
                            {/* Mock Image */}
                            <div className="w-full h-full bg-slate-300"></div>
                        </div>
                        <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                                <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-primary/10 text-primary">Residential</span>
                                <span className="text-xs text-slate-500 dark:text-gray-400">• Unit 4B</span>
                            </div>
                            <h3 className="text-slate-900 dark:text-white font-bold text-lg truncate">12A Orchid Road, Lekki Phase 1</h3>
                            <p className="text-primary text-sm font-semibold">Your Equity: ₦ 5,000,000</p>
                        </div>
                    </div>

                    <div className="space-y-6">
                        {/* Exit Type */}
                        <div>
                            <label className="block text-sm font-semibold text-slate-900 dark:text-gray-200 mb-2.5">Exit Strategy</label>
                            <div className="grid grid-cols-2 gap-2 p-1 bg-slate-100 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700">
                                <label className={`cursor-pointer group relative flex items-center justify-center gap-2 py-3 px-4 rounded-lg transition-all ${exitType === 'partial' ? 'bg-white dark:bg-card-dark shadow-sm text-primary' : 'text-slate-500 hover:text-slate-900'}`}>
                                    <input type="radio" className="sr-only" name="exit_type" value="partial" checked={exitType === 'partial'} onChange={() => setExitType('partial')} />
                                    <PieChart className="w-5 h-5" />
                                    <span className="font-medium text-sm">Partial Exit</span>
                                </label>
                                <label className={`cursor-pointer group relative flex items-center justify-center gap-2 py-3 px-4 rounded-lg transition-all ${exitType === 'full' ? 'bg-white dark:bg-card-dark shadow-sm text-primary' : 'text-slate-500 hover:text-slate-900'}`}>
                                    <input type="radio" className="sr-only" name="exit_type" value="full" checked={exitType === 'full'} onChange={() => setExitType('full')} />
                                    <LogOut className="w-5 h-5" />
                                    <span className="font-medium text-sm">Full Exit</span>
                                </label>
                            </div>
                        </div>

                        {/* Amount */}
                        <div className="grid md:grid-cols-2 gap-6">
                            <div className="relative group">
                                <label className="block text-sm font-semibold text-slate-900 dark:text-gray-200 mb-2.5 flex justify-between">
                                    <span>Amount to Resell</span>
                                </label>
                                <div className="relative flex items-center">
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                        <span className="text-slate-500 font-bold text-lg">₦</span>
                                    </div>
                                    <input
                                        type="number"
                                        value={amount}
                                        onChange={(e) => setAmount(e.target.value)}
                                        className="block w-full pl-10 pr-4 py-3.5 bg-white dark:bg-surface-dark border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white placeholder-slate-300 focus:ring-2 focus:ring-primary/20 focus:border-primary text-lg font-medium outline-none transition-shadow shadow-sm"
                                        placeholder="0.00"
                                    />
                                </div>
                                <div className="mt-2 flex justify-between items-center text-xs">
                                    <span className="text-slate-500">Max available: ₦ 5,000,000</span>
                                    <button onClick={() => setAmount('5000000')} className="text-primary hover:underline decoration-dashed underline-offset-2 font-medium">Use Max</button>
                                </div>
                            </div>

                            {/* Reason */}
                            <div>
                                <label className="block text-sm font-semibold text-slate-900 dark:text-gray-200 mb-2.5">
                                    Reason for Exit <span className="font-normal text-slate-500">(Optional)</span>
                                </label>
                                <textarea
                                    value={reason}
                                    onChange={(e) => setReason(e.target.value)}
                                    className="block w-full px-4 py-3.5 bg-white dark:bg-surface-dark border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white placeholder-slate-300 focus:ring-2 focus:ring-primary/20 focus:border-primary text-sm outline-none transition-shadow shadow-sm resize-none min-h-[56px]"
                                    placeholder="e.g. Rebalancing portfolio"
                                    rows={1}
                                />
                            </div>
                        </div>

                        {/* Info Notice */}
                        <div className="flex gap-4 p-4 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl items-start">
                            <Info className="w-6 h-6 text-primary mt-0.5 shrink-0" />
                            <div className="space-y-1">
                                <p className="text-sm font-semibold text-slate-900 dark:text-gray-200">Processing Policy</p>
                                <p className="text-xs text-slate-500 dark:text-gray-400 leading-relaxed">
                                    Exit requests are processed manually by our investment committee and are subject to market liquidity and current policy terms. Processing typically takes 3-5 business days.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="p-6 border-t border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-surface-dark/50 flex flex-col-reverse sm:flex-row sm:justify-end gap-3 rounded-b-2xl">
                    <Button variant="outline" onClick={onClose} className="w-full sm:w-auto">Cancel</Button>
                    <Button
                        onClick={handleSubmit}
                        disabled={isLoading}
                        className="w-full sm:w-auto bg-primary hover:bg-primary/90 text-white gap-2 shadow-md"
                    >
                        {isLoading ? (
                            <span>Submitting...</span>
                        ) : (
                            <>
                                <Lock className="w-4 h-4" />
                                <span>Submit Request</span>
                            </>
                        )}
                    </Button>
                </div>
            </div>
        </div>
    );
}

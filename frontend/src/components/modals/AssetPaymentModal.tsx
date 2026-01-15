import { useState, useEffect } from 'react';
import { useFetch, useMutation } from '../../hooks/useApi';
import { X, Shield, CreditCard, Landmark, Copy, Lock, ArrowRight, Building2, Calculator } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { useToast } from '../../contexts/ToastContext';

interface AssetPaymentModalProps {
    isOpen: boolean;
    onClose: () => void;
    preselectedPropertyId?: string;
}

export default function AssetPaymentModal({ isOpen, onClose, preselectedPropertyId }: AssetPaymentModalProps) {
    const { showToast } = useToast();
    const [amount, setAmount] = useState('0');
    const [units, setUnits] = useState('1');
    const [method, setMethod] = useState<'online' | 'bank'>('online');
    const [propertyId, setPropertyId] = useState<string>(preselectedPropertyId || '');

    const { data: propertiesData } = useFetch<{ data: any[] }>('/api/properties?status=PUBLISHED');
    const properties = propertiesData?.data || [];

    // Calculate Amount when Property or Units change
    useEffect(() => {
        if (propertyId && units) {
            const prop = properties.find(p => p.id === propertyId);
            if (prop) {
                const price = prop.pricePerUnit || prop.price || 0;
                setAmount((price * parseInt(units)).toString());
            }
        }
    }, [propertyId, units, properties]);

    const { mutate: payForAsset, isLoading: isPaying } = useMutation('/api/transactions/pay', 'POST', {
        onSuccess: () => {
            showToast('Payment initiated successfully! Check your email for confirmation.', 'success');
            onClose();
        },
        onError: (err) => showToast('Payment Failed: ' + err.message, 'error')
    });

    if (!isOpen) return null;

    const handleProceed = () => {
        if (!propertyId) {
            showToast('Please select a property to pay for', 'warning');
            return;
        }
        payForAsset({
            propertyId,
            units: parseInt(units),
            amount: parseFloat(amount),
            method: method === 'online' ? 'Online' : 'Bank Transfer'
        });
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <div className="absolute inset-0 bg-[#0e171b]/40 backdrop-blur-sm transition-opacity" onClick={onClose}></div>

            {/* Modal */}
            <div className="relative w-full max-w-4xl bg-surface-light dark:bg-surface-dark rounded-2xl shadow-2xl overflow-hidden z-50 flex flex-col md:flex-row min-h-[600px] animate-in fade-in zoom-in-95 duration-200">
                {/* Left Panel */}
                <div className="hidden md:flex flex-col justify-between w-1/3 bg-slate-50 dark:bg-slate-800/50 p-8 border-r border-slate-100 dark:border-slate-700/50 relative overflow-hidden group">
                    <div className="absolute -top-20 -left-20 w-64 h-64 bg-primary/10 rounded-full blur-3xl group-hover:bg-primary/15 transition-colors duration-700"></div>
                    <div className="relative z-10">
                        <div className="flex items-center gap-2 mb-8">
                            <div className="w-8 h-8 rounded bg-primary flex items-center justify-center text-white">
                                <Landmark className="w-5 h-5" />
                            </div>
                            <span className="font-bold text-lg tracking-tight text-slate-800 dark:text-white">Hermeos</span>
                        </div>
                        <h2 className="text-2xl font-bold leading-tight mb-4 text-slate-900 dark:text-white">Secure Asset Payment.</h2>
                        <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed">
                            Complete your property acquisition securely. Your funds are held in escrow until equity distribution.
                        </p>
                    </div>
                    <div className="relative z-10 mt-auto">
                        <div className="flex items-center gap-3 p-4 bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700">
                            <div className="w-10 h-10 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center text-green-600 dark:text-green-400">
                                <Shield className="w-5 h-5" />
                            </div>
                            <div>
                                <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">Security</p>
                                <p className="text-sm font-medium text-slate-900 dark:text-white">Escrow Protection</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Panel */}
                <div className="flex-1 flex flex-col w-full md:w-2/3">
                    {/* Header */}
                    <div className="flex items-center justify-between p-6 md:p-8 border-b border-slate-100 dark:border-slate-700">
                        <div>
                            <h1 className="text-xl md:text-2xl font-bold text-slate-900 dark:text-white">Pay for Asset</h1>
                            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Select asset and units to purchase.</p>
                        </div>
                        <button onClick={onClose} className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-400 transition-colors">
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    {/* Content */}
                    <div className="flex-1 overflow-y-auto p-6 md:p-8 space-y-8">

                        {/* inputs grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Property Selection */}
                            <div className="space-y-4 md:col-span-2">
                                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300">Select Asset</label>
                                <div className="relative">
                                    <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                                    <select
                                        value={propertyId}
                                        onChange={(e) => setPropertyId(e.target.value)}
                                        className="w-full pl-10 pr-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl appearance-none outline-none focus:ring-2 focus:ring-primary/50"
                                        disabled={!!preselectedPropertyId}
                                    >
                                        <option value="">-- Select a Property --</option>
                                        {properties.map(p => (
                                            <option key={p.id} value={p.id}>{p.name} - {new Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN' }).format(p.price || p.pricePerUnit)} / Unit</option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            {/* Units */}
                            <div className="space-y-4">
                                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300">Number of Units</label>
                                <div className="relative">
                                    <Calculator className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                                    <input
                                        type="number"
                                        min="1"
                                        value={units}
                                        onChange={(e) => setUnits(e.target.value)}
                                        className="w-full pl-10 pr-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl appearance-none outline-none focus:ring-2 focus:ring-primary/50"
                                    />
                                </div>
                            </div>

                            {/* Total Amount Readonly */}
                            <div className="space-y-4">
                                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300">Total Amount (NGN)</label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                        <span className="text-slate-400 font-bold">₦</span>
                                    </div>
                                    <input
                                        value={new Intl.NumberFormat('en-NG').format(parseFloat(amount))}
                                        readOnly
                                        className="w-full pl-8 pr-4 py-3 bg-slate-100 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-xl font-bold text-slate-700 dark:text-slate-200"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Tabs */}
                        <div className="grid grid-cols-2 gap-1 p-1 bg-slate-100 dark:bg-slate-800 rounded-lg">
                            <button
                                onClick={() => setMethod('online')}
                                className={`flex items-center justify-center gap-2 py-2.5 px-4 rounded-md text-sm font-semibold transition-all ${method === 'online' ? 'bg-white dark:bg-slate-700 shadow-sm text-primary dark:text-white ring-1 ring-slate-200 dark:ring-slate-600' : 'text-slate-500 dark:text-slate-400 hover:text-slate-700'}`}
                            >
                                <CreditCard className="w-4 h-4" />
                                Online Payment
                            </button>
                            <button
                                onClick={() => setMethod('bank')}
                                className={`flex items-center justify-center gap-2 py-2.5 px-4 rounded-md text-sm font-semibold transition-all ${method === 'bank' ? 'bg-white dark:bg-slate-700 shadow-sm text-primary dark:text-white ring-1 ring-slate-200 dark:ring-slate-600' : 'text-slate-500 dark:text-slate-400 hover:text-slate-700'}`}
                            >
                                <Landmark className="w-4 h-4" />
                                Bank Transfer
                            </button>
                        </div>

                        {method === 'online' ? (
                            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">

                                <div className="bg-background-light dark:bg-slate-800/50 rounded-xl p-5 border border-slate-100 dark:border-slate-700 space-y-3">
                                    <div className="flex justify-between items-center text-sm">
                                        <span className="text-slate-500 dark:text-slate-400">Processing Fee (1.5%)</span>
                                        <span className="font-mono text-slate-700 dark:text-slate-300">₦ {new Intl.NumberFormat('en-NG').format(parseFloat(amount) * 0.015)}</span>
                                    </div>
                                    <div className="h-px bg-slate-200 dark:bg-slate-700 w-full my-2"></div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-sm font-semibold text-slate-700 dark:text-white">Total Charge</span>
                                        <span className="text-lg font-bold text-primary font-mono">₦ {new Intl.NumberFormat('en-NG').format(parseFloat(amount) * 1.015)}</span>
                                    </div>
                                </div>

                                <Button
                                    onClick={handleProceed}
                                    disabled={isPaying || parseFloat(amount) <= 0}
                                    className="w-full h-14 bg-primary hover:bg-primary/90 text-white font-bold rounded-xl shadow-lg shadow-primary/25 text-base gap-2"
                                >
                                    {isPaying ? 'Processing...' : (
                                        <>
                                            <span>Proceed to Secure Payment</span>
                                            <ArrowRight className="w-5 h-5" />
                                        </>
                                    )}
                                </Button>

                                <div className="flex items-center justify-center gap-2 pt-2 grayscale opacity-60">
                                    <Lock className="w-4 h-4" />
                                    <span className="text-xs font-medium">Secured by Paystack</span>
                                </div>
                            </div>
                        ) : (
                            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
                                <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden relative">
                                    <div className="absolute top-0 left-0 w-1 h-full bg-slate-300 dark:bg-slate-600"></div>
                                    <div className="p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                                        <div className="flex items-start gap-4">
                                            <div className="w-10 h-10 rounded-lg bg-slate-100 dark:bg-slate-700 flex items-center justify-center shrink-0">
                                                <Landmark className="w-6 h-6 text-slate-500 dark:text-slate-400" />
                                            </div>
                                            <div>
                                                <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Hermeos Corporate Bank</p>
                                                <div className="flex items-center gap-2">
                                                    <p className="text-xl font-mono font-bold text-slate-900 dark:text-white tracking-wide">0034921902</p>
                                                    <button className="text-primary hover:text-primary/80 p-1 rounded hover:bg-primary/10 transition-colors" title="Copy Account Number">
                                                        <Copy className="w-4 h-4" />
                                                    </button>
                                                </div>
                                                <p className="text-xs text-slate-400 mt-1">Ref: Your Invoice #INV-8829</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="space-y-4">
                                    <div className="p-4 bg-blue-50 dark:bg-blue-900/10 text-blue-800 dark:text-blue-300 text-sm rounded-lg border border-blue-100 dark:border-blue-800">
                                        Please transfer <strong>₦{new Intl.NumberFormat('en-NG').format(parseFloat(amount))}</strong> to the account above.
                                    </div>
                                    <Button
                                        onClick={handleProceed}
                                        disabled={isPaying || parseFloat(amount) <= 0}
                                        className="w-full bg-slate-900 text-white hover:bg-slate-800"
                                    >
                                        I Have Made the Transfer
                                    </Button>
                                    <div className="text-center text-xs text-slate-500">
                                        Clicking above creates a pending transaction. You must upload proof subsequently.
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

import { useState } from 'react';
import { X, CloudUpload, Receipt, Lock, ArrowRight, Building2, Calculator, Calendar } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { useFetch, useMutation } from '../../hooks/useApi';
import { useToast } from '../../contexts/ToastContext';

interface PaymentProofModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function PaymentProofModal({ isOpen, onClose }: PaymentProofModalProps) {
    const { showToast } = useToast();
    const [propertyId, setPropertyId] = useState('');
    const [units, setUnits] = useState('1');
    const [amount, setAmount] = useState('');
    const [date, setDate] = useState('');
    const [refId, setRefId] = useState('');
    const [depositorName, setDepositorName] = useState('');
    const [file, setFile] = useState<File | null>(null);
    const [uploading, setUploading] = useState(false);

    const { data: propertiesData } = useFetch<{ data: any[] }>('/api/properties?status=PUBLISHED');
    const properties = propertiesData?.data || [];

    // Upload Mutation
    const { mutate: uploadFile } = useMutation('/api/upload', 'POST', {
        onSuccess: (data: any) => {
            // After upload, submit proof
            const fileUrl = data.url || data.file.path; // Adjust based on API response
            submitProof({
                propertyId,
                units: parseInt(units),
                amount: parseFloat(amount),
                depositorName,
                transferDate: date,
                transferReference: refId,
                proofUrl: fileUrl
            });
        },
        onError: () => {
            setUploading(false);
            showToast('File upload failed. Please try again.', 'error');
        }
    });

    // Submit Proof Mutation
    const { mutate: submitProof, isLoading: isSubmitting } = useMutation('/api/payments/bank-transfer/submit-proof', 'POST', {
        onSuccess: () => {
            setUploading(false);
            showToast('Payment proof submitted successfully! Your submission is under review.', 'success');
            onClose();
        },
        onError: (err) => {
            setUploading(false);
            showToast('Submission failed: ' + err.message, 'error');
        }
    });

    if (!isOpen) return null;

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setFile(e.target.files[0]);
        }
    };

    const handleSubmit = () => {
        if (!propertyId || !amount || !date || !file || !depositorName) {
            alert('Please fill all required fields and upload receipt.');
            return;
        }

        setUploading(true);

        const formData = new FormData();
        formData.append('file', file);
        uploadFile(formData); // This triggers the upload, then onSuccess calls submitProof
    };

    // Auto-calculate amount if property selected
    const handleUnitsChange = (val: string) => {
        setUnits(val);
        if (propertyId) {
            const prop = properties.find(p => p.id === propertyId);
            if (prop) {
                // Assuming prop.pricePerUnit or prop.price exists
                const price = prop.pricePerUnit || prop.price || 0;
                setAmount((price * parseInt(val || '0')).toString());
            }
        }
    };

    const handlePropertyChange = (val: string) => {
        setPropertyId(val);
        const prop = properties.find(p => p.id === val);
        if (prop) {
            const price = prop.pricePerUnit || prop.price || 0;
            setAmount((price * parseInt(units || '0')).toString());
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-slate-900/30 backdrop-blur-sm transition-opacity" onClick={onClose}></div>

            <div className="relative w-full max-w-2xl flex flex-col bg-white dark:bg-surface-dark rounded-xl shadow-2xl overflow-hidden transform transition-all animate-in fade-in zoom-in-95 duration-200 h-[90vh]">
                {/* Header */}
                <div className="flex items-center justify-between px-8 pt-8 pb-4 border-b border-slate-100 dark:border-slate-700">
                    <div>
                        <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">Submit Payment Proof</h2>
                        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Verify your bank transfer details.</p>
                    </div>
                    <button onClick={onClose} className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors text-slate-400">
                        <X className="w-6 h-6" />
                    </button>
                </div>

                {/* Body */}
                <div className="flex-1 overflow-y-auto px-8 py-6 space-y-6">

                    {/* Property & Units */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Property</label>
                            <div className="relative">
                                <Building2 className="absolute left-3 top-2.5 text-slate-400 w-5 h-5" />
                                <select
                                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-lg outline-none focus:ring-2 focus:ring-primary/50"
                                    value={propertyId}
                                    onChange={(e) => handlePropertyChange(e.target.value)}
                                >
                                    <option value="">Select Property...</option>
                                    {properties.map(p => (
                                        <option key={p.id} value={p.id}>{p.name}</option>
                                    ))}
                                </select>
                            </div>
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Units</label>
                            <div className="relative">
                                <Calculator className="absolute left-3 top-2.5 text-slate-400 w-5 h-5" />
                                <input
                                    type="number"
                                    min="1"
                                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-lg outline-none focus:ring-2 focus:ring-primary/50"
                                    value={units}
                                    onChange={(e) => handleUnitsChange(e.target.value)}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Amount & Date */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Amount Paid (₦)</label>
                            <input
                                className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-lg outline-none focus:ring-2 focus:ring-primary/50"
                                value={amount}
                                onChange={(e) => setAmount(e.target.value)}
                                placeholder="0.00"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Date of Transfer</label>
                            <div className="relative">
                                <Calendar className="absolute left-3 top-2.5 text-slate-400 w-5 h-5" />
                                <input
                                    type="date"
                                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-lg outline-none focus:ring-2 focus:ring-primary/50"
                                    value={date}
                                    onChange={(e) => setDate(e.target.value)}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Reference & Name */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Trans. Reference (Optional)</label>
                            <div className="relative">
                                <Receipt className="absolute left-3 top-2.5 text-slate-400 w-5 h-5" />
                                <input
                                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-lg outline-none focus:ring-2 focus:ring-primary/50"
                                    value={refId}
                                    onChange={(e) => setRefId(e.target.value)}
                                    placeholder="Bank Ref / Session ID"
                                />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Depositor Name</label>
                            <input
                                className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-lg outline-none focus:ring-2 focus:ring-primary/50"
                                value={depositorName}
                                onChange={(e) => setDepositorName(e.target.value)}
                                placeholder="Name on Account Verified"
                            />
                        </div>
                    </div>

                    {/* Upload Zone */}
                    <div className="mt-2">
                        <label className="block text-sm font-semibold text-slate-900 dark:text-white mb-2">Upload Receipt</label>
                        <div className="group relative flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-800/50 hover:bg-slate-100 dark:hover:bg-slate-800 hover:border-primary/50 transition-all cursor-pointer py-8 px-6">
                            <input type="file" accept=".jpg,.png,.pdf" className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" onChange={handleFileChange} />
                            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 dark:bg-primary/20 mb-3 group-hover:scale-110 transition-transform duration-300">
                                <CloudUpload className="w-6 h-6 text-primary" />
                            </div>
                            <p className="text-slate-900 dark:text-white text-sm font-medium text-center">
                                {file ? (
                                    <span className="text-emerald-600 dark:text-emerald-400">{file.name}</span>
                                ) : (
                                    <>
                                        <span className="text-primary font-bold hover:underline">Click to upload</span> or drag and drop
                                    </>
                                )}
                            </p>
                            <p className="text-slate-400 text-xs text-center mt-1">MAX 5MB (JPG, PNG, PDF)</p>
                        </div>
                    </div>

                </div>

                {/* Footer */}
                <div className="px-8 py-6 bg-slate-50 dark:bg-slate-800/50 border-t border-slate-200 dark:border-slate-700 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400 select-none">
                        <Lock className="w-4 h-4" />
                        <span className="text-xs font-medium">Encrypted Submission</span>
                    </div>
                    <div className="flex items-center gap-3 w-full sm:w-auto">
                        <Button variant="outline" onClick={onClose} className="flex-1 sm:flex-none">Cancel</Button>
                        <Button
                            onClick={handleSubmit}
                            disabled={uploading || isSubmitting}
                            className="flex-1 sm:flex-none bg-primary hover:bg-primary/90 text-white gap-2 shadow-lg"
                        >
                            {uploading || isSubmitting ? 'Uploading...' : (
                                <>
                                    <span>Submit Proof</span>
                                    <ArrowRight className="w-5 h-5" />
                                </>
                            )}
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}

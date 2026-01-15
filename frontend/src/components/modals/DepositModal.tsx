import { useState } from 'react';
import { Button } from '../ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { UploadCloud, CheckCircle2, Copy } from 'lucide-react';
import { apiClient } from '../../hooks/useApi';

interface DepositModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function DepositModal({ isOpen, onClose }: DepositModalProps) {
    const [amount, setAmount] = useState('');
    const [file, setFile] = useState<File | null>(null);
    const [uploading, setUploading] = useState(false);
    const [step, setStep] = useState<'input' | 'success'>('input');

    const handleCopy = (text: string) => {
        navigator.clipboard.writeText(text);
        alert('Copied to clipboard');
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setFile(e.target.files[0]);
        }
    };

    const handleBankTransferSubmit = async () => {
        if (!amount || !file) return alert('Please enter amount and upload proof.');

        setUploading(true);
        try {
            // 1. Upload File
            const formData = new FormData();
            formData.append('file', file);
            const uploadRes = await apiClient.post<any>('/upload', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });

            if (!uploadRes.success) throw new Error('File upload failed');

            // 2. Create Deposit Record
            await apiClient.post('/transactions/deposit', {
                amount: Number(amount),
                type: 'BANK_TRANSFER',
                proofUrl: uploadRes.data.url,
                description: 'Wallet Deposit via Bank Transfer'
            });

            setStep('success');
        } catch (error) {
            console.error(error);
            alert('Failed to submit deposit. Please try again.');
        } finally {
            setUploading(false);
        }
    };

    const handleOnlinePayment = () => {
        alert('Redirecting to Payment Gateway... (Mock)');
        // Implement Paystack/Flutterwave integration here
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Fund Your Wallet</DialogTitle>
                </DialogHeader>

                {step === 'success' ? (
                    <div className="flex flex-col items-center justify-center p-6 text-center space-y-4">
                        <CheckCircle2 className="w-16 h-16 text-green-500" />
                        <h3 className="text-xl font-bold">Deposit Submitted!</h3>
                        <p className="text-gray-500 text-sm">
                            Your payment proof has been received. Your wallet will be credited once verified (usually within 2 hours).
                        </p>
                        <Button onClick={onClose} className="w-full">Done</Button>
                    </div>
                ) : (
                    <Tabs defaultValue="online" className="w-full">
                        <TabsList className="grid w-full grid-cols-2">
                            <TabsTrigger value="online">Online Payment</TabsTrigger>
                            <TabsTrigger value="bank">Bank Transfer</TabsTrigger>
                        </TabsList>

                        <div className="py-4">
                            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Amount (₦)</label>
                            <input
                                type="number"
                                value={amount}
                                onChange={(e) => setAmount(e.target.value)}
                                className="w-full mt-1 p-2 border rounded-md dark:bg-slate-800 dark:border-slate-700"
                                placeholder="e.g. 50,000"
                            />
                        </div>

                        <TabsContent value="online" className="space-y-4">
                            <p className="text-sm text-gray-500">
                                Pay securely using your card, USSD, or Bank Transfer via our payment partners. Instant credit.
                            </p>
                            <Button onClick={handleOnlinePayment} className="w-full bg-primary" disabled={!amount}>
                                Pay Now using Paystack
                            </Button>
                        </TabsContent>

                        <TabsContent value="bank" className="space-y-4">
                            <div className="bg-gray-50 dark:bg-slate-800 p-4 rounded-lg space-y-3 text-sm border border-gray-100 dark:border-slate-700">
                                <div className="flex justify-between">
                                    <span className="text-gray-500">Bank Name</span>
                                    <span className="font-medium">Hermeos Trust / Providus</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-500">Account Number</span>
                                    <div className="flex items-center gap-2">
                                        <span className="font-mono font-bold">9988776655</span>
                                        <Copy onClick={() => handleCopy('9988776655')} className="w-3 h-3 cursor-pointer text-primary" />
                                    </div>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-500">Acct Name</span>
                                    <span className="font-medium">Hermeos Proptech Ltd</span>
                                </div>
                            </div>

                            <div className="border-2 border-dashed border-gray-300 dark:border-slate-600 rounded-lg p-6 flex flex-col items-center justify-center text-center cursor-pointer hover:bg-gray-50 dark:hover:bg-slate-800/50 transition-colors relative">
                                <input
                                    type="file"
                                    accept="image/*,.pdf"
                                    className="absolute inset-0 opacity-0 cursor-pointer"
                                    onChange={handleFileChange}
                                />
                                <UploadCloud className="w-8 h-8 text-gray-400 mb-2" />
                                {file ? (
                                    <p className="text-sm font-medium text-primary break-all">{file.name}</p>
                                ) : (
                                    <>
                                        <p className="text-sm font-medium">Click to upload proof</p>
                                        <p className="text-xs text-gray-400">JPG, PNG or PDF</p>
                                    </>
                                )}
                            </div>

                            <Button onClick={handleBankTransferSubmit} className="w-full" disabled={uploading || !amount || !file}>
                                {uploading ? 'Uploading...' : 'Submit Payment Proof'}
                            </Button>
                        </TabsContent>
                    </Tabs>
                )}
            </DialogContent>
        </Dialog>
    );
}

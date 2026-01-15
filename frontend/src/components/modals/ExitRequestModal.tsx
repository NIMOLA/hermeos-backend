import { useState } from 'react';
import { Button } from '../ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '../ui/dialog';
import { Checkbox } from '../ui/checkbox';
import { apiClient } from '../../hooks/useApi';

interface ExitRequestModalProps {
    isOpen: boolean;
    onClose: () => void;
    holding: {
        id: string;
        name: string;
        currentValue: number;
        ownershipPercent: number;
    } | null;
}

export default function ExitRequestModal({ isOpen, onClose, holding }: ExitRequestModalProps) {
    const [reason, setReason] = useState('');
    const [agreed, setAgreed] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleSubmit = async () => {
        if (!holding) return;
        if (!agreed) return alert('Please agree to the exit policy.');

        setLoading(true);
        try {
            await apiClient.post(`/portfolio/holdings/${holding.id}/exit-request`, {
                reason,
                requestedAmount: holding.currentValue // Requesting full exit by default
            });
            alert('Exit request submitted successfully. An admin will review your request.');
            onClose();
        } catch (error) {
            console.error(error);
            alert('Failed to submit exit request.');
        } finally {
            setLoading(false);
        }
    };

    if (!holding) return null;

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle>Request Exit: {holding.name}</DialogTitle>
                </DialogHeader>

                <div className="space-y-4 py-4">
                    <div className="bg-amber-50 dark:bg-amber-900/20 p-4 rounded-lg border border-amber-100 dark:border-amber-800 text-sm text-amber-800 dark:text-amber-200">
                        <p className="font-bold mb-1">Important Disclosure</p>
                        <p>
                            Secondary market liquidity is not guaranteed.
                            Exit requests are processed based on available buyer interest or buyback windows.
                            Processing time may vary from 30 to 90 days.
                        </p>
                    </div>

                    <div className="grid grid-cols-2 gap-4 text-sm">
                        <div className="bg-gray-50 dark:bg-slate-800 p-3 rounded">
                            <span className="block text-gray-500">Ownership Share</span>
                            <span className="font-bold">{holding.ownershipPercent.toFixed(2)}%</span>
                        </div>
                        <div className="bg-gray-50 dark:bg-slate-800 p-3 rounded">
                            <span className="block text-gray-500">Current Valuation</span>
                            <span className="font-bold">₦ {holding.currentValue.toLocaleString()}</span>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-1">Reason for Exit (Optional)</label>
                        <textarea
                            className="w-full p-2 border rounded-md dark:bg-slate-800 dark:border-slate-700"
                            rows={3}
                            value={reason}
                            onChange={(e) => setReason(e.target.value)}
                            placeholder="e.g. Need liquidity, Rebalancing portfolio..."
                        />
                    </div>

                    <div className="flex items-start space-x-2">
                        <Checkbox id="terms" checked={agreed} onCheckedChange={(checked) => setAgreed(checked as boolean)} />
                        <label
                            htmlFor="terms"
                            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-gray-600 dark:text-gray-300"
                        >
                            I understand that the final exit price may vary based on market valuation at the time of sale, and a 2% administrative fee applies.
                        </label>
                    </div>
                </div>

                <DialogFooter>
                    <Button variant="outline" onClick={onClose}>Cancel</Button>
                    <Button onClick={handleSubmit} disabled={!agreed || loading} className="bg-red-600 hover:bg-red-700 text-white">
                        {loading ? 'Submitting...' : 'Confirm Exit Request'}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}

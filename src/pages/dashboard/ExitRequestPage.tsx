
import { Button } from '../../components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/card';

export default function ExitRequestPage() {
    return (
        <div className="max-w-3xl mx-auto p-6 space-y-8">
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">Exit Request</h1>
            <p className="text-slate-500 dark:text-slate-400">
                Submit a request to liquidate your holdings in a specific asset. This process is subject to approval and market availability.
            </p>

            <Card>
                <CardHeader>
                    <CardTitle>Select Asset to Liquidate</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="space-y-4">
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">Asset</label>
                        <select className="w-full px-3 py-2.5 border border-slate-300 dark:border-slate-700 rounded-lg dark:bg-[#1a2632] dark:text-white focus:ring-primary focus:border-primary">
                            <option>Select an asset...</option>
                            <option>Oceanview Apartments, Lekki (10 Units)</option>
                            <option>Greenfield Estate, Abuja (5 Units)</option>
                        </select>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">Units to Sell</label>
                            <input type="number" className="w-full px-3 py-2.5 border border-slate-300 dark:border-slate-700 rounded-lg dark:bg-[#1a2632] dark:text-white focus:ring-primary focus:border-primary" placeholder="e.g. 5" />
                        </div>
                        <div className="space-y-2">
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">Target Price / Unit (₦)</label>
                            <input type="number" className="w-full px-3 py-2.5 border border-slate-300 dark:border-slate-700 rounded-lg dark:bg-[#1a2632] dark:text-white focus:ring-primary focus:border-primary" placeholder="Market Price: ₦55,000" />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">Reason for Exit (Optional)</label>
                        <textarea className="w-full px-3 py-2.5 border border-slate-300 dark:border-slate-700 rounded-lg dark:bg-[#1a2632] dark:text-white focus:ring-primary focus:border-primary resize-none" rows={3} placeholder="Tell us why you refer to exit..." />
                    </div>

                    <div className="bg-yellow-50 dark:bg-yellow-900/10 p-4 rounded-lg border border-yellow-100 dark:border-yellow-900/30">
                        <div className="flex gap-2">
                            <span className="material-symbols-outlined text-yellow-600 dark:text-yellow-400">info</span>
                            <p className="text-sm text-yellow-800 dark:text-yellow-200">
                                <span className="font-bold">Important:</span> Exit requests typically take 5-10 business days to process. A 2% processing fee applies to all secondary market sales.
                            </p>
                        </div>
                    </div>

                    <Button className="w-full">Submit Exit Request</Button>
                </CardContent>
            </Card>
        </div>
    );
}

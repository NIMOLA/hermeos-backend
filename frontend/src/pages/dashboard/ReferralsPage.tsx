import { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { Button } from '../../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Copy, Users, Wallet, Gift } from 'lucide-react';

export default function ReferralsPage() {
    const { user } = useAuth();
    const referralLink = `https://app.hermeos.ng/signup?ref=${user?.id || 'USER123'}`;
    const [copied, setCopied] = useState(false);

    const handleCopy = () => {
        navigator.clipboard.writeText(referralLink);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col gap-2">
                <h1 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white">Referrals</h1>
                <p className="text-slate-500 dark:text-slate-400">Invite friends and earn rewards when they invest.</p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card>
                    <CardContent className="p-6 flex items-center gap-4">
                        <div className="bg-blue-100 dark:bg-blue-900/30 p-3 rounded-full text-blue-600 dark:text-blue-400">
                            <Users className="w-8 h-8" />
                        </div>
                        <div>
                            <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Total Referrals</p>
                            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">0</h2>
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="p-6 flex items-center gap-4">
                        <div className="bg-emerald-100 dark:bg-emerald-900/30 p-3 rounded-full text-emerald-600 dark:text-emerald-400">
                            <Wallet className="w-8 h-8" />
                        </div>
                        <div>
                            <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Earnings</p>
                            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">₦0.00</h2>
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="p-6 flex items-center gap-4">
                        <div className="bg-purple-100 dark:bg-purple-900/30 p-3 rounded-full text-purple-600 dark:text-purple-400">
                            <Gift className="w-8 h-8" />
                        </div>
                        <div>
                            <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Pending Rewards</p>
                            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">₦0.00</h2>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Invite Section */}
            <Card className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white border-none">
                <CardContent className="p-8 flex flex-col md:flex-row items-center justify-between gap-6">
                    <div className="space-y-2">
                        <h3 className="text-2xl font-bold">Invite & Earn</h3>
                        <p className="text-blue-100 max-w-lg">
                            Share your unique link with friends. When they sign up and make their first investment of ₦500,000 or more, you both get a ₦5,000 bonus!
                        </p>
                    </div>
                    <div className="bg-white/10 backdrop-blur-sm p-4 rounded-xl flex items-center gap-3 w-full md:w-auto min-w-[320px]">
                        <code className="flex-1 text-sm font-mono truncate bg-transparent outline-none text-white">
                            {referralLink}
                        </code>
                        <Button
                            variant="secondary"
                            size="sm"
                            onClick={handleCopy}
                            className="bg-white text-blue-700 hover:bg-blue-50"
                        >
                            {copied ? <span className="flex items-center gap-1">Copied!</span> : <span className="flex items-center gap-1"><Copy className="w-4 h-4" /> Copy</span>}
                        </Button>
                    </div>
                </CardContent>
            </Card>

            {/* Referral History / Empty State */}
            <Card>
                <CardHeader>
                    <CardTitle>Referral History</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="text-center py-12 text-slate-500">
                        <Users className="w-12 h-12 mx-auto mb-3 opacity-20" />
                        <p>No referrals yet. Share your link to get started!</p>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}

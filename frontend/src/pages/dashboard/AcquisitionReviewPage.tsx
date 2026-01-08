
import { Link } from 'react-router-dom';
import { Button } from '../../components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/card';
import { useAuth } from '../../contexts/AuthContext';

export default function AcquisitionReviewPage() {
    const { user } = useAuth();

    return (
        <div className="max-w-4xl mx-auto p-6 space-y-8">
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-6">Review Acquisition</h1>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="md:col-span-2 space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Asset Details</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex gap-4">
                                <div className="w-24 h-24 bg-slate-200 rounded-lg bg-cover bg-center" style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuDKqm_3hafcwEcIR-Qmz-d51w8bXcoC9yeG04p41z5x-YlQUTefqqy9NfGBtY-u6Bo2XxxvmHJpX_NtYSuDUJmC1l_YovzXDAdG8OXsBQhw9qCDrRUoIAwDnnqKjwnz8MLimhjfEoWN8SJnsDeNZpS8a0JCpY8wzDYkwei5Ki8dpLZGRuYGV-Cnpe3NEyzMZX3WVoZC-1V-n1zMzDVtbMi6ca5IGSJWnf4qVONysTjHyGgvkCFQv5iuMvfVLEmF14bIlT9FLjNxi547")' }}></div>
                                <div>
                                    <h3 className="font-bold text-lg text-slate-900 dark:text-white">Oceanview Apartments, Lekki</h3>
                                    <p className="text-slate-500 text-sm">Residential • Completed 2022</p>
                                    <div className="flex items-center gap-2 mt-2">
                                        <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 text-xs rounded-full font-bold">12% Net Yield</span>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Transaction Summary</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            <div className="flex justify-between text-sm">
                                <span className="text-slate-600 dark:text-slate-400">Unit Price</span>
                                <span className="font-medium text-slate-900 dark:text-white">₦50,000.00</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-slate-600 dark:text-slate-400">Quantity</span>
                                <span className="font-medium text-slate-900 dark:text-white">10 Units</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-slate-600 dark:text-slate-400">Transaction Fee (1.5%)</span>
                                <span className="font-medium text-slate-900 dark:text-white">₦7,500.00</span>
                            </div>
                            <div className="border-t border-slate-200 dark:border-slate-700 my-2"></div>
                            <div className="flex justify-between text-lg font-bold">
                                <span className="text-slate-900 dark:text-white">Total Amount</span>
                                <span className="text-primary">₦507,500.00</span>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                <div className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Payment Method</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex items-center gap-3 p-3 border border-primary bg-blue-50 dark:bg-blue-900/20 rounded-lg cursor-pointer">
                                <span className="material-symbols-outlined text-primary">account_balance_wallet</span>
                                <div>
                                    <p className="text-sm font-bold text-slate-900 dark:text-white">Hermeos Wallet</p>
                                    <p className="text-xs text-slate-500">Balance: ₦2,500,000.00</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3 p-3 border border-slate-200 dark:border-slate-700 rounded-lg cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800 opacity-50">
                                <span className="material-symbols-outlined text-slate-500">credit_card</span>
                                <div>
                                    <p className="text-sm font-bold text-slate-900 dark:text-white">Bank Transfer</p>
                                    <p className="text-xs text-slate-500">Direct deposit</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <div className="flex flex-col gap-3">
                        {user?.isVerified ? (
                            <Link to="/payment/status">
                                <Button className="w-full h-12 text-lg shadow-lg">Confirm Purchase</Button>
                            </Link>
                        ) : (
                            <Link to="/kyc/info">
                                <Button className="w-full h-12 text-lg shadow-lg bg-amber-500 hover:bg-amber-600">
                                    <span className="material-symbols-outlined mr-2">verified_user</span>
                                    Verify Identity to Invest
                                </Button>
                            </Link>
                        )}
                        <Link to="/properties/details">
                            <Button variant="outline" className="w-full">Cancel</Button>
                        </Link>
                        <p className="text-xs text-center text-slate-500 mt-2">
                            {user?.isVerified
                                ? "By clicking confirm, you agree to the Terms of Purchase and Co-Ownership Agreement."
                                : "Identity verification is required to complete this investment under regulatory guidelines."}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}

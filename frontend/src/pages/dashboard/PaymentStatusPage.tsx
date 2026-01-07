
import { Link } from 'react-router-dom';
import { Button } from '../../components/ui/button';

export default function PaymentStatusPage() {
    // Mock success state
    const isSuccess = true;

    return (
        <div className="min-h-[80vh] flex flex-col items-center justify-center p-6 text-center">
            <div className={`rounded-full p-6 mb-6 ${isSuccess ? 'bg-emerald-100 text-emerald-600' : 'bg-red-100 text-red-600'}`}>
                <span className="material-symbols-outlined text-6xl">
                    {isSuccess ? 'check_circle' : 'error'}
                </span>
            </div>

            <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">
                {isSuccess ? 'Payment Successful!' : 'Payment Failed'}
            </h1>

            <p className="text-slate-500 dark:text-slate-400 max-w-md mb-8">
                {isSuccess
                    ? 'Congratulations! You are now a co-owner of "Oceanview Apartments". Your transaction has been recorded and your ownership certificate is being generated.'
                    : 'We were unable to process your payment. Please try again or contact support if the issue persists.'}
            </p>

            <div className="flex gap-4">
                <Link to="/portfolio">
                    <Button variant="outline">View Portfolio</Button>
                </Link>
                <Link to="/properties">
                    <Button>Browse More Assets</Button>
                </Link>
            </div>
        </div>
    );
}

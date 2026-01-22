import { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { X, Cookie } from 'lucide-react';

export default function CookieConsent() {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        // Check if user has already consented
        const consented = localStorage.getItem('hermeos_cookie_consent');
        if (!consented) {
            // Show banner after a short delay
            const timer = setTimeout(() => {
                setIsVisible(true);
            }, 1000);
            return () => clearTimeout(timer);
        }
    }, []);

    const handleAccept = () => {
        localStorage.setItem('hermeos_cookie_consent', 'true');
        setIsVisible(false);
    };

    const handleDecline = () => {
        localStorage.setItem('hermeos_cookie_consent', 'false');
        setIsVisible(false);
    };

    if (!isVisible) return null;

    return (
        <div className="fixed bottom-0 left-0 right-0 z-[100] p-4 animate-in slide-in-from-bottom-5 duration-500">
            <div className="max-w-4xl mx-auto bg-slate-900/95 dark:bg-slate-800/95 backdrop-blur-md text-white rounded-xl shadow-2xl border border-slate-700 p-6 flex flex-col md:flex-row items-start md:items-center gap-6">
                <div className="p-3 bg-primary/20 rounded-full shrink-0">
                    <Cookie className="h-6 w-6 text-primary" />
                </div>

                <div className="flex-1 space-y-2">
                    <h3 className="font-bold text-lg">We use cookies</h3>
                    <p className="text-slate-300 text-sm leading-relaxed">
                        We use cookies to improve your experience on our platform, analyze traffic, and ensure security.
                        By continuing to use our website, you agree to our use of cookies/data as described in our{' '}
                        <a href="/privacy" className="text-primary hover:underline font-medium">
                            Privacy Policy
                        </a>.
                    </p>
                </div>

                <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto shrink-0">
                    <Button
                        variant="ghost"
                        onClick={handleDecline}
                        className="text-slate-300 hover:text-white hover:bg-slate-800"
                    >
                        Decline
                    </Button>
                    <Button
                        onClick={handleAccept}
                        className="bg-primary hover:bg-primary/90 text-white shadow-lg whitespace-nowrap min-w-[120px]"
                    >
                        Accept All
                    </Button>
                </div>
            </div>
        </div>
    );
}

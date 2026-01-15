import React from 'react';
import { Link } from 'react-router-dom';

interface CheckoutConsentProps {
    checked: boolean;
    onCheckedChange: (checked: boolean) => void;
}

export const CheckoutConsent: React.FC<CheckoutConsentProps> = ({ checked, onCheckedChange }) => {
    return (
        <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-lg border border-slate-200 dark:border-slate-700">
            <div className="flex items-start gap-3">
                <div className="flex items-center h-5 mt-1">
                    <input
                        id="terms-consent"
                        type="checkbox"
                        className="w-5 h-5 text-primary border-slate-300 rounded focus:ring-primary cursor-pointer"
                        checked={checked}
                        onChange={(e) => onCheckedChange(e.target.checked)}
                    />
                </div>
                <div className="flex-1 text-sm">
                    <label htmlFor="terms-consent" className="font-bold text-slate-900 dark:text-white cursor-pointer select-none">
                        I agree to the Terms of Subscription and Cooperative Membership.
                    </label>
                    <div className="mt-2 text-slate-600 dark:text-slate-400 space-y-2">
                        <p>
                            By checking this box and proceeding, I explicitly agree to the{' '}
                            <Link to="/legal/terms" target="_blank" className="text-primary hover:underline font-medium">Master Terms & Conditions</Link>
                            {' '}and{' '}
                            <Link to="/legal/privacy" target="_blank" className="text-primary hover:underline font-medium">Privacy Policy</Link>.
                        </p>
                        <ul className="list-disc pl-4 space-y-1 text-xs">
                            <li><strong>Membership:</strong> My subscription automatically enrolls me as a member of Manymiles Cooperative Multipurpose Society.</li>
                            <li><strong>Agency:</strong> I authorize Hermeos Proptech to collect my funds and share my KYC data with the Cooperative.</li>
                            <li><strong>Risk:</strong> Patronage Refunds are based on asset performance and are not guaranteed.</li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
};

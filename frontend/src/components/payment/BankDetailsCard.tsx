import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { CreditCard, Building2, Check, Copy, AlertCircle } from 'lucide-react';
import { Alert, AlertDescription } from '../ui/alert';

export interface PaymentMethod {
    type: 'card' | 'bank_transfer';
    label: string;
    description: string;
    icon: React.ReactNode;
}

interface BankDetailsCardProps {
    onPaymentMethodChange: (method: 'card' | 'bank_transfer') => void;
    selectedMethod: 'card' | 'bank_transfer';
}

const BANK_DETAILS = {
    bankName: 'Premium Trust Bank',
    accountName: 'Hermeos Proptech',
    accountNumber: '0040225641'
};

export function BankDetailsCard({ onPaymentMethodChange, selectedMethod }: BankDetailsCardProps) {
    const [copiedField, setCopiedField] = useState<string | null>(null);

    const copyToClipboard = (text: string, field: string) => {
        navigator.clipboard.writeText(text);
        setCopiedField(field);
        setTimeout(() => setCopiedField(null), 2000);
    };

    const paymentMethods: PaymentMethod[] = [
        {
            type: 'card',
            label: 'Card Payment',
            description: 'Pay instantly with your debit/credit card',
            icon: <CreditCard className="w-5 h-5" />
        },
        {
            type: 'bank_transfer',
            label: 'Bank Transfer',
            description: 'Transfer to our account and upload proof',
            icon: <Building2 className="w-5 h-5" />
        }
    ];

    return (
        <div className="space-y-4">
            {/* Payment Method Selection */}
            <Card>
                <CardHeader>
                    <CardTitle>Select Payment Method</CardTitle>
                    <CardDescription>Choose how you want to pay for this investment</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                    {paymentMethods.map((method) => (
                        <button
                            key={method.type}
                            onClick={() => onPaymentMethodChange(method.type)}
                            className={`w-full p-4 rounded-lg border-2 transition-all text-left ${selectedMethod === method.type
                                    ? 'border-purple-600 bg-purple-50 dark:bg-purple-900/20'
                                    : 'border-gray-200 dark:border-gray-700 hover:border-purple-300'
                                }`}
                        >
                            <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-3">
                                    <div className={`p-2 rounded-lg ${selectedMethod === method.type
                                            ? 'bg-purple-600 text-white'
                                            : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400'
                                        }`}>
                                        {method.icon}
                                    </div>
                                    <div>
                                        <p className="font-semibold text-gray-900 dark:text-white">
                                            {method.label}
                                        </p>
                                        <p className="text-sm text-gray-500 dark:text-gray-400">
                                            {method.description}
                                        </p>
                                    </div>
                                </div>
                                {selectedMethod === method.type && (
                                    <Check className="w-5 h-5 text-purple-600" />
                                )}
                            </div>
                        </button>
                    ))}
                </CardContent>
            </Card>

            {/* Bank Transfer Details */}
            {selectedMethod === 'bank_transfer' && (
                <Card>
                    <CardHeader>
                        <CardTitle>Bank Transfer Details</CardTitle>
                        <CardDescription>
                            Transfer the exact amount to this account
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {/* Bank Name */}
                        <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                            <div>
                                <p className="text-sm text-gray-500 dark:text-gray-400">Bank Name</p>
                                <p className="font-bold text-gray-900 dark:text-white">
                                    {BANK_DETAILS.bankName}
                                </p>
                            </div>
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => copyToClipboard(BANK_DETAILS.bankName, 'bank')}
                            >
                                {copiedField === 'bank' ? (
                                    <Check className="w-4 h-4 text-green-600" />
                                ) : (
                                    <Copy className="w-4 h-4" />
                                )}
                            </Button>
                        </div>

                        {/* Account Name */}
                        <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                            <div>
                                <p className="text-sm text-gray-500 dark:text-gray-400">Account Name</p>
                                <p className="font-bold text-gray-900 dark:text-white">
                                    {BANK_DETAILS.accountName}
                                </p>
                            </div>
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => copyToClipboard(BANK_DETAILS.accountName, 'name')}
                            >
                                {copiedField === 'name' ? (
                                    <Check className="w-4 h-4 text-green-600" />
                                ) : (
                                    <Copy className="w-4 h-4" />
                                )}
                            </Button>
                        </div>

                        {/* Account Number */}
                        <div className="flex items-center justify-between p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg border-2 border-purple-200 dark:border-purple-800">
                            <div>
                                <p className="text-sm text-purple-600 dark:text-purple-400">Account Number</p>
                                <p className="text-2xl font-bold text-purple-900 dark:text-purple-100 tracking-wider">
                                    {BANK_DETAILS.accountNumber}
                                </p>
                            </div>
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => copyToClipboard(BANK_DETAILS.accountNumber, 'number')}
                                className="hover:bg-purple-100 dark:hover:bg-purple-800"
                            >
                                {copiedField === 'number' ? (
                                    <Check className="w-4 h-4 text-green-600" />
                                ) : (
                                    <Copy className="w-4 h-4 text-purple-600" />
                                )}
                            </Button>
                        </div>

                        {/* Instructions */}
                        <Alert>
                            <AlertCircle className="h-4 w-4" />
                            <AlertDescription>
                                <p className="font-semibold mb-2">Important Instructions:</p>
                                <ul className="list-disc list-inside space-y-1 text-sm">
                                    <li>Transfer the exact investment amount</li>
                                    <li>Upload your transfer receipt on the next page</li>
                                    <li>Admin will verify within 24 hours</li>
                                    <li>You'll receive a notification once approved</li>
                                </ul>
                            </AlertDescription>
                        </Alert>
                    </CardContent>
                </Card>
            )}
        </div>
    );
}

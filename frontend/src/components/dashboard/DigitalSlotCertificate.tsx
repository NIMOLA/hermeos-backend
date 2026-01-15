
import React from 'react';

interface SlotCertificateProps {
    holderName: string;
    membershipId: string;
    slots: number;
    propertyName: string;
    location: string;
    certNumber?: string;
    issueDate?: string;
}

export const DigitalSlotCertificate: React.FC<SlotCertificateProps> = ({
    holderName,
    membershipId,
    slots,
    propertyName,
    location,
    certNumber = "IRE-2026-X001",
    issueDate = new Date().toLocaleDateString()
}) => {
    return (
        <div className="w-full max-w-2xl mx-auto bg-white border-[10px] border-double border-slate-200 p-8 shadow-2xl relative overflow-hidden">
            {/* Watermark or Background Texture */}
            <div className="absolute inset-0 flex items-center justify-center opacity-[0.03] pointer-events-none">
                <span className="material-symbols-outlined text-[400px]">verified_user</span>
            </div>

            <div className="relative z-10 text-center space-y-6">
                {/* Header */}
                <div className="border-b-2 border-slate-900 pb-4 mb-8">
                    <h1 className="text-3xl font-serif font-bold text-slate-900 uppercase tracking-widest">Certificate of Beneficial Ownership</h1>
                    <p className="text-xs text-slate-500 mt-2 uppercase tracking-wide">Issued by Manymiles Cooperative Multipurpose Society</p>
                </div>

                {/* Content */}
                <div className="space-y-4 font-serif">
                    <p className="text-lg italic text-slate-600">This certifies that</p>
                    <h2 className="text-2xl font-bold text-slate-900 uppercase">{holderName}</h2>
                    <p className="text-sm font-bold text-slate-500 uppercase">(Membership ID: {membershipId})</p>

                    <p className="text-lg text-slate-600 px-8 leading-relaxed">
                        Is the registered holder of <span className="font-bold text-slate-900">{slots} SLOTS</span> in the Real Estate Asset known as:
                    </p>

                    <div className="bg-slate-50 border border-slate-200 p-4 rounded-lg inline-block w-full max-w-md">
                        <h3 className="text-xl font-bold text-primary">{propertyName}</h3>
                        <p className="text-sm text-slate-500">{location}</p>
                    </div>

                    <p className="text-xs text-slate-400 max-w-lg mx-auto leading-tight pt-4">
                        TERMS: This Certificate represents a Beneficial Interest in the assets held by the Society. The holder is entitled to a proportionate share of the Patronage Refunds. Lock-in: 12 Months.
                    </p>
                </div>

                {/* Footer / Signatures */}
                <div className="grid grid-cols-2 gap-12 mt-12 pt-8">
                    <div className="flex flex-col items-center">
                        <div className="w-32 border-b border-slate-400 mb-2"></div>
                        <p className="text-xs font-bold uppercase text-slate-500">President, Manymiles Coop</p>
                    </div>
                    <div className="flex flex-col items-center">
                        <div className="w-32 border-b border-slate-400 mb-2"></div>
                        <p className="text-xs font-bold uppercase text-slate-500">Operations Lead, Hermeos</p>
                    </div>
                </div>

                {/* Metadata */}
                <div className="flex justify-between items-end mt-8 pt-4 border-t border-slate-100 text-[10px] text-slate-400 font-mono">
                    <p>CERT NO: {certNumber}</p>
                    <p>DATE: {issueDate}</p>
                </div>
            </div>
        </div>
    );
};

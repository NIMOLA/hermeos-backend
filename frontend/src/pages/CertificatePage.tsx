import React from 'react';
import { Download, Printer, Share2, X, Check, Shield } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

const CertificatePage: React.FC = () => {
    const navigate = useNavigate();

    return (
        <div className="bg-slate-100 dark:bg-slate-900 font-display min-h-screen flex flex-col relative overflow-hidden">

            {/* Blurred Background Context (Fake Dashboard) */}
            <div className="absolute inset-0 z-0 opacity-50 pointer-events-none filter blur-sm">
                <header className="flex items-center justify-between px-10 py-3 bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700">
                    <div className="flex items-center gap-4">
                        <div className="w-8 h-8 rounded bg-primary"></div>
                        <span className="font-bold text-lg text-slate-900 dark:text-white">Hermeos Proptech</span>
                    </div>
                </header>
                <div className="p-10 flex gap-8">
                    <div className="w-1/4 h-64 bg-white dark:bg-slate-800 rounded-xl"></div>
                    <div className="w-3/4 h-64 bg-white dark:bg-slate-800 rounded-xl"></div>
                </div>
            </div>

            {/* Modal Overlay */}
            <div className="absolute inset-0 z-50 flex items-center justify-center p-4 bg-black/20 backdrop-blur-sm overflow-y-auto">
                <div className="relative flex flex-col items-center w-full max-w-5xl animate-in fade-in zoom-in duration-300">

                    {/* Close Button */}
                    <button
                        onClick={() => navigate(-1)}
                        className="absolute -top-12 right-0 md:-right-12 text-white hover:text-white/80 transition-colors p-2 bg-black/20 hover:bg-black/40 rounded-full backdrop-blur-md"
                    >
                        <X className="w-6 h-6" />
                    </button>

                    {/* Certificate Paper */}
                    <div className="bg-white relative w-full aspect-[1.414/1] md:aspect-[1.5/1] max-w-[900px] shadow-2xl rounded-sm overflow-hidden flex flex-col">
                        {/* Paper Texture Pattern (CSS-based approximation) */}
                        <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'radial-gradient(#000 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>

                        {/* Borders */}
                        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-primary via-primary/80 to-primary"></div>
                        <div className="absolute bottom-0 left-0 w-full h-2 bg-gradient-to-r from-primary via-primary/80 to-primary"></div>
                        <div className="absolute inset-4 border border-primary/20 pointer-events-none z-10"></div>
                        <div className="absolute inset-[18px] border-[3px] border-primary/10 pointer-events-none z-10"></div>

                        {/* Watermark */}
                        <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-[0.03] z-0">
                            <Shield className="w-[400px] h-[400px] text-primary" />
                        </div>

                        {/* Content */}
                        <div className="relative z-20 flex flex-col h-full p-12 md:p-16 justify-between text-center text-slate-900">

                            {/* Header */}
                            <div className="flex flex-col items-center gap-4">
                                <div className="flex items-center gap-2 text-primary mb-2">
                                    <div className="flex items-center justify-center w-8 h-8 rounded bg-primary text-white shadow-sm">
                                        <Check className="w-4 h-4" />
                                    </div>
                                    <span className="font-bold text-sm tracking-widest uppercase text-primary">Hermeos Proptech</span>
                                </div>
                                <h1 className="font-serif font-bold text-4xl md:text-5xl text-primary tracking-tight">Certificate of Digital Ownership</h1>
                                <div className="w-24 h-[2px] bg-yellow-600 mt-2"></div>
                            </div>

                            {/* Statement */}
                            <div className="flex flex-col gap-6 my-6">
                                <p className="font-serif text-slate-500 italic text-lg">This document officially certifies that</p>
                                <h2 className="font-serif font-bold text-4xl md:text-5xl text-slate-900 border-b border-slate-200 pb-4 inline-block mx-auto min-w-[300px]">
                                    Alexander Hamilton
                                </h2>
                                <p className="text-slate-600 max-w-2xl mx-auto">
                                    Is the registered legal holder of fractional ownership rights and associated digital equity in the asset detailed herein.
                                </p>
                            </div>

                            {/* Details Grid */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-slate-200 border border-slate-200 max-w-3xl mx-auto w-full rounded overflow-hidden">
                                <div className="bg-white p-6 flex flex-col items-start gap-1">
                                    <span className="text-xs font-bold text-primary uppercase tracking-wider">Asset Address</span>
                                    <span className="font-serif text-lg text-slate-900 font-semibold">1088 Madison Ave</span>
                                    <span className="text-sm text-slate-500">New York, NY 10028</span>
                                </div>
                                <div className="bg-white p-6 flex flex-col items-start gap-1">
                                    <span className="text-xs font-bold text-primary uppercase tracking-wider">Ownership Share</span>
                                    <div className="flex items-baseline gap-2">
                                        <span className="font-serif text-3xl text-yellow-600 font-bold">2.50%</span>
                                        <span className="text-sm text-slate-400 font-medium">/ 100%</span>
                                    </div>
                                </div>
                                <div className="bg-white p-6 flex flex-col items-start gap-1">
                                    <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Digital Slots Held</span>
                                    <span className="text-lg text-slate-900 font-medium">25 Units</span>
                                </div>
                                <div className="bg-white p-6 flex flex-col items-start gap-1">
                                    <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Date of Issuance</span>
                                    <span className="text-lg text-slate-900 font-medium">October 24, 2023</span>
                                </div>
                            </div>

                            {/* Footer */}
                            <div className="flex flex-col md:flex-row items-end justify-between mt-8 pt-6 border-t border-slate-100 gap-6">
                                <div className="flex flex-col items-start gap-1 text-left">
                                    <p className="text-[10px] text-slate-400 uppercase font-bold tracking-widest">Certificate ID (SHA-256)</p>
                                    <p className="font-mono text-xs text-slate-500 max-w-[200px] break-all">
                                        8f434346648f6b96df89dda901c5176b10a6d83961dd3c1ac88b59b2dc327aa4
                                    </p>
                                </div>
                                <div className="flex items-center gap-8">
                                    <div className="flex flex-col items-center gap-2">
                                        <div className="w-32 h-12 flex items-end justify-center pb-1">
                                            {/* Signature Mock */}
                                            <svg className="w-full h-full text-slate-900" viewBox="0 0 160 40" fill="none" stroke="currentColor" strokeWidth="2">
                                                <path d="M10,30 Q30,5 50,30 T90,20 T140,30" strokeLinecap="round"></path>
                                            </svg>
                                        </div>
                                        <div className="h-px w-full bg-slate-300"></div>
                                        <span className="text-[10px] text-primary font-bold uppercase tracking-wider">Authorized Signature</span>
                                    </div>
                                    <div className="bg-white border border-slate-200 p-1 rounded">
                                        <img src="https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=HermeosProptechCert8f434346648f6b96df89dda901c5176b10a6d83961dd3c1ac88b59b2dc327aa4" alt="QR" className="w-16 h-16" />
                                    </div>
                                </div>
                            </div>

                            {/* Seal */}
                            <div className="absolute bottom-12 right-12 w-24 h-24 rounded-full border-2 border-yellow-600/40 flex items-center justify-center p-1 shadow-lg bg-white/50 backdrop-blur-[1px] transform -rotate-12 hidden md:flex">
                                <div className="w-full h-full rounded-full border border-yellow-600 flex items-center justify-center bg-yellow-600/10 relative">
                                    <div className="absolute inset-1 border border-dotted border-yellow-600 rounded-full"></div>
                                    <Check className="text-yellow-600 w-10 h-10" />
                                </div>
                            </div>

                        </div>
                    </div>

                    {/* Toolbar */}
                    <div className="flex items-center gap-3 mt-6">
                        <button onClick={() => window.print()} className="flex items-center gap-2 bg-primary text-white px-5 py-2.5 rounded-full shadow-lg hover:bg-primary-dark transition-all text-sm font-medium">
                            <Printer className="w-4 h-4" /> Print
                        </button>
                        <button className="flex items-center gap-2 bg-white text-slate-900 border border-slate-200 px-5 py-2.5 rounded-full shadow-sm hover:bg-slate-50 transition-all text-sm font-medium">
                            <Download className="w-4 h-4" /> Download PDF
                        </button>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default CertificatePage;

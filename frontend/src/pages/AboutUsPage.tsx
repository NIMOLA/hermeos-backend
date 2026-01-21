import React from 'react';
import { Link } from 'react-router-dom';
import aboutHero from '../assets/about-hero.jpg';
import logoFull from '../assets/logo-full.png';

const AboutUsPage: React.FC = () => {
    return (
        <div className="min-h-screen bg-white dark:bg-[#0f172a] text-slate-900 dark:text-slate-100 font-sans selection:bg-primary selection:text-white">

            {/* 1. Hero Section */}
            <section className="relative w-full bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white overflow-hidden">
                <div className="absolute inset-0 bg-black/60 z-10" />
                <div className="absolute inset-0 z-0">
                    <img
                        src={aboutHero}
                        alt="Background"
                        className="w-full h-full object-cover opacity-40"
                    />
                </div>

                <div className="relative z-20 max-w-7xl mx-auto px-6 py-24 lg:py-32 flex flex-col items-center text-center">
                    <h1 className="text-5xl md:text-6xl lg:text-7xl font-black tracking-tight mb-8 bg-gradient-to-r from-white via-blue-100 to-white bg-clip-text text-transparent">
                        About Hermeos PropTech
                    </h1>

                    {/* Large Centered Logo - 3x Bigger */}
                    <div className="mb-12 transform hover:scale-105 transition-transform duration-300">
                        <img
                            src={logoFull}
                            alt="Hermeos PropTech"
                            className="h-64 md:h-80 lg:h-96 w-auto brightness-0 invert drop-shadow-2xl"
                        />
                    </div>

                    <p className="text-xl md:text-2xl text-slate-200 max-w-3xl mb-12 leading-relaxed font-medium">
                        Democratizing real estate participation through transparency, fractional ownership, and digital innovation
                    </p>

                    {/* Brand Overview Video Placeholder */}
                    <div className="w-full max-w-4xl aspect-video bg-slate-800 border border-slate-700 rounded-2xl flex flex-col items-center justify-center relative shadow-2xl overflow-hidden group cursor-not-allowed transition-all duration-300 hover:shadow-blue-500/20">
                        <div className="absolute inset-0 bg-gradient-to-tr from-slate-900 to-slate-800 opacity-90" />
                        <div className="relative z-10 flex flex-col items-center p-8">
                            <span className="material-symbols-outlined text-6xl text-slate-500 mb-4 group-hover:text-slate-400 transition-colors">play_circle</span>
                            <h3 className="text-2xl font-bold text-white mb-2">Brand Overview Video</h3>
                            <p className="text-slate-400 uppercase tracking-widest text-sm font-semibold border-t border-slate-600 pt-4 mt-2">
                                Video content placeholder – to be replaced
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* 2. The Problem */}
            <section className="py-20 px-6 max-w-7xl mx-auto">
                <div className="text-center mb-12">
                    <h2 className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white mb-4">The Problem</h2>
                    <div className="h-1.5 w-32 bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-600 rounded-full mx-auto"></div>
                    <p className="mt-6 text-lg text-slate-600 dark:text-slate-400 max-w-3xl mx-auto">
                        Traditional real estate in Nigeria faces critical barriers that exclude most people from wealth-building opportunities
                    </p>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                    {/* High Capital Barriers */}
                    <div className="group bg-gradient-to-br from-blue-50/50 to-indigo-50/50 dark:from-blue-950/20 dark:to-indigo-950/20 rounded-2xl p-6 border border-blue-100 dark:border-blue-900/50 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02]">
                        <div className="flex items-start gap-4">
                            <div className="flex-shrink-0 w-14 h-14 bg-blue-500 dark:bg-blue-600 rounded-xl flex items-center justify-center shadow-lg">
                                <span className="material-symbols-outlined text-white text-3xl">attach_money</span>
                            </div>
                            <div className="flex-1">
                                <h3 className="font-bold text-xl text-slate-900 dark:text-white mb-2">High Capital Barriers</h3>
                                <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
                                    Traditional real estate requires hundreds of thousands or millions in upfront capital, excluding middle-class investors from wealth-building opportunities.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Inaccessible to Diaspora */}
                    <div className="group bg-gradient-to-br from-indigo-50/50 to-blue-50/50 dark:from-indigo-950/20 dark:to-blue-950/20 rounded-2xl p-6 border border-indigo-100 dark:border-indigo-900/50 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02]">
                        <div className="flex items-start gap-4">
                            <div className="flex-shrink-0 w-14 h-14 bg-indigo-500 dark:bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
                                <span className="material-symbols-outlined text-white text-3xl">public_off</span>
                            </div>
                            <div className="flex-1">
                                <h3 className="font-bold text-xl text-slate-900 dark:text-white mb-2">Inaccessible to Diaspora</h3>
                                <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
                                    Overseas participants face challenges with trust, local market knowledge, and lack of "eyes on the ground" to verify and manage their property participation.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Lack of Transparency */}
                    <div className="group bg-gradient-to-br from-blue-50/50 to-indigo-50/50 dark:from-blue-950/20 dark:to-indigo-950/20 rounded-2xl p-6 border border-blue-100 dark:border-blue-900/50 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02]">
                        <div className="flex items-start gap-4">
                            <div className="flex-shrink-0 w-14 h-14 bg-blue-500 dark:bg-blue-600 rounded-xl flex items-center justify-center shadow-lg">
                                <span className="material-symbols-outlined text-white text-3xl">visibility_off</span>
                            </div>
                            <div className="flex-1">
                                <h3 className="font-bold text-xl text-slate-900 dark:text-white mb-2">Lack of Transparency</h3>
                                <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
                                    Manual, opaque processes leave participants in the dark about ownership structures, property status, and transaction details.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Administrative Complexity */}
                    <div className="group bg-gradient-to-br from-indigo-50/50 to-blue-50/50 dark:from-indigo-950/20 dark:to-blue-950/20 rounded-2xl p-6 border border-indigo-100 dark:border-indigo-900/50 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02]">
                        <div className="flex items-start gap-4">
                            <div className="flex-shrink-0 w-14 h-14 bg-indigo-500 dark:bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
                                <span className="material-symbols-outlined text-white text-3xl">crisis_alert</span>
                            </div>
                            <div className="flex-1">
                                <h3 className="font-bold text-xl text-slate-900 dark:text-white mb-2">Administrative Complexity</h3>
                                <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
                                    Unclear ownership structures, cumbersome paperwork, and manual processes create confusion and slow down transactions.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* 3. The Solution */}
            <section className="py-20 px-6 max-w-7xl mx-auto bg-gradient-to-br from-blue-50/30 to-indigo-50/30 dark:from-blue-950/20 dark:to-indigo-950/20 rounded-3xl border border-blue-100 dark:border-blue-900/50 shadow-2xl">
                <div className="text-center mb-12">
                    <h2 className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white mb-4">The Solution</h2>
                    <div className="h-1.5 w-32 bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-600 rounded-full mx-auto"></div>
                    <p className="mt-6 text-lg text-slate-700 dark:text-slate-300 max-w-3xl mx-auto">
                        Hermeos PropTech breaks down barriers and makes real estate participation accessible, transparent, and efficient for everyone
                    </p>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                    {/* Fractional Ownership */}
                    <div className="group bg-white dark:bg-slate-800 rounded-2xl p-6 border border-blue-200 dark:border-blue-800/50 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02]">
                        <div className="flex items-start gap-4">
                            <div className="flex-shrink-0 w-14 h-14 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                                <span className="material-symbols-outlined text-white text-3xl">groups</span>
                            </div>
                            <div className="flex-1">
                                <h3 className="font-bold text-xl text-slate-900 dark:text-white mb-2">Fractional Ownership</h3>
                                <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
                                    Start investing with as little as <span className="font-bold text-blue-600 dark:text-blue-400">₦100,000</span> through our co-ownership model, making premium properties accessible to middle-class investors.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Diaspora Support */}
                    <div className="group bg-white dark:bg-slate-800 rounded-2xl p-6 border border-indigo-200 dark:border-indigo-800/50 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02]">
                        <div className="flex items-start gap-4">
                            <div className="flex-shrink-0 w-14 h-14 bg-gradient-to-br from-indigo-500 to-blue-500 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                                <span className="material-symbols-outlined text-white text-3xl">public</span>
                            </div>
                            <div className="flex-1">
                                <h3 className="font-bold text-xl text-slate-900 dark:text-white mb-2">Diaspora Support</h3>
                                <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
                                    Our digital platform provides full transparency and acts as your trusted <span className="font-bold text-indigo-600 dark:text-indigo-400">"eyes on the ground"</span> for property participation in Nigeria, wherever you are in the world.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Transparent Tracking */}
                    <div className="group bg-white dark:bg-slate-800 rounded-2xl p-6 border border-blue-200 dark:border-blue-800/50 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02]">
                        <div className="flex items-start gap-4">
                            <div className="flex-shrink-0 w-14 h-14 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                                <span className="material-symbols-outlined text-white text-3xl">verified_user</span>
                            </div>
                            <div className="flex-1">
                                <h3 className="font-bold text-xl text-slate-900 dark:text-white mb-2">Transparent Tracking</h3>
                                <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
                                    Real-time portfolio visibility, ownership verification, and complete transaction history at your fingertips with full audit trails.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Simplified Administration */}
                    <div className="group bg-white dark:bg-slate-800 rounded-2xl p-6 border border-indigo-200 dark:border-indigo-800/50 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02]">
                        <div className="flex items-start gap-4">
                            <div className="flex-shrink-0 w-14 h-14 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                                <span className="material-symbols-outlined text-white text-3xl">automation</span>
                            </div>
                            <div className="flex-1">
                                <h3 className="font-bold text-xl text-slate-900 dark:text-white mb-2">Simplified Administration</h3>
                                <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
                                    Automated workflows, clear documentation, and digital signatures eliminate complexity and reduce administrative burden.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* 4. What We Are */}
            <section className="py-20 px-6 max-w-7xl mx-auto">
                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/30 rounded-3xl p-8 md:p-12 border border-blue-100 dark:border-blue-900/50 shadow-xl">
                    <div className="grid md:grid-cols-12 gap-8">
                        <div className="md:col-span-4">
                            <h2 className="text-4xl font-black text-slate-900 dark:text-white mb-4">What We Are</h2>
                            <div className="h-1.5 w-24 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full"></div>
                        </div>
                        <div className="md:col-span-8">
                            <p className="text-lg leading-relaxed text-slate-700 dark:text-slate-300">
                                Hermeos PropTech is a <span className="font-bold text-blue-600 dark:text-blue-400">digital platform</span> that provides structured access to real estate participation, simplifying administrative workflows and offering transparency to property ownership and transactions.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* 5. Entity Hierarchy / Organizational Structure */}
            <section className="py-20 px-6 max-w-7xl mx-auto">
                <div className="text-center mb-12">
                    <h2 className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white mb-4">Entity Hierarchy</h2>
                    <div className="h-1.5 w-32 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full mx-auto"></div>
                    <p className="mt-6 text-lg text-slate-600 dark:text-slate-400 max-w-3xl mx-auto">
                        Understanding how HERMEOS PropTech operates within the larger cooperative framework
                    </p>
                </div>

                {/* Visual Tree Diagram */}
                <div className="max-w-5xl mx-auto mb-12">
                    <div className="relative">
                        {/* MCES - Top Level */}
                        <div className="flex justify-center mb-8">
                            <div className="bg-gradient-to-br from-blue-500 to-blue-700 rounded-2xl p-6 shadow-2xl max-w-2xl w-full border-4 border-blue-300 dark:border-blue-800 transform hover:scale-105 transition-all duration-300">
                                <div className="flex items-center gap-4 mb-3">
                                    <div className="w-14 h-14 bg-white rounded-xl flex items-center justify-center shadow-lg flex-shrink-0">
                                        <span className="material-symbols-outlined text-blue-600 text-3xl">corporate_fare</span>
                                    </div>
                                    <div className="flex-1">
                                        <h4 className="font-black text-white text-xl md:text-2xl">MANYMILES CONSOLIDATED ELITE SERVICES</h4>
                                        <p className="text-blue-100 text-sm font-semibold">(MCES)</p>
                                    </div>
                                </div>
                                <div className="bg-blue-600/50 rounded-lg px-4 py-2 backdrop-blur-sm">
                                    <p className="text-white text-sm font-medium">🏛️ Cooperative Multipurpose Society</p>
                                    <p className="text-blue-100 text-xs mt-1">Parent Entity • Governance & Oversight</p>
                                </div>
                            </div>
                        </div>

                        {/* Connecting Lines */}
                        {/* Connecting Lines - Desktop (3-Pronged) */}
                        <div className="hidden md:flex justify-center mb-6">
                            <div className="flex gap-12">
                                <div className="w-px h-12 bg-gradient-to-b from-blue-400 to-green-400"></div>
                                <div className="w-px h-12 bg-gradient-to-b from-blue-400 to-purple-400"></div>
                                <div className="w-px h-12 bg-gradient-to-b from-blue-400 to-indigo-400"></div>
                            </div>
                        </div>

                        {/* Connecting Lines - Mobile (Single) */}
                        <div className="md:hidden flex justify-center mb-6">
                            <div className="w-px h-8 bg-gradient-to-b from-blue-400 to-slate-400"></div>
                        </div>

                        {/* Second Level - Three Entities */}
                        <div className="grid md:grid-cols-3 gap-6 mb-8">
                            {/* Corporate Real Estate */}
                            <div className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/30 dark:to-emerald-950/30 rounded-xl p-5 border-2 border-green-300 dark:border-green-700 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
                                <div className="flex items-center gap-3 mb-3">
                                    <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg flex items-center justify-center shadow-md">
                                        <span className="material-symbols-outlined text-white text-2xl">apartment</span>
                                    </div>
                                    <div className="flex-1">
                                        <h5 className="font-bold text-green-900 dark:text-green-300 text-sm">Corporate Real Estate Operations</h5>
                                    </div>
                                </div>
                                <div className="bg-green-100 dark:bg-green-900/30 rounded-lg p-3">
                                    <p className="text-green-800 dark:text-green-200 text-xs leading-relaxed">
                                        🏗️ Physical property development and management
                                    </p>
                                </div>
                            </div>

                            {/* SPVs */}
                            <div className="bg-gradient-to-br from-purple-50 to-fuchsia-50 dark:from-purple-950/30 dark:to-fuchsia-950/30 rounded-xl p-5 border-2 border-purple-300 dark:border-purple-700 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
                                <div className="flex items-center gap-3 mb-3">
                                    <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-fuchsia-600 rounded-lg flex items-center justify-center shadow-md">
                                        <span className="material-symbols-outlined text-white text-2xl">account_tree</span>
                                    </div>
                                    <div className="flex-1">
                                        <h5 className="font-bold text-purple-900 dark:text-purple-300 text-sm">Special Purpose Vehicles</h5>
                                    </div>
                                </div>
                                <div className="bg-purple-100 dark:bg-purple-900/30 rounded-lg p-3 mb-3">
                                    <p className="text-purple-800 dark:text-purple-200 text-xs leading-relaxed">
                                        🏘️ Property-specific entities for participation
                                    </p>
                                </div>
                                <div className="space-y-2">
                                    <div className="flex items-center gap-2 text-xs bg-white dark:bg-purple-900/20 rounded px-3 py-2">
                                        <div className="w-1.5 h-1.5 bg-purple-600 rounded-full"></div>
                                        <span className="text-purple-700 dark:text-purple-300 font-medium">SPV: Property A</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-xs bg-white dark:bg-purple-900/20 rounded px-3 py-2">
                                        <div className="w-1.5 h-1.5 bg-purple-600 rounded-full"></div>
                                        <span className="text-purple-700 dark:text-purple-300 font-medium">SPV: Property B</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-xs bg-white dark:bg-purple-900/20 rounded px-3 py-2">
                                        <div className="w-1.5 h-1.5 bg-purple-600 rounded-full"></div>
                                        <span className="text-purple-700 dark:text-purple-300 font-medium">SPV: Property C...</span>
                                    </div>
                                </div>
                            </div>

                            {/* HERMEOS PropTech */}
                            <div className="bg-gradient-to-br from-indigo-50 to-blue-50 dark:from-indigo-950/30 dark:to-blue-950/30 rounded-xl p-5 border-2 border-indigo-300 dark:border-indigo-700 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
                                <div className="flex items-center gap-3 mb-3">
                                    <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-blue-600 rounded-lg flex items-center justify-center shadow-md">
                                        <span className="material-symbols-outlined text-white text-2xl">devices</span>
                                    </div>
                                    <div className="flex-1">
                                        <h5 className="font-bold text-indigo-900 dark:text-indigo-300 text-sm">HERMEOS PropTech</h5>
                                    </div>
                                </div>
                                <div className="bg-indigo-100 dark:bg-indigo-900/30 rounded-lg p-3">
                                    <p className="text-indigo-800 dark:text-indigo-200 text-xs leading-relaxed">
                                        💻 Digital access platform
                                    </p>
                                    <p className="text-indigo-600 dark:text-indigo-300 text-xs mt-2 italic">
                                        Not a standalone legal entity
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Visual Flow Indicator */}
                        <div className="bg-gradient-to-r from-slate-100 via-blue-50 to-slate-100 dark:from-slate-800 dark:via-blue-950/30 dark:to-slate-800 rounded-xl p-4 border border-slate-200 dark:border-slate-700">
                            <div className="flex items-center justify-center gap-3 flex-wrap text-sm">
                                <div className="flex items-center gap-2">
                                    <div className="w-3 h-3 bg-blue-600 rounded-full"></div>
                                    <span className="text-slate-700 dark:text-slate-300 font-medium">Governance</span>
                                </div>
                                <span className="text-slate-400">→</span>
                                <div className="flex items-center gap-2">
                                    <div className="w-3 h-3 bg-green-600 rounded-full"></div>
                                    <span className="text-slate-700 dark:text-slate-300 font-medium">Operations</span>
                                </div>
                                <span className="text-slate-400">→</span>
                                <div className="flex items-center gap-2">
                                    <div className="w-3 h-3 bg-purple-600 rounded-full"></div>
                                    <span className="text-slate-700 dark:text-slate-300 font-medium">Participation</span>
                                </div>
                                <span className="text-slate-400">→</span>
                                <div className="flex items-center gap-2">
                                    <div className="w-3 h-3 bg-indigo-600 rounded-full"></div>
                                    <span className="text-slate-700 dark:text-slate-300 font-medium">Platform Access</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Plain-English Explanations */}
                <div className="grid md:grid-cols-2 gap-6 mb-12">
                    <div className="bg-white dark:bg-slate-800 rounded-xl p-6 border border-blue-200 dark:border-blue-800/50 shadow-lg">
                        <div className="flex items-start gap-3 mb-4">
                            <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center flex-shrink-0">
                                <span className="material-symbols-outlined text-white text-2xl">corporate_fare</span>
                            </div>
                            <div>
                                <h4 className="font-bold text-lg text-slate-900 dark:text-white">MCES - The Cooperative</h4>
                                <p className="text-xs text-blue-600 dark:text-blue-400 font-semibold">Parent & Governance Entity</p>
                            </div>
                        </div>
                        <p className="text-slate-700 dark:text-slate-300 text-sm leading-relaxed">
                            Manymiles Consolidated Elite Services is the registered Cooperative Multipurpose Society that provides the legal and governance framework. When you sign up, you agree to participate within this cooperative structure. MCES is responsible for oversight, compliance, and governance.
                        </p>
                    </div>

                    <div className="bg-white dark:bg-slate-800 rounded-xl p-6 border border-green-200 dark:border-green-800/50 shadow-lg">
                        <div className="flex items-start gap-3 mb-4">
                            <div className="w-10 h-10 bg-green-600 rounded-lg flex items-center justify-center flex-shrink-0">
                                <span className="material-symbols-outlined text-white text-2xl">apartment</span>
                            </div>
                            <div>
                                <h4 className="font-bold text-lg text-slate-900 dark:text-white">Corporate Real Estate Operations</h4>
                                <p className="text-xs text-green-600 dark:text-green-400 font-semibold">Property Development & Management</p>
                            </div>
                        </div>
                        <p className="text-slate-700 dark:text-slate-300 text-sm leading-relaxed">
                            This division operates under MCES and handles the physical aspects of real estate: construction, facilities management, and day-to-day property operations. This is where the actual buildings are developed and managed.
                        </p>
                    </div>

                    <div className="bg-white dark:bg-slate-800 rounded-xl p-6 border border-purple-200 dark:border-purple-800/50 shadow-lg">
                        <div className="flex items-start gap-3 mb-4">
                            <div className="w-10 h-10 bg-purple-600 rounded-lg flex items-center justify-center flex-shrink-0">
                                <span className="material-symbols-outlined text-white text-2xl">account_tree</span>
                            </div>
                            <div>
                                <h4 className="font-bold text-lg text-slate-900 dark:text-white">Special Purpose Vehicles (SPVs)</h4>
                                <p className="text-xs text-purple-600 dark:text-purple-400 font-semibold">Property-Specific Participation</p>
                            </div>
                        </div>
                        <p className="text-slate-700 dark:text-slate-300 text-sm leading-relaxed">
                            Each property or project has its own SPV. This isolates the ownership, accounting, and participation for that specific asset. When you participate in a property, you're participating in that property's SPV, not in the platform itself.
                        </p>
                    </div>

                    <div className="bg-white dark:bg-slate-800 rounded-xl p-6 border border-indigo-200 dark:border-indigo-800/50 shadow-lg">
                        <div className="flex items-start gap-3 mb-4">
                            <div className="w-10 h-10 bg-indigo-600 rounded-lg flex items-center justify-center flex-shrink-0">
                                <span className="material-symbols-outlined text-white text-2xl">devices</span>
                            </div>
                            <div>
                                <h4 className="font-bold text-lg text-slate-900 dark:text-white">HERMEOS PropTech</h4>
                                <p className="text-xs text-indigo-600 dark:text-indigo-400 font-semibold">Digital Access Platform</p>
                            </div>
                        </div>
                        <p className="text-slate-700 dark:text-slate-300 text-sm leading-relaxed">
                            HERMEOS is not a standalone legal entity or property owner. It's a digital platform operating under MCES that provides user onboarding, verification, transaction visibility, and administrative workflows. It connects users to the cooperative structure but does not replace governance or legal oversight.
                        </p>
                    </div>
                </div>

                {/* Summary Statement */}
                <div className="max-w-4xl mx-auto">
                    <div className="bg-gradient-to-r from-slate-100 to-blue-50 dark:from-slate-800 dark:to-blue-950/30 rounded-2xl p-8 border border-slate-300 dark:border-slate-700 shadow-lg">
                        <div className="flex items-start gap-4">
                            <span className="material-symbols-outlined text-3xl text-slate-600 dark:text-slate-400 flex-shrink-0">info</span>
                            <div>
                                <h4 className="font-bold text-lg text-slate-900 dark:text-white mb-3">In Simple Terms</h4>
                                <p className="text-slate-700 dark:text-slate-300 leading-relaxed text-lg italic">
                                    HERMEOS PropTech is a digital access platform operating under MCES (the cooperative), enabling users to participate in property-specific SPVs while Corporate Real Estate Operations handles the physical development and management of those properties.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* 6. How It Works & Governance */}
            <section className="py-20 px-6 max-w-7xl mx-auto bg-slate-50 dark:bg-slate-900/50">
                <div className="grid lg:grid-cols-2 gap-16">
                    {/* How It Works */}
                    <div>
                        <h2 className="text-3xl font-black text-slate-900 dark:text-white mb-8">How It Works</h2>
                        <div className="space-y-4">
                            {[
                                { title: "Onboarding & Verification", icon: "badge", num: "01" },
                                { title: "Ownership & Transaction Tracking", icon: "receipt_long", num: "02" },
                                { title: "Exit Requests & Transfer Processing", icon: "swap_horiz", num: "03" },
                                { title: "Administrative Oversight & Approvals", icon: "admin_panel_settings", num: "04" },
                                { title: "Auditable Actions", icon: "fact_check", num: "05" }
                            ].map((item, idx) => (
                                <div key={idx} className="group flex items-center gap-4 p-4 rounded-xl bg-gradient-to-r from-slate-50 to-blue-50 dark:from-slate-800 dark:to-blue-950/30 border border-slate-200 dark:border-slate-700 hover:shadow-lg transition-all duration-300 hover:scale-[1.02]">
                                    <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center text-white font-black text-lg shadow-md">
                                        {item.num}
                                    </div>
                                    <span className="material-symbols-outlined text-primary text-2xl">{item.icon}</span>
                                    <span className="font-semibold text-slate-700 dark:text-slate-200 flex-1">{item.title}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Governance Model */}
                    <div>
                        <h2 className="text-3xl font-black text-slate-900 dark:text-white mb-8">Governance Model</h2>
                        <div className="bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-950/20 dark:to-orange-950/20 border border-amber-200 dark:border-amber-800/50 p-8 rounded-2xl shadow-xl">
                            <div className="flex items-start gap-4 mb-6">
                                <span className="material-symbols-outlined text-amber-600 dark:text-amber-500 text-4xl animate-pulse">supervisor_account</span>
                                <div>
                                    <h3 className="text-xl font-bold text-amber-900 dark:text-amber-100 mb-2">Human Oversight is Central</h3>
                                    <p className="text-amber-800 dark:text-amber-200 leading-relaxed">
                                        The platform is not fully autonomous. Automation supports operations to ensure efficiency, but humans—administrators, moderators, and internal teams—remain accountable for critical actions and approvals.
                                    </p>
                                </div>
                            </div>
                            <p className="text-sm text-amber-700 dark:text-amber-300 font-medium pl-14">
                                This hybrid model ensures regulatory alignment and operational integrity.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* 6. Data Stewardship & What We Are Not */}
            <section className="py-20 px-6 max-w-7xl mx-auto">
                <div className="grid lg:grid-cols-2 gap-8">
                    {/* Data Stewardship */}
                    <div className="bg-gradient-to-br from-slate-50 to-gray-50 dark:from-slate-800 dark:to-gray-900 rounded-2xl p-8 border border-slate-200 dark:border-slate-700 shadow-lg">
                        <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-3">
                            <div className="w-10 h-10 bg-slate-700 dark:bg-slate-600 rounded-lg flex items-center justify-center">
                                <span className="material-symbols-outlined text-white text-2xl">lock</span>
                            </div>
                            Data Stewardship
                        </h2>
                        <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
                            We treat sensitive user documents as high-risk data. Access is strictly controlled via role-based permissions, and all administrative actions are logged for accountability. Data retention is intentional and limited to what is legally and operationally required.
                        </p>
                    </div>

                    {/* What We Are Not */}
                    <div className="bg-gradient-to-br from-slate-50 to-gray-50 dark:from-slate-800 dark:to-gray-900 rounded-2xl p-8 border border-slate-200 dark:border-slate-700 shadow-lg">
                        <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-3">
                            <div className="w-10 h-10 bg-red-600 dark:bg-red-700 rounded-lg flex items-center justify-center">
                                <span className="material-symbols-outlined text-white text-2xl">do_not_disturb_on</span>
                            </div>
                            What We Are Not
                        </h2>
                        <div className="space-y-3">
                            {[
                                "A get-rich-quick scheme",
                                "A black-box automated system",
                                "A replacement for professional legal or financial advice"
                            ].map((text, i) => (
                                <div key={i} className="flex items-center gap-3 text-slate-700 dark:text-slate-300">
                                    <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                                    <span>{text}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* 7. Closing Statement */}
            <section className="py-32 px-6 max-w-4xl mx-auto">
                <div className="bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-blue-950/30 dark:to-indigo-950/30 rounded-3xl p-12 border border-blue-200 dark:border-blue-900/50 shadow-2xl text-center">
                    <blockquote className="text-2xl md:text-3xl font-bold text-slate-800 dark:text-slate-200 leading-relaxed italic">
                        "Hermeos PropTech is built for <span className="text-blue-600 dark:text-blue-400">consistency</span> and <span className="text-indigo-600 dark:text-indigo-400">accountability</span>. All systems and processes are designed to withstand scrutiny and ensure a reliable experience for participants, prioritizing sustainable growth over transient trends."
                    </blockquote>
                </div>
            </section>

            {/* Footer with Back to Home Button */}
            <footer className="bg-gradient-to-br from-slate-100 to-blue-50 dark:from-slate-900 dark:to-blue-950/30 border-t border-slate-200 dark:border-slate-800">
                <div className="max-w-7xl mx-auto px-6 py-16 text-center">
                    <div className="mb-8">
                        <Link to="/">
                            <button className="group inline-flex items-center gap-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-8 py-4 rounded-xl font-bold text-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
                                <span className="material-symbols-outlined text-2xl group-hover:translate-x-[-4px] transition-transform">arrow_back</span>
                                <span>Back to Home</span>
                            </button>
                        </Link>
                    </div>
                    <div className="text-sm text-slate-600 dark:text-slate-400">
                        <p className="mb-2">© {new Date().getFullYear()} Hermeos PropTech. All rights reserved.</p>
                        <p className="text-xs">Manymiles Consolidated Elite Services - Cooperative Multipurpose Society</p>
                    </div>
                </div>
            </footer>

        </div>
    );
};

export default AboutUsPage;

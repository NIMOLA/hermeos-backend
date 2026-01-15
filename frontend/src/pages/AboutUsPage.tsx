import React from 'react';
import { Link } from 'react-router-dom';

const AboutUsPage: React.FC = () => {
    return (
        <div className="min-h-screen bg-white dark:bg-slate-900 flex flex-col items-center">
            {/* Hero */}
            <div className="w-full bg-slate-900 py-20 px-4 text-center">
                <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-6">We Are Unifying African Wealth.</h1>
                <p className="max-w-3xl mx-auto text-lg text-slate-300">Hermeos Proptech is not just a Nigerian real estate company. We are a Pan-African Digital Cooperative built for the future of the continent.</p>
            </div>

            <div className="max-w-5xl mx-auto px-6 py-16 flex flex-col gap-16">

                {/* Vision */}
                <section className="flex flex-col md:flex-row gap-10 items-center">
                    <div className="flex-1">
                        <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-4">Our Vision</h2>
                        <h3 className="text-xl text-primary font-semibold mb-4">To build a borderless African infrastructure for cooperative wealth.</h3>
                        <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                            We envision a future where real estate ownership is no longer confined by geography or citizenship. We are building a system where the "Iré" (Blessings) of property ownership is permeable across the continent—where a member in Lagos can seamlessly hold a stake in properties across Africa's major capital cities.
                        </p>
                        <p className="text-slate-600 dark:text-slate-400 mt-4 leading-relaxed">
                            We see Hermeos as the bridge that connects the ambition of the African people with the prime real estate of Africa’s emerging skylines.
                        </p>
                    </div>
                </section>

                {/* Mission */}
                <section className="bg-slate-50 dark:bg-slate-800 rounded-2xl p-10 text-center">
                    <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-4">Our Mission</h2>
                    <p className="text-xl text-slate-600 dark:text-slate-300 font-medium">
                        To digitize cooperative wealth, empowering Africans to securely own the continent's skylines—one slot at a time.
                    </p>
                </section>

                {/* Hybrid Model */}
                <section>
                    <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-10 text-center">The Hybrid Model</h2>
                    <div className="grid md:grid-cols-2 gap-8">
                        <div className="bg-white dark:bg-slate-800 border-2 border-slate-100 dark:border-slate-700 p-8 rounded-xl shadow-lg">
                            <div className="size-16 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center mb-6">
                                <span className="material-symbols-outlined text-primary text-3xl">memory</span>
                            </div>
                            <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">The Engine (Tech)</h3>
                            <p className="text-slate-600 dark:text-slate-400">
                                Hermeos Proptech provides the dashboard, data analysis, and seamless payments. We build the digital bridge that makes ownership accessible.
                            </p>
                        </div>
                        <div className="bg-white dark:bg-slate-800 border-2 border-slate-100 dark:border-slate-700 p-8 rounded-xl shadow-lg">
                            <div className="size-16 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center mb-6">
                                <span className="material-symbols-outlined text-emerald-600 text-3xl">verified_user</span>
                            </div>
                            <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">The Fortress (Co-op)</h3>
                            <p className="text-slate-600 dark:text-slate-400">
                                Manymiles Cooperative Multipurpose Society owns the assets. When you subscribe, you become a Member. This ensures we operate under strict Cooperative laws and distribute Patronage Refunds (Surplus), not interest.
                            </p>
                        </div>
                    </div>
                </section>

                <div className="text-center mt-12 pb-12 boorder-t border-slate-200 dark:border-slate-800 pt-8">
                    <p className="text-slate-500 mb-6">Join the movement today.</p>
                    <Link to="/properties" className="inline-block bg-primary hover:bg-primary-dark text-white font-bold py-3 px-8 rounded-full transition-colors shadow-lg shadow-primary/30">
                        View Portfolio
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default AboutUsPage;

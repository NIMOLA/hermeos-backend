import { Link } from 'react-router-dom';
import { Button } from '../components/ui/button';

export default function LandingPage() {
    return (
        <div className="flex flex-col min-h-screen">
            {/* Hero Section */}
            <section className="relative h-[600px] flex items-center justify-center overflow-hidden bg-slate-900 text-white">
                <div className="absolute inset-0 z-0">
                    <div className="absolute inset-0 bg-gradient-to-r from-slate-900 via-slate-900/80 to-slate-900/40 z-10" />
                    <img
                        src="https://lh3.googleusercontent.com/aida-public/AB6AXuDKqm_3hafcwEcIR-Qmz-d51w8bXcoC9yeG04p41z5x-YlQUTefqqy9NfGBtY-u6Bo2XxxvmHJpX_NtYSuDUJmC1l_YovzXDAdG8OXsBQhw9qCDrRUoIAwDnnqKjwnz8MLimhjfEoWN8SJnsDeNZpS8a0JCpY8wzDYkwei5Ki8dpLZGRuYGV-Cnpe3NEyzMZX3WVoZC-1V-n1zMzDVtbMi6ca5IGSJWnf4qVONysTjHyGgvkCFQv5iuMvfVLEmF14bIlT9FLjNxi547"
                        alt="Modern Architecture"
                        className="w-full h-full object-cover"
                    />
                </div>

                <div className="relative z-20 max-w-7xl mx-auto px-4 md:px-8 text-center md:text-left w-full mobile:px-reduced">
                    <h1 className="text-4xl md:text-6xl font-black tracking-tight mb-6 leading-tight max-w-3xl">
                        Build Wealth with <span className="text-primary">Premium Real Estate</span>
                    </h1>
                    <p className="text-lg md:text-xl text-slate-300 mb-8 max-w-2xl leading-relaxed">
                        Access high-yield residential and commercial properties in Nigeria's fastest-growing markets. Start your portfolio with as little as ₦500,000.
                    </p>
                    <div className="flex flex-col md:flex-row gap-4 justify-center md:justify-start">
                        <Link to="/login">
                            <Button size="lg" className="w-full md:w-auto text-base font-bold h-12 px-8">
                                Start Owning
                            </Button>
                        </Link>
                        <Link to="/properties">
                            <Button variant="outline" size="lg" className="w-full md:w-auto text-base font-bold h-12 px-8 bg-transparent text-white border-white hover:bg-white/10 hover:text-white">
                                View Properties
                            </Button>
                        </Link>
                    </div>
                </div>
            </section>

            {/* Stats Section */}
            <section className="bg-primary text-white py-12">
                <div className="max-w-7xl mx-auto px-4 md:px-8 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
                    <div>
                        <h3 className="text-3xl md:text-4xl font-bold mb-1">₦2.5B+</h3>
                        <p className="text-blue-100 font-medium">Assets Funded</p>
                    </div>
                    <div>
                        <h3 className="text-3xl md:text-4xl font-bold mb-1">14%</h3>
                        <p className="text-blue-100 font-medium">Avg. Annual Yield</p>
                    </div>
                    <div>
                        <h3 className="text-3xl md:text-4xl font-bold mb-1">2,000+</h3>
                        <p className="text-blue-100 font-medium">Equity Partners</p>
                    </div>
                    <div>
                        <h3 className="text-3xl md:text-4xl font-bold mb-1">0%</h3>
                        <p className="text-blue-100 font-medium">Default Rate</p>
                    </div>
                </div>
            </section>

            {/* Features Grid */}
            <section className="py-20 bg-background-light dark:bg-background-dark">
                <div className="max-w-7xl mx-auto px-4 md:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-4">Why Own with Hermeos?</h2>
                        <p className="text-slate-500 dark:text-slate-400 max-w-2xl mx-auto">We're democratizing access to institutional-grade real estate opportunities.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mobile:px-reduced">
                        {[
                            { title: "Fractional Ownership", desc: "Buy shares of premium properties instead of the whole building. Diversify your risk across multiple assets.", icon: "pie_chart", color: "blue" },
                            { title: "Passive Income", desc: "Receive rental income dividends directly to your wallet every quarter. Track performance in real-time.", icon: "payments", color: "emerald" },
                            { title: "Capital Appreciation", desc: "Benefit from property value growth over time. Trade your shares or hold for long-term gains.", icon: "trending_up", color: "purple" }
                        ].map((feature, i) => (
                            <div key={i} className="bg-white dark:bg-surface-dark p-6 md:p-8 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-shadow">
                                <div className={`w-12 h-12 md:w-14 md:h-14 rounded-xl bg-${feature.color}-50 dark:bg-${feature.color}-900/20 flex items-center justify-center text-${feature.color}-600 dark:text-${feature.color}-400 mb-6`}>
                                    <span className="material-symbols-outlined text-2xl md:text-3xl">{feature.icon}</span>
                                </div>
                                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">{feature.title}</h3>
                                <p className="text-slate-500 dark:text-slate-400 leading-relaxed text-sm md:text-base">{feature.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-20 bg-slate-50 dark:bg-[#111921]">
                <div className="max-w-5xl mx-auto px-4 md:px-8 text-center">
                    <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-6">Ready to grow your ownership?</h2>
                    <p className="text-lg text-slate-500 dark:text-slate-400 mb-8 max-w-2xl mx-auto">Join thousands of partners building wealth with Hermeos Proptech today.</p>
                    <div className="flex justify-center gap-4">
                        <Link to="/login">
                            <Button size="lg" className="text-base font-bold h-12 px-10 shadow-lg shadow-primary/20">
                                Create Free Account
                            </Button>
                        </Link>
                    </div>
                </div>
            </section>
        </div>
    );
}

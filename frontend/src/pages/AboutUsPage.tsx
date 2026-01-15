import React from 'react';
import { Link } from 'react-router-dom';

const AboutUsPage: React.FC = () => {
    return (
        <div className="min-h-screen bg-background-light dark:bg-background-dark text-text-main dark:text-gray-100 font-display overflow-x-hidden antialiased selection:bg-primary selection:text-white">

            {/* Breadcrumbs */}
            <div className="px-6 lg:px-12 py-4 max-w-7xl mx-auto w-full">
                <div className="flex items-center gap-2 text-sm">
                    <Link to="/" className="text-gray-500 dark:text-gray-400 hover:text-primary transition-colors">Home</Link>
                    <span className="text-gray-500 dark:text-gray-500">/</span>
                    <span className="text-primary font-medium dark:text-green-400">About Us</span>
                </div>
            </div>

            {/* Hero Section */}
            <section className="relative px-6 lg:px-12 pb-16 pt-8 max-w-7xl mx-auto w-full">
                <div className="relative w-full h-[560px] rounded-2xl overflow-hidden shadow-2xl group">
                    <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-transparent z-10"></div>
                    <div
                        className="absolute inset-0 bg-cover bg-center transition-transform duration-1000 group-hover:scale-105"
                        style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuBa_JWaLEa7qTyKcsui_qS8d2OuOeexPhP8_1rc9mUF7L1-RlSugD8sUikQk9NlEPpgkHABTCtzERrxV4rDVGR0ypptJeoDaieFSml0BUHAQPDMepR_1ogV21QR_GQiIPeVxv-omMJ-nnn2ysciI3E0OTmfKi5p4V3fjT135NnrDyayGbqmMPzTaSsM3zsilwk_3MQ17UD1MI1fWvd-zZO_UZfH_StClCYLqSb45ZxkY2K-xR9AEK8IygKWnEpQYvKvTK8TnakgKCn1')" }}
                    >
                    </div>
                    <div className="relative z-20 h-full flex flex-col justify-end p-8 md:p-16 max-w-3xl">
                        <div className="w-16 h-1 bg-secondary mb-6"></div>
                        <h1 className="text-4xl md:text-6xl font-black text-white leading-tight mb-4 tracking-tight">
                            Rooted in Africa,<br />Built for the World.
                        </h1>
                        <p className="text-lg md:text-xl text-gray-200 font-medium max-w-xl leading-relaxed">
                            We are bridging the gap between global capital and high-growth African real estate through technology, transparency, and deep local expertise.
                        </p>
                    </div>
                </div>
            </section>

            {/* Vision / Mission Stats */}
            <section className="px-6 lg:px-12 py-16 max-w-7xl mx-auto w-full">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
                    <div className="lg:col-span-5 flex flex-col gap-6">
                        <h2 className="text-3xl md:text-4xl font-bold text-text-main dark:text-white leading-tight">
                            Redefining ownership across the continent.
                        </h2>
                        <p className="text-text-secondary dark:text-gray-300 text-lg leading-relaxed">
                            The African real estate market has historically been opaque and fragmented. Hermeos Proptech was born from a simple question: <span className="text-text-main dark:text-white font-semibold italic">What if investing in Lagos or Nairobi was as simple as buying a stock?</span>
                        </p>
                        <div className="flex gap-4 mt-2">
                            <div className="flex flex-col border-l-2 border-secondary pl-4">
                                <span className="text-3xl font-bold text-text-main dark:text-white">12+</span>
                                <span className="text-sm text-text-secondary dark:text-gray-400 font-medium uppercase tracking-wider">Markets</span>
                            </div>
                            <div className="flex flex-col border-l-2 border-secondary pl-4">
                                <span className="text-3xl font-bold text-text-main dark:text-white">$45M</span>
                                <span className="text-sm text-text-secondary dark:text-gray-400 font-medium uppercase tracking-wider">Assets Managed</span>
                            </div>
                        </div>
                    </div>
                    <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="bg-surface-light dark:bg-surface-dark p-8 rounded-xl border border-primary/10 dark:border-white/5">
                            <span className="material-symbols-outlined text-4xl text-primary mb-4">architecture</span>
                            <h3 className="text-xl font-bold mb-2 dark:text-white">Structural Integrity</h3>
                            <p className="text-text-secondary dark:text-gray-400 text-sm leading-relaxed">
                                We don't just aggregate listings. We verify structural soundness, legal titles, and development viability before any asset touches our platform.
                            </p>
                        </div>
                        <div className="bg-primary text-white p-8 rounded-xl shadow-lg shadow-primary/20 flex flex-col justify-between">
                            <div>
                                <span className="material-symbols-outlined text-4xl text-white/90 mb-4">hub</span>
                                <h3 className="text-xl font-bold mb-2">Hybrid Model</h3>
                                <p className="text-white/80 text-sm leading-relaxed">
                                    Combining digital ease with boots-on-the-ground asset management.
                                </p>
                            </div>
                            <div className="mt-6 flex justify-end">
                                <span className="material-symbols-outlined">arrow_forward</span>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* The Model (Zig Zag) */}
            <section className="bg-surface-light dark:bg-surface-dark py-20">
                <div className="max-w-7xl mx-auto px-6 lg:px-12 flex flex-col gap-24">
                    {/* Row 1 */}
                    <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
                        <div className="flex-1 order-2 lg:order-1">
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-wide mb-4">
                                <span className="w-2 h-2 rounded-full bg-primary"></span>
                                Digital First
                            </div>
                            <h3 className="text-3xl font-bold text-text-main dark:text-white mb-6">Data-Driven Acquisition</h3>
                            <p className="text-text-secondary dark:text-gray-300 text-lg leading-relaxed mb-8">
                                Our proprietary algorithms analyze thousands of data points—from urban migration patterns to infrastructure development plans—to identify high-yield investment zones before the market catches up.
                            </p>
                            <ul className="space-y-4">
                                <li className="flex items-start gap-3">
                                    <span className="material-symbols-outlined text-primary mt-0.5">check_circle</span>
                                    <span className="text-text-main dark:text-gray-200">Real-time valuation metrics</span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <span className="material-symbols-outlined text-primary mt-0.5">check_circle</span>
                                    <span className="text-text-main dark:text-gray-200">Legal due diligence automation</span>
                                </li>
                            </ul>
                        </div>
                        <div className="flex-1 w-full order-1 lg:order-2">
                            <div className="relative rounded-2xl overflow-hidden shadow-2xl aspect-[4/3]">
                                <div className="absolute inset-0 bg-primary/10 mix-blend-multiply"></div>
                                <img alt="Data dashboard overlaid on a blurred city map visualization" className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuC_indfIEubURVYzUsMD4wmyKy-Gb1WvlvF6sZgUI6sh2pAH7GtsG7FalW935P6bJCiaabnBe9nundXPp8HO9MP0XAt0BVEV7jSjb4AIeiFA2UQzDhFxcR7uowlJAzxA476qjQMHWkbbpQ-H5GLGrnOnpmzw7BGJEZBuGU_FZvPIr4ZaWKMHAaKUsgsHjGlb2dbDAXgcrOo6aojP8R8BABSi9Isu9rcNzrDSgurxnS7qPQiz1Y1nrhfKNSEyoJTmcmR74GJLt7C6Czt" />
                            </div>
                        </div>
                    </div>
                    {/* Row 2 */}
                    <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
                        <div className="flex-1 w-full">
                            <div className="relative rounded-2xl overflow-hidden shadow-2xl aspect-[4/3]">
                                <div className="absolute inset-0 bg-secondary/10 mix-blend-multiply"></div>
                                <img alt="Modern sustainable home construction site with wood and glass materials" className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDPnPn-9rjdumBnVWmHZX4jyhkg-8QLrDL-P3c_ANyH9n9MUpEQUVKqpoSWOszrwnAnjRkgXfaIGug-4xlQcruXXsb2QSec_J3SiBqJBDHEQJOqJRUGoyaqWcvWL2BVHtHmW-res1tl4mkir7yoX8tH0LbWLEno3cltf-_Q6yvPYHB4834SDvWgbYJ_c4oQwz9NTRkZVEVRoZkZHG0uxjrEWFiOa1CBrkaBIRBvDjwKT7x7LJKJ8cc707ygsGLAf8wx41xfC9YYBrqJ" />
                                {/* Floating Badge */}
                                <div className="absolute bottom-6 left-6 bg-white dark:bg-background-dark p-4 rounded-lg shadow-lg max-w-[200px]">
                                    <p className="text-xs font-bold text-secondary uppercase tracking-wider mb-1">Active Site</p>
                                    <p className="text-sm font-bold text-text-main dark:text-white">Lekki Phase 2, Lagos</p>
                                </div>
                            </div>
                        </div>
                        <div className="flex-1">
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-secondary/10 text-secondary text-xs font-bold uppercase tracking-wide mb-4">
                                <span className="w-2 h-2 rounded-full bg-secondary"></span>
                                Tangible Assets
                            </div>
                            <h3 className="text-3xl font-bold text-text-main dark:text-white mb-6">Boots on the Ground</h3>
                            <p className="text-text-secondary dark:text-gray-300 text-lg leading-relaxed mb-8">
                                We aren't a faceless app. Our local asset management teams oversee construction, tenant placement, and property maintenance, ensuring your digital investment is backed by well-maintained physical reality.
                            </p>
                            <Link to="/properties" className="text-primary font-bold hover:text-primary-dark dark:text-green-400 dark:hover:text-green-300 inline-flex items-center gap-2 transition-colors">
                                Explore our properties <span className="material-symbols-outlined text-lg">arrow_right_alt</span>
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            {/* Core Values */}
            <section className="px-6 lg:px-12 py-24 max-w-7xl mx-auto w-full">
                <div className="text-center max-w-2xl mx-auto mb-16">
                    <h2 className="text-3xl font-bold text-text-main dark:text-white mb-4">Our Core Values</h2>
                    <p className="text-text-secondary dark:text-gray-400">The principles that guide every brick we lay and every line of code we write.</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {/* Value 1 */}
                    <div className="group p-8 rounded-2xl bg-white dark:bg-background-dark border border-gray-100 dark:border-gray-800 hover:border-primary/30 hover:shadow-xl hover:shadow-primary/5 transition-all duration-300">
                        <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary mb-6 group-hover:scale-110 transition-transform">
                            <span className="material-symbols-outlined">visibility</span>
                        </div>
                        <h3 className="text-xl font-bold text-text-main dark:text-white mb-3">Radical Transparency</h3>
                        <p className="text-text-secondary dark:text-gray-400 leading-relaxed">
                            No hidden fees, no jargon. We provide clear, audit-ready reports on asset performance and valuation updates.
                        </p>
                    </div>
                    {/* Value 2 */}
                    <div className="group p-8 rounded-2xl bg-white dark:bg-background-dark border border-gray-100 dark:border-gray-800 hover:border-secondary/30 hover:shadow-xl hover:shadow-secondary/5 transition-all duration-300">
                        <div className="w-12 h-12 rounded-full bg-secondary/10 flex items-center justify-center text-secondary mb-6 group-hover:scale-110 transition-transform">
                            <span className="material-symbols-outlined">forest</span>
                        </div>
                        <h3 className="text-xl font-bold text-text-main dark:text-white mb-3">Sustainable Heritage</h3>
                        <p className="text-text-secondary dark:text-gray-400 leading-relaxed">
                            We prioritize developments that respect local ecosystems and utilize sustainable building materials.
                        </p>
                    </div>
                    {/* Value 3 */}
                    <div className="group p-8 rounded-2xl bg-white dark:bg-background-dark border border-gray-100 dark:border-gray-800 hover:border-primary/30 hover:shadow-xl hover:shadow-primary/5 transition-all duration-300">
                        <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary mb-6 group-hover:scale-110 transition-transform">
                            <span className="material-symbols-outlined">diversity_3</span>
                        </div>
                        <h3 className="text-xl font-bold text-text-main dark:text-white mb-3">Community First</h3>
                        <p className="text-text-secondary dark:text-gray-400 leading-relaxed">
                            Real estate is about people. We invest in projects that create jobs and improve living standards for local communities.
                        </p>
                    </div>
                </div>
            </section>

            {/* Leadership Team */}
            <section className="bg-surface-light dark:bg-surface-dark py-24 border-t border-primary/5 dark:border-white/5">
                <div className="max-w-7xl mx-auto px-6 lg:px-12">
                    <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
                        <div>
                            <span className="text-secondary font-bold uppercase tracking-widest text-sm block mb-2">Leadership</span>
                            <h2 className="text-3xl md:text-4xl font-bold text-text-main dark:text-white">Meet the Visionaries</h2>
                        </div>
                        <button className="hidden md:flex items-center gap-2 text-primary font-bold hover:text-primary-dark transition-colors">
                            View all team members <span className="material-symbols-outlined">arrow_forward</span>
                        </button>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {/* Member 1 */}
                        <div className="group">
                            <div className="aspect-[3/4] rounded-xl overflow-hidden mb-4 bg-gray-200 relative">
                                <img alt="Portrait of Amara Okeke, CEO" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 saturate-0 group-hover:saturate-100" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDoEbL3TS4hJrGHwfUfaUb9fMaTwh9v3QhRnmTiMp-9B1u95DoVncZOkvywHtjbjeDBodSO_SKyR3bhnrEwJaf5LNqRefJ5CPYKBtnlt-l47j7gn8B4ecAQqAvZh9HP0Qb493OP6WO8ndImdcLwb-nzkP9_M0ekKSyEjzhCr_p8Gfvah525XbkNXjAlkLxpDipqYzEgpCLUdpCxwJ2g2w05lZ3GOeCiLRwiUm8hDrPUZWeGnCau5rRj89tGR45fU9GksP-NQpUgo6pi" />
                                <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                                    <div className="flex gap-2 justify-center">
                                        <a className="text-white hover:text-secondary" href="#"><span className="material-symbols-outlined text-sm">link</span></a>
                                        <a className="text-white hover:text-secondary" href="#"><span className="material-symbols-outlined text-sm">mail</span></a>
                                    </div>
                                </div>
                            </div>
                            <h3 className="text-lg font-bold text-text-main dark:text-white">Amara Okeke</h3>
                            <p className="text-sm text-text-secondary dark:text-gray-400">Chief Executive Officer</p>
                        </div>
                        {/* Member 2 */}
                        <div className="group">
                            <div className="aspect-[3/4] rounded-xl overflow-hidden mb-4 bg-gray-200 relative">
                                <img alt="Portrait of David Kalu, CTO" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 saturate-0 group-hover:saturate-100" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCCQpc6bByscYBie0jM2h_fGx4xgiNbje_tisVPkO8fvXnHNBqEedOAcB1szQHjzGp0Bx9oPg8CHycUztCjtqkX7tK0JlujSH9MOtD0PxvDbLzTB5IZcGl7VBAOczW4lyJcM3CpZsg4UaHjSzZcFf-ETW7TtvWzor_JG7GBrRGR29st6slL_otfL9STIdls9GhuLkye4seMBaZBYihlqhyUoPBm6GFn8ZrMppc1IzJfxJHcI2hhBt4f2TReYNYI-k4kzYMzVYhLk-Fp" />
                            </div>
                            <h3 className="text-lg font-bold text-text-main dark:text-white">David Kalu</h3>
                            <p className="text-sm text-text-secondary dark:text-gray-400">Chief Technology Officer</p>
                        </div>
                        {/* Member 3 */}
                        <div className="group">
                            <div className="aspect-[3/4] rounded-xl overflow-hidden mb-4 bg-gray-200 relative">
                                <img alt="Portrait of Zainab Al-Fayed, Head of Assets" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 saturate-0 group-hover:saturate-100" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAikIo3ksUV7C6YxOmNz7oJ0pgp3giLr7OS3RBGjZMUm0HCoY9eT_5ZM_gHdNH4U037it3Wts740DGUS_c_75_jyBKDr-0Xal7gBTMLxDlc9cO9VordHWvO4VV2kqtlr8shplSN-OiE8wVoXS2jJwIt9v0Inun70loPGEFBrfkG-Zy2UDLZIhijp2F2zna3P6H_F-urauos2pMKG7CtnsMSN6iTBq79_Fu052QoTEFOCGat9E3bxRdbY6oYqAcKzu1UhDCyQW62z1q9" />
                            </div>
                            <h3 className="text-lg font-bold text-text-main dark:text-white">Zainab Al-Fayed</h3>
                            <p className="text-sm text-text-secondary dark:text-gray-400">Head of Real Assets</p>
                        </div>
                        {/* Member 4 */}
                        <div className="group">
                            <div className="aspect-[3/4] rounded-xl overflow-hidden mb-4 bg-gray-200 relative">
                                <img alt="Portrait of Liam Pearce, Head of Growth" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 saturate-0 group-hover:saturate-100" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCeuwN0n0o1HRuWQbhNafNvdd2ygmZuLI6msLsntUtohDnwEMGLC1owt6SPRx4Khc_NwAhlfDgRFqYBedU2_NxFr7a90LzdwFQyXPITMj_d3VSZyQ9YHtW_2HL7R2BbpTXqY8-dLO0mAkeDn75Bnw-wcKW-XUYXjtsBB3YXvZ9Qwj-HfpO9ri56kMhpqWN-iAQeOfOC4gKgZPrMk3sIaRpozrGCPA70JKR4JVEI80bOevbtzuCXmC1JwVuufBvQrY2He89hI5tIxtuV" />
                            </div>
                            <h3 className="text-lg font-bold text-text-main dark:text-white">Liam Pearce</h3>
                            <p className="text-sm text-text-secondary dark:text-gray-400">Head of Growth</p>
                        </div>
                    </div>
                    <button className="flex md:hidden w-full justify-center items-center gap-2 mt-8 py-3 rounded-lg border border-primary/20 text-primary font-bold hover:bg-primary/5 transition-colors">
                        View all team members <span className="material-symbols-outlined">arrow_forward</span>
                    </button>
                </div>
            </section>

            {/* Partners / Trust */}
            <section className="py-16 px-6 lg:px-12 bg-white dark:bg-background-dark border-b border-[#e9f1ec] dark:border-white/5">
                <div className="max-w-7xl mx-auto text-center">
                    <p className="text-sm font-semibold text-text-secondary dark:text-gray-500 uppercase tracking-widest mb-8">Trusted by global partners</p>
                    <div className="flex flex-wrap justify-center items-center gap-12 lg:gap-20 opacity-60 grayscale hover:grayscale-0 transition-all duration-500">
                        {/* Placeholders for logos */}
                        <div className="text-2xl font-black text-text-main/40 dark:text-white/40 flex items-center gap-2">
                            <span className="material-symbols-outlined">apartment</span> VERTEX
                        </div>
                        <div className="text-2xl font-black text-text-main/40 dark:text-white/40 flex items-center gap-2">
                            <span className="material-symbols-outlined">foundation</span> ALTA
                        </div>
                        <div className="text-2xl font-black text-text-main/40 dark:text-white/40 flex items-center gap-2">
                            <span className="material-symbols-outlined">domain</span> NEXUS
                        </div>
                        <div className="text-2xl font-black text-text-main/40 dark:text-white/40 flex items-center gap-2">
                            <span className="material-symbols-outlined">account_balance</span> OMEGA
                        </div>
                    </div>
                </div>
            </section>

            {/* Footer CTA */}
            <section className="relative bg-primary dark:bg-green-900 py-24 px-6 lg:px-12 overflow-hidden">
                {/* Abstract pattern background */}
                <div className="absolute inset-0 opacity-10" style={{ backgroundImage: "radial-gradient(#ffffff 1px, transparent 1px)", backgroundSize: "32px 32px" }}></div>
                <div className="relative z-10 max-w-4xl mx-auto text-center text-white">
                    <h2 className="text-4xl md:text-5xl font-black mb-6 tracking-tight">Join the Hermeos Journey.</h2>
                    <p className="text-lg md:text-xl text-white/90 mb-10 max-w-2xl mx-auto leading-relaxed">
                        Whether you are an investor looking for high-yield assets or a developer seeking partnership, the future of African real estate starts here.
                    </p>
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                        <Link to="/properties" className="w-full sm:w-auto px-8 py-4 bg-white text-primary rounded-lg font-bold text-lg hover:bg-gray-100 transition-colors shadow-lg">
                            Start Investing
                        </Link>
                        <button className="w-full sm:w-auto px-8 py-4 bg-transparent border-2 border-white/30 text-white rounded-lg font-bold text-lg hover:bg-white/10 transition-colors">
                            Contact Sales
                        </button>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default AboutUsPage;

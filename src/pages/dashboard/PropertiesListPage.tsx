import { Link } from 'react-router-dom';

export default function PropertiesListPage() {
    return (
        <div className="w-full max-w-[1440px] mx-auto px-4 md:px-8 lg:px-12 py-8">
            {/* Hero / Header */}
            <div className="mb-8">
                <h1 className="text-3xl md:text-4xl font-black leading-tight tracking-[-0.033em] text-slate-900 dark:text-white mb-2">
                    Marketplace
                </h1>
                <p className="text-slate-500 dark:text-text-secondary text-base font-normal max-w-2xl">
                    Diverse portfolio of high-yield Nigerian real estate opportunities. Acquire fractional ownership starting from ₦500k.
                </p>
            </div>

            {/* Filters Toolbar */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 bg-white dark:bg-[#1a2632] p-4 rounded-xl border border-gray-200 dark:border-slate-800 shadow-sm sticky top-16 z-20">
                <div className="flex items-center gap-2 overflow-x-auto scrollbar-hide no-scrollbar pb-1 md:pb-0 touch-pan-x">
                    <button className="px-4 py-2 rounded-lg bg-primary text-white font-bold text-sm whitespace-nowrap min-h-[44px]">All Assets</button>
                    <button className="px-4 py-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 font-medium text-sm whitespace-nowrap transition-colors min-h-[44px]">Residential</button>
                    <button className="px-4 py-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 font-medium text-sm whitespace-nowrap transition-colors min-h-[44px]">Commercial</button>
                    <button className="px-4 py-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 font-medium text-sm whitespace-nowrap transition-colors min-h-[44px]">Industrial</button>
                </div>
                <div className="flex items-center gap-3 w-full md:w-auto mt-2 md:mt-0">
                    <div className="relative flex-1 md:flex-none">
                        <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-[18px]">search</span>
                        <input type="text" placeholder="Search location..." className="w-full md:w-64 pl-9 pr-4 py-2.5 bg-gray-50 dark:bg-slate-800 border-none rounded-lg text-sm focus:ring-2 focus:ring-primary/50" />
                    </div>
                    <button className="p-2.5 border border-gray-200 dark:border-slate-700 rounded-lg text-slate-500 hover:text-primary hover:border-primary transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center">
                        <span className="material-symbols-outlined">filter_list</span>
                    </button>
                </div>
            </div>

            {/* Property Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[
                    {
                        name: "The Lekki Axis Commercial Hub",
                        loc: "Lekki Phase 1, Lagos",
                        type: "Commercial",
                        yield: "12-15%",
                        min: "₦ 500,000",
                        img: "https://lh3.googleusercontent.com/aida-public/AB6AXuCwlJIuJXNqlfuXy1JejpudfFLBhkxl_gVvWIKFAOyzcdj9MBWt2yx_58QPln1ooif1nz-ifQdvlcF9mWLodyxgvfMYiJvEqle1-4dFNPWwYSgVMM6GVMdvTD7Qlx2i-wxpUk-ubK-GiQ6r60_hdZi8jBk6HXkE6Kqfn-pEXgOPmN8G0oT-OzDX7-zDtgB82tMw6YCSjUO4XIOnHbLIJeHjHksOmCuvjolfIFLkqQgRv16thQKBidjecK2QYKm-HoE5PhoRlle4SqMx",
                        funded: 85
                    },
                    {
                        name: "Eko Atlantic Heights",
                        loc: "Victoria Island, Lagos",
                        type: "Residential",
                        yield: "9-11%",
                        min: "₦ 1,200,000",
                        img: "https://lh3.googleusercontent.com/aida-public/AB6AXuD8RfIgUnna4if2aQlP1S1ckTWQq-o5LYnadiMAHaJDEDtV9sNw879mg4LOd5b_mZtkh9QUcwxpKM7jB7yBzMCGMN-29nrKoJdRUDUz9jIODt46Hie7nkNJi_1BwXS8Y1SlqGzxbZJmGyoEAh5w47dnbov7QGIhqMYmvatNu4P_hYVpndulof75g0hG7vV3SNqvbUJm8aiGUBAwi-tjts_rPRCJoXHZXkn3maXJ1UaYbPehDq_QzTAqqR0yFYr7InTsAOkjUHYaaPPW",
                        funded: 45
                    },
                    {
                        name: "Ikeja GRA Office Complex",
                        loc: "Ikeja, Lagos",
                        type: "Commercial",
                        yield: "11-14%",
                        min: "₦ 750,000",
                        img: "https://lh3.googleusercontent.com/aida-public/AB6AXuCjIM1IuUaedXBubhvLbohr97MD98nJ9S8wmmSs3oguZhNPGeW_vVRQHr2QdFS4oWbSEWirjtjSNkDmVz53sjJtwjzM2eG9igbgBPXOkgUUv9mU7B0J2Js1bJmNVvlxymxaCf_3VoaUKH0Ki_eRMh1XW-JvasLS4XjA48rzL4ZoMT_03VCQmdnyIj0PcRPk00GWmjfOkNi3VrVT7zvvvmeBzy6b4NBbch_Ji-NTZ2sSOCgvYIYFQqekWcr-LsnWc8bqdgrBwPAd2zId",
                        funded: 62
                    },
                    {
                        name: "Abuja Central Towers",
                        loc: "CBD, Abuja",
                        type: "Mixed Use",
                        yield: "10-13%",
                        min: "₦ 1,000,000",
                        img: "https://lh3.googleusercontent.com/aida-public/AB6AXuDKqm_3hafcwEcIR-Qmz-d51w8bXcoC9yeG04p41z5x-YlQUTefqqy9NfGBtY-u6Bo2XxxvmHJpX_NtYSuDUJmC1l_YovzXDAdG8OXsBQhw9qCDrRUoIAwDnnqKjwnz8MLimhjfEoWN8SJnsDeNZpS8a0JCpY8wzDYkwei5Ki8dpLZGRuYGV-Cnpe3NEyzMZX3WVoZC-1V-n1zMzDVtbMi6ca5IGSJWnf4qVONysTjHyGgvkCFQv5iuMvfVLEmF14bIlT9FLjNxi547",
                        funded: 20
                    }
                ].map((item, i) => (
                    <div key={i} className="group bg-white dark:bg-[#1a2632] rounded-xl border border-gray-200 dark:border-slate-800 shadow-sm hover:shadow-lg transition-all overflow-hidden flex flex-col">
                        <div className="relative h-48 bg-gray-200 overflow-hidden">
                            <img
                                src={item.img}
                                alt={item.name}
                                loading="lazy"
                                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                                onError={(e) => {
                                    (e.target as HTMLImageElement).parentElement!.style.backgroundImage = `url('https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&q=80&w=800')`;
                                }}
                            />
                            <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm px-2 py-1 rounded text-xs font-bold text-slate-900 uppercase tracking-wide shadow-sm">
                                {item.type}
                            </div>
                            <div className="absolute top-3 right-3 bg-emerald-500 text-white px-2 py-1 rounded text-xs font-bold shadow-sm">
                                Est. Yield: {item.yield}
                            </div>
                        </div>
                        <div className="p-5 flex-1 flex flex-col">
                            <div className="mb-4">
                                <h3 className="text-lg font-bold text-slate-900 dark:text-white leading-tight mb-1 group-hover:text-primary transition-colors">{item.name}</h3>
                                <p className="text-sm text-slate-500 dark:text-slate-400 flex items-center gap-1">
                                    <span className="material-symbols-outlined text-[16px]">location_on</span> {item.loc}
                                </p>
                            </div>

                            <div className="grid grid-cols-2 gap-4 mb-4">
                                <div className="bg-slate-50 dark:bg-slate-800/50 p-2 rounded-lg">
                                    <p className="text-[10px] uppercase text-slate-400 font-bold mb-0.5">Min Contribution</p>
                                    <p className="text-sm font-bold text-slate-900 dark:text-white">{item.min}</p>
                                </div>
                                <div className="bg-slate-50 dark:bg-slate-800/50 p-2 rounded-lg">
                                    <p className="text-[10px] uppercase text-slate-400 font-bold mb-0.5">Funded</p>
                                    <div className="flex items-center gap-2">
                                        <div className="flex-1 h-1.5 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                                            <div className="h-full bg-primary rounded-full" style={{ width: `${item.funded}%` }}></div>
                                        </div>
                                        <span className="text-xs font-bold text-primary">{item.funded}%</span>
                                    </div>
                                </div>
                            </div>

                            <Link to="/properties/details" className="mt-auto w-full py-2.5 rounded-lg border border-primary text-primary hover:bg-primary hover:text-white font-bold text-sm transition-all text-center block">
                                View Opportunity
                            </Link>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

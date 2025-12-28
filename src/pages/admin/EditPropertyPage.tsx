
export default function EditPropertyPage() {
    return (
        <div className="max-w-6xl mx-auto flex flex-col gap-6">
            <nav className="flex flex-wrap gap-2 items-center text-sm">
                <a href="#" className="text-slate-500 hover:text-primary transition-colors font-medium">Dashboard</a>
                <span className="text-slate-400">/</span>
                <a href="#" className="text-slate-500 hover:text-primary transition-colors font-medium">Assets</a>
                <span className="text-slate-400">/</span>
                <span className="text-slate-900 dark:text-white font-semibold">The Eko Atlantic Heights</span>
            </nav>

            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-surface-light dark:bg-surface-dark p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm sticky top-0 z-10">
                <div className="flex flex-col gap-1">
                    <h1 className="text-[#0e141b] dark:text-white text-2xl md:text-3xl font-extrabold tracking-tight">Edit Asset: The Eko Atlantic Heights</h1>
                    <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 rounded text-xs font-semibold bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 border border-green-200 dark:border-green-800">Active</span>
                        <span className="text-slate-500 dark:text-slate-400 text-sm font-medium">Ref: #PROP-LG-8821</span>
                    </div>
                </div>
                <div className="flex gap-3 mt-2 md:mt-0">
                    <button className="px-5 h-11 rounded-lg border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-200 font-bold text-sm hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors flex items-center gap-2">
                        Cancel
                    </button>
                    <button className="px-5 h-11 rounded-lg bg-primary hover:bg-blue-600 text-white font-bold text-sm shadow-sm transition-colors flex items-center gap-2">
                        <span className="material-symbols-outlined text-[18px]">save</span>
                        Save Changes
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 flex flex-col gap-6">
                    <div className="bg-surface-light dark:bg-surface-dark rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
                        <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/50">
                            <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                                <span className="material-symbols-outlined text-slate-400">info</span> Asset Information
                            </h2>
                        </div>
                        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Asset Designation</label>
                                <input className="w-full rounded-lg border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-primary focus:border-primary" type="text" defaultValue="The Eko Atlantic Heights" />
                            </div>
                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Physical Address</label>
                                <div className="relative">
                                    <span className="material-symbols-outlined absolute left-3 top-2.5 text-slate-400">location_on</span>
                                    <input className="w-full pl-10 rounded-lg border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-primary focus:border-primary" type="text" defaultValue="Block 15, Admiralty Way, Victoria Island, Lagos" />
                                </div>
                            </div>
                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Operational Summary</label>
                                <textarea className="w-full rounded-lg border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-primary focus:border-primary p-3" rows={4} defaultValue="Premium mixed-use development situated in the high-demand Victoria Island district. Features state-of-the-art office spaces and luxury residential units. Strategic proximity to major financial institutions and the Eko Hotel." />
                                <p className="text-xs text-slate-500 mt-1 text-right">0/500 characters</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-surface-light dark:bg-surface-dark rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
                        <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/50 flex justify-between items-center">
                            <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                                <span className="material-symbols-outlined text-slate-400">payments</span> Valuation & Capital
                            </h2>
                            <span className="text-xs font-medium text-primary bg-primary/10 px-2 py-1 rounded">Naira (₦)</span>
                        </div>
                        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Total Asset Valuation</label>
                                <div className="relative">
                                    <span className="absolute left-3 top-2.5 text-slate-500 font-semibold">₦</span>
                                    <input className="w-full pl-8 rounded-lg border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-primary focus:border-primary font-mono" type="text" defaultValue="850,000,000" />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Target Acquisition Cap</label>
                                <div className="relative">
                                    <span className="absolute left-3 top-2.5 text-slate-500 font-semibold">₦</span>
                                    <input className="w-full pl-8 rounded-lg border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-primary focus:border-primary font-mono" type="text" defaultValue="280,000,000" />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Allocated Units</label>
                                <input className="w-full rounded-lg border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-primary focus:border-primary font-mono" type="number" defaultValue="200" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Capital Raised</label>
                                <div className="relative">
                                    <span className="absolute left-3 top-2.5 text-slate-500 font-semibold">₦</span>
                                    <input className="w-full pl-8 rounded-lg border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-primary focus:border-primary font-mono bg-green-50 dark:bg-green-900/10 border-green-200 dark:border-green-900/30" type="text" defaultValue="227,500,000" />
                                </div>
                                <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-1.5 mt-2 overflow-hidden">
                                    <div className="bg-green-500 h-1.5 rounded-full" style={{ width: '81%' }}></div>
                                </div>
                                <p className="text-xs text-slate-500 mt-1">81% Subscribed</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-surface-light dark:bg-surface-dark rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
                        <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/50 flex justify-between items-center">
                            <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                                <span className="material-symbols-outlined text-slate-400">imagesmode</span> Asset Imagery
                            </h2>
                            <button className="text-primary text-sm font-bold hover:underline">+ Upload New</button>
                        </div>
                        <div className="p-6">
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                {[
                                    "https://lh3.googleusercontent.com/aida-public/AB6AXuDKqm_3hafcwEcIR-Qmz-d51w8bXcoC9yeG04p41z5x-YlQUTefqqy9NfGBtY-u6Bo2XxxvmHJpX_NtYSuDUJmC1l_YovzXDAdG8OXsBQhw9qCDrRUoIAwDnnqKjwnz8MLimhjfEoWN8SJnsDeNZpS8a0JCpY8wzDYkwei5Ki8dpLZGRuYGV-Cnpe3NEyzMZX3WVoZC-1V-n1zMzDVtbMi6ca5IGSJWnf4qVONysTjHyGgvkCFQv5iuMvfVLEmF14bIlT9FLjNxi547",
                                    "https://lh3.googleusercontent.com/aida-public/AB6AXuChSFacPfW-wVMZkURKr2s7e6L6KJSUqiT0LR7afVCSxHbpfJnTbuvK7riTpX_j0QcCd44A-uSdDNIgPpYkoKDLZNo9X1pdzvGxURvBlqeZ_haFgln_wwC4aBN2Ar32Lo5qZG2sH50ELODrHhGmG4wGtSTDZgdU4Wz3CXmcke6D8bADczIRGdOpesMe_MlyMhEatDur48Y3N0gcIFQ2WLFgDMq_dFJOqVXP_N3bMb6uJVNin9R5DsyVTNTMpO9Owib4jF8R1RSF5uuA",
                                    "https://lh3.googleusercontent.com/aida-public/AB6AXuBr35SEsJSv75OLs1GXGJV46A8L3_FgBB8AgbbttLll_U2R_rsatWL46jj1gt3PJxqgyTF7gUR_Cs_32xaWfn-F6CeWKFF39uz3x3vHVfETpSnLsFjr3DZntAyx08Jm1I_zaNjdKdgsPych0NxwccV3Nyah5ySxAJ9Z0cmT4e_UGRf7jDxvIHRs51ryrX8FZen3R139lCmQnyveJ1V48Vz6yM6Fsag6j0xVXor2wz61W_w1Kp6D07vOTBe0P1TGJbdy-tiXBwGFgMu0"
                                ].map((src, i) => (
                                    <div key={i} className="group relative aspect-square bg-slate-100 rounded-lg overflow-hidden border border-slate-200 dark:border-slate-700">
                                        <img alt="Property" className="w-full h-full object-cover" src={src} />
                                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                                            <button className="p-1.5 bg-white rounded-full text-slate-900 hover:text-primary"><span className="material-symbols-outlined text-lg">edit</span></button>
                                            <button className="p-1.5 bg-white rounded-full text-red-600 hover:bg-red-50"><span className="material-symbols-outlined text-lg">delete</span></button>
                                        </div>
                                    </div>
                                ))}
                                <div className="aspect-square bg-slate-50 dark:bg-slate-800/50 rounded-lg border-2 border-dashed border-slate-300 dark:border-slate-700 flex flex-col items-center justify-center cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors group">
                                    <span className="material-symbols-outlined text-slate-400 group-hover:text-primary text-3xl mb-1">cloud_upload</span>
                                    <span className="text-xs font-semibold text-slate-500 group-hover:text-primary">Upload</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="lg:col-span-1 flex flex-col gap-6">
                    <div className="bg-surface-light dark:bg-surface-dark rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
                        <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/50">
                            <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                                <span className="material-symbols-outlined text-slate-400">tune</span> Status Configuration
                            </h2>
                        </div>
                        <div className="p-6 flex flex-col gap-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Asset Status</label>
                                <select className="w-full rounded-lg border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-primary focus:border-primary">
                                    <option>Draft Mode</option>
                                    <option defaultChecked>Open for Subscription</option>
                                    <option>Offer Pending</option>
                                    <option>Transaction Closed</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Processing Stage</label>
                                <div className="flex items-center gap-3 p-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50">
                                    <div className="size-2 rounded-full bg-yellow-500 animate-pulse"></div>
                                    <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Due Diligence Review</span>
                                </div>
                            </div>
                            <div className="pt-2">
                                <label className="flex items-center gap-3 cursor-pointer">
                                    <input type="checkbox" className="w-4 h-4 text-primary focus:ring-primary border-slate-300 rounded" defaultChecked />
                                    <span className="text-sm text-slate-700 dark:text-slate-300">Publicly Visible to Partners</span>
                                </label>
                            </div>
                        </div>
                    </div>

                    <div className="bg-surface-light dark:bg-surface-dark rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
                        <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/50 flex justify-between items-center">
                            <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                                <span className="material-symbols-outlined text-slate-400">description</span> Documentation
                            </h2>
                        </div>
                        <div className="p-0">
                            <div className="flex flex-col">
                                {[
                                    { name: 'C_of_O.pdf', size: '2.4 MB', date: 'Oct 12, 2023', type: 'picture_as_pdf', color: 'bg-red-50 text-red-600' },
                                    { name: 'Valuation_Report_Lagos.docx', size: '1.1 MB', date: 'Sep 28, 2023', type: 'article', color: 'bg-blue-50 text-blue-600' }
                                ].map((doc, i) => (
                                    <div key={i} className="flex items-center justify-between p-4 border-b border-slate-100 dark:border-slate-800/50 hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
                                        <div className="flex items-center gap-3">
                                            <div className={`${doc.color} p-2 rounded-lg`}>
                                                <span className="material-symbols-outlined text-[20px]">{doc.type}</span>
                                            </div>
                                            <div className="flex flex-col">
                                                <span className="text-sm font-semibold text-slate-900 dark:text-slate-200">{doc.name}</span>
                                                <span className="text-xs text-slate-500">{doc.size} • {doc.date}</span>
                                            </div>
                                        </div>
                                        <button className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"><span className="material-symbols-outlined">more_vert</span></button>
                                    </div>
                                ))}
                            </div>
                            <div className="p-4 pt-2">
                                <button className="w-full py-2 border border-dashed border-slate-300 dark:border-slate-600 rounded-lg text-slate-500 hover:text-primary hover:border-primary hover:bg-primary/5 transition-all text-sm font-medium flex justify-center items-center gap-2">
                                    <span className="material-symbols-outlined text-[18px]">upload_file</span>
                                    Upload File
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className="bg-surface-light dark:bg-surface-dark rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
                        <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/50">
                            <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                                <span className="material-symbols-outlined text-slate-400">history</span> Audit Trail
                            </h2>
                        </div>
                        <div className="p-6">
                            <ol className="relative border-l border-slate-200 dark:border-slate-700 ml-2">
                                <li className="mb-6 ml-6">
                                    <span className="absolute flex items-center justify-center w-5 h-5 bg-blue-100 rounded-full -left-2.5 ring-4 ring-white dark:ring-slate-900 dark:bg-blue-900">
                                        <div className="w-2 h-2 bg-primary rounded-full"></div>
                                    </span>
                                    <h3 className="flex items-center mb-1 text-sm font-semibold text-slate-900 dark:text-white">Updated Valuation</h3>
                                    <p className="mb-1 text-xs font-normal text-slate-500 dark:text-slate-400">Adjusted from ₦820M to ₦850M</p>
                                    <time className="block mb-2 text-xs font-normal text-slate-400">Just now by You</time>
                                </li>
                                <li className="mb-6 ml-6">
                                    <span className="absolute flex items-center justify-center w-5 h-5 bg-slate-100 rounded-full -left-2.5 ring-4 ring-white dark:ring-slate-900 dark:bg-slate-700">
                                        <div className="w-2 h-2 bg-slate-400 rounded-full"></div>
                                    </span>
                                    <h3 className="mb-1 text-sm font-semibold text-slate-900 dark:text-white">New Document Added</h3>
                                    <p className="mb-1 text-xs font-normal text-slate-500 dark:text-slate-400">C_of_O.pdf uploaded</p>
                                    <time className="block mb-2 text-xs font-normal text-slate-400">2 hours ago by Chinedu O.</time>
                                </li>
                                <li className="ml-6">
                                    <span className="absolute flex items-center justify-center w-5 h-5 bg-slate-100 rounded-full -left-2.5 ring-4 ring-white dark:ring-slate-900 dark:bg-slate-700">
                                        <div className="w-2 h-2 bg-slate-400 rounded-full"></div>
                                    </span>
                                    <h3 className="mb-1 text-sm font-semibold text-slate-900 dark:text-white">Record Created</h3>
                                    <time className="block mb-2 text-xs font-normal text-slate-400">Oct 10, 2023 by System</time>
                                </li>
                            </ol>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

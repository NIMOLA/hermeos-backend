
import { Button } from '../../components/ui/button';

export default function DocumentsPage() {
    const documents = [
        { id: 1, name: 'Oceanview Apartments - Deed of Assignment', type: 'Legal', date: 'Dec 24, 2023', size: '2.4 MB' },
        { id: 2, name: 'Q4 2023 Rental Distribution Statement', type: 'Financial', date: 'Dec 01, 2023', size: '1.1 MB' },
        { id: 3, name: 'Hermeos Platform Terms of Service', type: 'Policy', date: 'Nov 15, 2023', size: '0.5 MB' },
        { id: 4, name: 'KYC Verification Certificate', type: 'Identity', date: 'Oct 20, 2023', size: '0.8 MB' },
    ];

    return (
        <div className="max-w-5xl mx-auto p-6 space-y-8">
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white">My Documents</h1>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                {/* Filters Sidebar */}
                <div className="space-y-2">
                    <h3 className="font-bold text-sm text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-4">Categories</h3>
                    {['All Documents', 'Legal Agreements', 'Financial Statements', 'Tax Records'].map((cat, i) => (
                        <div key={i} className={`px-4 py-2 rounded-lg text-sm font-medium cursor-pointer transition-colors ${i === 0 ? 'bg-primary/10 text-primary' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'}`}>
                            {cat}
                        </div>
                    ))}
                </div>

                {/* Docs Grid */}
                <div className="md:col-span-3">
                    <div className="bg-white dark:bg-[#1a2632] rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden">
                        <table className="w-full text-left">
                            <thead className="bg-slate-50 dark:bg-slate-900/50 border-b border-slate-200 dark:border-slate-800">
                                <tr>
                                    <th className="p-4 text-xs font-bold text-slate-500 uppercase">Document Name</th>
                                    <th className="p-4 text-xs font-bold text-slate-500 uppercase hidden sm:table-cell">Type</th>
                                    <th className="p-4 text-xs font-bold text-slate-500 uppercase hidden sm:table-cell">Date</th>
                                    <th className="p-4 text-xs font-bold text-slate-500 uppercase">Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                                {documents.map((doc) => (
                                    <tr key={doc.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors group">
                                        <td className="p-4">
                                            <div className="flex items-center gap-3">
                                                <div className="bg-red-100 text-red-600 p-2 rounded">
                                                    <span className="material-symbols-outlined text-xl">picture_as_pdf</span>
                                                </div>
                                                <div>
                                                    <p className="font-bold text-slate-900 dark:text-white text-sm">{doc.name}</p>
                                                    <p className="text-xs text-slate-500 sm:hidden">{doc.date} • {doc.size}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="p-4 hidden sm:table-cell">
                                            <span className="px-2 py-1 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-xs rounded-md font-bold">
                                                {doc.type}
                                            </span>
                                        </td>
                                        <td className="p-4 text-sm text-slate-600 dark:text-slate-400 hidden sm:table-cell">{doc.date}</td>
                                        <td className="p-4">
                                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                                <span className="material-symbols-outlined text-slate-400 group-hover:text-primary">download</span>
                                            </Button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        {documents.length === 0 && (
                            <div className="p-12 text-center text-slate-500">No documents found.</div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

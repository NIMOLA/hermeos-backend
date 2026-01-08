
import { Link } from 'react-router-dom';
import { Button } from '../../components/ui/button';

export default function AdminAssetsPage() {
    const assets = [
        { id: 1, name: "Sunset Heights", type: "Residential", location: "Lagos, NG", value: "₦450M", status: "Active", partners: 124 },
        { id: 2, name: "Oceanview Complex", type: "Commercial", location: "Lagos, NG", value: "₦1.2B", status: "Funding", partners: 85 },
        { id: 3, name: "Greenfield Estate", type: "Land", location: "Abuja, NG", value: "₦850M", status: "Pending", partners: 0 },
        { id: 4, name: "Tech Hub Plaza", type: "Commercial", location: "Lagos, NG", value: "₦2.1B", status: "Active", partners: 310 },
    ];

    return (
        <div className="flex flex-col gap-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Assets Inventory</h1>
                    <p className="text-slate-500 dark:text-slate-400 text-sm">Manage all real estate assets on the platform.</p>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline"><span className="material-symbols-outlined mr-2">upload</span> Import</Button>
                    <Link to="/admin/edit-property">
                        <Button><span className="material-symbols-outlined mr-2">add</span> New Asset</Button>
                    </Link>
                </div>
            </div>

            <div className="bg-white dark:bg-[#1a2632] border border-slate-200 dark:border-slate-800 rounded-xl shadow-sm overflow-hidden">
                <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex gap-4">
                    <div className="relative flex-1 max-w-md">
                        <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">search</span>
                        <input className="w-full pl-10 pr-4 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-sm outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all" placeholder="Search assets..." />
                    </div>
                    <Button variant="outline"><span className="material-symbols-outlined mr-2">filter_list</span> Filter</Button>
                </div>
                <div className="table-wrapper">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-50 dark:bg-slate-900/50 border-b border-slate-200 dark:border-slate-800">
                                <th className="p-4 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Property Name</th>
                                <th className="p-4 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Type</th>
                                <th className="p-4 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Valuation</th>
                                <th className="p-4 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Status</th>
                                <th className="p-4 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Partners</th>
                                <th className="p-4 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {assets.map((asset) => (
                                <tr key={asset.id} className="border-b border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                                    <td className="p-4">
                                        <div className="flex flex-col">
                                            <span className="text-sm font-semibold text-slate-900 dark:text-white">{asset.name}</span>
                                            <span className="text-xs text-slate-500">{asset.location}</span>
                                        </div>
                                    </td>
                                    <td className="p-4 text-sm text-slate-600 dark:text-slate-300">{asset.type}</td>
                                    <td className="p-4 text-sm font-medium text-slate-900 dark:text-white">{asset.value}</td>
                                    <td className="p-4">
                                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${asset.status === 'Active' ? 'bg-green-50 text-green-700 border-green-200 dark:bg-green-900/20 dark:text-green-400 dark:border-green-900/30' :
                                            asset.status === 'Funding' ? 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-900/30' :
                                                'bg-slate-100 text-slate-600 border-slate-200 dark:bg-slate-800 dark:text-slate-400 dark:border-slate-700'
                                            }`}>
                                            {asset.status}
                                        </span>
                                    </td>
                                    <td className="p-4 text-sm text-slate-600 dark:text-slate-300">{asset.partners}</td>
                                    <td className="p-4 text-right">
                                        <Link to="/admin/edit-property">
                                            <button className="text-slate-400 hover:text-primary transition-colors p-1">
                                                <span className="material-symbols-outlined text-[20px]">edit_square</span>
                                            </button>
                                        </Link>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                <div className="p-4 border-t border-slate-200 dark:border-slate-800 text-center">
                    <button className="text-sm text-slate-500 hover:text-primary font-medium">View All Assets</button>
                </div>
            </div>
        </div>
    );
}

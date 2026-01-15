import { useState } from 'react';
import { useFetch } from '../../hooks/useApi';
import { Button } from '../../components/ui/button';
import { Check, X, MapPin, Home, Layout, Maximize, Layers, Lightbulb } from 'lucide-react';

interface Property {
    id: string;
    name: string;
    description: string;
    propertyType: string;
    location: string;
    city: string;
    state: string;
    size: string;
    bedrooms: number;
    bathrooms: number;
    status: string;
    images: string[];
    amenities: string[];
    locationHighlights: string[];
    floorLevel: string;
}

export default function PropertyComparisonPage() {
    const { data: propertiesData, isLoading } = useFetch<any>('/properties');

    // Check if simple array or { data: [] }
    const rawData = Array.isArray(propertiesData) ? propertiesData : (propertiesData as any)?.data || [];
    const properties: Property[] = rawData;

    const [selectedIds, setSelectedIds] = useState<string[]>([]);

    // Helper to toggle properties
    const toggleProperty = (id: string) => {
        if (selectedIds.includes(id)) {
            setSelectedIds(selectedIds.filter(pid => pid !== id));
        } else {
            if (selectedIds.length < 3) {
                setSelectedIds([...selectedIds, id]);
            } else {
                alert("You can compare up to 3 properties.");
            }
        }
    };

    const selectedProperties = properties.filter(p => selectedIds.includes(p.id));

    return (
        <div className="space-y-6">
            <div className="flex flex-col gap-2">
                <h1 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white">Compare Cooperative Assets</h1>
                <p className="text-slate-500 dark:text-slate-400">Evaluate properties based on features, location, and suitability for your needs.</p>
            </div>

            {/* Selection Area if none or < 3 selected, show list to add */}
            <div className="bg-white dark:bg-surface-dark border border-slate-200 dark:border-slate-800 rounded-xl p-4 overflow-x-auto">
                <div className="flex gap-4 min-w-max">
                    {isLoading ? <p>Loading properties...</p> : properties.map(p => (
                        <div
                            key={p.id}
                            onClick={() => toggleProperty(p.id)}
                            className={`flex items-center gap-3 p-2 pr-4 rounded-lg border cursor-pointer transition-all ${selectedIds.includes(p.id) ? 'bg-primary/10 border-primary ring-1 ring-primary' : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 hover:border-primary/50'}`}
                        >
                            <div className="w-12 h-12 bg-slate-200 rounded overflow-hidden">
                                {p.images && p.images[0] && <img src={p.images[0]} alt={p.name} className="w-full h-full object-cover" />}
                            </div>
                            <div className="flex flex-col text-sm">
                                <span className="font-bold text-slate-900 dark:text-white truncate max-w-[120px]">{p.name}</span>
                                <span className="text-xs text-slate-500">{p.propertyType}</span>
                            </div>
                            {selectedIds.includes(p.id) && <Check className="w-4 h-4 text-primary" />}
                        </div>
                    ))}
                </div>
            </div>

            {/* Comparison Table */}
            {selectedProperties.length > 0 ? (
                <div className="bg-white dark:bg-surface-dark border border-slate-200 dark:border-slate-800 rounded-xl shadow-sm overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr>
                                    <th className="p-6 bg-slate-50 dark:bg-slate-800/50 w-48 text-sm font-bold text-slate-500 uppercase tracking-wider">Property</th>
                                    {selectedProperties.map(p => (
                                        <th key={p.id} className="p-6 min-w-[250px] relative">
                                            <button
                                                onClick={() => toggleProperty(p.id)}
                                                className="absolute top-2 right-2 text-slate-400 hover:text-red-500"
                                                aria-label="Remove property"
                                            >
                                                <X className="w-4 h-4" />
                                            </button>
                                            <div className="w-full h-40 bg-slate-200 rounded-lg overflow-hidden mb-4">
                                                {p.images?.[0] ? <img src={p.images[0]} alt={p.name} className="w-full h-full object-cover" /> : null}
                                            </div>
                                            <h3 className="font-bold text-lg">{p.name}</h3>
                                            <p className="text-sm text-slate-500 flex items-center gap-1">
                                                <MapPin className="w-3 h-3" />
                                                {p.city}, {p.state}
                                            </p>
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                                <tr>
                                    <td className="p-6 font-medium text-slate-500 bg-slate-50/50 dark:bg-slate-800/30 flex items-center gap-2">
                                        <Home className="w-4 h-4" /> Type
                                    </td>
                                    {selectedProperties.map(p => (
                                        <td key={p.id} className="p-6 text-slate-900 dark:text-white font-medium">
                                            {p.propertyType || 'N/A'}
                                        </td>
                                    ))}
                                </tr>
                                <tr>
                                    <td className="p-6 font-medium text-slate-500 bg-slate-50/50 dark:bg-slate-800/30 flex items-center gap-2">
                                        <Maximize className="w-4 h-4" /> Size
                                    </td>
                                    {selectedProperties.map(p => (
                                        <td key={p.id} className="p-6 text-slate-700 dark:text-slate-300">
                                            {p.size || 'N/A'}
                                        </td>
                                    ))}
                                </tr>
                                <tr>
                                    <td className="p-6 font-medium text-slate-500 bg-slate-50/50 dark:bg-slate-800/30 flex items-center gap-2">
                                        <Layout className="w-4 h-4" /> Interior
                                    </td>
                                    {selectedProperties.map(p => (
                                        <td key={p.id} className="p-6 text-slate-700 dark:text-slate-300">
                                            {p.bedrooms ? `${p.bedrooms} Beds` : '-'} / {p.bathrooms ? `${p.bathrooms} Baths` : '-'}
                                        </td>
                                    ))}
                                </tr>
                                <tr>
                                    <td className="p-6 font-medium text-slate-500 bg-slate-50/50 dark:bg-slate-800/30 flex items-center gap-2">
                                        <Layers className="w-4 h-4" /> Floor Level
                                    </td>
                                    {selectedProperties.map(p => (
                                        <td key={p.id} className="p-6 text-slate-700 dark:text-slate-300">
                                            {p.floorLevel || 'N/A'}
                                        </td>
                                    ))}
                                </tr>
                                <tr>
                                    <td className="p-6 font-medium text-slate-500 bg-slate-50/50 dark:bg-slate-800/30">Infrastructure & Amenities</td>
                                    {selectedProperties.map(p => (
                                        <td key={p.id} className="p-6 text-slate-700 dark:text-slate-300 text-sm">
                                            {p.amenities?.length ? (
                                                <ul className="list-disc list-inside">
                                                    {p.amenities.map((item, idx) => (
                                                        <li key={idx}>{item}</li>
                                                    ))}
                                                </ul>
                                            ) : (
                                                <span className="text-slate-400 italic">No amenities listed</span>
                                            )}
                                        </td>
                                    ))}
                                </tr>
                                <tr>
                                    <td className="p-6 font-medium text-slate-500 bg-slate-50/50 dark:bg-slate-800/30 flex items-center gap-2">
                                        <Lightbulb className="w-4 h-4" /> Location Highlights
                                    </td>
                                    {selectedProperties.map(p => (
                                        <td key={p.id} className="p-6 text-slate-700 dark:text-slate-300 text-sm">
                                            {p.locationHighlights?.length ? (
                                                <ul className="list-disc list-inside">
                                                    {p.locationHighlights.map((item, idx) => (
                                                        <li key={idx}>{item}</li>
                                                    ))}
                                                </ul>
                                            ) : (
                                                <span className="text-slate-400 italic">No highlights listed</span>
                                            )}
                                        </td>
                                    ))}
                                </tr>
                                <tr>
                                    <td className="p-6 font-medium text-slate-500 bg-slate-50/50 dark:bg-slate-800/30">Action</td>
                                    {selectedProperties.map(p => (
                                        <td key={p.id} className="p-6">
                                            <Button className="w-full">View Full Details</Button>
                                        </td>
                                    ))}
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            ) : (
                <div className="text-center py-20 border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-2xl">
                    <p className="text-slate-400">Select properties above to start comparing features</p>
                </div>
            )}
        </div>
    );
}

import { useRef, useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { apiClient } from '../../hooks/useApi';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { useAuth } from '../../contexts/AuthContext';
import {
    Info, MapPin, DollarSign, UploadCloud, Trash2, Plus,
    ChevronRight, Save, LayoutDashboard, Building2, Users, FileText, Settings, ListPlus, Layers
} from 'lucide-react';
import { getImageUrl } from '../../utils/imageUtils';

export default function EditPropertyPage() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { user } = useAuth();
    const isNew = !id;

    const [loading, setLoading] = useState(!isNew);
    const [saving, setSaving] = useState(false);

    // Form State
    const [formData, setFormData] = useState({
        name: '',
        propertyType: 'Multi-family Residential',
        yearBuilt: new Date().getFullYear(),
        description: '',
        address: '',
        city: '',
        state: '',
        postalCode: '',
        totalValue: 0,
        pricePerUnit: 0,
        totalUnits: 0,
        minInvestment: 0,
        expectedReturn: '',
        status: 'DRAFT',
        images: [] as string[],

        // New Comparison Features
        amenities: [] as string[], // Infrastructure
        locationHighlights: [] as string[],
        floorLevel: '',
        size: '', // Existing in schema but might need input
        bedrooms: 0,
        bathrooms: 0
    });

    // Helper for array inputs (comma separated)
    const [amenitiesInput, setAmenitiesInput] = useState('');
    const [highlightsInput, setHighlightsInput] = useState('');

    useEffect(() => {
        if (!isNew && id) {
            apiClient.get(`/properties/${id}`)
                .then(res => {
                    const data = (res as any).data;
                    const p = data?.data || data;
                    if (p) {
                        setFormData({
                            name: p.name,
                            propertyType: p.propertyType || 'Multi-family Residential',
                            yearBuilt: p.yearBuilt || new Date().getFullYear(),
                            description: p.description || '',
                            address: p.address || '',
                            city: p.city || '',
                            state: p.state || '',
                            postalCode: p.postalCode || '',
                            totalValue: Number(p.totalValue),
                            pricePerUnit: Number(p.pricePerUnit),
                            totalUnits: Number(p.totalUnits),
                            minInvestment: Number(p.minInvestment || p.pricePerUnit),
                            expectedReturn: p.expectedReturn ? String(p.expectedReturn) : '',
                            status: p.status || 'DRAFT',
                            images: p.images || [],

                            amenities: p.amenities || [],
                            locationHighlights: p.locationHighlights || [],
                            floorLevel: p.floorLevel || '',
                            size: p.size || '',
                            bedrooms: p.bedrooms || 0,
                            bathrooms: p.bathrooms || 0
                        });
                        setAmenitiesInput((p.amenities || []).join(', '));
                        setHighlightsInput((p.locationHighlights || []).join(', '));
                    }
                })
                .catch(err => {
                    console.error("Failed to load property", err);
                    alert("Failed to load property details");
                })
                .finally(() => setLoading(false));
        }
    }, [id, isNew]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'number' ? Number(value) : value
        }));
    };

    const handleArrayInputBlur = (field: 'amenities' | 'locationHighlights', value: string) => {
        const arr = value.split(',').map(s => s.trim()).filter(Boolean);
        setFormData(prev => ({ ...prev, [field]: arr }));
    };

    const handleSave = async () => {
        if (!formData.name || !formData.address || !formData.totalValue) {
            alert("Please fill in required fields.");
            return;
        }

        setSaving(true);
        try {
            let finalTotalUnits = formData.totalUnits;
            if (finalTotalUnits === 0 && formData.pricePerUnit > 0) {
                finalTotalUnits = Math.floor(formData.totalValue / formData.pricePerUnit);
            }

            const { minInvestment, ...restFormData } = formData; // Destructure minInvestment
            const payload = {
                ...restFormData,
                totalUnits: finalTotalUnits || 1,
                expectedReturn: parseFloat(String(formData.expectedReturn).match(/(\d+(\.\d+)?)/)?.[0] || '0'),
                location: `${formData.city}, ${formData.state}`,
                // Arrays are already in formData
            };

            // Remove startDate as it's not in the schema
            // console.log("Payload:", payload);

            if (isNew) {
                await apiClient.post('/properties', payload);
                alert("Property Created Successfully!");
                navigate('/admin/assets');
            } else {
                await apiClient.put(`/properties/${id}`, payload);
                alert("Property Updated Successfully!");
            }
        } catch (error: any) {
            console.error("Save failed", error);
            const msg = error.message;
            const validationErrors = error.errors?.map((e: any) => e.msg || e.message).join(', ');
            alert(msg || validationErrors || "Failed to save property.");
        } finally {
            setSaving(false);
        }
    };

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (!files || files.length === 0) return;

        // Upload all selected files concurrently
        const uploadPromises = Array.from(files).map(async (file) => {
            const formData = new FormData();
            formData.append('file', file);

            try {
                const res = await apiClient.upload<any>('/upload', formData);

                if (res && res.url) {
                    return res.url;
                }
                return null;
            } catch (error) {
                console.error(`Upload failed for ${file.name}`, error);
                return null;
            }
        });

        try {
            const uploadedUrls = await Promise.all(uploadPromises);
            const successfulUploads = uploadedUrls.filter((url): url is string => url !== null);

            if (successfulUploads.length > 0) {
                setFormData(prev => ({ ...prev, images: [...prev.images, ...successfulUploads] }));
            }

            if (successfulUploads.length < files.length) {
                alert(`${files.length - successfulUploads.length} image(s) failed to upload`);
            }
        } catch (error) {
            console.error("Upload failed", error);
            alert("Failed to upload images");
        }
    };

    const removeImage = (index: number) => {
        setFormData(prev => ({
            ...prev,
            images: prev.images.filter((_, i) => i !== index)
        }));
    };

    if (loading) return <div className="p-10 text-center flex items-center justify-center min-h-[60vh]"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div></div>;

    return (
        <div className="flex flex-col min-h-screen bg-slate-50 dark:bg-slate-900">
            <div className="w-full max-w-[1200px] mx-auto p-4 md:p-8 flex flex-col gap-6">
                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div>
                        <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                            {isNew ? 'Create New Property' : 'Edit Property'}
                        </h1>
                        <p className="text-slate-500 mt-1">Detailed specifications for comparison and valuation.</p>
                    </div>
                    <div className="flex items-center gap-3">
                        <input
                            type="file"
                            accept="image/*"
                            multiple
                            className="hidden"
                            id="image-upload"
                            onChange={handleImageUpload}
                        />
                        <Button variant="outline" onClick={() => navigate('/admin/assets')}>Cancel</Button>
                        <Button onClick={handleSave} disabled={saving} className="bg-primary hover:bg-primary/90 text-white gap-2 shadow-lg shadow-primary/25">
                            <Save className="w-4 h-4" />
                            {saving ? 'Saving...' : 'Save Property'}
                        </Button>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 pb-10">
                    <div className="lg:col-span-2 flex flex-col gap-6">

                        {/* Basic Info */}
                        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-6">
                            <h2 className="text-xl font-bold mb-6 flex items-center gap-2 text-slate-900 dark:text-white">
                                <Info className="w-5 h-5 text-primary" /> Basic Information
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="col-span-2">
                                    <label className="block text-sm font-semibold mb-2">Property Name *</label>
                                    <input name="name" value={formData.name} onChange={handleInputChange} className="w-full rounded-lg border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-900 p-3 text-sm focus:border-primary focus:ring-primary outline-none" />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold mb-2">Property Type</label>
                                    <select name="propertyType" value={formData.propertyType} onChange={handleInputChange} className="w-full rounded-lg border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-900 p-3 text-sm focus:border-primary focus:ring-primary outline-none">
                                        <option>Multi-family Residential</option>
                                        <option>Commercial Office</option>
                                        <option>Industrial Warehouse</option>
                                        <option>Mixed Use</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold mb-2">Desc</label>
                                    <input name="description" value={formData.description} onChange={handleInputChange} className="w-full rounded-lg border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-900 p-3 text-sm" />
                                </div>
                            </div>
                        </div>

                        {/* Images & Media */}
                        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-6">
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-xl font-bold flex items-center gap-2 text-slate-900 dark:text-white">
                                    <UploadCloud className="w-5 h-5 text-primary" /> Property Images
                                </h2>
                                <Button size="sm" variant="outline" onClick={() => document.getElementById('image-upload')?.click()}>
                                    <Plus className="w-4 h-4 mr-2" /> Add Image
                                </Button>
                            </div>

                            {formData.images.length === 0 ? (
                                <div className="text-center p-8 border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-lg">
                                    <p className="text-slate-500">No images uploaded yet.</p>
                                </div>
                            ) : (
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                    {formData.images.map((img, idx) => (
                                        <div key={idx} className="relative group aspect-square rounded-lg overflow-hidden border border-slate-200 dark:border-slate-700">
                                            <img src={getImageUrl(img)} alt={`Property ${idx}`} className="w-full h-full object-cover" />
                                            <button
                                                onClick={() => removeImage(idx)}
                                                className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                                            >
                                                <Trash2 className="w-3 h-3" />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Specs & Features (New) */}
                        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-6">
                            <h2 className="text-xl font-bold mb-6 flex items-center gap-2 text-slate-900 dark:text-white">
                                <ListPlus className="w-5 h-5 text-primary" /> Specifications & Features
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-semibold mb-2">Size (sqm)</label>
                                    <input name="size" value={formData.size} onChange={handleInputChange} className="w-full rounded-lg border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-900 p-3 text-sm" placeholder="e.g. 1200 sqm" />
                                </div>
                                <div className="grid grid-cols-2 gap-2">
                                    <div>
                                        <label className="block text-sm font-semibold mb-2">Bedrooms</label>
                                        <input name="bedrooms" type="number" value={formData.bedrooms} onChange={handleInputChange} className="w-full rounded-lg border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-900 p-3 text-sm" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-semibold mb-2">Bathrooms</label>
                                        <input name="bathrooms" type="number" value={formData.bathrooms} onChange={handleInputChange} className="w-full rounded-lg border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-900 p-3 text-sm" />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold mb-2">Floor Level</label>
                                    <input name="floorLevel" value={formData.floorLevel} onChange={handleInputChange} className="w-full rounded-lg border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-900 p-3 text-sm" placeholder="e.g. 5th Floor" />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold mb-2">Amenities / Infrastructure</label>
                                    <input
                                        value={amenitiesInput}
                                        onChange={(e) => setAmenitiesInput(e.target.value)}
                                        onBlur={(e) => handleArrayInputBlur('amenities', e.target.value)}
                                        className="w-full rounded-lg border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-900 p-3 text-sm"
                                        placeholder="Comma separated (e.g. Pool, Gym, Power)"
                                    />
                                    <p className="text-xs text-slate-500 mt-1">Infrastructure features for comparison</p>
                                </div>
                                <div className="col-span-2">
                                    <label className="block text-sm font-semibold mb-2">Location Highlights</label>
                                    <input
                                        value={highlightsInput}
                                        onChange={(e) => setHighlightsInput(e.target.value)}
                                        onBlur={(e) => handleArrayInputBlur('locationHighlights', e.target.value)}
                                        className="w-full rounded-lg border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-900 p-3 text-sm"
                                        placeholder="Comma separated (e.g. Near CBD, Airport Access)"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Location */}
                        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-6">
                            <h2 className="text-xl font-bold mb-6 flex items-center gap-2 text-slate-900 dark:text-white">
                                <MapPin className="w-5 h-5 text-primary" /> Location
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="col-span-2">
                                    <label className="block text-sm font-semibold mb-2">Address *</label>
                                    <input name="address" value={formData.address} onChange={handleInputChange} className="w-full rounded-lg border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-900 p-3 text-sm" />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold mb-2">City</label>
                                    <input name="city" value={formData.city} onChange={handleInputChange} className="w-full rounded-lg border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-900 p-3 text-sm" />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold mb-2">Postal Code</label>
                                    <input name="postalCode" value={formData.postalCode} onChange={handleInputChange} className="w-full rounded-lg border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-900 p-3 text-sm" />
                                </div>
                            </div>
                        </div>

                        {/* Financials */}
                        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-6">
                            <h2 className="text-xl font-bold mb-6 flex items-center gap-2 text-slate-900 dark:text-white">
                                <DollarSign className="w-5 h-5 text-primary" /> Financials
                            </h2>
                            <div className="grid grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-semibold mb-2">Total Value</label>
                                    <input name="totalValue" type="number" value={formData.totalValue} onChange={handleInputChange} className="w-full rounded-lg border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-900 p-3 text-sm" />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold mb-2">Price Per Unit</label>
                                    <input name="pricePerUnit" type="number" value={formData.pricePerUnit} onChange={handleInputChange} className="w-full rounded-lg border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-900 p-3 text-sm" />
                                </div>
                            </div>
                        </div>

                    </div>

                    {/* Sidebar */}
                    <div className="lg:col-span-1 flex flex-col gap-6">
                        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-6">
                            <h2 className="text-lg font-bold mb-4">Status</h2>
                            <select name="status" value={formData.status} onChange={handleInputChange} className="w-full rounded-lg bg-slate-50 dark:bg-slate-900 p-2.5 text-sm mb-4">
                                <option value="DRAFT">Draft</option>
                                <option value="PUBLISHED">Published</option>
                                <option value="PENDING_REVIEW">Pending Review</option>
                            </select>
                            <div className="flex flex-col gap-2">
                                <Button className="w-full" onClick={handleSave}>Save Changes</Button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

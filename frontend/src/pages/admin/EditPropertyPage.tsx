import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { apiClient } from '../../hooks/useApi';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { useAuth } from '../../contexts/AuthContext';

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
        location: '',
        description: '',
        totalValue: 0,
        targetCap: 0,
        totalUnits: 0,
        pricePerUnit: 0,
        capitalRaised: 0,
        status: 'DRAFT', // Default for new
        images: [] as string[]
    });

    useEffect(() => {
        if (!isNew && id) {
            // Fetch Property Details
            apiClient.get(`/properties/${id}`)
                .then(res => {
                    const data = (res as any).data;
                    const p = data?.data || data;
                    if (p) {
                        setFormData({
                            name: p.name,
                            location: p.location,
                            description: p.description || '',
                            totalValue: Number(p.totalValue),
                            targetCap: Number(p.totalValue),
                            totalUnits: Number(p.totalUnits),
                            pricePerUnit: Number(p.pricePerUnit),
                            capitalRaised: Number(p.capitalRaised || 0),
                            status: p.status || 'DRAFT',
                            images: p.images || []
                        });
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

    const handleSave = async () => {
        if (!formData.name || !formData.location || !formData.totalValue || !formData.totalUnits || !formData.pricePerUnit) {
            alert("Please fill in all required fields.");
            return;
        }

        setSaving(true);
        try {
            const payload = {
                ...formData,
                startDate: new Date(),
                endDate: new Date(new Date().setFullYear(new Date().getFullYear() + 1)),
                annualReturnRate: 15.5,
                minInvestment: formData.pricePerUnit
            };

            if (isNew) {
                // Create (always DRAFT)
                await apiClient.post('/properties', payload);
                alert("Asset drafted successfully!");
                navigate('/admin/assets');
            } else {
                // Update
                await apiClient.put(`/properties/${id}`, payload);
                alert("Asset updated successfully!");
            }
        } catch (error: any) {
            console.error("Save failed", error);
            alert(error.response?.data?.message || "Failed to save asset.");
        } finally {
            setSaving(false);
        }
    };

    const handleSubmitForReview = async () => {
        if (!confirm("Submit this property for Admin review?")) return;
        setSaving(true);
        try {
            await apiClient.put(`/properties/${id}/submit`);
            alert("Property Submitted for Review!");
            navigate('/admin/assets');
        } catch (err: any) {
            alert(err.response?.data?.message || "Failed to submit.");
        } finally {
            setSaving(false);
        }
    };

    const handlePublish = async () => {
        if (!confirm("Are you sure you want to PUBLISH this property live?")) return;
        setSaving(true);
        try {
            await apiClient.put(`/properties/${id}/publish`);
            alert("Property Published Live!");
            navigate('/admin/assets'); // Or reload
        } catch (err: any) {
            alert(err.response?.data?.message || "Failed to publish.");
        } finally {
            setSaving(false);
        }
    };

    if (loading) return <div className="p-10 text-center">Loading asset details...</div>;

    const isModerator = user?.role === 'MODERATOR';
    const isAdmin = user?.role === 'ADMIN' || user?.role === 'SUPER_ADMIN';
    const isPublished = formData.status === 'PUBLISHED' || formData.status === 'LISTED';
    const isPending = formData.status === 'PENDING_REVIEW';
    const isDraft = formData.status === 'DRAFT';

    // Restriction Logic
    // Moderators cannot edit if Published
    const isReadOnly = isModerator && isPublished;

    return (
        <div className="max-w-6xl mx-auto flex flex-col gap-6">
            <nav className="flex flex-wrap gap-2 items-center text-sm">
                <Link to="/admin" className="text-slate-500 hover:text-primary transition-colors font-medium">Dashboard</Link>
                <span className="text-slate-400">/</span>
                <Link to="/admin/assets" className="text-slate-500 hover:text-primary transition-colors font-medium">Assets</Link>
                <span className="text-slate-400">/</span>
                <span className="text-slate-900 dark:text-white font-semibold">{isNew ? 'New Asset' : formData.name}</span>
            </nav>

            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-surface-light dark:bg-surface-dark p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm sticky top-0 z-10">
                <div className="flex flex-col gap-1">
                    <h1 className="text-[#0e141b] dark:text-white text-2xl md:text-3xl font-extrabold tracking-tight">
                        {isNew ? 'Create New Asset' : `Edit: ${formData.name}`}
                    </h1>
                    {!isNew && (
                        <div className="flex items-center gap-2">
                            <Badge className="bg-slate-100 text-slate-700 border border-slate-200">
                                {formData.status}
                            </Badge>
                            <span className="text-slate-500 dark:text-slate-400 text-sm font-medium">ID: {id?.substring(0, 8)}</span>
                        </div>
                    )}
                </div>
                <div className="flex gap-3 mt-2 md:mt-0">
                    <Button variant="outline" onClick={() => navigate('/admin/assets')}>
                        Cancel
                    </Button>

                    {/* Save Button (Draft/Edit) */}
                    {!isReadOnly && (
                        <Button onClick={handleSave} disabled={saving || isReadOnly} className="bg-slate-800 text-white hover:bg-slate-700">
                            {saving ? 'Saving...' : 'Save Draft'}
                        </Button>
                    )}

                    {/* Moderator Action: Submit */}
                    {!isNew && isModerator && isDraft && (
                        <Button onClick={handleSubmitForReview} disabled={saving} className="bg-blue-600 text-white hover:bg-blue-700">
                            Submit for Review
                        </Button>
                    )}

                    {/* Admin Action: Publish */}
                    {!isNew && isAdmin && (isPending || isDraft) && (
                        <Button onClick={handlePublish} disabled={saving} className="bg-emerald-600 text-white hover:bg-emerald-700">
                            Publish Live
                        </Button>
                    )}
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 flex flex-col gap-6">
                    {/* Asset Information */}
                    <div className="bg-surface-light dark:bg-surface-dark rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
                        <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/50">
                            <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                                <span className="material-symbols-outlined text-slate-400">info</span> Asset Information
                            </h2>
                        </div>
                        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Asset Designation (Name) *</label>
                                <input
                                    name="name"
                                    value={formData.name}
                                    onChange={handleInputChange}
                                    disabled={isReadOnly}
                                    className="w-full rounded-lg border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-primary focus:border-primary p-2 border disabled:opacity-50"
                                    type="text"
                                    placeholder="e.g. The Eko Atlantic Heights"
                                />
                            </div>
                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Physical Address *</label>
                                <div className="relative">
                                    <span className="material-symbols-outlined absolute left-3 top-2.5 text-slate-400">location_on</span>
                                    <input
                                        name="location"
                                        value={formData.location}
                                        onChange={handleInputChange}
                                        disabled={isReadOnly}
                                        className="w-full pl-10 rounded-lg border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-primary focus:border-primary p-2 border disabled:opacity-50"
                                        type="text"
                                        placeholder="Full address"
                                    />
                                </div>
                            </div>
                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Operational Summary</label>
                                <textarea
                                    name="description"
                                    value={formData.description}
                                    onChange={handleInputChange}
                                    disabled={isReadOnly}
                                    className="w-full rounded-lg border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-primary focus:border-primary p-3 border disabled:opacity-50"
                                    rows={4}
                                    placeholder="Describe the asset..."
                                />
                            </div>
                        </div>
                    </div>

                    {/* Valuation & Capital */}
                    <div className="bg-surface-light dark:bg-surface-dark rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
                        <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/50 flex justify-between items-center">
                            <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                                <span className="material-symbols-outlined text-slate-400">payments</span> Valuation & Capital
                            </h2>
                            <span className="text-xs font-medium text-primary bg-primary/10 px-2 py-1 rounded">Naira (₦)</span>
                        </div>
                        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Total Asset Valuation *</label>
                                <div className="relative">
                                    <span className="absolute left-3 top-2.5 text-slate-500 font-semibold">₦</span>
                                    <input
                                        name="totalValue"
                                        value={formData.totalValue}
                                        onChange={handleInputChange}
                                        // Moderators cannot edit valuation once set? Or maybe just restricted in general? 
                                        // For now, allow edit unless published
                                        disabled={isReadOnly}
                                        className="w-full pl-8 rounded-lg border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-primary focus:border-primary p-2 border disabled:opacity-50"
                                        type="number"
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Price Per Unit *</label>
                                <div className="relative">
                                    <span className="absolute left-3 top-2.5 text-slate-500 font-semibold">₦</span>
                                    <input
                                        name="pricePerUnit"
                                        value={formData.pricePerUnit}
                                        onChange={handleInputChange}
                                        disabled={isReadOnly}
                                        className="w-full pl-8 rounded-lg border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-primary focus:border-primary p-2 border disabled:opacity-50"
                                        type="number"
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Total Units *</label>
                                <input
                                    name="totalUnits"
                                    value={formData.totalUnits}
                                    onChange={handleInputChange}
                                    disabled={isReadOnly}
                                    className="w-full rounded-lg border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-primary focus:border-primary p-2 border disabled:opacity-50"
                                    type="number"
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Sidebar / Status */}
                <div className="flex flex-col gap-6">
                    <div className="bg-surface-light dark:bg-surface-dark rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm p-6">
                        <h3 className="font-bold text-slate-900 dark:text-white mb-4">Status & Workflow</h3>
                        <div className="space-y-4">
                            <div className="flex justify-between items-center text-sm">
                                <span className="text-slate-500">Current Status</span>
                                <Badge>{formData.status}</Badge>
                            </div>

                            {isModerator && isPublished && (
                                <div className="p-3 bg-yellow-50 text-yellow-800 text-xs rounded border border-yellow-100">
                                    Property is Published. Contact Admin for changes.
                                </div>
                            )}

                            {isModerator && isPending && (
                                <div className="p-3 bg-blue-50 text-blue-800 text-xs rounded border border-blue-100">
                                    Submited for Review. Waiting for Admin.
                                </div>
                            )}

                            {isAdmin && isPending && (
                                <div className="p-3 bg-green-50 text-green-800 text-xs rounded border border-green-100">
                                    Ready for Review. Check details before publishing.
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

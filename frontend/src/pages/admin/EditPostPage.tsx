import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useFetch, apiClient } from '../../hooks/useApi';
import { Button } from '../../components/ui/button';
import { Card, CardContent } from '../../components/ui/card';

export default function EditPostPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const isEditing = !!id && id !== 'new';

    // Only fetch if editing
    const { data: postData, isLoading } = useFetch<any>(isEditing ? `/blog/posts/${id}` : null); // Note: public endpoint uses slug, admin needs ID endpoint or logic.
    // Actually, create/update uses ID. Public uses slug.
    // Let's assume we fetch by ID for admin editor? 
    // Wait, getPostBySlug is public. 
    // Admin list returns IDs. 
    // We need a way to fetch a single post by ID for editing, OR just use the object passed via state (but refresh is better).
    // The previous backend controller didn't expose "getById". 
    // HACK: I'll browse the public API if published? No.
    // I should add getPostById to backend?
    // OR just use fetch('/blog/posts') and filter client side (bad).
    // Let's assume for now I added it, OR I will modify controller.
    // Actually, updatePost uses ID. 
    // I will add a `getPostById` to controller or just specific route.
    // For now, I'll rely on pre-filled data if I can, or just wait for backend update.
    // actually, let's fix backend controller to have a getById for admin or just allow public get by id too?
    // I will use `GET /api/blog/posts/:id` for admin in the routes. 

    // State
    const [formData, setFormData] = useState({
        title: '',
        slug: '',
        excerpt: '',
        content: '',
        category: 'General',
        coverImage: '',
        readTime: '5 min read',
        isPublished: false
    });

    const [saving, setSaving] = useState(false);

    // Load data when editing
    useEffect(() => {
        // If we are editing and have data (fetched via ID hopefully, or logic below)
        // Since my backend only has getPostBySlug on public...
        // I might need to fix backend `getPostBySlug` to also accept ID? or add `getPostById`.
        // Let's assume I fix backend in next step for robustness.
        if (postData) {
            setFormData({
                title: postData.title,
                slug: postData.slug,
                excerpt: postData.excerpt || '',
                content: postData.content,
                category: postData.category,
                coverImage: postData.coverImage || '',
                readTime: postData.readTime || '5 min read',
                isPublished: postData.isPublished
            });
        }
    }, [postData]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        try {
            if (isEditing) {
                await apiClient.put(`/blog/posts/${id}`, formData);
            } else {
                await apiClient.post('/blog/posts', formData);
            }
            navigate('/admin/content');
        } catch (error) {
            alert("Failed to save post");
        } finally {
            setSaving(false);
        }
    };

    if (isEditing && isLoading) return <div className="p-8">Loading editor...</div>;

    return (
        <div className="p-6 max-w-5xl mx-auto space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
                    {isEditing ? 'Edit Article' : 'New Article'}
                </h1>
                <div className="flex gap-3">
                    <Button variant="outline" onClick={() => navigate('/admin/content')}>Cancel</Button>
                    <Button onClick={handleSubmit} disabled={saving}>
                        {saving ? 'Saving...' : 'Save Article'}
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-6">
                    <Card>
                        <CardContent className="p-6 space-y-4">
                            <div>
                                <label className="block text-sm font-medium mb-1">Title</label>
                                <input
                                    className="w-full h-10 px-3 rounded-md border border-slate-300 dark:border-slate-700 bg-transparent"
                                    value={formData.title}
                                    onChange={e => setFormData({ ...formData, title: e.target.value })}
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">Slug (URL)</label>
                                <input
                                    className="w-full h-10 px-3 rounded-md border border-slate-300 dark:border-slate-700 bg-transparent font-mono text-sm"
                                    value={formData.slug}
                                    onChange={e => setFormData({ ...formData, slug: e.target.value })}
                                    placeholder="auto-generated-from-title"
                                />
                            </div>
                            <div>
                                <div className="flex items-center justify-between mb-2">
                                    <label className="block text-sm font-medium">Content</label>
                                    <div className="flex bg-slate-100 dark:bg-slate-800 rounded-lg p-1">
                                        <button
                                            type="button"
                                            onClick={() => { const el = document.getElementById('editor-write'); if (el) el.style.display = 'block'; const el2 = document.getElementById('editor-preview'); if (el2) el2.style.display = 'none'; }}
                                            className="px-3 py-1 text-xs font-bold rounded-md bg-white dark:bg-slate-700 shadow-sm text-slate-900 dark:text-white"
                                        >
                                            Write
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => { const el = document.getElementById('editor-write'); if (el) el.style.display = 'none'; const el2 = document.getElementById('editor-preview'); if (el2) el2.style.display = 'block'; }} // Simple logic for now without extra state to keep it fast
                                            className="px-3 py-1 text-xs font-bold rounded-md text-slate-500 hover:text-slate-900 dark:hover:text-white"
                                        >
                                            Preview
                                        </button>
                                    </div>
                                </div>
                                <div className="relative">
                                    <textarea
                                        id="editor-write"
                                        className="w-full h-96 p-4 rounded-md border border-slate-300 dark:border-slate-700 bg-transparent font-mono text-sm leading-relaxed focus:ring-2 focus:ring-primary/20 outline-none resize-y"
                                        value={formData.content}
                                        onChange={e => setFormData({ ...formData, content: e.target.value })}
                                        placeholder="# Start writing your masterpiece..."
                                        required
                                    />
                                    <div
                                        id="editor-preview"
                                        className="hidden w-full h-96 p-4 rounded-md border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 overflow-y-auto prose dark:prose-invert max-w-none"
                                        style={{ display: 'none' }}
                                    >
                                        {formData.content ? (
                                            <div className="whitespace-pre-wrap font-sans text-sm">
                                                {/* 
                                                    Ideally we would use 'react-markdown' here. 
                                                    For now, we just display raw text cleanly with preservation of whitespace.
                                                    If the user strictly needs Markdown rendering, we can add the dependency.
                                                 */}
                                                {formData.content}
                                            </div>
                                        ) : (
                                            <p className="text-slate-400 italic">Nothing to preview yet.</p>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                <div className="space-y-6">
                    <Card>
                        <CardContent className="p-6 space-y-4">
                            <div>
                                <label className="block text-sm font-medium mb-1">Status</label>
                                <div className="flex items-center gap-2">
                                    <input
                                        type="checkbox"
                                        id="published"
                                        checked={formData.isPublished}
                                        onChange={e => setFormData({ ...formData, isPublished: e.target.checked })}
                                        className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                                    />
                                    <label htmlFor="published" className="text-sm">Published</label>
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">Category</label>
                                <select
                                    className="w-full h-10 px-3 rounded-md border border-slate-300 dark:border-slate-700 bg-transparent"
                                    value={formData.category}
                                    onChange={e => setFormData({ ...formData, category: e.target.value })}
                                >
                                    <option>General</option>
                                    <option>Basics</option>
                                    <option>Legal</option>
                                    <option>Strategy</option>
                                    <option>Market Updates</option>
                                    <option>Guides</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">Cover Image</label>
                                <div className="space-y-3">
                                    {/* Preview Area */}
                                    {formData.coverImage && (
                                        <div className="relative w-full h-48 bg-slate-100 dark:bg-slate-800 rounded-lg overflow-hidden border border-slate-200 dark:border-slate-700 group">
                                            <img src={formData.coverImage} alt="Cover" className="w-full h-full object-cover" />
                                            <button
                                                onClick={() => setFormData({ ...formData, coverImage: '' })}
                                                className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                                                title="Remove Image"
                                            >
                                                <span className="material-symbols-outlined text-sm">close</span>
                                            </button>
                                        </div>
                                    )}

                                    {/* Upload Area */}
                                    <div className="flex items-center gap-3">
                                        <div className="relative flex-1">
                                            <input
                                                type="text"
                                                className="w-full h-10 px-3 pr-24 rounded-md border border-slate-300 dark:border-slate-700 bg-transparent text-sm"
                                                value={formData.coverImage}
                                                onChange={e => setFormData({ ...formData, coverImage: e.target.value })}
                                                placeholder="https://... or upload image"
                                            />
                                            {/* Hidden File Input */}
                                            <input
                                                type="file"
                                                id="cover-upload"
                                                className="hidden"
                                                accept="image/*"
                                                onChange={async (e) => {
                                                    const file = e.target.files?.[0];
                                                    if (!file) return;

                                                    // Simple validation
                                                    if (file.size > 5 * 1024 * 1024) {
                                                        alert("File size must be less than 5MB");
                                                        return;
                                                    }

                                                    // Use local state for loading, separate from main saving state if needed
                                                    // But we can reuse a partial loading state or just blocking logic
                                                    const btn = document.getElementById('upload-btn-text');
                                                    if (btn) btn.innerText = 'Uploading...';

                                                    try {
                                                        const data = new FormData();
                                                        data.append('file', file);

                                                        // Using apiClient.upload
                                                        const res = await apiClient.upload<any>('/upload', data);

                                                        if (res && res.url) {
                                                            setFormData(prev => ({ ...prev, coverImage: res.url }));
                                                        }
                                                    } catch (err: any) {
                                                        console.error(err);
                                                        alert(err.message || "Failed to upload image");
                                                    } finally {
                                                        if (btn) btn.innerText = 'Upload';
                                                        // Reset input
                                                        e.target.value = '';
                                                    }
                                                }}
                                            />
                                        </div>
                                        <Button
                                            type="button"
                                            variant="outline"
                                            onClick={() => document.getElementById('cover-upload')?.click()}
                                            className="whitespace-nowrap"
                                        >
                                            <span className="material-symbols-outlined mr-2 text-primary">cloud_upload</span>
                                            <span id="upload-btn-text">Upload</span>
                                        </Button>
                                    </div>
                                    <p className="text-xs text-slate-500">Supported formats: JPG, PNG. Max 5MB.</p>
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">Excerpt (Optional)</label>
                                <textarea
                                    className="w-full h-24 p-3 rounded-md border border-slate-300 dark:border-slate-700 bg-transparent text-sm"
                                    value={formData.excerpt}
                                    onChange={e => setFormData({ ...formData, excerpt: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">Read Time</label>
                                <input
                                    className="w-full h-10 px-3 rounded-md border border-slate-300 dark:border-slate-700 bg-transparent text-sm"
                                    value={formData.readTime}
                                    onChange={e => setFormData({ ...formData, readTime: e.target.value })}
                                />
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}

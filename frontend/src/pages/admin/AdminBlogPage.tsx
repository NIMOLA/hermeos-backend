import { useState } from 'react';
import { useFetch, apiClient } from '../../hooks/useApi';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '../../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';

export default function AdminBlogPage() {
    const navigate = useNavigate();
    const { data: posts, isLoading, refetch } = useFetch<any[]>('/blog/admin/posts');
    const [deleting, setDeleting] = useState<string | null>(null);

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to delete this post?")) return;
        setDeleting(id);
        try {
            await apiClient.delete(`/blog/posts/${id}`);
            refetch();
        } catch (error) {
            alert("Failed to delete post");
        } finally {
            setDeleting(null);
        }
    };

    return (
        <div className="p-6 space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Content Manager</h1>
                    <p className="text-slate-500">Manage articles for the Education Hub</p>
                </div>
                <Link to="/admin/content/new">
                    <Button>
                        <span className="material-symbols-outlined mr-2">add</span>
                        New Article
                    </Button>
                </Link>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>All Articles</CardTitle>
                </CardHeader>
                <CardContent>
                    {isLoading ? (
                        <div className="p-8 text-center">Loading articles...</div>
                    ) : !posts || posts.length === 0 ? (
                        <div className="p-8 text-center text-slate-500">No articles found. Create your first one!</div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-sm">
                                <thead className="bg-slate-50 dark:bg-slate-800 text-slate-500 border-b border-slate-200 dark:border-slate-700">
                                    <tr>
                                        <th className="p-4 font-medium">Title</th>
                                        <th className="p-4 font-medium">Category</th>
                                        <th className="p-4 font-medium">Status</th>
                                        <th className="p-4 font-medium">Last Updated</th>
                                        <th className="p-4 font-medium text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                                    {posts.map((post) => (
                                        <tr key={post.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                                            <td className="p-4 font-medium text-slate-900 dark:text-white max-w-xs truncate" title={post.title}>
                                                {post.title}
                                            </td>
                                            <td className="p-4">
                                                <span className="px-2 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-xs font-medium">
                                                    {post.category}
                                                </span>
                                            </td>
                                            <td className="p-4">
                                                <span className={`px-2 py-1 rounded-full text-xs font-bold ${post.isPublished
                                                        ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400'
                                                        : 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400'
                                                    }`}>
                                                    {post.isPublished ? 'Published' : 'Draft'}
                                                </span>
                                            </td>
                                            <td className="p-4 text-slate-500">
                                                {new Date(post.updatedAt).toLocaleDateString()}
                                            </td>
                                            <td className="p-4 text-right">
                                                <div className="flex items-center justify-end gap-2">
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={() => navigate(`/admin/content/edit/${post.id}`)}
                                                    >
                                                        Edit
                                                    </Button>
                                                    <button
                                                        onClick={() => handleDelete(post.id)}
                                                        disabled={deleting === post.id}
                                                        className="p-2 text-red-500 hover:bg-red-50 rounded-md transition-colors disabled:opacity-50"
                                                    >
                                                        <span className="material-symbols-outlined text-[18px]">delete</span>
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}

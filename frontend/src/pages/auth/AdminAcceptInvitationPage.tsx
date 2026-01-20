import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '../../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../components/ui/card';
import { apiClient } from '../../lib/api-client';

export default function AdminAcceptInvitationPage() {
    const { token } = useParams<{ token: string }>();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        password: '',
        confirmPassword: ''
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (formData.password !== formData.confirmPassword) {
            alert("Passwords do not match");
            return;
        }

        setLoading(true);
        try {
            const res = await apiClient.post(`/admin/management/accept-invitation/${token}`, {
                firstName: formData.firstName,
                lastName: formData.lastName,
                password: formData.password
            });

            if (res.success) {
                alert("Account created successfully! Please log in.");
                navigate('/portal-access');
            }
        } catch (error: any) {
            console.error(error);
            alert(error.response?.data?.message || "Failed to accept invitation");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-900 p-4">
            <Card className="w-full max-w-md">
                <CardHeader>
                    <CardTitle>Accept Admin Invitation</CardTitle>
                    <CardDescription>Set up your administrator account.</CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label htmlFor="firstName" className="text-sm font-medium">First Name</label>
                                <input
                                    id="firstName"
                                    required
                                    className="w-full p-2 border rounded-md dark:bg-slate-800 dark:border-slate-700"
                                    value={formData.firstName}
                                    onChange={e => setFormData({ ...formData, firstName: e.target.value })}
                                />
                            </div>
                            <div className="space-y-2">
                                <label htmlFor="lastName" className="text-sm font-medium">Last Name</label>
                                <input
                                    id="lastName"
                                    required
                                    className="w-full p-2 border rounded-md dark:bg-slate-800 dark:border-slate-700"
                                    value={formData.lastName}
                                    onChange={e => setFormData({ ...formData, lastName: e.target.value })}
                                />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <label htmlFor="password" className="text-sm font-medium">Password</label>
                            <input
                                id="password"
                                type="password"
                                required
                                className="w-full p-2 border rounded-md dark:bg-slate-800 dark:border-slate-700"
                                value={formData.password}
                                onChange={e => setFormData({ ...formData, password: e.target.value })}
                            />
                        </div>
                        <div className="space-y-2">
                            <label htmlFor="confirmPassword" className="text-sm font-medium">Confirm Password</label>
                            <input
                                id="confirmPassword"
                                type="password"
                                required
                                className="w-full p-2 border rounded-md dark:bg-slate-800 dark:border-slate-700"
                                value={formData.confirmPassword}
                                onChange={e => setFormData({ ...formData, confirmPassword: e.target.value })}
                            />
                        </div>
                        <Button type="submit" className="w-full" disabled={loading}>
                            {loading ? 'Setting up...' : 'Create Account'}
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}

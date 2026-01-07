import { useEffect, useState } from 'react';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { useNavigate } from 'react-router-dom';

export default function Dashboard() {
    const [role, setRole] = useState<string | null>(null);
    const navigate = useNavigate();

    useEffect(() => {
        const storedRole = localStorage.getItem('role');
        const token = localStorage.getItem('token');

        if (!token) {
            navigate('/login');
            return;
        }
        setRole(storedRole);

        // Fetch data based on role
        // This is a simplified fetch
    }, [navigate]);

    return (
        <div className="p-8 min-h-screen bg-background">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold text-hermeos-gold">
                    {role === 'SUPER_ADMIN' ? 'Admin Command Center' : 'Investor Portal'}
                </h1>
                <Button onClick={() => {
                    localStorage.clear();
                    navigate('/login');
                }} className="border border-hermeos-gold text-hermeos-gold bg-transparent hover:bg-hermeos-gold/10">
                    Logout
                </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* KPI Cards */}
                <Card className="bg-card border-white/10">
                    <CardHeader><CardTitle>Total Asset Value</CardTitle></CardHeader>
                    <CardContent><p className="text-2xl font-mono">$1,250,000</p></CardContent>
                </Card>

                {role === 'USER' && (
                    <Card className="bg-card border-white/10">
                        <CardHeader><CardTitle>KYC Status</CardTitle></CardHeader>
                        <CardContent><p className="text-green-400">Verified</p></CardContent>
                    </Card>
                )}

                {role === 'SUPER_ADMIN' && (
                    <Card className="bg-card border-white/10">
                        <CardHeader><CardTitle>Pending Users</CardTitle></CardHeader>
                        <CardContent><p className="text-orange-400">12 Approvals Needed</p></CardContent>
                    </Card>
                )}
            </div>

            {role === 'SUPER_ADMIN' && (
                <div className="mt-8">
                    <h2 className="text-xl mb-4 text-gray-300">Property Management</h2>
                    <div className="p-4 border border-dashed border-gray-700 rounded-lg">
                        <Button>+ Create New Property Listing</Button>
                    </div>
                </div>
            )}
        </div>
    );
}

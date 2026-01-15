import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { Button } from '../../components/ui/button';
import { apiClient } from '../../lib/api-client';

export default function AdminSupportPage() {
    const [tickets, setTickets] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchTickets();
    }, []);

    const fetchTickets = async () => {
        try {
            const res = await apiClient.get<any>('/admin/support/tickets'); // Assuming this endpoint exists or will be created
            if (res.success) {
                setTickets(res.data);
            }
        } catch (error) {
            console.error("Failed to fetch tickets", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">Support Center</h1>
                    <p className="text-slate-500 dark:text-slate-400">Manage user support requests and inquiries.</p>
                </div>
            </div>

            <div className="grid grid-cols-1 gap-4">
                {loading ? (
                    <div className="p-8 text-center text-slate-500">Loading tickets...</div>
                ) : tickets.length === 0 ? (
                    <Card>
                        <CardContent className="p-8 text-center text-slate-500">
                            No active support tickets found.
                        </CardContent>
                    </Card>
                ) : (
                    tickets.map(ticket => (
                        <Card key={ticket.id} className="hover:shadow-md transition-shadow">
                            <CardContent className="p-6 flex justify-between items-center">
                                <div>
                                    <div className="flex items-center gap-3 mb-1">
                                        <h3 className="font-semibold text-lg">{ticket.subject}</h3>
                                        <Badge variant={ticket.status === 'open' ? 'default' : 'secondary'}>{ticket.status}</Badge>
                                        <span className="text-xs text-slate-400">{new Date(ticket.createdAt).toLocaleDateString()}</span>
                                    </div>
                                    <p className="text-slate-600 dark:text-slate-300 line-clamp-1">{ticket.message}</p>
                                    <p className="text-xs text-slate-400 mt-2">From: {ticket.user?.email || 'Unknown'}</p>
                                </div>
                                <Button size="sm" variant="outline">View Ticket</Button>
                            </CardContent>
                        </Card>
                    ))
                )}
            </div>
        </div>
    );
}

import { useState, useEffect } from 'react';
import { useFetch, apiClient } from '../../hooks/useApi';
import { Button } from '../../components/ui/button';
import {
    Plus, Search, MoreHorizontal, Paperclip, Send,
    Inbox as InboxIcon, CheckCircle, ArrowRight, MessageSquare
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useToast } from '../../contexts/ToastContext';

export default function UserInboxPage() {
    const { user } = useAuth();
    const { showToast } = useToast();
    // Use correct endpoint /support for tickets
    const { data: ticketsData, isLoading, refetch } = useFetch<any>('/support');

    const [creatingTicket, setCreatingTicket] = useState(false);
    // We don't have a threaded reply endpoint yet, so we won't use mutation for replies to simulated threads

    const [activeTicket, setActiveTicket] = useState<any>(null);
    const [isNewTicketOpen, setIsNewTicketOpen] = useState(false);

    // Form State
    const [subject, setSubject] = useState('');
    const [category, setCategory] = useState('General');
    const [message, setMessage] = useState('');

    // Reply State (Simulated)
    const [replyText, setReplyText] = useState('');

    const tickets = ticketsData?.data || [];

    // Auto-select first ticket
    useEffect(() => {
        if (!activeTicket && tickets.length > 0) {
            setActiveTicket(tickets[0]);
        }
    }, [tickets, activeTicket]);

    const handleCreateTicket = async (e: React.FormEvent) => {
        e.preventDefault();
        setCreatingTicket(true);
        try {
            await apiClient.post('/support', { subject, category, message });
            await refetch();
            setIsNewTicketOpen(false);
            setSubject('');
            setMessage('');
        } catch (err: any) {
            showToast(err.message || 'Failed to create ticket', 'error');
        } finally {
            setCreatingTicket(false);
        }
    };

    const [sendingReply, setSendingReply] = useState(false);

    const handleReply = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!activeTicket || !replyText.trim() || sendingReply) return;

        setSendingReply(true);
        try {
            await apiClient.post(`/support/${activeTicket.id}/reply`, { message: replyText });
            await refetch();
            setReplyText('');
            showToast('Reply sent successfully', 'success');
        } catch (err: any) {
            showToast(err.message || 'Failed to send reply', 'error');
        } finally {
            setSendingReply(false);
        }
    };

    return (
        <div className="flex bg-gray-50 dark:bg-gray-900 h-[calc(100vh-64px)] overflow-hidden">
            {/* Sidebar List */}
            <div className="w-full md:w-80 lg:w-96 border-r border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-800 flex flex-col z-10">
                {/* Header */}
                <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
                    <h1 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                        <InboxIcon className="w-5 h-5" /> Inbox
                    </h1>
                    <Button size="sm" onClick={() => setIsNewTicketOpen(true)} className="gap-1">
                        <Plus className="w-4 h-4" /> New
                    </Button>
                </div>

                {/* Search (Visual only for now) */}
                <div className="p-4 py-2">
                    <div className="relative">
                        <Search className="w-4 h-4 absolute left-3 top-3 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search messages..."
                            className="w-full pl-9 pr-4 py-2 rounded-lg bg-gray-100 dark:bg-gray-700/50 border-none text-sm focus:ring-2 ring-primary/50 outline-none"
                        />
                    </div>
                </div>

                {/* List */}
                <div className="flex-1 overflow-y-auto">
                    {isLoading ? (
                        <div className="p-8 text-center text-gray-400">Loading...</div>
                    ) : tickets.length === 0 ? (
                        <div className="p-8 text-center text-gray-500">
                            <MessageSquare className="w-8 h-8 mx-auto mb-2 opacity-50" />
                            <p>No messages yet</p>
                        </div>
                    ) : (
                        tickets.map((ticket: any) => (
                            <div
                                key={ticket.id}
                                onClick={() => setActiveTicket(ticket)}
                                className={`p-4 border-b border-gray-100 dark:border-gray-700 cursor-pointer transition-colors hover:bg-gray-50 dark:hover:bg-gray-700/50 ${activeTicket?.id === ticket.id ? 'bg-blue-50 dark:bg-blue-900/10 border-l-4 border-l-blue-500' : 'border-l-4 border-l-transparent'}`}
                            >
                                <div className="flex justify-between mb-1">
                                    <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${ticket.status === 'open' ? 'bg-green-100 text-green-700' :
                                        ticket.status === 'closed' ? 'bg-gray-100 text-gray-600' : 'bg-amber-100 text-amber-700'
                                        }`}>
                                        {ticket.status.toUpperCase()}
                                    </span>
                                    <span className="text-xs text-gray-400">{new Date(ticket.createdAt).toLocaleDateString()}</span>
                                </div>
                                <h3 className="font-semibold text-gray-900 dark:text-white truncate mb-1">{ticket.subject}</h3>
                                <p className="text-sm text-gray-500 dark:text-gray-400 truncate">{ticket.message}</p>
                            </div>
                        ))
                    )}
                </div>
            </div>

            {/* Main Content (Chat View) */}
            <div className={`flex-1 flex flex-col bg-white dark:bg-gray-900 absolute md:static inset-0 z-20 transition-transform duration-300 ${activeTicket ? 'translate-x-0' : 'translate-x-full md:translate-x-0'}`}>
                {activeTicket ? (
                    <>
                        {/* Header */}
                        <div className="h-16 border-b border-gray-200 dark:border-gray-800 flex items-center justify-between px-6 bg-white dark:bg-gray-800">
                            <div className="flex items-center gap-3">
                                <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setActiveTicket(null)}>
                                    <ArrowRight className="w-5 h-5 rotate-180" /> {/* Back Icon */}
                                </Button>
                                <div>
                                    <h2 className="font-bold text-gray-900 dark:text-white">{activeTicket.subject}</h2>
                                    <p className="text-xs text-gray-500">Ticket #{activeTicket.id.substring(0, 8)} • {activeTicket.category}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <Button variant="ghost" size="icon">
                                    <MoreHorizontal className="w-5 h-5 text-gray-500" />
                                </Button>
                            </div>
                        </div>

                        {/* Messages Area */}
                        <div className="flex-1 overflow-y-auto p-6 bg-gray-50 dark:bg-gray-900/50">
                            {/* Original Message (User) */}
                            <div className="flex justify-end mb-6">
                                <div className="flex gap-3 max-w-[80%] flex-row-reverse">
                                    <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white text-xs shrink-0">
                                        {user?.firstName?.charAt(0)}
                                    </div>
                                    <div className="flex flex-col items-end">
                                        <div className="bg-primary text-white p-3 rounded-2xl rounded-tr-none shadow-sm">
                                            <p className="text-sm leading-relaxed">{activeTicket.message}</p>
                                        </div>
                                        <span className="text-xs text-gray-400 mt-1">{new Date(activeTicket.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                    </div>
                                </div>
                            </div>

                            {/* System Response (if closed/resolved) - Simulated */}
                            {activeTicket.status === 'resolved' && (
                                <div className="flex justify-center my-6">
                                    <div className="bg-gray-200 dark:bg-gray-800 rounded-full px-4 py-1 text-xs text-gray-600 dark:text-gray-400 flex items-center gap-1">
                                        <CheckCircle className="w-3 h-3" /> Ticket marked as resolved
                                    </div>
                                </div>
                            )}

                            {/* Placeholder for "Admin joined" */}
                            <div className="flex justify-center my-4 opacity-50">
                                <span className="text-xs text-gray-400">Start of conversation</span>
                            </div>

                        </div>

                        {/* Input Area */}
                        <div className="p-4 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-800">
                            <form onSubmit={handleReply} className="flex gap-2 items-end max-w-4xl mx-auto">
                                <Button type="button" variant="ghost" size="icon" className="text-gray-400 hover:text-gray-600">
                                    <Paperclip className="w-5 h-5" />
                                </Button>
                                <div className="flex-1 bg-gray-100 dark:bg-gray-700/50 rounded-xl p-2 focus-within:ring-2 ring-primary/20 transition-all">
                                    <textarea
                                        value={replyText}
                                        onChange={(e) => setReplyText(e.target.value)}
                                        placeholder="Type your reply..."
                                        className="w-full bg-transparent border-none focus:ring-0 outline-none resize-none text-sm max-h-32 min-h-[20px]"
                                        rows={1}
                                        onInput={(e) => {
                                            const target = e.target as HTMLTextAreaElement;
                                            target.style.height = 'auto';
                                            target.style.height = target.scrollHeight + 'px';
                                        }}
                                    />
                                </div>
                                <Button type="submit" disabled={!replyText.trim() || activeTicket.status === 'resolved'} className="rounded-xl w-10 h-10 p-0 flex items-center justify-center">
                                    <Send className="w-5 h-5" />
                                </Button>
                            </form>
                        </div>
                    </>
                ) : (
                    <div className="flex flex-col items-center justify-center h-full text-gray-400">
                        <InboxIcon className="w-16 h-16 mb-4 opacity-20" />
                        <p className="text-lg font-medium">Select a message to read</p>
                    </div>
                )}
            </div>

            {/* New Ticket Modal */}
            {isNewTicketOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
                    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                        <div className="p-4 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center bg-gray-50 dark:bg-gray-800/50">
                            <h3 className="font-bold text-gray-900 dark:text-white">New Support Ticket</h3>
                            <button onClick={() => setIsNewTicketOpen(false)} className="text-gray-400 hover:text-gray-600">
                                <Plus className="w-5 h-5 rotate-45" />
                            </button>
                        </div>
                        <form onSubmit={handleCreateTicket} className="p-6 flex flex-col gap-4">
                            <div>
                                <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Subject</label>
                                <input
                                    autoFocus
                                    className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 p-2.5 text-sm focus:ring-2 ring-primary/50 outline-none"
                                    value={subject}
                                    onChange={(e) => setSubject(e.target.value)}
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Topic</label>
                                <select
                                    className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 p-2.5 text-sm focus:ring-2 ring-primary/50 outline-none"
                                    value={category}
                                    onChange={(e) => setCategory(e.target.value)}
                                >
                                    <option>General Inquiry</option>
                                    <option>Billing / Payments</option>
                                    <option>Technical Issue</option>
                                    <option>Account Verification</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Message</label>
                                <textarea
                                    className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 p-2.5 text-sm focus:ring-2 ring-primary/50 outline-none h-32 resize-none"
                                    value={message}
                                    onChange={(e) => setMessage(e.target.value)}
                                    required
                                />
                            </div>
                            <div className="flex justify-end gap-2 mt-2">
                                <Button type="button" variant="outline" onClick={() => setIsNewTicketOpen(false)}>Cancel</Button>
                                <Button type="submit" disabled={creatingTicket}>
                                    {creatingTicket ? 'Sending...' : 'Send Message'}
                                </Button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Mobile Overlay */}
            {activeTicket && (
                <div className="fixed inset-0 bg-black/50 z-10 md:hidden" onClick={() => setActiveTicket(null)} />
            )}
        </div>
    );
}

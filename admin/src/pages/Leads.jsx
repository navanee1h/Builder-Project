import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Search, RefreshCw, Filter, Trash2, MessageCircle, Check } from 'lucide-react';
import Skeleton from '@mui/material/Skeleton';
import TableSkeleton from '../components/skeletons/TableSkeleton';
import toast from 'react-hot-toast';

const WhatsAppNotify = ({ lead, onNotify }) => {
    if (!lead.assignedTo || !lead.assignedTo.phone) {
        return <span className="text-xs text-gray-400 italic">Not Assigned</span>;
    }

    const isNotified = !!lead.notifiedAt;
    const isClosed = lead.status === 'Closed' || lead.status === 'closed';

    const handleSend = async () => {
        const message = `
🔔 New Lead Assigned

Customer: ${lead.name}
Phone: ${lead.phone}
Service: ${lead.serviceType}
Location: ${lead.location}

Please contact the customer ASAP.
`;
        const url = `https://wa.me/91${lead.assignedTo.phone.replace(/\D/g, '')}?text=${encodeURIComponent(message)}`;
        window.open(url, "_blank");

        // Call Backend to persist notification state
        await onNotify(lead._id);
        toast.success("WhatsApp opened & Notification logged");
    };

    if (isClosed && isNotified) {
        return (
            <span className="flex items-center gap-1 text-xs text-green-700 font-medium">
                <Check size={14} /> Notified
            </span>
        );
    }

    return (
        <button
            onClick={handleSend}
            disabled={isClosed}
            className={`flex items-center justify-center gap-1 px-3 py-1.5 rounded-lg text-xs font-bold transition shadow-sm w-full ${isClosed
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed hidden'
                : isNotified
                    ? 'bg-blue-100 text-blue-700 border border-blue-200 hover:bg-blue-200'
                    : 'bg-green-500 hover:bg-green-600 text-white'
                }`}
            title={isNotified ? "Resend Notification" : "Send WhatsApp Notification"}
        >
            {isNotified ? <Check size={14} /> : <MessageCircle size={14} />}
            {isNotified ? "Notify Sent" : "Notify Partner"}
        </button>
    );
};

const Leads = () => {
    const [leads, setLeads] = useState([]);
    const [partners, setPartners] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('All');
    const [searchTerm, setSearchTerm] = useState('');

    const fetchData = async (background = false) => {
        if (!background) setLoading(true);
        const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
        try {
            const [leadsRes, partnersRes] = await Promise.all([
                axios.get(`${API_URL}/api/leads`),
                axios.get(`${API_URL}/api/partners`)
            ]);
            setLeads(leadsRes.data.data);
            setPartners(partnersRes.data.data);
        } catch (error) {
            console.error("Error fetching data:", error);
            if (!background) toast.error("Failed to load leads");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
        // Poll every 5 seconds for new leads
        const interval = setInterval(() => {
            fetchData(true);
        }, 5000);
        return () => clearInterval(interval);
    }, []);



    const handleStatusChange = async (id, newStatus) => {
        const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
        try {
            await axios.put(`${API_URL}/api/leads/${id}/status`, { status: newStatus });
            setLeads(leads.map(lead => lead._id === id ? { ...lead, status: newStatus } : lead));
            toast.success(`Status updated to ${newStatus}`);
        } catch (error) {
            console.error("Failed to update status", error);
            toast.error("Failed to update status");
        }
    };

    const handleAssign = async (leadId, partnerId) => {
        const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
        try {
            await axios.put(`${API_URL}/api/leads/${leadId}/assign`, { partnerId });
            const partner = partners.find(p => p._id === partnerId);
            setLeads(leads.map(lead => lead._id === leadId ? { ...lead, assignedTo: partner, status: 'Assigned' } : lead));
            toast.success("Partner assigned successfully");
        } catch (error) {
            console.error("Failed to assign partner", error);
            toast.error("Failed to assign partner");
        }
    };

    const handleNotify = async (id) => {
        const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
        try {
            const res = await axios.put(`${API_URL}/api/leads/${id}/notify`);
            // Optimistic Update
            setLeads(leads.map(lead => lead._id === id ? { ...res.data.data } : lead));
        } catch (error) {
            console.error("Failed to notify", error);
            toast.error("Failed to log notification");
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this lead?")) return;
        const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
        try {
            await axios.delete(`${API_URL}/api/leads/${id}`);
            setLeads(leads.filter(l => l._id !== id));
            toast.success("Lead deleted successfully");
        } catch (error) {
            console.error("Failed to delete lead", error);
            toast.error("Failed to delete lead");
        }
    };

    // Filter Logic
    const filteredLeads = leads.filter(lead => {
        const matchesFilter = filter === 'All' || lead.status === filter.toLowerCase();
        const matchesSearch = lead.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            lead.phone?.includes(searchTerm) ||
            lead.serviceType?.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesFilter && matchesSearch;
    });

    const StatusBadge = ({ status }) => {
        const colors = {
            'new': 'bg-gray-100 text-gray-800',
            'assigned': 'bg-green-100 text-green-800',
            'contacted': 'bg-blue-100 text-blue-800',
            'closed': 'bg-green-800 text-white',
            'lost': 'bg-red-100 text-red-800'
        };
        const normalizedStatus = status ? status.toLowerCase() : 'new';
        const label = normalizedStatus.charAt(0).toUpperCase() + normalizedStatus.slice(1);

        return (
            <span className={`px-2 py-1 rounded-full text-xs font-semibold ${colors[normalizedStatus] || 'bg-gray-100 text-gray-800'}`}>
                {label}
            </span>
        );
    };

    if (loading) {
        return (
            <div>
                <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
                    <div>
                        <Skeleton variant="text" width={200} height={40} animation="wave" />
                        <Skeleton variant="text" width={250} height={24} animation="wave" />
                    </div>
                    <Skeleton variant="rectangular" width={40} height={40} animation="wave" sx={{ borderRadius: 2 }} />
                </div>

                <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 mb-6 flex flex-col md:flex-row gap-4 items-center">
                    <Skeleton variant="rectangular" height={42} animation="wave" sx={{ borderRadius: 2, flex: 1, width: '100%' }} />
                    <Skeleton variant="rectangular" width={150} height={42} animation="wave" sx={{ borderRadius: 2 }} />
                </div>

                <TableSkeleton columns={7} />
            </div>
        );
    }

    return (
        <div>
            <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">Leads Management</h1>
                    <p className="text-gray-500 text-sm">Manage and track all customer enquiries</p>
                </div>
                <div className="flex gap-2">
                    <button onClick={fetchData} className="p-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 text-gray-600 transition">
                        <RefreshCw size={20} />
                    </button>
                    {/* Add CSV Export here maybe */}
                </div>
            </div>

            {/* Filters */}
            <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 mb-6 flex flex-col md:flex-row gap-4 items-center">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                    <input
                        type="text"
                        placeholder="Search by name, phone, or service..."
                        className="pl-10 w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <div className="flex items-center gap-2">
                    <Filter className="text-gray-400" size={20} />
                    <select
                        className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white"
                        value={filter}
                        onChange={(e) => setFilter(e.target.value)}
                    >
                        <option value="All">All Status</option>
                        <option value="New">New</option>
                        <option value="Assigned">Assigned</option>
                        <option value="Contacted">Contacted</option>
                        <option value="Closed">Closed</option>
                    </select>
                </div>
            </div>

            {/* Table */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-gray-50 border-b border-gray-200">
                            <tr>
                                <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Date</th>
                                <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Client Info</th>
                                <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Service</th>
                                <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                                <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Assigned To</th>
                                <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Notify</th>
                                <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {loading ? (
                                <tr><td colSpan="7" className="px-6 py-8 text-center text-gray-500">Loading leads...</td></tr>
                            ) : filteredLeads.length === 0 ? (
                                <tr><td colSpan="7" className="px-6 py-8 text-center text-gray-500">No leads found matching your filters.</td></tr>
                            ) : (
                                filteredLeads.map((lead) => (
                                    <tr key={lead._id} className="hover:bg-gray-50 transition group">
                                        <td className="px-6 py-4 text-sm text-gray-500">
                                            {new Date(lead.createdAt).toLocaleDateString()}
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="font-medium text-gray-900">{lead.name}</div>
                                            <div className="text-sm text-gray-500">{lead.phone}</div>
                                            <div className="text-xs text-gray-400">{lead.location}</div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="text-sm text-gray-700 bg-gray-100 px-2 py-1 rounded inline-block">
                                                {lead.serviceType}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <StatusBadge status={lead.status} />
                                        </td>
                                        <td className="px-6 py-4">
                                            <select
                                                className={`text-sm border-gray-200 rounded p-1 w-full max-w-[150px] truncate transition-colors ${lead.status === 'Closed' ? 'bg-gray-50 text-gray-400 cursor-not-allowed' : 'hover:border-blue-400'
                                                    }`}
                                                value={lead.assignedTo?._id || ""}
                                                onChange={(e) => handleAssign(lead._id, e.target.value)}
                                                disabled={lead.status === 'Closed'}
                                            >
                                                <option value="" disabled>Select Partner</option>
                                                {partners
                                                    .map(partner => (
                                                        <option key={partner._id} value={partner._id}>{partner.name}</option>
                                                    ))}
                                            </select>
                                        </td>
                                        <td className="px-6 py-4">
                                            <WhatsAppNotify
                                                lead={lead}
                                                onNotify={handleNotify}
                                            />
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2">
                                                <select
                                                    className={`text-sm border border-gray-200 rounded px-2 py-1 w-28 focus:ring-2 focus:ring-blue-500 outline-none ${lead.status === 'Closed' ? 'bg-gray-50 text-gray-400' : 'bg-white'
                                                        }`}
                                                    value={lead.status || 'New'}
                                                    onChange={(e) => handleStatusChange(lead._id, e.target.value)}
                                                    disabled={lead.status === 'Closed'}
                                                >
                                                    <option value="New">New</option>
                                                    <option value="Assigned">Assigned</option>
                                                    <option value="Contacted">Contacted</option>
                                                    <option value="Closed">Closed</option>
                                                    <option value="Lost">Lost</option>
                                                </select>

                                                <button
                                                    onClick={() => handleDelete(lead._id)}
                                                    className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded transition"
                                                    title="Delete Lead"
                                                >
                                                    <Trash2 size={16} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default Leads;

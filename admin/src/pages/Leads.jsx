import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Search, RefreshCw, Filter } from 'lucide-react';

const WhatsAppNotify = ({ lead }) => {
    const [template, setTemplate] = useState('Professional');

    if (!lead.assignedTo || !lead.assignedTo.phone) {
        return <span className="text-xs text-gray-400 italic">Not Assigned</span>;
    }

    const handleSend = () => {
        let message = "";

        switch (template) {
            case 'Urgent':
                message = `
🚨 New ${lead.serviceType} Work

Location: ${lead.location}
Customer: ${lead.name}
Phone: ${lead.phone}

Please call the customer immediately.
`;
                break;
            case 'Friendly':
                message = `
New ${lead.serviceType} Enquiry

Customer: ${lead.name}
Phone: ${lead.phone}
Place: ${lead.location}

Please contact the customer and update us.
Thank you.
`;
                break;
            case 'Professional':
            default:
                message = `
🔔 New Service Lead Assigned

Customer Name: ${lead.name}
Phone: ${lead.phone}
Service: ${lead.serviceType}
Location: ${lead.location}

Please contact the customer as soon as possible.
Thank you for your support.
`;
                break;
        }

        const url = `https://wa.me/91${lead.assignedTo.phone.replace(/\D/g, '')}?text=${encodeURIComponent(message)}`;
        window.open(url, "_blank");
    };

    return (
        <div className="flex flex-col gap-1 min-w-[120px]">
            <select
                value={template}
                onChange={(e) => setTemplate(e.target.value)}
                className="text-xs border border-gray-200 rounded p-1 outline-none focus:border-green-500 bg-gray-50 mb-1 w-full cursor-pointer"
                onClick={(e) => e.stopPropagation()}
            >
                <option value="Professional">Professional</option>
                <option value="Urgent">Urgent</option>
                <option value="Friendly">Friendly</option>
            </select>
            <button
                onClick={handleSend}
                className="flex items-center justify-center gap-1 bg-green-500 hover:bg-green-600 text-white px-3 py-1.5 rounded-lg text-xs font-bold transition shadow-sm w-full"
                title="Send WhatsApp to Partner"
            >
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><path d="M16.95 7.55a.69.69 0 0 1 .46.21l1.83 2a.69.69 0 0 1 .02.97l-2.12 2.22a.69.69 0 0 1-.98-.01l-2.73-2.92a.69.69 0 0 1 .08-.99l2.43-1.46a.71.71 0 0 1 1 0Z" /><path d="M8 12h.01" /><path d="M12 16h.01" /></svg>
                WhatsApp
            </button>
        </div>
    );
};

const Leads = () => {
    const [leads, setLeads] = useState([]);
    const [partners, setPartners] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('All');
    const [searchTerm, setSearchTerm] = useState('');

    const fetchData = async () => {
        setLoading(true);
        try {
            const [leadsRes, partnersRes] = await Promise.all([
                axios.get('http://localhost:5000/api/leads'),
                axios.get('http://localhost:5000/api/partners')
            ]);
            setLeads(leadsRes.data.data || []);
            setPartners(partnersRes.data.data || []);
        } catch (error) {
            console.error("Error fetching data:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleStatusChange = async (id, newStatus) => {
        try {
            await axios.put(`http://localhost:5000/api/leads/${id}/status`, { status: newStatus });
            // Optimistic update
            setLeads(leads.map(lead => lead._id === id ? { ...lead, status: newStatus } : lead));
        } catch (error) {
            console.error("Failed to update status", error);
            alert("Failed to update status");
        }
    };

    const handleAssign = async (leadId, partnerId) => {
        try {
            await axios.put(`http://localhost:5000/api/leads/${leadId}/assign`, { partnerId });
            // Optimistic update
            const partner = partners.find(p => p._id === partnerId);
            setLeads(leads.map(lead => lead._id === leadId ? { ...lead, assignedTo: partner, status: 'Assigned' } : lead));
        } catch (error) {
            console.error("Failed to assign partner", error);
            alert("Failed to assign partner");
        }
    };

    // Filter Logic
    const filteredLeads = leads.filter(lead => {
        const matchesFilter = filter === 'All' || lead.status === filter;
        const matchesSearch = lead.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            lead.phone?.includes(searchTerm) ||
            lead.serviceType?.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesFilter && matchesSearch;
    });

    const StatusBadge = ({ status }) => {
        const colors = {
            'New': 'bg-blue-100 text-blue-800',
            'Assigned': 'bg-orange-100 text-orange-800',
            'Contacted': 'bg-purple-100 text-purple-800',
            'Closed': 'bg-green-100 text-green-800',
            'Lost': 'bg-red-100 text-red-800'
        };
        return (
            <span className={`px-2 py-1 rounded-full text-xs font-semibold ${colors[status] || 'bg-gray-100 text-gray-800'}`}>
                {status || 'New'}
            </span>
        );
    };

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
                                    <tr key={lead._id} className="hover:bg-gray-50 transition">
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
                                                className="text-sm border-gray-200 rounded p-1 w-full max-w-[150px] truncate"
                                                value={lead.assignedTo?._id || ""}
                                                onChange={(e) => handleAssign(lead._id, e.target.value)}
                                            >
                                                <option value="" disabled>Select Partner</option>
                                                {partners
                                                    .map(partner => (
                                                        <option key={partner._id} value={partner._id}>{partner.name}</option>
                                                    ))}
                                            </select>
                                        </td>
                                        <td className="px-6 py-4">
                                            <WhatsAppNotify lead={lead} />
                                        </td>
                                        <td className="px-6 py-4">
                                            <select
                                                className="text-sm border border-gray-200 rounded px-2 py-1"
                                                value={lead.status || 'New'}
                                                onChange={(e) => handleStatusChange(lead._id, e.target.value)}
                                            >
                                                <option value="New">New</option>
                                                <option value="Assigned">Assigned</option>
                                                <option value="Contacted">Contacted</option>
                                                <option value="Closed">Closed</option>
                                                <option value="Lost">Lost</option>
                                            </select>
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

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Users, UserCheck, MessageSquare, ClipboardList } from 'lucide-react';

const Dashboard = () => {
    const [stats, setStats] = useState({
        totalLeads: 0,
        newLeads: 0,
        assignedLeads: 0,
        closedLeads: 0,
        whatsappLeads: 0, // Need to track source if possible
        formLeads: 0,
        totalPartners: 0
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                // Fetch Leads
                const leadsRes = await axios.get('http://localhost:5000/api/leads');
                const leads = leadsRes.data.data || [];

                // Fetch Partners
                const partnersRes = await axios.get('http://localhost:5000/api/partners');
                const partners = partnersRes.data.data; // Assuming structure

                const newLeads = leads.filter(l => l.status === 'New').length;
                const assignedLeads = leads.filter(l => l.status === 'Assigned').length;
                const closedLeads = leads.filter(l => l.status === 'Closed').length;

                // Assuming we can differentiate source, if not just default to form for now or check data
                // For now, simple count

                setStats({
                    totalLeads: leads.length,
                    newLeads,
                    assignedLeads,
                    closedLeads,
                    whatsappLeads: 0, // Placeholder
                    formLeads: leads.length,
                    totalPartners: partners ? partners.length : 0
                });

            } catch (error) {
                console.error("Error fetching stats:", error);
                // Fallback / Mock data if API fails completely (e.g. no auth)
                // For demonstration purposes, if it fails, I'll allow the UI to show 0s or handle error
            } finally {
                setLoading(false);
            }
        };

        fetchStats();
    }, []);

    const StatCard = ({ title, value, icon: Icon, color, subtext }) => (
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-start justify-between">
            <div>
                <p className="text-gray-500 text-sm font-medium uppercase tracking-wide">{title}</p>
                <h3 className="text-3xl font-bold text-gray-800 mt-2">{value}</h3>
                {subtext && <p className="text-sm text-gray-400 mt-1">{subtext}</p>}
            </div>
            <div className={`p-3 rounded-full ${color} text-white`}>
                <Icon size={24} />
            </div>
        </div>
    );

    if (loading) {
        return <div className="p-8 text-center text-gray-500">Loading Dashboard...</div>;
    }

    return (
        <div>
            <div className="mb-8">
                <h1 className="text-2xl font-bold text-gray-800">Dashboard Overview</h1>
                <p className="text-gray-500">Welcome back, Admin</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <StatCard
                    title="Total Leads"
                    value={stats.totalLeads}
                    icon={ClipboardList}
                    color="bg-blue-600"
                    subtext={`${stats.newLeads} New`}
                />
                <StatCard
                    title="Assigned Leads"
                    value={stats.assignedLeads}
                    icon={UserCheck}
                    color="bg-orange-500"
                />
                <StatCard
                    title="Partners"
                    value={stats.totalPartners}
                    icon={Users}
                    color="bg-purple-600"
                    subtext="Active Partners"
                />
                <StatCard
                    title="Closed Leads"
                    value={stats.closedLeads}
                    icon={MessageSquare}
                    color="bg-green-600"
                />
            </div>

            {/* Recent Activity or detailed breakdown could go here */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <h3 className="text-lg font-bold text-gray-800 mb-4">Lead Status Distribution</h3>
                <div className="flex flex-wrap gap-4">
                    <div className="px-4 py-2 bg-blue-50 text-blue-700 rounded-lg">New: {stats.newLeads}</div>
                    <div className="px-4 py-2 bg-orange-50 text-orange-700 rounded-lg">Assigned: {stats.assignedLeads}</div>
                    <div className="px-4 py-2 bg-green-50 text-green-700 rounded-lg">Closed: {stats.closedLeads}</div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;

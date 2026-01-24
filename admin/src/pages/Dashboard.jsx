import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Users, UserCheck, CheckCircle, ClipboardList, TrendingUp, Activity } from 'lucide-react';
import DashboardSkeleton from '../components/skeletons/DashboardSkeleton';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const Dashboard = () => {
    const [stats, setStats] = useState({
        totalLeads: 0,
        newLeads: 0,
        assignedLeads: 0,
        contactedLeads: 0,
        closedLeads: 0,
        conversionRate: 0,
        totalPartners: 0,
        dataByStatus: [],
        dataByService: []
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

                // Fetch Data
                const [leadsRes, partnersRes] = await Promise.all([
                    axios.get(`${API_URL}/api/leads`),
                    axios.get(`${API_URL}/api/partners`)
                ]);

                const leads = leadsRes.data.data || [];
                const partners = partnersRes.data.data || [];

                // Calculate Stats (lowercase matching for safety)
                const totalLeads = leads.length;
                const newLeads = leads.filter(l => l.status?.toLowerCase() === 'new').length;
                const assignedLeads = leads.filter(l => l.status?.toLowerCase() === 'assigned').length;
                const contactedLeads = leads.filter(l => l.status?.toLowerCase() === 'contacted').length;
                const closedLeads = leads.filter(l => l.status?.toLowerCase() === 'closed').length;

                const conversionRate = totalLeads > 0 ? ((closedLeads / totalLeads) * 100).toFixed(1) : 0;

                // Prepare Chart Data
                const dataByStatus = [
                    { name: 'New', count: newLeads },
                    { name: 'Assigned', count: assignedLeads },
                    { name: 'Contacted', count: contactedLeads },
                    { name: 'Closed', count: closedLeads }
                ];

                // Group by Service
                const serviceMap = {};
                leads.forEach(lead => {
                    const service = lead.serviceType || 'Other';
                    serviceMap[service] = (serviceMap[service] || 0) + 1;
                });

                const dataByService = Object.keys(serviceMap).map(key => ({
                    name: key,
                    value: serviceMap[key]
                }));

                setStats({
                    totalLeads,
                    newLeads,
                    assignedLeads,
                    contactedLeads,
                    closedLeads,
                    conversionRate,
                    totalPartners: partners.length,
                    dataByStatus,
                    dataByService
                });

            } catch (error) {
                console.error("Error fetching stats:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchStats();
    }, []);

    const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

    const StatCard = ({ title, value, icon: Icon, color, subtext, trend }) => (
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 relative overflow-hidden group">
            <div className="flex justify-between items-start z-10 relative">
                <div>
                    <p className="text-gray-500 text-xs font-semibold uppercase tracking-wider">{title}</p>
                    <h3 className="text-3xl font-bold text-gray-800 mt-2">{value}</h3>
                    {subtext && <p className="text-sm text-gray-400 mt-1">{subtext}</p>}
                </div>
                <div className={`p-3 rounded-xl ${color} text-white shadow-lg transform group-hover:scale-110 transition-transform`}>
                    <Icon size={24} />
                </div>
            </div>
            {/* Decorative Background Circle */}
            <div className={`absolute -bottom-6 -right-6 w-24 h-24 rounded-full ${color} opacity-10`} />
        </div>
    );

    if (loading) {
        return <DashboardSkeleton />;
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-end">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">Dashboard Overview</h1>
                    <p className="text-gray-500">Performance metrics and lead analytics</p>
                </div>
                <div className="text-right">
                    <p className="text-sm text-gray-500">Conversion Rate</p>
                    <p className="text-xl font-bold text-green-600 flex items-center justify-end gap-1">
                        <TrendingUp size={20} /> {stats.conversionRate}%
                    </p>
                </div>
            </div>

            {/* Top Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard
                    title="Total Leads"
                    value={stats.totalLeads}
                    icon={ClipboardList}
                    color="bg-blue-600"
                    subtext="All time enquiries"
                />
                <StatCard
                    title="Active Partners"
                    value={stats.totalPartners}
                    icon={Users}
                    color="bg-purple-600"
                    subtext="Available for work"
                />
                <StatCard
                    title="Work In Progress"
                    value={stats.assignedLeads + stats.contactedLeads}
                    icon={Activity}
                    color="bg-orange-500"
                    subtext="Assigned & Contacted"
                />
                <StatCard
                    title="Completed Jobs"
                    value={stats.closedLeads}
                    icon={CheckCircle}
                    color="bg-green-600"
                    subtext="Successfully closed"
                />
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Bar Chart: Lead Status */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                    <h3 className="text-lg font-bold text-gray-800 mb-6">Lead Status Distribution</h3>
                    <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={stats.dataByStatus}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#9CA3AF', fontSize: 12 }} dy={10} />
                                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#9CA3AF', fontSize: 12 }} />
                                <RechartsTooltip
                                    cursor={{ fill: '#f3f4f6' }}
                                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
                                />
                                <Bar dataKey="count" fill="#4F46E5" radius={[4, 4, 0, 0]} barSize={40} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Pie Chart: Services */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                    <h3 className="text-lg font-bold text-gray-800 mb-6">Leads by Service Type</h3>
                    <div className="h-64 flex items-center justify-center">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={stats.dataByService}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={60}
                                    outerRadius={80}
                                    paddingAngle={5}
                                    dataKey="value"
                                >
                                    {stats.dataByService.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <RechartsTooltip />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                    <div className="flex flex-wrap justify-center gap-3 mt-4">
                        {stats.dataByService.map((entry, index) => (
                            <div key={index} className="flex items-center gap-1.5 text-xs text-gray-600">
                                <span className="w-2 h-2 rounded-full" style={{ position: 'relative', top: '1px', backgroundColor: COLORS[index % COLORS.length] }}></span>
                                {entry.name} ({entry.value})
                            </div>
                        ))}
                    </div>
                </div>
            </div>

        </div>
    );
};

export default Dashboard;

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { Search, Plus, MapPin, Wrench, Trash2, Edit, X, Save, AlertCircle } from 'lucide-react';
import Skeleton from '@mui/material/Skeleton';
import TableSkeleton from '../components/skeletons/TableSkeleton';
import toast from 'react-hot-toast';

const Partners = () => {
    const [partners, setPartners] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingPartner, setEditingPartner] = useState(null);
    const [submitError, setSubmitError] = useState('');

    // Lists for Dropdowns/Tags
    const roles = ['Plumber', 'Electrician', 'Carpenter', 'Builder', 'Painter', 'Renovator'];
    const availableServices = ['Plumbing', 'Electrical', 'Carpentry', 'Construction', 'Painting', 'Maintenance', 'Renovation'];
    const availableAreas = ['Payyanur', 'Taliparamba', 'Kannur', 'Kanhangad', 'Cheruvathur', 'Kasargod'];

    const fetchPartners = async () => {
        setLoading(true);
        const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
        try {
            const res = await axios.get(`${API_URL}/api/partners`);
            setPartners(res.data.data || []);
        } catch (error) {
            console.error("Error fetching partners:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPartners();
    }, []);

    // --- Actions ---

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this partner? This action cannot be undone.")) return;
        const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
        try {
            await axios.delete(`${API_URL}/api/partners/${id}`);
            setPartners(partners.filter(p => p._id !== id));
            toast.success("Partner deleted successfully");
        } catch (error) {
            console.error("Failed to delete partner", error);
            toast.error("Failed to delete partner");
        }
    };

    const handleToggleStatus = async (id, currentStatus) => {
        const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
        try {
            await axios.put(`${API_URL}/api/partners/${id}/status`, { isActive: !currentStatus });
            setPartners(partners.map(p => p._id === id ? { ...p, isActive: !currentStatus } : p));
            toast.success(`Partner ${!currentStatus ? 'activated' : 'deactivated'} successfully`);
        } catch (error) {
            console.error("Failed to update status", error);
            toast.error("Failed to update status");
        }
    };

    // --- Formik Setup ---

    const validationSchema = Yup.object({
        name: Yup.string().required('Full Name is required'),
        phone: Yup.string().required('Phone Number is required'),
        role: Yup.string().required('Role is required'),
        services: Yup.array().of(Yup.string()),
        areas: Yup.array().of(Yup.string()),
        isActive: Yup.boolean()
    });

    const formik = useFormik({
        initialValues: {
            name: '',
            phone: '',
            role: 'Plumber',
            services: [],
            areas: [],
            isActive: true
        },
        validationSchema,
        onSubmit: async (values) => {
            setSubmitError('');
            const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
            try {
                if (editingPartner) {
                    // Update
                    const res = await axios.put(`${API_URL}/api/partners/${editingPartner._id}`, values);
                    setPartners(partners.map(p => p._id === editingPartner._id ? res.data.data : p));
                    toast.success("Partner updated successfully!");
                } else {
                    // Create
                    const res = await axios.post(`${API_URL}/api/partners`, values);
                    setPartners([res.data.data, ...partners]);
                    toast.success("Partner added successfully!");
                }
                setIsModalOpen(false);
                formik.resetForm();
            } catch (error) {
                console.error("Save failed", error);
                const message = error.response?.data?.message || "Failed to save partner";
                setSubmitError(message);
                toast.error(message);
            }
        }
    });

    const openModal = (partner = null) => {
        setSubmitError('');
        if (partner) {
            setEditingPartner(partner);
            formik.setValues({
                name: partner.name,
                phone: partner.phone,
                role: partner.role || 'Service Provider',
                services: partner.services || [],
                areas: partner.areas || [], // Backend might return 'location', we need 'areas'
                isActive: partner.isActive
            });
            // Handle legacy 'location' field if 'areas' is missing from old data
            if ((!partner.areas || partner.areas.length === 0) && partner.location) {
                formik.setFieldValue('areas', [partner.location]);
            }
        } else {
            setEditingPartner(null);
            formik.resetForm();
            formik.setFieldValue('role', 'Plumber'); // Ensure default is set
        }
        setIsModalOpen(true);
    };

    // Helper for Multi-select Tags
    const toggleTag = (field, value) => {
        const current = formik.values[field];
        if (current.includes(value)) {
            formik.setFieldValue(field, current.filter(item => item !== value));
        } else {
            formik.setFieldValue(field, [...current, value]);
        }
    };

    // Filtering
    const filteredPartners = partners.filter(p =>
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.phone.includes(searchTerm) ||
        p.role?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading) {
        return (
            <div>
                <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
                    <div>
                        <Skeleton variant="text" width={250} height={40} animation="wave" />
                        <Skeleton variant="text" width={300} height={24} animation="wave" />
                    </div>
                    <Skeleton variant="rectangular" width={140} height={42} animation="wave" sx={{ borderRadius: 2 }} />
                </div>

                <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 mb-6">
                    <Skeleton variant="rectangular" height={42} width="100%" sx={{ maxWidth: 450, borderRadius: 2 }} animation="wave" />
                </div>

                <TableSkeleton columns={6} />
            </div>
        );
    }

    return (
        <div>
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">Partner Management</h1>
                    <p className="text-gray-500 text-sm">Manage service providers and contractors</p>
                </div>
                <button
                    onClick={() => openModal()}
                    className="flex items-center gap-2 bg-blue-900 text-white px-4 py-2 rounded-lg hover:bg-blue-800 transition shadow-sm w-full md:w-auto justify-center"
                >
                    <Plus size={20} />
                    <span>Add Partner</span>
                </button>
            </div>

            {/* Search */}
            <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 mb-6">
                <div className="relative max-w-md">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                    <input
                        type="text"
                        placeholder="Search partners by name, role, phone..."
                        className="pl-10 w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            {/* Table Layout */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead className="bg-gray-50 border-b border-gray-200">
                            <tr>
                                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Name / Contact</th>
                                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Role</th>
                                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Services</th>
                                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Areas</th>
                                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {loading ? (
                                <tr><td colSpan="6" className="px-6 py-10 text-center text-gray-500">Loading partners...</td></tr>
                            ) : filteredPartners.length === 0 ? (
                                <tr><td colSpan="6" className="px-6 py-10 text-center text-gray-500">No partners found.</td></tr>
                            ) : (
                                filteredPartners.map(partner => (
                                    <tr key={partner._id} className="hover:bg-gray-50 transition group">
                                        <td className="px-6 py-4">
                                            <div className="font-bold text-gray-900">{partner.name}</div>
                                            {/* <div className="text-sm text-gray-500">{partner.email}</div> */}
                                            <div className="text-sm text-gray-400">{partner.phone}</div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                                {partner.role || 'Service Provider'}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex flex-wrap gap-1 max-w-xs">
                                                {partner.services && partner.services.map((s, i) => (
                                                    <span key={i} className="bg-gray-100 text-gray-600 px-2 py-0.5 rounded text-xs border border-gray-200">{s}</span>
                                                ))}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex flex-wrap gap-1 max-w-xs">
                                                {/* Handle both new 'areas' and legacy 'location' fields */}
                                                {(partner.areas?.length > 0 ? partner.areas : partner.location)?.map((l, i) => (
                                                    <span key={i} className="flex items-center gap-1 text-xs text-gray-500">
                                                        <MapPin size={10} /> {l}
                                                    </span>
                                                ))}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <button
                                                onClick={() => handleToggleStatus(partner._id, partner.isActive)}
                                                className={`px-3 py-1 rounded-full text-xs font-semibold border transition-colors ${partner.isActive
                                                    ? 'bg-green-50 text-green-700 border-green-200 hover:bg-green-100'
                                                    : 'bg-red-50 text-red-700 border-red-200 hover:bg-red-100'
                                                    }`}
                                            >
                                                {partner.isActive ? 'Active' : 'Inactive'}
                                            </button>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <button
                                                    onClick={() => openModal(partner)}
                                                    className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition"
                                                    title="Edit"
                                                >
                                                    <Edit size={18} />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(partner._id)}
                                                    className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition"
                                                    title="Delete"
                                                >
                                                    <Trash2 size={18} />
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

            {/* Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                    <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                        <div className="p-6 border-b border-gray-100 flex justify-between items-center sticky top-0 bg-white z-10">
                            <h2 className="text-xl font-bold text-gray-800">
                                {editingPartner ? 'Edit Partner' : 'Add New Partner'}
                            </h2>
                            <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                                <X size={24} />
                            </button>
                        </div>

                        <form onSubmit={formik.handleSubmit} className="p-6 space-y-6">
                            {submitError && (
                                <div className="p-4 bg-red-50 text-red-600 rounded-lg flex items-center gap-2 text-sm border border-red-100">
                                    <AlertCircle size={16} />
                                    {submitError}
                                </div>
                            )}

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Basic Info */}
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Full Name *</label>
                                        <input
                                            type="text"
                                            {...formik.getFieldProps('name')}
                                            className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none ${formik.touched.name && formik.errors.name ? 'border-red-500' : ''}`}
                                        />
                                        {formik.touched.name && formik.errors.name && (
                                            <p className="text-red-500 text-xs mt-1">{formik.errors.name}</p>
                                        )}
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number *</label>
                                        <input
                                            type="tel"
                                            {...formik.getFieldProps('phone')}
                                            className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none ${formik.touched.phone && formik.errors.phone ? 'border-red-500' : ''}`}
                                        />
                                        {formik.touched.phone && formik.errors.phone && (
                                            <p className="text-red-500 text-xs mt-1">{formik.errors.phone}</p>
                                        )}
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Role *</label>
                                        <select
                                            {...formik.getFieldProps('role')}
                                            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white"
                                        >
                                            {roles.map(r => <option key={r} value={r}>{r}</option>)}
                                        </select>
                                        {formik.touched.role && formik.errors.role && (
                                            <p className="text-red-500 text-xs mt-1">{formik.errors.role}</p>
                                        )}
                                    </div>
                                </div>

                                {/* Multi-selects */}
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Services Offered</label>
                                        <div className="flex flex-wrap gap-2">
                                            {availableServices.map(service => (
                                                <button
                                                    key={service}
                                                    type="button"
                                                    onClick={() => toggleTag('services', service)}
                                                    className={`px-3 py-1 rounded-full text-xs font-medium border transition-colors ${formik.values.services.includes(service)
                                                        ? 'bg-blue-600 text-white border-blue-600'
                                                        : 'bg-white text-gray-600 border-gray-300 hover:border-blue-400'
                                                        }`}
                                                >
                                                    {service}
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Service Areas</label>
                                        <div className="flex flex-wrap gap-2">
                                            {availableAreas.map(area => (
                                                <button
                                                    key={area}
                                                    type="button"
                                                    onClick={() => toggleTag('areas', area)}
                                                    className={`px-3 py-1 rounded-full text-xs font-medium border transition-colors ${formik.values.areas.includes(area)
                                                        ? 'bg-orange-500 text-white border-orange-500'
                                                        : 'bg-white text-gray-600 border-gray-300 hover:border-orange-400'
                                                        }`}
                                                >
                                                    {area}
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="pt-4">
                                        <label className="flex items-center gap-3 cursor-pointer">
                                            <input
                                                type="checkbox"
                                                className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500"
                                                {...formik.getFieldProps('isActive')}
                                                checked={formik.values.isActive}
                                            />
                                            <span className="text-sm font-medium text-gray-700">Partner is Active</span>
                                        </label>
                                        <p className="text-xs text-gray-500 mt-1 pl-8">Inactive partners will not appear in lead assignment lists.</p>
                                    </div>
                                </div>
                            </div>

                            <div className="flex gap-4 pt-4 border-t border-gray-100">
                                <button
                                    type="button"
                                    onClick={() => setIsModalOpen(false)}
                                    className="flex-1 px-4 py-3 bg-gray-100 text-gray-700 font-bold rounded-lg hover:bg-gray-200 transition"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="flex-1 px-4 py-3 bg-blue-900 text-white font-bold rounded-lg hover:bg-blue-800 transition flex items-center justify-center gap-2"
                                >
                                    <Save size={18} />
                                    {editingPartner ? 'Update Partner' : 'Save Partner'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Partners;

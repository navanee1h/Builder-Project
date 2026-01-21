import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Users, UserCheck, LogOut, Menu, X } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Sidebar = () => {
    const { logout } = useAuth();
    const navigate = useNavigate();
    const [isOpen, setIsOpen] = useState(false);

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const NavItem = ({ to, icon: Icon, label }) => (
        <NavLink
            to={to}
            end
            onClick={() => setIsOpen(false)}
            className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${isActive
                    ? 'bg-blue-800 text-white shadow-md'
                    : 'text-gray-300 hover:bg-blue-800/50 hover:text-white'
                }`
            }
        >
            <Icon size={20} />
            <span className="font-medium">{label}</span>
        </NavLink>
    );

    return (
        <>
            {/* Mobile Header */}
            <div className="md:hidden bg-blue-900 text-white p-4 flex justify-between items-center shadow-md fixed w-full top-0 z-50">
                <span className="font-bold text-lg">Admin Panel</span>
                <button onClick={() => setIsOpen(!isOpen)}>
                    {isOpen ? <X size={24} /> : <Menu size={24} />}
                </button>
            </div>

            {/* Sidebar Container */}
            <div className={`
                fixed inset-y-0 left-0 z-40 w-64 bg-blue-900 text-white transform transition-transform duration-300 ease-in-out shadow-2xl
                ${isOpen ? 'translate-x-0' : '-translate-x-full'}
                md:relative md:translate-x-0
            `}>
                <div className="p-6 border-b border-blue-800 mt-14 md:mt-0">
                    <h2 className="text-2xl font-bold">ABC Builders</h2>
                    <p className="text-blue-200 text-xs mt-1 uppercase tracking-wider">Admin Dashboard</p>
                </div>

                <nav className="p-4 space-y-2 flex-1 overflow-y-auto">
                    <NavItem to="/dashboard" icon={LayoutDashboard} label="Dashboard" />
                    <NavItem to="/leads" icon={Users} label="Leads Management" />
                    <NavItem to="/partners" icon={UserCheck} label="Partner Management" />
                </nav>

                <div className="p-4 border-t border-blue-800">
                    <button
                        onClick={handleLogout}
                        className="flex items-center gap-3 px-4 py-3 w-full text-left rounded-lg text-red-300 hover:bg-red-900/20 hover:text-red-200 transition-colors"
                    >
                        <LogOut size={20} />
                        <span className="font-medium">Sign Out</span>
                    </button>
                </div>
            </div>

            {/* Overlay for mobile */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-30 md:hidden"
                    onClick={() => setIsOpen(false)}
                />
            )}
        </>
    );
};

export default Sidebar;

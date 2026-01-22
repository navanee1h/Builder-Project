import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [token, setToken] = useState(localStorage.getItem('adminToken'));
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (token) {
            setIsAuthenticated(true);
            axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        } else {
            setIsAuthenticated(false);
            delete axios.defaults.headers.common['Authorization'];
        }
        setLoading(false);
    }, [token]);

    const login = async (email, password) => {
        try {
            // Assuming the existing backend has an admin login route. 
            // If not, we might need to mock this for now or the user needs to create it.
            // Based on user request "Admin logs in... Call POST /api/admin/login"

            // NOTE: Since I don't see an explicit /api/admin/login in the file list yet,
            // I'll assume standard path. If it fails, I'll handle it.
            // For now, let's try to hit the backend.
            const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
            const res = await axios.post(`${API_URL}/api/admin/login`, { email, password });

            if (res.data.token) {
                localStorage.setItem('adminToken', res.data.token);
                setToken(res.data.token);
                return { success: true };
            }
        } catch (error) {
            console.error("Login failed", error);
            return {
                success: false,
                message: error.response?.data?.message || 'Login failed'
            };
        }
    };

    const logout = () => {
        localStorage.removeItem('adminToken');
        setToken(null);
    };

    return (
        <AuthContext.Provider value={{ token, isAuthenticated, login, logout, loading }}>
            {!loading && children}
        </AuthContext.Provider>
    );
};

import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from '../api/axios';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [userRole, setUserRole] = useState('');
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const checkAuthStatus = async () => {
            const token = localStorage.getItem('token');
            if (token) {
                try {
                    const response = await axios.get('/api/user_details', {
                        headers: { Authorization: `Bearer ${token}` }
                    });
                    const { user } = response.data;
                    setIsAuthenticated(true);
                    setUserRole(user.role);
                    setUser({ username: user.username, email: user.email }); // Include email
                } catch (error) {
                    console.error('Failed to fetch user details:', error);
                    localStorage.removeItem('token');
                }
            }
            setLoading(false);
        };

        checkAuthStatus();
    }, []);

    const login = async (email, password) => {
        setLoading(true);
        try {
            const response = await axios.post('/api/auth/login', { email, password });
            const { token, user } = response.data;
            localStorage.setItem('token', token);
            localStorage.setItem('role', user.role);
            localStorage.setItem('username', user.username);
            localStorage.setItem('firstName', user.firstName);
            localStorage.setItem('lastName', user.lastName);
            localStorage.setItem('email', user.email); // Store email

            
            setIsAuthenticated(true);
            setUserRole(user.role);
            
            setUser({ username: user.username,
                firstName: user.firstName,
                lastName: user.lastName, email: user.email }); // Include email
        } catch (error) {
            console.error('Login failed:', error.response?.data?.message || error.message);
            throw new Error(error.response?.data?.message || 'Login failed: Network error');
        } finally {
            setLoading(false);
        }
    };

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('role');
        localStorage.removeItem('username');
        localStorage.removeItem('firstName');
        localStorage.removeItem('lastName');
        localStorage.removeItem('email'); // Remove email

        setIsAuthenticated(false);
        setUserRole('');
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ isAuthenticated, userRole, user, login, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);

import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import './AdminDashboard.css';

const AdminDashboard = () => {
    const { logout } = useAuth();
    const navigate = useNavigate();
    const [currentSection, setCurrentSection] = useState('overview');
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    
    // const [newUser, setNewUser] = useState({ firstName: '', lastName: '', email: '' });
    // const [addUserError, setAddUserError] = useState('');
    // const [addUserSuccess, setAddUserSuccess] = useState('');

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const showSection = (section) => {
        setCurrentSection(section);
        if (section === 'users') {
            navigate('/user-listing');
        }
    };

    const fetchUsers = async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                throw new Error('No auth token found');
            }

            const response = await fetch('/api/user_details', {
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });

            if (!response.ok) {
                // eslint-disable-next-line
                const errorText = await response.text();
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            const data = await response.json();
            setUsers(data);
        } catch (error) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    const addUser = async () => {
        navigate('/add-user');
       
    };
    
    
    useEffect(() => {
        if (currentSection === 'users') {
            fetchUsers();
        }
    }, [currentSection]);

    return (
        <div className="dashboard">
            <div className="sidebar">
                <h2>Admin Dashboard</h2>
                <ul>
                    <li>
                        <button
                            className="link-button"
                            onClick={() => showSection('overview')}
                        >
                            Overview
                        </button>
                    </li>
                    <li>
                        <button
                            className="link-button"
                            onClick={() => showSection('users')}
                        >
                            Users
                        </button>
                    </li>
                    <li>
                        <button
                            className="link-button"
                            onClick={() => showSection('settings')}
                        >
                            Settings
                        </button>
                    </li>
                </ul>
                <button className="logout-button" onClick={handleLogout}>Logout</button>
            </div>
            <div className="main-content">
                {currentSection === 'overview' && (
                    <div id="overview" className="content-section">
                        <h3>Overview</h3>
                        <p>Welcome to the admin dashboard. You can manage your application.</p>
                        <div>
                             <button onClick={addUser}>Add New User</button>
                        </div>

                    </div>
                )}
                {currentSection === 'users' && (
                    <div id="users" className="content-section">
                        <h3>Users</h3>
                        {loading && <p>Loading users...</p>}
                        {error && <p>Error: {error}</p>}
                        {!loading && !error && (
                            <ul>
                                {users.map(user => (
                                    <li key={user.id}>
                                        {user.firstName} {user.lastName} ({user.email})
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                )}
                {currentSection === 'settings' && (
                    <div id="settings" className="content-section">
                        <h3>Settings</h3>
                        <p>Configure application settings here.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminDashboard;

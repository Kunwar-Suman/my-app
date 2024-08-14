import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import './UserDashboard.css'; // Import the CSS file

const UserDashboard = () => {
    const { user, logout, loading, isAuthenticated } = useAuth();
    const navigate = useNavigate();
    const [recentActivities, setRecentActivities] = useState([]);
    const [settings, setSettings] = useState({});
    const [notifications, setNotifications] = useState([]);

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const fetchRecentActivities = async () => {
        try {
            const activities = [
                { id: 1, text: 'Logged in successfully.' },
                { id: 2, text: 'Updated profile information.' }
            ];
            setRecentActivities(activities);
        } catch (error) {
            console.error('Error fetching activities:', error);
        }
    };

    const fetchSettings = async () => {
        try {
            const userSettings = { theme: 'light', notifications: true };
            setSettings(userSettings);
        } catch (error) {
            console.error('Error fetching settings:', error);
        }
    };

    const fetchNotifications = async () => {
        try {
            const userNotifications = [
                { id: 1, text: 'New feature available in your dashboard!' },
                { id: 2, text: 'Scheduled maintenance on August 10.' }
            ];
            setNotifications(userNotifications);
        } catch (error) {
            console.error('Error fetching notifications:', error);
        }
    };

    useEffect(() => {
        if (isAuthenticated) {
            fetchRecentActivities();
            fetchSettings();
            fetchNotifications();
        }
    }, [isAuthenticated]);

    if (loading) {
        return <p className="loading-message">Loading...</p>;
    }

    if (!isAuthenticated) {
        return <p className="login-message">Please log in to view this page.</p>;
    }

    return (
        <div className="dashboard-container">
            <div className="top-right-buttons">
                <button className="logout-button" onClick={handleLogout}>Logout</button>
            </div>
            <h1 className="dashboard-header">User Dashboard</h1>
            <p className="dashboard-message">Welcome, {user?.firstName || 'User'} {user?.lastName || ''}!</p>

            <div className="dashboard-section">
                <h2 className="section-header">Profile</h2>
                <p><strong>First Name:</strong> {user?.firstName || 'N/A'}</p>
                <p><strong>Last Name:</strong> {user?.lastName || 'N/A'}</p>
                <p><strong>Email:</strong> {user?.email || 'N/A'}</p> {/* Display email */}
            </div>

            <div className="dashboard-section">
                <h2 className="section-header">Recent Activities</h2>
                <ul>
                    {recentActivities.map(activity => (
                        <li key={activity.id}>{activity.text}</li>
                    ))}
                </ul>
            </div>

            <div className="dashboard-section">
                <h2 className="section-header">Settings</h2>
                <p><strong>Theme:</strong> {settings.theme || 'Not set'}</p>
                <p><strong>Notifications:</strong> {settings.notifications ? 'Enabled' : 'Disabled'}</p>
            </div>

            <div className="dashboard-section">
                <h2 className="section-header">Notifications</h2>
                <ul>
                    {notifications.map(notification => (
                        <li key={notification.id}>{notification.text}</li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default UserDashboard;

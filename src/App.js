import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link, Navigate } from 'react-router-dom';
import LoginPage from './components/LoginPage';
import SignupPage from './components/SignupPage';
import ProtectedContent from './components/ProtectedContent';
import ProtectedRoute from './components/ProtectedRoute';
import AdminDashboard from './components/AdminDashboard';
import UserDashboard from './components/UserDashboard';
import UserListingPage from './components/UserListingPage';
import AddUserForm from './components/AddUserForm';
import SetPassword from './components/SetPassword';

import { AuthProvider, useAuth } from './contexts/AuthContext';

import './App.css';

const RoleBasedRoute = ({ role, component: Component, ...rest }) => {
    const { isAuthenticated, userRole } = useAuth();
    return isAuthenticated && userRole === role ? <Component {...rest} /> : <Navigate to="/login" />;
};

const NavigationBar = () => {
    const { isAuthenticated } = useAuth();
    // Show the navigation bar only if not authenticated
    if (isAuthenticated) return null;

    return (
        <nav className="navbar">
            <div className="navbar-left">
                <span className="navbar-brand">UBA-IMS</span>
            </div>
            <div className="navbar-links">
                <Link to="/">Home</Link> | 
                <Link to="/login">Login</Link> | 
                <Link to="/signup">Sign Up</Link>
            </div>
        </nav>
    );
};

const AppContent = () => {
    // eslint-disable-next-line no-unused-vars
const isAuthenticated = useAuth().isAuthenticated;


    return (
        <div>
            <NavigationBar />
            <Routes>
                <Route path="/signup" element={<SignupPage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/" element={
                    <div>
                        <h1>Welcome to UBA Solutions!</h1>
                        <p>We provide top-notch solutions for all your business needs. Explore our website for more information.</p>
                        <p>Visit us at <a href="https://uba-solutions.com/" target="_blank" rel="noopener noreferrer">UBA Solutions</a> to learn more.</p>
                    </div>
                } />
                <Route path="/protected" element={<ProtectedRoute component={ProtectedContent} />} />
                <Route path="/admin-dashboard" element={<RoleBasedRoute role="admin" component={AdminDashboard} />} />
                <Route path="/user-dashboard" element={<RoleBasedRoute role="user" component={UserDashboard} />} />
                <Route path="/user-listing" element={<RoleBasedRoute role="admin" component={UserListingPage} />} />
                <Route path="/add-user" element={<AddUserForm />} />
                <Route path="/set-password" element={<SetPassword />} />

                <Route path="*" element={<Navigate to="/" />} />
            </Routes>
        </div>
    );
};

const App = () => {
    return (
        <AuthProvider>
            <Router>
                <AppContent />
            </Router>
        </AuthProvider>
    );
};

export default App;

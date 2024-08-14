import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import './LoginPage.css';

const LoginPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [emailError, setEmailError] = useState('');
    const [passwordError, setPasswordError] = useState('');
    const { login, userRole, isAuthenticated, loading } = useAuth(); 
    const navigate = useNavigate();

    useEffect(() => {
        if (isAuthenticated) {
            if (userRole === 'admin') {
                navigate('/admin-dashboard');
            } else if (userRole === 'user') {
                navigate('/user-dashboard');
            } else {
                navigate('/homepage'); // Default or catch-all
            }
        }
    }, [isAuthenticated, userRole, navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        let isValid = true;

        // Validate email
        if (email.trim() === '') {
            setEmailError('Email is required.');
            isValid = false;
        } else {
            setEmailError('');
        }
        
        // Validate password
        if (password.trim() === '') {
            setPasswordError('Password is required.');
            isValid = false;
        } else {
            setPasswordError('');
        }

        if (isValid) {
            try {
                await login(email, password); 

            } catch (error) {
                const errorMessage = error.response?.data?.message 
                    || error.message 
                    || 'Network error. Please try again later.';
                console.error('Login error:', errorMessage);
                alert(errorMessage);
            }
        }
    };

    return (
        <div className="login-container">
            <div className="login-form">
                <h2>Login</h2>
                <form onSubmit={handleSubmit}>
                    <div>
                        <input
                            type="text"
                            placeholder="Email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                        {emailError && <div className="error">{emailError}</div>}
                    </div>
                    <div>
                        <input
                            type="password"
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                        {passwordError && <div className="error">{passwordError}</div>}
                    </div>
                    <button type="submit" disabled={loading}>
                        {loading ? 'Logging in...' : 'Login'}
                    </button>
                </form>
                <p className="switch-link">
                    Don't have an account? <a href="/signup">Sign Up Here</a>
                </p>
            </div>
        </div>
    );
};

export default LoginPage;

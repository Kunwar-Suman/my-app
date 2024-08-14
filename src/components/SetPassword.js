// src/components/SetPassword.js
import React, { useState } from 'react';
import axios from '../api/axios';
import { useLocation, useNavigate } from 'react-router-dom';
import './SetPassword.css';

const SetPassword = () => {
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const location = useLocation();
    const navigate = useNavigate();
    const token = new URLSearchParams(location.search).get('token');

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            setErrorMessage('Passwords do not match');
            return;
        }

        try {
            const response = await axios.post('/api/set-password', { token, password });
            setSuccessMessage(response.data.message);
            setErrorMessage('');
            navigate('/login'); 
        } catch (error) {
            setErrorMessage('Error setting password. Please try again.');
            console.error('Error setting password:', error);
        }
    };

    return (
        <div className="set-password-container">
            <h3>Set Your Password</h3>
            <form onSubmit={handleSubmit} className="set-password-form">
                <label>
                    Add Password:
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </label>
                <label>
                    Confirm Password:
                    <input
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                    />
                </label>
                <button type="submit">Set Password</button>
                {errorMessage && <p className="error-message">{errorMessage}</p>}
                {successMessage && <p className="success-message">{successMessage}</p>}
            </form>
        </div>
    );
};

export default SetPassword;

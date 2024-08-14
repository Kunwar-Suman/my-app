import React, { useState } from 'react';
import axios from '../api/axios';
import { useNavigate } from 'react-router-dom';
import './SignupPage.css';
import { isValidNumber } from 'libphonenumber-js';


const SignupPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [phone, setPhone] = useState('');
    const [address, setAddress] = useState('');
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const [generalError, setGeneralError] = useState('');
    const navigate = useNavigate();

    const validate = () => {
        const newErrors = {};
        if (!firstName) newErrors.firstName = "First name is required";
        if (!lastName) newErrors.lastName = "Last name is required";
        if (!email || !/\S+@\S+\.\S+/.test(email)) newErrors.email = "Valid email is required";
        if (!password || password.length < 6) newErrors.password = "Password must be at least 6 characters";
        if (!phone || !isValidNumber(phone, 'NP')) newErrors.phone = "Valid phone number is required";
        if (!address) newErrors.address = "Address is required";

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (validate()) {
            setLoading(true);
            setGeneralError('');
    
            try {
                await axios.post('/api/auth/register', {
                    email, password, firstName, lastName, phone, address
                });
                navigate('/login');
            } catch (error) {
                console.error('Signup error:', error);
                if (error.response && error.response.status === 400) {
                    setGeneralError('User already exists.');
                } else if (error.response && error.response.data) {
                    setGeneralError(error.response.data.message || 'An error occurred during signup. Please try again.');
                } else {
                    setGeneralError('An error occurred during signup. Please try again.');
                }
            } finally {
                setLoading(false);
            }
        }
    };

    return (
        <div className="signup-container">
            <div className="signup-form">
                <h2>Sign Up</h2>
                <form onSubmit={handleSubmit}>
                    <input
                        type="text"
                        placeholder="First Name"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                    />
                    {errors.firstName && <p className="error">{errors.firstName}</p>}

                    <input
                        type="text"
                        placeholder="Last Name"
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                    />
                    {errors.lastName && <p className="error">{errors.lastName}</p>}

                    <input
                        type="text"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                    {errors.email && <p className="error">{errors.email}</p>}

                    <input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    {errors.password && <p className="error">{errors.password}</p>}

                    <input
                        type="text"
                        placeholder="Phone"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                    />
                    {errors.phone && <p className="error">{errors.phone}</p>}

                    <input
                        type="text"
                        placeholder="Address"
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                    />
                    {errors.address && <p className="error">{errors.address}</p>}

                    {generalError && <p className="error">{generalError}</p>}
                    
                    <button type="submit" disabled={loading}>
                        {loading ? 'Signing Up...' : 'Sign Up'}
                    </button>
                </form>
                <p className="switch-link">
                    Already have an account? <a href="/login">Login Here</a>
                </p>
            </div>
        </div>
    );
};

export default SignupPage;

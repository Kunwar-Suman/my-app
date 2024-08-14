import React, { useState } from 'react';
import axios from '../api/axios'; // Adjust import path as needed
import { useNavigate } from 'react-router-dom';
import './AddUserForm.css';

const AddUserForm = ({ onSave }) => {
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        address: '',
        role: 'user' // Default role
    });

    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevData => ({
            ...prevData,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log('Form Submitted with data:', formData);
        try {
            const response = await axios.post('/api/send-invite', formData);
            console.log('Response received:', response);

            if (onSave) {
                onSave(response.data); // Notify parent component about the new user
            }

            navigate('/admin-dashboard');
        } catch (error) {
            console.error('Error sending invite:', error);
        }
    };

    const handleCloseClick = () => {
        console.log('Close button clicked'); // Debugging statement
        navigate('/admin-dashboard'); // Navigate back to dashboard
    };

    return (
        <div className="add-form-container">
            <h3>Add New User</h3>
            <button onClick={() => navigate('/admin-dashboard')} className="back-button">
                Back to Dashboard
            </button>
            <form onSubmit={handleSubmit} className="add-form">
                <label>
                    First Name:
                    <input
                        type="text"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleChange}
                        required
                    />
                </label>
                <label>
                    Last Name:
                    <input
                        type="text"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleChange}
                        required
                    />
                </label>
                <label>
                    Email:
                    <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                    />
                </label>
                <label>
                    Phone:
                    <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                    />
                </label>
                <label>
                    Address:
                    <input
                        type="text"
                        name="address"
                        value={formData.address}
                        onChange={handleChange}
                    />
                </label>
                <label>
                    Role:
                    <select
                        name="role"
                        value={formData.role}
                        onChange={handleChange}
                    >
                        <option value="admin">Admin</option>
                        <option value="user">User</option>
                    </select>
                </label>
                <div className="form-actions">
                    <button type="submit">Send Invite</button>
                    <button type="button" onClick={handleCloseClick}>Cancel</button>
                </div>
            </form>
        </div>
    );
};

export default AddUserForm;

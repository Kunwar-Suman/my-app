import React, { useState, useEffect } from 'react';
import axios from '../api/axios'; // Adjust import path as needed
import './EditUserForm.css';


const EditUserForm = ({ user, onClose, onSave }) => {
    const [formData, setFormData] = useState({ ...user });

    useEffect(() => {
        setFormData({ ...user });
    }, [user]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevData => ({
            ...prevData,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.put(`/api/user_details/${formData.id}`, formData);
            onSave(formData); // Notify parent component about the update
        } catch (error) {
            console.error('Error updating user:', error);
        }
    };

    return (
        <div className="edit-form-container">
            <h3>Edit User</h3>
            <form onSubmit={handleSubmit} className="edit-form">
                <label>
                    First Name:
                    <input type="text" name="firstName" value={formData.firstName} onChange={handleChange} required />
                </label>
                <label>
                    Last Name:
                    <input type="text" name="lastName" value={formData.lastName} onChange={handleChange} required />
                </label>
                <label>
                    Email:
                    <input type="email" name="email" value={formData.email} onChange={handleChange} required />
                </label>
                <label>
                    Phone:
                    <input type="tel" name="phone" value={formData.phone} onChange={handleChange} />
                </label>
                <label>
                    Address:
                    <input type="text" name="address" value={formData.address} onChange={handleChange} />
                </label>
                <label>
    Role:
    <select name="role" value={formData.role} onChange={handleChange}>
        <option value="admin">Admin</option>
        <option value="user">User</option>
    </select>
</label>

                
                <div className="form-actions">
                    <button type="submit">Save</button>
                    <button type="button" onClick={onClose}>Cancel</button>
                </div>
            </form>
        </div>
    );
};

export default EditUserForm;

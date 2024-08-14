import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../api/axios'; 
import EditUserForm from './EditUserForm'; // Import the EditUserForm component
import './UserListingPage.css'; 

const UserListingPage = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [editingUser, setEditingUser] = useState(null); // State to manage editing user
    const [searchQuery, setSearchQuery] = useState(''); // State to manage search query
    const usersPerPage = 10;
    const navigate = useNavigate(); // Hook for navigation

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await axios.get('/api/user_details'); 
                setUsers(response.data);
            } catch (error) {
                console.error('Error fetching users:', error);
                setError('Failed to load users. Please try again later.');
            } finally {
                setLoading(false);
            }
        };

        fetchUsers();
    }, []);

    const handleNextPage = () => {
        setCurrentPage(prevPage => prevPage + 1);
    };

    const handlePreviousPage = () => {
        setCurrentPage(prevPage => (prevPage > 1 ? prevPage - 1 : 1));
    };

    const handleEdit = (user) => {
        setEditingUser(user); // Set the user to be edited
    };

    const handleSave = (updatedUser) => {
        setUsers(users.map(user => user.id === updatedUser.id ? updatedUser : user));
        setEditingUser(null); // Close the edit form
    };

    const handleCloseEdit = () => {
        setEditingUser(null); // Close the edit form
    };

    const handleDelete = async (userId) => {
        const isConfirmed = window.confirm('Are you sure you want to delete this user?');
        if (!isConfirmed) return;

        try {
            await axios.delete(`/api/user_details/${userId}`);
            setUsers(users.filter(user => user.id !== userId));
        } catch (error) {
            console.error('Error deleting user:', error);
            setError('Failed to delete user. Please try again later.');
        }
    };

    const handleBackToDashboard = () => {
        navigate('/admin-dashboard'); // Navigate to Admin Dashboard
    };

    // Handle search query change
    const handleSearchChange = (event) => {
        setSearchQuery(event.target.value);
        setCurrentPage(1); // Reset to the first page when searching
    };

    // Filter users based on search query
    const filteredUsers = users.filter(user => 
        `${user.firstName} ${user.lastName}`.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const indexOfLastUser = currentPage * usersPerPage;
    const indexOfFirstUser = indexOfLastUser - usersPerPage;
    const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);

    return (
        <div className={`user-listing-container ${editingUser ? 'blurred' : ''}`}>
            <h2>User List</h2>
            <button onClick={handleBackToDashboard} className="back-button">
                Back to Dashboard
            </button>
            <input 
                type="text" 
                placeholder="Search by name..." 
                value={searchQuery} 
                onChange={handleSearchChange}
                className="search-input"
            />
            {loading && <p>Loading...</p>}
            {error && <p className="error">{error}</p>}
            {editingUser && (
                <EditUserForm
                    user={editingUser}
                    onClose={handleCloseEdit}
                    onSave={handleSave}
                />
            )}
            {currentUsers.length > 0 ? (
                <>
                    <table className="user-table">
                        <thead>
                            <tr>
                                <th>Id</th> 
                                <th>Name</th>
                                <th>Email</th>
                                <th>Phone</th>
                                <th>Address</th>
                                <th>Role</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {currentUsers.map(user => (
                                <tr key={user.id}>
                                    <td>{user.id}</td> 
                                    <td>{user.firstName} {user.lastName}</td>
                                    <td>{user.email}</td>
                                    <td>{user.phone}</td>
                                    <td>{user.address}</td>
                                    <td>{user.role}</td>
                                    <td>
                                        <button className="edit-button" onClick={() => handleEdit(user)}>Edit</button>
                                        <button className="delete-button" onClick={() => handleDelete(user.id)}>Delete</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    <div className="pagination-controls">
                        <button onClick={handlePreviousPage} disabled={currentPage === 1}>Previous</button>
                        <button onClick={handleNextPage} disabled={indexOfLastUser >= filteredUsers.length}>Next</button>
                    </div>
                </>
            ) : (
                !loading && <p>No users found.</p>
            )}
        </div>
    );
};

export default UserListingPage;

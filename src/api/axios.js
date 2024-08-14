// src/api/axios.js
import axios from 'axios';


// Create an axios instance
const instance = axios.create({
    baseURL: process.env.REACT_APP_API_BASE_URL || 'http://localhost:3000' , // Use environment variable or default to local URL
    timeout: 5000,
    headers: {
        'Content-Type': 'application/json'
    }
});

// Request interceptor to add token to headers
instance.interceptors.request.use(
    config => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    error => Promise.reject(error)
);

// Response interceptor to handle errors
instance.interceptors.response.use(
    response => response,
    error => {
        if (error.response && error.response.status === 401) {
            // Handle unauthorized access
            console.log('Unauthorized access');
        }
        return Promise.reject(error);
    }
);

export default instance;

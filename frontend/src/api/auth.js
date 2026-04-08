import axios from 'axios';

const API = axios.create({
    baseURL: 'http://127.0.0.1:3000/api', // Ensure this matches your backend port
});

export const signupUser = async (userData) => {
    try {
        const response = await API.post('/users/signup', userData);
        return response.data;
    } catch (error) {
        // Throw the error message from the backend (e.g., "Email already exists")
        throw error.response?.data?.message || "Signup failed";
    }
};

export const loginUser = async (userData) => {
    try {
        const response = await API.post('/users/login', userData);
        // Important: Your backend should return a { token, user } object
        return response.data; 
    } catch (error) {
        throw error.response?.data?.message || "Login failed";
    }
};
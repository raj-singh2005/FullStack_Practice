import axios from 'axios';

// 1. Create an Axios instance with your Backend Base URL
const API = axios.create({
    baseURL: 'http://localhost:3000/api/authority', // Ensure this matches your backend port
});

// 2. Authority Register API
export const registerAuthority = async (authData) => {
    try {
        const response = await API.post('/register', authData);
        return response.data;
    } catch (error) {
        // This throws the specific error message from your Controller
        throw error.response?.data?.message || "Registration failed";
    }
};

// 3. Authority Login API
export const loginAuthority = async (authData) => {
    try {
        const response = await API.post('/login', authData);
        return response.data;
    } catch (error) {
        throw error.response?.data?.message || "Login failed";
    }
};

// 4. Get Authority Profile (Optional for now)
export const getAuthorityProfile = async (id) => {
    try {
        const response = await API.get(`/profile/${id}`);
        return response.data;
    } catch (error) {
        throw error.response?.data?.message || "Could not fetch profile";
    }
};
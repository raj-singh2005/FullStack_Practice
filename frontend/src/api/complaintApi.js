import axios from 'axios';

const API = axios.create({
    baseURL: 'http://localhost:3000/api/complaints', 
});

// Fetch all complaints for the logged-in user
export const getUserComplaints = async (userId) => {
    try {
        const response = await API.get(`/user/${userId}`); // You'll need this route
        return response.data;
    } catch (error) {
        throw error.response?.data?.message || "Error fetching reports";
    }
};

// If you haven't made a user-specific route yet, you can use the general one:
export const getAllComplaints = async () => {
    try {
        const response = await API.get('/'); 
        return response.data;
    } catch (error) {
        throw error.response?.data?.message || "Error fetching reports";
    }
};
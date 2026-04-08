import axios from 'axios';

const API = axios.create({
    baseURL: 'http://localhost:3000/api', // Matches your Backend URL
});


// This helper will handle the Multipart/Form-Data for images automatically
export const createComplaint = (formData) => API.post('/complaints', formData, {
    headers: {
        'Content-Type': 'multipart/form-data',
    },
});

export const fetchComplaints = () => API.get('/complaints');

export default API;
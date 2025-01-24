import axios from 'axios';

const API_URL = 'http://localhost:8000/api/users'; 

const signup = async (userData) => {
    try {
        const response = await axios.post(`${API_URL}/signup`, userData);
        return response.data; 
    } catch (error) {
        throw error.response.data; 
    }
};

const signin = async (userData) => {
    try {
        const response = await axios.post(`${API_URL}/signin`, userData, { withCredentials: true });  
        return response.data; 
    } catch (error) {
        throw error.response.data; 
    }
};

export {
    signup,
    signin
}
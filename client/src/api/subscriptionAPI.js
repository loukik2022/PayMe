import axios from 'axios';

const API_URL = 'http://localhost:8000/api/subscriptions';

// get all plan details from backend

const getALLSubcriptions = async () => {
  try {
    const response = await axios.get(`${API_URL}/allSubscriptions`, { withCredentials: true });
    return response.data;
  } catch (error) {
    console.error('Error fetching subscriptions:', error);
    throw error;
  }
};

export { getALLSubcriptions }
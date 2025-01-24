import axios from 'axios';

const API_URL = 'http://localhost:8000/stripe';

const createPayment = async (paymentData) => {
  try {
    console.log(document.cookie);
    const accessToken = document.cookie.split(';').find(c => c.trim().startsWith('accessToken')).split('=')[1]; // Extract the access token from cookies

    const response = await axios.post(`${API_URL}/create-checkout-session`, 
        { paymentData }, 
        { 
            withCredentials: true,
            headers: {
                Authorization: `Bearer ${accessToken}` 
            }
        }
    );

    const { url } = response.data;

    window.location.href = url;
  } catch (error) {
    console.error('Error creating checkout session:', error);
  }
}

const manageBilling = async (sessionId) => {
  try {
    const response = await axios.post(`${API_URL}/create-portal-session`, { session_id: `${sessionId}` }, { withCredentials: true });

    const { url } = response.data;

    window.location.href = url;
  } catch (error) {
    console.error('Error creating billing portal session:', error);
  }
}

const confirmPayment = async (sessionId) => {
  try {
    // Confirm the payment intent status via backend
    const response = await axios.post(`${API_URL}/confirm-payment`, { session_id: `${sessionId}` }, { withCredentials: true });

    if (response.data.status === 'succeeded') {
      console.log("Payment confirmed:", response.data);
      // Handle success, e.g., display receipt
    } else {
      console.error("Payment not successful:", response.data);
    }
  } catch (error) {
    console.error("Error confirming payment:", error);
  }
};

export { createPayment, confirmPayment, manageBilling };
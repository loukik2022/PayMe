import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { confirmPayment, manageBilling } from '../api/transactionAPI';

const SuccessPage = () => {
    const [searchParams] = useSearchParams();
    const [sessionId, setSessionId] = useState(null);
    const [paymentStatus, setPaymentStatus] = useState(null);

    useEffect(() => {
        // Extract query parameters
        const success = searchParams.get('success');
        const sessionId = searchParams.get('session_id');

        confirmPayment(sessionId);

        if (success === 'true' && sessionId) {
            setSessionId(sessionId);
            setPaymentStatus('Successful!');
        } else {
            setPaymentStatus('Failed');
        }
    }, []);

    const handleSubmit = async (sessionId, e) => {
        e.preventDefault();
        console.log("Manage subscription...");
        
        manageBilling(sessionId) 
      };

    return (
        <div className="success-page">
            <h1>Payment Status: {paymentStatus}</h1>
            <div>
                <p>Thank you for using PayMe!</p>
            </div>
            <button onClick={(e) => handleSubmit(sessionId, e)}>Manage Subscription</button>
        </div>
    );
};

export default SuccessPage;
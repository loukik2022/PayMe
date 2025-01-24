import mongoose from 'mongoose';

const stripeSchema = new mongoose.Schema({
        // Internal user ID, mapped to Stripe's customer ID
        userId: {
            type: String,
        },
        customerId: {
            type: String, 
        },
        
        // Internal transaction ID, mapped to Stripe's session ID
        transactionId: {
            type: String,
        },
        sessionId: {
            type: String, 
        },
        
        // Internal subscription ID, mapped to Stripe's product ID
        subscriptionId: {
            type: String,
        },
        productId: {
            type: String,
        },
    },
    { timestamps: true }
);

export const StripeMapping = mongoose.model('StripeMapping', stripeSchema);

import mongoose from 'mongoose'

const transactionSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    subscriptionId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Subscription',
        required: true,
    },
    amount: {
        type: Number,
        required: true,
    },
    currency: {
        type: String,
        default: 'Rs',
    },
    status: {
        type: String,
        enum: ['open', 'complete', 'expired', 'canceled'],
        required: true,
    },
    paymentMethod: {
        type: String,
    },
},
    {
        timestamps: true,
    }
);

export const Transaction = mongoose.model('Transaction', transactionSchema);

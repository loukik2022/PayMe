import mongoose from 'mongoose'

const subscriptionSchema = new mongoose.Schema({
    planName: {
        type: String,
        required: true,
    },
    price: {
        type: Number,
        required: true,
    },
    description: {
        type: String,
    },
    status: {
        type: String,
        enum: ['active', 'inactive', 'cancelled'],
        default: 'active',
        required: true,
    },
    billingCycle: {
        type: String,
        enum: ['month', 'year'],
        required: true,
    },
    startDate: {
        type: Date,
        required: true,
    },
    endDate: {
        type: Date,
        required: true,
    },
    features: [
        { type: String }
    ]
},
    {
        timestamps: true,
    }
);

export const Subscription = mongoose.model('Subscription', subscriptionSchema);


/*
{
  "planName": "Basic Plan",
  "price": 10000,
  "billingCycle": "month",
  "description": "Ideal for single small project with essential integrations and basic support.",
  "features": [
    "One project",
    "One database server integration",
    "One external API service integration",
    "Basic support"
  ],
  "startDate": "2024-12-25T13:32:17.284Z",
  "endDate": "2024-12-25T13:32:17.284Z",
  "status": "active"
}

{
  "planName": "Standard Plan",
  "price": 100000,
  "billingCycle": "year",
  "description": "Perfect for growing businesses with multiple projects and priority support.",
  "features": [
    "Up to five projects",
    "Two database server integrations",
    "Three external API service integrations",
    "Priority support",
    "Access to standard features"
  ],
  "startDate": "2024-01-25T13:31:54.280Z",
  "endDate": "2025-01-25T13:31:54.280Z",
  "status": "active"
}

{
  "planName": "Premium Plan",
  "price": 2500000,
  "billingCycle": "year",
  "description": "Comprehensive solution for unlimited projects and premium features with dedicated support.",
  "features": [
    "Unlimited projects",
    "Unlimited database server integrations",
    "Unlimited external API service integrations",
    "Access to all premium features",
    "Available physically 8 hours per day"
  ],
  "startDate": "2024-12-25T13:32:29.061Z",
  "endDate": "2025-12-25T13:32:17.284Z",
  "status": "active"
}
*/
import mongoose from "mongoose";
import { Subscription } from '../models/subscription.js'; 

const checkPlanMissingFields = async (req, res, next) => {
    const { planName, price, billingCycle, startDate, endDate, status } = req.body;

    // Check for missing required fields
    if (!planName || !price || !billingCycle || !startDate || !endDate || !status) {
        return res.status(400).json({ error: 'Missing required fields' });
    }

    next();
};

const checkSubscriptionExists = async (req, res, next) => {
    const { subscriptionId } = req.body;

    // Check if subscriptionId is a valid Object ID
    if (!mongoose.Types.ObjectId.isValid(subscriptionId)) {
        return res.status(400).json({ error: 'Invalid subscription ID format' });
    }
    // Check if subscription exists in the database and must be Object Id 
    const subscriptionExists = await Subscription.findById(subscriptionId);
    if (!subscriptionExists) {
        return res.status(404).json({ error: 'Subscription not found' });
    }

    next();
};

export {
    checkPlanMissingFields,
    checkSubscriptionExists
}
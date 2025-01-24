import express from 'express';
import jwt from 'jsonwebtoken';
import { stripe } from "./config/stripeConfig.js";
import { Transaction } from "./models/transaction.js";
import { StripeMapping } from './models/stripeMapping.js';

const stripeService = express.Router();
const domain = `http://localhost:5173/stripe`;

const subscription_to_product = async (subscriptionId) => {
    const mapping = await StripeMapping.findOne({ subscriptionId: subscriptionId });
    return mapping ? mapping.productId : null;
};

const user_to_customer = async (userId) => {
    const mapping = await StripeMapping.findOne({ userId: userId });
    return mapping ? mapping.customerId : null;
}

const token_to_user = async (req, res) => {
    const accessToken = req.cookies.accessToken;

    if (!accessToken) {
        return res.status(401).send('Access token is missing');
    }

    try {
        const decodedToken = jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET);
        const userId = decodedToken.id;

        return userId;
    } catch (error) {
        console.log("Error decoding access token:", error);
        return res.status(401).send('Invalid access token');
    }
}

const session_to_transaction = async (sessionId) => {
    const mapping = await StripeMapping.findOne({ sessionId: sessionId });
    return mapping ? mapping.transactionId : null;
};

const save_to_db = async (userId, subscriptionId, session) => {
    try {
        const newTransaction = new Transaction({
            userId: userId,
            subscriptionId: subscriptionId,
            amount: session.amount_total / 100,
            currency: session.currency,
            status: session.status,
            paymentMethod: session.payment_method_types[0],
        });

        await newTransaction.save();

        await StripeMapping.create({
            sessionId: session.id,
            transactionId: newTransaction._id,
        });

    } catch (error) {
        console.log("Error saving checkout session:", error);
    }
}

stripeService.post('/create-checkout-session', async (req, res) => {
    // get access token from client (access token -> decode to userId -> customerId from db using userID)
    const userId = await token_to_user(req, res);
    const customerId = await user_to_customer(userId);

    // console.log(userId, customerId);

    // get subscriptionId from client
    const subscriptionId = req.body.paymentData.planId;
    const productId = await subscription_to_product(subscriptionId);

    // console.log(subscriptionId, productId);

    // get prices from stripe product
    const product = await stripe.products.retrieve(productId);
    const prices = await stripe.prices.list({ product: product.id, });

    // console.log(prices);

    try {
        const session = await stripe.checkout.sessions.create({
            billing_address_collection: 'required',
            customer: customerId,
            line_items: [
                {
                    price: prices.data[0].id,
                    quantity: 1,
                },
            ],
            mode: 'subscription',
            success_url: `${domain}/?success=true&session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${domain}?canceled=true`,
        });

        // console.log(session);

        await save_to_db(userId, subscriptionId, session);

        res.status(202).json({ url: session.url });
    } catch (error) {
        logErrorToFile(error);

        console.log("Error creating checkout session:", error);
    }
});

stripeService.post('/confirm-payment', async (req, res) => {
    try {
        const { session_id } = req.body;
        const session = await stripe.checkout.sessions.retrieve(session_id);
        if(!session) {
            return res.status(404).json({ error: 'Checkout session not found' });
        }

        const transactionId = await session_to_transaction(session_id);
        const transaction = await Transaction.findById(transactionId);
        if (!transaction) {
            return res.status(404).json({ error: 'Transaction not found' });
        }

        transaction.status = session.status;
        await transaction.save();

        res.json({status: 'succeeded'});
    } catch (error) {
        console.error('[Stripe Service] Payment confirmation error:', error);
        res.status(500).json({
            code: error.code || 'payment_confirmation_failed',
            message: error.message || 'Payment confirmation failed'
        });
    }
});

stripeService.post('/create-portal-session', async (req, res) => {
    const { session_id } = req.body;

    // console.log(session_id) // undefined -> need to activate billing from stripe dashboard first

    const checkoutSession = await stripe.checkout.sessions.retrieve(session_id);

    const returnUrl = `http://localhost:5173/landing`; // home page

    const portalSession = await stripe.billingPortal.sessions.create({
        customer: checkoutSession.customer,
        return_url: returnUrl,
    });

    res.status(202).json({ url: portalSession.url })
});

export default stripeService;
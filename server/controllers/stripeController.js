import { stripe } from '../config/stripeConfig.js';
import { Transaction } from '../models/transaction.js';
import { StripeMapping } from '../models/stripeMapping.js';
import { findTransactionIdBySessionId, findCustomerIdByUserId, findProductIdBySubscriptionId } from '../controllers/stripeMappingController.js';

const DOMAIN = 'http://localhost:5173/stripe';

// Stripe Operations
const stripeUserCreate = async (user) => {
  try {
    const address = {
      line1: user.billingAddress || 'Address',
      city: user.city || 'City',
      postal_code: user.postalCode || '123456',
      state: user.state || 'State',
      country: user.country || 'Country',
    };

    const customer = await stripe.customers.create({
      email: user.email,
      name: user.username,
      address: address,
    });

    await StripeMapping.save({ 
      userId: user._id, 
      customerId: customer.id, 
    });

    return customer;
  } catch (error) {
    console.error('Error creating customer:', error);
    throw error;
  }
};

const stripeSubscriptionCreate = async (planDetails) => {
  try {
    const product = await stripe.products.create({
      name: planDetails.planName,
      description: planDetails.description,
    });

    const price = await stripe.prices.create({
      unit_amount: planDetails.price * 100,
      currency: 'inr',
      recurring: { interval: planDetails.billingCycle },
      product: product.id,
    });

    await StripeMapping.save({ 
      subscriptionId: planDetails._id,  
      productId: product.id, 
    });

    return { product, price };
  } catch (error) {
    console.error('Error creating subscription:', error);
    throw error;
  }
};

const stripeUserUpdate = async (userId, updateDetails) => {
  try {
    const customerId = await findCustomerIdByUserId(userId);
    const updatedCustomer = await stripe.customers.update(customerId, {
      email: updateDetails.email,
      name: updateDetails.username,
      address: {
        line1: updateDetails.billingAddress,
        city: updateDetails.city,
        postal_code: updateDetails.postalCode,
        state: updateDetails.state,
        country: updateDetails.country,
      },
    });
    return updatedCustomer;
  } catch (error) {
    console.error('Error updating customer:', error);
    throw error;
  }
};

const stripeSubscriptionUpdate = async (subscriptionId, updateDetails) => {
  try {
    const productId = await findProductIdBySubscriptionId(subscriptionId);
    const subscription = await stripe.subscriptions.update(productId, {
      cancel_at_period_end: updateDetails.cancelAtPeriodEnd,
      items: [{
        id: subscription.items.data[0].id,
        price: updateDetails.newPriceId,
      }],
    });
    return subscription;
  } catch (error) {
    console.error('Error updating subscription:', error);
    throw error;
  }
};

// Checkout Handlers
const createCheckoutSession = async (customerId, productId) => {
  const product = await stripe.products.retrieve(productId);
  const prices = await stripe.prices.list({ product: product.id });

  return stripe.checkout.sessions.create({
    billing_address_collection: 'required',
    customer: customerId,
    line_items: [{ price: prices.data[0].id, quantity: 1 }],
    mode: 'subscription',
    success_url: `${DOMAIN}/?success=true&session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${DOMAIN}?canceled=true`,
  });
};

const createCheckout = async (req, res) => {
  try {
    const userId = req.userId;
    const customerId = await findCustomerIdByUserId(userId);
    const productId = await findProductIdBySubscriptionId(req.body.paymentData.planId);

    const session = await createCheckoutSession(customerId, productId);
    
    const transaction = new Transaction({
      userId,
      subscriptionId: req.body.paymentData.planId,
      amount: session.amount_total / 100,
      currency: session.currency,
      status: session.status,
      paymentMethod: session.payment_method_types[0],
    });
    await transaction.save();

    await StripeMapping.create({
      sessionId: session.id,
      transactionId: transaction._id,
    });

    res.status(202).json({ url: session.url });
  } catch (error) {
    console.error("Checkout error:", error);
    res.status(500).json({ error: error.message });
  }
};

const confirmPayment = async (req, res) => {
  try {
    const session = await stripe.checkout.sessions.retrieve(req.body.session_id);
    if (!session) return res.status(404).json({ error: 'Session not found' });

    const transactionId = await findTransactionIdBySessionId(session.id);
    if (!transactionId) return res.status(404).json({ error: 'Transaction not found' });

    const updatedTransaction = await Transaction.findByIdAndUpdate(
      transactionId,
      { status: session.status },
      { new: true }
    );

    res.json({ status: 'succeeded', transaction: updatedTransaction });
  } catch (error) {
    console.error("Payment confirmation error:", error);
    res.status(500).json({ error: error.message });
  }
};

const createPortal = async (req, res) => {
  try {
    const session = await stripe.checkout.sessions.retrieve(req.body.session_id);
    const portalSession = await stripe.billingPortal.sessions.create({
      customer: session.customer,
      return_url: 'http://localhost:5173/landing',
    });
    res.status(202).json({ url: portalSession.url });
  } catch (error) {
    console.error("Portal error:", error);
    res.status(500).json({ error: error.message });
  }
};

export { createCheckout, confirmPayment, createPortal, stripeUserCreate, stripeSubscriptionCreate, stripeUserUpdate, stripeSubscriptionUpdate };
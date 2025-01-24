import { StripeMapping } from '../models/stripeMapping.js';

const findProductIdBySubscriptionId = async (subscriptionId) => {
  const mapping = await StripeMapping.findOne({ subscriptionId });
  return mapping?.productId;
};

const findCustomerIdByUserId = async (userId) => {
  const mapping = await StripeMapping.findOne({ userId });
  return mapping?.customerId;
};

const findTransactionIdBySessionId = async (sessionId) => {
  const mapping = await StripeMapping.findOne({ sessionId });
  return mapping?.transactionId;
};

export { findProductIdBySubscriptionId, findCustomerIdByUserId, findTransactionIdBySessionId };
/*
- check for missing required fields in client request (userID, subscriptionId, amount, currency, status)
- only user existed in db must be able to do transaction
- only subscription plan existed in db must be allowed for transaction
- amount field must be positive
- status must be one of `pending`, `success`, `failed`
*/

const checkTranMissingField = async (req, res, next) => {
    const { userId, subscriptionId, amount, status } = req.body;

    // Check for missing required fields
    if (!userId || !subscriptionId || !amount || !status) {
        return res.status(400).json({ error: 'Missing required fields' });
    }

    next();
};

const validateAmountStatus = async (req, res, next) => {
    const { amount, status } = req.body;

    // Validate amount
    if (typeof amount !== 'number' || amount <= 0) {
        return res.status(400).json({ error: 'Amount must be a positive number' });
    }

    // Validate status (intially pending, then either success or failed)
    const validStatuses = ['pending', 'success', 'failed'];
    if (!validStatuses.includes(status)) {
        return res.status(400).json({ error: 'Status must be one of: pending, success, failed' });
    }

    next();
};

export { checkTranMissingField, validateAmountStatus };
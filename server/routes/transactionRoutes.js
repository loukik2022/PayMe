import express from 'express';
import { checkToken, checkRole } from "../middlewares/verifyAuth.js";
import { checkSubscriptionExists } from "../middlewares/verifySubscription.js"
import { checkTranMissingField, validateAmountStatus} from '../middlewares/verifyTransaction.js';
import { checkUserExists } from '../middlewares/verifyUser.js'
import {
    createTransaction,
    updateTransaction,
    deleteTransaction,
    getUserTransaction
} from '../controllers/transactionController.js';

const router = express.Router();

router.post('/create', [checkTranMissingField, checkUserExists, checkSubscriptionExists, validateAmountStatus], createTransaction);
router.patch('/:transactionId', validateAmountStatus, updateTransaction);
router.delete('/:transactionId', deleteTransaction);

// admin
router.get('/:userId', [checkToken, checkRole('admin'), checkUserExists], getUserTransaction);

export default router;  
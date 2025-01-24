import express from 'express';
import { checkToken } from '../middlewares/verifyAuth.js';
import {
  createCheckout,
  confirmPayment,
  createPortal,
} from '../controllers/stripeController.js';

const router = express.Router();

router.post('/create-checkout-session', checkToken, createCheckout);
router.post('/confirm-payment', confirmPayment);
router.post('/create-portal-session', createPortal);

export default router;
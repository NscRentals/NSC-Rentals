import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import {
  addPaymentMethod,
  getPaymentMethods,
  deletePaymentMethod,
  setDefaultPaymentMethod
} from '../controllers/paymentMethodController.js';

const router = express.Router();

// All routes are protected and require authentication
router.use(protect);

router.route('/')
  .post(addPaymentMethod)
  .get(getPaymentMethods);

router.route('/:id')
  .delete(deletePaymentMethod);

router.route('/:id/default')
  .put(setDefaultPaymentMethod);

export default router; 
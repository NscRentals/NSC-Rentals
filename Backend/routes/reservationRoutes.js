import express from 'express';
import { getUserReservations, updatePaymentStatus, sendBillEmail } from '../controllers/reservationController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/my-reservations', protect, getUserReservations);
router.put('/:id/pay', protect, updatePaymentStatus);
router.post('/send-bill', protect, sendBillEmail);

export default router; 
import express from 'express';
import { getUserReservations } from '../controllers/reservationController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/my-reservations', protect, getUserReservations);

export default router; 
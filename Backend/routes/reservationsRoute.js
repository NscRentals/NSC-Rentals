import express from 'express';
import {
    addReservation,
    getReservations,
    getReservationById,
    updateReservation,
    deleteReservation,
    getUnverifiedReservations,
    verifyReservation
} from '../controllers/reservationsController.js';

const router = express.Router();

// Reservation routes
router.post('/', addReservation);
router.get('/', getReservations);
router.get('/unverified', getUnverifiedReservations);
router.get('/:id', getReservationById);
router.put('/:id', updateReservation);
router.delete('/:id', deleteReservation);
router.post('/:id/verify', verifyReservation);

export default router; 
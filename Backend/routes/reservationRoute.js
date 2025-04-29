import express from 'express';
import {
    reservationAdd,
    reservationFind,
    reservationFindOne,
    reservationUpdate,
    reservationDelete,
    reservationFindUserId,
    reservationFindDriverId,
    getUnverifiedReservations,
    verifyReservation,
    reservationFindByEmail
} from '../controllers/reservationController.js';
import { verifyToken } from '../middlewares/authMiddleware.js';

const router = express.Router();

// Apply authentication middleware to all routes
router.use(verifyToken);

// Reservation routes
router.post('/', reservationAdd);  // Add a reservation
router.get('/', reservationFind);  // Get all reservations
router.get('/unverified', getUnverifiedReservations);
router.get('/:id', reservationFindOne);  // Get a specific reservation by ID
router.put('/:id', reservationUpdate);  // Update a reservation by ID
router.delete('/:id', reservationDelete);  // Delete a reservation by ID
router.get('/user/:userid', reservationFindUserId);  // Get reservations for a specific user
router.get('/driver/:driverid', reservationFindDriverId);  // Get reservations for a specific driver
router.post('/:id/verify', verifyReservation);
router.get('/user/email/:email', reservationFindByEmail);

export default router;

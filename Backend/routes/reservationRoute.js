import express from 'express';
import {
    reservationAdd,
    reservationFind,
    reservationFindOne,
    reservationUpdate,
    reservationDelete,
    reservationFindUserId,
    reservationFindDriverId
} from '../controllers/reservationController.js';

const router = express.Router();

router.post('/reservations', reservationAdd);  // Add a reservation
router.get('/reservations', reservationFind);  // Get all reservations
router.get('/reservations/:id', reservationFindOne);  // Get a specific reservation by ID
router.put('/reservations/:id', reservationUpdate);  // Update a reservation by ID
router.delete('/reservations/:id', reservationDelete);  // Delete a reservation by ID
router.get('/reservations/user/:userid', reservationFindUserId);  // Get reservations for a specific user
router.get('/reservations/driver/:driverid', reservationFindDriverId);  // Get reservations for a specific driver

export default router;

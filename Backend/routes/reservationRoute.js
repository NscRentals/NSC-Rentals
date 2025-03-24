import express from "express";
import { 
    addReservation, 
    getReservations, 
    getReservationById, 
    updateReservation, 
    deleteReservation 
} from "../controllers/reservationsController.js";

const router = express.Router();

// Route to add a new reservation
router.post("/", addReservation);

// Route to get all reservations
router.get("/", getReservations);

// Route to get a reservation by ID
router.get("/:id", getReservationById);

// Route to update a reservation
router.put("/:id", updateReservation);

// Route to delete a reservation
router.delete("/:id", deleteReservation);

export default router;

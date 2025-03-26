import express from "express";
import Reservation from "../models/reservations.js";
import { 
    addReservation, 
    getReservations, 
    getReservationById, 
    updateReservation, 
    deleteReservation 
} from "../controllers/reservationsController.js";

const resRouter = express.Router();

// Route to add a new reservation
resRouter.post("/", addReservation);

// Route to get all reservations
resRouter.get("/", getReservations);

// Route to get a reservation by ID
resRouter.get("/:id", getReservationById);

// Route to update a reservation
resRouter.put("/:id", updateReservation);

// Route to delete a reservation
resRouter.delete("/:id", deleteReservation);

export default resRouter;

import Reservation from "../models/reservations.js";

// Add reservation
export async function addReservation(req, res) {
    try {
        let newReservation = new Reservation(req.body);
        await newReservation.save();
        return res.status(200).json({
            success: "Reservation saved successfully!"
        });
    } catch (err) {
        return res.status(400).json({
            error: err.message
        });
    }
}

// Get all reservations
export async function getReservations(req, res) {
    try {
        const reservations = await Reservation.find();

        if (reservations.length === 0) {
            return res.status(400).json({
                success: false,
                message: "No reservations found!"
            });
        }
        return res.status(200).json({ success: true, reservations });

    } catch (err) {
        return res.status(500).json({
            error: err.message
        });
    }
}

// Get reservation by ID
export async function getReservationById(req, res) {
    try {
        const { id } = req.params;
        const reservation = await Reservation.findById(id);

        if (!reservation) {
            return res.status(404).json({
                success: false,
                message: "Reservation not found!"
            });
        }

        return res.status(200).json({ success: true, reservation });

    } catch (err) {
        return res.status(500).json({
            success: false,
            error: err.message
        });
    }
}

// Update reservation
export async function updateReservation(req, res) {
    try {
        const { id } = req.params;
        const updatedData = req.body;

        const updatedReservation = await Reservation.findByIdAndUpdate(id, updatedData, { new: true });

        if (!updatedReservation) {
            return res.status(404).json({
                success: false,
                message: "Reservation not found!"
            });
        }
        return res.status(200).json({
            success: true,
            updatedReservation
        });
    } catch (err) {
        return res.status(400).json({
            success: false,
            error: err.message
        });
    }
}

// Delete reservation
export async function deleteReservation(req, res) {
    try {
        const deletedReservation = await Reservation.findByIdAndDelete(req.params.id);

        if (!deletedReservation) {
            return res.status(404).json({
                success: false,
                message: "Reservation not found!"
            });
        }
        return res.status(200).json({
            success: true,
            deletedReservation
        });
    } catch (err) {
        return res.status(400).json({
            success: false,
            error: err.message
        });
    }
}

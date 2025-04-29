import Reservation from "../models/reservation.js";

// Add a reservation (Insert)
export async function reservationAdd(req, res) {
  const data = req.body;
  
  console.log("Received reservation data:", data);

  try {
    // Validate required fields
    const requiredFields = [
      'vehicleNum', 'userId', 'driverID', 'name', 'email', 
      'phonenumber', 'address', 'service', 'locationpick', 
      'locationdrop', 'wantedtime', 'amount', 'wanteddate'
    ];
    
    const missingFields = requiredFields.filter(field => !data[field]);
    
    if (missingFields.length > 0) {
      console.error("Missing required fields:", missingFields);
      return res.status(400).json({ 
        error: "Missing required fields", 
        details: missingFields 
      });
    }

    // Create a new reservation
    const newReservation = new Reservation(data);
    await newReservation.save();

    console.log("Reservation created successfully:", newReservation._id);

    // Send success response
    res.status(201).json({
      message: "Reservation added successfully!",
      reservation: newReservation,
    });
  } catch (e) {
    console.error("Error adding reservation:", e);
    return res.status(500).json({ 
      error: "Reservation creation failed!",
      details: e.message 
    });
  }
}

// Find all reservations (View)
export async function reservationFind(req, res) {
  try {
    const reservations = await Reservation.find();

    if (reservations.length === 0) {
      return res
        .status(404)
        .json({ success: false, message: "No reservations found" });
    }

    return res.status(200).json({ success: true, reservations });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}

// Find one reservation by ID (View specific)
export async function reservationFindOne(req, res) {
  try {
    const reservation = await Reservation.findById(req.params.id);
    if (!reservation) {
      return res
        .status(404)
        .json({ success: false, message: "Reservation not found" });
    }
    return res.status(200).json({ success: true, reservation });
  } catch (error) {
    console.error("Error finding reservation:", error);
    return res
      .status(500)
      .json({ success: false, message: "Server error", error: error.message });
  }
}

// Update a reservation (Update)
export async function reservationUpdate(req, res) {
  const {
    vehicleNum,
    userId,
    driverID,
    name,
    email,
    phonenumber,
    address,
    service,
    locationpick,
    locationdrop,
    wantedtime,
    amount,
    wanteddate,
  } = req.body;
  const reservationId = req.params.id;

  try {
    // Validate required fields
    if (
      !vehicleNum ||
      !userId ||
      !driverID ||
      !name ||
      !email ||
      !phonenumber ||
      !address ||
      !service
    ) {
      return res.status(400).json({ error: "All fields are required" });
    }

    // Update the reservation
    const updatedReservation = await Reservation.findByIdAndUpdate(
      reservationId,
      {
        $set: {
          vehicleNum,
          userId,
          driverID,
          name,
          email,
          phonenumber,
          address,
          service,
          locationpick,
          locationdrop,
          wantedtime,
          amount,
          wanteddate,
        },
      },
      { new: true, runValidators: true }
    );

    if (!updatedReservation) {
      return res.status(404).json({ error: "Reservation not found" });
    }

    return res.status(200).json({
      success: "Reservation updated successfully",
      reservation: updatedReservation,
    });
  } catch (err) {
    console.error("Error updating reservation:", err);
    return res.status(500).json({ error: err.message });
  }
}

// Delete a reservation (Delete)
export async function reservationDelete(req, res) {
  try {
    const deletedReservation = await Reservation.findByIdAndDelete(
      req.params.id
    );

    if (!deletedReservation) {
      return res.status(404).json({ error: "Reservation not found" });
    }

    return res.json({
      message: "Reservation deleted successfully",
      deletedReservation,
    });
  } catch (err) {
    console.error("Error deleting reservation:", err);
    return res.status(500).json({ error: err.message });
  }
}

export async function reservationFindUserId(req, res) {
  try {
    const reservations = await Reservation.find({ userId: req.params.userid });
    if (!reservations || reservations.length === 0) {
      return res
        .status(404)
        .json({ success: false, message: "No reservations found for this user" });
    }
    return res.status(200).json({ success: true, reservation: reservations });
  } catch (error) {
    console.error("Error finding reservations:", error);
    return res
      .status(500)
      .json({ success: false, message: "Server error", error: error.message });
  }
}

export async function reservationFindDriverId(req, res) {
  try {
    const reservations = await Reservation.find({ driverID: req.params.driverid });
    if (!reservations || reservations.length === 0) {
      return res
        .status(404)
        .json({ success: false, message: "No reservations found for this driver" });
    }
    return res.status(200).json({ success: true, reservations });
  } catch (error) {
    console.error("Error finding driver reservations:", error);
    return res
      .status(500)
      .json({ success: false, message: "Server error", error: error.message });
  }
}

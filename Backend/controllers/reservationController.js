import Reservation from "../models/reservation.js";

// Add a reservation (Insert)
export async function reservationAdd(req, res) {
  const data = req.body;
  
  console.log("Received reservation data:", data);

  try {
    // Validate required fields
    const requiredFields = [
      'vehicleNum', 'userId', 'driverID', 'name', 'email', 
      'phonenumber', 'address', 'rType', 'service', 'locationpick', 
      'locationdrop', 'startDate', 'endDate', 'price'
    ];
    
    const missingFields = requiredFields.filter(field => !data[field]);
    
    if (missingFields.length > 0) {
      console.error("Missing required fields:", missingFields);
      return res.status(400).json({ 
        error: "Missing required fields", 
        details: missingFields 
      });
    }

    // Log the data types of important fields
    console.log('Data types check:', {
      startDate: typeof data.startDate,
      endDate: typeof data.endDate,
      price: typeof data.price,
      startDateValue: data.startDate,
      endDateValue: data.endDate,
      priceValue: data.price
    });

    // Generate a unique rId
    const rId = 'RES-' + Date.now().toString().slice(-6);

    try {
      // Create a new reservation with the generated rId
      const newReservation = new Reservation({
        ...data,
        rId,
        isVerified: false
      });
      
      // Log the reservation object before saving
      console.log("Attempting to save reservation:", newReservation);
      
      await newReservation.save();
      console.log("Reservation saved successfully:", newReservation._id);

      // Send success response
      res.status(201).json({
        message: "Reservation added successfully!",
        reservation: newReservation,
      });
    } catch (saveError) {
      console.error("Error saving reservation:", {
        error: saveError.message,
        code: saveError.code,
        errors: saveError.errors
      });
      throw saveError;
    }
  } catch (e) {
    console.error("Error adding reservation:", {
      error: e.message,
      code: e.code,
      errors: e.errors
    });
    return res.status(500).json({ 
      error: "Reservation creation failed!",
      details: e.message,
      validationErrors: e.errors
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
    rType,
    service,
    locationpick,
    locationdrop,
    startDate,
    endDate,
    price,
  } = req.body;
  const reservationId = req.params.id;

  try {
    // Validate required fields
    const requiredFields = [
      'vehicleNum', 'userId', 'driverID', 'name', 'email', 
      'phonenumber', 'address', 'rType', 'service', 'locationpick', 
      'locationdrop', 'startDate', 'endDate', 'price'
    ];
    
    const missingFields = requiredFields.filter(field => !req.body[field]);
    
    if (missingFields.length > 0) {
      return res.status(400).json({ 
        error: "Missing required fields",
        details: missingFields
      });
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
          rType,
          service,
          locationpick,
          locationdrop,
          startDate,
          endDate,
          price,
        },
      },
      { new: true, runValidators: true }
    );

    if (!updatedReservation) {
      return res.status(404).json({ error: "Reservation not found" });
    }

    return res.status(200).json({
      success: true,
      message: "Reservation updated successfully",
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

// Get unverified reservations
export async function getUnverifiedReservations(req, res) {
    try {
        console.log('getUnverifiedReservations called');
        console.log('User making request:', req.user);
        
        // Check if user is admin
        if (req.user.type !== 'admin') {
            console.log('User is not admin, access denied');
            return res.status(403).json({
                success: false,
                message: "Only administrators can view unverified reservations"
            });
        }

        console.log('Fetching unverified reservations from database');
        // Explicitly query for reservations where isVerified is false
        const reservations = await Reservation.find({ isVerified: false });
        console.log('Found unverified reservations:', reservations.length);

        return res.status(200).json({ 
            success: true, 
            reservations,
            count: reservations.length 
        });

    } catch (err) {
        console.error('Error in getUnverifiedReservations:', err);
        return res.status(500).json({
            success: false,
            error: err.message
        });
    }
}

// Verify a reservation
export async function verifyReservation(req, res) {
    try {
        // Check if user is admin
        if (req.user.type !== 'admin') {
            return res.status(403).json({
                success: false,
                message: "Only administrators can verify reservations"
            });
        }

        const { id } = req.params;
        const { action } = req.body; // 'approve' or 'reject'

        const reservation = await Reservation.findById(id);
        if (!reservation) {
            return res.status(404).json({
                success: false,
                message: "Reservation not found!"
            });
        }

        if (action === 'approve') {
            // Update the isVerified field to true
            reservation.isVerified = true;
            await reservation.save();
            
            return res.status(200).json({
                success: true,
                message: "Reservation approved successfully!",
                reservation
            });
        } else if (action === 'reject') {
            // For rejected reservations, we delete them
            await Reservation.findByIdAndDelete(id);
            return res.status(200).json({
                success: true,
                message: "Reservation rejected and deleted successfully!"
            });
        } else {
            return res.status(400).json({
                success: false,
                message: "Invalid action! Use 'approve' or 'reject'"
            });
        }
    } catch (err) {
        console.error('Error in verifyReservation:', err);
        return res.status(500).json({
            success: false,
            error: err.message
        });
    }
}

export async function reservationFindByEmail(req, res) {
  try {
    const reservations = await Reservation.find({ email: req.params.email });
    if (!reservations || reservations.length === 0) {
      return res
        .status(404)
        .json({ success: false, message: "No reservations found for this email" });
    }
    return res.status(200).json({ success: true, reservation: reservations });
  } catch (error) {
    console.error("Error finding reservations:", error);
    return res
      .status(500)
      .json({ success: false, message: "Server error", error: error.message });
  }
}

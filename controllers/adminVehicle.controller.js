import Vehicle from "../models/AdminVehicle.js";


export async function addVehicle (req, res) {

  /*  if(req.user == null){
        res.status(401).json({
          message : "Please login and try again"
        })
        return
      }
      if(req.user.role !="admin"){
        res.status(403).json({
          message : "You are not authorized to perform this action"
        })
        return
      } */


    const data = req.body;
    const newVehicle = new Vehicle(data);


    try{
        await newVehicle.save();
        res.json ({
            message: "Vehicle Registered Successfully"
        })
    }catch(error) {
        res.status(500).json ({
            message: "Vehicle Registration Failed"
        })
    }
}

// Read - Get all vehicles
export async function getVehicles(req, res) {
    try {
        const vehicles = await Vehicle.find();
        res.json(vehicles);
    } catch (error) {
        res.status(500).json({
            message: "Failed to retrieve vehicles",
            error: error.message
        });
    }
}

// Read - Get a specific vehicle by ID
export async function getVehicle(req, res) {
    try {
        const { id } = req.params;
        const vehicle = await Vehicle.findById(id);
        if (!vehicle) {
            return res.status(404).json({ message: "Vehicle not found" });
        }
        res.json(vehicle);
    } catch (error) {
        res.status(500).json({
            message: "Failed to retrieve vehicle",
            error: error.message
        });
    }
}


// Update - Update vehicle information by ID
export async function updateVehicle(req, res) {
    try {
        const { id } = req.params;
        const updatedData = req.body;
        const updatedVehicle = await Vehicle.findByIdAndUpdate(id, updatedData, { new: true });
        if (!updatedVehicle) {
            return res.status(404).json({ message: "Vehicle not found" });
        }
        res.json({
            message: "Vehicle updated successfully",
            vehicle: updatedVehicle
        });
    } catch (error) {
        res.status(500).json({
            message: "Failed to update vehicle",
            error: error.message
        });
    }
}


// Delete - Remove a vehicle by ID
export async function deleteVehicle(req, res) {
    try {
        const { id } = req.params;
        const deletedVehicle = await Vehicle.findByIdAndDelete(id);
        if (!deletedVehicle) {
            return res.status(404).json({ message: "Vehicle not found" });
        }
        res.json({
            message: "Vehicle deleted successfully"
        });
    } catch (error) {
        res.status(500).json({
            message: "Failed to delete vehicle",
            error: error.message
        });
    }
}

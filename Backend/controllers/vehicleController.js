import Vehicle from "../models/Vehicle.js";
import { isItAdmin, isItCustomer } from "./userController.js";

// 1. Add a new vehicle (by Admin or User)
export async function addVehicle (req, res) {

    try {     
        
        // If images were uploaded, include their paths:
        /*if (req.files && req.files.length > 0) {
            vehicleData.images = req.files.map(file => `/uploads/${file.filename}`);
        } */

        const data = req.body;
        const newVehicle = new Vehicle(data);

        // Set ownership and approval status
        if(isItAdmin(req)) {

            newVehicle.ownerType = "Company";  
            newVehicle.approvalStatus = "Approved"; // company vehicles auto-approved
        } else {

            // Customer (user) adding a peer-to-peer vehicle    
            newVehicle.ownerType = "User";  
            newVehicle.approvalStatus = "Pending"; // Needs admin approval
        }

        newVehicle.owner = req.user._id; // Set the owner to the logged-in user

        await newVehicle.save();
        res.json({
            message: "Vehicle added successfully",
        });

    } catch (error) {

        // If having duplicate keys in unique fields   e.g. chassisNumber, registrationNumber, and engineNumber
        if (error.code == 11000) {
            const field = Object.keys(error.keyValue)[0];
            return res.status(400).json({
                message: `Vehicle with this ${field} already exists`,
            });
        }

        // Handle all other errors
        res.status(500).json({
            message: "Failed to add vehicle",
           // error: error.message
        });
    }
}

export async function updateVehicle(req, res) {
    try {
      const vehicleId = req.params.id;
      const vehicle = await Vehicle.findById(vehicleId);
  
      if (!vehicle) {
        return res.status(404).json({ message: 'Vehicle not found' });
      }
  
      const isAdmin = isItAdmin(req);
      const isCustomer = isItCustomer(req);
  
      // only admins or customers are allowed at all
      if (!isAdmin && !isCustomer) {
        return res.status(403).json({ message: 'You are not authorized to update this vehicle' });
      }
  
      // Debugging logs
      console.log("Vehicle Owner ID:", vehicle.owner?.toString());
      console.log("Logged-in User ID:", req.user?._id?.toString());
  
      // Admin path
      if (isAdmin) {
        if (vehicle.pendingUpdate && vehicle.updateApprovalStatus === 'Pending') {
          Object.assign(vehicle, vehicle.pendingUpdate);
          vehicle.pendingUpdate = null;
          vehicle.updateApprovalStatus = 'Approved';
          await vehicle.save();
          return res.json({ message: 'Owner’s update approved and applied.' });
        }
        Object.assign(vehicle, req.body);
        vehicle.pendingUpdate = null;
        vehicle.updateApprovalStatus = null;
        await vehicle.save();
        return res.json({ message: 'Vehicle updated successfully by admin.' });
      }
  
      // Customer path (must also be the owner)
      if (isCustomer) {
        if (vehicle.owner.toString() !== req.user._id.toString()) {
          return res.status(403).json({ message: 'You can only request updates to your own vehicle' });
        }
        vehicle.pendingUpdate = req.body;
        vehicle.updateApprovalStatus = 'Pending';
        await vehicle.save();
        return res.json({ message: 'Update request submitted. Awaiting admin approval.' });
      }
  
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Failed to update vehicle.' });
    }
  }
  


/*
// Read - Get all vehicles
export async function getVehicles(req, res) {

    try{

        if(isItAdmin(req)) {
            const vehicles = await Vehicle.find();
            res.json(vehicles);
            return;
        } else {
            const vehicles = await Vehicle.find({availabilityStatus: "Available"});
            res.json(vehicles);
            return;
        }
    } catch(error) {
        res.status(500).json({
            message: "Failed to retrieve vehicles",
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
        if(isItAdmin(req)) {

            const id = req.params.id;
            const data = req.body;
            
            await Vehicle.updateOne ( { _id: id }, data );
            
            res.json({
                message: "Vehicle updated successfully"
            });
     
        } else {
            res.status(403).json({
                message: "You are not authorized to perform this action"
            })
            return;
        }

    } catch (error) {
        res.status(500).json({
            message: "Failed to update vehicle",
            error: error.message
        });
    }   

}


// Delete - Delete vehicle information by ID
export async function deleteVehicle(req, res) {

    try {
        if(isItAdmin(req)) {

            const id = req.params.id;
            
            await Vehicle.deleteOne ( { _id: id } );
            
            res.json({
                message: "Vehicle deleted successfully"
            });
     
        } else {
            res.status(403).json({
                message: "You are not authorized to perform this action"
            })
            return;
        }

    } catch (error) {
        res.status(500).json({
            message: "Failed to delete vehicle",
            error: error.message
        });
    }   

} */

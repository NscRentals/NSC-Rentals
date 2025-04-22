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

        if(isItAdmin(req)) {

            newVehicle.ownerType = "Company";  
            newVehicle.approvalStatus = "Approved"; // company vehicles auto-approved
            newVehicle.owner = req.user._id; // Assuming the owner is the logged-in user
 
        } else {

            // Customer (user) adding a peer-to-peer vehicle    
            newVehicle.ownerType = "User";  
            newVehicle.approvalStatus = "Pending"; // Needs admin approval
            newVehicle.owner = req.user._id; // Assuming the owner is the logged-in user
        }

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
            error: error.message
        });
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
  
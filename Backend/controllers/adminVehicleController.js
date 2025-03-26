import Vehicle from "../models/adminVehicle.js";
import { isItAdmin } from "./userController.js";


export async function addVehicle (req, res) {

   if(req.user == null){
        res.status(401).json({
          message : "Please login and try again"
        })
        return
    }
    if(req.user.type !="admin"){
        res.status(403).json({
          message : "You are not authorized to perform this action"
        })
        return
    } 

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

}

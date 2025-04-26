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
            //error: error.message
        });
    }
}

// 2. Update a vehicle (Admin applies or approves customer update requests)
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

      // Admin path
      if (isAdmin) {
        if (vehicle.pendingUpdate && vehicle.updateApprovalStatus === 'Pending') {
          Object.assign(vehicle, vehicle.pendingUpdate);
          vehicle.pendingUpdate = null;
          vehicle.updateApprovalStatus = 'Approved';
          await vehicle.save();
          return res.json({ message: "Owner's update approved and applied." });
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
  

// 3) Delete a vehicle (Admin or owner-with-reason)
export async function deleteVehicle(req, res) {
    try {
        const vehicleId = req.params.id;
        const vehicle = await Vehicle.findById(vehicleId).populate('owner', 'firstName lastName email');

        if (!vehicle) {
            return res.status(404).json({ message: 'Vehicle not found' });
        }

        // Check if user exists and has type property
        if (!req.user || !req.user.type) {
            return res.status(403).json({ 
                message: 'You must be an admin or registered customer to perform this action',
                userType: null,
                isAdmin: false,
                isCustomer: false
            });
        }

        // Case insensitive check for admin and customer
        const isAdmin = req.user.type.toLowerCase() === 'admin';
        const isCustomer = req.user.type.toLowerCase() === 'customer';

        // Check if user is authorized (must be either admin or customer)
        if (!isAdmin && !isCustomer) {
            return res.status(403).json({ 
                message: 'You must be an admin or registered customer to perform this action',
                userType: req.user?.type,
                isAdmin: isAdmin,
                isCustomer: isCustomer
            });
        }

        // Admin path - can delete any vehicle
        if (isAdmin) {
            // Actually delete the vehicle from database
            await Vehicle.findByIdAndDelete(vehicleId);
            
            return res.json({ 
                message: 'Vehicle permanently deleted by admin',
                deletionDetails: {
                    vehicle: `${vehicle.make} ${vehicle.model} (${vehicle.registrationNumber})`,
                    owner: `${vehicle.owner.firstName} ${vehicle.owner.lastName}`,
                    timestamp: new Date()
                }
            });
        }

        // Customer path - can delete their own vehicles
        if (isCustomer) {
            // Check if the vehicle belongs to the user
            if (vehicle.owner._id.toString() !== req.user._id.toString()) {
                return res.status(403).json({ message: 'You can only delete your own vehicles' });
            }

            // Check if deletion reason is provided
            if (!req.body.reason) {
                return res.status(400).json({ message: 'Please provide a reason for deletion' });
            }

            // Store deletion notification for admin before deleting
            const deletionNotification = {
                vehicleInfo: {
                    make: vehicle.make,
                    model: vehicle.model,
                    year: vehicle.year,
                    registrationNumber: vehicle.registrationNumber
                },
                ownerInfo: {
                    name: `${vehicle.owner.firstName} ${vehicle.owner.lastName}`,
                    email: vehicle.owner.email
                },
                reason: req.body.reason,
                deletedAt: new Date()
            };

            // Log notification for admin
            console.log('Vehicle Deletion Notification for Admin:', deletionNotification);

            // Actually delete the vehicle from database
            await Vehicle.findByIdAndDelete(vehicleId);

            return res.json({ 
                message: 'Vehicle permanently deleted',
                deletionDetails: {
                    vehicle: `${vehicle.make} ${vehicle.model} (${vehicle.registrationNumber})`,
                    reason: req.body.reason,
                    timestamp: new Date()
                }
            });
        }

    } catch (error) {
        console.error('Delete vehicle error:', error);
        return res.status(500).json({ message: 'Failed to delete vehicle' });
    }
}

// Get deleted vehicles history (Admin only)
export async function getDeletedVehicles(req, res) {
    try {
        if (!isItAdmin(req)) {
            return res.status(403).json({ message: 'Only admins can view deleted vehicles history' });
        }

        const deletedVehicles = await Vehicle.find({
            isDeleted: true
        }).populate('owner', 'firstName lastName email');

        const formattedDeletedVehicles = deletedVehicles.map(vehicle => ({
            vehicleInfo: {
                make: vehicle.make,
                model: vehicle.model,
                year: vehicle.year,
                registrationNumber: vehicle.registrationNumber
            },
            ownerInfo: {
                name: `${vehicle.owner.firstName} ${vehicle.owner.lastName}`,
                email: vehicle.owner.email
            },
            deletionReason: vehicle.deletionRequest?.reason || 'No reason provided',
            deletedAt: vehicle.deletionRequest?.requestedAt || vehicle.updatedAt
        }));

        return res.json({
            message: 'Deleted vehicles history retrieved successfully',
            deletedVehicles: formattedDeletedVehicles
        });
    } catch (error) {
        console.error('Get deleted vehicles error:', error);
        return res.status(500).json({ message: 'Failed to retrieve deleted vehicles history' });
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
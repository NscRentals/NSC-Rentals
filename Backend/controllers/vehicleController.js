import Vehicle from "../models/Vehicle.js";
import { isItAdmin, isItCustomer } from "./userController.js";

// 1. Add a new vehicle (by Admin or User)
export async function addVehicle (req, res) {

    try {     
        // Custom admin check to handle case sensitivity
        const isAdmin = req.user && (req.user.type.toLowerCase() === "admin");
        
        // If images were uploaded, include their paths:
        /*if (req.files && req.files.length > 0) {
            vehicleData.images = req.files.map(file => `/uploads/${file.filename}`);
        } */

        const data = req.body;
        const newVehicle = new Vehicle(data);

        // Set ownership and approval status
        if(isAdmin) {
            newVehicle.ownerType = "Company";  
            newVehicle.approvalStatus = "Approved"; // company vehicles auto-approved
            newVehicle.availabilityStatus = "Available"; // company vehicles are immediately available
        } else {
            // Customer (user) adding a peer-to-peer vehicle    
            newVehicle.ownerType = "User";  
            newVehicle.approvalStatus = "Pending"; // Needs admin approval
            newVehicle.availabilityStatus = "Pending"; // Set availability to pending
        }

        newVehicle.owner = req.user._id; // Set the owner to the logged-in user

        await newVehicle.save();
        
        if(isAdmin) {
            res.json({
                message: "Vehicle added successfully",
            });
        } else {
            res.json({
                message: "Vehicle added successfully. Pending admin approval.",
                status: "Pending",
                details: "Your vehicle will be visible to other users once approved by an administrator."
            });
        }

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




// Get all pending vehicles (Admin only)
export async function getPendingVehicles(req, res) {
    try {
        const isAdmin = req.user && (req.user.type.toLowerCase() === "admin");
        if (!isAdmin) {
            return res.status(403).json({ 
                message: 'Only administrators can view pending vehicles'
            });
        }

        const pendingVehicles = await Vehicle.find({
            approvalStatus: 'Pending',
            availabilityStatus: 'Pending'
        }).populate('owner', 'firstName lastName email phone');

        return res.status(200).json({
            message: 'Pending vehicles retrieved successfully',
            count: pendingVehicles.length,
            vehicles: pendingVehicles.map(vehicle => ({
                id: vehicle._id,
                make: vehicle.make,
                model: vehicle.model,
                year: vehicle.year,
                registrationNumber: vehicle.registrationNumber,
                owner: {
                    name: `${vehicle.owner.firstName} ${vehicle.owner.lastName}`,
                    email: vehicle.owner.email,
                    phone: vehicle.owner.phone
                },
                addedAt: vehicle.createdAt
            }))
        });

    } catch (error) {
        console.error('Error retrieving pending vehicles:', error);
        return res.status(500).json({ 
            message: 'Failed to retrieve pending vehicles',
            error: error.message 
        });
    }
}

// Approve or reject a vehicle (Admin only)
export async function handleVehicleApproval(req, res) {
    try {
        const vehicleId = req.params.id;
        const { action, rejectionReason } = req.body; // 'approve' or 'reject' with optional reason
        const cleanAction = action?.toLowerCase().trim();
        
        // Check if user is admin
        const isAdmin = req.user && (req.user.type.toLowerCase() === "admin");
        if (!isAdmin) {
            return res.status(403).json({ 
                message: 'Only administrators can approve/reject vehicles'
            });
        }

        // Validate action
        if (!['approve', 'reject'].includes(cleanAction)) {
            return res.status(400).json({ 
                message: 'Invalid action. Must be either "approve" or "reject"'
            });
        }

        // If rejecting, require a reason
        if (cleanAction === 'reject' && !rejectionReason?.trim()) {
            return res.status(400).json({
                message: 'Rejection reason is required when rejecting a vehicle'
            });
        }

        // Find the vehicle
        const vehicle = await Vehicle.findById(vehicleId).populate('owner', 'firstName lastName email phone');
        if (!vehicle) {
            return res.status(404).json({ 
                message: 'Vehicle not found'
            });
        }

        // Check if vehicle is pending
        if (vehicle.approvalStatus !== 'Pending' || vehicle.availabilityStatus !== 'Pending') {
            return res.status(400).json({ 
                message: 'This vehicle is not pending approval',
                currentStatus: {
                    approvalStatus: vehicle.approvalStatus,
                    availabilityStatus: vehicle.availabilityStatus
                }
            });
        }

        if (cleanAction === 'approve') {
            // Approve the vehicle
            vehicle.approvalStatus = 'Approved';
            vehicle.availabilityStatus = 'Available';
            
            await vehicle.save();

            return res.status(200).json({
                message: 'Vehicle approved successfully',
                vehicle: {
                    id: vehicle._id,
                    make: vehicle.make,
                    model: vehicle.model,
                    registrationNumber: vehicle.registrationNumber,
                    owner: {
                        name: `${vehicle.owner.firstName} ${vehicle.owner.lastName}`,
                        email: vehicle.owner.email,
                        phone: vehicle.owner.phone
                    },
                    status: 'Approved'
                }
            });
        } else {
            // Reject the vehicle
            vehicle.approvalStatus = 'Rejected';
            vehicle.availabilityStatus = 'Not Available';
            vehicle.rejectionReason = rejectionReason.trim();
            
            await vehicle.save();

            return res.status(200).json({
                message: 'Vehicle rejected successfully',
                vehicle: {
                    id: vehicle._id,
                    make: vehicle.make,
                    model: vehicle.model,
                    registrationNumber: vehicle.registrationNumber,
                    owner: {
                        name: `${vehicle.owner.firstName} ${vehicle.owner.lastName}`,
                        email: vehicle.owner.email,
                        phone: vehicle.owner.phone
                    },
                    status: 'Rejected',
                    rejectionReason: vehicle.rejectionReason
                }
            });
        }

    } catch (error) {
        console.error('Error handling vehicle approval:', error);
        return res.status(500).json({ 
            message: 'Failed to process vehicle approval',
            error: error.message 
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
        // Check if this is an approval/rejection action
        if (req.body.action) {
          const { action, rejectionReason } = req.body;

          // Validate action
          if (!['approve', 'reject'].includes(action)) {
            return res.status(400).json({ 
              message: 'Invalid action. Must be either "approve" or "reject"' 
            });
          }

          // Handle pending update approval/rejection
          if (vehicle.pendingUpdate && vehicle.approvalStatus === 'Pending') {
            if (action === 'approve') {
              // Apply the pending updates
              Object.assign(vehicle, vehicle.pendingUpdate);
              vehicle.pendingUpdate = null;
              vehicle.approvalStatus = 'Approved';
              await vehicle.save();
              return res.json({ 
                message: "Vehicle update approved and applied successfully",
                vehicle: vehicle
              });
            } 
            
            if (action === 'reject') {
              if (!rejectionReason) {
                return res.status(400).json({ 
                  message: 'Rejection reason is required' 
                });
              }
              // Just update status and add rejection reason - don't apply pending updates
              vehicle.rejectionReason = rejectionReason;
              vehicle.approvalStatus = 'Rejected';
              vehicle.pendingUpdate = null;
              await vehicle.save();
              return res.json({ 
                message: "Vehicle update rejected",
                rejectionReason: rejectionReason
              });
            }
          } else {
            return res.status(400).json({ 
              message: 'No pending updates found for this vehicle' 
            });
          }
        }

        // Regular admin update (not approval/rejection)
        Object.assign(vehicle, req.body);
        vehicle.pendingUpdate = null;
        vehicle.approvalStatus = 'Approved';
        await vehicle.save();
        return res.json({ message: 'Vehicle updated successfully by admin.' });
      }
  
      // Customer path (must also be the owner)
      if (isCustomer) {
        if (vehicle.owner.toString() !== req.user._id.toString()) {
          return res.status(403).json({ message: 'You can only request updates to your own vehicle' });
        }
        // Store the entire update request
        vehicle.pendingUpdate = {
            ...req.body,
            updatedAt: new Date()
        };
        vehicle.approvalStatus = 'Pending';
        await vehicle.save();
        return res.json({ 
          message: 'Update request submitted. Awaiting admin approval.',
          status: 'Pending'
        });
      }
  
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Failed to update vehicle.' });
    }
}
  
export async function approvePendingVehicleUpdate(req, res) {
    try {
        const vehicle = await Vehicle.findById(req.params.id);
        const isAdmin = req.user && (req.user.type.toLowerCase() === "admin");
        
        if (!isAdmin) {
            return res.status(403).json({ message: 'Admins only' });
        }
        
        if (!vehicle) {
            return res.status(404).json({ message: 'Vehicle not found' });
        }

        const { action, rejectionReason } = req.body;
        if (!['approve','reject'].includes(action)) {
            return res.status(400).json({ message: 'Must be approve or reject' });
        }

        if (action === 'approve') {
            // Apply pending updates if they exist
            if (vehicle.pendingUpdate) {
                Object.assign(vehicle, vehicle.pendingUpdate);
            }
            vehicle.approvalStatus = 'Approved';
            vehicle.availabilityStatus = 'Available';
            vehicle.pendingUpdate = null;
            vehicle.rejectionReason = null;
        } else {
            if (!rejectionReason) {
                return res.status(400).json({ message: 'Rejection reason required' });
            }
            vehicle.rejectionReason = rejectionReason;
            vehicle.approvalStatus = 'Rejected';
            vehicle.availabilityStatus = 'Not Available';
            vehicle.pendingUpdate = null;
        }

        await vehicle.save();

        // Log the update for debugging
        console.log('Vehicle update processed:', {
            id: vehicle._id,
            action,
            approvalStatus: vehicle.approvalStatus,
            availabilityStatus: vehicle.availabilityStatus
        });

        return res.status(200).json({
            message: `Vehicle update ${action}d successfully`,
            vehicle: {
                id: vehicle._id,
                make: vehicle.make,
                model: vehicle.model,
                approvalStatus: vehicle.approvalStatus,
                availabilityStatus: vehicle.availabilityStatus,
                rejectionReason: vehicle.rejectionReason
            }
        });
    } catch (error) {
        console.error('Error approving vehicle update:', error);
        return res.status(500).json({ 
            message: 'Failed to process vehicle update approval',
            error: error.message 
        });
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


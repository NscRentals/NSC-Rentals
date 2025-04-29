import Vehicle from "../models/Vehicle.js";
import { isItAdmin, isItCustomer } from "./userController.js";

// 1. Add a new vehicle (by Admin or User)
export async function addVehicle (req, res) {
    try {     
        let data = req.body;
        
        // Parse the pricing JSON string back to an object
        if (typeof data.pricing === 'string') {
            data.pricing = JSON.parse(data.pricing);
        }
        
        // Add the file paths to the vehicle data
        if (req.files) {
            data.vehicleImages = req.files.map(file => file.filename);
        }

        const newVehicle = new Vehicle(data);

        // Set ownership and approval status
        if(isItAdmin(req)) {
            newVehicle.ownerType = "Company";  
            newVehicle.approvalStatus = "Approved"; // company vehicles auto-approved
            newVehicle.availabilityStatus = "Available"; // company vehicles are immediately available
        } else {        // Customer (user) adding a peer-to-peer vehicle    
            newVehicle.ownerType = "User";  
            newVehicle.approvalStatus = "Pending"; // Needs admin approval
            newVehicle.availabilityStatus = "Pending"; // Set availability to pending
        }

        // Set the owner to the logged-in user - using id from token
        newVehicle.owner = req.user.id;

        console.log('Setting vehicle owner:', {
            userId: req.user.id,
            userType: req.user.type,
            vehicleOwner: newVehicle.owner
        });

        await newVehicle.save();
        
        if(isItAdmin(req)) {
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
        // Verify admin access
        if (!isItAdmin(req)) {
            return res.status(403).json({ 
                message: 'Only administrators can view pending vehicles'
            });
        }

        // Find vehicles with pending approval status
        const pendingVehicles = await Vehicle.find({
            approvalStatus: 'Pending'
        }).populate({
            path: 'owner',
            select: 'firstName lastName email phone'
        });

        // Return empty array if no vehicles found
        if (!pendingVehicles || pendingVehicles.length === 0) {
            return res.status(200).json({
                message: 'No pending vehicles found',
                count: 0,
                vehicles: []
            });
        }

        // Map vehicle data for response with all relevant fields
        const formattedVehicles = pendingVehicles.map(vehicle => ({
            id: vehicle._id,
            make: vehicle.make,
            model: vehicle.model,
            year: vehicle.year,
            registrationNumber: vehicle.registrationNumber,
            chassisNumber: vehicle.chassisNumber,
            engineNumber: vehicle.engineNumber,
            engineCapacity: vehicle.engineCapacity,
            transmissionType: vehicle.transmissionType,
            fuelType: vehicle.fuelType,
            color: vehicle.color,
            seatingCapacity: vehicle.seatingCapacity,
            numberOfDoors: vehicle.numberOfDoors,
            description: vehicle.description,
            location: {
                district: vehicle.district,
                city: vehicle.city,
                address: vehicle.address
            },
            rental: {
                minPeriod: vehicle.minRentalPeriod,
                maxPeriod: vehicle.maxRentalPeriod,
                rentMode: vehicle.rentMode
            },
            pricing: vehicle.pricing,            status: {
                availability: vehicle.availabilityStatus,
                approval: vehicle.approvalStatus
            },
            images: vehicle.vehicleImages,
            ownerType: vehicle.ownerType,
            pendingUpdate: vehicle.pendingUpdate,
            pendingUpdateData: vehicle.pendingUpdateData,
            owner: vehicle.owner ? {
                name: `${vehicle.owner.firstName} ${vehicle.owner.lastName}`,
                email: vehicle.owner.email,
                phone: vehicle.owner.phone
            } : null,
            dates: {
                created: vehicle.createdAt,
                updated: vehicle.updatedAt
            }
        }));

        return res.status(200).json({
            message: 'Pending vehicles retrieved successfully',
            count: formattedVehicles.length,
            vehicles: formattedVehicles
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
        if (!isItAdmin(req)) {
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

        // Find the vehicle and populate owner field
        const vehicle = await Vehicle.findById(vehicleId);        if (!vehicle) {
            return res.status(404).json({ 
                message: 'Vehicle not found'
            });
        }

        // Populate owner information
        await vehicle.populate('owner', 'firstName lastName email phone');

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
                    owner: vehicle.owner ? {
                        name: `${vehicle.owner.firstName} ${vehicle.owner.lastName}`,
                        email: vehicle.owner.email,
                        phone: vehicle.owner.phone
                    } : null,
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
                    owner: vehicle.owner ? {
                        name: `${vehicle.owner.firstName} ${vehicle.owner.lastName}`,
                        email: vehicle.owner.email,
                        phone: vehicle.owner.phone
                    } : null,
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
      
      console.log("Raw vehicle from DB:", vehicle);
  
      const isAdmin = isItAdmin(req);
      const isCustomer = isItCustomer(req);
  
      // only admins or customers are allowed at all
      if (!isAdmin && !isCustomer) {
        return res.status(403).json({ message: 'You are not authorized to update this vehicle' });
      }

      // Admin path
      if (isAdmin) {
        // Regular admin update (not approval/rejection)
        let data = req.body;
        
        // Parse the pricing JSON string back to an object
        if (typeof data.pricing === 'string') {
            data.pricing = JSON.parse(data.pricing);
        }
        
        // Handle image updates if new files are uploaded
        if (req.files && req.files.length > 0) {
            data.vehicleImages = req.files.map(file => file.filename);
        }
        
        Object.assign(vehicle, data);
        vehicle.pendingUpdate = false;
        vehicle.approvalStatus = 'Approved';
        await vehicle.save();
        return res.json({ message: 'Vehicle updated successfully by admin.' });      
      }      // Customer path
      if (isCustomer) {
        // Debug logging
        console.log('Request User:', req.user);
        
        const userId = req.user.id;
        console.log('Comparing IDs - Vehicle owner:', vehicle.owner, 'User:', userId);
        
        // If owner is missing, assume the logged-in user is the owner for now
        // This is a temporary fix for vehicles created without owner field
        if (!vehicle.owner) {
          console.log('No owner field found, assigning current user as owner');
          vehicle.owner = userId;
          vehicle.ownerType = 'User';
          await vehicle.save();
        }
        
        if (vehicle.owner.toString() !== userId) {
          console.log('ID mismatch - Owner:', vehicle.owner, 'User:', userId);
          return res.status(403).json({ 
            message: 'You can only request updates to your own vehicle'
          });
        }
        
        // Store the update request and mark as pending
        let data = req.body;
        
        // Parse the pricing JSON string back to an object
        if (typeof data.pricing === 'string') {
            data.pricing = JSON.parse(data.pricing);
        }
        
        // Handle image updates if new files are uploaded
        if (req.files && req.files.length > 0) {
            data.vehicleImages = req.files.map(file => file.filename);
        }
        
        vehicle.pendingUpdateData = {
            ...data,
            updatedAt: new Date()
        };
        vehicle.pendingUpdate = true;
        vehicle.approvalStatus = 'Pending';        
        await vehicle.save();
        
        return res.json({ 
          message: 'Update request submitted. Awaiting admin approval.',
          status: 'Pending'
        });
      }
    } catch (error) {
      console.error('Update vehicle error:', error);
      return res.status(500).json({ message: 'Failed to update vehicle.' });
    }
}

export async function approvePendingVehicleUpdate(req, res) {
    const vehicle = await Vehicle.findById(req.params.id);
    if (!isItAdmin(req)) return res.status(403).json({ message: 'Admins only' });
    if (!vehicle?.pendingUpdate || vehicle.approvalStatus !== 'Pending') {
      return res.status(400).json({ message: 'No pending update' });
    }
  
    const { action, rejectionReason } = req.body;
    if (!['approve','reject'].includes(action)) {
      return res.status(400).json({ message: 'Must be approve or reject' });
    }
  
    if (action === 'approve') {
      Object.assign(vehicle, vehicle.pendingUpdate);
      vehicle.approvalStatus = 'Approved';
    } else {
      if (!rejectionReason) {
        return res.status(400).json({ message: 'Rejection reason required' });
      }
      vehicle.rejectionReason   = rejectionReason;
      vehicle.approvalStatus    = 'Rejected';
    }
  
    vehicle.pendingUpdate = null;
    await vehicle.save();
    return res.status(200).json({
      message: `Vehicle update ${action}d successfully`,
      vehicle
    });
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
            await Vehicle.findByIdAndDelete(vehicleId);
            return res.json({ 
                message: 'Vehicle deleted by admin',
                deletionDetails: {
                    vehicle: `${vehicle.make} ${vehicle.model} (${vehicle.registrationNumber})`,
                    owner: `${vehicle.owner.firstName} ${vehicle.owner.lastName}`,
                    timestamp: new Date()
                }
            });
        }

        // Customer path - can delete their own vehicles
        if (isCustomer) {
            // Check if vehicle has owner and if it belongs to the user
            if (!vehicle.owner || vehicle.owner._id.toString() !== req.user.id) {
                return res.status(403).json({ message: 'You can only delete your own vehicles' });
            }

            // Check if deletion reason is provided
            if (!req.body.reason) {
                return res.status(400).json({ message: 'Please provide a reason for deletion' });
            }

            // Store deletion notification for admin
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

            // Log notification for admin (you can store this in a separate collection if needed)
            console.log('Vehicle Deletion Notification for Admin:', deletionNotification);

            // Delete the vehicle
            await Vehicle.findByIdAndDelete(vehicleId);

            return res.json({ 
                message: 'Vehicle deleted',
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

// Read - Get all vehicles
export async function getVehicles(req, res) {    try{
        if(isItAdmin(req)) {
            const vehicles = await Vehicle.find({ isDeleted: { $ne: true } });
            res.json(vehicles);
            return;
        } else {
            const vehicles = await Vehicle.find({
                availabilityStatus: "Available",
                isDeleted: { $ne: true }
            });
            res.json(vehicles);
            return;
        }
    } catch(error) {
        res.status(500).json({
            message: "Failed to retrieve vehicles",
        });
    }
}

// Get a single vehicle by ID
export async function getVehicleById(req, res) {
    try {
        const vehicle = await Vehicle.findById(req.params.id).populate('owner', 'firstName lastName email phone');
        
        if (!vehicle) {
            return res.status(404).json({ message: 'Vehicle not found' });
        }

        // If the user is not an admin and the vehicle is not available, only the owner should see it
        if (!isItAdmin(req) && vehicle.availabilityStatus !== 'Available') {
            if (!vehicle.owner || vehicle.owner._id.toString() !== req.user._id.toString()) {
                return res.status(403).json({ message: 'You are not authorized to view this vehicle' });
            }
        }

        res.json(vehicle);
    } catch (error) {
        console.error('Error fetching vehicle:', error);
        res.status(500).json({ message: 'Failed to fetch vehicle details' });
    }
}

// Get all vehicles belonging to a user
export async function getUserVehicles(req, res) {
    try {
        // Extract user ID from the authenticated user
        const userId = req.user.id;
        
        console.log('Fetching vehicles for user:', userId);

        // Find all vehicles owned by this user
        const vehicles = await Vehicle.find({ owner: userId }).sort({ createdAt: -1 });

        console.log('Found vehicles:', vehicles.length);
        
        res.json(vehicles);
    } catch (error) {
        console.error('Error fetching user vehicles:', error);
        res.status(500).json({
            message: "Failed to retrieve user's vehicles",
            error: error.message
        });
    }
}

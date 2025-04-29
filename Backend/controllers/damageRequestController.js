import damageRequest from '../models/damageRequest.js';
import { isItCustomer, isItAdmin } from './userController.js';
import User from '../models/user.js';
import Vehicle from '../models/Vehicle.js';
import sparePartsInventory from '../models/sparePartsInventory.js';

// Submit a new damage request (Customer only)
export async function addDamageRequest(req, res) {
  if (!isItCustomer(req)) {
    return res.status(403).json({
      message: 'Only customers can report damage.'
    });
  }

  try {
    const { vehicleId, description, attachments } = req.body;
    
    // Make sure we have the user ID from the token
    if (!req.user || !req.user.id) {
      return res.status(401).json({
        message: 'User not authenticated'
      });
    }
    
    // Check if vehicle exists
    const vehicle = await Vehicle.findById(vehicleId);
    if (!vehicle) {
      return res.status(404).json({
        message: 'Vehicle not found'
      });
    }

    // Create new damage request
    const dr = new damageRequest({
      vehicle: vehicleId,
      description,
      attachments: attachments || [], // Default to empty array if no attachments
      reportedBy: req.user.id, // Using userId from token
      status: 'Pending',
      requestSubmittedDate: new Date()
    });

    await dr.save();
    res.status(201).json(dr);
  } catch (err) {
    res.status(500).json({
      message: 'Failed to create damage request', 
      error: err.message
    });
  }
}

// Get user's damage requests (Customer only)
export async function getUserDamageRequests(req, res) {
  if (!isItCustomer(req)) {
    return res.status(403).json({
      message: 'Only customers can view their damage requests.'
    });
  }

  try {
    const requests = await damageRequest.find({ reportedBy: req.user.id })
      .populate('vehicle', 'make model registrationNumber')
      .populate('technicianId', 'firstName lastName email')
      .sort('-createdAt');

    res.json(requests);
  } catch (err) {
    res.status(500).json({
      message: 'Failed to fetch damage requests',
      error: err.message
    });
  }
}

//View all damage requests (For technicians)
export async function getAllDamageRequests(req, res) {
  const userType = req.user?.type?.toLowerCase();
  if (userType !== 'technician') {
    return res.status(403).json({
      message: 'Only technicians can view damage requests.' 
    });
  }
  
  try {
    const requests = await damageRequest.find({
      $or: [
        { technicianId: null },  // Unassigned tasks
        { technicianId: req.user.id }  // Tasks assigned to this technician
      ]
    })
    .populate({
      path: 'vehicle',
      model: 'Vehicle',
      select: 'make model registrationNumber availabilityStatus'
    })
    .populate({
      path: 'reportedBy',
      model: 'User',
      select: 'firstName lastName email'
    })
    .populate({
      path: 'technicianId',
      model: 'User',
      select: 'firstName lastName email'
    })
    .sort('-createdAt');
    
    res.json(requests);
  } catch (err) {
    res.status(500).json({
      message: 'Failed to fetch damage requests',
      error: err.message
    });
  }
}

// Delete damage request (Customer or Admin only)
export async function deleteDamageRequest(req, res) {
  if (!isItCustomer(req) && !isItAdmin(req)) {
    return res.status(403).json({
      message: 'Only customers or admins can delete damage requests.'
    });
  }

  try {
    const dr = await damageRequest.findById(req.params.id);
    if (!dr) {
      return res.status(404).json({
        message: 'Damage request not found.'
      });
    }

    // Check if user is the one who reported the damage (unless they're an admin)
    if (!isItAdmin(req) && dr.reportedBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        message: 'You can only delete your own damage requests.'
      });
    }

    // Only allow deletion if status is Pending
    if (dr.status !== 'Pending') {
      return res.status(400).json({
        message: 'Can only delete pending damage requests.'
      });
    }

    await damageRequest.findByIdAndDelete(req.params.id);
    res.json({ message: 'Damage request deleted successfully.' });
  } catch (err) {
    res.status(500).json({
      message: 'Failed to delete damage request',
      error: err.message
    });
  }
}

//Technician accepts a request (sets status = In Progress + assignedTo = self)
export async function acceptDamageRequest(req, res) {
  const userType = req.user?.type?.toLowerCase();
  if (userType !== 'technician') {
    return res.status(403).json({
      message: 'Only technicians can accept requests.'
    });
  }
  try {
    const dr = await damageRequest.findById(req.params.id)
      .populate('vehicle');

    if (!dr) return res.status(404).json({
      message: 'Request not found.'
    });

    // If no technician is assigned, assign current user
    if (!dr.technicianId) {
      console.log('No technician assigned, assigning current technician');
      dr.technicianId = req.user.id;
    } else if (dr.technicianId.toString() !== req.user.id.toString()) {
      return res.status(400).json({
        message: 'This request is already assigned to another technician.'
      });
    }

    dr.status = 'In Progress';

    // Update vehicle status
    const vehicle = dr.vehicle;
    vehicle.availabilityStatus = 'Under Maintenance';
    await vehicle.save();

    await dr.save();
    res.json(dr);
  } catch (err) {
    res.status(500).json({
      message: 'Failed to accept request', 
      error: err.message
    });
  }
}

//Assign a request to a specific technician (Admin only)
export async function assignDamageRequest(req, res) {
  const { technicianId } = req.body;
  if (!isItAdmin(req)) {
    return res.status(403).json({
      message: 'Only admins can assign requests to technicians.'
    });
  }
  try {
    const dr = await damageRequest.findById(req.params.id)
      .populate('vehicle');
    if (!dr) return res.status(404).json({
      message: 'Request not found.'
    });

    // Check if request is already assigned
    if (dr.technicianId) {
      return res.status(400).json({
        message: 'This request is already assigned to a technician.'
      });
    }

    dr.status = 'Assigned';
    dr.technicianId = technicianId;

    // Update vehicle status
    const vehicle = dr.vehicle;
    vehicle.availabilityStatus = 'Under Maintenance';
    await vehicle.save();

    await dr.save();
    res.json(dr);
  } catch (err) {
    res.status(500).json({
      message: 'Failed to assign request', 
      error: err.message
    });
  }
}

//Schedule a damage request (For technicians)
export async function scheduleDamageRequest(req, res) {
  const userType = req.user?.type?.toLowerCase();
  if (userType !== 'technician') {
    return res.status(403).json({
      message: 'Only technicians can schedule requests.'
    });
  }
  
  try {
    const { scheduledDate, scheduledTimeSlot, estimatedDuration } = req.body;
    const dr = await damageRequest.findById(req.params.id);
    
    if (!dr) {
      return res.status(404).json({
        message: 'Request not found.'
      });
    }
    
    // If there's no technician assigned or if it's the same technician
    if (!dr.technicianId) {
      dr.technicianId = req.user._id;
    } else if (dr.technicianId.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        message: 'You can only schedule requests assigned to you.'
      });
    }
    
    dr.scheduledDate = scheduledDate;
    dr.scheduledTimeSlot = scheduledTimeSlot;
    dr.estimatedDuration = Number(estimatedDuration);
    dr.status = 'In Progress';
    await dr.save();
    
    res.json(dr);
  } catch (err) {
    res.status(500).json({
      message: 'Failed to schedule request',
      error: err.message
    });
  }
}

// Get technician's assigned requests
export async function getAssignedRequests(req, res) {
  const userType = req.user?.type?.toLowerCase();
  if (userType !== 'technician') {
    return res.status(403).json({
      message: 'Only technicians can view assigned requests.'
    });
  }

  try {
    const requests = await damageRequest.find({
      technicianId: req.user.id,
      status: { $in: ['Accepted', 'In Progress'] }
    })
    .populate('vehicle', 'make model registrationNumber')
    .populate('reportedBy', 'firstName lastName email')
    .sort('-createdAt');

    res.json(requests);
  } catch (err) {
    res.status(500).json({
      message: 'Failed to fetch assigned requests',
      error: err.message
    });
  }
}

// Get technician's completed requests
export async function getCompletedRequests(req, res) {
  const userType = req.user?.type?.toLowerCase();
  if (userType !== 'technician') {
    return res.status(403).json({
      message: 'Only technicians can view completed requests.'
    });
  }

  try {
    const requests = await damageRequest.find({
      technicianId: req.user.id,
      status: 'Completed'
    })
    .populate('vehicle', 'make model registrationNumber')
    .populate('reportedBy', 'firstName lastName email')
    .populate({
      path: 'usedParts.partId',
      model: 'sparePartsInventory',
      select: 'name price'
    })
    .sort('-completedAt');

    res.json(requests);
  } catch (err) {
    res.status(500).json({
      message: 'Failed to fetch completed requests',
      error: err.message
    });
  }
}

export async function updateRepairStatus(req, res) {
  // Only technicians can update repair status
  const userType = req.user?.type?.toLowerCase();
  if (userType !== 'technician') {
    return res.status(403).json({ message: 'Only technicians can update repair status.' });
  }

  try {
    const { status, usedParts, repairNotes, totalCost } = req.body;
    const dr = await damageRequest
      .findById(req.params.id)
      .populate('vehicle');

    if (!dr) {
      return res.status(404).json({ message: 'Damage request not found.' });
    }

    // If no technician is assigned, assign current user
    if (!dr.technicianId) {
      console.log('No technician assigned, assigning current technician');
      dr.technicianId = req.user.id;
    } else if (dr.technicianId.toString() !== req.user.id.toString()) {
      return res.status(400).json({ message: 'This request is already assigned to another technician.' });
    }

    // Update the repair request
    dr.status = status;
    
    if (status === 'Completed') {
      dr.completedAt = new Date();
      dr.repairNotes = repairNotes;
      dr.totalCost = totalCost;
      dr.usedParts = usedParts;

      // Update spare parts inventory
      for (const part of usedParts) {
        const sparePart = await sparePartsInventory.findById(part.partId);
        if (!sparePart) {
          return res.status(404).json({ message: `Spare part ${part.partId} not found.` });
        }

        if (sparePart.quantity < part.quantity) {
          return res.status(400).json({ 
            message: `Insufficient quantity for part ${sparePart.name}. Available: ${sparePart.quantity}` 
          });
        }

        // Reduce the quantity in inventory
        sparePart.quantity -= part.quantity;
        await sparePart.save();
      }

      // Update vehicle status back to Available
      const vehicle = dr.vehicle;
      vehicle.availabilityStatus = 'Available';
      await vehicle.save();
    }

    await dr.save();

    // Return the complete damage request for report generation
    res.json(dr);
  } catch (err) {
    res.status(500).json({
      message: 'Failed to update repair status',
      error: err.message
    });
  }
}

// Upload damage images
export async function uploadDamageImages(req, res) {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({
        message: 'No files were uploaded.'
      });
    }

    // Generate URLs for the uploaded files
    const urls = req.files.map(file => `/uploads/damage/${file.filename}`);

    res.status(200).json({
      message: 'Files uploaded successfully',
      urls: urls
    });
  } catch (err) {
    res.status(500).json({
      message: 'Failed to upload files',
      error: err.message
    });
  }
}

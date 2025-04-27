import damageRequest from '../models/damageRequest.js';
import { isItCustomer, isItDriver, isItTechnician } from './userController.js';
import User from '../models/user.js';
import Vehicle from '../models/Vehicle.js';

// Submit a new damage request (Customer or Driver)
export async function addDamageRequest(req, res) {
  // Check user type case-insensitively
  const userType = req.user?.type?.toLowerCase();
  if (userType !== 'customer' && userType !== 'driver') {
    return res.status(403).json({
      message: 'Only customers or drivers can report damage.'
    });
  }

  try {
    // First find the user by email to get their _id
    const user = await User.findOne({ email: req.user.email });
    if (!user) {
      return res.status(404).json({
        message: 'User not found'
      });
    }

    const { vehicle, description, attachments } = req.body;
    const dr = new damageRequest({
      vehicle,
      description,
      attachments,
      reportedBy: user._id,
      status: 'Pending'
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

//View all damage requests (Technician only)
export async function getAllDamageRequests(req, res) {
  if (!isItTechnician(req)) {
    return res.status(403).json({
      message: 'Only technicians can view damage requests.' 
    });
  }
  
  try {
    const requests = await damageRequest.find({
      $or: [
        { assignedTo: null },  // Unassigned tasks
        { assignedTo: req.user._id }  // Tasks assigned to this technician
      ]
    })
    .populate('vehicle', 'make model registrationNumber')
    .populate('reportedBy', 'firstName lastName email')
    .populate('assignedTo', 'firstName lastName');
    
    res.json(requests);
  } catch (err) {
    res.status(500).json({
      message: 'Failed to fetch damage requests',
      error: err.message
    });
  }
}

//Technician accepts a request (sets status = In Progress + assignedTo = self)
export async function acceptDamageRequest(req, res) {
  if (!isItTechnician(req)) {
    return res.status(403).json({
      message: 'Only technicians can accept requests.'
    });
  }
  try {
    const dr = await damageRequest.findById(req.params.id);
    if (!dr) return res.status(404).json({
      message: 'Request not found.'
    });

    dr.status = 'In Progress';
    dr.assignedTo = req.user._id;
    await dr.save();
    res.json(dr);
  } catch (err) {
    res.status(500).json({
      message: 'Failed to accept request', 
      error: err.message
    });
  }
}

//Assign a request to a specific technician (Technician or Admin)
export async function assignDamageRequest(req, res) {
  const { technicianId } = req.body;
  const userType = req.user?.type?.toLowerCase();
  if (userType !== 'technician' && userType !== 'admin') {
    return res.status(403).json({
      message: 'Only technicians or admins can assign requests.'
    });
  }
  try {
    const dr = await damageRequest.findById(req.params.id);
    if (!dr) return res.status(404).json({
      message: 'Request not found.'
    });

    dr.status = 'Assigned';
    dr.assignedTo = technicianId;
    await dr.save();
    res.json(dr);
  } catch (err) {
    res.status(500).json({
      message: 'Failed to assign request', 
      error: err.message
    });
  }
}

//Schedule a damage request (Technician only)
export async function scheduleDamageRequest(req, res) {
  if (!isItTechnician(req)) {
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
    
    if (dr.assignedTo && dr.assignedTo.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        message: 'You can only schedule requests assigned to you.'
      });
    }
    
    dr.scheduledDate = scheduledDate;
    dr.scheduledTimeSlot = scheduledTimeSlot;
    dr.estimatedDuration = estimatedDuration;
    await dr.save();
    
    res.json(dr);
  } catch (err) {
    res.status(500).json({
      message: 'Failed to schedule request',
      error: err.message
    });
  }
}

export async function updateRepairStatus(req, res) {
  // 1) Only technicians may drive this endpoint
  if (!isItTechnician(req)) {
    return res.status(403).json({ message: 'Only technicians can update repair status.' });
  }

  try {
    const { status } = req.body;                  // e.g. "In Progress", "Waiting for Parts", or "Completed"
    const dr = await damageRequest
      .findById(req.params.id)
      .populate('vehicle');                       // load the Vehicle doc

    if (!dr) {
      return res.status(404).json({ message: 'Damage request not found.' });
    }

    // 2) Update the repair request’s status
    dr.status = status;
    await dr.save();

    // 3) Update the vehicle’s availabilityStatus
    const vehicle = dr.vehicle;
    vehicle.availabilityStatus =
      status === 'Completed'
        ? 'Available'
        : 'Under Maintenance';
    await vehicle.save();

    // 4) Return the updated damage request (with its vehicle ref)
    res.json(dr);
  } catch (err) {
    res.status(500).json({
      message: 'Failed to update repair status',
      error: err.message
    });
  }
}

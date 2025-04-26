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
  const requests = await damageRequest.find()
    .populate('vehicle', 'make model registrationNumber')
    .populate('reportedBy', 'firstName lastName email')
    .populate('assignedTo', 'firstName lastName');
  res.json(requests);
}

//Technician accepts a request (sets status = Accepted + assignedTo = self)
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

    dr.status = 'Accepted';
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

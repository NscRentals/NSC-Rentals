import express from 'express';
import { verifyToken } from '../middlewares/authMiddleware.js';
import damageUpload from '../middlewares/multerDamage.js';
import {
  addDamageRequest, 
  getAllDamageRequests,
  getUserDamageRequests,
  acceptDamageRequest, 
  assignDamageRequest,
  scheduleDamageRequest, 
  updateRepairStatus,
  deleteDamageRequest,
  uploadDamageImages,
  getAssignedRequests,
  getCompletedRequests
} from '../controllers/damageRequestController.js';

const damageRequestRouter = express.Router();

// All routes require a valid JWT
damageRequestRouter.use(verifyToken);

// Upload damage images
damageRequestRouter.post('/upload', damageUpload, uploadDamageImages);

// Create damage request (Customer/Driver)
damageRequestRouter.post('/', addDamageRequest);       

// Get user's damage requests (Customer/Driver)
damageRequestRouter.get('/my-requests', getUserDamageRequests);

// List all requests (Technician)
damageRequestRouter.get('/all', getAllDamageRequests);   

// Get technician's assigned requests
damageRequestRouter.get('/my-assigned', getAssignedRequests);

// Delete request (Customer/Driver/Admin)
damageRequestRouter.delete('/:id', deleteDamageRequest);

// Technician accept request
damageRequestRouter.patch('/:id/accept', acceptDamageRequest);    

// Assign request to technician (Tech/Admin)
damageRequestRouter.patch('/:id/assign', assignDamageRequest); 

// Schedule repair (Technician)
damageRequestRouter.patch('/:id/schedule', scheduleDamageRequest);

// Update repair status (Technician)
damageRequestRouter.patch('/:id/update-status', updateRepairStatus);

// Get technician's completed requests
damageRequestRouter.get('/my-completed', getCompletedRequests);

export default damageRequestRouter;

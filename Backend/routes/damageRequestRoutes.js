import express from 'express';
import { verifyToken } from '../middlewares/authMiddleware.js';
import {addDamageRequest, getAllDamageRequests, acceptDamageRequest, assignDamageRequest,scheduleDamageRequest, updateRepairStatus} from '../controllers/damageRequestController.js';

const damageRequestRouter = express.Router();

// All routes require a valid JWT
damageRequestRouter.use(verifyToken);

//create
damageRequestRouter.post('/', addDamageRequest);       

//List for techs
damageRequestRouter.get('/', getAllDamageRequests);   

//Technicians accept self
damageRequestRouter.patch('/:id/accept', acceptDamageRequest);    

//Tech/admin assign
damageRequestRouter.patch('/:id/assign', assignDamageRequest); 

//Schedule damage request
damageRequestRouter.patch('/:id/schedule', scheduleDamageRequest);

//Update repair status
damageRequestRouter.patch('/:id/updateRepairStatus', updateRepairStatus);

export default damageRequestRouter;

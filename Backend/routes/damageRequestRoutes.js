import express from 'express';
import { verifyToken } from '../middlewares/authMiddleware.js';
import {addDamageRequest, getAllDamageRequests, acceptDamageRequest, assignDamageRequest} from '../controllers/damageRequestController.js';

const router = express.Router();

// All routes require a valid JWT
router.use(verifyToken);

//create
router.post('/', addDamageRequest);       

//List for techs
router.get('/', getAllDamageRequests);   

//Technicians accept self
router.patch('/:id/accept', acceptDamageRequest);    

//Tech/admin assign
router.patch('/:id/assign', assignDamageRequest); 

export default router;

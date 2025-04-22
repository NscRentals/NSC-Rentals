
import express from 'express';
import { addVehicle } from '../controllers/vehicleController.js';

const vehicleRouter = express.Router();

vehicleRouter.post("/", addVehicle);


export default vehicleRouter;

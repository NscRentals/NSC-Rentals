import express from 'express';
import { addVehicle } from '../controllers/adminVehicle.controller.js';

const adminVehicleRouter = express.Router();

adminVehicleRouter.post("/", addVehicle);

export default adminVehicleRouter;
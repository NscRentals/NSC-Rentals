import express from 'express';
import { addVehicle, getVehicles, deleteVehicle, updateVehicle } from '../controllers/adminVehicle.controller.js';

const adminVehicleRouter = express.Router();

adminVehicleRouter.post("/", addVehicle);
adminVehicleRouter.get("/", getVehicles);
adminVehicleRouter.delete("/:id", deleteVehicle);
adminVehicleRouter.put("/:id", updateVehicle);

export default adminVehicleRouter;
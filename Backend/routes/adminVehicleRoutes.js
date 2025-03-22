
import express from 'express';
import { addVehicle, getVehicles, deleteVehicle, updateVehicle, getVehicle } from '../controllers/adminVehicleController.js';

const adminVehicleRouter = express.Router();

adminVehicleRouter.post("/", addVehicle);
adminVehicleRouter.get("/", getVehicles);
adminVehicleRouter.get("/:id", getVehicle);
adminVehicleRouter.delete("/:id", deleteVehicle);
adminVehicleRouter.put("/:id", updateVehicle);

export default adminVehicleRouter;

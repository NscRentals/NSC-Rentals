import express from "express";
import {
  addVehicle,
  updateVehicle,
  deleteVehicle,
  getDeletedVehicles,
  getVehicles,
  approvePendingVehicleUpdate,
} from "../controllers/vehicleController.js";

import { verifyToken } from "../middlewares/authMiddleware.js";

const vehicleRouter = express.Router();

// Protect all vehicle routes
vehicleRouter.use(verifyToken);

// Create a new vehicle (Admin or User)
vehicleRouter.post("/", addVehicle);

// Update a vehicle (Admin applies or approves customer update requests)
vehicleRouter.put("/:id", updateVehicle);

// Approve pending vehicle update (Admin only)
vehicleRouter.put("/approve/:id", approvePendingVehicleUpdate);

// "Soft" delete a vehicle (Admin or owner-with-reason)
vehicleRouter.delete("/:id", deleteVehicle);

// View deleted-vehicle history (Admin only)
vehicleRouter.get("/deleted", getDeletedVehicles);

// Get all vehicles (filtered based on user role)
vehicleRouter.get("/getVehicles", getVehicles);

export default vehicleRouter;
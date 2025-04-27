import express from "express";
import {
  addVehicle,
  updateVehicle,
  deleteVehicle,
  getDeletedVehicles,
  getVehicles,
  approvePendingVehicleUpdate,
  getPendingVehicles,
  handleVehicleApproval,
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
vehicleRouter.put("/update-approve/:id", approvePendingVehicleUpdate);


// Get pending vehicles (Admin only)
vehicleRouter.get("/pending", getPendingVehicles);

// Approve or reject a vehicle (Admin only)
vehicleRouter.put("/handle-approval/:id", handleVehicleApproval);

// "Soft" delete a vehicle (Admin or owner-with-reason)
vehicleRouter.delete("/:id", deleteVehicle);

// View deleted-vehicle history (Admin only)
vehicleRouter.get("/deleted", getDeletedVehicles);

// Get all vehicles (filtered based on user role)
vehicleRouter.get("/getVehicles", getVehicles);

export default vehicleRouter;
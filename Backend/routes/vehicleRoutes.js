import express from "express";
import {
  addVehicle,
  updateVehicle,
  deleteVehicle,

  getVehicles,
  approvePendingVehicleUpdate,
  getPendingVehicles,
  handleVehicleApproval,
  getVehicleById,
  getUserVehicles,
} from "../controllers/vehicleController.js";

import { verifyToken } from "../middlewares/authMiddleware.js";
import vehicleUpload from "../middlewares/multerVehicle.js";

const vehicleRouter = express.Router();

// Protect all vehicle routes
vehicleRouter.use(verifyToken);

// Create a new vehicle (Admin or User)
vehicleRouter.post("/", vehicleUpload, addVehicle);

// Get pending vehicles (Admin only) - Must be before :id route
vehicleRouter.get("/pending", getPendingVehicles);

// Get all vehicles (filtered based on user role)
vehicleRouter.get("/getVehicles", getVehicles);

// Get all vehicles belonging to the authenticated user
vehicleRouter.get("/user/my-vehicles", getUserVehicles);

// Get a single vehicle by ID
vehicleRouter.get("/:id", getVehicleById);

// Update a vehicle (Admin applies or approves customer update requests)
vehicleRouter.put("/:id", vehicleUpload, updateVehicle);

// Update a vehicle (Admin applies or approves customer update requests)
vehicleRouter.put("/update-approve/:id", approvePendingVehicleUpdate);

// Handle initial vehicle approval/rejection
vehicleRouter.put("/handle-approval/:id", (req, res) => {
  // Pass through to the appropriate handler based on whether it's an update or initial approval
  if (req.body.isUpdateRequest) {
    approvePendingVehicleUpdate(req, res);
  } else {
    handleVehicleApproval(req, res);
  }
});

// "Soft" delete a vehicle (Admin or owner-with-reason)
vehicleRouter.delete("/:id", deleteVehicle);

export default vehicleRouter;

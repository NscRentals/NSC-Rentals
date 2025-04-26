import express from "express";
import { addVehicle, updateVehicle } from "../controllers/vehicleController.js";
import { verifyToken } from "../middlewares/authMiddleware.js";

const vehicleRouter = express.Router();

vehicleRouter.use(verifyToken); // Protect all vehicle routes

vehicleRouter.post("/", addVehicle);
vehicleRouter.put("/:id", updateVehicle);

export default vehicleRouter;

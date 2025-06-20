import express from "express";

// Import decoration controller functions
import { addDeco, getDecoById, getDeco, updateDeco, deleteDeco } from "../controllers/decorationsController.js";

const decoRouter = express.Router();

// Add decorations
decoRouter.post("/save", addDeco);

// Get all decorations
decoRouter.get("/get", getDeco);

// Get decoration by ID
decoRouter.get("/get/:id", getDecoById);

// Update decoration
decoRouter.put("/update/:id", updateDeco);

// Delete decoration
decoRouter.delete("/delete/:id", deleteDeco);

export default decoRouter;

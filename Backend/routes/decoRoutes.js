import express from "express";
import {
  addDeco,
  getDeco,
  getDecoById,
  updateDeco,
  deleteDeco
} from "../controllers/decorationsController.js";

const router = express.Router();

// Get all decorations
router.get("/get", getDeco);

// Get a single decoration by ID
router.get("/get/:id", getDecoById);

// Add a new decoration
router.post("/add", addDeco);

// Update a decoration
router.put("/update/:id", updateDeco);

// Delete a decoration
router.delete("/delete/:id", deleteDeco);

export default router; 
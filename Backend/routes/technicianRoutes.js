import express from "express";
import { registerTechnician, loginTechnician } from "../controllers/technicianController.js";

const router = express.Router();

router.post("/register", registerTechnician);
router.post("/login", loginTechnician);

export default router; 
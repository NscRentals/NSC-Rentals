import express from "express";
import { getUserActivities, logActivityFromToken } from "../controllers/userActivityController.js";

const activityRouter = express.Router();

activityRouter.get("/", getUserActivities);
activityRouter.post("/logout", async (req, res) => {
    await logActivityFromToken(req, 'logout');
    res.json({ message: "Logout activity logged" });
});

export default activityRouter; 
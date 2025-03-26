import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import dotenv from "dotenv";
import profileUpload from "../middlewares/multerProfile.js";
import fs from "fs";
import path from "path";

import express from 'express';


const router = express.Router();
const DriverAvailability = require("../models/driveravailability");  

// POST route to save availability
router.post("/driveravailability", async (req, res) => {
  const { driverId, date, availability } = req.body;

  try {
    // Check if availability already exists for the driver on this date
    let existingAvailability = await DriverAvailability.findOne({ driverId, date });

    if (existingAvailability) {
      existingAvailability.availability = availability;  // Update existing record
      await existingAvailability.save();
    } else {
      // Create a new availability record
      const newAvailability = new DriverAvailability({
        driverId,
        date,
        availability,
      });
      await newAvailability.save();
    }

    res.status(200).json({ message: "Availability updated successfully" });
  } catch (error) {
    console.error("Error saving availability:", error);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;

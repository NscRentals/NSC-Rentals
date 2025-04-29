import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import userRouter from "./routes/userRoute.js";
import driverRouter from "./routes/DriverRoutes.js";
import identityRouter from "./routes/identityFormRoutes.js";
//import blogPostRouter from "./routes/blogPostRoutes.js"; // Fixed import path
import blogRouter from "./routes/blogRoutes.js";
import vehicleRouter from "./routes/vehicleRoutes.js";
import sparePartsInventoryRouter from "./routes/sparePartsInventoryRoutes.js";
import damageRequestRouter from "./routes/damageRequestRoutes.js";
import reservationRouter from "./routes/reservationRoute.js";
import cors from "cors";
import path from "path"
import { fileURLToPath } from 'url'; 

import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import technicianRoutes from "./routes/technicianRoutes.js";

// Load environment variables
dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Get the current directory (equivalent of __dirname)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Static file serving
app.use('/uploads/profile_pictures', express.static(path.join(__dirname, 'uploads', 'profile_pictures')));
app.use('/uploads/identity_forms', express.static(path.join(__dirname, 'uploads', 'identity_forms')));
app.use('/uploads/vehicles', express.static(path.join(__dirname, 'uploads', 'vehicles')));
app.use('/uploads/damage', express.static(path.join(__dirname, 'uploads', 'damage')));

// MongoDB connection
const mongoURL = process.env.MONGO_URL || "mongodb://127.0.0.1:27017/NSC-Rentals";

mongoose.connect(mongoURL)
  .then(() => {
    console.log("MongoDB connection established successfully!");
  })
  .catch((error) => {
    console.error("MongoDB connection error:", error);
    process.exit(1);
  });

// JWT middleware
app.use((req, res, next) => {
  try {
    const token = req.header("Authorization");
    if (token) {
      const cleanToken = token.replace("Bearer ", "");
      jwt.verify(cleanToken, process.env.JWT_SECRET || "your-secret-key", (err, decoded) => {
        if (!err) {
          req.user = decoded;
        }
      });
    }
    next();
  } catch (error) {
    console.error("JWT middleware error:", error);
    next();
  }
});

// Routes
app.use("/api/users", userRouter);
app.use("/api/driver", driverRouter);
app.use("/api/forms", identityRouter);
app.use("/api/blogpost", blogRouter);
app.use("/api/vehicles", vehicleRouter);
app.use("/api/maintenance", sparePartsInventoryRouter);
app.use("/api/damage-requests", damageRequestRouter);
app.use("/api/technician", technicianRoutes);
app.use("/api/reservation", reservationRouter);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: "Something went wrong!", error: err.message });
});

// Start server
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
}).on('error', (error) => {
  console.error("Server startup error:", error);
  process.exit(1);
});

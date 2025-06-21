import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import userRouter from "./routes/userRoute.js";
import driverRouter from "./routes/DriverRoutes.js";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import identityRouter from "./routes/identityFormRoutes.js";
import blogRouter from "./routes/blogRoutes.js";
import activityRouter from "./routes/userActivityRoutes.js";
import paymentMethodRouter from "./routes/paymentMethodRoutes.js";
import couponRouter from "./routes/couponRoutes.js";
import reservationRouter from "./routes/reservationRoutes.js";
import cors from "cors";
import path from "path"
import { fileURLToPath } from 'url'; 

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Serve static files from uploads directory
app.use('/uploads/blog_posts', express.static(path.join(__dirname, 'uploads/blog_posts')));
app.use('/uploads/profile_pictures', express.static(path.join(__dirname, 'uploads/profile_pictures')));
app.use('/uploads/identity_forms', express.static(path.join(__dirname, 'uploads/identity_forms')));

dotenv.config();

let mongoURL = process.env.MONGO_URL;

mongoose.connect(mongoURL);
let connection = mongoose.connection;
connection.once("open", ()=>{
    

    console.log("MongoDB connection established successfully!")
})


app.listen(4000, ()=>{

    console.log('listening on Port 4000')

});

app.use(async (req, res, next) => {
  let token = req.header("Authorization");

  if (token) {
    try {
      token = token.replace("Bearer ", "");
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      
      // Fetch the complete user object from database
      const user = await mongoose.model('User').findById(decoded.id).select('-password');
      if (user) {
        req.user = user;
      }
    } catch (error) {
      console.error('Token verification error:', error);
    }
  }
  next();
});

app.use("/api/users",userRouter)
app.use("/api/driver",driverRouter)
app.use("/api/forms",identityRouter)
app.use("/api/blogpost",blogRouter)
app.use("/api/activities", activityRouter)
app.use("/api/payment-methods", paymentMethodRouter)
app.use("/api/coupons", couponRouter)
app.use("/api/reservations", reservationRouter)
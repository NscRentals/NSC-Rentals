import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import userRouter from "./routes/userRoute.js";
import driverRouter from "./routes/DriverRoutes.js";
import identityRouter from "./routes/identityFormRoutes.js";
//import blogPostRouter from "./routes/blogPostRoutes.js"; // Fixed import path
import blogRouter from "./routes/blogRoutes.js";

import cors from "cors";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";

const app = express();
app.use(cors());

app.use(bodyParser.json());
app.use(cors());
dotenv.config();

let mongoURL = process.env.MONGO_URL;

mongoose.connect(mongoURL);
let connection = mongoose.connection;
connection.once("open", () => {
    console.log("MongoDB connection established successfully!");
});

app.listen(4000, () => {
    console.log('listening on Port 4000');
});

app.use((req, res, next) => {
    let token = req.header("Authorization");

    if (token != null) {
        token = token.replace("Bearer ", "");
        jwt.verify(token, process.env.JWT_password, (err, decoded) => {
            if (!err) {
                req.user = decoded;
            }
        });
    }

    next();
});

app.use("/api/users", userRouter);
app.use("/api/driver", driverRouter);
app.use("/api/forms", identityRouter);
//app.use("/api/blogpost", blogPostRouter); // Added the route for blogPostRouter
app.use("/api/blog", blogRouter);

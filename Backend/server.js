import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import userRouter from "./routes/userRoute.js";
import driverRouter from "./routes/DriverRoutes.js";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import identityRouter from "./routes/identityFormRoutes.js";
import blogRouter from "./routes/blogRoutes.js";
import vehicleRouter from "./routes/vehicleRoutes.js";
import cors from "cors";
import path from "path"
import { fileURLToPath } from 'url'; 


const app = express();
app.use(cors());

app.use(bodyParser.json());
dotenv.config();

// Get the current directory (equivalent of __dirname)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use('/uploads/profile_pictures', express.static(path.join(__dirname, 'uploads', 'profile_pictures')));
app.use('/uploads/identity_forms', express.static(path.join(__dirname, 'uploads', 'identity_forms')));



let mongoURL = process.env.MONGO_URL;

mongoose.connect(mongoURL);
let connection = mongoose.connection;
connection.once("open", ()=>{
    

    console.log("MongoDB connection established successfully!")
})


app.listen(4000, ()=>{

    console.log('listening on Port 4000')

});

app.use((req,res,next)=>{


    let token = req.header("Authorization");

    if(token!=null) {

        token = token.replace("Bearer ","");
        jwt.verify(token, process.env.JWT_SECRET,(err,decoded)=>{
            
            if(!err){
                req.user = decoded ;
            }
        })
    }

    next()
})

app.use("/api/users",userRouter)
app.use("/api/driver",driverRouter)
app.use("/api/forms",identityRouter)
app.use("/api/blogpost",blogRouter)
app.use("/api/vehicles",vehicleRouter)
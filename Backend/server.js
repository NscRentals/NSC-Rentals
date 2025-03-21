import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import userRouter from "./routes/userRoute.js";
import driverRouter from "./routes/DriverRoutes.js";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";


const app = express();
app.use(bodyParser.json());
dotenv.config();

//import deco routes
import decoRoutes from "./routes/decorationsRoute.js";
import decoRouter from "./routes/decorationsRoute.js";

//deco route middleware
app.use(decoRoutes);

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
        console.log(token)
        jwt.verify(token, process.env.JWT_password,(err,decoded)=>{
            
            if(!err){
                req.user = decoded ;
            }
        })
    }

    next()
})

app.use("/api/users",userRouter)
app.use("/api/driver",driverRouter)
app.use("/api/deco",decoRouter)


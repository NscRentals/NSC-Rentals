import express from "express";
import { registerUser,loginUser,adminRegister, getAllUsers , getUserDetails } from "../controllers/userController.js";

const userRouter = express.Router();

userRouter.post("/",registerUser)
userRouter.post("/login",loginUser)
userRouter.post("/Admin",adminRegister)
userRouter.get("/",getAllUsers)
userRouter.get("/me",getUserDetails)

export default userRouter;
import express from "express";
import { registerUser,loginUser,adminRegister, getAllUsers , getUserDetails,changePassword,updateUser,deleteUser, updateProfilePicture } from "../controllers/userController.js";
import upload from "../middlewares/multerProfile.js"

const userRouter = express.Router();

userRouter.post("/",registerUser)
userRouter.post("/login",loginUser)
userRouter.post("/Admin",adminRegister)
userRouter.get("/",getAllUsers)
userRouter.get("/me",getUserDetails)
userRouter.put("/password",changePassword)
userRouter.put("/",updateUser)
userRouter.put("/pic", upload.single('profilePicture'),updateProfilePicture)
userRouter.delete("/",deleteUser)

export default userRouter;
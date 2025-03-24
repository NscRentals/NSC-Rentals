import express from "express";
import { identityFormSave,getForms,approveUser } from "../controllers/identityController.js";
import identityUpload from "../middlewares/multerIdentity.js";


const identityRouter = express.Router();

identityRouter.post("/",identityUpload,identityFormSave);
identityRouter.get("/",getForms);
identityRouter.put("/",approveUser)


export default identityRouter;
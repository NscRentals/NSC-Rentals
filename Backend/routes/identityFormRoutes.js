import express from "express";
import { identityFormSave, getForms, approveUser, rejectUser, getUserForm } from "../controllers/identityController.js";
import identityUpload from "../middlewares/multerIdentity.js";

const identityRouter = express.Router();

identityRouter.post("/", identityUpload, identityFormSave);
identityRouter.get("/", getForms);
identityRouter.get("/user", getUserForm);
identityRouter.put("/", approveUser);
identityRouter.put("/reject", rejectUser);

export default identityRouter;
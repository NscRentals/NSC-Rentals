import express from "express";
import Decoration from "../models/decorations.js";

const decoRouter = express.Router();

//add decorations
import { addDeco } from "../controllers/decorationsController.js";
decoRouter.post("/save", addDeco);

//get decorations
import { getDeco } from "../controllers/decorationsController.js";
decoRouter.get("/get", getDeco);

//update decorations
import { updateDeco } from "../controllers/decorationsController.js";
decoRouter.put("/update/:id", updateDeco);

//delete decorations
import { deleteDeco } from "../controllers/decorationsController.js";
decoRouter.delete("/delete/:id", deleteDeco);

export default decoRouter;


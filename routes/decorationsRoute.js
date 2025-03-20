import express from "express";
import Decoration from "../models/decorations.js";

const router = express.Router();

//add decorations
import { addDeco } from "../controllers/decorationsController.js";
router.post("/deco/save", addDeco);

//get decorations
import { getDeco } from "../controllers/decorationsController.js";
router.get("/deco/get", getDeco);

//update decorations
import { updateDeco } from "../controllers/decorationsController.js";
router.put("/deco/update", updateDeco);

//delete decorations
import { deleteDeco } from "../controllers/decorationsController.js";
router.delete("/deco/delete", deleteDeco);

export default router;


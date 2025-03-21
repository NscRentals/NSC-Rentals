import express from "express";
import { addSpareParts } from "../controllers/sparePartsInventory.controller.js";

const sparePartsInventoryRouter = express.Router();

sparePartsInventoryRouter.post("/", addSpareParts);

export default sparePartsInventoryRouter;
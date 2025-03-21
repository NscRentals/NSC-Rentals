import express from "express";
import { addSpareParts, getSpareParts, getSparePartById, deleteSparePart, updateSparePart } from "../controllers/sparePartsInventory.controller.js";

const sparePartsInventoryRouter = express.Router();

//Add spare parts
sparePartsInventoryRouter.post("/", addSpareParts);

//Get all spare Parts
sparePartsInventoryRouter.get("/", getSpareParts);

//Get a single spare part by ID
sparePartsInventoryRouter.get("/:id", getSparePartById);

//Deloete a spare part by ID
sparePartsInventoryRouter.delete("/:id", deleteSparePart);

//Update a spare part by ID
sparePartsInventoryRouter.put("/:id", updateSparePart);

export default sparePartsInventoryRouter;
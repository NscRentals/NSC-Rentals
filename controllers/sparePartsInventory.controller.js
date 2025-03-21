import sparePartsInventory from "../models/sparePartsInventory.js";

export function addSpareParts(req, res) {

    const data = req.body;
    const newSpareParts = new sparePartsInventory(data);

    newSpareParts.save() 
    .then( () => {
        res.json({message : "Spare parts added successfully"});
    }).catch((error) => {
        res.status(500).json({error : "Spare parts could not be added"})
    })
}
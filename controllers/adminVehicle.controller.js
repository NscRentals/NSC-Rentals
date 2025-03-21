import Vehicle from "../models/AdminVehicle.js";

export function addVehicle (req, res) {

    const data = req.body;
    const newVehicle = new Vehicle(data);

    newVehicle.save()
    .then( () => {
        res.json( {message: "Vehicle added Succesfully"} );
    }).catch ( (error) => {
        res.status(500).json( {error: "Vehicle could not be added"} )
    })       
            
}
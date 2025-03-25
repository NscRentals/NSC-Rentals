import mongoose from "mongoose";
import PeerVehicle from "../models/peerToPeerVehicles.js";

export function addNewVehicle(req, res) {

    if (!req.body.ownerId) {
        return res.status(400).json({
            message: "ownerId is required in the request body"
        });
    }

    const data = req.body;

    data.owner = {
        ownerId: new mongoose.Types.ObjectId(req.body.ownerId),
        ownerType: "Peer-to-Peer"
    };


    data.approvalStatus = "Pending";

    const newVehicle = new PeerVehicle(data);

    newVehicle.save()
        .then(() => {
            res.status(200).json({
                message: "Vehicle submission received and awaiting approval"
            });
        })
        .catch((err) => {
            res.status(500).json({
                message: "Vehicle not submitted",
                error: err
            });
        });
}

export async function getVehicles(req, res) {
    const user = req.user; // assumes req.user is set by your auth middleware

    try {
        let vehicles;
        if (user.type === "admin") {
            // Admins see all vehicles
            vehicles = await PeerVehicle.find({});
        } else {
            // Regular users see only the vehicles they added
            vehicles = await PeerVehicle.find({ "owner.ownerId": user._id });
        }
        res.json(vehicles);
    } catch (e) {
        res.status(500).json({
            message: "Failed to get vehicles",
            error: e
        });
    }
}







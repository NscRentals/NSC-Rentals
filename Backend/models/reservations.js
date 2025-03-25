import mongoose from "mongoose";


const reservationSchema = new mongoose.Schema({
    rId: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    rType: {
        type: String,
        enum : ["Wedding", "normal"],
        required: true
    },
    startTime: {
        type: String,
        required: true
    },
    endTime: {
        type: String,
        required: true
    },
    startDate: {
        type: Date,
        required: true
    },
    endDate: {
        type: Date,
    },
    vehicleId: {
        type: String,
        required: true
    },
    decorations: {
        type: Boolean,
        required: true
    },
    decoType: {
        type: String,
    },
    isVerified: {
        type: Boolean, // True for Verified, False for Not Verified
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    driverReq: {
        type: Boolean, // True for Driver Required, False for Not Required
        required: true
    },
    driverId: {
        type: String,
        required: true
    },
    pickupLocation: {
        type: String,
        required: true
    },
    
});

const Reservation = mongoose.model("Reservation", reservationSchema);

export default Reservation;

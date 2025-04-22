import mongoose from "mongoose";
 
const VehicleSchema = new mongoose.Schema({

    // Basic vehicle specifications
    make: {
        type: String,
        required: true  
    },

    model: {
        type: String,
        required: true 
    },

    year: {
        type: Number,
        required: true ,
        max: new Date().getFullYear()
    },

    registrationNumber: {
        type: String,
        required: true, 
        unique: true
    },

    chassisNumber : {
        type: String,
        required: true,
        unique: true,
    },

    engineNumber: {
        type: String,
        required: true,
        unique: true
    },

    engineCapacity: {
        type: String,
        required: true,
        min: 0
    },

    transmissionType: { 
        type: String, 
        required: true, 
        enum: ['Manual', 'Automatic'] 
    },

    fuelType: { 
        type: String, 
        required: true, 
        enum: ['Petrol', 'Diesel', 'Electric', 'Hybrid']
    },

    color: {
        type: String,
        required: true
    },

    seatingCapacity: { 
        type: Number, 
        required: true, 
        min: 1 
    },

    numberOfDoors: {
        type: Number,
        required: true,
        min: 1
    },

    description: {
        type: String,
        default: " "
    },
    

    //Vehicle collection point address
    district: {
        type: String,
        required: true
    },

    city: {
        type: String,
        required: true
    },

    address: {
        type: String,
        required: true
    },


    //Vehicle owner conditions 
    minRentalPeriod: {
        type: String,
        required : true,
        enum: ['Hour(s)', 'Day(s)', 'Week(s)', 'Month(s)'],
    },

    maxRentalPeriod: {
        type: String,
        required : true,
        enum: ['Hour(s)', 'Day(s)', 'Week(s)', 'Month(s)'],
    },

    rentMode: {
        type: String,
        required: true,
        enum: ['With Driver', 'Vehicle Only']
    },
    

    //Vehhicle dynamic pricing system


    // Current availability status of the vehicle
    availabilityStatus: { 
        type: String, 
        enum: ['Available', 'Booked', 'Under Maintenance'], 
        default: 'Available' 
    },

    // Vehicle images
    vehicleImages: {
        type: [String],
    },

    // peer‑to‑peer vs company & approval
    ownerType: {
        type: String,
        enum: ['Company', 'User'],
        default: 'User'
    },

    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },

    approvalStatus: {
        type: String,
        enum: ['Pending', 'Approved', 'Rejected'],
        default: 'Pending'
    },

});

const Vehicle = mongoose.model("vehicle", VehicleSchema);

export default Vehicle;

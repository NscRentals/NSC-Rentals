import mongoose from "mongoose";

// Nested schema for individual pricing details
const PricingDetailSchema = new mongoose.Schema({

    price: {
        type: Number,
        default: 0,
    },

    mileageLimit: {
        type: Number,
        default: 0,
    },

    extraCharge: {
        type: Number,
        default: 0,
    },  
},
    { _id: false }); // Disable automatic _id field for subdocument


// Nested schema for each rental period (hourly/daily/weekly/monthly)
const PeriodPricingSchema = new mongoose.Schema({
    
    enabled: {
        type: Boolean,
        default: false,
    },

    withDriver: {
        type: PricingDetailSchema,
        default: () => ({
            price: 0,
            mileageLimit: 0,
            extraCharge: 0,
        })
    },

    vehicleOnly: {
        type: PricingDetailSchema,
        default: () => ({
            price: 0,
            mileageLimit: 0,
            extraCharge: 0,
        })
    },
},
    { _id: false }); // Disable automatic _id field for subdocument


// Main Vehicle schema 
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
    

    // Location where the vehicle can be picked up
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


    // Vehicle owner conditions 
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
    

    // Pricing block
    pricing: {

        // Market value of the vehicle
        vehicleValue: {
            type: Number,
            required: true,
        },

        hourly: {
            type: PeriodPricingSchema,
            default: () => ({})
        },

        daily: {
            type: PeriodPricingSchema,
            default: () => ({})
        },

        weekly: {
            type: PeriodPricingSchema,
            default: () => ({})
        },

        monthly: {
            type: PeriodPricingSchema,
            default: () => ({})
        }
    },    


    // Current availability status of the vehicle
    availabilityStatus: { 
        type: String, 
        enum: ['Available', 'Booked', 'Under Maintenance'], 
        default: 'Available' 
    },

    // Vehicle images
    vehicleImages: {
        type: [String],
        required: true
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

    // store an owner’s requested changes until approved
    pendingUpdate: {
        type: mongoose.Schema.Types.Mixed,
        default: null,
    },

    approvalStatus: {
        type: String,
        enum: ['Pending', 'Approved', 'Rejected'],
        default: 'Pending'
    },
    
},    
    {
        timestamps: true, // Automatically manage createdAt and updatedAt fields
    });

//const Vehicle = mongoose.model("vehicle", VehicleSchema);
const Vehicle = mongoose.model("Vehicle", VehicleSchema);

export default Vehicle;

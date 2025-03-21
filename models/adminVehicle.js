import mongoose from "mongoose";
 
const AdminVehicleSchema = new mongoose.Schema({

    vehicleID: {
        type: String,
        unique: true,
        required: true
    },

    // Owner details with type (company-owned or peer-to-peer)
    owner: {
        ownerId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        ownerType: {
            type: String,
            required: true,
            enum: ['Company', 'Peer-to-Peer']
        }
    },

    // Specifies the vehicle is used for wedding or normal rental
    vehicleType: {
        type: String,
        required: true,
        enum: ['wedding car', 'Normal rental']
    },

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
        required: true,
        max: new Date().getFullYear()
    },

    registrationNumber: {
        type: String,
        required: true,
        unique: true,
    },

    chassisNumber : {
        type: String,
        required: true,
        unique: true,
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
    
    // Pricing structure
    pricing: {
        daily: {
            type: Number,
            required: true,
            min: 0
        },
        hourly: {
            type: Number,
            required: true,
            min: 0
        },
        weddingDecorationPrice: { 
            type: Number,
            default: 0
        }    
    },

    // Current availability status of the vehicle
    availabilityStatus: { 
        type: String, 
        required: true, 
        enum: ['Available', 'Booked', 'Under Maintenance'], 
        default: 'Available' 
    },

    // Vehicle images
    vehicleImages: {
        type: [String],
        required: true,
        default: ""
    },

    // Documentation Images (insurance, registrartion copies)
    documentationImages: {
        type: [String],
        required: true,
        default: []
    },

    // Insurance validity Info
    insuranceExpiryDate: { 
        type: Date, 
        required: true 
    },

    // Overall condition of the vehicle
    condition: { 
        type: String, 
        enum: ['Excellent', 'Good', 'Average', 'Needs Repair'], 
        default: 'Good' 
    },

    // Maintenance records including mileage and service dates
    maintenance: {
        mileage: {
            type: Number,
            required: true,
            min: 0
        },
        lastServiceDate: {
            type: Date
        },
        nextServiceDate: {
            type: Date
        },
        maintenanceStatus: {
            type: String,
            enum: ['Up-to-date', 'Pending Service', 'Requires Repair'],
            default: 'Up-to-date'
        }
    },

    // Verification details ensuring that only verified vehicles are available
    verification: {
        verified: {
            type: Boolean,
            default: false,
            required: true
        },
        verificationDate: {
            type: Date
        }
    },

    // Decoration information
    decoration: {
        decorated: {
            type: Boolean, 
            default: false  
        },
        decorationStyle: {
            type: String
        }
    },

    // History of rentals for tracking past usage
    rentalHistory: [{
        renterId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        startDate: Date,
        endDate: Date
    }],
    

    // who added the vehicle
    addedBy: {
        type:  mongoose.Schema.Types.ObjectId, 
        ref: 'Admin',
        required: true
    },

    dateAdded: {
        type: Date,
        default: Date.now
    }

});

let Vehicle = mongoose.model("vehicle", AdminVehicleSchema);

export default Vehicle;
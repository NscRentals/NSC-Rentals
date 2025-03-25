import mongoose from "mongoose";

const peerVehicleSchema = new mongoose.Schema({
  vehicleID: {
    type: String,
    required: true,
    unique: true
  },

  owner: {
    ownerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    ownerType: {
      type: String,
      enum: ["Peer-to-Peer"],
      required: true
    }
  },

  vehicleType: {
    type: String,
    enum: ["wedding car", "Normal rental"],
    required: true
  },

  make: { type: String, required: true },
  model: { type: String, required: true },
  year: {
    type: Number,
    required: true,
    max: new Date().getFullYear()
  },

  registrationNumber: {
    type: String,
    required: true,
    unique: true
  },

  chassisNumber: {
    type: String,
    required: true,
    unique: true
  },

  color: { type: String, required: true },
  seatingCapacity: { type: Number, required: true, min: 1 },

  transmissionType: {
    type: String,
    enum: ["Manual", "Automatic"],
    required: true
  },

  fuelType: {
    type: String,
    enum: ["Petrol", "Diesel", "Electric", "Hybrid"],
    required: true
  },

  pricing: {
    daily: { type: Number, required: true, min: 0 },
    hourly: { type: Number, required: true, min: 0 },
    weddingDecorationPrice: { type: Number, default: 0 }
  },

  availabilityStatus: {
    type: String,
    enum: ["Available", "Booked", "Under Maintenance"],
    default: "Available"
  },

  vehicleImages: {
    type: [String],
    required: true
  },

  documentationImages: {
    type: [String],
    required: true
  },

  insuranceExpiryDate: {
    type: Date,
    required: true
  },

  condition: {
    type: String,
    enum: ["Excellent", "Good", "Average", "Needs Repair"],
    default: "Good"
  },

  maintenance: {
    mileage: { type: Number, required: true, min: 0 },
    lastServiceDate: { type: Date },
    nextServiceDate: { type: Date },
    maintenanceStatus: {
      type: String,
      enum: ["Up-to-date", "Pending Service", "Requires Repair"],
      default: "Up-to-date"
    }
  },

  approvalStatus: {
    type: String,
    enum: ["Pending", "Approved", "Rejected"],
    default: "Pending"
  },
  

  decoration: {
    decorated: { type: Boolean, default: false },
    decorationStyle: { type: String }
  },


});

const PeerVehicle = mongoose.model("PeerVehicle", peerVehicleSchema);
export default PeerVehicle;

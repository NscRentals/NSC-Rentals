import mongoose from 'mongoose';

const driverAvailabilitySchema = new mongoose.Schema({
  driverId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "Driver", // Assuming you have a Driver model
  },
  date: {
    type: String,
    required: true,
  },
  availability: {
    type: Boolean,
    required: true,
  },
});

const DriverAvailability = mongoose.model("DriverAvailability", driverAvailabilitySchema);
export default DriverAvailability;

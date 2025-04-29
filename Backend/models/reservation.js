import mongoose from "mongoose";

const reservationSchema = new mongoose.Schema(
  {
    rId: {
      type: String,
      required: true,
      unique: true
    },
    vehicleNum: {
      type: String,
      required: true,
    },
    userId: {
      type: String,
      required: true,
    },
    driverID: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    phonenumber: {
      type: String,
      required: true,
    },
    address: {
      type: String,
      required: true,
    },
    rType: {
      type: String,
      required: true,
    },
    service: {
      type: String,
      required: true,
    },
    locationpick: {
      type: String,
      required: true,
    },
    locationdrop: {
      type: String,
      required: true,
    },
    startDate: {
      type: Date,
      required: true,
    },
    endDate: {
      type: Date,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    isVerified: {
      type: Boolean,
      default: false,
    }
  },
  {
    timestamps: true, // This will add createdAt and updatedAt fields
  }
);

// Remove any existing indexes
const Reservation = mongoose.model("reservation", reservationSchema);
Reservation.collection.dropIndexes()
  .then(() => console.log('Dropped all indexes from reservations collection'))
  .catch(err => console.log('Error dropping indexes:', err));

// Create only the indexes we want
reservationSchema.index({ rId: 1 }, { unique: true });
reservationSchema.index({ isVerified: 1 }); // Add index for faster queries on verification status

export default Reservation;

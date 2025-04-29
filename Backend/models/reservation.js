import mongoose from "mongoose";

const reservationSchema = new mongoose.Schema(
  {
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
    wantedtime: {
      type: String,
      required: true,
    },
    amount: {
      type: String,
      required: true,
    },

    wanteddate: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true, // This will add createdAt and updatedAt fields
  }
);

const Reservation = mongoose.model("reservation", reservationSchema);

export default Reservation;

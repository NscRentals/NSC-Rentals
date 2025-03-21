import mongoose from "mongoose";

const sparePartSchema = new mongoose.Schema ({

    // Idenfies the spare part
    partId : {
        type : String,
        required : true,
        unique : true
    },

    // The name of the spare part
    name : {
        type : String,
        required : true
    },

    // The category the spare part
    category : {
        type : String,
        required : true,
        enum: ["Engine", "Brakes", "Suspension", "Electrical", "Body", "Other"],
        default : ""
    },

    // Detailed specifications of the spare part
    specifications: {
        type : String,
        required : true
    },

    // The quantity available in the inventory
    quantity : {
        type : Number,
        required : true,
        min : 0
    },

    // The price per unit of the spare part
    price : {
        type : Number,
        required : true,
        min : 0
    },

    // The spare part image
    sparePartsImages: {
        type: [String],
        required: true,
        default: []
    },

    // Avalability of the spare part
    availability : {
        type : Boolean,
        required : true,
        default : true
    },

    // Timestamp of the last modification.
    lastUpdated : {
        type : Date,
        default : Date.now
    },

});

let sparePartsInventory = mongoose.model("sparePartsInventory", sparePartSchema);

export default sparePartsInventory;
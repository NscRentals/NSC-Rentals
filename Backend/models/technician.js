import mongoose from "mongoose";

const techSchema = new mongoose.Schema({

    Name :{

        type : String,
        required : true
    },

    email : 
    {

        type : String,
        required : true, 
        unique : true

    },
    phone : {

        type : Number,
        required :true,

    },
    available : {

        type : Boolean,
        required : true,
        default :true


    }
})

const Technician = mongoose.model("Technician",techSchema);
export default Technician;
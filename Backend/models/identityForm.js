import mongoose from "mongoose";

const identityFormSchema = new mongoose.Schema({

    email : {

        type : String,
        required : true,
        unique : true 

    },
    fullName : {

        type: String,
        required : true,

    },
    address : {

        type : String,
        required : true
    },
    phone : {

        type : String,
        required : true

    },
    type : {

        type: String,
        required : true ,
        default : "NIC"

    },
    img1 : {

        type: String,
        required : true
    },
    img2: {

        type : String,
        required : true
    },
    isVerified : {

        type : Boolean,
        required : true,
        default : false

    },
    isRejected : {

        type : Boolean,
        required : true,
        default : false

    }


},{
    timestamps: true // This will add createdAt and updatedAt fields
})

const IdentityForm = mongoose.model("IdentityForm",identityFormSchema);
export default IdentityForm;

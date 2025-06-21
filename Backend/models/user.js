import mongoose from "mongoose";

const userSchema = new mongoose.Schema({

email : {

    type : String,
    required : true,
    unique : true,

},

password : {

    type : String,
    required : true

},

type : {

    type : String,
    required : true,
    default : "Customer"

},

firstName : {

    type : String,
    required : true

},

lastName : {

    type : String,
    required : true
    
},

address: {
    street: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    zipCode: { type: String, required: true },
    country: { type: String, required: true }
},

phone : {

    type : String,
    required : true

    
},
profilePicture : {

    type : String,
    required : true,
    default: "aaaaaa"

    
},
loyaltyPoints : {

    type : Number,
    default : 0 
    
}, 
isVerified : {

    type: Boolean,
    default : false
    
}


})

// Check if model already exists before creating it
const User = mongoose.models.User || mongoose.model("User", userSchema);

export default User;
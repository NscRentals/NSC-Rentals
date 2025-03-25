import mongoose from 'mongoose';

const damageRequestSchema = new mongoose.Schema({

// The id of the damage request
reportId : {
    type : String,
    required : true
},

//Id of the vehicle that has damage
vehicleId : {
    type : String,
    required : true
},

//Id of the user who reported the damage
userId : {
    type : String,
    required : true
},

//The date the damage was reported
reportDate : {
    type : Date,
    required : true
},

//Description of the damage
description : {
    type : String,
    required : true
}

});

let damageRequest = mongoose.model("damageRequest", damageRequestSchema);

export default damageRequest;
import mongoose from "mongoose";

const decorationSchema = new mongoose.Schema({
    
    dId:{
        type: String,
        required: true
    },
    type:{
        type: String,
        required: true
    }/*,
    price:{
        type: Number,
        required: true
    },
    description:{
        type: String,
        required: true
    },
    images:{
        type: String, //image URL
        required: true
    }*/

});

const Decoration = mongoose.model("Decoration", decorationSchema);

export default Decoration;
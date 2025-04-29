import mongoose from "mongoose";

const blogPostSchema = new mongoose.Schema({


    name : {

        type : String,
        required : true
    },
    email : {

        type : String,
        required: true,
        unique : true
    },
    caption : {

        type: String,
        required : true

    },
    img1 : {

        type : String ,
        required : true

    },
    img2 : {

        type : String,
        required : true

    },
    img3 :{

        type: String,

    },
    isVerified : {

        type : Boolean,
        default : false

    }


})

const BlogPost = mongoose.model("blogPost", blogPostSchema)

export default BlogPost;
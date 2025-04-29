import mongoose from "mongoose";

const blogPostSchema = new mongoose.Schema({
    name : {
        type : String,
        required : true
    },
    email : {
        type : String,
        required: true
    },
    caption : {
        type: String,
        required : true
    },
    image : {
        type : String,
        required : true
    },
    isVerified : {
        type : Boolean,
        default : false
    }
}, {
    timestamps: true // This will add createdAt and updatedAt fields
})

const BlogPost = mongoose.model("blogPost", blogPostSchema)

export default BlogPost;
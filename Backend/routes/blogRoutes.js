import express from "express";
import { saveBlogPost, getBlogPosts, verifyBlogPost } from "../controllers/blogPostController.js";
import blogUpload from "../middlewares/multerBlog.js";

const blogRouter = express.Router();

blogRouter.post("/", blogUpload, saveBlogPost);
blogRouter.get("/", getBlogPosts);
blogRouter.put("/", verifyBlogPost);

export default blogRouter;

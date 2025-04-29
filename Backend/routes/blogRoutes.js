import express from "express";
import { saveBlogPost, getBlogPosts, verifyBlogPost, getUnverifiedPosts, deleteBlogPost } from "../controllers/blogPostController.js";
import blogUpload from "../middlewares/multerBlog.js";

const blogRouter = express.Router();

blogRouter.post("/", blogUpload, saveBlogPost);
blogRouter.get("/", getBlogPosts);
blogRouter.get("/unverified", getUnverifiedPosts);
blogRouter.put("/verify/:postId", verifyBlogPost);
blogRouter.delete("/:postId", deleteBlogPost);

export default blogRouter;

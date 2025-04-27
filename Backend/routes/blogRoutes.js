import express from "express";
import { saveBlogPost, getBlogPosts, verifyBlogPost } from "../controllers/blogPostController.js";
import identityUpload from "../middlewares/multerIdentity.js";

const blogRouter = express.Router();

blogRouter.post("/", identityUpload, saveBlogPost);
blogRouter.get("/", getBlogPosts);
blogRouter.put("/", verifyBlogPost);

export default blogRouter;

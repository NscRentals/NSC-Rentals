import BlogPost from "../models/blogPost.js";

// Function to save blog post
export async function saveBlogPost(req, res) {
    if (!req.file) {
        return res.status(400).json({ message: "Image is required!" });
    }

    if (!req.user || !req.user.email) {
        return res.status(400).json({ message: "User authentication required!" });
    }

    if (!req.body || Object.keys(req.body).length === 0) {
        return res.status(400).json({ message: "Request body is empty!" });
    }

    const data = {
        name: req.user.firstName + " " + req.user.lastName,
        email: req.user.email,
        caption: req.body.caption,
        image: req.file.filename,
        isVerified: false
    };

    try {
        const newBlogPost = new BlogPost(data);
        await newBlogPost.save();
        res.json({ message: "Blog post submitted successfully!", blog: newBlogPost });
    } catch (error) {
        console.error("Error saving blog post:", error);
        res.status(500).json({ message: "Submission failed!" });
    }
}

// Function to get all blog posts
export async function getBlogPosts(req, res) {
    try {
        const posts = await BlogPost.find({ isVerified: true });
        // Add full image URL to each post
        const postsWithImageUrl = posts.map(post => ({
            ...post.toObject(),
            image: `http://localhost:4000/uploads/blog_posts/${post.image}`
        }));
        res.json(postsWithImageUrl);
    } catch (error) {
        console.error("Error fetching blog posts:", error);
        res.status(500).json({ message: "Failed to retrieve blog posts!" });
    }
}

// Function to get unverified blog posts
export async function getUnverifiedPosts(req, res) {
    try {
        const posts = await BlogPost.find({ isVerified: false });
        // Add full image URL to each post
        const postsWithImageUrl = posts.map(post => ({
            ...post.toObject(),
            image: `http://localhost:4000/uploads/blog_posts/${post.image}`
        }));
        res.json(postsWithImageUrl);
    } catch (error) {
        console.error("Error fetching unverified blog posts:", error);
        res.status(500).json({ message: "Failed to retrieve unverified blog posts!" });
    }
}

// Function to verify a blog post
export async function verifyBlogPost(req, res) {
    const { postId } = req.params;
    const { status } = req.body;

    if (!postId) {
        return res.status(400).json({ message: "Post ID is required!" });
    }

    try {
        const blog = await BlogPost.findById(postId);
        if (!blog) {
            return res.status(404).json({ message: "Blog post not found!" });
        }

        blog.isVerified = status === "approved";
        await blog.save();

        res.json({ message: `Blog post ${status} successfully!` });
    } catch (error) {
        console.error("Error verifying blog post:", error);
        res.status(500).json({ message: "Verification failed!" });
    }
}

// Function to delete a blog post
export async function deleteBlogPost(req, res) {
    const { postId } = req.params;
    if (!postId) {
        return res.status(400).json({ message: "Post ID is required!" });
    }
    try {
        const deleted = await BlogPost.findByIdAndDelete(postId);
        if (!deleted) {
            return res.status(404).json({ message: "Blog post not found!" });
        }
        res.json({ message: "Blog post deleted successfully!" });
    } catch (error) {
        console.error("Error deleting blog post:", error);
        res.status(500).json({ message: "Delete failed!" });
    }
}

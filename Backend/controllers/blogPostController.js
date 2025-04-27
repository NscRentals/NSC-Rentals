import  BlogPost from "../models/blogPost.js";

// Function to save blog post
export async function saveBlogPost(req, res) {
    if (!req.files || !req.files.img1 || !req.files.img2) {
        return res.status(400).json({ message: "At least img1 and img2 are required!" });
    }

    if (!req.user || !req.user.email || !req.user.name) {
        return res.status(400).json({ message: "User authentication required!" });
    }

    if (!req.body || Object.keys(req.body).length === 0) {
        return res.status(400).json({ message: "Request body is empty!" });
    }

    const data = {
        name: req.user.name,
        email: req.user.email,
        caption: req.body.caption,
        img1: req.files.img1[0].filename,
        img2: req.files.img2[0].filename,
        img3: req.files.img3 ? req.files.img3[0].filename : null,
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
        const posts = await BlogPost.find();
        res.json(posts);
    } catch (error) {
        console.error("Error fetching blog posts:", error);
        res.status(500).json({ message: "Failed to retrieve blog posts!" });
    }
}

// Function to verify a blog post
export async function verifyBlogPost(req, res) {
    const { email } = req.body;

    if (!email) {
        return res.status(400).json({ message: "Email is required!" });
    }

    try {
        const blog = await BlogPost.findOne({ email });
        if (!blog) {
            return res.status(404).json({ message: "Blog post not found!" });
        }

        blog.isVerified = true;
        await blog.save();

        res.json({ message: "Blog post verified successfully!" });

    } catch (error) {
        console.error("Error verifying blog post:", error);
        res.status(500).json({ message: "Verification failed!" });
    }
}

import multer from "multer";
import path from "path";
import fs from "fs";

// Define storage location
const blogStorage = multer.diskStorage({
    destination: function (req, file, cb) {
        const uploadFolder = "./uploads/blog_posts";
        if (!fs.existsSync(uploadFolder)) fs.mkdirSync(uploadFolder, { recursive: true });
        cb(null, uploadFolder);
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

// Multer upload configuration
const blogUpload = multer({
    storage: blogStorage,
    limits: { fileSize: 5 * 1024 * 1024 }, // Limit is 5MB
    fileFilter: (req, file, cb) => {
        const allowed = /jpeg|jpg|png/;
        const isValid = allowed.test(path.extname(file.originalname).toLowerCase()) && allowed.test(file.mimetype);
        isValid ? cb(null, true) : cb(new Error("Only JPEG, JPG, and PNG allowed"));
    }
}).fields([{ name: "img1", maxCount: 1 }, { name: "img2", maxCount: 1 }, { name: "img3", maxCount: 1 }]);

export default blogUpload;
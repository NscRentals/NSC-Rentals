import multer from "multer";
import path from "path";
import fs from "fs";

// Define storage location
const profileStorage = multer.diskStorage({
    destination: function (req, file, cb) {
        const uploadFolder = "./uploads/profile_pictures";
        if (!fs.existsSync(uploadFolder)) fs.mkdirSync(uploadFolder, { recursive: true });
        cb(null, uploadFolder);
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname)); 
    }
});

// Multer upload configuration
const profileUpload = multer({
    storage: profileStorage,
    limits: { fileSize: 2 * 1024 * 1024 }, // Limit to 2MB
    fileFilter: (req, file, cb) => {
        const allowed = /jpeg|jpg|png/;
        const isValid = allowed.test(path.extname(file.originalname).toLowerCase()) && allowed.test(file.mimetype);
        isValid ? cb(null, true) : cb(new Error("Only JPEG, JPG, and PNG allowed"));
    }
});

export default profileUpload;
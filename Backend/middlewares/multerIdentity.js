import multer from "multer";
import path from "path";
import fs from "fs";

// Define storage location
const identityStorage = multer.diskStorage({
    destination: function (req, file, cb) {
        const uploadFolder = "./uploads/identity_forms";
        if (!fs.existsSync(uploadFolder)) fs.mkdirSync(uploadFolder, { recursive: true });
        cb(null, uploadFolder);
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

// Multer upload configuration
const identityUpload = multer({
    storage: identityStorage,
    limits: { fileSize: 2 * 1024 * 1024 }, // Limit is 2MB
    fileFilter: (req, file, cb) => {
        const allowed = /jpeg|jpg|png/;
        const isValid = allowed.test(path.extname(file.originalname).toLowerCase()) && allowed.test(file.mimetype);
        isValid ? cb(null, true) : cb(new Error("Only JPEG, JPG, and PNG allowed"));
    }
}).fields([{ name: "img1", maxCount: 1 }, { name: "img2", maxCount: 1 }]);

export default identityUpload;

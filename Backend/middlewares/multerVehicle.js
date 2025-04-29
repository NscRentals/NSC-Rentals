import multer from "multer";
import path from "path";
import fs from "fs";

// Define storage location
const vehicleStorage = multer.diskStorage({
    destination: function (req, file, cb) {
        const uploadFolder = "./uploads/vehicles";
        if (!fs.existsSync(uploadFolder)) fs.mkdirSync(uploadFolder, { recursive: true });
        cb(null, uploadFolder);
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

// Multer upload configuration
const vehicleUpload = multer({
    storage: vehicleStorage,
    limits: { fileSize: 5 * 1024 * 1024 }, // Limit is 5MB per image
    fileFilter: (req, file, cb) => {
        const allowed = /jpeg|jpg|png/;
        const isValid = allowed.test(path.extname(file.originalname).toLowerCase()) && allowed.test(file.mimetype);
        isValid ? cb(null, true) : cb(new Error("Only JPEG, JPG, and PNG allowed"));
    }
}).array('vehicleImages', 5); // Allow up to 5 vehicle images

export default vehicleUpload;

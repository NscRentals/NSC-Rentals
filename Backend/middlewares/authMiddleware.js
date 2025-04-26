import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

export function verifyToken(req, res, next) {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
        return res.status(401).json({ message: "Missing Authorization header" });
    }

    const [scheme, token] = authHeader.split(" ");
    if (scheme !== "Bearer" || !token) {
        return res.status(401).json({ message: "Malformed token" });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_password);
        req.user = decoded;  // ✅ sets req.user
        next();
    } catch (err) {
        return res.status(401).json({ message: "Invalid or expired token" });
    }
}
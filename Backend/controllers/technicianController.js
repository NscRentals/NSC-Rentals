import Technician from "../models/technician.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

// Technician Registration
export async function registerTechnician(req, res) {
    try {
        const { name, email, password, phone } = req.body;
        if (!name || !email || !password || !phone) {
            return res.status(400).json({ message: "All fields are required" });
        }
        const existing = await Technician.findOne({ email });
        if (existing) {
            return res.status(400).json({ message: "Technician already exists" });
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const tech = new Technician({ Name: name, email, password: hashedPassword, phone });
        await tech.save();
        res.status(201).json({ message: "Technician registered successfully" });
    } catch (err) {
        console.error("Technician registration error:", err);
        res.status(500).json({ message: "Registration failed" });
    }
}

// Technician Login
export async function loginTechnician(req, res) {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ message: "Email and password are required" });
        }
        const tech = await Technician.findOne({ email });
        if (!tech) {
            return res.status(404).json({ message: "Technician not found" });
        }
        const isMatch = await bcrypt.compare(password, tech.password);
        if (!isMatch) {
            return res.status(401).json({ message: "Invalid credentials" });
        }
        const token = jwt.sign({ id: tech._id, email: tech.email, type: "technician", name: tech.Name }, process.env.JWT_SECRET, { expiresIn: "1d" });
        res.json({ message: "Login successful", token, user: { id: tech._id, email: tech.email, type: "technician", name: tech.Name } });
    } catch (err) {
        console.error("Technician login error:", err);
        res.status(500).json({ message: "Login failed" });
    }
} 
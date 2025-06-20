import driver from '../models/DriverModel.js'; 
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import User from '../models/user.js';

dotenv.config();

export async function driverAdd(req, res) {
    try {
        let newPost = new driver(req.body);
        await newPost.save(); 
        return res.status(200).json({ success: "Post saved successfully" });
    } catch (err) {
        return res.status(400).json({ error: err.message });
    }
}

export async function driverFind(req, res) {
    try {
        const posts = await driver.find();
        
        if (posts.length === 0) {
            return res.status(404).json({ success: false, message: "No posts found" });
        }

        return res.status(200).json({ success: true, posts });
    } catch (err) {
        return res.status(400).json({ error: err.message });
    }
}

export async function driverUpdate(req, res) {
    try {
        const { DriverName, DriverPhone, DriverAdd, DriverEmail, DLNo, NICNo } = req.body;
        const driverId = req.params.id;

        // Validate required fields
        if (!DriverName || !DriverPhone || !DriverAdd || !DriverEmail || !DLNo || !NICNo) {
            return res.status(400).json({ error: "All fields are required" });
        }

        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(DriverEmail)) {
            return res.status(400).json({ error: 'Invalid email format.' });
        }

        // Validate phone number
        const phoneRegex = /^[0-9]{10}$/;
        if (!phoneRegex.test(DriverPhone)) {
            return res.status(400).json({ error: 'Phone number must be 10 digits.' });
        }

        // Validate NIC number
        if (NICNo.length !== 10) {
            return res.status(400).json({ error: 'NIC number must be exactly 10 characters.' });
        }

        // Check if email is already used by another driver
        const existingDriver = await driver.findOne({ 
            DriverEmail, 
            _id: { $ne: driverId } 
        });
        if (existingDriver) {
            return res.status(400).json({ error: 'Email is already in use by another driver.' });
        }

        // Update the driver
        const updatedDriver = await driver.findByIdAndUpdate(
            driverId,
            { 
                $set: {
                    DriverName,
                    DriverPhone,
                    DriverAdd,
                    DriverEmail,
                    DLNo,
                    NICNo
                }
            },
            { new: true, runValidators: true }
        );

        if (!updatedDriver) {
            return res.status(404).json({ error: "Driver not found" });
        }

        return res.status(200).json({ 
            success: "Profile updated successfully", 
            driver: updatedDriver 
        });
    } 
    catch (err) {
        console.error("Update error:", err);
        return res.status(400).json({ error: err.message });
    }
}

export async function driverDelete(req, res) {
    try {
        const deletedPost = await driver.findByIdAndDelete(req.params.id);

        if (!deletedPost) {
            return res.status(404).json({ error: "Post not found" });
        }

        return res.json({ message: "Delete successful", deletedPost });
    } catch (err) {
        return res.status(400).json({ error: err.message });
    }
}

export async function driverLogin(req, res) {
    const { email, password } = req.body;

    try {
        console.log("Login attempt for:", email);
        
        if (!email || !password) {
            console.log("Missing email or password");
            return res.status(400).json({ error: "Email and password are required" });
        }

        // First try to find the driver
        const driverDoc = await driver.findOne({ DriverEmail: email });
        
        if (!driverDoc) {
            console.log("Driver not found, checking user collection");
            // If not found in driver collection, check user collection
            const userDoc = await User.findOne({ email: email, type: "driver" });
            
            if (!userDoc) {
                console.log("User not found");
                return res.status(404).json({ error: "Driver not found" });
            }
            
            // Compare passwords for user
            const isPasswordCorrect = await bcrypt.compare(password, userDoc.password);
            if (!isPasswordCorrect) {
                return res.status(401).json({ error: "Invalid password" });
            }

            const token = jwt.sign({
                id: userDoc._id,
                email: userDoc.email,
                type: 'driver'
            }, process.env.JWT_SECRET || "your-secret-key");

            return res.json({
                success: true,
                token,
                driver: {
                    _id: userDoc._id,
                    email: userDoc.email,
                    type: 'driver'
                }
            });
        }
        
        // Compare passwords for driver
        const isPasswordCorrect = await bcrypt.compare(password, driverDoc.DriverPW);
        if (!isPasswordCorrect) {
            return res.status(401).json({ error: "Invalid password" });
        }

        const token = jwt.sign({
            id: driverDoc._id,
            name: driverDoc.DriverName,
            email: driverDoc.DriverEmail,
            type: 'driver'
        }, process.env.JWT_SECRET || "your-secret-key");

        return res.json({
            success: true,
            token,
            driver: {
                _id: driverDoc._id,
                DriverName: driverDoc.DriverName,
                DriverEmail: driverDoc.DriverEmail,
                type: 'driver'
            }
        });
    } catch (error) {
        console.error("Login error:", error);
        return res.status(500).json({ error: "Internal server error" });
    }
}

export async function driverRegister(req, res) {
    try {
        const { DriverName, DriverPhone, DriverAdd, DriverEmail, DLNo, NICNo, DriverPW } = req.body;
        
        // Validate required fields
        if (!DriverName || !DriverPhone || !DriverAdd || !DriverEmail || !DLNo || !NICNo || !DriverPW) {
            return res.status(400).json({ error: 'All fields are required.' });
        }

        // Check if the driver already exists by NIC
        const existingDriver = await driver.findOne({ NICNo });
        if (existingDriver) {
            return res.status(400).json({ error: 'Driver with this NIC already exists.' });
        }

        // Check if the driver already exists by email
        const existingDriver2 = await driver.findOne({ DriverEmail });
        if (existingDriver2) {
            return res.status(400).json({ error: 'Driver with this email already exists.' });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(DriverPW, 10);

        // Create new driver
        const newDriver = new driver({
            DriverName,
            DriverPhone,
            DriverAdd,
            DriverEmail,
            DLNo,
            NICNo,
            DriverPW: hashedPassword
        });

        await newDriver.save();

        return res.status(201).json({
            success: true,
            message: 'Driver registered successfully',
            driver: {
                _id: newDriver._id,
                DriverName: newDriver.DriverName,
                DriverEmail: newDriver.DriverEmail
            }
        });
    } catch (error) {
        console.error('Registration error:', error);
        return res.status(500).json({ error: error.message });
    }
}

export async function driverFindOne(req, res) {
    try {
        const driverId = req.params.id;
        const driverDoc = await driver.findById(driverId);
        
        if (!driverDoc) {
            return res.status(404).json({ error: "Driver not found" });
        }

        return res.status(200).json({ 
            success: true,
            driver: {
                _id: driverDoc._id,
                DriverName: driverDoc.DriverName,
                DriverEmail: driverDoc.DriverEmail,
                DriverPhone: driverDoc.DriverPhone,
                DriverAdd: driverDoc.DriverAdd,
                DLNo: driverDoc.DLNo,
                NICNo: driverDoc.NICNo,
                type: 'driver'
            }
        });
    } catch (err) {
        return res.status(400).json({ error: err.message });
    }
} 
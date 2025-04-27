import driver from '../models/DriverModel.js'; 
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import dotenv from "dotenv";


dotenv.config();  
export async function  driverAdd (req, res){
    const data = req.body;
    const email = data.email;

    try {
        // Check if user already exists
        const existingUser = await driver.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "A Driver already exists with this email" });
        }

        // Hash password asynchronously
        data.password = await bcrypt.hash(data.password, 10);

        // Create new user
        const newDriver = new driver(data);
        await newDriver.save();

        // Send success response
        res.status(201).json({ message: "Driver added successfully!" });

    } catch (e) {
        console.error("Registration error:", e);
        return res.status(500).json({ error: "User registration failed!" });
    }
}


export async function driverFind(req, res) {
    try {
        const posts = await driver.find();
        
        if (posts.length === 0) {
            return res.status(404).json({ success: false, message: "No posts found" });
        }

        return res.status(200).json({ success: true,posts });
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

      const driverDoc = await driver.findOne({ DriverEmail: email });
      
      if (!driverDoc) {
          console.log("Driver not found");
          return res.status(404).json({ error: "Driver not found" });
      }
      
      console.log("Found driver:", driverDoc.DriverName);
      
      // Compare passwords
      const isPasswordCorrect = await bcrypt.compare(password, driverDoc.DriverPW);
      console.log("Password comparison result:", isPasswordCorrect);
      
      if (isPasswordCorrect) {
          const token = jwt.sign({
              id: driverDoc._id,
              name: driverDoc.DriverName,
              email: driverDoc.DriverEmail,
              phone: driverDoc.DriverPhone,
              address: driverDoc.DriverAdd,
              licenseNo: driverDoc.DLNo,
              nicNo: driverDoc.NICNo,
              type: 'driver'
          }, process.env.JWT_SECRET || "your-secret-key");
          
          console.log("Login successful, token generated");
          return res.json({ 
              success: true,
              token, 
              driverId: driverDoc._id,
              user: {
                  id: driverDoc._id,
                  name: driverDoc.DriverName,
                  email: driverDoc.DriverEmail,
                  phone: driverDoc.DriverPhone,
                  address: driverDoc.DriverAdd,
                  licenseNo: driverDoc.DLNo,
                  nicNo: driverDoc.NICNo,
                  type: 'driver'
              }
          });
      } else {
          console.log("Password incorrect");
          return res.status(401).json({ error: "Invalid password" });
      }
  } catch (e) {
      console.error("Login error:", e);
      return res.status(500).json({ error: "Internal server error", details: e.message });
  }
}

export async function driverRegister(req, res) {
    try {
      const { DriverName, DriverPhone, DriverAdd, DriverEmail, DLNo, NICNo, DriverPW } = req.body;
      
      console.log("Registration attempt for:", DriverEmail);

      // Check if the driver already exists
      const existingDriver = await driver.findOne({ NICNo });
      if (existingDriver) {
        console.log("Driver with NIC already exists");
        return res.status(400).json({ error: 'Driver with this NIC already exists.' });
      }

      // Check if the driver already exists
      const existingDriver2 = await driver.findOne({ DriverEmail });
      if (existingDriver2) {
        console.log("Driver with email already exists");
        return res.status(400).json({ error: 'Driver with this email already exists.' });
      }

      // Validate NIC number
      if (NICNo.length !== 10) {
        return res.status(400).json({ error: 'NIC number must be exactly 10 characters.' });
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

      // Hash password
      console.log("Hashing password...");
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(DriverPW, salt);
      console.log("Password hashed successfully");
  
      // Generate a unique Driver ID
      const latestDriver = await driver.findOne().sort({ DriverID: -1 });
      const newDriverID = latestDriver ? latestDriver.DriverID + 1 : 1001;

      // Create and save the new driver
      const newDriver = new driver({
          DriverID: newDriverID,
          DriverName,
          DriverPhone,
          DriverAdd,
          DriverEmail,
          DLNo,
          NICNo,
          DriverPW: hashedPassword
      });
  
      console.log("Saving new driver...");
      await newDriver.save();
      console.log("Driver saved successfully");

      return res.status(200).json({ 
        success: 'Driver registered successfully!',
        driver: {
          DriverID: newDriver.DriverID,
          DriverName: newDriver.DriverName,
          DriverEmail: newDriver.DriverEmail
        }
      });
    } catch (err) {
      console.error("Registration error:", err);
      return res.status(500).json({ error: err.message });
    }
}




  //get specific driver

  export const driverFindOne = async (req, res) => {
    try {
        const driverone = await driver.findById(req.params.id);
        if (!driverone) {
            return res.status(404).json({ success: false, message: "Driver not found" });
        }
        res.status(200).json({ success: true, driverone });
    } catch (error) {
        console.error("Error finding driver:", error);
        res.status(500).json({ success: false, message: "Server error", error: error.message });
    }
};
  
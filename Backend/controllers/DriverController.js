import driver from '../models/DriverModel.js'; 
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import dotenv from "dotenv";


dotenv.config();  
export async function  driverAdd (req, res){
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
  const { DriverEmail, DriverPW } = req.body;

  try {
      console.log("Login attempt for:", DriverEmail);
      
      if (!DriverEmail || !DriverPW) {
          console.log("Missing email or password");
          return res.status(400).json({ error: "Email and password are required" });
      }

      const driverDoc = await driver.findOne({ DriverEmail });
      
      if (!driverDoc) {
          console.log("Driver not found");
          return res.status(404).json({ error: "Driver not found" });
      }
      
      console.log("Found driver:", driverDoc.DriverName);
      
      // Compare passwords
      const isPasswordCorrect = await bcrypt.compare(DriverPW, driverDoc.DriverPW);
      console.log("Password comparison result:", isPasswordCorrect);
      
      if (isPasswordCorrect) {
          const token = jwt.sign({
              DriverName: driverDoc.DriverName,
              DriverPhone: driverDoc.DriverPhone,
              DriverAdd: driverDoc.DriverAdd,
              DriverEmail: driverDoc.DriverEmail,
              DLNo: driverDoc.DLNo,
              NICNo: driverDoc.NICNo
          }, "Amindu123");
          
          console.log("Login successful, token generated");
          return res.json({ 
              message: "Login successful", 
              token, 
              driver: {
                  _id: driverDoc._id,
                  DriverName: driverDoc.DriverName,
                  DriverEmail: driverDoc.DriverEmail,
                  DriverPhone: driverDoc.DriverPhone,
                  DriverAdd: driverDoc.DriverAdd,
                  DLNo: driverDoc.DLNo,
                  NICNo: driverDoc.NICNo
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
  
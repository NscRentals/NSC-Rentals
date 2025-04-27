import User from "../models/user.js";
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import dotenv from "dotenv";
import profileUpload from "../middlewares/multerProfile.js";
import fs from "fs";
import path from "path";
import driver from "../models/DriverModel.js";
import Technician from "../models/technician.js";

dotenv.config();  



//Customer registration
export async function registerUser(req, res) {
    const data = req.body;
    const email = data.email;

    try {
        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "A user already exists with this email" });
        }

        // Hash password asynchronously
        data.password = await bcrypt.hash(data.password, 10);

        // Create new user
        const newUser = new User(data);
        await newUser.save();

        // Send success response
        res.status(201).json({ message: "User added successfully!" });

    } catch (e) {
        console.error("Registration error:", e);
        return res.status(500).json({ error: "User registration failed!" });
    }
}


//user login for admins and customers

export async function loginUser(req, res) {
    const { email, password } = req.body;

    try {
        let user = await User.findOne({ email });
        let role = null;

        if (!user) {
            user = await driver.findOne({ email });
            if (user) role = "driver";
        }

        if (!user) {
            user = await Technician.findOne({ email });
            if (user) role = "technician";
        }

        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        // Determine role if not already set (for User model)
        if (!role) {
            role = user.type; // "admin" or "customer"
        }

        // Validating the password
        const isPasswordCorrect = bcrypt.compareSync(password, user.password);
        if (!isPasswordCorrect) {
            return res.status(401).json({ error: "Invalid credentials" });
        }


        const tokenPayload = {
            id: user._id,
            //If the role is "admin" or "customer", use user.firstName.otherwise its null
            firstName: role === "admin" || role === "Customer" ? user.firstName : null,
            //same
            lastName: role === "admin" || role === "Customer" ? user.lastName : null,
            address:  role === "Customer" ? user.address.street : null,
            name: role === "driver" || role === "technician" ? user.name : null,
            email: user.email,
            phone: user.phone || "",
            type: role,
            profilePicture: role === "admin" || role === "Customer" ? user.profilePicture || null : null,
        };

        // Generate JWT token
        const token = jwt.sign(tokenPayload, process.env.JWT_SECRET, { expiresIn: "1d" });

        res.json({
            message: "Login successful",
            token,
            user: tokenPayload,
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal server error" });
    }
}

//admin registration(Authorization needed as admin)

export async function adminRegister(req,res){

    const data = req.body;
    const user = req.user;
    const email = data.email;
    if(user==null||user.type!= "admin"){

        res.json({ message : "Please Login as an Admin to perform this task"})
        
 
    }else{

        try{

        const existingUser = await User.findOne({ email });
        if(existingUser){

        res.json({

            message : "An user is already exist in this email"
        })
        return;

        }

            //hashing password 
            data.password = bcrypt.hashSync(data.password,10)
            //making the type - admin
            data.type = "admin"

            const newAdmin = new User(data)
            await newAdmin.save()

            res.json({ message : " Admin added successfully!"})


        }catch(e){

            res.status().json({ message : "Error occured"})

        }
    }


}

//to get all the users to the admin dashboard

export async function getAllUsers(req,res){

    const data = req.body;
    const user = req.user;

    if(isItAdmin(req)){

        const users = await User.find();
        res.json(users);

    }else{

        res.json({message : " Authorization is needed "})
    }
}


//User to get their Details

export async function getUserDetails(req,res){

    const email = req.user.email;
    const user = await User.findOne({ email })

    res.json(user);
    
}



// Change Password Controller
export async function changePassword(req, res) {


    try {

        const  newPassword  = req.body.password;
        const email = req.user.email; 


        // Hash the new password
        const hashedPassword = await bcrypt.hash(newPassword, 10);

        // Update the password in the database
        const result = await User.updateOne(
            { email }, { $set: { password: hashedPassword } } // Update password field
        );

        if (result.matchedCount === 0) {
            return res.status(404).json({ message: "User not found" });
        }

        res.status(200).json({ message: "Password changed successfully" });
    } catch (error) {
        console.error("Error changing password:", error);
        res.status(500).json({ message: "Failed to change password" });
    }
}


//update user

export async function updateUser(req, res){

    try{

        const data = req.body;
        const user = req.user;
        const email = req.body.email;

    if(user.email==req.body.email){

        await User.updateOne({email:email},data);
        res.json({ message : " update sucessful!"})

    }else{

        res.json({ message : "you are not authorized to perform this task!"})
    }

}catch(e){

    res.status(500).json({message :"Update Failed!"});
}

}




// Delete user and their profile picture
export async function deleteUser(req, res) {
    try {
        const data = req.body;
        const user = req.user;
        const email = req.body.email;

        const deleteUser = await User.findOne({ email: email });

        if (deleteUser == null) {
            res.json({ message: "No user found for this email!" });
            return;
        }

        // Check if the user is allowed to delete (admin or their own account)
        if (isItAdmin(req) || req.user.email === req.body.email) {
            // Delete profile picture if it exists
            if (deleteUser.profilePicture) {
                const filePath = path.join("./uploads/profile_pictures", deleteUser.profilePicture);
                if (fs.existsSync(filePath)) {
                    fs.unlinkSync(filePath);
                }
            }

            // Delete the user from the database
            await User.deleteOne({ email: email });

            res.json({ message: "User successfully deleted!" });
        } else {
            res.json({ message: "You can't delete other users' accounts!" });
        }
    } catch (e) {
        console.error("Error deleting user:", e);
        res.status(500).json({ message: "Failed to delete the user!" });
    }
}



//checking whether the user is Admin

export function isItAdmin (req){

    let isAdmin = false;

    if(req.user!= null){

        if(req.user.type=="admin"){

            isAdmin=true;
        }
    }

    return isAdmin;
}

//checking whether the user is a Customer 
export function isItCustomer(req) {
	let isCustomer = false;

	if (req.user != null) {
		if (req.user.type == "customer") {
			isCustomer = true;
		}
	}

	return isCustomer;
}


// Profile picture upload function
export async function updateProfilePicture(req, res) {
    try {
        if (!req.file) return res.status(400).json({ message: "No file uploaded" });

        const email = req.user.email; // Assuming `req.user` contains authenticated user info
        const user = await User.findOne({ email });
        if (!user) return res.status(404).json({ message: "User not found" });

        // Delete old profile picture if it exists
        if (user.profilePicture) {
            const oldPath = path.join("./uploads/profile_pictures", user.profilePicture);
            if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
        }

        // Save new profile picture
        user.profilePicture = req.file.filename;
        await user.save();

        res.json({ message: "Profile picture updated!", profilePicture: user.profilePicture });

    } catch (e) {
        console.error("Error updating profile picture:", e);
        res.status(500).json({ message: "Failed to update profile picture" });
    }
}
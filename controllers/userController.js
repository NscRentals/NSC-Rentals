import User from "../models/user.js";
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import dotenv from "dotenv";

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

export async function loginUser(req,res){

    const data = req.body;

    try{
    const user =  await User.findOne({ email : data.email});
              
        if (user== null){
         res.status(404).json({ error : "User not found"});

            }else {
                const isPasswordCorrect = bcrypt.compareSync(data.password,user.password);

                if(isPasswordCorrect){

                    const token = jwt.sign({

                        firstName : user.firstName,
                        lastName: user.lastName,
                        email : user.email,
                        type : user.type
                        
                    },process.env.JWT_password)

                    res.json({ message: "Login successful" , token : token})
                }else{
                    
                    res.status(401).json({ error: "Login failed"})
                }
            }

        }catch(e){

            res.status().json(e);
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

    if(user.type=="admin"){

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

//user identity verification
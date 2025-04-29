import IdentityForm from "../models/identityForm.js";
import nodemailer from "nodemailer";
import dotenv from "dotenv";

// Load environment variables
dotenv.config();

// Create a transporter object using SMTP transport
const transporter = nodemailer.createTransport({
    service: 'gmail',
    host: 'smtp.gmail.com',
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    },
    tls: {
        rejectUnauthorized: false
    }
});

// Verify transporter configuration
transporter.verify(function(error, success) {
    if (error) {
        console.error('Transporter verification failed:', error);
    } else {
        console.log('Transporter is ready to send emails');
    }
});

export async function identityFormSave(req, res) {
    console.log("DEBUG: req.user in identityFormSave:", req.user);
    // Multer middleware will have already handled the file upload, so no need to call identityUpload here

    if (!req.files || !req.files.img1 || !req.files.img2) {
        return res.status(400).json({ message: "Both images are required" });
    }

    if (!req.user || !req.user.email || !req.user.phone) {
        return res.status(400).json({ message: "User authentication required!" });
    }

    if (!req.body || Object.keys(req.body).length === 0) {
        return res.status(400).json({ message: "Request body is empty!" });
    }

    const data = req.body;
    data.fullName = req.user.firstName + " " + req.user.lastName;
    data.email = req.user.email;
    data.phone = req.user.phone;
    data.address = req.user.address || ""; 
    data.type = req.body.type || "NIC";
    data.img1 = req.files.img1[0].filename;
    data.img2 = req.files.img2[0].filename;

    try {
        const existingForm = await IdentityForm.findOne({ email: data.email });
        if (existingForm) {
            return res.status(400).json({ message: "You have already submitted a form!" });
        }

        const newIdentityForm = new IdentityForm(data);
        await newIdentityForm.save();

        res.json({ message: "Identity form submitted successfully!" });

    } catch (e) {
        console.error("Error saving identity form:", e);
        res.status(500).json({ message: "Submission failed!" });
    }
}

//retrieving all the forms for admin dashboard
export async function getForms(req,res){
    const user = req.user.type;

    try {
        if(user=='admin'){
            // Only get forms that are neither verified nor rejected
            const forms = await IdentityForm.find({ 
                isVerified: false,
                isRejected: false 
            });
            res.json(forms);
        } else { 
            res.json({ message : "You are not allowed to perform this task!"});
        }
    } catch(e) {
        console.error("Error fetching forms:", e);
        res.status(500).json({ message : "An error occurred!"});
    }
}


//approving identityForm - Admins only
export async function approveUser(req, res) {
    try {
        if (req.user.type !== 'admin') {
            return res.status(403).json({ message: "You are not allowed to perform this task!" });
        }

        const { email } = req.body;
        if (!email) {
            return res.status(400).json({ message: "Email is required!" });
        }

        const updatedForm = await IdentityForm.findOneAndUpdate(
            { email },
            { isVerified: true },
            { new: true }
        );

        if (!updatedForm) {
            return res.status(404).json({ message: "Identity form not found!" });
        }

        // Send email to the user
        const mailOptions = {
            from: {
                name: 'NSC Car Rental',
                address: process.env.EMAIL_USER
            },
            to: email,
            subject: 'Account Verification - NSC Car Rental',
            text: 'You are now verified on our website!',
            html: `
                <div style="font-family: Arial, sans-serif; padding: 20px; max-width: 600px; margin: 0 auto;">
                    <h2 style="color: #4A7B3F; margin-bottom: 20px;">Account Verified!</h2>
                    <p style="font-size: 16px; line-height: 1.5; color: #333;">
                        Congratulations! Your account has been successfully verified on NSC Car Rental.
                    </p>
                    <p style="font-size: 16px; line-height: 1.5; color: #333;">
                        You now have full access to our services and can start renting cars.
                    </p>
                    <div style="margin-top: 30px; padding: 20px; background-color: #f5f5f5; border-radius: 5px;">
                        <p style="margin: 0; color: #666; font-size: 14px;">
                            If you have any questions, please don't hesitate to contact us.
                        </p>
                    </div>
                </div>
            `
        };

        console.log('Attempting to send email with options:', {
            from: mailOptions.from,
            to: mailOptions.to,
            subject: mailOptions.subject
        });

        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.error('Detailed email error:', {
                    message: error.message,
                    code: error.code,
                    response: error.response,
                    stack: error.stack
                });
            } else {
                console.log('Email sent successfully:', {
                    messageId: info.messageId,
                    response: info.response
                });
            }
        });

        res.json({ message: "Identity form approved successfully!", form: updatedForm });

    } catch (error) {
        console.error("Error approving identity form:", error);
        res.status(500).json({ message: "An error occurred!" });
    }
}

export async function rejectUser(req, res) {
    try {
        if (req.user.type !== 'admin') {
            return res.status(403).json({ message: "You are not allowed to perform this task!" });
        }
        const { email, reason } = req.body;
        if (!email) {
            return res.status(400).json({ message: "Email is required!" });
        }
        const updatedForm = await IdentityForm.findOneAndUpdate(
            { email }, 
            { isRejected: true }, 
            { new: true }
        );
        if (!updatedForm) {
            return res.status(404).json({ message: "Identity form not found!" });
        }

        // Send email to the user
        const mailOptions = {
            from: {
                name: 'NSC Car Rental',
                address: process.env.EMAIL_USER
            },
            to: email,
            subject: 'Account Verification Status - NSC Car Rental',
            text: 'Your account verification was not successful.',
            html: `
                <div style="font-family: Arial, sans-serif; padding: 20px; max-width: 600px; margin: 0 auto;">
                    <h2 style="color: #D32F2F; margin-bottom: 20px;">Account Verification Status</h2>
                    <p style="font-size: 16px; line-height: 1.5; color: #333;">
                        We regret to inform you that your account verification was not successful at this time.
                    </p>
                    <p style="font-size: 16px; line-height: 1.5; color: #333;">
                        Reason for rejection: ${reason}
                    </p>
                    <div style="margin-top: 30px; padding: 20px; background-color: #f5f5f5; border-radius: 5px;">
                        <p style="margin: 0; color: #666; font-size: 14px;">
                            If you believe this was a mistake or need further clarification, please contact our support team.
                        </p>
                    </div>
                </div>
            `
        };

        console.log('Attempting to send rejection email with options:', {
            from: mailOptions.from,
            to: mailOptions.to,
            subject: mailOptions.subject
        });

        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.error('Detailed rejection email error:', {
                    message: error.message,
                    code: error.code,
                    response: error.response,
                    stack: error.stack
                });
            } else {
                console.log('Rejection email sent successfully:', {
                    messageId: info.messageId,
                    response: info.response
                });
            }
        });

        res.json({ message: "Identity form rejected successfully!", form: updatedForm });
    } catch (error) {
        console.error("Error rejecting identity form:", error);
        res.status(500).json({ message: "An error occurred!" });
    }
}

export async function getUserForm(req, res) {
    try {
        if (!req.user || !req.user.email) {
            return res.status(400).json({ message: "User authentication required!" });
        }

        const form = await IdentityForm.findOne({ email: req.user.email });
        if (!form) {
            return res.json(null);
        }
        res.json(form);
    } catch (error) {
        console.error("Error fetching user form:", error);
        res.status(500).json({ message: "An error occurred while fetching your form!" });
    }
}

export async function deleteUserForm(req, res) {
    try {
        if (!req.user || !req.user.email) {
            return res.status(400).json({ message: "User authentication required!" });
        }

        const deletedForm = await IdentityForm.findOneAndDelete({ email: req.user.email });
        if (!deletedForm) {
            return res.status(404).json({ message: "No identity form found for this user." });
        }

        res.json({ message: "Identity form deleted successfully!" });
    } catch (error) {
        console.error("Error deleting identity form:", error);
        res.status(500).json({ message: "An error occurred while deleting the identity form." });
    }
}
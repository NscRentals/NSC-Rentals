import IdentityForm from "../models/identityForm.js";
import nodemailer from "nodemailer";
import dotenv from "dotenv";
import User from "../models/user.js";

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

// Add this common email template function
const getEmailTemplate = (content, isApproval = true) => `
<!DOCTYPE html>
<html>
<head>
  <style>
    body {
      font-family: Arial, sans-serif;
      line-height: 1.6;
      color: #333;
      max-width: 600px;
      margin: 0 auto;
    }
    .logo {
      text-align: center;
      padding: 20px;
      background-color: #2f4f2f;
      color: white;
      font-size: 24px;
      font-weight: bold;
      border-radius: 10px;
      margin-bottom: 20px;
    }
    .content {
      background-color: #f9f9f9;
      padding: 20px;
      border-radius: 10px;
      margin: 20px 0;
    }
    .status-header {
      color: ${isApproval ? '#4A7B3F' : '#D32F2F'};
      font-size: 24px;
      margin-bottom: 20px;
    }
    .footer {
      text-align: center;
      margin-top: 20px;
      padding: 20px;
      border-top: 1px solid #eee;
      font-size: 14px;
      color: #666;
    }
  </style>
</head>
<body>
  <div class="logo">
    NSC-RENTALS®
  </div>
  ${content}
  <div class="footer">
    <p>If you have any questions, please don't hesitate to contact our support team.</p>
    <p>Best regards,<br>The NSC-RENTALS Team</p>
  </div>
</body>
</html>
`;

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

        // Update both IdentityForm and User models
        const [updatedForm, updatedUser] = await Promise.all([
            IdentityForm.findOneAndUpdate(
                { email },
                { isVerified: true },
                { new: true }
            ),
            User.findOneAndUpdate(
                { email },
                { isVerified: true },
                { new: true }
            )
        ]);

        if (!updatedForm) {
            return res.status(404).json({ message: "Identity form not found!" });
        }

        if (!updatedUser) {
            return res.status(404).json({ message: "User not found!" });
        }

        const emailContent = `
            <div class="content">
                <h2 class="status-header">Account Verified!</h2>
                <p>Dear ${updatedForm.fullName},</p>
                <p>Congratulations! Your account has been successfully verified on NSC-RENTALS.</p>
                <p>You now have full access to our services and can start:</p>
                <ul>
                    <li>Booking vehicles</li>
                    <li>Accessing special offers</li>
                    <li>Using our premium features</li>
                </ul>
                <p>Thank you for choosing NSC-RENTALS for your car rental needs!</p>
            </div>
        `;

        const mailOptions = {
            from: {
                name: 'NSC-RENTALS',
                address: process.env.EMAIL_USER
            },
            to: email,
            subject: 'Account Verification Successful - NSC-RENTALS',
            html: getEmailTemplate(emailContent, true)
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
        console.error('Error approving user:', error);
        return res.status(500).json({ message: "Failed to approve user" });
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

        const emailContent = `
            <div class="content">
                <h2 class="status-header">Account Verification Status</h2>
                <p>Dear ${updatedForm.fullName},</p>
                <p>We have reviewed your account verification submission and regret to inform you that it was not successful at this time.</p>
                <div style="background-color: #fff; padding: 15px; border-radius: 5px; margin: 20px 0;">
                    <p style="margin: 0; color: #D32F2F;"><strong>Reason for rejection:</strong></p>
                    <p style="margin: 10px 0 0 0;">${reason}</p>
                </div>
                <p>You can submit a new verification request after addressing the issues mentioned above.</p>
                <p>If you believe this was a mistake or need further clarification, please don't hesitate to contact our support team.</p>
            </div>
        `;

        const mailOptions = {
            from: {
                name: 'NSC-RENTALS',
                address: process.env.EMAIL_USER
            },
            to: email,
            subject: 'Account Verification Status - NSC-RENTALS',
            html: getEmailTemplate(emailContent, false)
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
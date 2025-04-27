import IdentityForm from "../models/identityForm.js";

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

//retrieving all the forms for idmin dashboard

export async function getForms(req,res){

    const user = req.user.type;

    try {


    if(user=='admin'){

        const forms = await IdentityForm.find({ isVerified: false });
        res.json(forms);
    }else { 

        res.json({ message : "You are not allowed to perform this task!"})

    }

}catch(e){

    res.json({ message : " error occured!"})
    console.log(e);

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
            { email },{ isVerified: true },{ new: true }
        );

        if (!updatedForm) {
            return res.status(404).json({ message: "Identity form not found!" });
        }

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
        const { email } = req.body;
        if (!email) {
            return res.status(400).json({ message: "Email is required!" });
        }
        const updatedForm = await IdentityForm.findOneAndUpdate(
            { email }, { isReject: true }, { new: true }
        );
        if (!updatedForm) {
            return res.status(404).json({ message: "Identity form not found!" });
        }
        res.json({ message: "Identity form rejected successfully!", form: updatedForm });
    } catch (error) {
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
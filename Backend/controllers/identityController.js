import IdentityForm from "../models/identityForm";
import identityUpload from "../middlewares/multerIdentity.js";


export async function identityFormSave(req, res) {
    identityUpload(req, res, async (err) => {
        if (err) return res.status(400).json({ message: err.message });
        if (!req.files || !req.files.img1 || !req.files.img2) {
            return res.status(400).json({ message: "Both images are required" });
        }

        const data = req.body;
        data.fullName = req.user.firstName + " " + req.user.lastName;
        data.email = req.user.email;
        data.phone = req.user.phone;
        data.img1 = req.files.img1[0].filename;
        data.img2 = req.files.img2[0].filename;

        try {
            const existingForm = await IdentityForm.findOne({ email: data.email });
            if (existingForm) {
                return res.status(400).json({ message: "You have submitted a form already!" });
            }

            const newIdentityForm = new IdentityForm(data);
            await newIdentityForm.save();

            res.json({ message: "Identity form submitted successfully!" });

        } catch (e) {
            console.error("Error saving identity form:", e);
            res.status(500).json({ message: "Sending failed!" });
        }
    });
}

//retrieving all the forms for idmin dashboard

export async function getForms(req,res){

    const user = req.user.type;

    try {


    if(user=='admin'){

        const forms = await IdentityForm.findOne();
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

export async function approveUser(req,res){

    const data = req.body;
    
}

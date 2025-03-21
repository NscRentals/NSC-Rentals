import IdentityForm from "../models/identityForm";


export async function idntityFormSave(req,res){


    const data = req.body;
    req.body.fullName = req.user.firstName + " " + req.user.lastName;
    req.body.email = req.user.email;
    req.body.phone = req.user.phone;


    try {

        const user = data.email;
        const existingFrom = await IdentityForm.FindOne({ user });

        if(existingForm){

            res.json({ message : "You have submitted a form already!"});
            return;
        }

        const newIdentityForm = new IdentityForm(data);
        await newIdentityForm.save();



    }catch(e){

        console.log(e);
        res.status.json({ message : "Sending failed!"})
    }


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
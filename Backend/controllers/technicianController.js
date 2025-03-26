import technician from '../models/technicianModel.js'; 


export async function  technicianAdd (req, res){
    try {
        let newTechnician = new technician(req.body);
        await newTechnician.save(); 
        return res.status(200).json({ success: "Tech saved successfully" });
    } catch (err) {
        return res.status(400).json({ error: err.message });
    }
}


export async function technicianFind(req, res) {
    try {
        const tech = await technician.find();
        
        // if (tech.length === 0) {
        //     return res.status(404).json({ success: false, message: "No posts found" });
        // }

        return res.status(200).json({ success: true, tech });
    } catch (err) {
        return res.status(400).json({ error: err.message });
    }
}




export async function technicianUpdate(req, res) {
    try {
        let updatedTechnian = await technician.findByIdAndUpdate(
            req.params.id,  // Correctly passing the ID
            { $set: req.body },  // Setting new values
            { new: true, runValidators: true }  // Ensuring the updated document is returned and validated
        );

        if (!updatedTechnian) {
            return res.status(404).json({ error: "Post not found" });
        }

        return res.status(200).json({ success: "Updated successfully", updatedTechnian });
    } 
    catch (err) {
        return res.status(400).json({ error: err.message });
    }
}



export async function technicianDelete(req, res) {
    try {
        const deletedTechnician = await technician.findByIdAndDelete(req.params.id);

        if (!deletedTechnician) {
            return res.status(404).json({ error: "Post not found" });
        }

        return res.json({ message: "Delete successful", deletedTechnician });
    } catch (err) {
        return res.status(400).json({ error: err.message });
    }
}

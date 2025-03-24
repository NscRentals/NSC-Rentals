import Decoration from "../models/decorations.js";

// Function to generate the next sequential decoration ID
async function generateDecorationId() {
    const lastDeco = await Decoration.findOne().sort({ dId: -1 }); // Get last inserted decoration
    if (lastDeco) {
        const lastIdNumber = parseInt(lastDeco.dId.substring(1)); // Extract number from "D###"
        return `D${(lastIdNumber + 1).toString().padStart(3, "0")}`; // Increment and format
    }
    return "D001"; // Default for first entry
}

// Add decorations
export async function addDeco(req, res) {
    try {
        const generatedId = await generateDecorationId(); // Generate new dId

        let newDeco = new Decoration({
            dId: generatedId, // Auto-generated ID
            type: req.body.type, // Keep other fields as they are
        });

        await newDeco.save();
        return res.status(200).json({
            success: "Decoration saved successfully!",
            dId: generatedId, // Send back the generated ID
        });
    } catch (err) {
        return res.status(400).json({
            error: err.message,
        });
    }
}

// Get all decorations
export async function getDeco(req, res) {
    try {
        const deco = await Decoration.find();

        if (deco.length === 0) {
            return res.status(400).json({
                success: false,
                message: "No decorations found!",
            });
        }
        return res.status(200).json({ success: true, deco });
    } catch (err) {
        return res.status(500).json({
            error: err.message,
        });
    }
}

// Get decoration by ID
export async function getDecoById(req, res) {
    try {
        const { id } = req.params;
        const deco = await Decoration.findById(id);

        if (!deco) {
            return res.status(404).json({
                success: false,
                message: "Decoration not found!",
            });
        }

        return res.status(200).json({ success: true, deco });
    } catch (err) {
        return res.status(500).json({
            success: false,
            error: err.message,
        });
    }
}

// Update decoration
export async function updateDeco(req, res) {
    try {
        const { id } = req.params;
        const updatedData = req.body;

        const updatedDeco = await Decoration.findByIdAndUpdate(id, updatedData, { new: true });

        if (!updatedDeco) {
            return res.status(404).json({
                success: false,
                message: "Decoration not found!",
            });
        }
        return res.status(200).json({
            success: true,
            updatedDeco,
        });
    } catch (err) {
        return res.status(400).json({
            success: false,
            error: err.message,
        });
    }
}

// Delete decoration
export async function deleteDeco(req, res) {
    try {
        const deletedDeco = await Decoration.findByIdAndDelete(req.params.id);

        if (!deletedDeco) {
            return res.status(404).json({
                success: false,
                message: "Decoration not found!",
            });
        }
        return res.status(200).json({
            success: true,
            deletedDeco,
        });
    } catch (err) {
        return res.status(400).json({
            success: false,
            error: err.message,
        });
    }
}
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    // import Decoration from "../models/decorations.js"

    // //add decorations 
    // export async function addDeco (req,res){

    //     try{
    //         let newDeco = new Decoration (req.body);
    //         await newDeco.save();
    //         return res.status(200).json({
    //             success: "Decoration saved successfully!"
    //         });
    //     } catch (err){
    //         return res.status(404).json({
    //             error:err
    //         });
    //     }    
    // }

    // //get decorations
    // export async function getDeco (req,res){

    //     try{
    //         const deco = await Decoration.find();

    //         if(deco.length===0){
    //             return res.status(400).json({
    //                 success: false,
    //                 message: "No decos found!"
    //             });
    //         }
    //         return res.status(200).json({ success: true, deco });

    //     }catch(err){
    //         return res.status(404).json({ 
    //             error: err.message 
    //         });
    //     }
    // }

    // //get decorations by id
    
    // export async function getDecoById(req, res) {
    //     try {
    //         const { id } = req.params; // Extracting ID from request parameters
    //         const deco = await Decoration.findById(id); // Finding decoration by ID

    //         if (!deco) {
    //             return res.status(404).json({
    //                 success: false,
    //                 message: "Decoration not found!"
    //             });
    //         }

    //         return res.status(200).json({ success: true, deco });

    //     } catch (err) {
    //         return res.status(500).json({
    //             success: false,
    //             error: err.message
    //         });
    //     }
    // }


    // //update decorations
    // export async function updateDeco(req,res){
    //     try {
    //         const { id } = req.params;
    //         const updatedData = req.body;

    //         const updatedDeco = await Decoration.findByIdAndUpdate(id, updatedData, { new: true });

    //         if (!updatedDeco){
    //             return res.status(404).json({
    //                 success: false,
    //                 message: "Decoration not found!"
    //             });
    //         }
    //         return res.status(200).json({
    //             success: true,
    //             updateDeco
    //         });
    //     } catch(err){
    //         return res.status(400).json({
    //             success: false,
    //             error: err.message
    //         });
    //     }
    // }

    // //delete decorations
    // export async function deleteDeco (req,res){
    //     try{
    //         const deletedDeco = await Decoration.findByIdAndDelete(req.params.id);

    //         if (!deletedDeco){
    //             return res.status(404).json({
    //                 success: false,
    //                 message: "Decoration not found!"
    //             });
    //         }
    //         return res.status(200).json({
    //             success: true,
    //             deleteDeco  
    //         });
    //     } catch(err){
    //         return res.status(400).json({
    //             success: false,
    //             error: err.message
    //         });
    //     }
    // }
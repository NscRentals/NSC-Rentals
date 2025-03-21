    import Decoration from "../models/decorations.js"

    //add decorations 
    export async function addDeco (req,res){

        try{
            let newDeco = new Decoration (req.body);
            await newDeco.save();
            return res.status(200).json({
                success: "Decoration saved successfully!"
            });
        } catch (err){
            return res.status(404).json({
                error:err
            });
        }    
    }

    //get decorations
    export async function getDeco (req,res){

        try{
            const deco = await Decoration.find();

            if(deco.length===0){
                return res.status(400).json({
                    success: false,
                    message: "No decos found!"
                });
            }
            return res.status(200).json({ success: true, deco });

        }catch(err){
            return res.status(404).json({ 
                error: err.message 
            });
        }
    }

    //update decorations
    export async function updateDeco(req,res){
        try {
            const { id } = req.params;
            const updatedData = req.body;

            const updatedDeco = await Decoration.findByIdAndUpdate(id, updatedData, { new: true });

            if (!updatedDeco){
                return res.status(404).json({
                    success: false,
                    message: "Decoration not found!"
                });
            }
            return res.status(200).json({
                success: true,
                updateDeco
            });
        } catch(err){
            return res.status(400).json({
                success: false,
                error: err.message
            });
        }
    }

    //delete decorations
    export async function deleteDeco (req,res){
        try{
            const deletedDeco = await Decoration.findByIdAndDelete(req.params.id);

            if (!deletedDeco){
                return res.status(404).json({
                    success: false,
                    message: "Decoration not found!"
                });
            }
            return res.status(200).json({
                success: true,
                deleteDeco  
            });
        } catch(err){
            return res.status(400).json({
                success: false,
                error: err.message
            });
        }
    }
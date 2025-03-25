import sparePartsInventory from "../models/sparePartsInventory.js";

//Add a new spare parts
export async function addSpareParts(req, res) {

    if(req.user == null){
        res.status(401).json({
          message : "Please login and try again"
        })
        return
      }
      if(req.user.type !="admin"){
        res.status(403).json({
          message : "You are not authorized to perform this action"
        })
        return
    }

    const data = req.body;
    const newSpareParts = new sparePartsInventory(data);
    try{
        await newSpareParts.save() 
        res.json({
            message : "Spare parts added successfully"});
     }catch(error){
        res.status(500).json({
            error : "Spare parts could not be added"
        })
    }
}


//Get all spare parts
export async function getSpareParts(req, res) {
  // Check if user is authenticated
  if (!req.user) {
    return res.status(401).json({
      message: "Please login and try again"
    });
  }

  // Check if the user has the proper role
  if (req.user.type !== "admin" && req.user.type !== "Technician") {
    return res.status(403).json({
      message: "You are not authorized to perform this action"
    });
  }

  // Attempt to fetch spare parts
  try {

    const spareParts = await sparePartsInventory.find();
    return res.json(spareParts);

  } catch (error) {
    return res.status(500).json({
      error: "Error fetching spare parts",
      details: error
    });
  }
}



//Get a single spare part by ID
export async function getSparePartById(req, res) {
   if (!req.user) {
         res.status(401).json({ 
            message: "Please login and try again" 
        })
        return
      }
      if (req.user.type !== "admin" && req.user.type !== "Technician") {
         res.status(403).json({
             message: "You are not authorized to perform this action"
         })
        return
      }
      const id = req.params.id;
      try {
        const sparePart = await sparePartsInventory.findById(id);
        if (!sparePart) {
           res.status(404).json({ 
            error: "Spare part not found"
         })
         return
        }
        res.json(sparePart);
      } catch (error) {
        res.status(500).json({
             error: "Error fetching spare part", details: error
         });
      }
    }

    
  //Update a spare part by ID
  export async function updateSparePart(req, res) {

    if (!req.user) {
         res.status(401).json({ 
            message: "Please login and try again" 
        })
        return
      }
      if (req.user.type !== "admin") {
         res.status(403).json({ 
            message: "You are not authorized to perform this action" 
        });
        return
      }
      const id = req.params.id;
      const updatedData = req.body;

      // Automatically update the lastUpdated field
      updatedData.lastUpdated = Date.now();
      try {
        const updatedSparePart = await sparePartsInventory.findByIdAndUpdate(id, updatedData, { new: true });
        if (!updatedSparePart) {
           res.status(404).json({
             error: "Spare part not found" 
            });
         return
        }
        res.json({ 
            message: "Spare part updated successfully", sparePart: updatedSparePart });
      } catch (error) {
        res.status(500).json({ 
            error: "Error updating spare part", details: error 
        });
      }
    }


  //Delete a spare part by ID
  export async function deleteSparePart(req, res) {

    if (!req.user) {
         res.status(401).json({ 
            message: "Please login and try again" 
        });
        return
      }
      if (req.user.type !== "admin") {
        res.status(403).json({ 
            message: "You are not authorized to perform this action" 
        });
        return
      }
      const id = req.params.id;
      try {
        const deletedSparePart = await sparePartsInventory.findByIdAndDelete(id);
        if (!deletedSparePart) {
          return res.status(404).json({ 
            error: "Spare part not found" 
        });
        }
        res.json({ message:
             "Spare part deleted successfully" 
            });
      } catch (error) {
        res.status(500).json({ 
            error: "Error deleting spare part", details: error
         });
      }
    }

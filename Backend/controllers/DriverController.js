import driver from '../models/DriverModel.js'; 


// export async function  driverAdd (req, res){
//     try {
//         let newPost = new driver(req.body);
//         await newPost.save(); 
//         return res.status(200).json({ success: "Post saved successfully" });
//     } catch (err) {
//         return res.status(400).json({ error: err.message });
//     }
// }


export async function driverFind(req, res) {
    try {
        const posts = await driver.find();
        
        if (posts.length === 0) {
            return res.status(404).json({ success: false, message: "No posts found" });
        }

        return res.status(200).json({ success: true,posts });
    } catch (err) {
        return res.status(400).json({ error: err.message });
    }
}




export async function driverUpdate(req, res) {
    try {
        let updatedPost = await driver.findByIdAndUpdate(
            req.params.id,  // Correctly passing the ID
            { $set: req.body },  // Setting new values
            { new: true, runValidators: true }  // Ensuring the updated document is returned and validated
        );

        if (!updatedPost) {
            return res.status(404).json({ error: "Post not found" });
        }

        return res.status(200).json({ success: "Updated successfully", updatedPost });
    } 
    catch (err) {
        return res.status(400).json({ error: err.message });
    }
}




export async function driverDelete(req, res) {
    try {
        const deletedPost = await driver.findByIdAndDelete(req.params.id);

        if (!deletedPost) {
            return res.status(404).json({ error: "Post not found" });
        }

        return res.json({ message: "Delete successful", deletedPost });
    } catch (err) {
        return res.status(400).json({ error: err.message });
    }
}




export async function driverRegister(req, res) {
    try {
      const { DriverName, DriverPhone, DriverAdd, DriverEmail,DLNo,NICNo, DriverPW } = req.body;
      
      // Check if the driver already exists
      const existingDriver = await driver.findOne({ DriverName });
      if (existingDriver) {
        return res.status(400).json({ error: 'Driver with this email already exists.' });
      }
  
      // Generate a unique Driver ID
      const latestDriver = await driver.findOne().sort({ DriverID: -1 });
      const newDriverID = latestDriver ? latestDriver.DriverID + 1 : 1001; // Start from 1001

      console.log("Generated Driver ID:", newDriverID);

      // Create and save the new driver
      const newDriver = new driver({
          DriverID: newDriverID,
          DriverName,
          DriverPhone,
          DriverAdd,
          DriverEmail,
          DLNo,
          NICNo,
          DriverPW

      });
  
      await newDriver.save();
      return res.status(200).json({ success: 'Driver registered successfully!' });
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  }




  //get specific driver

  export const driverFindOne = async (req, res) => {
    try {
      const driverone = await driver.findById(req.params.id);
      if (!driver) {
        return res.status(404).json({ success: false, message: "Driver not found" });
      }
      res.status(200).json({ success: true, driverone });
    } catch (error) {
      res.status(500).json({ success: false, message: "Server error", error });
    }
  };
  
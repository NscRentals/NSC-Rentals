import driver from '../models/DriverModel.js'; 


export async function  driverAdd (req, res){
    try {
        let newPost = new driver(req.body);
        await newPost.save(); 
        return res.status(200).json({ success: "Post saved successfully" });
    } catch (err) {
        return res.status(400).json({ error: err.message });
    }
}


export async function driverFind(req, res) {
    try {
        const posts = await driver.find();
        
        if (posts.length === 0) {
            return res.status(404).json({ success: false, message: "No posts found" });
        }

        return res.status(200).json({ success: true, posts });
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




   

  /*  Post.findByIdAndUpdate(
        req.params.id,
        {
            $set: req.body
        },
        (err,post)=>{
            if(err){
                return res.status(400).json({error:err});   
            }

            return res.status(200).json({
                success:"Updated successfully"
            });

        }
        
    );
*/


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

import damageRequest from '../models/damageRequest.js';
import { isItAdmin } from './userController.js';

//------User Functions------
//User add a vehicle damage request
export async function addDamageRequest(req, res) {
    if(!req.user){
        res.status(401).json({
            message : "Please login and try again"
        })
        return;
    }

    if(req.user.type != "Customer"){
        res.status(401).json({
            message : "Only registers users can add damage requests"
        })
        return;
    }

    const data = req.body;

    const newRequest = new damageRequest(data);
    try{
        await newRequest.save();
        res.json({
             message : "Damage request added successfully!",
            });
        }catch(error){
            res.status(500).json({
                message : "Error Failed to submit damage request",
                error : error.message});
            }
   }

   //User get all their damage requests
   export async function getUserDamageRequests(req, res) {
    if(!req.user){
        res.status(401).json({
            message : "Please login and try again"
        })
        return;
    }

    if(req.user.type != "Customer"){
        res.status(403).json({
            message : "Only registers users can view their damage requests"
        })
        return;
    }

    try{
        const requests = await damageRequest.find(  );
        res.json(requests);
    }catch(error){
        res.status(500).json({
            message : "Failed to retrive damage requests",
            error : error.message
        });
    }
}

    //User delete a damage request
    export async function deleteDamageRequest(req, res) {
        if(!req.user){
            res.status(401).json({
                message : "Please login and try again"
            })
            return;
        }
    
        if(req.user.type != "Customer"){
            res.status(403).json({
                message : "Only registers users can delete their damage requests"
            })
            return;
        }
    
        try{
           const { id } = req.params;
            const request =  await damageRequest.deleteOne({ _id: id });
            ;
            if(!request){
                res.status(404).json({
                    message : "Damage request not found"
                });
                return;
            }
            if(request.userId != req.user.id){
                res.status(403).json({
                    message : "You are not allowed to delete this damage request"
                });
                return;
            }
            await damageRequest.deleteOne({id : id});
            res.json({
                message : "Damage request deleted successfully"
            });
        }catch (error){
            res.status(500).json({
                message : "Failed to delete damage request",
                error : error.message
            });
        }
    }

//------Technicin Functions------
//technician get all damage requests
export async function getTechnicianDamageRequest(req, res) {
    if(!req.user){
        res.status(401).json({
            message : "Please login and try again"
        })
        return;
    }

    if(req.user.type != "Technician"){
        res.status(403).json({
            message : "Only technicians can view damage requests"
        })
        return;
    }

    try{
        //Technicians can view all damage requests
        const requests = await damageRequest.find();
        res.json(requests);
    }catch(error){
        res.status(500).json({
            message : "Failed to retrive damage requests",
            error : error.message
        });
    }
}

//Technician update the status for a damage request
export async function updateDamageRequestStatus(req,res){
   if(!req.user){
        res.status(401).json({
            message : "Please login and try again"
        })
        return;
    }

    //Allow Tchnicians and Admins update the damage request
    if(req.user.type != "Technician" && !isItAdmin(req)){
        res.status(403).json({
            message : "You are not authorized to update this damage request"
        })
        return;
    }
    try{
        const{id} = req.params;
        const data = req.body;
        await damageRequest,updateOne(
            {_id : id},
            {status : data.status}
        )
    }catch(error){
        res.status(500).json({
            message : "Failed to update damage request",
            error : error.message
        });
    }
}

//Admin delete a damage request
export async function deleteVehicleDamageRequest(req, res) {
    if(!req.user){
        res.status(401).json({
            message : "Please login and try again"
        })
        return;
    }

    if(!isItAdmin(req)){
        res.status(403).json({
            message : "Only Admins can delete damage requests"
        })
        return;
    }

    try{
       const { id } = req.params;
        await damageRequest.deleteOne({ _id: id });
       res.json({message : "Damage request deleted successfully"});
}catch (error){
    res.status(500).json({
        message : "Failed to delete damage request",
        error : error.message
    });
}
}



       
    

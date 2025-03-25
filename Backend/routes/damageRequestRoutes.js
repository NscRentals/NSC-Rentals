import express from 'express';
import { addDamageRequest, getUserDamageRequests, deleteDamageRequest, getTechnicianDamageRequest, updateDamageRequestStatus, deleteVehicleDamageRequest} from '../controllers/damageRequestController.js';

const damageRequestRouter = express.Router();

//User added a damage request
damageRequestRouter.post("/", addDamageRequest);

//User get all their damage requests
damageRequestRouter.get("/", getUserDamageRequests);

//User delete a damage request
damageRequestRouter.delete("/:id", deleteDamageRequest);

//Technician get all damage requests
damageRequestRouter.get("/tech", getTechnicianDamageRequest);

//Update damage request statu
damageRequestRouter.put("/", updateDamageRequestStatus);

//Admin delete a damage request
damageRequestRouter.delete("/admin/:id", deleteVehicleDamageRequest);

export default damageRequestRouter;
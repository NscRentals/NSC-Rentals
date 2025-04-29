//onst express =require('express');
//const Post = require('../models/post');

import express from 'express';
import driver from '../models/DriverModel.js';
import { driverAdd, driverLogin } from '../controllers/DriverController.js'; 
import { driverFind } from '../controllers/DriverController.js';
import { driverUpdate } from '../controllers/DriverController.js';
import { driverDelete } from '../controllers/DriverController.js';  
import { driverRegister } from '../controllers/DriverController.js';
import { driverFindOne } from '../controllers/DriverController.js';
import { 
    setAvailability, 
    getAvailability, 
    getAvailableDrivers, 
    getDriverSchedule 
} from '../controllers/driveravailabilityController.js';

const driverRouter = express.Router();

// Driver availability routes (must be first)
driverRouter.post('/availability', setAvailability);
driverRouter.get('/availability/schedule/:driverId', getDriverSchedule);
driverRouter.get('/availability/available/:date', getAvailableDrivers);
driverRouter.get('/availability/:date', getAvailability);

// Driver management routes
driverRouter.post('/add', driverAdd);
driverRouter.get('/', driverFind);
driverRouter.put('/update/:id', driverUpdate);
driverRouter.delete('/delete/:id', driverDelete);
driverRouter.post('/register', driverRegister);
driverRouter.post("/login", driverLogin);

// This route should be last as it's the most generic
driverRouter.get('/:id', driverFindOne);

export default driverRouter;
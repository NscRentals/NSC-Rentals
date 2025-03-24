//onst express =require('express');
//const Post = require('../models/post');

import express from 'express';
import driver from '../models/DriverModel.js';
import { driverAdd } from '../controllers/DriverController.js'; 
import { driverFind } from '../controllers/DriverController.js';
import { driverUpdate } from '../controllers/DriverController.js';
import { driverDelete } from '../controllers/DriverController.js';  
import { driverRegister } from '../controllers/DriverController.js';
import { driverFindOne } from '../controllers/DriverController.js';

const driverRouter = express.Router();

//save posts

driverRouter.post('/add', driverAdd);
driverRouter.get('/', driverFind);
driverRouter.put('/update/:id', driverUpdate);
driverRouter.delete('/delete/:id', driverDelete);
driverRouter.post('/register', driverRegister);

driverRouter.get('/:id', driverFindOne);



export default driverRouter;
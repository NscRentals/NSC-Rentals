//onst express =require('express');
//const Post = require('../models/post');

import express from 'express';
import Driver from '../models/DriverModel.js';  
import { driverAdd } from '../controllers/DriverController.js'; 
import { driverFind } from '../controllers/DriverController.js';
import { driverUpdate } from '../controllers/DriverController.js';
import { driverDelete } from '../controllers/DriverController.js';  

const router = express.Router();

//save posts

router.post('/driver/add', driverAdd);
router.get('/driver', driverFind);
router.put('/driver/update/:id', driverUpdate);
router.delete('/driver/delete/:id', driverDelete);


//update post

//delete post

export default router;
//onst express =require('express');
//const Post = require('../models/post');

import express from 'express';
import technician from '../models/technicianModel.js';
import { technicianAdd } from '../controllers/technicianController.js'; 
import { technicianFind } from '../controllers/technicianController.js';
import { technicianUpdate } from '../controllers/technicianController.js';
import { technicianDelete } from '../controllers/technicianController.js';  

const technicianRouter = express.Router();

//save posts

technicianRouter.post('/add', technicianAdd);
technicianRouter.get('/find', technicianFind);
technicianRouter.put('/update/:id', technicianUpdate);
technicianRouter.delete('/delete/:id', technicianDelete);


//update post

//delete post

export default technicianRouter;
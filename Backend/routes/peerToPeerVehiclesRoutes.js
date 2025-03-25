import express from 'express';

import { addNewVehicle, getVehicles } from '../controllers/peerToPeerVehiclesController.js';

const peerToPeerVehiclesRouter = express.Router();

peerToPeerVehiclesRouter.post('/', addNewVehicle);
peerToPeerVehiclesRouter.get('/', getVehicles);

export default peerToPeerVehiclesRouter;
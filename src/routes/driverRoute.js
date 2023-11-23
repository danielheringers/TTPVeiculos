import express from 'express';
import { createDriverController, deleteDriverController, listDriverController, recoveryDriverController, updateDriverController } from '../controllers/driverController.js';


export const driverRouter = express.Router();

driverRouter.post('', createDriverController);
driverRouter.delete('/:id', deleteDriverController);
driverRouter.patch('/recovery/:id', recoveryDriverController);
driverRouter.patch('/update/:id', updateDriverController);
driverRouter.get('/:filter?', listDriverController);
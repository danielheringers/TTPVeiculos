import express from 'express';
import { createCarController, deleteCarController, listCarController, recoveryCarController, updateCarController } from "../controllers/carController.js"


export const carRouter = express.Router();

carRouter.patch('/recovery/:id', recoveryCarController);
carRouter.patch('/update/:id', updateCarController)
carRouter.get('/:filter', listCarController);
carRouter.get('/:filter?/:filterB?', listCarController);
carRouter.post('/', createCarController);
carRouter.delete('/:id', deleteCarController);


import express from 'express';
import { startCarUtilizationController, endCarUtilizationController, listCarUtilizationController } from '../controllers/carUtilizationController.js';

export const carUtilizationRouter = express.Router();

carUtilizationRouter.post('/start', startCarUtilizationController);
carUtilizationRouter.post('/end/:driverId', endCarUtilizationController);
carUtilizationRouter.get('/', listCarUtilizationController)

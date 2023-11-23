import { startCarUtilizationService, endCarUtilizationService } from '../services/carUtilization/carUtilizationService.js';
import { listCarUtilizationService } from '../services/carUtilization/listCarUtilizationService.js';

export const startCarUtilizationController = async (req, res) => {
    const data = await startCarUtilizationService(req.body);
    return res.status(201).json(data);
};

export const endCarUtilizationController = async (req, res) => {
    const data = await endCarUtilizationService(req.params.driverId);
    return res.status(200).json(data);
};

export const listCarUtilizationController = async (req, res) => {
    const data = await listCarUtilizationService(req);
    return res.status(200).json(data);
};
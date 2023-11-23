import { startCarUtilizationService, endCarUtilizationService } from '../services/carUtilization/carUtilizationService.js';
import { listCarUtilizationService } from '../services/carUtilization/listCarUtilizationService.js';

export const startCarUtilizationController = async (req, res) => {
    try {
        const data = await startCarUtilizationService(req.body);
        return res.status(201).json(data);
    } catch (error) {
        console.error("Erro no controlador:", error.message);
        return res.status(500).json({ error: "Erro interno do servidor" });
    }
};

export const endCarUtilizationController = async (req, res) => {
    try {
        const data = await endCarUtilizationService(req.params.driverId);
        return res.status(200).json(data);
    } catch (error) {
        console.error("Erro no controlador:", error.message);
        return res.status(500).json({ error: "Erro interno do servidor" });
    }
};

export const listCarUtilizationController = async (req, res) => {
    try {
    const data = await listCarUtilizationService(req);
    return res.status(200).json(data);
    } catch (error) {
        console.error("Erro no controlador:", error.message);
        return res.status(500).json({ error: "Erro interno do servidor" });
    }
};
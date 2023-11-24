import { createCarService } from "../services/car/createCarService.js";
import { deleteCarService } from "../services/car/deleteCarService.js";
import { listCarsService } from "../services/car/listCarsService.js";
import { recoveryCarService } from "../services/car/recoveryCarService.js"
import { updateCarService } from "../services/car/updateCarService.js";

export const createCarController = async (req, res) => {
    try {
        const data = await createCarService(req.body);
        return res.status(201).json(data);
    } catch (error) {
        console.error("Error in createCarController:", error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
};

export const deleteCarController = async (req, res) => {
    try {
        const data = await deleteCarService(req.params.id);
        return res.status(204).json(data);
    } catch (error) {
        console.error("Error in deleteCarController:", error);
        if (error.name === "CarNotFoundError") {
            return res.status(404).json({ error: error.message });
        }
        return res.status(500).json({ error: "Internal Server Error" });
    }
};

export const listCarController = async (req, res) => {
    try {
        const filter = req.params.filter;
        const filterB = req.params.filterB;
        const data = await listCarsService(filter, filterB);
        return res.status(200).json(data);
    } catch (error) {
        console.error("Error in listCarController:", error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
};

export const recoveryCarController = async (req, res) => {
    try {
        const data = await recoveryCarService(req.params.licenseplate);
        return res.status(200).json(data);
    } catch (error) {
        console.error("Error in recoveryCarController:", error);
        if (error.name === "NotFoundError") {
            return res.status(404).json({ error: error.message });
        }
        return res.status(500).json({ error: "Internal Server Error" });
    }
};

export const updateCarController = async (req, res) => {
    try {
        const data = await updateCarService(req.params.id, req.body);
        return res.status(200).json(data);
    } catch (error) {
        console.error("Error in updateCarController:", error);
        if (error.name === "CarNotFoundError") {
            return res.status(404).json({ error: error.message });
        }
        return res.status(500).json({ error: "Internal Server Error" });
    }
};
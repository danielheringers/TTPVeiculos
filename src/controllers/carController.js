import { createCarService } from "../services/car/createCarService.js";
import { deleteCarService } from "../services/car/deleteCarService.js";
import { listCarsService } from "../services/car/listCarsService.js";
import { recoveryCarService } from "../services/car/recoveryCarService.js"
import { updateCarService } from "../services/car/updateCarService.js";

export const createCarController = async (req, res) => {
    const data = await createCarService(req.body);
    return res.status(201).json(data);
};

export const deleteCarController = async (req, res) => {
    const data = await deleteCarService(req.params.id);
    return res.status(204).json(data);
};

export const listCarController = async (req, res) => {
    const filter = req.params.filter;
    const filterB = req.params.filterB;
    const data = await listCarsService(filter, filterB);
    return res.status(200).json(data);
};

export const recoveryCarController = async (req, res) => {
    const data = await recoveryCarService(req.params.licenseplate);
    return res.status(200).json(data);
}

export const updateCarController = async (req, res) => {
    const data = await updateCarService(req.params.id, req.body)
    return res.status(200).json(data);
}
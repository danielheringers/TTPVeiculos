import { createDriverService } from "../services/driver/createDriverService.js";
import { deleteDriverService } from "../services/driver/deleteDriverService.js";
import { listDriverService } from "../services/driver/listDriverService.js";
import { recoveryDriverService } from "../services/driver/recoveryDriverService.js";
import { updateDriverService } from "../services/driver/updateDriverService.js";



export const createDriverController = async (req, res) => {
    const data = await createDriverService(req.body);
    return res.status(201).json(data);
};

export const deleteDriverController = async (req, res) => {
    const data = await deleteDriverService(req.params.id);
    return res.status(204).json(data);
};

export const listDriverController = async (req, res) => {
    const filter = req.params.filter;
    const data = await listDriverService(filter);
    return res.status(200).json(data);
};

export const recoveryDriverController = async (req, res) => {
    const data = await recoveryDriverService(req.params.id);
    return res.status(200).json(data);
}

export const updateDriverController = async (req, res) => {
    const data = await updateDriverService(req.params.id, req.body)
    return res.status(200).json(data);
}
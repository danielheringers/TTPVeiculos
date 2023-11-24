import { createDriverService } from "../services/driver/createDriverService.js";
import { deleteDriverService } from "../services/driver/deleteDriverService.js";
import { listDriverService } from "../services/driver/listDriverService.js";
import { recoveryDriverService } from "../services/driver/recoveryDriverService.js";
import { updateDriverService } from "../services/driver/updateDriverService.js";



export const createDriverController = async (req, res) => {
    try {
        const data = await createDriverService(req.body);
        return res.status(201).json(data);
    } catch (error) {
        return res.status(500).json({ error: "Internal Server Error" });
    }
};

export const deleteDriverController = async (req, res) => {
    try {
        const data = await deleteDriverService(req.params.id);
        if (data) {
            return res.status(204).json(data);
        } else {
            return res.status(404).json({ error: "Driver not found" });
        }
    } catch (error) {
        return res.status(500).json({ error: "Internal Server Error" });
    }
};

export const listDriverController = async (req, res) => {
    try {
        const filter = req.params.filter;
        const data = await listDriverService(filter);
        return res.status(200).json(data);
    } catch (error) {
        return res.status(500).json({ error: "Internal Server Error" });
    }
};

export const recoveryDriverController = async (req, res) => {
    try {
        const data = await recoveryDriverService(req.params.id);
        if (data) {
            return res.status(200).json(data);
        } else {
            return res.status(404).json({ error: "Driver not found" });
        }
    } catch (error) {
        return res.status(500).json({ error: "Internal Server Error" });
    }
};

export const updateDriverController = async (req, res) => {
    try {
        const data = await updateDriverService(req.params.id, req.body);
        if (data) {
            return res.status(200).json(data);
        } else {
            return res.status(404).json({ error: "Driver not found" });
        }
    } catch (error) {
        return res.status(500).json({ error: "Internal Server Error" });
    }
};
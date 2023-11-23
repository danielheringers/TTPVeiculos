import { database } from '../../database/database.js';
import { NotFoundError } from '../../error/appError.js';

export const recoveryCarService = async (data) => {
    try {
        const deletedCar = await database.query("SELECT id, licenseplate, color, brand FROM cars WHERE licenseplate = $1 AND deleted = true;", [data]);
        const queryResponse = await database.query("UPDATE cars SET deleted = false WHERE ID = $1;", [data]);

        if (deletedCar.length === 0) {
            throw new NotFoundError('Nenhum veículo encontrado');
        }

        return queryResponse;
    } catch (error) {
        throw error;
    }
};

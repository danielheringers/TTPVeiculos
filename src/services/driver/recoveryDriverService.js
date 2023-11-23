import { database } from '../../database/database.js';
import { NotFoundError } from '../../error/appError.js';

export const recoveryDriverService = async (data) => {
    try {
        const deletedDriver = await database.query("SELECT id, name, cnh FROM drivers WHERE cnh = $1 AND deleted = true;", [data]);
        const queryResponse = await database.query("UPDATE drivers SET deleted = false WHERE ID = $1;", [data]);

        if (deletedDriver.length === 0) {
            throw new NotFoundError('Nenhum motorista encontrado');
        }

        return queryResponse.rows;
    }
    catch (error) {
        throw error;
    }
};
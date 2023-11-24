import { database } from '../../database/database.js';
import { NotFoundError } from '../../error/appError.js';

export const recoveryDriverService = async (data) => {
    const deletedDriver = await database.query("SELECT id, name, cnh FROM drivers WHERE cnh = $1 AND deleted = true;", [String(data)]);
    if (deletedDriver.rows.length === 0) {
        throw new NotFoundError('No drivers found');
    }
    const queryResponse = await database.query("UPDATE drivers SET deleted = false WHERE cnh = $1;", 
    [deletedDriver.rows[0].cnh]
    );

    return deletedDriver.rows[0];
};
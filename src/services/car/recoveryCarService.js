import { database } from '../../database/database.js';
import { NotFoundError } from '../../error/appError.js';

export const recoveryCarService = async (data) => {
    const deletedCar = await database.query(
        "SELECT id, licenseplate, color, brand FROM cars WHERE licenseplate = $1 AND deleted = true;",
        [String(data)]
    );
    if (deletedCar.rows.length === 0) {
        throw new NotFoundError('Nenhum veículo encontrado');
    }

    const queryResponse = await database.query(
        "UPDATE cars SET deleted = false WHERE ID = $1;",
        [deletedCar.rows[0].id]
    );

    return deletedCar.rows[0];
};

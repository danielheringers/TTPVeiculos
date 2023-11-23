import { database } from '../../database/database.js';
import { NotFoundError } from '../../error/appError.js';

export const recoveryCarService = async (data) => {
    try {
        const deletedCar = await database.query(
            "SELECT id, licenseplate, color, brand FROM cars WHERE licenseplate = $1 AND deleted = true;",
            [String(data)]
        );

        if (!deletedCar || !deletedCar.rows || deletedCar.rows.length === 0) {
            throw new NotFoundError('Nenhum veículo encontrado');
        }

        const queryResponse = await database.query(
            "UPDATE cars SET deleted = false WHERE ID = $1;",
            [deletedCar.rows[0].id]
        );

        return deletedCar.rows[0];
    } catch (error) {
        // Verifica se o erro é NotFoundError e o lança diretamente
        if (error instanceof NotFoundError) {
            throw error;
        }
        // Se não for NotFoundError, lança um novo erro
        throw new Error('Erro ao recuperar o carro');
    }
};

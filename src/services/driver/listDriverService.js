import { database } from '../../database/database.js';
import { NotFoundError } from '../../error/appError.js';

// Função assíncrona que lista carros com base em filtros
export const listDriverService = async (filter) => {
    try {
        // Verifica se não há nenhum filtro, retornando todos os carros
        if (!filter) {
            const queryResponse = await database.query("SELECT id, name, cnh FROM drivers WHERE deleted = false;");
            if (queryResponse.rows.length > 0) {
                return queryResponse.rows;
            }
            throw new NotFoundError("Nenhum motorista encontrado");
        }
        else{
            const queryResponseDriver = await database.query("SELECT id, name, cnh FROM drivers WHERE name = $1 AND deleted = false;", [filter]);
            return queryResponseDriver.rows[0];
        }
    }
    
    catch (error) {
        // Em caso de erro, lança a exceção NotFoundError
        throw new NotFoundError(error.message);
    };
};

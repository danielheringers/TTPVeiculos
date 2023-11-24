import { database } from '../../database/database.js';
import { NotFoundError } from '../../error/appError.js';


export const listDriverService = async (filter) => {
    try {

        if (!filter) {
            const queryResponse = await database.query("SELECT id, name, cnh FROM drivers WHERE deleted = false;");
            if (queryResponse.rows.length > 0) {
                return queryResponse.rows;
            }
            throw new NotFoundError("No drivers found");
        }
        else{
            const queryResponseDriver = await database.query("SELECT id, name, cnh FROM drivers WHERE name = $1 AND deleted = false;", [filter]);
            return queryResponseDriver.rows[0];
        }
    }
    
    catch (error) {

        throw new NotFoundError(error.message);
    };
};

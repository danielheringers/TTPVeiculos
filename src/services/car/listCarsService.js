import { database } from '../../database/database.js';
import { NotFoundError } from '../../error/appError.js';


export const listCarsService = async (filter, filterB) => {
    try {

        if (!filter && !filterB) {
            const queryResponse = await database.query("SELECT id, licenseplate, color, brand FROM cars WHERE deleted = false;");
            if (queryResponse.rows.length > 0) {
                return queryResponse.rows;
            }
            throw new NotFoundError("No vehicles found");
        };

       
        if (filter && !filterB) {
            const lowerCaseFilter = filter.toLowerCase();
            const queryResponseColor = await database.query("SELECT id, licenseplate, color, brand FROM cars WHERE color = $1 AND deleted = false;", [lowerCaseFilter]);
            const queryResponseBrand = await database.query("SELECT id, licenseplate, color, brand FROM cars WHERE brand = $1 AND deleted = false;", [lowerCaseFilter]);
            const queryResponseLicense = await database.query("SELECT id, licenseplate, color, brand FROM cars WHERE licenseplate = $1 AND deleted = false;", [lowerCaseFilter]);

            if (queryResponseColor.rows.length > 0) {
                return queryResponseColor.rows[0];
            }

            else if (queryResponseBrand.rows.length > 0) {
                return queryResponseBrand.rows[0];
            }

            else if (queryResponseLicense.rows.length > 0) {
                return queryResponseLicense.rows[0];
            }

            else {
                throw new NotFoundError("No vehicles found!");
            }
        };

        
        if (filter && filterB) {
            const lowerCaseFilter = filter.toLowerCase();
            const lowerCaseFilterB = filterB.toLowerCase();
            const queryResponse = await database.query("SELECT id, licenseplate, color, brand FROM cars WHERE color = $1 AND brand = $2;", [lowerCaseFilter, lowerCaseFilterB]);
            return queryResponse.rows;
        };
    } catch (error) {
        throw new NotFoundError(error.message);
    }
};

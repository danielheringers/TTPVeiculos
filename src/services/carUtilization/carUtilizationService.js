import { database } from '../../database/database.js';
import { DriverAlreadyUsingError } from "../../error/appError.js"
//Criando Utilização
export const startCarUtilizationService = async (data) => {
    const { driverId, carId, reasonForUse } = data;

    try {
        const existingUtilization = await database.query(
            'SELECT * FROM carutilization WHERE driverid = $1 AND enddate IS NULL;',
            [driverId]
        );

        if(existingUtilization.rows.length >= 1) {
        }

        const queryResponse = await database.query(
            'INSERT INTO carutilization (driverid, carid, reasonforuse, initialdate) VALUES ($1, $2, $3, current_timestamp) RETURNING *;',
            [driverId, carId, reasonForUse]
        );

        return queryResponse.rows[0];
    } catch (error) {
        throw new DriverAlreadyUsingError("The driver is already using another car");
    }
};


//Finalizando Utilização
export const endCarUtilizationService = async (driverId) => {

    const queryResponse = await database.query(
        'UPDATE carutilization SET enddate = current_timestamp WHERE driverid = $1 AND enddate IS NULL RETURNING *;',
        [driverId]
    );

    if(queryResponse.rows.length === 0) {
        throw new Error('The driver is not using any car at the moment');
    }

    return queryResponse.rows[0];
};

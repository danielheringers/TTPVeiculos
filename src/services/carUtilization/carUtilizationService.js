import { database } from '../../database/database.js';
//Criando Utilização
export const startCarUtilizationService = async (data) => {
    const { driverId, carId, reasonForUse } = data;
    const existingUtilization = await database.query(
        'SELECT * FROM carutilization WHERE driverid = $1 AND enddate IS NULL;',
        [driverId]
    );

    if(existingUtilization.rows.length > 0) {
        throw new Error('O motorista já está utilizando outro carro.');
    }


    const queryResponse = await database.query(
        'INSERT INTO carutilization (driverid, carid, reasonforuse, initialdate) VALUES ($1, $2, $3, current_timestamp) RETURNING *;',
        [driverId, carId, reasonForUse]
    );
    return queryResponse.rows[0];
};

//Finalizando Utilização
export const endCarUtilizationService = async (driverId) => {

    const queryResponse = await database.query(
        'UPDATE carutilization SET enddate = current_timestamp WHERE driverid = $1 AND enddate IS NULL RETURNING *;',
        [driverId]
    );

    if(queryResponse.rows.length === 0) {
        throw new Error('O motorista não está utilizando nenhum carro no momento.');
    }

    return queryResponse.rows[0];
};

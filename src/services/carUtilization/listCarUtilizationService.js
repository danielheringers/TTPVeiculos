import { database } from '../../database/database.js';

export const listCarUtilizationService = async () => {
    try{
        const query =  "SELECT cut.id, initialdate, enddate, reasonforuse, c.licenseplate AS car_licenseplate, c.color AS car_color, c.brand AS car_brand, d.name AS driver_name FROM carutilization cut JOIN cars c ON cut.carid = c.id JOIN drivers d ON cut.driverid = d.id;"

        const queryResponse = await database.query(query);

        if (queryResponse.rows.length > 0) {
            return queryResponse.rows;
        }
    }catch(error){
        throw new NotFoundError("Nenhuma utilização de carro encontrada");
    }
};
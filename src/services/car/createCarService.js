import { database } from "../../database/database.js";
import { CarCreateError } from "../../error/appError.js";
import { carReturnSerializer } from "../../serializers/carSerializers.js";

export const createCarService = async (data) => {
    try{
        const queryResponse = await database.query(
            'INSERT INTO cars (licenseplate, color, brand) VALUES ($1, $2, $3) RETURNING id, licenseplate, color, brand;',
            [data.licenseplate, data.color, data.brand]
        );
        const returnedCar = await carReturnSerializer.validate(queryResponse.rows[0]);
    
        return returnedCar
    }

    catch (error) {
        if (error.code === "23505" && error.constraint === "cars_licenseplate_key") {
          throw new CarCreateError("Carro já existe");
        }
        throw error;
    }
};


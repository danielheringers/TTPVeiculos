import { database } from "../../database/database.js";
import { DriverCreateError } from "../../error/appError.js";
import { driverReturnSerializer } from "../../serializers/driverSerializers.js"

export const createDriverService = async (data) => {
    try{ 
        const queryResponse = await database.query(
            "INSERT INTO drivers (name, cnh) VALUES ($1, $2) RETURNING id, name, cnh;", [data.name, data.cnh]
        );

        const returnedDriver = await driverReturnSerializer.validate(queryResponse.rows[0]);
        return returnedDriver
    }
    catch (error) {
        if (error.code === "23505" && error.constraint === "drivers_cnh_key") {
          throw new DriverCreateError("Motorista já existe");
        }
        throw error;
    }
};
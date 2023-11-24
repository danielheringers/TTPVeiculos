import { database } from "../../database/database.js";
import { driverReturnSerializer } from "../../serializers/driverSerializers.js";

export const updateDriverService = async (cnh, data) => {
  const keys = Object.keys(data);
  const values = Object.values(data);

  if (keys.length === 0) {
    throw new Error("No fields provided for update");
  }

  const setClause = keys.map((key, index) => `${key} = $${index + 1}`).join(", ");

  const query = `UPDATE drivers SET ${setClause} WHERE cnh = $${keys.length + 1} RETURNING id, name, cnh`;

  const queryResponse = await database.query(query, [...values, cnh]);

  const returnedDriver = await driverReturnSerializer.validate(queryResponse.rows[0]);
  
  return returnedDriver;
};

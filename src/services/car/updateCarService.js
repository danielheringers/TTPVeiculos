import { database } from "../../database/database.js";
import { carReturnSerializer } from "../../serializers/carSerializers.js";

export const updateCarService = async (licenseplate, data) => {

  const keys = Object.keys(data);
  const values = Object.values(data);
  if (keys.length === 0) {
    throw new Error("No fields provided for update.");
  }
  const lowerCaseValues = values.map(value => (typeof value === 'string' ? value.toLowerCase() : value));
  console.log(lowerCaseValues)
  const setClause = keys.map((key, index) => `${key} = $${index + 1}`).join(", ");

  const query = `UPDATE cars SET ${setClause} WHERE licenseplate = $${keys.length + 1} RETURNING id, licenseplate, color, brand`;

  const queryResponse = await database.query(query, [...lowerCaseValues, licenseplate.toLowerCase()]);

  const returnedCar = await carReturnSerializer.validate(queryResponse.rows[0]);
  return returnedCar;
};

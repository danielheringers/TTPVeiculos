import { database } from "../../database/database.js";
import { carReturnSerializer } from "../../serializers/carSerializers.js";

export const updateCarService = async (licenseplate, data) => {
  Obtém as chaves e valores do objeto de dados
  const keys = Object.keys(data);
  const values = Object.values(data);

  Verifica se há campos para atualização
  if (keys.length === 0) {
    throw new Error("Nenhum campo fornecido para atualização.");
  }

  Cria a cláusula SET da consulta SQL
  const setClause = keys.map((key, index) => `${key} = $${index + 1}`).join(", ");

  Monta a consulta SQL completa
  const query = `UPDATE cars SET ${setClause} WHERE licenseplate = $${keys.length + 1} RETURNING id, licenseplate, color, brand`;

  Executa a consulta no banco de dados
  const queryResponse = await database.query(query, [...values, licenseplate]);

  Valida e retorna o carro atualizado
  const returnedCar = await carReturnSerializer.validate(queryResponse.rows[0]);
  return returnedCar;
};

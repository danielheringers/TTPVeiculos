import { database } from "../../database/database.js";
import { driverReturnSerializer } from "../../serializers/driverSerializers.js";

export const updateDriverService = async (cnh, data) => {
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
  const query = `UPDATE drivers SET ${setClause} WHERE cnh = $${keys.length + 1} RETURNING id, name, cnh`;

  Executa a consulta no banco de dados
  const queryResponse = await database.query(query, [...values, cnh]);

  Valida e retorna o carro atualizado
  const returnedDriver = await driverReturnSerializer.validate(queryResponse.rows[0]);
  return returnedDriver;
};

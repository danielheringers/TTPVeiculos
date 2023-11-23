import { startCarUtilizationService, endCarUtilizationService } from '../carUtilization/carUtilizationService.js';
import { database } from '../../database/database.js';

Mock para simular o comportamento do banco de dados
jest.mock('../../database/database');

describe('startCarUtilizationService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('deve iniciar a utilização de um carro por um motorista', async () => {
    Mock dos dados de entrada
    const data = { driverId: 1, carId: 2, reasonForUse: 'Trabalho' };

    Mock da resposta do banco de dados
    const mockQueryResponse = {
      rows: [{ id: 1, driverid: 1, carid: 2, reasonforuse: 'Trabalho', initialdate: new Date() }],
    };

    Configuração do mock para simular a resposta do banco de dados
    database.query.mockResolvedValueOnce(mockQueryResponse);

    Chama a função de serviço
    const result = await startCarUtilizationService(data);

    Verifica se a função de consulta foi chamada com os parâmetros corretos
    const expectedQuery = 'INSERT INTO carutilization (driverid, carid, reasonforuse, initialdate) VALUES ($1, $2, $3, current_timestamp) RETURNING *;';
    const expectedValues = [1, 2, 'Trabalho'];
    expect(database.query).toHaveBeenCalledWith(expectedQuery, expectedValues);

    Verifica se o resultado da função é o esperado
    expect(result).toEqual(mockQueryResponse.rows[0]);
  });

  it('deve lançar um erro se o motorista já estiver utilizando outro carro', async () => {
    Mock dos dados de entrada
    const data = { driverId: 1, carId: 2, reasonForUse: 'Trabalho' };

    Mock da resposta do banco de dados indicando nenhuma utilização existente
    const mockExistingUtilization = { rows: [] };
    database.query.mockResolvedValueOnce(mockExistingUtilization);

    Chama a função de serviço e verifica se ela lança o erro esperado
    await expect(startCarUtilizationService(data)).rejects.toThrowError('O motorista já está utilizando outro carro.');
  });
});


describe('endCarUtilizationService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('deve finalizar a utilização de um carro por um motorista', async () => {
    Mock dos dados de entrada
    const driverId = 1;

    Mock da resposta do banco de dados
    const mockQueryResponse = {
      rows: [{ id: 1, driverid: 1, carid: 2, reasonforuse: 'Trabalho', initialdate: new Date(), enddate: new Date() }],
    };

    Configuração do mock para simular a resposta do banco de dados
    database.query.mockResolvedValueOnce(mockQueryResponse);

    Chama a função de serviço
    const result = await endCarUtilizationService(driverId);

    Verifica se a função de consulta foi chamada com os parâmetros corretos
    const expectedQuery = 'UPDATE carutilization SET enddate = current_timestamp WHERE driverid = $1 AND enddate IS NULL RETURNING *;';
    const expectedValues = [1];
    expect(database.query).toHaveBeenCalledWith(expectedQuery, expectedValues);

    Verifica se o resultado da função é o esperado
    expect(result).toEqual(mockQueryResponse.rows[0]);
  });

  it('deve lançar um erro se o motorista não estiver utilizando nenhum carro', async () => {
    Mock dos dados de entrada
    const driverId = 1;

    Mock da resposta do banco de dados indicando que não há utilização em andamento
    const mockNoUtilization = { rows: [] };
    database.query.mockResolvedValueOnce(mockNoUtilization);

    Chama a função de serviço e verifica se ela lança o erro esperado
    await expect(endCarUtilizationService(driverId)).rejects.toThrowError('O motorista não está utilizando nenhum carro no momento.');
  });
});

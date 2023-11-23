import { updateDriverService } from './updateDriverService.js';
import { database } from '../../database/database.js';
import { driverReturnSerializer } from '../../serializers/driverSerializers.js';

Mock para simular o comportamento do banco de dados
jest.mock('../../database/database.js');

describe('updateDriverService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('deve atualizar um motorista com sucesso', async () => {
    Mock dos dados de entrada
    const mockCnh = 'ABC123';
    const mockData = { name: 'John Doe', cnh: 'XYZ789' };

    Mock da resposta do banco de dados após a atualização
    const mockQueryResponse = {
      rows: [{ id: 1, name: 'John Doe', cnh: 'XYZ789' }],
    };

    Configuração do mock para simular a resposta do banco de dados
    database.query.mockResolvedValueOnce(mockQueryResponse);

    Chama a função de serviço
    const result = await updateDriverService(mockCnh, mockData);

    Verifica se a função de consulta foi chamada com os parâmetros corretos
    const expectedQuery = 'UPDATE drivers SET name = $1, cnh = $2 WHERE cnh = $3 RETURNING id, name, cnh';
    const expectedValues = [mockData.name, mockData.cnh, mockCnh];
    expect(database.query).toHaveBeenCalledWith(expectedQuery, expectedValues);

    Verifica se o resultado da função é o esperado
    const expectedReturnedDriver = await driverReturnSerializer.validate(mockQueryResponse.rows[0]);
    expect(result).toEqual(expectedReturnedDriver);
  });

  it('deve lançar um erro se nenhum campo for fornecido para atualização', async () => {
    Mock dos dados de entrada sem campos para atualização
    const mockCnh = 'ABC123';
    const mockData = {};

    Chama a função de serviço e verifica se ela lança o erro esperado
    await expect(updateDriverService(mockCnh, mockData)).rejects.toThrowError('Nenhum campo fornecido para atualização.');
  });
});

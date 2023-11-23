import { createDriverService } from '../driver/createDriverService.js';
import { database } from '../../database/database.js';
import { DriverCreateError } from '../../error/appError.js';
import { driverReturnSerializer } from '../../serializers/driverSerializers.js';

Mock para simular o comportamento do banco de dados
jest.mock('../../database/database.js');

describe('createDriverService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('deve criar um novo motorista com sucesso', async () => {
    Mock dos dados de entrada
    const data = { name: 'John Doe', cnh: 'ABC123' };

    Mock da resposta do banco de dados
    const mockQueryResponse = {
      rows: [{ id: 1, name: 'John Doe', cnh: 'ABC123' }],
    };

    Configuração do mock para simular a resposta do banco de dados
    database.query.mockResolvedValueOnce(mockQueryResponse);

    Chama a função de serviço
    const result = await createDriverService(data);

    Verifica se a função de consulta foi chamada com os parâmetros corretos
    const expectedQuery = 'INSERT INTO drivers (name, cnh) VALUES ($1, $2) RETURNING id, name, cnh;';
    const expectedValues = [data.name, data.cnh];
    expect(database.query).toHaveBeenCalledWith(expectedQuery, expectedValues);

    Verifica se o resultado da função é o esperado
    const expectedDriver = await driverReturnSerializer.validate(mockQueryResponse.rows[0]);
    expect(result).toEqual(expectedDriver);
  });

  it('deve lançar um erro se o motorista já existir', async () => {
    Mock dos dados de entrada
    const data = { name: 'John Doe', cnh: 'ABC123' };

    Configuração do mock para simular um erro de violação de chave única
    const uniqueViolationError = {
      code: '23505',
      constraint: 'drivers_cnh_key',
    };
    database.query.mockRejectedValueOnce(uniqueViolationError);

    Chama a função de serviço e verifica se ela lança o erro esperado
    await expect(createDriverService(data)).rejects.toThrowError(DriverCreateError);
  });

  it('deve lançar um erro desconhecido', async () => {
    Mock dos dados de entrada
    const data = { name: 'John Doe', cnh: 'ABC123' };

    Configuração do mock para simular um erro desconhecido
    const unknownError = new Error('Erro desconhecido');
    database.query.mockRejectedValueOnce(unknownError);

    Chama a função de serviço e verifica se ela lança o erro esperado
    await expect(createDriverService(data)).rejects.toThrowError(unknownError);
  });
});

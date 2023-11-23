import { updateCarService } from '../car/updateCarService.js';
import { database } from '../../database/database.js';
import { carReturnSerializer } from '../../serializers/carSerializers.js';

// Mock para simular o comportamento do banco de dados
jest.mock('../../database/database');

describe('updateCarService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('deve atualizar um carro no banco de dados', async () => {
    // Mock dos dados de entrada
    const licenseplate = 'ABC123';
    const data = { color: 'Blue', brand: 'Honda' };

    // Mock da resposta do banco de dados
    const mockQueryResponse = {
      rows: [{ id: 1, licenseplate: 'ABC123', color: 'Blue', brand: 'Honda' }],
    };

    // Configuração do mock para simular a resposta do banco de dados
    database.query.mockResolvedValueOnce(mockQueryResponse);

    // Mock da validação do serializer
    jest.spyOn(carReturnSerializer, 'validate').mockResolvedValueOnce(mockQueryResponse.rows[0]);

    // Chama a função de serviço
    const result = await updateCarService(licenseplate, data);

    // Verifica se a função de consulta foi chamada com os parâmetros corretos
    const expectedQuery = 'UPDATE cars SET color = $1, brand = $2 WHERE licenseplate = $3 RETURNING id, licenseplate, color, brand';
    const expectedValues = ['Blue', 'Honda', 'ABC123'];
    expect(database.query).toHaveBeenCalledWith(expectedQuery, expectedValues);

    // Verifica se a função de validação do serializer foi chamada com o resultado do banco de dados
    expect(carReturnSerializer.validate).toHaveBeenCalledWith(mockQueryResponse.rows[0]);

    // Verifica se o resultado da função é o esperado
    expect(result).toEqual(mockQueryResponse.rows[0]);
  });

  it('deve lançar um erro se nenhum campo for fornecido para atualização', async () => {
    // Mock dos dados de entrada sem campos para atualização
    const licenseplate = 'ABC123';
    const data = {};

    // Chama a função de serviço e verifica se ela lança o erro esperado
    await expect(updateCarService(licenseplate, data)).rejects.toThrowError('Nenhum campo fornecido para atualização.');
  });
});

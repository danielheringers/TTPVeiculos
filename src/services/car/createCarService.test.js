import { createCarService } from '../car/createCarService.js';
import { database } from '../../database/database.js';
import { CarCreateError } from '../../error/appError.js';
import { carReturnSerializer } from '../../serializers/carSerializers.js';

jest.mock('../../database/database');

describe('createCarService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('deve criar um carro e retornar os detalhes do carro criado', async () => {
    const mockData = {
      licenseplate: 'ABC123',
      color: 'Red',
      brand: 'Toyota',
    };

    // Configuração do mock para simular uma resposta do banco de dados
    database.query.mockResolvedValueOnce({
      rows: [{ id: 1, licenseplate: 'ABC123', color: 'Red', brand: 'Toyota' }],
    });

    // Configuração do mock para simular a validação do serializer
    jest.spyOn(carReturnSerializer, 'validate').mockResolvedValueOnce(mockData);

    const result = await createCarService(mockData);

    expect(result).toEqual(mockData);
  });

  it('deve lançar CarCreateError se o carro já existe', async () => {
    const mockData = {
      licenseplate: 'ABC123',
      color: 'Red',
      brand: 'Toyota',
    };

    // Configuração do mock para simular uma exceção de chave duplicada no banco de dados
    database.query.mockRejectedValueOnce({
      code: '23505',
      constraint: 'cars_licenseplate_key',
    });

    await expect(createCarService(mockData)).rejects.toThrow(CarCreateError);
  });

  it('deve lançar erro se ocorrer qualquer outro erro durante a criação do carro', async () => {
    const mockData = {
      licenseplate: 'ABC123',
      color: 'Red',
      brand: 'Toyota',
    };

    // Configuração do mock para simular um erro desconhecido no banco de dados
    database.query.mockRejectedValueOnce(new Error('Erro desconhecido'));

    await expect(createCarService(mockData)).rejects.toThrowError('Erro desconhecido');
  });
});

import { createCarService } from './createCarService.js';
import { CarCreateError } from '../../error/appError.js';
import { carReturnSerializer } from '../../serializers/carSerializers.js';
import { database } from '../../database/database.js';

jest.mock('../../serializers/carSerializers.js');

describe('createCarService - Teste de Unidade', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('deve criar um carro e retornar os detalhes do carro criado', async () => {
    const mockData = {
      licenseplate: 'abc123',
      color: 'red',
      brand: 'toyota',
    };

    const mockSerializedData = {
      id: 1,
      licenseplate: 'abc123',
      color: 'red',
      brand: 'toyota',
    };
    jest.spyOn(carReturnSerializer, 'validate').mockResolvedValueOnce(mockSerializedData);

    jest.spyOn(database, 'query').mockResolvedValueOnce({
      rows: [mockSerializedData],
    });

    const result = await createCarService(mockData);

    expect(result).toEqual(mockSerializedData);

    expect(carReturnSerializer.validate).toHaveBeenCalledWith(mockSerializedData);

    expect(database.query).toHaveBeenCalledWith(
      'INSERT INTO cars (licenseplate, color, brand) VALUES ($1, $2, $3) RETURNING id, licenseplate, color, brand;',
      [mockData.licenseplate, mockData.color, mockData.brand]
    );
  });

  it('deve lançar CarCreateError se o carro já existe', async () => {
    const mockData = {
      licenseplate: 'abc123',
      color: 'red',
      brand: 'toyota',
    };

    jest.spyOn(database, 'query').mockRejectedValueOnce({
      code: '23505',
      constraint: 'cars_licenseplate_key',
    });

    await expect(createCarService(mockData)).rejects.toThrow(CarCreateError);

    expect(database.query).toHaveBeenCalledWith(
      'INSERT INTO cars (licenseplate, color, brand) VALUES ($1, $2, $3) RETURNING id, licenseplate, color, brand;',
      [mockData.licenseplate, mockData.color, mockData.brand]
    );
  });

  it('deve lançar erro se ocorrer qualquer outro erro durante a criação do carro', async () => {
    const mockData = {
      licenseplate: 'abc123',
      color: 'red',
      brand: 'toyota',
    };

    jest.spyOn(database, 'query').mockRejectedValueOnce(new Error('Erro desconhecido'));

    await expect(createCarService(mockData)).rejects.toThrowError('Erro desconhecido');

    expect(database.query).toHaveBeenCalledWith(
      'INSERT INTO cars (licenseplate, color, brand) VALUES ($1, $2, $3) RETURNING id, licenseplate, color, brand;',
      [mockData.licenseplate, mockData.color, mockData.brand]
    );
  });
});

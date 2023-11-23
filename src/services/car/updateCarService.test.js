import { updateCarService } from '../car/updateCarService.js';
import { database } from '../../database/database.js';
import { carReturnSerializer } from '../../serializers/carSerializers.js';


jest.mock('../../database/database');

describe('updateCarService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('deve atualizar um carro no banco de dados', async () => {
    const licenseplate = 'ABC123';
    const data = { color: 'Blue', brand: 'Honda' };

    const mockQueryResponse = {
      rows: [{ id: 1, licenseplate: 'ABC123', color: 'Blue', brand: 'Honda' }],
    };

    database.query.mockResolvedValueOnce(mockQueryResponse);

    jest.spyOn(carReturnSerializer, 'validate').mockResolvedValueOnce(mockQueryResponse.rows[0]);

    const result = await updateCarService(licenseplate, data);

    const expectedQuery = 'UPDATE cars SET color = $1, brand = $2 WHERE licenseplate = $3 RETURNING id, licenseplate, color, brand';
    const expectedValues = ['Blue', 'Honda', 'ABC123'];
    expect(database.query).toHaveBeenCalledWith(expectedQuery, expectedValues);

    expect(carReturnSerializer.validate).toHaveBeenCalledWith(mockQueryResponse.rows[0]);

    expect(result).toEqual(mockQueryResponse.rows[0]);
  });

  it('deve lançar um erro se nenhum campo for fornecido para atualização', async () => {
    const licenseplate = 'ABC123';
    const data = {};

    await expect(updateCarService(licenseplate, data)).rejects.toThrowError('Nenhum campo fornecido para atualização.');
  });
});

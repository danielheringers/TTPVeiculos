import { updateCarService } from './updateCarService.js';
import { database } from '../../database/database.js';
import { carReturnSerializer } from '../../serializers/carSerializers.js';


jest.mock('../../database/database');

describe('updateCarService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('must update a car in the database', async () => {
    const licenseplate = 'abc123';
    const data = { color: 'blue', brand: 'honda' };

    const mockQueryResponse = {
      rows: [{ id: 1, licenseplate: 'abc123', color: 'blue', brand: 'honda' }],
    };

    database.query.mockResolvedValueOnce(mockQueryResponse);

    jest.spyOn(carReturnSerializer, 'validate').mockResolvedValueOnce(mockQueryResponse.rows[0]);

    const result = await updateCarService(licenseplate, data);

    const expectedQuery = 'UPDATE cars SET color = $1, brand = $2 WHERE licenseplate = $3 RETURNING id, licenseplate, color, brand';
    const expectedValues = ['blue', 'honda', 'abc123'];
    expect(database.query).toHaveBeenCalledWith(expectedQuery, expectedValues);

    expect(carReturnSerializer.validate).toHaveBeenCalledWith(mockQueryResponse.rows[0]);

    expect(result).toEqual(mockQueryResponse.rows[0]);
  });

  it('should throw an error if no field is provided for update', async () => {
    const licenseplate = 'abc123';
    const data = {};

    await expect(updateCarService(licenseplate, data)).rejects.toThrowError('No fields provided for update.');
  });
});

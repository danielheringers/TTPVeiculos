import { updateDriverService } from './updateDriverService.js';
import { database } from '../../database/database.js';
import { driverReturnSerializer } from '../../serializers/driverSerializers.js';

jest.mock('../../database/database.js');

describe('updateDriverService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('must update a driver successfully', async () => {
    const mockCnh = 'abc123';
    const mockData = { name: 'john doe', cnh: 'xyz789' };

    const mockQueryResponse = {
      rows: [{ id: 1, name: 'john doe', cnh: 'xyz789' }],
    };

    database.query.mockResolvedValueOnce(mockQueryResponse);

    const result = await updateDriverService(mockCnh, mockData);

    const expectedQuery = 'UPDATE drivers SET name = $1, cnh = $2 WHERE cnh = $3 RETURNING id, name, cnh';
    const expectedValues = [mockData.name, mockData.cnh, mockCnh];
    expect(database.query).toHaveBeenCalledWith(expectedQuery, expectedValues);

    const expectedReturnedDriver = await driverReturnSerializer.validate(mockQueryResponse.rows[0]);
    expect(result).toEqual(expectedReturnedDriver);
  });

  it('should throw an error if no field is provided for update', async () => {
    const mockCnh = 'abc123';
    const mockData = {};

    await expect(updateDriverService(mockCnh, mockData)).rejects.toThrowError('No fields provided for update');
  });
});

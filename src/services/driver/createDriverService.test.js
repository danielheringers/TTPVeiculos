import { createDriverService } from '../driver/createDriverService.js';
import { database } from '../../database/database.js';
import { DriverCreateError } from '../../error/appError.js';
import { driverReturnSerializer } from '../../serializers/driverSerializers.js';

jest.mock('../../database/database.js');

describe('createDriverService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('deve criar um novo motorista com sucesso', async () => {
    const data = { name: 'John Doe', cnh: 'ABC123' };

    const mockQueryResponse = {
      rows: [{ id: 1, name: 'John Doe', cnh: 'ABC123' }],
    };

    database.query.mockResolvedValueOnce(mockQueryResponse);

    const result = await createDriverService(data);

    const expectedQuery = 'INSERT INTO drivers (name, cnh) VALUES ($1, $2) RETURNING id, name, cnh;';
    const expectedValues = [data.name, data.cnh];
    expect(database.query).toHaveBeenCalledWith(expectedQuery, expectedValues);

    const expectedDriver = await driverReturnSerializer.validate(mockQueryResponse.rows[0]);
    expect(result).toEqual(expectedDriver);
  });

  it('deve lançar um erro se o motorista já existir', async () => {
    const data = { name: 'john doe', cnh: 'abc123' };

    const uniqueViolationError = {
      code: '23505',
      constraint: 'drivers_cnh_key',
    };
    database.query.mockRejectedValueOnce(uniqueViolationError);

    await expect(createDriverService(data)).rejects.toThrowError(DriverCreateError);
  });

  it('should throw an unknown error', async () => {
    const data = { name: 'John Doe', cnh: 'ABC123' };

    const unknownError = new Error('Erro desconhecido');
    database.query.mockRejectedValueOnce(unknownError);

    await expect(createDriverService(data)).rejects.toThrowError(unknownError);
  });
});

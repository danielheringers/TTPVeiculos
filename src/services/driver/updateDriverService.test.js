import { updateDriverService } from './updateDriverService.js';
import { database } from '../../database/database.js';
import { driverReturnSerializer } from '../../serializers/driverSerializers.js';

jest.mock('../../database/database.js');

describe('updateDriverService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('deve atualizar um motorista com sucesso', async () => {
    const mockCnh = 'ABC123';
    const mockData = { name: 'John Doe', cnh: 'XYZ789' };

    const mockQueryResponse = {
      rows: [{ id: 1, name: 'John Doe', cnh: 'XYZ789' }],
    };

    database.query.mockResolvedValueOnce(mockQueryResponse);

    const result = await updateDriverService(mockCnh, mockData);

    const expectedQuery = 'UPDATE drivers SET name = $1, cnh = $2 WHERE cnh = $3 RETURNING id, name, cnh';
    const expectedValues = [mockData.name, mockData.cnh, mockCnh];
    expect(database.query).toHaveBeenCalledWith(expectedQuery, expectedValues);

    const expectedReturnedDriver = await driverReturnSerializer.validate(mockQueryResponse.rows[0]);
    expect(result).toEqual(expectedReturnedDriver);
  });

  it('deve lançar um erro se nenhum campo for fornecido para atualização', async () => {
    const mockCnh = 'ABC123';
    const mockData = {};

    await expect(updateDriverService(mockCnh, mockData)).rejects.toThrowError('Nenhum campo fornecido para atualização.');
  });
});

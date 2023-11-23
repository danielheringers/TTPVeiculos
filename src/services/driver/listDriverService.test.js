import { listDriverService } from './listDriverService';
import { database } from '../../database/database.js';
import { NotFoundError } from '../../error/appError.js';

jest.mock('../../database/database.js');

describe('listDriverService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('deve listar todos os motoristas', async () => {
    const mockQueryResponse = {
      rows: [
        { id: 1, name: 'John Doe', cnh: 'ABC123' },
        { id: 2, name: 'Jane Doe', cnh: 'DEF456' },
      ],
    };

    database.query.mockResolvedValueOnce(mockQueryResponse);

    const result = await listDriverService();

    const expectedQuery = 'SELECT id, name, cnh FROM drivers WHERE deleted = false;';
    expect(database.query).toHaveBeenCalledWith(expectedQuery);

    expect(result).toEqual(mockQueryResponse.rows);
  });

  it('deve listar um motorista específico', async () => {
    const filter = 'John Doe';

    const mockQueryResponseDriver = {
      rows: [{ id: 1, name: 'John Doe', cnh: 'ABC123' }],
    };

    database.query.mockResolvedValueOnce(mockQueryResponseDriver);

    const result = await listDriverService(filter);

    const expectedQueryDriver = 'SELECT id, name, cnh FROM drivers WHERE name = $1 AND deleted = false;';
    const expectedValuesDriver = [filter];
    expect(database.query).toHaveBeenCalledWith(expectedQueryDriver, expectedValuesDriver);

    expect(result).toEqual(mockQueryResponseDriver.rows[0]);
  });

  it('deve lançar um erro se nenhum motorista for encontrado', async () => {
    const mockNoDriver = { rows: [] };
    database.query.mockResolvedValueOnce(mockNoDriver);

    await expect(listDriverService()).rejects.toThrowError(NotFoundError);
  });
});

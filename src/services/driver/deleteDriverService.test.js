import { deleteDriverService } from './deleteDriverService.js';
import { database } from '../../database/database.js';

jest.mock('../../database/database.js');

describe('deleteDriverService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('deve excluir um motorista com sucesso', async () => {
    const data = 'ABC123';

    const mockQueryResponse = {
      rowCount: 1,
    };

    database.query.mockResolvedValueOnce(mockQueryResponse);

    const result = await deleteDriverService(data);

    const expectedQuery = 'UPDATE drivers SET deleted = true WHERE cnh = $1;';
    const expectedValues = [data];
    expect(database.query).toHaveBeenCalledWith(expectedQuery, expectedValues);

    expect(result).toEqual(mockQueryResponse);
  });

  it('deve lançar um erro se a exclusão falhar', async () => {
    const data = 'ABC123';

    const error = new Error('Erro durante a exclusão');
    database.query.mockRejectedValueOnce(error);

    await expect(deleteDriverService(data)).rejects.toThrowError(error);
  });
});

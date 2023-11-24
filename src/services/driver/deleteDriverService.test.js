import { deleteDriverService } from './deleteDriverService.js';
import { database } from '../../database/database.js';

jest.mock('../../database/database.js');

describe('deleteDriverService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('must delete a driver successfully', async () => {
    const data = 'abc123';

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

  it('should throw an error if the deletion fails', async () => {
    const data = 'abc123';

    const error = new Error('Error during deletion');
    database.query.mockRejectedValueOnce(error);

    await expect(deleteDriverService(data)).rejects.toThrowError(error);
  });
});

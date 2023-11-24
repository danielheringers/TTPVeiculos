
import { listCarsService } from './listCarsService.js';
import { database } from '../../database/database.js';
import { NotFoundError } from '../../error/appError.js';


jest.mock('../../database/database');

describe('listCarsService', () => {

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return all cars when there are no filters', async () => {
    
    database.query.mockResolvedValueOnce({ rows: [{ id: 1, licenseplate: 'abc123', color: 'red', brand: 'toyota' }] });

    const result = await listCarsService();

    expect(result).toEqual([{ id: 1, licenseplate: 'abc123', color: 'red', brand: 'toyota' }]);
  });

  it('should throw NotFoundError when no vehicle is found without filters', async () => {
    database.query.mockResolvedValueOnce({ rows: [] });

    await expect(listCarsService()).rejects.toThrow(NotFoundError);
  });

});

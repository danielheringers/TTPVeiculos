import { recoveryCarService } from './recoveryCarService.js';
import { database } from '../../database/database.js';
import { NotFoundError } from '../../error/appError.js';

jest.mock('../../database/database');

describe('recoveryCarService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('must recover a car marked as deleted in the database', async () => {
    const mockLicenseplate = 'abc123';
    const mockDeletedCar = { id: 1, licenseplate: 'abc123', color: 'red', brand: 'toyota' };


    database.query
      .mockResolvedValueOnce({ rows: [mockDeletedCar] }) 
      .mockResolvedValueOnce({}); 

    const result = await recoveryCarService(mockLicenseplate);


    expect(database.query).toHaveBeenCalledWith(
      'SELECT id, licenseplate, color, brand FROM cars WHERE licenseplate = $1 AND deleted = true;',
      [mockLicenseplate]
    );

    expect(database.query).toHaveBeenCalledWith(
      'UPDATE cars SET deleted = false WHERE ID = $1;',
      [mockDeletedCar.id]
    );

    expect(database.query).toHaveBeenCalledTimes(2);


    expect(result).toEqual(mockDeletedCar);
  });

  it('should throw NotFoundError if no deleted vehicles are found', async () => {
    const mockLicenseplate = 'abc123';

    database.query.mockResolvedValueOnce({ rows: [] });


    await expect(recoveryCarService(mockLicenseplate)).rejects.toThrowError(NotFoundError);
  });

  it('should throw error if any error occurs during car recovery', async () => {
    const mockLicenseplate = 'abc123';

   
    database.query.mockRejectedValueOnce(new Error('Error recovering the car'));

    await expect(recoveryCarService(mockLicenseplate)).rejects.toThrowError(/Error recovering the car/);
  });
});

import { startCarUtilizationService, endCarUtilizationService } from '../carUtilization/carUtilizationService.js';
import { database } from '../../database/database.js';
import { DriverAlreadyUsingError } from '../../error/appError.js';

jest.mock('../../database/database');

describe('startCarUtilizationService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('must initiate the use of a car by a driver', async () => {
    const data = { driverId: 1, carId: 2, reasonForUse: 'Trabalho' };

    const mockQueryResponse = {
      rows: [{ id: 1, driverid: 1, carid: 2, reasonforuse: 'Trabalho', initialdate: new Date() }],
    };

    database.query.mockResolvedValueOnce(mockQueryResponse);

    const result = await startCarUtilizationService(data);

    const expectedQuery = 'INSERT INTO carutilization (driverid, carid, reasonforuse, initialdate) VALUES ($1, $2, $3, current_timestamp) RETURNING *;';
    const expectedValues = [1, 2, 'Trabalho'];
    expect(database.query).toHaveBeenCalledWith(expectedQuery, expectedValues);

    expect(result).toEqual(mockQueryResponse.rows[0]);
  });

  it('should throw an error if the driver is already using another car', async () => {
    const mockExistingUtilization = {
      rows: [{
        id: 1,
        driverid: 1,
        carid: 1,
        reasonforuse: 'Trabalho',
        initialdate: new Date(),
      }],
    };
    database.query.mockResolvedValueOnce(mockExistingUtilization);


    const data = { driverId: 1, carId: 2, reasonForUse: 'Trabalho' };
    let error;

    try {
      await startCarUtilizationService(data);
    } catch (err) {
      error = err;
    }

    expect(error).toBeInstanceOf(Error);
    await expect(error.message).toBe("The driver is already using another car");
  });
});


describe('endCarUtilizationService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('must terminate the use of a car by a driver', async () => {
    const driverId = 1;

    const mockQueryResponse = {
      rows: [{ id: 1, driverid: 1, carid: 2, reasonforuse: 'Trabalho', initialdate: new Date(), enddate: new Date() }],
    };

    database.query.mockResolvedValueOnce(mockQueryResponse);

    const result = await endCarUtilizationService(driverId);

    const expectedQuery = 'UPDATE carutilization SET enddate = current_timestamp WHERE driverid = $1 AND enddate IS NULL RETURNING *;';
    const expectedValues = [1];
    expect(database.query).toHaveBeenCalledWith(expectedQuery, expectedValues);

    expect(result).toEqual(mockQueryResponse.rows[0]);
  });

  it('should throw an error if the driver is not using any car', async () => {
    const driverId = 1;

    const mockNoUtilization = { rows: [] };
    database.query.mockResolvedValueOnce(mockNoUtilization);

    await expect(endCarUtilizationService(driverId)).rejects.toThrowError('The driver is not using any car at the moment');
  });
});

import { recoveryDriverService } from './recoveryDriverService.js';
import { database } from '../../database/database.js';
import { NotFoundError } from '../../error/appError.js';

jest.mock('../../database/database.js');

describe('recoveryDriverService', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('must recover a deleted driver', async () => {
        const mockCnh = 'abc123';
        const mockDeletedDriver = { id: 1, name: 'john doe', cnh: 'abc123', deleted: true };


        database.query
            .mockResolvedValueOnce({ rows: [mockDeletedDriver] })
            .mockResolvedValueOnce({});

        const result = await recoveryDriverService(mockCnh);

        expect(database.query).toHaveBeenCalledWith(
            "SELECT id, name, cnh FROM drivers WHERE cnh = $1 AND deleted = true;",
            [mockCnh]
        );
        expect(database.query).toHaveBeenCalledWith(
            "UPDATE drivers SET deleted = false WHERE cnh = $1;",
            [mockDeletedDriver.cnh]
        );

        expect(database.query).toHaveBeenCalledTimes(2);

        expect(result).toEqual(mockDeletedDriver);
    });

    it('should throw NotFoundError if no deleted drivers are found', async () => {
        const mockCnh = 'xyz789';

        const mockNoDeletedDriver = { rows: [] };
        database.query.mockResolvedValueOnce(mockNoDeletedDriver);

        await expect(recoveryDriverService(mockCnh)).rejects.toThrowError(NotFoundError);
    });
});

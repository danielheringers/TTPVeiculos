import { recoveryDriverService } from './recoveryDriverService.js';
import { database } from '../../database/database.js';
import { NotFoundError } from '../../error/appError.js';

jest.mock('../../database/database.js');

describe('recoveryDriverService', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('deve recuperar um motorista deletado', async () => {
        const mockCnh = 'ABC123';

        const mockDeletedDriver = {
            rows: [{ id: 1, name: 'John Doe', cnh: 'ABC123', deleted: true }],
        };

        const mockQueryResponse = {
            rows: [{ id: 1, name: 'John Doe', cnh: 'ABC123', deleted: false }],
        };

        database.query
            .mockResolvedValueOnce(mockDeletedDriver)
            .mockResolvedValueOnce({}); 

        const result = await recoveryDriverService(mockCnh);

        const expectedQueryDeletedDriver = 'SELECT id, name, cnh FROM drivers WHERE cnh = $1 AND deleted = true;';
        const expectedValuesDeletedDriver = [mockCnh];
        expect(database.query).toHaveBeenCalledWith(expectedQueryDeletedDriver, expectedValuesDeletedDriver);

        const expectedQueryRecovery = 'UPDATE drivers SET deleted = false WHERE ID = $1;';
        const expectedValuesRecovery = [mockDeletedDriver.rows[0].id];
        expect(database.query).toHaveBeenCalledWith(expectedQueryRecovery, expectedValuesRecovery);

        expect(result).toEqual(mockQueryResponse.rows);
    });

    it('deve lançar NotFoundError se nenhum motorista deletado for encontrado', async () => {
        const mockCnh = 'XYZ789';

        const mockNoDeletedDriver = { rows: [] };
        database.query.mockResolvedValueOnce(mockNoDeletedDriver);

        await expect(recoveryDriverService(mockCnh)).rejects.toThrowError(NotFoundError);
    });
});

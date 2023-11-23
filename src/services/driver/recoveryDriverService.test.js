import { recoveryDriverService } from './recoveryDriverService.js';
import { database } from '../../database/database.js';
import { NotFoundError } from '../../error/appError.js';

Mock para simular o comportamento do banco de dados
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

        Configuração do mock para simular as respostas do banco de dados
        database.query
            .mockResolvedValueOnce(mockDeletedDriver) Primeira chamada para SELECT
            .mockResolvedValueOnce({}); Segunda chamada para UPDATE

        Chama a função de serviço
        const result = await recoveryDriverService(mockCnh);

        Verifica se a função de consulta foi chamada com os parâmetros corretos para encontrar o motorista deletado
        const expectedQueryDeletedDriver = 'SELECT id, name, cnh FROM drivers WHERE cnh = $1 AND deleted = true;';
        const expectedValuesDeletedDriver = [mockCnh];
        expect(database.query).toHaveBeenCalledWith(expectedQueryDeletedDriver, expectedValuesDeletedDriver);

        Verifica se a função de consulta foi chamada com os parâmetros corretos para recuperar o motorista
        const expectedQueryRecovery = 'UPDATE drivers SET deleted = false WHERE ID = $1;';
        const expectedValuesRecovery = [mockDeletedDriver.rows[0].id];
        expect(database.query).toHaveBeenCalledWith(expectedQueryRecovery, expectedValuesRecovery);

        Verifica se o resultado da função é o esperado
        expect(result).toEqual(mockQueryResponse.rows);
    });

    it('deve lançar NotFoundError se nenhum motorista deletado for encontrado', async () => {
        const mockCnh = 'XYZ789';

        const mockNoDeletedDriver = { rows: [] };
        database.query.mockResolvedValueOnce(mockNoDeletedDriver);

        Chama a função de serviço e verifica se ela lança o erro esperado
        await expect(recoveryDriverService(mockCnh)).rejects.toThrowError(NotFoundError);
    });
});

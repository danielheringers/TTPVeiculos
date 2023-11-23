import { recoveryDriverService } from './recoveryDriverService.js';
import { database } from '../../database/database.js';
import { NotFoundError } from '../../error/appError.js';

// Mock para simular o comportamento do banco de dados
jest.mock('../../database/database.js');

describe('recoveryDriverService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('deve recuperar um motorista deletado', async () => {
    // Mock dos dados de entrada
    const mockCnh = 'ABC123';

    // Mock da resposta do banco de dados para um motorista deletado
    const mockDeletedDriver = {
      rows: [{ id: 1, name: 'John Doe', cnh: 'ABC123', deleted: true }],
    };

    // Mock da resposta do banco de dados após a recuperação
    const mockQueryResponse = {
      rows: [{ id: 1, name: 'John Doe', cnh: 'ABC123', deleted: false }],
    };

    // Configuração do mock para simular as respostas do banco de dados
    database.query.mockResolvedValueOnce(mockDeletedDriver);
    database.query.mockResolvedValueOnce(mockQueryResponse);

    // Chama a função de serviço
    const result = await recoveryDriverService(mockCnh);

    // Verifica se a função de consulta foi chamada com os parâmetros corretos para encontrar o motorista deletado
    const expectedQueryDeletedDriver = 'SELECT id, name, cnh FROM drivers WHERE cnh = $1 AND deleted = true;';
    const expectedValuesDeletedDriver = [mockCnh];
    expect(database.query).toHaveBeenCalledWith(expectedQueryDeletedDriver, expectedValuesDeletedDriver);

    // Verifica se a função de consulta foi chamada com os parâmetros corretos para recuperar o motorista
    const expectedQueryRecovery = 'UPDATE drivers SET deleted = false WHERE ID = $1;';
    const expectedValuesRecovery = [mockDeletedDriver.rows[0].id];
    expect(database.query).toHaveBeenCalledWith(expectedQueryRecovery, expectedValuesRecovery);

    // Verifica se o resultado da função é o esperado
    expect(result).toEqual(mockQueryResponse.rows);
  });

  it('deve lançar um erro se nenhum motorista deletado for encontrado', async () => {
    // Mock dos dados de entrada
    const mockCnh = 'XYZ789';

    // Mock da resposta do banco de dados indicando nenhum motorista deletado encontrado
    const mockNoDeletedDriver = { rows: [] };
    database.query.mockResolvedValueOnce(mockNoDeletedDriver);

    // Chama a função de serviço e verifica se ela lança o erro esperado
    await expect(recoveryDriverService(mockCnh)).rejects.toThrowError(NotFoundError);
  });
});

import { listDriverService } from './listDriverService';
import { database } from '../../database/database.js';
import { NotFoundError } from '../../error/appError.js';

// Mock para simular o comportamento do banco de dados
jest.mock('../../database/database.js');

describe('listDriverService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('deve listar todos os motoristas', async () => {
    // Mock da resposta do banco de dados
    const mockQueryResponse = {
      rows: [
        { id: 1, name: 'John Doe', cnh: 'ABC123' },
        { id: 2, name: 'Jane Doe', cnh: 'DEF456' },
        // Adicione mais linhas conforme necessário
      ],
    };

    // Configuração do mock para simular a resposta do banco de dados
    database.query.mockResolvedValueOnce(mockQueryResponse);

    // Chama a função de serviço
    const result = await listDriverService();

    // Verifica se a função de consulta foi chamada com os parâmetros corretos
    const expectedQuery = 'SELECT id, name, cnh FROM drivers WHERE deleted = false;';
    expect(database.query).toHaveBeenCalledWith(expectedQuery);

    // Verifica se o resultado da função é o esperado
    expect(result).toEqual(mockQueryResponse.rows);
  });

  it('deve listar um motorista específico', async () => {
    // Mock dos dados de entrada
    const filter = 'John Doe';

    // Mock da resposta do banco de dados para um motorista específico
    const mockQueryResponseDriver = {
      rows: [{ id: 1, name: 'John Doe', cnh: 'ABC123' }],
    };

    // Configuração do mock para simular a resposta do banco de dados
    database.query.mockResolvedValueOnce(mockQueryResponseDriver);

    // Chama a função de serviço
    const result = await listDriverService(filter);

    // Verifica se a função de consulta foi chamada com os parâmetros corretos
    const expectedQueryDriver = 'SELECT id, name, cnh FROM drivers WHERE name = $1 AND deleted = false;';
    const expectedValuesDriver = [filter];
    expect(database.query).toHaveBeenCalledWith(expectedQueryDriver, expectedValuesDriver);

    // Verifica se o resultado da função é o esperado
    expect(result).toEqual(mockQueryResponseDriver.rows[0]);
  });

  it('deve lançar um erro se nenhum motorista for encontrado', async () => {
    // Mock da resposta do banco de dados indicando nenhum motorista encontrado
    const mockNoDriver = { rows: [] };
    database.query.mockResolvedValueOnce(mockNoDriver);

    // Chama a função de serviço e verifica se ela lança o erro esperado
    await expect(listDriverService()).rejects.toThrowError(NotFoundError);
  });
});

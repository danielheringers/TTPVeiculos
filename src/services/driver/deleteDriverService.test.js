import { deleteDriverService } from './deleteDriverService.js';
import { database } from '../../database/database.js';

Mock para simular o comportamento do banco de dados
jest.mock('../../database/database.js');

describe('deleteDriverService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('deve excluir um motorista com sucesso', async () => {
    Mock dos dados de entrada
    const data = 'ABC123';

    Mock da resposta do banco de dados
    const mockQueryResponse = {
      rowCount: 1,
    };

    Configuração do mock para simular a resposta do banco de dados
    database.query.mockResolvedValueOnce(mockQueryResponse);

    Chama a função de serviço
    const result = await deleteDriverService(data);

    Verifica se a função de consulta foi chamada com os parâmetros corretos
    const expectedQuery = 'UPDATE drivers SET deleted = true WHERE cnh = $1;';
    const expectedValues = [data];
    expect(database.query).toHaveBeenCalledWith(expectedQuery, expectedValues);

    Verifica se o resultado da função é o esperado
    expect(result).toEqual(mockQueryResponse);
  });

  it('deve lançar um erro se a exclusão falhar', async () => {
    Mock dos dados de entrada
    const data = 'ABC123';

    Configuração do mock para simular um erro durante a exclusão
    const error = new Error('Erro durante a exclusão');
    database.query.mockRejectedValueOnce(error);

    Chama a função de serviço e verifica se ela lança o erro esperado
    await expect(deleteDriverService(data)).rejects.toThrowError(error);
  });
});

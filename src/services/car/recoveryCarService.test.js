import { recoveryCarService } from '../car/recoveryCarService.js';
import { database } from '../../database/database.js';
import { NotFoundError } from '../../error/appError.js';

jest.mock('../../database/database');

describe('recoveryCarService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('deve recuperar um carro marcado como deletado no banco de dados', async () => {
    const mockLicenseplate = 'ABC123';
    const mockDeletedCar = { id: 1, licenseplate: 'ABC123', color: 'Red', brand: 'Toyota' };

    Configuração do mock para simular uma resposta do banco de dados
    database.query
      .mockResolvedValueOnce({ rows: [mockDeletedCar] }) Simular um carro deletado
      .mockResolvedValueOnce({}); Simular uma resposta vazia do banco de dados para a atualização

    const result = await recoveryCarService(mockLicenseplate);

    Verifique se a função de consulta foi chamada com os parâmetros corretos
    expect(database.query).toHaveBeenCalledWith(
      'SELECT id, licenseplate, color, brand FROM cars WHERE licenseplate = $1 AND deleted = true;',
      [mockLicenseplate]
    );

    expect(database.query).toHaveBeenCalledWith(
      'UPDATE cars SET deleted = false WHERE ID = $1;',
      [mockDeletedCar.id]
    );

    Verifique se a função de consulta foi chamada duas vezes
    expect(database.query).toHaveBeenCalledTimes(2);

    Verifique se o resultado da função é o esperado
    expect(result).toEqual(mockDeletedCar);
  });

  it('deve lançar NotFoundError se nenhum veículo deletado for encontrado', async () => {
    const mockLicenseplate = 'ABC123';

    Configuração do mock para simular uma resposta vazia do banco de dados
    database.query.mockResolvedValueOnce({ rows: [] });

    Modifique para tratar o erro de maneira mais flexível
    await expect(recoveryCarService(mockLicenseplate)).rejects.toThrowError(NotFoundError);
  });

  it('deve lançar erro se ocorrer algum erro durante a recuperação do carro', async () => {
    const mockLicenseplate = 'ABC123';

    Configuração do mock para simular um erro no banco de dados
    database.query.mockRejectedValueOnce(new Error('Erro ao recuperar o carro'));

    Modifique para tratar o erro de maneira mais flexível
    await expect(recoveryCarService(mockLicenseplate)).rejects.toThrowError(/Erro ao recuperar o carro/);
  });
});

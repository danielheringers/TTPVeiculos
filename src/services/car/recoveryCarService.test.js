import { recoveryCarService } from '../car/recoveryCarService.js';
import { database } from '../../database/database.js';

jest.mock('../../database/database');

describe('recoveryCarService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('deve recuperar um carro marcado como deletado no banco de dados', async () => {
    const mockLicenseplate = 'ABC123';
    const mockDeletedCar = { id: 1, licenseplate: 'ABC123', color: 'Red', brand: 'Toyota' };

    // Configuração do mock para simular uma resposta do banco de dados
    database.query
      .mockResolvedValueOnce({ rows: [mockDeletedCar] }) // Simular um carro deletado
      .mockResolvedValueOnce(/* Simular uma resposta do banco de dados aqui */); // Simular a atualização

    const result = await recoveryCarService(mockLicenseplate);

    // Verifique se a função de consulta foi chamada com os parâmetros corretos
    expect(database.query).toHaveBeenCalledWith(
      'SELECT id, licenseplate, color, brand FROM cars WHERE licenseplate = $1 AND deleted = true;',
      [mockLicenseplate]
    );

    expect(database.query).toHaveBeenCalledWith(
      'UPDATE cars SET deleted = false WHERE ID = $1;',
      [mockDeletedCar.id]
    );

    // Verifique se a função de consulta foi chamada duas vezes
    expect(database.query).toHaveBeenCalledTimes(2);
  });

  it('deve lançar NotFoundError se nenhum veículo deletado for encontrado', async () => {
    const mockLicenseplate = 'ABC123';

    // Configuração do mock para simular uma resposta vazia do banco de dados
    database.query.mockResolvedValueOnce([]);

    // Modifique para tratar o erro de maneira mais flexível
    await expect(recoveryCarService(mockLicenseplate)).rejects.toThrowError(/Nenhum veículo encontrado/);
  });

  it('deve lançar erro se ocorrer algum erro durante a recuperação do carro', async () => {
    const mockLicenseplate = 'ABC123';

    // Configuração do mock para simular um erro no banco de dados
    database.query.mockRejectedValueOnce(new Error('Erro ao recuperar o carro'));

    // Modifique para tratar o erro de maneira mais flexível
    await expect(recoveryCarService(mockLicenseplate)).rejects.toThrowError(/Erro ao recuperar o carro/);
  });
});

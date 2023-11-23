// Importe a função que você deseja testar
import { listCarsService } from '../car/listCarsService.js';
import { database } from '../../database/database.js';
import { NotFoundError } from '../../error/appError.js';

// Mock para simular o comportamento do banco de dados
jest.mock('../../database/database');

describe('listCarsService', () => {
  // Limpa os mocks antes de cada teste
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('deve retornar todos os carros quando não há filtros', async () => {
    // Configuração do mock para simular uma resposta do banco de dados
    database.query.mockResolvedValueOnce({ rows: [{ id: 1, licenseplate: 'ABC123', color: 'Red', brand: 'Toyota' }] });

    const result = await listCarsService();

    expect(result).toEqual([{ id: 1, licenseplate: 'ABC123', color: 'Red', brand: 'Toyota' }]);
  });

  it('deve lançar NotFoundError quando nenhum veículo é encontrado sem filtros', async () => {
    // Configuração do mock para simular uma resposta vazia do banco de dados
    database.query.mockResolvedValueOnce({ rows: [] });

    await expect(listCarsService()).rejects.toThrow(NotFoundError);
  });

  // Adicione mais testes para os outros casos da sua função listCarsService
});

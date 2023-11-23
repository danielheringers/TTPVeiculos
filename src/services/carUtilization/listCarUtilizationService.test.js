import { listCarUtilizationService } from '../carUtilization/listCarUtilizationService.js';
import { database } from '../../database/database.js';
import { NotFoundError } from '../../error/appError.js';

// Mock para simular o comportamento do banco de dados
jest.mock('../../database/database');

describe('listCarUtilizationService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('deve listar as utilizações de carro', async () => {
    // Mock da resposta do banco de dados
    const mockQueryResponse = {
      rows: [
        {
          id: 1,
          initialdate: new Date(),
          enddate: null,
          reasonforuse: 'Trabalho',
          car_licenseplate: 'ABC123',
          car_color: 'Red',
          car_brand: 'Toyota',
          driver_name: 'John Doe',
        },
        // Adicione mais linhas conforme necessário
      ],
    };

    // Configuração do mock para simular a resposta do banco de dados
    database.query.mockResolvedValueOnce(mockQueryResponse);

    // Chama a função de serviço
    const result = await listCarUtilizationService();

    // Verifica se a função de consulta foi chamada com os parâmetros corretos
    const expectedQuery = "SELECT cut.id, initialdate, enddate, reasonforuse, c.licenseplate AS car_licenseplate, c.color AS car_color, c.brand AS car_brand, d.name AS driver_name FROM carutilization cut JOIN cars c ON cut.carid = c.id JOIN drivers d ON cut.driverid = d.id;";

    const expectedQueryWithoutSpaces = expectedQuery.replace(/\s+/g, ' ').trim();

    expect(database.query).toHaveBeenCalledWith(expectedQueryWithoutSpaces);

    // Verifica se o resultado da função é o esperado
    expect(result).toEqual(mockQueryResponse.rows);
  });

  it('deve lançar um erro se nenhuma utilização de carro for encontrada', async () => {
    // Mock da resposta do banco de dados indicando nenhuma utilização existente
    const mockNoUtilization = { rows: [] };
    database.query.mockResolvedValueOnce(mockNoUtilization);

    // Chama a função de serviço e verifica se ela lança o erro esperado
    await expect(listCarUtilizationService()).rejects.toThrowError(NotFoundError);
  });
});

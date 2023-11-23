import { listCarUtilizationService } from '../carUtilization/listCarUtilizationService.js';
import { database } from '../../database/database.js';
import { NotFoundError } from '../../error/appError.js';

jest.mock('../../database/database');

describe('listCarUtilizationService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('deve listar as utilizações de carro', async () => {
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
      ],
    };

    database.query.mockResolvedValueOnce(mockQueryResponse);

    const result = await listCarUtilizationService();

    const expectedQuery = "SELECT cut.id, initialdate, enddate, reasonforuse, c.licenseplate AS car_licenseplate, c.color AS car_color, c.brand AS car_brand, d.name AS driver_name FROM carutilization cut JOIN cars c ON cut.carid = c.id JOIN drivers d ON cut.driverid = d.id;";

    const expectedQueryWithoutSpaces = expectedQuery.replace(/\s+/g, ' ').trim();

    expect(database.query).toHaveBeenCalledWith(expectedQueryWithoutSpaces);

    expect(result).toEqual(mockQueryResponse.rows);
  });

  it('deve lançar um erro se nenhuma utilização de carro for encontrada', async () => {
    const mockNoUtilization = { rows: [] };
    database.query.mockResolvedValueOnce(mockNoUtilization);

    await expect(listCarUtilizationService()).rejects.toThrowError(NotFoundError);
  });
});

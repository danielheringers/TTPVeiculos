
import { listCarsService } from '../car/listCarsService.js';
import { database } from '../../database/database.js';
import { NotFoundError } from '../../error/appError.js';


jest.mock('../../database/database');

describe('listCarsService', () => {

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('deve retornar todos os carros quando não há filtros', async () => {
    
    database.query.mockResolvedValueOnce({ rows: [{ id: 1, licenseplate: 'ABC123', color: 'Red', brand: 'Toyota' }] });

    const result = await listCarsService();

    expect(result).toEqual([{ id: 1, licenseplate: 'ABC123', color: 'Red', brand: 'Toyota' }]);
  });

  it('deve lançar NotFoundError quando nenhum veículo é encontrado sem filtros', async () => {
    database.query.mockResolvedValueOnce({ rows: [] });

    await expect(listCarsService()).rejects.toThrow(NotFoundError);
  });

});

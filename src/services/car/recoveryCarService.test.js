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


    database.query
      .mockResolvedValueOnce({ rows: [mockDeletedCar] }) 
      .mockResolvedValueOnce({}); 

    const result = await recoveryCarService(mockLicenseplate);


    expect(database.query).toHaveBeenCalledWith(
      'SELECT id, licenseplate, color, brand FROM cars WHERE licenseplate = $1 AND deleted = true;',
      [mockLicenseplate]
    );

    expect(database.query).toHaveBeenCalledWith(
      'UPDATE cars SET deleted = false WHERE ID = $1;',
      [mockDeletedCar.id]
    );

    expect(database.query).toHaveBeenCalledTimes(2);


    expect(result).toEqual(mockDeletedCar);
  });

  it('deve lançar NotFoundError se nenhum veículo deletado for encontrado', async () => {
    const mockLicenseplate = 'ABC123';

    database.query.mockResolvedValueOnce({ rows: [] });


    await expect(recoveryCarService(mockLicenseplate)).rejects.toThrowError(NotFoundError);
  });

  it('deve lançar erro se ocorrer algum erro durante a recuperação do carro', async () => {
    const mockLicenseplate = 'ABC123';

   
    database.query.mockRejectedValueOnce(new Error('Erro ao recuperar o carro'));

    await expect(recoveryCarService(mockLicenseplate)).rejects.toThrowError(/Erro ao recuperar o carro/);
  });
});

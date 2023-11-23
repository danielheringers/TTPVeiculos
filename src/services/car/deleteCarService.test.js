import { deleteCarService } from '../car/deleteCarService.js';
import { database } from '../../database/database.js';

jest.mock('../../database/database');

describe('deleteCarService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('deve marcar o carro como deletado no banco de dados', async () => {
    const mockLicenseplate = 'ABC123';


    database.query.mockResolvedValueOnce();

    const result = await deleteCarService(mockLicenseplate);


    expect(database.query).toHaveBeenCalledWith(
      'UPDATE cars SET deleted = true WHERE licenseplate = $1;',
      [mockLicenseplate]
    );


    expect(database.query).toHaveBeenCalledTimes(1);
  });

  it('deve lançar erro se ocorrer algum erro durante a exclusão do carro', async () => {
    const mockLicenseplate = 'ABC123';


    database.query.mockRejectedValueOnce(new Error('Erro ao deletar o carro'));

    await expect(deleteCarService(mockLicenseplate)).rejects.toThrowError('Erro ao deletar o carro');
  });
});

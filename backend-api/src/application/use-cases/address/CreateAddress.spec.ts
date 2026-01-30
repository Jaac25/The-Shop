import type { AddressRepository } from 'src/domain/ports/address.repository';
import { CreateAddress } from './CreateAddress';

describe('CreateAddress', () => {
  let useCase: CreateAddress;
  let repo: jest.Mocked<AddressRepository>;

  beforeEach(() => {
    repo = {
      create: jest.fn(),
    };

    useCase = new CreateAddress(repo);
  });

  it('should throw error if address is missing', async () => {
    await expect(useCase.execute({ address: '' })).rejects.toThrow(
      'Missing or wrong address',
    );

    expect(repo.create).not.toHaveBeenCalled();
  });

  it('should propagate repository error', async () => {
    repo.create.mockRejectedValueOnce(new Error('DB error'));

    await expect(useCase.execute({ address: 'Calle 123' })).rejects.toThrow(
      'DB error',
    );
  });
});

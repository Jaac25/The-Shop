import type { AddressRepository } from 'src/domain/ports/address.repository';
import { CreateOrder } from './CreateOrder';
import { UserRepository } from 'src/domain/ports/user.repository';
import { OrderRepository } from 'src/domain/ports/order.repository';

describe('CreateOrder', () => {
  let useCase: CreateOrder;
  let repo: jest.Mocked<OrderRepository>;
  let userRepo: jest.Mocked<UserRepository>;
  let address: jest.Mocked<AddressRepository>;

  beforeEach(() => {
    repo = {
      create: jest.fn(),
    };
    userRepo = {
      create: jest.fn(),
    };
    address = {
      create: jest.fn(),
    };

    useCase = new CreateOrder(repo, userRepo, address);
  });

  it('should throw error if missing idProduct', async () => {
    await expect(
      useCase.execute({
        idProduct: '',
        address: 'asdasd',
        email: 'asdasd',
        name: 'asdasd',
      }),
    ).rejects.toThrow('Missing or wrong idProduct');

    expect(repo.create).not.toHaveBeenCalled();
  });

  it('should create order successfully', async () => {
    userRepo.create.mockResolvedValue({ id: '2' });
    address.create.mockResolvedValue({ id: '1' });
    repo.create.mockResolvedValue({ id: '1' });

    const result = await useCase.execute({
      name: 'Alex',
      email: 'alex@mail.com',
      address: 'Calle 123',
      idProduct: '123',
    });

    expect(userRepo.create).toHaveBeenCalledWith({
      name: 'Alex',
      email: 'alex@mail.com',
    });

    expect(address.create).toHaveBeenCalledWith({
      address: 'Calle 123',
    });

    expect(repo.create).toHaveBeenCalledWith({
      idProduct: '123',
      idUser: '2',
      idAddress: '1',
    });

    expect(result).toEqual({ id: '1' });
  });
  it('should throw error if user id is missing', async () => {
    userRepo.create.mockResolvedValue({ id: '' });

    await expect(
      useCase.execute({
        name: 'Alex',
        email: 'alex@mail.com',
        address: 'Calle 123',
        idProduct: '123',
      }),
    ).rejects.toThrow('Missing or wrong idUser');

    expect(address.create).not.toHaveBeenCalled();
    expect(repo.create).not.toHaveBeenCalled();
  });

  it('should throw error if address id is missing', async () => {
    userRepo.create.mockResolvedValue({ id: '1' });
    address.create.mockResolvedValue({ id: '' });

    await expect(
      useCase.execute({
        name: 'Alex',
        email: 'alex@mail.com',
        address: 'Calle 123',
        idProduct: '123',
      }),
    ).rejects.toThrow('Missing or wrong idAddress');

    expect(repo.create).not.toHaveBeenCalled();
  });

  it('should throw error if order id is missing', async () => {
    userRepo.create.mockResolvedValue({ id: '1' });
    address.create.mockResolvedValue({ id: '1' });
    repo.create.mockResolvedValue({ id: '' });

    await expect(
      useCase.execute({
        name: 'Alex',
        email: 'alex@mail.com',
        address: 'Calle 123',
        idProduct: '123',
      }),
    ).rejects.toThrow('Error creating order');
  });
});

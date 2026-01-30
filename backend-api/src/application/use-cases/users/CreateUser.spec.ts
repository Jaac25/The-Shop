import { UserRepository } from 'src/domain/ports/user.repository';
import { CreateUser } from './CreateUser';

describe('CreateUser', () => {
  let useCase: CreateUser;
  let userRepo: jest.Mocked<UserRepository>;

  beforeEach(() => {
    userRepo = {
      create: jest.fn(),
    };

    useCase = new CreateUser(userRepo);
  });

  it('should throw error if email is missing', async () => {
    await expect(useCase.execute({ email: '', name: 'Alex' })).rejects.toThrow(
      'Missing or wrong email',
    );
  });

  it('should throw error if email format is invalid', async () => {
    await expect(
      useCase.execute({ email: 'invalid-email', name: 'Alex' }),
    ).rejects.toThrow('Missing or wrong email');
  });

  it('should throw error if name is missing', async () => {
    await expect(
      useCase.execute({ email: 'test@test.com', name: '' }),
    ).rejects.toThrow('Missing or wrong name');
  });

  it('should call repository create with correct data', async () => {
    await useCase.execute({
      email: 'test@test.com',
      name: 'Alex',
    });

    expect(userRepo.create).toHaveBeenCalledWith({
      email: 'test@test.com',
      name: 'Alex',
    });
  });

  it('should not return anything (void)', async () => {
    const result = await useCase.execute({
      email: 'test@test.com',
      name: 'Alex',
    });

    expect(result).toBeUndefined();
  });
});

import { BadRequestException } from '@nestjs/common';
import { UserController } from './user.controller';
import { CreateUser } from 'src/application/use-cases/users/CreateUser';

describe('UserController', () => {
  let controller: UserController;
  let createUser: jest.Mocked<CreateUser>;

  beforeEach(() => {
    createUser = {
      execute: jest.fn().mockName('execute'),
      repo: { create: jest.fn() },
    } as unknown as jest.Mocked<CreateUser>;

    controller = new UserController(createUser);
  });

  describe('create', () => {
    it('should create a user successfully', async () => {
      createUser.execute.mockResolvedValueOnce(undefined);

      const body = {
        email: 'test@example.com',
        name: 'Test User',
      };

      const result = await controller.create(body);
      const executeSpy = jest.spyOn(createUser, 'execute');

      expect(executeSpy).toHaveBeenCalledWith({
        email: 'test@example.com',
        name: 'Test User',
      });

      expect(result).toEqual({
        message: 'User created successfully',
      });
    });

    it('should use empty strings when body fields are missing', async () => {
      createUser.execute.mockResolvedValueOnce(undefined);

      await controller.create({});

      const executeSpy = jest.spyOn(createUser, 'execute');

      expect(executeSpy).toHaveBeenCalledWith({
        email: '',
        name: '',
      });
    });

    it('should throw BadRequestException when createUser throws an error', async () => {
      createUser.execute.mockRejectedValueOnce(
        new Error('Email already exists'),
      );

      await expect(
        controller.create({
          email: 'test@example.com',
          name: 'Test User',
        }),
      ).rejects.toThrow(BadRequestException);
    });

    it('should throw BadRequestException with default message for non-Error throws', async () => {
      createUser.execute.mockRejectedValueOnce('some error');

      await expect(
        controller.create({
          email: 'test@example.com',
          name: 'Test User',
        }),
      ).rejects.toThrow('Error creating user');
    });
  });
});

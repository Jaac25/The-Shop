import { CreateAddress } from 'src/application/use-cases/address/CreateAddress';
import { AddressController } from './address.controller';
import { BadRequestException } from '@nestjs/common';

describe('AddressController', () => {
  let controller: AddressController;
  let createAddress: jest.Mocked<CreateAddress>;

  beforeEach(() => {
    createAddress = {
      execute: jest.fn().mockName('execute'),
      repo: { create: jest.fn() },
    } as unknown as jest.Mocked<CreateAddress>;

    controller = new AddressController(createAddress);
  });

  describe('create', () => {
    it('should create a address successfully', async () => {
      createAddress.execute.mockResolvedValueOnce(undefined);

      const result = await controller.create({ address: 'cra 11' });
      const executeSpy = jest.spyOn(createAddress, 'execute');

      expect(executeSpy).toHaveBeenCalledWith({
        address: 'cra 11',
      });

      expect(result).toEqual({
        message: 'Address created successfully',
      });
    });

    it('should use empty strings when body fields are missing', async () => {
      createAddress.execute.mockResolvedValueOnce(undefined);

      await controller.create({});

      const executeSpy = jest.spyOn(createAddress, 'execute');

      expect(executeSpy).toHaveBeenCalledWith({
        address: '',
      });
    });
    it('should throw BadRequestException when createAddress throws an Error', async () => {
      createAddress.execute.mockRejectedValueOnce(new Error('Invalid address'));

      await expect(
        controller.create({ address: 'Fake address' }),
      ).rejects.toThrow(BadRequestException);
    });

    it('should throw BadRequestException with default message when non-Error is thrown', async () => {
      createAddress.execute.mockRejectedValueOnce('some error');

      await expect(
        controller.create({ address: 'Fake address' }),
      ).rejects.toThrow('Error creating address');
    });
  });
});

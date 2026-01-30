jest.mock('uuid', () => ({
  v4: jest.fn(() => 'uuid-mock'),
}));

import { Test, TestingModule } from '@nestjs/testing';
import { BadRequestException } from '@nestjs/common';
import { TransactionController } from './transaction.controller';
import { CreateTransaction } from 'src/application/use-cases/transactions/CreateTransaction';
import { FindTransaction } from 'src/application/use-cases/transactions/FindTransaction';
import { UpdateTransaction } from 'src/application/use-cases/transactions/UpdateTransaction';
import { ITransaction } from 'src/domain/entities/Transaction';

describe('TransactionController', () => {
  let controller: TransactionController;
  let createTransaction: jest.Mocked<CreateTransaction>;
  let findTransaction: jest.Mocked<FindTransaction>;
  let updateTransaction: jest.Mocked<UpdateTransaction>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TransactionController],
      providers: [
        {
          provide: CreateTransaction,
          useValue: { execute: jest.fn() },
        },
        {
          provide: FindTransaction,
          useValue: { execute: jest.fn() },
        },
        {
          provide: UpdateTransaction,
          useValue: { execute: jest.fn() },
        },
      ],
    }).compile();

    controller = module.get(TransactionController);
    createTransaction = module.get(CreateTransaction);
    findTransaction = module.get(FindTransaction);
    updateTransaction = module.get(UpdateTransaction);
  });

  describe('findAll', () => {
    it('should return transaction', async () => {
      const resultMock = { id: 'tx-1' } as unknown as ITransaction;

      findTransaction.execute.mockResolvedValue(resultMock);

      const result = await controller.findAll('wompi-id', 'prod-1');

      const executeSpy = jest.spyOn(findTransaction, 'execute');

      expect(executeSpy).toHaveBeenCalledWith({
        idTransactionWompi: 'wompi-id',
        idProduct: 'prod-1',
      });
      expect(result).toEqual(resultMock);
    });

    it('should throw BadRequestException with reason', async () => {
      findTransaction.execute.mockRejectedValue({
        response: {
          data: {
            error: { reason: 'Transaction not found' },
          },
        },
      });

      await expect(controller.findAll('1', '2')).rejects.toThrow(
        'Error getting transaction: Transaction not found',
      );
    });

    it('should throw BadRequestException with unknown error', async () => {
      findTransaction.execute.mockRejectedValue({});

      await expect(controller.findAll('1', '2')).rejects.toThrow(
        'Error getting transaction: Unknown error',
      );
    });
  });

  describe('create', () => {
    it('should create transaction', async () => {
      const transactionMock = { id: 'tx-123' } as unknown as ITransaction;

      const executeSpy = jest.spyOn(createTransaction, 'execute');

      createTransaction.execute.mockResolvedValue(transactionMock);

      const result = await controller.create({
        customerEmail: 'test@mail.com',
        idOrder: 1,
        amountInCents: 10000,
        token: 'tok_123',
      });

      expect(executeSpy).toHaveBeenCalledWith({
        customer_email: 'test@mail.com',
        idOrder: 1,
        amount_in_cents: 10000,
        token: 'tok_123',
      });

      expect(result).toEqual(transactionMock);
    });

    it('should throw BadRequestException with formatted messages', async () => {
      createTransaction.execute.mockRejectedValue({
        response: {
          data: {
            error: {
              messages: {
                token: ['invalid token'],
                amount: {
                  messages: {
                    min: 'too low',
                  },
                },
              },
            },
          },
        },
      });

      await expect(controller.create({})).rejects.toThrow(BadRequestException);
    });

    it('should throw BadRequestException with generic error', async () => {
      createTransaction.execute.mockRejectedValue({});

      await expect(controller.create({})).rejects.toThrow(
        'Error creating transaction',
      );
    });
  });

  describe('update', () => {
    it('should update transaction', async () => {
      updateTransaction.execute.mockResolvedValue(undefined);

      const executeSpy = jest.spyOn(updateTransaction, 'execute');

      const result = await controller.update({ id: 'tx-1' });

      expect(executeSpy).toHaveBeenCalledWith({
        id: 'tx-1',
      });
      expect(result).toEqual({
        message: 'Transaction updated successfully',
      });
    });

    it('should throw BadRequestException with formatted messages', async () => {
      updateTransaction.execute.mockRejectedValue({
        response: {
          data: {
            error: {
              messages: {
                status: {
                  messages: {
                    invalid: 'not allowed',
                  },
                },
              },
            },
          },
        },
      });

      await expect(controller.update({ id: 'tx-1' })).rejects.toThrow(
        BadRequestException,
      );
    });

    it('should throw BadRequestException with generic error', async () => {
      updateTransaction.execute.mockRejectedValue({});

      await expect(controller.update({ id: 'tx-1' })).rejects.toThrow(
        'Error updating transaction',
      );
    });
  });
});

jest.mock('uuid', () => ({
  v4: jest.fn(() => 'uuid-fixed'),
}));
import type { ITransaction } from 'src/domain/entities/Transaction';
import { MerchantService } from 'src/domain/ports/MerchantService.repository';
import type { TransactionRepository } from 'src/domain/ports/transaction.repository';
import { ITransactionWompi } from 'src/infraestructure/wompi/types/transactions';
import type { WompiService } from 'src/infraestructure/wompi/wompi-transaction.service';
import { CreateTransaction } from './CreateTransaction';

describe('CreateTransaction', () => {
  let useCase: CreateTransaction;
  let repo: jest.Mocked<TransactionRepository>;
  const wompiTransaction: jest.Mocked<WompiService> = {
    createTransaction: jest.fn(),
  } as unknown as jest.Mocked<WompiService>;
  const wompiMerchant: jest.Mocked<MerchantService> = {
    execute: jest.fn(),
  };
  const createTransactionSpy = jest.spyOn(
    wompiTransaction,
    'createTransaction',
  );

  beforeEach(() => {
    repo = {
      create: jest.fn(),
      update: jest.fn(),
      findOne: jest.fn(),
    };

    useCase = new CreateTransaction(repo, wompiTransaction, wompiMerchant);
  });

  it('should create transaction successfully', async () => {
    wompiMerchant.execute.mockResolvedValue('acceptance-token');

    wompiTransaction.createTransaction.mockResolvedValue({
      amount_in_cents: 200000,
      currency: 'COP',
      customer_email: '',
      payment_method: {
        type: 'CARD' as const,
        extra: {},
        phone_number: 'undefined',
      },
    } as ITransactionWompi);

    const savedTransaction: ITransaction = {
      idTransaction: 'local-tx',
      idTransactionWompi: 'wompi-tx',
      idOrder: 1,
      createdAt: new Date().toISOString(),
      amountInCents: 200000,
      reference: 'ref-123',
      customerEmail: '',
      status: 'PENDING',
    };

    repo.create.mockResolvedValue(savedTransaction);

    const result = await useCase.execute({
      amount_in_cents: 200000,
      customer_email: 'test@mail.com',
      idOrder: 1,
      token: 'card-token',
    });

    wompiMerchant.execute.mockResolvedValue('acceptance-token');

    expect(wompiMerchant.execute).toHaveBeenCalledTimes(1);

    expect(createTransactionSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        amount_in_cents: 200000,
        currency: 'COP',
        customer_email: 'test@mail.com',
      }),
      1,
    );

    expect(repo.create).toHaveBeenCalledTimes(1);
    expect(result).toBe(savedTransaction);
  });

  it('should throw error if amount_in_cents is invalid', async () => {
    await expect(
      useCase.execute({
        amount_in_cents: 0,
        customer_email: 'test@mail.com',
        idOrder: 1,
        token: 'card-token',
      }),
    ).rejects.toThrow('Missing or wrong amount_in_cents');
    expect(repo.create).not.toHaveBeenCalled();
  });

  it('should throw error if idOrder is missing', async () => {
    await expect(
      useCase.execute({
        amount_in_cents: 200000,
        customer_email: 'test@mail.com',
        token: 'card-token',
      }),
    ).rejects.toThrow('Missing or wrong idOrder');

    expect(repo.create).not.toHaveBeenCalled();
  });

  it('should throw error if wompi transaction fails', async () => {
    wompiMerchant.execute.mockResolvedValue('acceptance-token');
    wompiTransaction.createTransaction.mockResolvedValue(
      null as unknown as ITransactionWompi,
    );

    await expect(
      useCase.execute({
        amount_in_cents: 200000,
        customer_email: 'test@mail.com',
        idOrder: 1,
        token: 'card-token',
      }),
    ).rejects.toThrow('Not was possible paying');

    expect(repo.create).not.toHaveBeenCalled();
  });
});
